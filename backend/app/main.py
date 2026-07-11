from fastapi import FastAPI
from pydantic import BaseModel

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