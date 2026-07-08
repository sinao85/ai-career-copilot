# AI Career Copilot API Design

Version: V0.1


---

# 1. API设计目标

API负责连接：

Frontend

和

AI Backend


目标：

1. 接收用户输入
2. 调用AI能力
3. 返回结构化结果


---

# 2. API架构


```

Frontend

↓

HTTP Request

↓

Backend API

↓

AI Service

↓

LLM Provider

↓

Response

```


---

# 3. 通用规范


## Base URL

Development:

```

http://localhost:3000

```


---

## 数据格式

Request:

JSON


Response:

JSON


---

# 4. Career Analysis API


## Endpoint

```

POST /api/analyze-career

```


---

## 功能

分析用户职业资料。


输入：

- 简历
- 工作资料


输出：

- 职业画像
- 技能
- 项目


---

## Request


```json
{
 "resume":
 "产品经理，负责健康产品",

 "career_notes":
 "负责用户增长项目"
}
```

---

## Backend处理流程

```
Receive Data

↓

Build Prompt

↓

Call LLM

↓

Validate JSON

↓

Return Result

```

---

## Response

```json
{
 "career_profile":{
   "role":"产品经理",
   "career_direction":"增长产品"
 },

 "skills":[
   {
    "name":"用户增长",
    "evidence":"负责增长项目"
   }
 ],

 "projects":[]
}
```

---

# 5. Job Match API

## Endpoint

```
POST /api/match-job
```

---

## 功能

分析：

用户能力

vs

岗位要求。

---

## Request

```json
{
 "career_profile": {},

 "job_description":
 "AI产品经理岗位"
}
```

---

## Response

```json
{
 "score":80,

 "strengths":[
 "用户增长经验"
 ],

 "gaps":[
 "AI项目经验"
 ],

 "recommendations":[
 "增加AI应用实践"
 ]
}
```

---

# 6. Resume Optimization API

## Endpoint

```
POST /api/optimize-resume
```

---

## 功能

优化项目经历表达。

---

## Request

```json
{
 "project":{

 },

 "job_description":""
}
```

---

## Response

```json
{
 "original":"负责增长",

 "optimized":
 "负责用户增长策略设计",

 "reason":
 "突出产品价值"
}
```

---

# 7. Error Handling

## 参数为空

Response:

```json
{
 "error":
 "Missing required field"
}
```

---

## AI调用失败

Response:

```json
{
 "error":
 "AI service unavailable"
}
```

---

## JSON解析失败

处理：

1. Retry
2. 返回错误
3. 记录日志

---

# 8. API未来扩展

## RAG接口

未来：

```
POST /api/search-career-memory
```

功能：

检索职业知识库。

---

## Agent接口

未来：

```
POST /api/career-agent
```

功能：

执行复杂职业任务。
