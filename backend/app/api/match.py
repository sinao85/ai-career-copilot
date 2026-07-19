from fastapi import APIRouter, UploadFile, File, Body, HTTPException
from typing import Optional

from app.models.match_result import MatchRequest, MatchResult
from app.services.job_matcher import match_jd


router = APIRouter()


@router.post("/api/match", response_model=MatchResult)
async def match(
    request: MatchRequest = Body(...),
):
    """
    Match a resume against a job description using LLM analysis.

    Accepts JSON body with resume_text, optional career_profile, and jd_text.
    """
    resume_text = request.resume_text.strip()
    jd_text = request.jd_text.strip()

    if not resume_text and not jd_text:
        print(
            f"[VALIDATION FAILED] resume_text length: {len(request.resume_text)}, "
            f"jd_text length: {len(request.jd_text)}"
        )
        raise HTTPException(
            status_code=400,
            detail="Resume text and job description text are required.",
        )

    if not resume_text:
        print(f"[VALIDATION FAILED] resume_text length: {len(request.resume_text)}")
        raise HTTPException(
            status_code=400,
            detail="Resume text is required.",
        )

    if not jd_text:
        print(f"[VALIDATION FAILED] jd_text length: {len(request.jd_text)}")
        raise HTTPException(
            status_code=400,
            detail="Job description text is required.",
        )

    return match_jd(request)


@router.post("/api/match/upload")
async def match_upload(
    jd_document: Optional[UploadFile] = File(default=None),
    jd_screenshot: Optional[UploadFile] = File(default=None),
):
    """
    Placeholder for future document/screenshot-based JD matching.
    """
    if jd_document:
        return {
            "message": "Document upload will be supported in the next version.",
            "filename": jd_document.filename,
        }
    if jd_screenshot:
        return {
            "message": "Screenshot parsing will be supported in the next version.",
            "filename": jd_screenshot.filename,
        }
    return {"message": "Please provide a JD document or screenshot."}
