# AI Career Copilot

> AI-powered career assistant that helps job seekers understand opportunities, identify skill gaps, and generate customized resumes.

AI Career Copilot is an LLM-powered career operating system. It analyzes your resume, understands target job descriptions, identifies skill gaps, and generates customized resumes—all through a structured AI workflow.

It's an exploration of what an **AI-native Career OS** looks like: not just a wrapper around LLM APIs, but a product system designed around user career growth.

---

## Problem

In traditional job seeking:

- Applicants don't know if their resume matches the target role
- JDs are dense and hard to parse quickly
- Resume customization is guesswork without structured feedback
- There's no quantitative feedback loop for career growth

AI Career Copilot bridges this gap with AI-powered analysis and actionable recommendations.

---

## Features

### 1. Resume Analysis

Upload a PDF resume and AI extracts:

- Career profile (strengths, skill map, career direction)
- Structured capability analysis

### 2. JD Understanding

Two input modes:

- **Text**: Paste JD text directly (up to 1500 characters)
- **Image**: Upload JD screenshots (PNG / JPG / WebP)

AI extracts structured role information:

- Job title
- Responsibilities (itemized)
- Requirements (itemized)
- Location
- Education & experience
- Salary range

Tech insight: Image inputs are processed by a Vision LLM (GLM-4.6V-Flash), text inputs by a Text LLM (DeepSeek). The system routes automatically based on input type—no manual model switching.

### 3. Resume Matching

Deep matching analysis between resume and JD.

Outputs:

- **Match Score**: Overall compatibility rating
- **Matching Strengths**: Where the resume aligns
- **Skill Gaps**: Identified capability gaps
- **Missing Keywords**: Keywords present in JD but missing from resume
- **Improvement Suggestions**: Actionable resume improvement advice

### 4. Customized Resume Generation

AI generates a targeted resume based on job requirements.

Core constraint: **Preserve real experience.** No fabrication, no invented skills, no fake projects.

Outputs:

- Target Resume
- Customization Summary (what was changed and why)
- Key Changes (specific modifications made)

### 5. Resume Export

Currently supported:

- **HTML Export**: Download formatted resume HTML

Roadmap:

- PDF Export
- Word Export

---

## Product Workflow

```
Resume Upload
    ↓
Resume Analysis
    ↓
JD Analysis (text / image)
    ↓
Resume Matching
    ↓
Customized Resume Generation
    ↓
Export
```

---

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

### Backend

- FastAPI (Python)
- Uvicorn
- uv (Python package manager)

### AI Layer

The system uses a **Provider Architecture** that decouples capabilities from specific models:

```
BaseLLMProvider
    ├── Text Provider
    │   ├── DeepSeek
    │   └── Gemini
    └── Vision Provider
        └── GLM-4.6V-Flash
```

Key design decisions:

- **Capability-based routing**: Route by what the task needs (text understanding vs. vision understanding), not by which model is preferred
- **Unified interface**: All providers implement `generate()`, making it trivial to add new models
- **Deterministic at boundaries**: Input validation, file type detection, and model routing are handled by rule-based logic, not LLM calls

---

## Sprint Progress

### Sprint 1 — Foundation

- Frontend project setup
- Backend project setup
- End-to-end connectivity

### Sprint 2 — Resume Intelligence

- PDF resume parsing
- AI career profile generation
- Profile page with real data

### Sprint 3 — AI Gateway

- Provider abstraction layer
- Multi-model architecture
- Model routing logic

### Sprint 4 — Multimodal JD Understanding

- JD image upload & vision recognition
- Vision model integration (GLM-4.6V-Flash)
- Structured JD extraction
- Resume matching (score, strengths, gaps)

### Sprint 5 — Customized Resume

- AI resume generation
- Customization reasoning display
- Sectioned resume preview
- HTML resume export
- Three-column layout: AI Reasoning / Resume Preview / Export

---

## Engineering Principles

### Product First

Solve user problems first. Technology serves the product, not the other way around.

### Rule First

If a problem can be solved deterministically, don't use AI. Input validation, file type checks, and model routing are handled by rules—not prompts.

### Capability-based Architecture

Design around capabilities (text, vision) rather than specific models. This makes the system extensible and provider-agnostic.

### Iterative Development

Each feature follows: Prototype → Backend API → Frontend Integration → Validation.

---

## Roadmap

### AI Quality

- Prompt optimization
- Evaluation dataset
- Output consistency monitoring

### Structured Resume Engine

- Structured resume schema
- Multiple template support
- Higher-quality export pipeline

### Career Memory

- Resume version history
- Application tracking
- Career growth visualization

### AI Career Intelligence

- AI Product Manager role trend tracking
- Skill gap analysis
- Learning path recommendations
