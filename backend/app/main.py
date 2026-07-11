from fastapi import FastAPI

app = FastAPI(title="AI Career Copilot Backend")


@app.get("/")
def root():
    return {"message": "AI Career Copilot Backend"}


@app.get("/health")
def health_check():
    return {"status": "ok"}