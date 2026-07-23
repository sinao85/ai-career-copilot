from fastapi import APIRouter, Request, HTTPException
from app.models.customized_resume import (
    ResumeGenerationRequest,
    CustomizedResumeResult,
)
from app.services.resume_generator import generate_customized_resume
from app.limiter import limiter

router = APIRouter()


@router.post(
    "/api/generate",
    response_model=CustomizedResumeResult,
)
@limiter.limit("5/minute")
async def generate_resume(
    request: Request,
    body: ResumeGenerationRequest,
):
    try:
        return generate_customized_resume(body)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=str(e),
        )