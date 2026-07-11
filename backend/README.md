# AI Career Copilot Backend

Backend service for AI Career Copilot.

## Tech Stack

- Python
- FastAPI
- Uvicorn

## Getting Started

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run server

```bash
uvicorn app.main:app --reload
```

### Access

```
http://localhost:8000
```

## API Endpoints

- GET / - Health check
- POST /api/analyze - Career profile analysis (TBD)
- POST /api/match - JD matching (TBD)
- POST /api/generate-resume - Resume generation (TBD)