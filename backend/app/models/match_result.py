from typing import List

from pydantic import BaseModel
from app.models.career_profile import CareerProfile


class MatchRequest(BaseModel):
    resume_text: str
    career_profile: CareerProfile | None = None
    jd_text: str


class MatchResult(BaseModel):
    match_score: int
    summary: str
    matched_strengths: List[str]
    skill_gaps: List[str]
    missing_keywords: List[str]
    recommendations: List[str]
