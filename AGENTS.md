# AGENTS.md

Guide for agentic coding agents operating in this Vue 3 + TypeScript repository.

---

## ⚠️ 核心原则

1. **先做规划** - 执行任务时必须输出 todolist 进行规划，禁止直接执行
2. **验证命令** - 运行命令后必须验证执行成功（进程、端口、输出）
3. **完整验收** - 任务完成前必须运行 `typecheck + lint + test` 并展示结果
4. **Diff 摘要** - 每次修改文件必须提供 diff 摘要
5. **测试先行** - 新增代码必须编写对应的单元测试
6. **沟通语言** - 思考过程用中文表述

---

## 🛡️ 强制技能

| Skill                   | 用途                           |
| ----------------------- | ------------------------------ |
| `delegation-enforcer`   | 强制委托优先，禁止直接实现     |
| `pre-action-self-check` | 行动前自检：意图 → 分类 → 委托 |
| `operation-tracker`     | 操作追踪，防止上下文耗尽       |
| `safe-file-deletion`    | 删除文件前必须获得用户许可     |

---

## 🎯 委托协议

### 任务分类

| 任务类型      | Category             | 技能             |
| ------------- | -------------------- | ---------------- |
| UI/样式/CSS   | `visual-engineering` | `frontend-ui-ux` |
| 复杂逻辑/算法 | `ultrabrain`         | -                |
| 研究+实现     | `deep`               | `file-search`    |
| 单文件修改    | `quick`              | -                |
| 文档          | `writing`            | -                |

### 委托提示词结构（6 部分）

```
1. TASK: 原子化目标
2. EXPECTED OUTCOME: 具体交付物和成功标准
3. REQUIRED TOOLS: 工具白名单
4. MUST DO: 详细要求
5. MUST NOT DO: 禁止行为
6. CONTEXT: 文件路径、模式、约束
```

### Session 连续性

每个 `task()` 输出包含 `session_id`，后续必须使用：

```typescript
task((session_id = 'ses_xxx'), (prompt = '继续修复...'))
```

---

## 🚀 项目命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run dev:mock     # Mock 模式（无需后端）
npm run build        # 生产构建
npm run preview      # 预览构建

# 质量检查
npm run lint         # ESLint 检查
npm run typecheck    # TypeScript 类型检查
npm run test:run     # 运行测试

# 测试特定文件
npm run test -- path/to/test.spec.ts
```

**验证命令执行成功**：检查进程、端口、输出中是否包含 "ready"。

---

## 💻 开发服务器协议

**必须使用 tmux 启动开发服务器**，防止僵尸进程：

```bash
# 启动
tmux new-session -d -s vite-dev "npm run dev"

# 停止
tmux kill-session -t vite-dev

# 验证
tmux list-sessions
ps aux | grep vite
```

---

## 📝 代码风格

### 导入顺序

```typescript
import { ref, computed } from 'vue' // Vue 核心
import { useRouter } from 'vue-router' // Vue 生态
import { someLibrary } from 'third-party' // 第三方库
import MyComponent from '@/components/MyComponent.vue' // 本地组件
import { useUserStore } from '@/stores/user' // 本地状态
import type { User } from '@/types' // 类型
```

### 格式化

- 缩进：2 spaces
- 引号：单引号
- 分号：无分号 (`semi: false`)
- 行宽：100 字符
- Vue SFC：`<script setup>` → `<template>` → `<style>`

### 命名规范

| 类型       | 命名                 | 示例                         |
| ---------- | -------------------- | ---------------------------- |
| 组件       | PascalCase           | `UserProfile.vue`            |
| Composable | camelCase + use      | `useUserAuth.ts`             |
| Store      | camelCase + use 后缀 | `user.ts` → `useUserStore()` |
| 类型       | PascalCase           | `User`, `UserProfile`        |
| 常量       | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`            |
| 模板 ref   | ref 后缀             | `inputRef`, `formRef`        |

### TypeScript

- 使用 `interface` 定义对象类型
- 使用 `defineProps<T>()` 和 `defineEmits<T>()` 泛型语法
- 公共 API 必须标注参数和返回类型

---

## 📁 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 可复用组件
│   └── common/      # 通用 UI 组件
├── composables/     # Vue composables
├── router/          # 路由配置
├── stores/          # Pinia 状态
├── types/           # 类型定义
├── utils/           # 工具函数
├── views/           # 页面组件
├── App.vue          # 根组件
└── main.ts          # 入口文件
```

---

## 🧪 测试规范

- 框架：Vitest + Vue Test Utils
- 命名：`*.spec.ts` 或 `*.test.ts`
- 位置：与源文件同级或 `__tests__/`

**代码修改后必须运行**：

```bash
npm run test:run    # 测试通过
npm run typecheck   # 类型检查
npm run lint        # 代码质量
```

---

## ✅ 任务完成协议

任务完成前必须验证：

1. ✅ `npm run typecheck` - 无类型错误
2. ✅ `npm run test:run` - 测试全部通过
3. ✅ `npm run lint` - 无 lint 错误
4. ✅ 功能验证 - 启动开发服务器验证

**失败处理**：

- 不要跳到下一步
- 立即修复问题
- 重新运行命令直到成功
- 展示成功输出

---

## 📦 项目信息

- **项目**：工具平台类分析系统
- **技术栈**：Vue 3 + TypeScript + Element Plus + Pinia + Axios
- **后端**：Python Django + DRF + JWT（独立仓库）
- **详细规划**：参见 [PROJECT.md](./PROJECT.md)

---

## 🔧 VSCode 扩展

- Volar - Vue 语言特性
- ESLint - 代码检查
- Prettier - 代码格式化
- Pretty TS Errors - TypeScript 错误美化

---

## 📋 Pre-commit 检查

提交前必须运行：

```bash
npm run lint
npm run typecheck
npm run test:run
```
