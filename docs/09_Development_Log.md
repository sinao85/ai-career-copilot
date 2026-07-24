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

---

# Sprint 5 - Customized Resume Generation & Delivery

## Sprint Goal

本阶段目标：

完成从：

```
Resume Understanding
    ↓
JD Understanding
    ↓
Resume Matching
    ↓
Customized Resume Generation
```

的完整用户闭环。

核心目标：

让用户不仅知道自己是否匹配岗位，还可以直接获得针对目标岗位优化后的简历。

---

## Completed Features

### 1. Customized Resume Generation

新增 AI Resume Generator。

输入：

- Original Resume
- Target Job Description
- Career Profile
- Match Analysis

输出：

- Customized Resume
- Customization Summary
- Key Changes

设计原则：

AI 可以优化表达和突出匹配能力，但必须保持用户真实经历。

禁止：

- 编造项目
- 虚构技能
- 添加不存在的数据
- 修改事实信息

---

### 2. Frontend Resume Preview

新增 Customized Resume 页面。

实现：

- AI customization reasoning 展示
- Key changes 展示（✓ 列表样式）
- Customized Resume Preview（按段落拆分展示，自动识别标题行）

优化：

从 mock resume 数据切换到真实 AI 生成结果。

移除了 7 个硬编码数据常量（personalInfo、education、experiences、projects、productSkills、aiSkills、technicalSkills），所有展示均来自 `POST /api/generate` 返回的真实数据。

页面目标：

让用户理解 AI 为什么这样修改简历，而不仅仅看到最终文本。

---

### 3. HTML Resume Export

新增 HTML Resume Export 能力。

原因：

当前阶段优先保证：

- 输出稳定
- 页面展示一致
- 用户可以获得可使用结果

技术选择：

HTML 优先。

相比直接生成 Word/PDF：

优势：

- 浏览器渲染稳定
- 样式控制简单
- 页面预览与下载格式同源（同一套 `parseResumeSections` + 样式）
- 后续可以扩展 PDF 导出

暂不深入：

- Word Export（显示 "Coming Soon"）
- PDF Export（显示 "Coming Soon"）

后续将在 Structured Resume Schema 基础上统一实现。

---

### 4. Session-based Data Flow

引入 sessionStorage 作为流程数据传递方式。

数据流转：

| 页面 | 写入 Key | 内容 |
|---|---|---|
| Upload | `careerAnalysisResult` | 简历文本 + 职业画像 |
| JD | `jdText` | 目标 JD 文本 |
| JD | `jdMatchResult` | 匹配分析结果 |
| Custom Resume | 读取以上 3 个 key | 调用 /api/generate |

当前限制：刷新后数据丢失。未来将升级为 User Account + Career Memory 持久化方案。

---

## Product Decisions

### Decision 1: Complete User Workflow Before Deep Optimization

本阶段优先完成用户完整体验闭环，而不是提前优化：

- 复杂模板
- 多格式导出
- 高级编辑能力

原因：

首先验证用户是否需要 AI 生成目标岗位简历。

---

### Decision 2: Keep Resume Output Human-readable

当前阶段优先保证：

- 简历内容质量
- 阅读体验
- 修改逻辑透明

未来：升级为结构化 Resume Schema。

---

### Decision 3: Three-Column Layout for Resume Delivery

Customized Resume 页面采用三栏布局：

```
AI Reasoning  |  Resume Preview  |  Export
```

理由：

- 用户需要理解 AI 做了什么（左侧）
- 用户需要看到最终结果（中间）
- 用户需要有明确的行动出口（右侧）

将导出按钮从页面底部移到右侧固定区域，让用户在看完简历后自然完成导出动作，减少滚动摩擦。

---

## Technical Improvements

完成：

- Resume Generation API（`POST /api/generate`）
- Frontend API Integration（useEffect + sessionStorage 读取）
- Resume Preview Rendering（按空行分段 + 标题识别）
- HTML Export Workflow（客户端生成 + API fallback）
- Three-column responsive layout

当前架构：

```
User Input
    ↓
LLM Processing
    ↓
Structured Response
    ↓
Frontend Presentation（分段 + 标题识别）
    ↓
Export（HTML / Coming Soon: Word & PDF）
```

---

## Current Limitations

### 1. Resume Output Schema

当前：

`customized_resume` 为纯文本格式。

影响：

- Word Export 需要结构化 Schema
- PDF Export 需要模板引擎
- 无法切换简历样式

未来：Structured Resume Engine。

---

### 2. Data Persistence

当前：

使用 sessionStorage 保存流程数据。

问题：

- 刷新后数据丢失
- 无法跨设备同步
- 无法追踪历史版本

未来：

- User Account
- Resume Storage
- Career Memory

---

### 3. AI Quality Evaluation

当前：

主要通过人工验证 Prompt 效果。

未来：

- Prompt Evaluation Dataset
- Output Quality Metrics
- Regression Testing

---

## Sprint 5 Key Learning

AI 产品不仅需要 Generation，还需要 Presentation + Delivery。

完整 AI 产品体验：

```
Input
    ↓
AI Understanding
    ↓
AI Generation
    ↓
User-facing Output
    ↓
Actionable Delivery
```

本 Sprint 的关键洞察：

> 如果 AI 生成的结果不能以用户可理解、可使用的形式交付，生成能力本身的价值会大打折扣。产品设计的工作是从"AI 能做什么"到"用户能用它做什么"的桥梁。

---

## Next Sprint Direction

Sprint 6 优先级：

1. **Product Deployment**
   - Frontend deployment
   - Backend deployment
   - Environment configuration

2. **AI Quality Improvement**
   - Prompt optimization
   - Evaluation framework
   - Output consistency

3. **Architecture Improvement**
   - Structured Resume Schema
   - Better Export Pipeline

4. **Career OS Exploration**
   - Career Memory
   - Job Market Intelligence
   - Skill Gap Recommendation

## 2026-07-23 Deployment Preparation

### Completed

- Improved homepage branding and Hero section
- Completed i18n expansion
- Verified in-memory PDF processing
- Completed regression testing before deployment

### Test Results

- Backend syntax check: Passed
- API validation: Passed
- Document parser: Passed
- GLM vision test: Passed
- Frontend production build: Passed

### Next

Deploy frontend and backend services.
