# AI Career Copilot

An AI-powered career assistant that helps users transform their experience into targeted career opportunities.

## Product Overview

AI Career Copilot helps job seekers:
- Analyze their resume
- Understand career strengths
- Match target job descriptions
- Generate customized resumes

The goal is to use AI to bridge the gap between personal experience and career opportunities.

## MVP Status

### Completed

- Resume upload + PDF parsing
- AI career profile (DeepSeek LLM)
- Profile page with real analysis data
- Target job description input (text)
- JD Match (LLM-powered matching)
- Multilingual output (Chinese / English auto-detect)
- Input validation (empty resume / empty JD)
- End-to-end frontend ↔ backend integration

### Planned

- PDF JD Parser
- DOCX JD Parser
- Screenshot / Vision JD Parser
- Customized resume generation
- Match Level (A~E) display
- Prompt versioning & result cache

## Product Workflow

```
Resume Upload
    ↓
AI Career Analysis (LLM)
    ↓
Career Profile (real data)
    ↓
Paste JD → JD Match (LLM)
    ↓
Match Results (score, strengths, gaps, recommendations)
```

## Tech Stack

Frontend:
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

Backend:
- FastAPI (Python)
- OpenAI SDK → DeepSeek API
- pypdf (PDF parsing)

## Version History

### v0.2 — JD Match MVP

Completed JD Match backend with LLM integration, frontend-backend connection, input validation, and multilingual output.

### v0.1 — Frontend MVP

Completed full frontend product workflow and validated the MVP user journey.
