# AI Workflow Design

## 1. Overview

介绍 AI Career Copilot 的核心目标：

AI Career Copilot 不只是一个简历优化工具，而是通过理解用户的职业资料（Resume + Work Materials），帮助用户发现职业能力、匹配目标岗位，并生成针对性的职业表达。

核心价值：

用户过去经历
+
目标岗位需求
+
AI理解能力

↓

生成更准确的职业定位和求职材料。


---

## 2. Input Layer

说明 AI 的输入来源。


### 2.1 Resume

用户上传：

- PDF
- DOCX

AI需要理解：

- Basic Information
- Education
- Work Experience
- Projects
- Skills


目标：

建立用户基础职业信息。


---

### 2.2 Work Materials

说明这是 AI Career Copilot 的核心差异能力。

用户可以上传：

- 项目PRD
- 产品方案
- 会议记录
- 工作总结
- 项目复盘
- 数据分析报告
- 其他工作产出


AI需要从这些资料中提取：

- 用户负责的项目
- 用户承担的角色
- 用户解决的问题
- 用户使用的方法
- 用户产生的结果
- 用户具备的能力


目标：

帮助 AI 理解用户真实职业经历，而不是只依赖简历。


---

## 3. AI Processing Workflow

描述 AI 的处理流程。


### 3.1 Document Understanding

目标：

理解用户上传资料内容。

输入：

Resume + Work Materials


输出：

结构化职业信息：

包括：

- Experience
- Projects
- Responsibilities
- Achievements
- Skills


示例 JSON：

{
  "project": "",
  "role": "",
  "responsibilities": [],
  "achievements": [],
  "skills": []
}


---

### 3.2 Career Profile Generation

目标：

根据用户所有资料生成职业画像。


输出：

包括：

- Career Direction
- Core Strengths
- Professional Skills
- Project Experience
- Growth Opportunities


示例：

用户可能被识别为：

AI Product Manager

核心优势：

- User Research
- Product Strategy
- AI Product Design


---

### 3.3 JD Matching

输入：

Career Profile

+
Target Job Description


AI分析：

- Match Score
- Matching Strengths
- Missing Skills
- Improvement Suggestions


---

### 3.4 Customized Resume Generation

输入：

- Career Profile
- JD Requirements


输出：

针对目标岗位优化后的简历内容。


包括：

- Professional Summary
- Work Experience
- Project Experience
- Skills


---

## 4. AI Output Structure

定义前端需要展示的数据结构。

示例：

{
"profile": {
"career_direction": "",
"strengths": [],
"skills": [],
"growth_areas": []
},

"match": {
"score": 0,
"strengths": [],
"gaps": []
},

"resume": {}
}


---

## 5. Future Extension

简单说明未来方向：

Career Knowledge Base

支持：

- Notion
- Google Drive
- Github
- Other personal knowledge sources


未来可以通过 RAG 技术，让 AI 长期理解用户职业成长。


注意：

当前 MVP 不实现该部分。


---

## Product Principle

AI Career Copilot 的核心不是简单生成文字，而是帮助用户：

从过去经历中发现职业价值，
并根据未来目标岗位重新表达自己的能力。