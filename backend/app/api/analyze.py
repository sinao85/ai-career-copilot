from typing import Optional
from fastapi import APIRouter, Request, UploadFile, File, HTTPException
from app.services.document_parser import extract_text
from app.services.career_analyzer import analyze_resume
from app.limiter import limiter


router = APIRouter()

ALLOWED_RESUME_TYPES = {"application/pdf"}

MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10MB
MAX_MATERIAL_SIZE = 10 * 1024 * 1024  # 10MB
MAX_WORK_MATERIAL_COUNT = 5


@router.post("/api/analyze")
@limiter.limit("3/minute")
async def analyze(
    request: Request,
    resume: UploadFile = File(...),
    work_materials: Optional[list[UploadFile]] = File(
    default=None,
    description="Optional supporting files"
)
):
    # Work materials count check
    materials = work_materials or []
    if len(materials) > MAX_WORK_MATERIAL_COUNT:
        raise HTTPException(
            status_code=400,
            detail="Too many work materials. Maximum 5 files allowed."
        )

    # Resume file type check
    if resume.content_type not in ALLOWED_RESUME_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Only PDF resumes are accepted.",
        )

    # Resume size check
    resume_content = await resume.read()
    if len(resume_content) > MAX_RESUME_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Resume file size exceeds 10MB limit."
        )
    await resume.seek(0)

    resume_text = await extract_text(resume)

    print(f"[Analyze] Resume parsed ({len(resume_text)} chars)")

    profile = analyze_resume(resume_text)

    # Work materials size check
    for file in materials:
        content = await file.read()
        if len(content) > MAX_MATERIAL_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File '{file.filename}' exceeds 10MB limit."
            )
        await file.seek(0)

    return {
        "profile": profile.dict(),
        "resume_text": resume_text,
        "work_materials": [
            {
                "filename": file.filename,
                "content_type": file.content_type
            }
            for file in materials
        ]
    }