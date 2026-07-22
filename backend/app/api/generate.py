from fastapi import APIRouter, HTTPException
from app.models.customized_resume import (
    ResumeGenerationRequest,
    CustomizedResumeResult,
)
from app.services.resume_generator import generate_customized_resume

router = APIRouter()


@router.post(
    "/api/generate",
    response_model=CustomizedResumeResult,
)
async def generate_resume(
    request: ResumeGenerationRequest,
):
    try:
        return generate_customized_resume(request)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )