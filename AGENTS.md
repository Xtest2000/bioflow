# AGENTS.md

Guide for agentic coding agents operating in this Vue 3 + TypeScript repository.

---

## ⚠️ 核心原则

1. **先做规划** - 你在执行任务的时候必须输出 todolist 进行规划，禁止直接执行
2. **验证命令** - 运行命令后必须验证执行成功（进程、端口、输出）
3. **完整验收** - 任务完成前必须运行 typecheck + lint + test 并展示结果
4. **Diff 摘要** - 每次修改文件必须提供 diff 摘要
5. **测试先行** - 新增代码必须编写对应的单元测试
6. **先确定可用工具列表** - 执行任务前先检查可用 Skills 和 Tools，切记使用正确的tool和skill 名，提高任务执行效率
7. **沟通语言** - 输出的思考过程进行用中文表述，注意只是表述。

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
