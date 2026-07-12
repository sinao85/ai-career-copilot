from typing import Optional
from fastapi import APIRouter, UploadFile, File
from app.services.document_parser import extract_text


router = APIRouter()


@router.post("/api/analyze")
async def analyze(
    resume: UploadFile = File(...),
    work_materials: Optional[list[UploadFile]] = File(default=None)
):

    resume_text = await extract_text(resume)

    materials = work_materials or []

    return {
        "resume": {
            "filename": resume.filename,
            "text": resume_text
        },

        "work_materials": [
            {
                "filename": file.filename,
                "content_type": file.content_type
            }
            for file in materials
        ]
    }