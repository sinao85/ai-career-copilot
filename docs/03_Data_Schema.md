# AI Career Copilot Data Schema

Version: V0.1

---

# 1. 数据设计目标

AI Career Copilot 的核心任务：

将用户非结构化职业资料：

- 简历
- 工作记录
- 项目文档
- Markdown笔记

转化为结构化职业资产。


数据设计目标：

1. AI可以稳定理解职业信息
2. 前端可以展示分析结果
3. 未来可以支持RAG知识库
4. 未来可以支持Career Agent调用

---

# 2. 数据流

```

Raw Career Data

↓

AI Processing

↓

Career Profile

↓

User Confirmation

↓

Career Knowledge Base

```

---

# 3. 输入数据模型

## CareerInput

用户输入数据。


```json
{
  "resume": "",
  "career_notes": "",
  "job_description": ""
}
```

---

## 字段说明

### resume

类型：

string

说明：

用户简历文本。

示例：

```
2023-2026 产品经理

负责健康产品增长。
```

---

### career_notes

类型：

string

说明：

用户工作资料。

支持：

* Markdown
* 项目复盘
* 周报
* 自由文本

示例：

```
项目背景：

用户活跃下降


我的职责：

设计增长方案


结果：

提升用户参与
```

---

### job_description

类型：

string

说明：

目标岗位JD。

---

# 4. AI输出模型

## CareerProfile

代表用户职业画像。

```json
{
  "role":"",
  "experience_level":"",
  "career_direction":"",
  "summary":""
}
```

---

字段：

## role

用户主要职业身份。

例如：

```
产品经理
```

---

## experience_level

经验阶段。

例如：

```
初级
中级
高级
```

---

## career_direction

职业方向。

例如：

```
AI产品经理

增长产品方向
```

---

## summary

职业总结。

---

# 5. Skill模型

表示用户能力。

```json
[
 {
  "name":"",
  "level":"",
  "evidence":"",
  "confidence":0
 }
]
```

---

字段：

## name

能力名称。

例如：

```
用户增长
```

---

## level

能力强度。

例如：

```
strong

medium

weak
```

---

## evidence

能力依据。

例如：

```
负责增长机制设计
```

---

## confidence

AI判断置信度。

范围：

0-1

---

# 6. Project模型 ⭐

项目是职业知识核心。

未来RAG主要围绕Project建立。

```json
{
"name":"",
"background":"",
"goal":"",
"role":"",
"actions":[],
"results":[],
"skills":[]
}
```

---

字段：

## name

项目名称。

---

## background

项目背景。

回答：

为什么做？

---

## goal

项目目标。

---

## role

用户角色。

---

## actions

具体行动。

例如：

```json
[
"分析用户行为",
"设计产品方案"
]
```

---

## results

项目结果。

注意：

如果没有数据：

不能生成。

---

## skills

关联能力。

---

# 7. JobMatch模型

用户和岗位匹配结果。

```json
{
"score":0,
"strengths":[],
"gaps":[],
"recommendations":[]
}
```

---

字段：

## score

匹配分数。

0-100。

---

## strengths

优势。

---

## gaps

差距。

---

## recommendations

提升建议。

---

# 8. ResumeOptimization模型

```json
{
"original":"",
"optimized":"",
"reason":""
}
```

---

字段：

original:

原始描述。

optimized:

优化后的描述。

reason:

为什么这样优化。

---

# 9. 完整输出结构

```json
{
 "career_profile":{},

 "skills":[],

 "projects":[],

 "job_match":{},

 "resume_optimization":[]
}
```

---

# 10. 数据设计原则

## 原则1

事实优先。

AI不能增加：

* 虚假数据
* 虚假成果

---

## 原则2

保留Evidence。

每个能力需要来源。

---

## 原则3

面向未来RAG设计。

核心知识单元：

Project。

未来：

Project → Embedding → Knowledge Base
