from typing import Optional
from fastapi import APIRouter, UploadFile, File
from app.services.document_parser import extract_text
from app.services.career_analyzer import analyze_resume


router = APIRouter()


@router.post("/api/analyze")
async def analyze(
    resume: UploadFile = File(...),
    work_materials: Optional[list[UploadFile]] = File(
    default=None,
    description="Optional supporting files"
)
):



    resume_text = await extract_text(resume)

    print("========== RESUME TEXT ==========")
    print(resume_text[:1000])
    print("=================================")


    profile = analyze_resume(resume_text)


    materials = work_materials or []


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