import asyncio
import json
import re

from fastapi import HTTPException

from app.core.gemini_client import (
    download_from_gcs,
    get_generative_model,
    parse_gcs_uri,
)
from app.schemas.analyze import InternalAnalyzeRequest, InternalAnalyzeResponse, RadarData

ANALYSIS_PROMPT_BASIC = """
당신은 미대 입시 전문 채점 AI입니다. 다음 기초디자인 작품을 분석하세요.

[채점 기준]
- 밀도 (density, 0-100): 오브젝트 수, 배치 균형, 공간 효율 (가중치 20%)
- 형태력 (form, 0-100): 투시, 비례, 구조 안정성 (가중치 25%)
- 완성도 (completion, 0-100): 마감, 디테일, 묘사력 (가중치 20%)
- 정합성 (relevance, 0-100): 문제 이해, 조건 충족 (가중치 20%)
- 사고력 (thinking, 0-100): 발상, 창의성 (가중치 15%)

[출력 형식] JSON만 반환:
{
  "density": 85, "form": 80, "completion": 78, "relevance": 88, "thinking": 79,
  "comment": "3~4문장 피드백"
}
"""

ANALYSIS_PROMPT_MAJOR = """
당신은 미대 입시 전문 채점 AI입니다. 다음 전공 작품을 심층 분석하세요.

[채점 기준]
- 밀도 (density, 0-100): 오브젝트 수, 배치 균형, 공간 효율 (가중치 20%)
- 형태력 (form, 0-100): 투시, 비례, 구조 안정성 (가중치 25%)
- 완성도 (completion, 0-100): 마감, 디테일, 묘사력 (가중치 20%)
- 정합성 (relevance, 0-100): 문제 이해, 조건 충족 (가중치 20%)
- 사고력 (thinking, 0-100): 발상, 창의성 (가중치 15%)

[출력 형식] JSON만 반환:
{
  "density": 85, "form": 80, "completion": 78, "relevance": 88, "thinking": 79,
  "comment": "5~6문장 심층 피드백"
}
"""

SCORE_FIELDS = ("density", "form", "completion", "relevance", "thinking")
WEIGHTS = {"density": 0.20, "form": 0.25, "completion": 0.20, "relevance": 0.20, "thinking": 0.15}


def calculate_total_score(scores: dict) -> float:
    return sum(scores[k] * w for k, w in WEIGHTS.items())


def calculate_grade(total_score: float) -> str:
    if total_score >= 90:
        return "A"
    if total_score >= 80:
        return "B"
    if total_score >= 70:
        return "C"
    if total_score >= 60:
        return "D"
    return "F"


def calculate_fix_scope(scores: dict) -> str:
    structure_score = scores["density"] * 0.3 + scores["form"] * 0.4 + scores["relevance"] * 0.3
    return "DetailTuning" if structure_score >= 70 else "StructureRebuild"


def parse_analysis_json(text: str) -> dict:
    """Gemini 응답 텍스트에서 JSON을 추출한다. ```json 코드블록 포함 처리."""
    json_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if json_match:
        raw = json_match.group(1)
    else:
        brace_match = re.search(r"\{.*\}", text, re.DOTALL)
        if brace_match:
            raw = brace_match.group(0)
        else:
            raise ValueError(f"Gemini 응답에서 JSON을 찾을 수 없습니다: {text[:200]}")

    try:
        result = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 실패: {e}") from e

    for field in (*SCORE_FIELDS, "comment"):
        if field not in result:
            raise ValueError(f"필수 필드 누락: {field}")

    return result


async def analyze_artwork(request: InternalAnalyzeRequest) -> InternalAnalyzeResponse:
    """GCS 이미지 → Gemini Vision 분석 → 5축 채점 결과 반환."""
    try:
        bucket_name, blob_path = parse_gcs_uri(request.gcs_uri)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        image_bytes, mime_type = await download_from_gcs(bucket_name, blob_path)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"GCS 이미지 로드 실패: {e}")

    prompt = ANALYSIS_PROMPT_MAJOR if request.analysis_type == "major" else ANALYSIS_PROMPT_BASIC
    if request.problem_text:
        prompt = f"[문제/맥락]\n{request.problem_text}\n\n{prompt}"

    try:
        from vertexai.generative_models import Part

        model = get_generative_model("gemini-2.5-pro-preview")

        def _call_gemini() -> str:
            response = model.generate_content([
                Part.from_bytes(image_bytes, mime_type=mime_type),
                prompt,
            ])
            return response.text

        response_text = await asyncio.to_thread(_call_gemini)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini Vision 호출 실패: {e}")

    try:
        result = parse_analysis_json(response_text)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"AI 응답 파싱 실패: {e}")

    total_score = calculate_total_score(result)
    grade = calculate_grade(total_score)
    fix_scope = calculate_fix_scope(result)

    return InternalAnalyzeResponse(
        grade=grade,
        total_score=round(total_score, 2),
        radar_data=RadarData(
            density=result["density"],
            form=result["form"],
            completion=result["completion"],
            relevance=result["relevance"],
            thinking=result["thinking"],
        ),
        fix_scope=fix_scope,
        comment=result["comment"],
        university_predictions=[],  # Phase 2: Theory Engine 연동
    )
