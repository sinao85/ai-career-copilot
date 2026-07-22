from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.analyze import router as analyze_router
from app.api.jd import router as jd_router
from app.api.match import router as match_router
from app.api.generate import router as generate_router

app = FastAPI(
    title="AI Career Copilot Backend",
    version="0.1.0",
    openapi_version="3.0.3"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)
app.include_router(jd_router)
app.include_router(generate_router)
app.include_router(match_router)

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