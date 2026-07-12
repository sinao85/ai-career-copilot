from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import UploadFile, File

app = FastAPI(title="AI Career Copilot Backend")


class EchoRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {"message": "AI Career Copilot Backend"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/echo")
def echo(request: EchoRequest):
    return {"message": request.message}

@app.post("/api/analyze")
async def analyze(
    resume: UploadFile = File(...)
):
    return {
        "filename": resume.filename,
        "content_type": resume.content_type
    }