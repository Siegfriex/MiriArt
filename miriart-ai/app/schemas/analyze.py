from typing import List, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

_CAMEL = ConfigDict(populate_by_name=True, alias_generator=to_camel, serialize_by_alias=True)


class InternalAnalyzeRequest(BaseModel):
    model_config = _CAMEL

    gcs_uri: str
    analysis_type: str  # basic | major
    problem_text: Optional[str] = None


class RadarData(BaseModel):
    model_config = _CAMEL

    density: float
    form: float
    completion: float
    relevance: float
    thinking: float


class UniversityPrediction(BaseModel):
    model_config = _CAMEL

    university: str
    major: str
    line: str  # TOP | HIGH | MID | LOW
    probability: int
    similar_accepted_count: int


class InternalAnalyzeResponse(BaseModel):
    model_config = _CAMEL

    grade: str  # A | B | C | D | F
    total_score: float
    radar_data: RadarData
    fix_scope: str  # StructureRebuild | DetailTuning
    comment: str
    university_predictions: List[UniversityPrediction] = []
