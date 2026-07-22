from typing import List

from pydantic import BaseModel

from app.models.career_profile import CareerProfile
from app.models.match_result import MatchResult


class ResumeGenerationRequest(BaseModel):
    resume_text: str
    jd_text: str
    career_profile: CareerProfile | None = None
    match_result: MatchResult | None = None


class CustomizedResumeResult(BaseModel):
    customized_resume: str
    customization_summary: str
    key_changes: List[str]