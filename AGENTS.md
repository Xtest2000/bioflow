# AGENTS.md

Guide for agentic coding agents operating in this Vue 3 + TypeScript repository.

---

## ⚠️ 核心原则

1. **验证命令** - 运行命令后必须验证执行成功（进程、端口、输出）
2. **完整验收** - 任务完成前必须运行 typecheck + lint + test 并展示结果
3. **Diff 摘要** - 每次修改文件必须提供 diff 摘要
4. **测试先行** - 新增代码必须编写对应的单元测试
5. **Plan Mode 禁止修改** - Plan Mode 下严禁执行任何修改操作（文件编辑、启动/终止服务、写入文件等），只能读取和制定计划
6. **Skills 优先** - 执行任务前必须先检查可用 Skills，优先使用 Skills 提供的专业化能力，提高任务执行效率

---

## Project Setup

This is a Vue 3 + TypeScript project. When initializing, use:

```bash
npm create vue@latest .  # Select TypeScript, Router, Pinia, Vitest, ESLint + Prettier
npm install
```

## Build/Lint/Test Commands

After project initialization:

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint on all files
npm run typecheck    # Run TypeScript type checking (vue-tsc)
npm run test         # Run all tests with Vitest
npm run test:run     # Run tests once (no watch mode)
npm run test -- path/to/test.spec.ts       # Run single test file
npm run test -- --grep "test name"         # Run tests matching pattern
```

**IMPORTANT**: After running any command, ALWAYS verify it executed successfully:

1. Check if process is running (`ps aux | grep vite`)
2. Check if port is listening (`cat /proc/net/tcp | grep <port>`)
3. For dev server, check the output shows "ready" and "Local:" URL

## Code Style Guidelines

### Imports

Order imports as follows (enforced by ESLint):

1. Vue imports (vue, vue-router, pinia)
2. Third-party libraries
3. Local components (with `@/` alias)
4. Local utilities/types
5. Asset imports

```typescript
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { someLibrary } from 'third-party'
import MyComponent from '@/components/MyComponent.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'
```

Use `@/` alias for src imports. Always use `import type` for type-only imports.

### Formatting

- Indent: 2 spaces
- Single quotes for strings (double quotes only to escape)
- No semicolons (configure Prettier: `semi: false`)
- Trailing commas in multiline (ES5 compatible)
- Max line width: 100 characters
- Vue SFC: `<script setup>` first, then `<template>`, then `<style>`

### TypeScript

- Strict mode enabled
- Prefer interfaces over types for object shapes
- Use type inference; avoid explicit types when obvious
- Always type function parameters and return types for public APIs
- Use `defineProps<T>()` and `defineEmits<T>()` with generic syntax

```typescript
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
})

const emit = defineEmits<{
  (e: 'update', value: number): void
  (e: 'delete'): void
}>()
```

### Naming Conventions

- **Components**: PascalCase files and names (`UserProfile.vue`, `<UserProfile />`)
- **Composables**: camelCase with `use` prefix (`useUserAuth.ts`, `useUserAuth()`)
- **Stores**: camelCase with `use` suffix (`user.ts`, `useUserStore()`)
- **Types/Interfaces**: PascalCase (`User`, `UserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants
- **Vue template refs**: use `ref` suffix (`inputRef`, `formRef`)

### Vue 3 Patterns

- Always use `<script setup lang="ts">` syntax
- Use composables for reusable logic (not mixins)
- Use Pinia for state management
- Keep components small and focused (< 200 lines)
- Extract complex logic to composables

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '@/types'

const props = defineProps<{
  userId: string
}>()

const user = ref<User | null>(null)
const isLoading = ref(false)

const displayName = computed(() => user.value?.name ?? 'Guest')

onMounted(async () => {
  isLoading.value = true
  user.value = await fetchUser(props.userId)
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else>{{ displayName }}</div>
</template>

<style scoped>
/* Component styles here */
</style>
```

### Error Handling

- Use try/catch for async operations
- Log errors with console.error in development
- Show user-friendly error messages in UI
- Consider using a global error handler

```typescript
async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw new Error('Unable to load data. Please try again.')
  }
}
```

### File Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable components
│   └── common/      # Generic UI components
├── composables/     # Vue composables (hooks)
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── views/           # Route-level components/pages
├── App.vue          # Root component
└── main.ts          # Application entry point
```

### Testing

- Use Vitest with Vue Test Utils
- Test file naming: `*.spec.ts` or `*.test.ts`
- Co-locate tests with source files or use `__tests__` folder
- Test user behavior, not implementation details

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders title prop', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Hello' },
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
```

## VSCode Extensions

Required extensions (configured in devcontainer):

- **Volar** (`vue.volar`) - Vue Language Features
- **ESLint** (`dbaeumer.vscode-eslint`) - Linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Pretty TS Errors** (`yoavbls.pretty-ts-errors`) - Readable TypeScript errors

## Pre-commit

Always run before committing:

1. `npm run lint` - Fix linting issues
2. `npm run typecheck` - Ensure no type errors
3. `npm run test:run` - Ensure all tests pass

---

## Project Overview

**项目名称**：工具平台类分析系统

**核心定位**：前后端分离的 Web 应用，提供多种工具给用户使用的数据分析平台

### 技术栈

- **前端**：Vue 3 + TypeScript + Element Plus + Pinia + Axios
- **后端**：Python Django + DRF + JWT（独立仓库）
- **详细规划**：参见 [PROJECT.md](./PROJECT.md)

### 核心功能

1. 用户认证与权限
2. 数据报表管理
3. 工具平台（扩展）

### 开发阶段

- **阶段 1**：项目基础搭建（进行中）
- **阶段 2**：用户认证模块
- **阶段 3**：数据报表管理
- **阶段 4**：工具平台扩展

---

## Code Modification Protocol

**IMPORTANT**: When modifying any file, always provide a diff summary showing what changed.

Example format:

```diff
--- a/src/views/login/index.vue
+++ b/src/views/login/index.vue
@@ -1,5 +1,6 @@
 <script setup lang="ts">
-import { ref } from 'vue'
+import { ref, onMounted } from 'vue'
+// Added: onMounted for page load animation
```

This helps the user understand:

1. What files were modified
2. What specific changes were made
3. Why the changes were needed

---

## Testing Protocol

**IMPORTANT**: Always write tests early and run tests after every modification.

### When to Write Tests

1. **Before or alongside implementation** - Follow TDD when possible
2. **For every new component** - Test rendering, props, events
3. **For every composable/store** - Test state changes, actions
4. **For every utility function** - Test edge cases

### Test Types

- **Unit Tests**: Composables, stores, utility functions
- **Component Tests**: Vue components with Vue Test Utils

### After Every Code Change

1. Run `npm run test:run` to ensure all tests pass
2. Run `npm run typecheck` to ensure no type errors
3. Run `npm run lint` to ensure code quality

### Test File Location

- Co-locate with source: `src/components/Button.spec.ts`
- Or use `__tests__` folder for grouped tests

### Example Test

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '@/views/login/index.vue'

describe('Login', () => {
  it('renders login form', () => {
    const wrapper = mount(Login)
    expect(wrapper.find('input[placeholder="请输入用户名"]').exists()).toBe(true)
  })
})
```

---

## Task Completion Protocol

**CRITICAL**: A task is NOT complete until ALL of the following are verified:

1. **Code changes compile** - Run `npm run typecheck`
2. **Tests pass** - Run `npm run test:run`
3. **Lint passes** - Run `npm run lint`
4. **Feature works** - Start dev server and verify

**NEVER** claim a task is complete without:

- Running the relevant verification commands
- Showing the output to confirm success
- If tests fail, MUST fix and re-run until they pass

**Example workflow:**

```
1. Write/modify code
2. Run npm run typecheck → verify no errors
3. Run npm run test:run → verify all tests pass
4. Run npm run lint → verify no errors
5. Only THEN mark task as complete
```

**If any step fails:**

- Do NOT proceed to next task
- Fix the issue immediately
- Re-run the failed command
- Show the successful output

---

## Skills 使用指南

**IMPORTANT**: 执行任何任务前，必须先检查是否有适用的 Skill，优先使用 Skill 提高效率。

### 可用 Skills

| Skill             | 用途               | 适用场景                                        |
| ----------------- | ------------------ | ----------------------------------------------- |
| `tmux`            | 远程控制 tmux 会话 | 启动/管理开发服务器、查看实时输出、调试后台进程 |
| `frontend-design` | 创建高质量前端界面 | 构建 Web 组件、页面、应用，生成创意且精美的代码 |
| `file-search`     | 搜索代码库         | 搜索文本模式、语法感知的代码搜索                |

### 使用方式

在执行任务时，主动调用相关 Skill：

```
skill tmux          # 获取 tmux 操作指南
skill frontend-design  # 获取前端设计指南
skill file-search   # 获取代码搜索指南
```

### 适用场景示例

| 任务类型             | 推荐 Skill        | 说明                                |
| -------------------- | ----------------- | ----------------------------------- |
| 启动/重启开发服务器  | `tmux`            | 使用 Skill 提供的标准化流程管理会话 |
| 创建新的 UI 组件     | `frontend-design` | 获取设计模式和最佳实践              |
| 查找代码中的函数定义 | `file-search`     | 使用语法感知搜索精确定位            |

### 注意事项

1. **优先检查** - 接到任务后，首先判断是否有适用的 Skill
2. **主动使用** - 不要等待用户提示，主动调用 Skill
3. **遵循指南** - 使用 Skill 后，严格遵循其提供的指导流程

---

## Dev Container 维护

### Dockerfile.ts 工具列表

当前 Dockerfile.ts 已包含的工具：

- git
- vim
- curl
- procps (包含 ps, pkill 等)
- openssh-server
- tmux

### 开发服务器管理

使用 tmux 管理开发服务器，方便查看实时输出和调试：

```bash
tmux new-session -d -s vite 'npm run dev'  # 创建 vite 会话
tmux ls                                     # 查看所有会话
tmux attach -t vite                         # 进入 vite 会话
tmux kill-session -t vite                   # 关闭 vite 会话
```

**重要**：操作 tmux 前应先调用 `skill tmux` 获取详细指南。

### 镜像重建流程

当需要添加新工具时：

1. 修改 `Dockerfile.ts` 添加所需工具
2. 更新本节文档，记录已添加的工具
3. 提醒用户重新构建镜像：

```bash
# 重新构建镜像
docker compose -f compose_dev.yaml build

# 重启容器
docker compose -f compose_dev.yaml up -d
```

### 常见需求

- **Python/Django 后端开发**: 需要添加 Python 3、pip、poetry 等
- **Docker-in-Docker**: 需要添加 docker-cli、docker-compose
- **数据库工具**: 需要添加 postgresql-client、redis-cli 等

**注意**：在开发过程中如果遇到缺失的工具，请更新本节和 Dockerfile.ts。
