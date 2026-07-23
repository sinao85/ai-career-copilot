from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.document_parser import extract_text
from app.services.career_analyzer import analyze_resume


router = APIRouter()

MAX_RESUME_SIZE = 10 * 1024 * 1024  # 10MB
MAX_MATERIAL_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/api/analyze")
async def analyze(
    resume: UploadFile = File(...),
    work_materials: Optional[list[UploadFile]] = File(
    default=None,
    description="Optional supporting files"
)
):
    # Resume size check
    resume_content = await resume.read()
    if len(resume_content) > MAX_RESUME_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Resume file size exceeds 10MB limit."
        )
    await resume.seek(0)

    resume_text = await extract_text(resume)

    print("========== RESUME TEXT ==========")
    print(resume_text[:1000])
    print("=================================")

    profile = analyze_resume(resume_text)

    # Work materials size check
    materials = work_materials or []
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