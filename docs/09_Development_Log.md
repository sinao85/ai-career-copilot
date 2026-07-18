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
- Swagger UI 上传失败，但 curl 成功，主要是swagger ui会错误解析，Swagger 对 multipart file array 支持不是特别友好。所以用curl测试绕过解析测试接口成功
