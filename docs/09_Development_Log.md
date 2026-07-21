# Development Log

## 2026-07-12 Backend Document Understanding MVP

### Goal

Implement the first backend capability for AI Career Copilot:

Convert uploaded resume files into structured text data that can be used for future AI career analysis.

---

## Completed

### 1. Backend API Refactoring

Changed backend structure from single-file API implementation to modular architecture.

Before:

```
main.py
├── API routes
├── business logic
└── service logic
```

After:

```
app
├── main.py
├── api
│   └── analyze.py
└── services
    └── document_parser.py
```

Responsibilities:

- main.py: application initialization and router registration
- analyze.py: resume analysis API
- document_parser.py: document extraction logic

---

### 2. Resume Upload API Enhancement

Updated `/api/analyze`

Before:

- Only received uploaded file information

After:

- Receive resume file
- Parse resume content
- Return extracted text

Current flow:

```
Resume PDF
↓
FastAPI UploadFile
↓
Document Parser
↓
Extract Text
↓
Return JSON
```

---

### 3. PDF Text Extraction

Implemented PDF parser using `pypdf`.

Input:

```
resume.pdf
```

Output:

```json
{
  "filename": "resume.pdf",
  "text": "resume content..."
}
```

---

## Problems & Solutions

### Problem 1: Virtual Environment Management

Issue:

Accidentally considered uploading Python virtual environment into Git.

Solution:

Added ignore rules:

```
venv/
.venv/
__pycache__/
temp.pdf
```

Lesson:

Local development environments should not be committed.
Only dependency definitions such as `requirements.txt` should be managed.

---

### Problem 2: API Validation Error (422)

Issue:

`/api/analyze` returned:

```
Expected UploadFile, received: <class 'str'>
```

Cause:

Swagger sent an empty string for `work_materials` instead of an uploaded file.

Solution:

Disabled "Send empty value" in Swagger testing.

Lesson:

API input validation depends not only on backend definitions but also on how clients send data.

---

### Problem 3: Debugging Async API Process

Issue:

API request remained loading without response.

Investigation:

Added debug logs inside document parser:

```
Start reading file
File size
Start PDF parsing
PDF pages
Extracted text length
```

Lesson:

AI application debugging requires observing each step of the data pipeline.

---

## Key Learning

This iteration completed the first real AI application data pipeline:

```
User Upload
    ↓
Backend API
    ↓
Document Processing
    ↓
Extracted Knowledge
```

The next step is:

```
Resume Text
    ↓
AI Career Extraction
    ↓
Career Profile JSON
```

This will introduce the first AI reasoning capability.

## 2026-07-16 MacBook Air M5 Development Environment Migration

Completed migration from previous development environment to personal MacBook Air M5.

Environment setup:
- macOS 26.5.1
- Apple M5 / 16GB RAM
- Homebrew 6.0.11
- Node.js v26.5.0
- Python 3.14.6
- uv 0.11.29
- Trae IDE

Completed:
- Configured GitHub SSH authentication
- Cloned AI Career Copilot repository
- Installed frontend dependencies
- Successfully launched Next.js frontend locally

Next:
- Restore FastAPI backend environment
- Connect LLM API
- Continue AI capability development

feat: integrate real LLM resume analysis

Completed:
- Added OpenAI-compatible LLM client
- Connected DeepSeek API
- Implemented environment variable configuration
- Replaced mock LLM response
- Validated PDF -> Text -> LLM -> JSON pipeline

Issues resolved:
- Python environment configuration
- .env loading
- Swagger multipart upload compatibility
- Structured LLM output parsing

## 2026-07-18 LLM Integration

### Completed

- Added OpenAI SDK based LLM client
- Integrated DeepSeek API
- Added environment variable configuration
- Implemented resume analysis pipeline

### Architecture

Resume PDF
→ PDF Parser
→ Career Analyzer
→ LLM Client
→ Structured Career Profile

### Problems Solved

1. Mac Python environment issue
2. dotenv loading issue
3. LLM JSON parsing issue

### Next

- Connect frontend upload flow with backend API
- Generate customized resume
- Add JD matching capability

### Learning
- Swagger UI 上传失败，但 curl 成功，主要是swagger ui会错误解析，Swagger 对 multipart file array 支持不是特别友好。所以用curl测试绕过解析测试接口成功

## 2026-07-18 JD Match MVP Sprint

### Completed

- Completed JD Match backend (`POST /api/match`)
- Connected frontend `/jd` and `/jd-match` with backend API
- Added resume text & JD text input validation (empty / whitespace / missing)
- Fixed empty resume / empty JD handling (HTTP 400)
- Fixed multilingual output: system prompt and user prompt both enforce language-follows-resume/JD
- Removed all mock data from frontend pages (profile, jd-match)
- Finished end-to-end testing (9 test cases)

### Architecture

```
POST /api/analyze          POST /api/match
       │                          │
       ▼                          ▼
document_parser.py          job_matcher.py
       │                          │
       ▼                          ▼
career_analyzer.py          LLM Match Prompt
       │                          │
       ▼                          ▼
   llm_client.py  ←──────── llm_client.py
       │
       ▼
 OpenAI SDK → DeepSeek API
```

Parser Layer is decoupled from Match Engine. Future parsers (document, image) can be added without modifying match logic.

### Test Results

| Case | Scenario | Result |
|------|----------|--------|
| 1 | Chinese Resume + Chinese JD | 200, Chinese output |
| 2 | English Resume + English JD | 200, English output |
| 3 | `jd_text=""` | 400 |
| 4 | `jd_text="   "` | 400 |
| 5 | `resume_text=""` | 400 |
| 6 | `resume_text="\n\t"` | 400 |
| 7 | Both empty | 400 |
| 8 | Mismatched job roles | 200, low match score |
| 9 | Frontend integration | Passed |

### Product Decisions

1. **MVP only supports Text JD Analysis.** Frontend retains all three input methods (Paste JD, Upload Document, Upload Screenshot), but only Text Parser is implemented. Document Parser and Image Parser planned for future iterations.

2. **JD Match core value is AI matching, not OCR.** Parser Layer is architecturally decoupled from Match Engine. Adding new parsers in the future requires zero changes to match logic.

3. **User-facing output will use Match Level (A~E) instead of raw percentage.** Backend retains internal match_score for level mapping, model evaluation, and future optimization.

4. **Future: Prompt Versioning & Result Cache.** For identical combinations of Resume + JD + Prompt Version + Model, generate a unique hash. Cache results to avoid redundant LLM calls, ensuring consistency and cost efficiency.


## Date
2026-07-20

---

# Sprint 4 - Multimodal AI Gateway & JD Image Analysis

## 🎯 Goal

Enable AI Career Copilot to understand Job Description images using a multimodal LLM and complete the end-to-end workflow:

JD Image Upload
→ Vision Model
→ Structured JD Extraction
→ Resume Matching
→ Frontend Display

---

## ✅ Completed

### 1. Built Multimodal Provider Architecture

Implemented a provider abstraction that separates text and vision models.

Current architecture:

```
Upload
      │
Input Classifier
      │
Rule-based Router
      │
 ┌───────────────┐
 │               │
Text Model   Vision Model
DeepSeek      GLM-4.6V-Flash
```

Added:

- BaseLLMProvider
- GLMProvider
- Rule-based model router
- Input classifier

Environment variables:

```
TEXT_LLM_PROVIDER
VISION_LLM_PROVIDER
```

instead of using a single global provider.

---

### 2. Rule-based Model Routing

Implemented deterministic routing rules.

Current strategy:

- Text → Text LLM
- Image → Vision LLM
- Text PDF → Text LLM
- Scanned PDF → Vision LLM

The routing is based on input capability requirements rather than file extension only.

---

### 3. Added GLM-4.6V-Flash Support

Integrated GLM as the first multimodal provider.

Support includes:

- Image input
- OpenAI-compatible API
- Base64 image conversion
- Retry mechanism
- Unified Provider interface

---

### 4. Retry Mechanism

Implemented retry logic for temporary service overload.

Strategy:

Attempt 1
↓

Retry after 2 seconds

↓

Retry after 4 seconds

↓

Maximum 3 attempts

Only retry for recoverable errors such as:

- 429
- 502
- 503
- 504
- Service Busy

Non-recoverable errors immediately return.

---

### 5. Image Understanding Test

Created:

```
test_glm_image.py
```

Successfully verified image understanding.

Test image:

```
test_jd.png
```

Result:

- Correctly extracted Job Title
- Correctly extracted Responsibilities
- Correctly extracted Requirements
- Correctly extracted Education & Experience
- Returned "未识别到" when information was absent instead of hallucinating

Average response time:

~15 seconds

---

### 6. Frontend Integration

Completed full workflow:

JD Image Upload

↓

Backend

↓

Input Classifier

↓

Vision Router

↓

GLM

↓

Structured Result

↓

Resume Matching

↓

Frontend Display

The complete end-to-end pipeline has been successfully validated.

---

# 🐛 Problems Encountered

## 1. Gemini API

Issue:

Originally attempted to integrate Gemini.

Problem:

Gemini 2.0 Flash has been deprecated and quota testing was unsuccessful.

Decision:

Pause Gemini integration and switch to GLM as the primary multimodal provider.

---

## 2. GLM Service Busy

Issue:

Initial requests returned:

Current request volume is high. Please try again later.

Root Cause:

Temporary server capacity during free-tier usage.

Solution:

Implemented retry with exponential backoff.

Final Result:

```
SUCCESS after 6.1s
```

Provider implementation proved to be correct.

---

## 3. Vision Model Routing

Initial idea:

```
Image
↓

Always use GLM
```

Improved design:

```
Input

↓

Rule-based Router

↓

Vision Provider
```

This makes it easy to switch between GLM and Doubao later.

---

# 💡 Key Design Decisions

Instead of:

```
LLM_PROVIDER=deepseek
```

Adopted:

```
TEXT_LLM_PROVIDER
VISION_LLM_PROVIDER
```

Benefits:

- Multiple providers can coexist
- Better scalability
- Easier provider replacement
- Cleaner architecture

---

# 📚 What I Learned

### Technical

- Multimodal models use OpenAI-compatible message structures.
- Rule-based routing is simpler and more reliable than AI-based routing for MVP.
- Retry mechanisms significantly improve robustness when using free APIs.
- Separating text and vision providers improves maintainability.

### Product Thinking

The project has evolved from simply calling an LLM to building an AI Gateway.

The system now routes requests based on capability requirements rather than model identity.

This architecture is closer to real-world AI products.

---

# 🚀 Next Sprint

Sprint 5

Goals:

- Support structured JSON output for JD extraction.
- Add Doubao Vision Provider.
- Compare GLM vs Doubao:
  - Accuracy
  - Cost
  - Response time
  - JSON stability
- Continue improving AI Career Copilot toward production readiness.