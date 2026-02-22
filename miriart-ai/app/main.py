import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.gemini_client import init_vertex_ai
from app.routers import ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        init_vertex_ai()
    except Exception as e:
        logging.warning(f"Vertex AI 초기화 실패 (로컬 개발 모드로 실행): {e}")
    yield


app = FastAPI(
    title="MiriArt AI Service",
    version="1.0.0",
    description="MiriArt 내부 AI 서비스 (Java BE → FastAPI). FE 직접 접근 불가.",
    lifespan=lifespan,
)

app.include_router(ai.router, prefix="/internal/ai", tags=["AI Internal"])


@app.get("/health")
def health():
    return {"status": "ok"}
