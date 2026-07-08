# AI Career Copilot Development Plan

Version: V0.1


---

# 1. 开发目标


在3天内完成：

AI Career Copilot MVP Demo。


实现：

用户输入职业资料

↓

AI分析

↓

生成职业画像


---

# 2. 开发原则


## Principle 1

先完成闭环。


不要先优化：

- UI
- 架构
- 数据库


---

## Principle 2

保持简单。


V0.1：

不做：

- 登录
- 数据库
- RAG
- Agent


---

# 3. 开发阶段


# Day 1：Frontend Prototype


目标：

完成产品界面。


---

任务：


## 初始化React项目


完成：

- 项目创建
- 页面结构


---

## 输入页面


包含：


```

简历输入框

工作资料输入框

目标岗位输入框

分析按钮

```


---

## Result页面


展示：

```

职业画像

技能

项目

```


---

数据：

使用Mock。

不连接AI。


---

# Day 1验收标准


用户可以：

输入资料

点击按钮

看到模拟结果。


---

# Day 2：AI Integration


目标：

接入LLM。


---

任务：


## Backend创建


完成：

Node.js API。


---

## AI Service


实现：

```

Frontend

↓

Backend

↓

AI Service

↓

LLM

```


---

## Career Analyzer


接入：

career analyzer prompt。


---

# Day 2验收标准


用户输入：

真实简历


得到：

AI职业分析结果。


---

# Day 3：产品完善


任务：


## JD匹配


增加：

岗位分析。


---

## 简历优化


增加：

优化建议。


---

## Error Handling


处理：

- 空输入
- AI失败


---

# 4. Cursor开发方式


不要一次生成整个项目。


采用：

小任务驱动。


每次告诉Cursor：

```

背景：

我要开发AI Career Copilot。

当前任务：

xxx

限制：

保持简单，不增加额外功能。

完成后说明：

修改文件

代码作用

运行方式

```


---

# 5. 后续优化路线


## V0.2


增加：

- 数据保存
- 用户账号
- RAG知识库


---

## V1.0


增加：

Career Agent。


支持：

- 面试准备
- 职业规划
- 学习建议
