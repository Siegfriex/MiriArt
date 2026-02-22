from fastapi import APIRouter, HTTPException

from app.schemas.analyze import InternalAnalyzeRequest, InternalAnalyzeResponse
from app.schemas.chat import InternalChatRequest, InternalChatResponse
from app.schemas.image_edit import InternalImageEditRequest, InternalImageEditResponse
from app.schemas.stub import DraftRequest, DraftResponse, SummarizeRequest, SummarizeResponse
from app.services import analyze_service, chat_service, image_edit_service

router = APIRouter()


@router.post(
    "/analyze",
    response_model=InternalAnalyzeResponse,
    summary="작품 분석",
    description="GCS URI의 이미지를 Gemini Vision으로 분석하여 5축 채점 결과를 반환한다.",
)
async def analyze(request: InternalAnalyzeRequest) -> InternalAnalyzeResponse:
    return await analyze_service.analyze_artwork(request)


@router.post(
    "/chat",
    response_model=InternalChatResponse,
    summary="AI 채팅",
    description="모델 타입과 채팅 히스토리를 기반으로 AI 멘토 응답을 생성한다.",
)
async def chat(request: InternalChatRequest) -> InternalChatResponse:
    return await chat_service.chat(request)


@router.post(
    "/edit-image",
    response_model=InternalImageEditResponse,
    summary="이미지 편집",
    description="base64 이미지와 프롬프트로 Gemini 이미지 편집을 수행하고 GCS URL을 반환한다.",
)
async def edit_image(request: InternalImageEditRequest) -> InternalImageEditResponse:
    return await image_edit_service.edit_image(request)


@router.post(
    "/summarize-answers",
    response_model=SummarizeResponse,
    summary="Q&A 답변 요약 (Phase C4 스텁)",
    description="[Phase C4 미구현] Q&A 답변들을 요약한다.",
)
async def summarize_answers(request: SummarizeRequest) -> SummarizeResponse:
    raise HTTPException(
        status_code=501,
        detail="이 엔드포인트는 Phase C4에서 구현될 예정입니다.",
    )


@router.post(
    "/draft-from-question",
    response_model=DraftResponse,
    summary="질문 초안 생성 (Phase C4 스텁)",
    description="[Phase C4 미구현] 질문 내용을 기반으로 AI 초안 답변을 생성한다.",
)
async def draft_from_question(request: DraftRequest) -> DraftResponse:
    raise HTTPException(
        status_code=501,
        detail="이 엔드포인트는 Phase C4에서 구현될 예정입니다.",
    )
