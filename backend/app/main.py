import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.analyze import router as analyze_router
from app.api.jd import router as jd_router
from app.api.match import router as match_router
from app.api.generate import router as generate_router

from app.limiter import limiter


# =========================
# Environment
# =========================

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)


# 支持多个前端来源
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3000",
]


# =========================
# FastAPI App
# =========================

app = FastAPI(
    title="AI Career Copilot Backend",
    version="0.1.0",
    openapi_version="3.0.3",
)


# =========================
# Rate Limit
# =========================

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# API Routes
# =========================

app.include_router(analyze_router)
app.include_router(jd_router)
app.include_router(generate_router)
app.include_router(match_router)


# =========================
# Health Check
# =========================

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