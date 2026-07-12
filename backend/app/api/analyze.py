from fastapi import APIRouter

router = APIRouter()


@router.post("/api/analyze")
async def analyze():
    return {
        "message":"hello"
    }