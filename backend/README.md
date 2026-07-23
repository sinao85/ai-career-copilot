# AI Career Copilot Backend

Backend service for AI Career Copilot. Provides LLM-powered resume analysis, JD understanding, resume matching, and customized resume generation.

## Tech Stack

- Python
- FastAPI
- Uvicorn
- OpenAI-compatible LLM Provider
- DeepSeek / GLM-4.6V-Flash

## Getting Started

### Install dependencies

```bash
uv sync
```

### Run server (development)

```bash
uv run uvicorn app.main:app --reload
```

### Access

```
http://localhost:8000
```

API documentation is available at http://localhost:8000/docs.

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

| Variable | Description |
|---|---|
| `LLM_API_KEY` | DeepSeek API key |
| `LLM_MODEL` | DeepSeek model (default: `deepseek-chat`) |
| `GLM_API_KEY` | GLM-4.6V-Flash API key (for vision tasks) |
| `GLM_MODEL` | GLM model (default: `glm-4.6v-flash`) |
| `GEMINI_API_KEY` | Gemini API key (optional) |
| `FRONTEND_URL` | Allowed CORS origin (default: `http://localhost:3000`) |

See `.env.example` for all available options.

## API Endpoints

### Health

- `GET /` — Service info
- `GET /health` — Health check

### Resume Analysis

- `POST /api/analyze` — Upload a PDF resume and generate a career profile

### JD Understanding

- `POST /api/jd/analyze` — Analyze JD from text or uploaded screenshot (PNG/JPG/WebP)

### Resume Matching

- `POST /api/match` — Compare resume and career profile against a JD and return match score, strengths, gaps, and recommendations

### Resume Generation

- `POST /api/generate` — Generate a customized resume based on original resume, target JD, career profile, and match analysis

### Export

- `POST /api/export/html` — Export customized resume as HTML

## Deployment

Production startup:

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Make sure to set `FRONTEND_URL` to your actual frontend domain in production.
