# AI Career Copilot Technical Design

Version: V0.1

---

# 1. 技术目标

构建一个 AI 职业分析 Web 应用。

重点验证：

LLM 是否能够理解用户职业资料。

---

# 2. 技术原则

## 2.1 快速验证

优先完成：

AI闭环。

不提前建设复杂系统。

---

## 2.2 模型可替换

系统不绑定具体模型。

支持：

- OpenAI
- Claude
- Gemini
- 国内大模型


---

## 2.3 AI输出结构化

AI输出 JSON。

方便：

- 前端展示
- 后续RAG
- Agent调用

---

# 3. 系统架构

```

User

↓

Frontend
React

↓

Backend API
Node.js

↓

AI Service Layer

↓

LLM Provider

↓

LLM Model

↓

Structured JSON

↓

Frontend Display

```

---

# 4. 技术模块

## Frontend

负责：

- 用户输入
- 页面展示
- API调用


技术：

React


---

## Backend

负责：

- API管理
- Prompt组合
- AI调用
- 数据转换


技术：

Node.js


---

## AI Service

负责：

统一管理模型调用。


避免业务代码直接依赖模型。


---

# 5. 项目结构

```

ai-career-copilot

├── frontend

├── backend

├── docs

└── README.md

```

---

# 6. Backend结构

```

backend

├── routes

├── services
│   └── aiService

├── prompts

├── llm

└── utils

```

---

# 7. AI调用流程

```

用户输入

↓

Frontend

↓

Backend API

↓

Prompt Template

↓

AI Service

↓

LLM Provider

↓

JSON Response

↓

Frontend展示

```

---

# 8. 数据流

Input:

```

Resume

*

Career Notes

*

Job Description

```

↓

AI Processing

↓

Output:

```

Career Profile

Skills

Projects

Job Match

Resume Optimization

```

---

# 9. 未来RAG升级

V0.2:

```

Career Documents

↓

Document Processing

↓

Embedding

↓

Vector Database

↓

Retriever

↓

LLM

↓

Answer

```

---

# 10. 当前不实现

- RAG
- Database
- Authentication
- Agent
- Model Training
