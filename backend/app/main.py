from fastapi import FastAPI
from app.api.analyze import router as analyze_router


app = FastAPI(
    title="AI Career Copilot Backend",
    version="0.1.0",
    openapi_version="3.0.3"
)


app.include_router(analyze_router)

@app.get("/")
def root():
    return {
        "message": "AI Career Copilot Backend"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }