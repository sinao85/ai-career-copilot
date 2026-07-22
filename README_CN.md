# AI Career Copilot

> AI-powered career assistant that helps job seekers understand job opportunities, identify skill gaps, and generate customized resumes.

AI Career Copilot 是一个基于大语言模型的 AI 职业助手，帮助求职者完成从简历理解到定制化简历生成的全流程。

它正在探索 **AI-native Career Operating System** 的实现方式——不是简单调用 LLM API，而是构建一个以用户职业成长为目标的 AI 产品系统。

---

## 产品解决的问题

传统求职流程中，用户面临的核心困境：

- 简历投递后石沉大海，**不知道简历是否匹配目标岗位**
- JD 篇幅长、信息密度高，**无法快速抓住重点要求**
- 面对 JD 修改简历时，**不知道应该突出哪些经历、弱化哪些内容**
- 职业发展过程中**缺少能力成长的量化反馈**

AI Career Copilot 通过 AI 理解你的简历和岗位要求，输出可执行的匹配分析和定制化建议。

---

## 当前功能

### 1. Resume Analysis / 简历分析

上传 PDF 简历后，AI 自动完成：

- 简历文本解析
- 职业画像生成（核心优势、技能图谱、职业方向）
- 结构化能力提取

### 2. JD Understanding / 职位理解

支持两种输入方式：

- **文本输入**：直接粘贴 JD 文本（≤1500 字符）
- **图片上传**：上传 JD 截图（PNG / JPG / WebP）

AI 提取结构化岗位信息：

- 岗位名称
- 岗位职责（条目化）
- 任职要求（条目化）
- 工作地点
- 学历与经验要求
- 薪资范围

技术亮点：

- 图片输入通过 **Vision LLM**（GLM-4.6V-Flash）识别
- 文本输入通过 **Text LLM**（DeepSeek）理解
- 系统根据输入类型自动路由到对应模型，而非绑定单一提供商

### 3. Resume Matching / 简历匹配

基于用户简历文本与目标 JD，进行深度匹配分析。

输出：

- **Match Score**：综合匹配度评分
- **Matching Strengths**：匹配优势点
- **Skill Gaps**：能力差距识别
- **Missing Keywords**：缺失的关键词
- **Improvement Suggestions**：简历改进建议

### 4. Customized Resume Generation / 定制化简历生成

根据目标岗位要求，生成定制版简历。

核心约束：

- **保持用户真实经历**——不编造、不虚构、不添加不存在的能力
- 输出：Target Resume + Customization Summary + Key Changes

设计原则：

> AI 的职责是帮用户更好地呈现真实经历，而不是代替用户创作虚假内容。

### 5. Resume Export / 简历导出

当前支持：

- **HTML Resume Export**：生成格式化简历 HTML，直接下载

Roadmap：

- PDF Export
- Word Export

---

## 产品流程

```
Resume Upload / 上传简历
    ↓
Resume Analysis / 简历分析
    ↓
JD Analysis / 职位理解（文本 / 图片）
    ↓
Resume Matching / 简历匹配
    ↓
Customized Resume / 定制化简历生成
    ↓
Export / 导出
```

---

## 技术架构

### Frontend

- Next.js 16（App Router）
- React 19
- TypeScript
- Tailwind CSS

### Backend

- FastAPI（Python）
- Uvicorn
- uv（Python 包管理器）

### AI Layer / 智能层

系统采用 **Provider Architecture**，不绑定单一模型：

```
BaseLLMProvider
    ├── Text Provider
    │   ├── DeepSeek
    │   └── Gemini
    └── Vision Provider
        └── GLM-4.6V-Flash
```

设计决策：

- 根据**能力类型**（文本理解 / 视觉理解）进行模型路由
- 各提供商实现统一接口 `generate()`，方便扩展
- 图片输入自动路由到 Vision Provider，无需手动切换

---

## 迭代记录

### Sprint 1 — 项目基础

- Frontend 项目搭建
- Backend 项目搭建
- 前后端联调打通

### Sprint 2 — 简历智能

- PDF 简历解析
- 职业画像生成（LLM）
- 解析结果前端展示

### Sprint 3 — AI Gateway

- Provider 抽象层设计
- 多模型架构实现
- 模型路由逻辑

### Sprint 4 — 多模态 JD 理解

- JD 图片上传与视觉识别
- Vision Model 集成（GLM-4.6V-Flash）
- JD 结构化提取
- 简历匹配分析（Match Score + Gaps）

### Sprint 5 — 定制化简历

- AI 定制化简历生成
- Customization Reasoning 展示
- 简历分段预览
- HTML 简历导出
- 三栏布局：AI Reasoning / Resume Preview / Export

---

## 工程原则

### Product First / 产品优先

优先解决用户价值问题，技术架构服务于产品体验。

### Rule First / 规则优先

确定性逻辑不交给 LLM 处理。例如，输入验证、文件类型判断、模型路由均由规则层处理。

### Capability-based Architecture / 能力驱动架构

不以模型为中心，以**能力**（文本理解、视觉理解）为中心设计系统结构。

### Iterative Development / 迭代开发

每个功能遵循：原型验证 → Backend API → Frontend 集成 → 端到端测试

---

## 未来规划

### AI 质量提升

- Prompt 持续优化
- 评估数据集构建
- 输出一致性与质量监控

### 结构化简历引擎

- 结构化简历 Schema
- 多样式模板支持
- 更高质量的导出管线

### 职业记忆系统

- 简历版本历史
- 投递记录追踪
- 职业能力成长可视化

### AI Career Intelligence

- AI 产品经理岗位趋势追踪
- 能力差距分析
- 学习路径推荐
