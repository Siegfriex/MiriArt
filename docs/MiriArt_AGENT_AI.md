# AGENT_AI.md — MiriArt FastAPI AI 서비스 빌딩 에이전트 프롬프트

> **역할**: MiriArt `miriart-ai/` FastAPI Python AI 서비스 빌딩 전담 개발자
> **버전**: 1.0 | **작성일**: 2026-02-22

---

## 참고 기준

구현 시 아래 공식 문서 패턴에 맞춰 설계할 것:

- **FastAPI + Cloud Run 배포**: [GCP 공식 — Deploy Python (FastAPI) to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-fastapi-service)
- **Cloud Run 컨테이너 배포**: [Cloud Run — Deploying container images](https://cloud.google.com/run/docs/deploying)
- **CI/CD 파이프라인**: [Codelabs: GitHub → Cloud Run via Cloud Build](https://codelabs.developers.google.com/codelabs/how-to-deploy-github-cloud-run-using-cloud-build)
- **Cloud Build Triggers**: [Cloud Build Triggers 공식 문서](https://cloud.google.com/build/docs/triggers)

---

## 컨텍스트

```
프로젝트명: MiriArt AI Service
신규 프로젝트 경로: H:\n_0221\02_21dys\miriart-ai\
FE 현 API 패턴 참조: H:\n_0221\02_21dys\src\shared\api\gemini.ts (흡수 대상)

스택:
- Python 3.11
- FastAPI + Uvicorn
- google-cloud-aiplatform (Vertex AI SDK)
- google-generativeai (Gemini Python SDK)
- Pydantic v2
- google-cloud-storage (GCS SDK)

AI 모델:
- CHAT_PRO: gemini-2.5-pro-preview (채팅, 분석 코멘트)
- FAST: gemini-2.5-flash-lite (빠른 응답)
- THINKING: gemini-2.5-pro (심층 분석)
- SEARCH: gemini-2.5-flash + grounding (정보 검색)
- IMAGE_EDIT: gemini-2.0-flash-exp (이미지 편집)

GCP:
- Vertex AI / Gemini API
- Cloud Run (서버리스 배포)
- GCS (이미지 저장/조회)

호출 주체: Java BE의 WebClient (내부 호출, FE 직접 접근 불가)
인증: Cloud Run VPC 내부망 또는 서비스 계정 토큰

API 계약서: docs/02_21dys_API_CONTRACT.md §8 (FastAPI Internal API)
```

---

## FE 현 gemini.ts → FastAPI Pydantic 스키마 매핑

| FE TypeScript 인터페이스 | FastAPI Pydantic 모델 | 변환 필요 사항 |
|------------------------|-----------------------|--------------|
| `ChatRequest` | `InternalChatRequest` | `imageBase64` → GCS URI or base64 그대로 |
| `ChatResponse` | `InternalChatResponse` | 동일 구조 |
| `AnalyzeOptions` | `InternalAnalyzeRequest` | `image` → `gcs_uri` (서버 업로드 후 GCS URI) |
| `AnalyzeResponse` | `InternalAnalyzeResponse` | 동일 구조 + `university_predictions` 추가 |
| `ImageEditRequest` | `InternalImageEditRequest` | base64 그대로 |
| `ImageEditResponse` | `InternalImageEditResponse` | 동일 |

---

## Task 1: 프로젝트 초기화

**작업 지시**:

`H:\n_0221\02_21dys\miriart-ai\` 에 다음 구조로 프로젝트를 초기화하라:

```
miriart-ai/
├── app/
│   ├── __init__.py
│   ├── main.py              ← FastAPI app 진입점
│   ├── routers/
│   │   └── ai.py            ← /internal/ai/* 라우터
│   ├── services/
│   │   ├── analyze_service.py
│   │   ├── chat_service.py
│   │   └── image_edit_service.py
│   ├── schemas/
│   │   ├── analyze.py       ← Pydantic 모델
│   │   ├── chat.py
│   │   └── image_edit.py
│   └── core/
│       ├── config.py        ← 환경변수 설정
│       └── gemini_client.py ← Gemini SDK 초기화
├── Dockerfile
├── requirements.txt
├── cloudbuild.yaml
└── .env.example
```

**`requirements.txt`**:
```
fastapi==0.115.x
uvicorn[standard]==0.34.x
google-cloud-aiplatform==1.x.x
google-generativeai==0.8.x
google-cloud-storage==2.x.x
pydantic==2.x.x
python-multipart==0.0.x
httpx==0.27.x
python-dotenv==1.0.x
```

**`app/main.py`**:
```python
from fastapi import FastAPI
from app.routers import ai

app = FastAPI(title="MiriArt AI Service", version="1.0.0")
app.include_router(ai.router, prefix="/internal/ai", tags=["AI Internal"])

@app.get("/health")
def health():
    return {"status": "ok"}
```

---

## Task 2: `POST /internal/ai/analyze` — 작품 분석

**작업 지시**:

**스키마** (`app/schemas/analyze.py`):
```python
from pydantic import BaseModel
from typing import Optional, List

class InternalAnalyzeRequest(BaseModel):
    gcs_uri: str                 # gs://miriart-bucket/artworks/...
    analysis_type: str           # basic | major
    problem_text: Optional[str] = None

class RadarData(BaseModel):
    density: float
    form: float
    completion: float
    relevance: float
    thinking: float

class UniversityPrediction(BaseModel):
    university: str
    major: str
    line: str                    # TOP | HIGH | MID | LOW
    probability: int
    similar_accepted_count: int

class InternalAnalyzeResponse(BaseModel):
    grade: str                   # A | B | C | D | F
    total_score: float
    radar_data: RadarData
    fix_scope: str               # StructureRebuild | DetailTuning
    comment: str
    university_predictions: List[UniversityPrediction] = []
```

**서비스** (`app/services/analyze_service.py`):
```python
import vertexai
from vertexai.generative_models import GenerativeModel, Part, Image
from google.cloud import storage

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

async def analyze_artwork(request: InternalAnalyzeRequest) -> InternalAnalyzeResponse:
    # GCS에서 이미지 로드
    storage_client = storage.Client()
    bucket_name, blob_path = parse_gcs_uri(request.gcs_uri)
    image_bytes = download_from_gcs(storage_client, bucket_name, blob_path)

    # Gemini Vision 호출
    model = GenerativeModel("gemini-2.5-pro-preview")
    response = model.generate_content([
        Part.from_bytes(image_bytes, mime_type="image/jpeg"),
        ANALYSIS_PROMPT_BASIC
    ])

    # JSON 파싱 + fixScope 계산
    result = parse_analysis_json(response.text)
    total_score = calculate_total_score(result)
    grade = calculate_grade(total_score)
    fix_scope = calculate_fix_scope(result)

    return InternalAnalyzeResponse(
        grade=grade,
        total_score=total_score,
        radar_data=RadarData(**{k: result[k] for k in ["density", "form", "completion", "relevance", "thinking"]}),
        fix_scope=fix_scope,
        comment=result["comment"],
        university_predictions=[]  # Phase 2: Theory Engine 연동
    )
```

**등급/fixScope 계산**:
```python
def calculate_grade(total_score: float) -> str:
    if total_score >= 90: return "A"
    if total_score >= 80: return "B"
    if total_score >= 70: return "C"
    if total_score >= 60: return "D"
    return "F"

def calculate_fix_scope(scores: dict) -> str:
    structure_score = scores["density"]*0.3 + scores["form"]*0.4 + scores["relevance"]*0.3
    return "DetailTuning" if structure_score >= 70 else "StructureRebuild"

def calculate_total_score(scores: dict) -> float:
    weights = {"density": 0.20, "form": 0.25, "completion": 0.20, "relevance": 0.20, "thinking": 0.15}
    return sum(scores[k] * w for k, w in weights.items())
```

---

## Task 3: `POST /internal/ai/chat` — AI 채팅

**작업 지시**:

**스키마** (`app/schemas/chat.py`):
```python
from pydantic import BaseModel
from typing import Optional, List

class HistoryItem(BaseModel):
    role: str  # "user" | "model"
    parts: List[dict]  # [{"text": "..."}]

class StickyContext(BaseModel):
    grade: str
    score: float
    fix_scope: str
    radar_data: Optional[dict] = None

class InternalChatRequest(BaseModel):
    model_type: str  # CHAT_PRO | FAST | THINKING | SEARCH | IMAGE_EDIT
    message: str
    session_id: Optional[str] = None
    sticky_context: Optional[StickyContext] = None
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = None
    history: Optional[List[HistoryItem]] = []

class InternalChatResponse(BaseModel):
    text: str
    grounding_urls: List[str] = []
    quick_replies: List[str] = []
```

**서비스** (`app/services/chat_service.py`):
```python
MODEL_MAP = {
    "CHAT_PRO": "gemini-2.5-pro-preview",
    "FAST": "gemini-2.5-flash-lite",
    "THINKING": "gemini-2.5-pro",
    "SEARCH": "gemini-2.5-flash",
    "IMAGE_EDIT": "gemini-2.0-flash-exp",
}

def build_system_prompt(sticky_context: StickyContext) -> str:
    if sticky_context.fix_scope == "StructureRebuild":
        return "구도/주제 해석/시선 흐름 중심으로 피드백. 구조 재설계 방법 제시. 미학/톤은 언급 금지."
    return "마감/밀도/톤 개선 중심으로 피드백. 디테일 향상 방법 제시. 구조는 언급하지 않음."

async def chat(request: InternalChatRequest) -> InternalChatResponse:
    model_name = MODEL_MAP.get(request.model_type, "gemini-2.5-pro-preview")
    system_prompt = build_system_prompt(request.sticky_context) if request.sticky_context else ""
    model = GenerativeModel(model_name, system_instruction=system_prompt)

    chat = model.start_chat(history=convert_history(request.history))

    # 이미지 포함 여부 처리
    if request.image_base64:
        import base64
        image_bytes = base64.b64decode(request.image_base64)
        response = chat.send_message([
            Part.from_bytes(image_bytes, mime_type=request.image_mime_type or "image/jpeg"),
            request.message
        ])
    else:
        response = chat.send_message(request.message)

    return InternalChatResponse(
        text=response.text,
        quick_replies=generate_quick_replies(response.text),
    )
```

---

## Task 4: `POST /internal/ai/edit-image`

**작업 지시**:

`ImageEditRequest { image_base64, prompt }` 수신 → Gemini `gemini-2.0-flash-exp` 이미지 편집 → `ImageEditResponse { text, image_url }` 반환.

```python
async def edit_image(request: InternalImageEditRequest) -> InternalImageEditResponse:
    model = GenerativeModel("gemini-2.0-flash-exp")
    import base64
    image_bytes = base64.b64decode(request.image_base64)
    response = model.generate_content([
        Part.from_bytes(image_bytes, mime_type="image/jpeg"),
        request.prompt
    ])
    # 응답에서 이미지 추출 후 GCS에 저장, URL 반환
    ...
```

---

## Task 5: Phase C — Q&A 요약/초안 (Phase C4 준비)

**작업 지시**:

아래 엔드포인트를 스텁으로 작성하라 (구현은 Phase C4에서 완성):

**`POST /internal/ai/summarize-answers`**
```python
class SummarizeRequest(BaseModel):
    question: str
    answers: List[str]

class SummarizeResponse(BaseModel):
    summary: str      # 3줄 요약
    supplement: str   # 추가 보충 설명
```

**`POST /internal/ai/draft-from-question`**
```python
class DraftRequest(BaseModel):
    title: str
    content: str
    image_base64: Optional[str] = None

class DraftResponse(BaseModel):
    draft: str   # AI 초안 답변
```

---

## Task 6: Dockerfile + Cloud Run 배포 설정

**`Dockerfile`**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

**`cloudbuild.yaml`** (GitHub → Cloud Run CI/CD):
```yaml
steps:
  # 1. Docker 이미지 빌드
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/miriart-ai:$COMMIT_SHA', '.']

  # 2. Artifact Registry에 푸시
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/miriart-ai:$COMMIT_SHA']

  # 3. Cloud Run 배포
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - run
      - deploy
      - miriart-ai
      - --image=gcr.io/$PROJECT_ID/miriart-ai:$COMMIT_SHA
      - --region=asia-northeast3
      - --platform=managed
      - --no-allow-unauthenticated    # 내부 호출만 허용
      - --set-env-vars=GCP_PROJECT_ID=$PROJECT_ID,GCS_BUCKET_NAME=miriart-bucket

images:
  - 'gcr.io/$PROJECT_ID/miriart-ai:$COMMIT_SHA'
```

> 참고: [Codelabs — GitHub → Cloud Run via Cloud Build](https://codelabs.developers.google.com/codelabs/how-to-deploy-github-cloud-run-using-cloud-build)

---

## 환경변수 목록

```env
# .env.example
GCP_PROJECT_ID=miriart-prod
GCP_REGION=asia-northeast3
GCS_BUCKET_NAME=miriart-bucket
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json  # 로컬 개발 시
# Cloud Run에서는 서비스 계정 자동 연결
```
