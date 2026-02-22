from typing import Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

_CAMEL = ConfigDict(populate_by_name=True, alias_generator=to_camel, serialize_by_alias=True)


class InternalImageEditRequest(BaseModel):
    model_config = _CAMEL

    image_base64: str
    prompt: str


class InternalImageEditResponse(BaseModel):
    model_config = _CAMEL

    text: str
    image_url: Optional[str] = None
