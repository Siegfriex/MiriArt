import asyncio
import base64
import json
import re
from typing import List, Optional

from fastapi import HTTPException

from app.core.gemini_client import get_generative_model
from app.schemas.chat import HistoryItem, InternalChatRequest, InternalChatResponse, StickyContext

MODEL_MAP: dict[str, str] = {
    "CHAT_PRO": "gemini-2.5-pro-preview",
    "FAST": "gemini-2.5-flash-lite",
    "THINKING": "gemini-2.5-pro",
    "SEARCH": "gemini-2.5-flash",
    "IMAGE_EDIT": "gemini-2.0-flash-exp",
}

QUICK_REPLY_PROMPT = """
다음 AI 응답을 읽고, 사용자가 다음에 물어볼 만한 자연스러운 후속 질문 3개를 생성하세요.
각 질문은 15자 이내로 간결하게 작성하세요.

[AI 응답]
{response_text}

[출력 형식] JSON 배열만 반환:
["질문1", "질문2", "질문3"]
"""


def build_system_prompt(sticky_context: StickyContext) -> str:
    """fix_scope에 따라 시스템 프롬프트를 분기한다."""
    base = f"당신은 미대 입시 전문 AI 멘토입니다. 현재 학생의 작품 등급은 {sticky_context.grade}이며 점수는 {sticky_context.score}점입니다.\n\n"
    if sticky_context.fix_scope == "StructureRebuild":
        return (
            base
            + "구도/주제 해석/시선 흐름 중심으로 피드백을 제공하세요. "
            "구조 재설계 방법을 구체적으로 제시하세요. "
            "미학적 조언이나 색감·톤 언급은 금지입니다."
        )
    return (
        base
        + "마감/밀도/톤 개선 중심으로 피드백을 제공하세요. "
        "디테일 향상 방법을 구체적으로 제시하세요. "
        "구조·구도 변경 언급은 금지입니다."
    )


def convert_history(history: Optional[List[HistoryItem]]):
    """FE HistoryItem 리스트를 Vertex AI Content 형식으로 변환한다."""
    from vertexai.generative_models import Content, Part

    if not history:
        return []

    contents = []
    for item in history:
        parts = [Part.from_text(p["text"]) for p in item.parts if "text" in p]
        contents.append(Content(role=item.role, parts=parts))
    return contents


async def generate_quick_replies(response_text: str) -> List[str]:
    """응답 텍스트 기반으로 3개 퀵리플라이를 생성한다. 실패 시 빈 리스트 반환."""
    try:
        model = get_generative_model("gemini-2.5-flash-lite")
        prompt = QUICK_REPLY_PROMPT.format(response_text=response_text[:500])

        def _call() -> str:
            return model.generate_content(prompt).text

        raw = await asyncio.to_thread(_call)

        json_match = re.search(r"\[.*?\]", raw, re.DOTALL)
        if json_match:
            replies = json.loads(json_match.group(0))
            if isinstance(replies, list):
                return [str(r) for r in replies[:3]]
    except Exception:
        pass
    return []


async def chat(request: InternalChatRequest) -> InternalChatResponse:
    """모델 선택 → 채팅 세션 시작 → 메시지 전송 → 퀵리플라이 생성."""
    model_name = MODEL_MAP.get(request.model_type, "gemini-2.5-pro-preview")

    system_prompt = build_system_prompt(request.sticky_context) if request.sticky_context else None
    model = get_generative_model(model_name, system_instruction=system_prompt)

    history_contents = convert_history(request.history)

    try:
        from vertexai.generative_models import Part

        def _call_gemini() -> str:
            chat_session = model.start_chat(history=history_contents)
            if request.image_base64:
                image_bytes = base64.b64decode(request.image_base64)
                mime = request.image_mime_type or "image/jpeg"
                response = chat_session.send_message([
                    Part.from_bytes(image_bytes, mime_type=mime),
                    request.message,
                ])
            else:
                response = chat_session.send_message(request.message)
            return response.text

        response_text = await asyncio.to_thread(_call_gemini)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI 멘토 연결에 실패했습니다: {e}")

    quick_replies = await generate_quick_replies(response_text)

    return InternalChatResponse(
        text=response_text,
        grounding_urls=[],
        quick_replies=quick_replies,
    )
