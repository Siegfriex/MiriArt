from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

_CAMEL = ConfigDict(populate_by_name=True, alias_generator=to_camel, serialize_by_alias=True)


class HistoryItem(BaseModel):
    model_config = _CAMEL

    role: str  # "user" | "model"
    parts: List[Dict[str, Any]]  # [{"text": "..."}]


class StickyContext(BaseModel):
    model_config = _CAMEL

    grade: str
    score: float
    fix_scope: str  # StructureRebuild | DetailTuning
    radar_data: Optional[Dict[str, float]] = None


class InternalChatRequest(BaseModel):
    model_config = _CAMEL

    model_type: str  # CHAT_PRO | FAST | THINKING | SEARCH | IMAGE_EDIT
    message: str
    session_id: Optional[str] = None
    sticky_context: Optional[StickyContext] = None
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = None
    history: Optional[List[HistoryItem]] = []


class InternalChatResponse(BaseModel):
    model_config = _CAMEL

    text: str
    grounding_urls: List[str] = []
    quick_replies: List[str] = []
