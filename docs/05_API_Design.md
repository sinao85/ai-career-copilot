# API Design

## 1. Overview

Backend 负责：

- 接收用户职业资料（Resume + Work Materials）
- 提取上传文档内容
- 调用 AI 模型进行职业理解
- 生成结构化 Career Profile
- 为前端提供职业分析、JD 匹配、简历生成能力

The Backend is designed around structured AI outputs rather than free-form text, ensuring that frontend components can reliably render, compare, and edit AI-generated career insights.


## 2. API List


### POST /api/analyze

用途：

该接口用于将用户上传的 Resume 和 Work Materials 转换为结构化职业信息。


输入：

multipart/form-data


参数：

resume:
PDF/DOCX


work_materials:
PDF/DOCX/图片/文本文件


返回：

JSON


示例：

{
"profile":{
"career_direction":"",
"strengths":[],
"skills":[],
"growth_areas":[],
"projects":[
  {
   "name":"",
   "role":"",
   "achievement":""
  }
]
}
}


说明：

projects 字段用于保存 AI 从用户工作资料中提取出的项目经历，为后续 JD 匹配和简历生成提供基础。


---

### POST /api/match

用途：

JD匹配。


输入：

{
"career_profile":{},
"job_description":"AI Product Manager..."
}


输出：

{
"match_score":85,
"strengths":[],
"gaps":[],
"suggestions":[]
}


说明：

该接口不仅用于计算匹配度，还需要提供：

- 用户匹配优势
- 岗位能力差距
- 简历优化建议


---

### POST /api/generate-resume

用途：

该接口用于根据：

- Career Profile
- Target Job Description

生成针对目标岗位优化后的简历。


输出结构化内容：

{
"summary":"",
"experience":[],
"projects":[],
"skills":[]
}


说明：

避免只返回一段文本，确保输出结构化内容便于前端展示和编辑。


---

## 3. Data Flow

描述：

Frontend
↓
Backend API
↓
Document Parser
↓
Career Information Extraction
↓
LLM Reasoning
↓
Structured JSON Response
↓
Frontend Display


说明：

Document Parser 负责提取文档内容；
Career Information Extraction 负责从资料中提炼用户经历；
LLM 负责理解和生成职业洞察。


---

## 4. Error Handling

包括：

- 文件格式错误
- 文件为空
- AI生成失败


---

## 5. API Responsibility

说明每个 API 的职责：


### Analyze API

负责：

将用户上传的职业资料转换为结构化职业信息。


### Match API

负责：

比较用户职业能力与目标岗位需求，输出匹配分析。


### Generate Resume API

负责：

根据岗位要求重新组织用户经历，生成针对性的简历内容。


---

注意：

这是 AI Career Copilot MVP 阶段 API Design 文档。

不要加入：
- 微服务架构
- 数据库设计
- RAG实现
- Agent workflow

这些属于未来版本规划。