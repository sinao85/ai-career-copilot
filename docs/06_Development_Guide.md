# AI Career Copilot Development Guide

> **Merge History**: This document was created by merging `06_Development_Plan.md` and `07_Development_Environment_Setup.md` on 2026-07-13.

Version: V0.1

---

# 1. 开发目标

在3天内完成：

AI Career Copilot MVP Demo。

实现：

```
用户输入职业资料
    ↓
AI分析
    ↓
生成职业画像
```

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

## Day 1：Frontend Prototype

**目标：**

完成产品界面。

---

**任务：**

### 初始化React项目

完成：

- 项目创建
- 页面结构

---

### 输入页面

包含：

```
简历输入框
工作资料输入框
目标岗位输入框
分析按钮
```

---

### Result页面

展示：

```
职业画像
技能
项目
```

**数据：**

使用Mock。

不连接AI。

---

**Day 1验收标准**

用户可以：

输入资料 → 点击按钮 → 看到模拟结果。

---

## Day 2：AI Integration

**目标：**

接入LLM。

---

**任务：**

### Backend创建

完成：

Node.js API。

---

### AI Service

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

### Career Analyzer

接入：

career analyzer prompt。

---

**Day 2验收标准**

用户输入真实简历 → 得到AI职业分析结果。

---

## Day 3：产品完善

**任务：**

### JD匹配

增加：

岗位分析。

---

### 简历优化

增加：

优化建议。

---

### Error Handling

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

---

# 6. 开发环境原则

## 6.1 代码不依赖单台电脑

项目代码必须通过 Git 管理。

开发环境：

```
Computer
    ↓
Git Repository
    ↓
GitHub
    ↓
Another Computer
```

代码、文档、配置说明进入 Git。

本地环境不进入 Git。

---

## 6.2 不上传本地依赖

禁止上传：

```
node_modules
.env
系统配置文件
个人密钥
```

Git保存：

```
package.json
package-lock.json
source code
documentation
```

换电脑后重新安装依赖。

---

# 7. 必备开发环境

所有开发机器需要：

## 7.1 Git

用途：

- 版本管理
- 同步代码

检查：

```bash
git --version
```

成功：

```
git version x.x.x
```

---

## 7.2 Node.js

用途：

运行：

* React frontend
* Node backend

检查：

```bash
node -v
```

---

## 7.3 Cursor

用途：

AI辅助开发。

安装：

* 登录个人Cursor账号
* 打开项目目录

---

# 8. Node版本管理

## 问题

不同电脑Node版本不同可能导致：

* 依赖安装失败
* 运行异常

例如：

```
Mac: Node 22
Windows: Node 20
```

可能产生兼容问题。

---

## 解决方案

项目根目录添加：

```
.nvmrc
```

内容：

```
22
```

表示：

项目统一使用Node 22。

---

# 9. 项目目录规范

项目结构：

```
ai-career-copilot
├── docs
├── frontend
├── backend
├── README.md
├── package.json
└── .gitignore
```

---

# 10. Git忽略文件

根目录：

```
.gitignore
```

必须包含：

```
node_modules/
.env
.DS_Store
dist/
build/
```

---

## node_modules

原因：

体积巨大。

不同系统需要重新生成。

恢复：

```bash
npm install
```

---

## .env

原因：

保存敏感信息：

例如：

```
API_KEY
DATABASE_PASSWORD
```

不能上传。

---

# 11. 环境变量管理

## 错误方式

不要：

```javascript
const API_KEY="xxxx"
```

原因：

代码上传后可能泄露。

---

## 正确方式

backend:

```
.env
```

内容：

```
LLM_API_KEY=xxxx
```

代码读取：

```
process.env.LLM_API_KEY
```

---

## 新电脑配置

步骤：

1. 创建.env
2. 填入自己的Key
3. 不提交Git

---

# 12. Mac → Windows迁移流程

## Step 1

在Mac完成开发。

提交代码：

```bash
git add .
git commit -m "update feature"
git push
```

---

## Step 2

Windows安装：

* Git
* Node.js
* Cursor

---

## Step 3

Clone项目

```bash
git clone <repository-url>
cd ai-career-copilot
```

---

## Step 4

安装Frontend依赖

```bash
cd frontend
npm install
```

---

## Step 5

安装Backend依赖

```bash
cd backend
npm install
```

---

## Step 6

配置环境变量

创建：

```
.env
```

填入：

```
LLM_API_KEY=
```

---

## Step 7

运行项目

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

---

# 13. Mac和Windows代码注意事项

## 13.1 文件路径

不要：

```javascript
"/Users/name/project/test.md"
```

因为Windows不存在。

---

正确：

使用：

```javascript
path.join()
```

让系统自动处理。

---

## 13.2 文件名称大小写

Mac:

部分情况下：

```
Test.js
test.js
```

可能共存。

Windows:

通常认为相同。

规范：

文件名统一：

```
lowercase
```

例如：

推荐：

```
career-service.js
```

不要：

```
CareerService.js
```

---

# 14. Cursor使用规范

打开项目后：

第一步：

让Cursor读取：

```
docs/
```

Prompt:

```
请阅读docs目录中的所有设计文档。

理解：
1. 产品目标
2. 技术架构
3. 当前开发阶段

不要修改代码。
```

---

# 15. 开发提交规范

每完成一个功能：

提交一次。

格式：

```
git add .
git commit -m "功能描述"
git push
```

示例：

```
git commit -m "create career input page"
git commit -m "integrate llm service"
```

---

# 16. 常见问题

## npm install失败

检查：

Node版本：

```bash
node -v
```

删除：

```
node_modules
```

重新：

```bash
npm install
```

---

## Git冲突

不要直接覆盖。

流程：

```bash
git status
git pull
解决冲突
git commit
git push
```

---

## API无法调用

检查：

1. .env是否存在
2. Key是否正确
3. Backend是否启动

---

# 17. 新电脑恢复Checklist

## Environment

[ ] Git安装
[ ] Node安装
[ ] Cursor安装

---

## Project

[ ] Clone GitHub
[ ] npm install frontend
[ ] npm install backend
[ ] 创建.env

---

## Verify

[ ] Frontend运行
[ ] Backend运行
[ ] AI API正常调用

---

# 18. 最重要原则

代码属于项目。

电脑只是开发工具。

只要：

GitHub存在 * 文档完整 * 环境说明清晰

任何电脑都可以恢复开发。