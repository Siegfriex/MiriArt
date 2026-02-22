from typing import List, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

_CAMEL = ConfigDict(populate_by_name=True, alias_generator=to_camel, serialize_by_alias=True)


class SummarizeRequest(BaseModel):
    model_config = _CAMEL

    question: str
    answers: List[str]


class SummarizeResponse(BaseModel):
    model_config = _CAMEL

    summary: str    # 3줄 요약
    supplement: str  # 추가 보충 설명


class DraftRequest(BaseModel):
    model_config = _CAMEL

    title: str
    content: str
    image_base64: Optional[str] = None


class DraftResponse(BaseModel):
    model_config = _CAMEL

    draft: str  # AI 초안 답변
