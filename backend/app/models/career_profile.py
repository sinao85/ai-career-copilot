from pydantic import BaseModel
from typing import List


class CareerProfile(BaseModel):
    summary: str
    strengths: List[str]
    skills: List[str]
    career_direction: str