# 工具任务投递功能实现计划

## TL;DR

> **核心目标**: 为工具平台添加任务投递功能，用户点击"立即使用"后进入参数配置页面，填写表单后提交任务。
>
> **交付物**:
>
> - 动态参数表单页面 (`src/views/tools/submit.vue`)
> - 工具参数 API 接口和 Mock 数据
> - 任务提交 API 接口和 Mock 数据
> - Pinia Store 状态管理
> - 路由配置更新
>
> **预计工作量**: 中等 (约 4-6 小时)
> **并行执行**: 是 - 3 个并行波次

---

## Context

### 原始需求

用户需要在工具列表页点击"立即使用"后，进入任务投递页面，该页面根据 `getToolparameter` API 返回的动态参数生成表单，用户填写后提交任务。

### 需求变更 (用户反馈)

- **保留工具详情页**：当前"立即使用"按钮改名为"工具详情"，继续使用 `getToolDetail` 接口
- **新增投递功能**：添加新的"立即使用"按钮，使用 `getToolparameter` 接口打开参数填写页面
- **两个按钮并存**：每个工具卡片同时显示"工具详情"和"立即使用"

### 接口分析 (background_api.json)

**getToolparameter 接口**:

- **路径**: `/analysis/getToolparameter/`
- **方法**: POST
- **请求参数**: `{ toolID: number, version: string }`
- **响应结构**:
  ```json
  {
    "params": [
      {
        "controlType": "file|string|select",
        "key": "参数唯一标识",
        "name": "参数名称",
        "desc": "参数描述",
        "required": true/false,
        "default": "默认值",
        "visible": true/false,
        "enabled_for_sequencing": true/false,
        "options": ["选项 1"] // select 类型专有
      }
    ],
    "tool_real_time_analysis": false
  }
  ```

### 用户决策确认

- ✅ **后端接口**: 先做 Mock 数据
- ✅ **文件上传方式**: 文件路径输入框 (非上传控件)
- ✅ **路由路径**: `/tools/:toolId/submit`

---

## Work Objectives

### 核心目标

实现工具任务投递功能，支持动态参数表单渲染和任务提交。

### 具体交付物

1. `src/types/tool.d.ts` - 新增工具和任务相关类型定义
2. `src/api/tool.ts` - 新增 `getToolparameter` 和 `submitTask` API
3. `src/stores/tool.ts` - 新增任务投递相关状态和方法
4. `src/views/tools/submit.vue` - 任务投递页面组件
5. `src/router/index.ts` - 新增 `/tools/:toolId/submit` 和 `/tools/:toolId/detail` 路由
6. `src/views/tools/index.vue` - 修改按钮布局和跳转逻辑
7. `src/views/tools/detail.vue` - 现有工具详情页面 (保持不变)

### 完成定义

- [ ] 所有 TypeScript 类型检查通过 (`npm run typecheck`)
- [ ] 所有测试通过 (`npm run test:run`)
- [ ] ESLint 检查通过 (`npm run lint`)
- [ ] 功能验证：能正常加载参数表单并提交任务

### Must Have

- ✅ 支持 `file`、`string`、`select` 三种参数类型
- ✅ 必填项验证
- ✅ 表单提交时收集所有参数值
- ✅ Mock 模式下能正常工作
- ✅ 提交成功后显示成功提示

### Must NOT Have (guardrails)

- ❌ 不要实现真实的文件上传功能
- ❌ 不要修改现有的工具详情页面
- ❌ 不要在未验证的情况下跳过类型检查
- ❌ 避免过度抽象 - 保持代码简洁

---

## Verification Strategy

### Test Decision

- **基础设施已存在**: YES (Vitest + Vue Test Utils)
- **自动化测试**: TDD 模式
- **框架**: Vitest

### QA Policy

每个任务必须包含代理执行的 QA 场景：

- **前端组件**: Playwright 验证渲染和交互
- **API 函数**: 直接调用验证返回值
- **Store**: 调用 actions 验证状态变化

---

## Execution Strategy

### 并行执行波次

```
Wave 1 (基础设施 - 可并行):
├── Task 1: 类型定义更新 [quick]
├── Task 2: API 接口实现 [quick]
└── Task 3: Store 更新 [quick]

Wave 2 (核心功能 - 依赖 Wave 1, MAX 并行):
├── Task 4: 投递页面组件实现 [deep]
└── Task 5: 路由配置更新 [quick]

Wave 3 (集成验证 - 依赖 Wave 2):
├── Task 6: 更新工具列表页按钮布局 [quick]
├── Task 7: 集成测试和 QA [deep]
└── Task 8: 最终验证和清理 [quick]

关键路径：Task 1/2/3 → Task 4 → Task 6 → Task 7
并行加速：约 50% 快于顺序执行
最大并发：3 (Wave 1)
```

Wave 1 (基础设施 - 可并行):
├── Task 1: 类型定义更新 [quick]
├── Task 2: API 接口实现 [quick]
└── Task 3: Store 更新 [quick]

Wave 2 (核心功能 - 依赖 Wave 1):
├── Task 4: 投递页面组件实现 [deep]
└── Task 5: 路由配置更新 [quick]

Wave 3 (集成验证 - 依赖 Wave 2):
├── Task 6: 更新工具列表页跳转逻辑 [quick]
├── Task 7: 集成测试和 QA [deep]
└── Task 8: 最终验证和清理 [quick]

关键路径: Task 1/2/3 → Task 4 → Task 6 → Task 7
并行加速: 约 50% 快于顺序执行

```

### 依赖矩阵

| 任务 | 依赖    | 被依赖 |
| ---- | ------- | ------ |
| 1    | 无      | 4      |
| 2    | 无      | 4, 7   |
| 3    | 无      | 4      |
| 4    | 1, 2, 3 | 6, 7   |
| 5    | 无      | 6      |
| 6    | 4, 5    | 7      |
| 7    | 2, 4, 6 | 8      |
| 8    | 7       | 无     |

---

## TODOs

- [ ] 1. 更新类型定义 - src/types/tool.d.ts

  **做什么**:
  - 添加 `ToolParameter` 接口 (参数定义)
  - 添加 `ToolParameterResponse` 接口 (API 响应)
  - 添加 `ToolParameterParams` 接口 (API 请求参数)
  - 添加 `SubmitTaskParams` 接口 (提交任务参数)
  - 添加 `SubmitTaskResponse` 接口 (提交任务响应)

  **禁止做**:
  - 不要修改现有类型定义
  - 不要添加未使用的类型

  **推荐 Agent Profile**:
  - **Category**: `quick`
  - **Skills**: 无需特殊技能
  - **理由**: 简单的类型定义添加

  **并行化**:
  - **可并行**: YES
  - **并行组**: Wave 1 (与 Task 2, 3)
  - **阻塞**: Task 4
  - **被阻塞**: 无

  **验收标准**:
  - [ ] `npm run typecheck` 无错误
  - [ ] 新类型被正确导出

  **QA 场景**:

```

场景：类型定义验证
工具：Bash (tsc)
步骤: 1. 运行 npm run typecheck 2. 检查输出无错误
预期结果：typecheck 通过
证据：.sisyphus/evidence/task-1-typecheck.txt

````

---

- [ ] 2. 更新 API - src/api/tool.ts

**做什么**:
- 导入新增的类型定义
- 实现 `getToolparameter` 函数 (真实 API 调用)
- 实现 `getMockToolparameter` 函数 (Mock 数据)
- 实现 `fetchToolParameter` 函数 (根据模式切换)
- 实现 `submitTask` 函数 (真实 API 调用)
- 实现 `getMockSubmitTask` 函数 (Mock 数据)
- 实现 `fetchSubmitTask` 函数 (根据模式切换)

**Mock 数据示例**:

```typescript
// getMockToolparameter 返回示例 (参考 background_api.json)
{
  params: [
    {
      controlType: 'file',
      key: 'CNV_seq_baozheng_Pipeline.input_fq_file',
      name: '样本文件',
      desc: '样本文件',
      required: true,
      type: 'File',
      visible: true,
    },
    {
      controlType: 'string',
      key: 'CNV_seq_baozheng_Pipeline.sample_name',
      name: '样本名',
      desc: '样本名',
      required: true,
      type: 'String',
      visible: true,
    },
    {
      controlType: 'select',
      key: 'CNV_seq_baozheng_Pipeline.sample_type',
      name: '样本类型',
      desc: '样本类型',
      required: true,
      type: 'String',
      visible: true,
      options: ['羊水', '企业参考品'],
    },
  ],
  toolID: 1,
  tool_real_time_analysis: false,
}
````

**禁止做**:

- 不要修改现有 API 函数
- 不要在 Mock 模式下调用真实 API

**推荐 Agent Profile**:

- **Category**: `quick`
- **Skills**: 无需特殊技能

**并行化**:

- **可并行**: YES
- **并行组**: Wave 1 (与 Task 1, 3)
- **阻塞**: Task 4, 7
- **被阻塞**: 无

**验收标准**:

- [ ] API 函数正确导出
- [ ] Mock 数据符合 background_api.json 格式
- [ ] `npm run typecheck` 通过

**QA 场景**:

```
场景：API 函数返回值验证
  工具：Bash (node REPL 或编写测试脚本)
  步骤:
    1. 导入 getMockToolparameter 函数
    2. 调用函数并验证返回结构
    3. 验证包含 params 数组
    4. 验证 params 包含必要字段 (key, name, controlType)
  预期结果：返回正确的 Mock 数据结构
  证据：.sisyphus/evidence/task-2-api-test.txt
```

---

- [ ] 3. 更新 Store - src/stores/tool.ts

  **做什么**:
  - 导入新增的 API 函数和类型
  - 添加状态:
    - `toolParameters` - 工具参数列表
    - `submitting` - 提交中状态
    - `submitError` - 提交错误
    - `submitSuccess` - 提交成功状态
    - `submitTaskId` - 提交后的任务 ID
  - 添加 actions:
    - `fetchToolParameters(toolID, version)` - 获取工具参数
    - `submitTask(parameters)` - 提交任务
    - `resetSubmitState()` - 重置提交状态

  **禁止做**:
  - 不要修改现有 state 和 actions
  - 不要移除已有的功能

  **推荐 Agent Profile**:
  - **Category**: `quick`
  - **Skills**: 无需特殊技能

  **并行化**:
  - **可并行**: YES
  - **并行组**: Wave 1 (与 Task 1, 2)
  - **阻塞**: Task 4
  - **被阻塞**: 无

  **验收标准**:
  - [ ] Store 状态正确定义
  - [ ] Actions 正确实现
  - [ ] `npm run typecheck` 通过

  **QA 场景**:

  ```
  场景：Store actions 验证
    工具：Bash (调用测试脚本)
    步骤:
      1. 创建 store 实例
      2. 调用 fetchToolParameters
      3. 验证 toolParameters 状态已更新
      4. 调用 submitTask
      5. 验证 submitting 状态变化
      6. 验证 submitSuccess 为 true
    预期结果：状态正确更新
    证据：.sisyphus/evidence/task-3-store-test.txt
  ```

---

- [ ] 4. 创建投递页面组件 - src/views/tools/submit.vue

  **做什么**:
  - 创建单文件组件，使用 `<script setup lang="ts">`
  - 从路由参数获取 `toolId`，从 query 获取 `version`
  - onMounted 时调用 `fetchToolParameters`
  - 根据 `controlType` 动态渲染表单控件:
    - `file`: 文件路径输入框 (el-input)
    - `string`: 文本输入框 (el-input)
    - `select`: 下拉选择框 (el-select)
    - `number`: 数字输入框 (el-input-number)
    - `boolean`: 开关 (el-switch)
  - 实现表单验证 (必填项检查)
  - 实现提交逻辑，调用 `submitTask`
  - 提交成功后显示成功提示并跳转到任务列表或工具列表

  **组件结构**:

  ```vue
  <script setup lang="ts">
  // 导入依赖
  // 获取路由参数
  // 表单数据响应式对象
  // 表单引用 (用于验证)
  // 提交处理函数
  // 返回函数
  </script>

  <template>
    <div class="submit-page">
      <页面标题>
      <工具信息卡片>
      <el-form>
        <动态表单项 v-for="param in toolParameters">
      <提交按钮>
    </div>
  </template>

  <style scoped>
  // 页面样式
  </style>
  ```

  **UI 要求**:
  - 使用 Element Plus 组件
  - 保持与工具列表页一致的设计风格
  - 表单布局清晰，标签对齐
  - 必填项显示红色星号 (\*)
  - 提交按钮显示加载状态
  - 成功/失败消息使用 ElMessage

  **禁止做**:
  - 不要使用真实文件上传
  - 不要硬编码参数 - 必须动态渲染
  - 不要跳过表单验证

  **推荐 Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-design`]
  - **理由**: 需要创建美观的用户界面

  **并行化**:
  - **可并行**: NO
  - **并行组**: Wave 2 (依赖 Wave 1)
  - **阻塞**: Task 6, 7
  - **被阻塞**: Task 1, 2, 3

  **参考**:
  - `src/views/tools/index.vue` - 现有工具列表页风格
  - Element Plus Form 文档 - 表单组件用法

  **验收标准**:
  - [ ] 组件能正确加载并渲染
  - [ ] 动态表单根据参数类型渲染不同控件
  - [ ] 表单验证工作正常
  - [ ] 提交成功后显示提示

  **QA 场景**:

  ```
  场景：表单渲染验证 (Playwright)
    步骤:
      1. 导航到 /tools/1/submit?version=V1.0.0.0
      2. 等待页面加载完成
      3. 验证页面包含工具名称
      4. 验证表单包含所有参数
      5. 验证 file 类型渲染为输入框
      6. 验证 select 类型渲染为下拉框
      7. 验证必填项显示星号
    预期结果：表单正确渲染
    证据：.sisyphus/evidence/task-4-form-render.png

  场景：表单提交验证 (Playwright)
    步骤:
      1. 填写所有必填字段
      2. 点击提交按钮
      3. 等待提交完成
      4. 验证显示成功消息
      5. 验证页面跳转或显示成功状态
    预期结果：提交成功
    证据：.sisyphus/evidence/task-4-submit-success.png

  场景：表单验证失败 (Playwright)
    步骤:
      1. 不填写任何字段
      2. 点击提交按钮
      3. 验证显示错误提示
      4. 验证必填项高亮显示
    预期结果：验证失败，显示错误
    证据：.sisyphus/evidence/task-4-validation-error.png
  ```

---

- [ ] 5. 更新路由配置 - src/router/index.ts

  **做什么**:
  - 现有路由已有 `/tools/:id` → `detail.vue` (工具详情页)
  - 添加新路由 `/tools/:id/submit` → `submit.vue` (任务投递页)
  - 保持现有路由不变

  **新增路由**:

  ```typescript
  {
    path: 'tools/:id/submit',
    name: 'ToolSubmit',
    component: () => import('@/views/tools/submit.vue'),
    meta: { title: '任务投递' }
  }
  ```

  **可选优化** (如需更清晰的路径):

  ```typescript
  // 重命名现有路由
  {
    path: 'tools/:id',
    name: 'ToolDetail',  // 保持不变
    // 或改为 'tools/:id/detail' 如果需要
  }
  ```

  **禁止做**:
  - 不要删除现有 `/tools/:id` 路由
  - 不要修改 `detail.vue` 组件
  - 不要破坏现有导航

  **推荐 Agent Profile**:
  - **Category**: `quick`
  - **Skills**: 无需特殊技能

  **并行化**:
  - **可并行**: YES
  - **并行组**: Wave 2 (与 Task 4)
  - **阻塞**: Task 6
  - **被阻塞**: 无

  **验收标准**:
  - [ ] 新路由正确定义
  - [ ] `npm run typecheck` 通过
  - [ ] 能访问 `/tools/:id/submit` 路径
  - [ ] 现有 `/tools/:id` 路由仍然工作

  **QA 场景**:

  ```
  场景：投递路由验证 (Playwright)
    步骤:
      1. 导航到 /tools/1/submit?version=V1.0.0.0
      2. 验证页面加载成功
      3. 验证 URL 正确
    预期结果：投递页正常访问
    证据：.sisyphus/evidence/task-5-submit-route.png

  场景：详情路由验证 (Playwright)
    步骤:
      1. 导航到 /tools/1?version=V1.0.0.0
      2. 验证详情页加载成功
      3. 验证 URL 正确
    预期结果：详情页正常访问
    证据：.sisyphus/evidence/task-5-detail-route.png
  ```

  **禁止做**:
  - 不要修改现有路由配置
  - 不要破坏路由结构

  **推荐 Agent Profile**:
  - **Category**: `quick`
  - **Skills**: 无需特殊技能

  **并行化**:
  - **可并行**: YES
  - **并行组**: Wave 2 (与 Task 4)
  - **阻塞**: Task 6
  - **被阻塞**: 无

  **验收标准**:
  - [ ] 路由正确定义
  - [ ] `npm run typecheck` 通过
  - [ ] 能访问 /tools/:toolId/submit 路径

  **QA 场景**:

  ```
  场景：路由访问验证 (Playwright)
    步骤:
      1. 导航到 /tools/1/submit?version=V1.0.0.0
      2. 验证页面加载成功
      3. 验证 URL 正确
    预期结果：页面正常访问
    证据：.sisyphus/evidence/task-5-route-test.png
  ```

---

- [ ] 6. 更新工具列表页按钮布局 - src/views/tools/index.vue

  **做什么**:
  - 在工具卡片的 `.tool-actions` 区域添加两个按钮:
    - "工具详情" 按钮 → 跳转到 `/tools/${tool.toolID}/detail`
    - "立即使用" 按钮 → 跳转到 `/tools/${tool.toolID}/submit`
  - 两个按钮都传递 `version` query 参数

  **布局示例**:

  ```vue
  <div class="tool-actions">
    <el-button type="danger" link size="small" @click="openDeleteDialog(tool.toolID)">
      <el-icon :size="16"><Delete /></el-icon>
    </el-button>
    <el-button @click="handleViewDetail(tool)">工具详情</el-button>
    <el-button type="primary" @click="handleUseTool(tool)">立即使用</el-button>
  </div>
  ```

  **函数修改**:

  ```typescript
  // 修改 handleUseTool 为投递页面跳转
  function handleUseTool(tool: { toolID: number }) {
    const version = selectedVersions.value[tool.toolID]
    router.push({
      path: `/tools/${tool.toolID}/submit`,
      query: {
        version: version || tools.value.find((t) => t.toolID === tool.toolID)?.versions[0] || '',
      },
    })
  }

  // 新增 handleViewDetail 为详情页跳转
  function handleViewDetail(tool: { toolID: number }) {
    const version = selectedVersions.value[tool.toolID]
    router.push({
      path: `/tools/${tool.toolID}/detail`,
      query: {
        version: version || tools.value.find((t) => t.toolID === tool.toolID)?.versions[0] || '',
      },
    })
  }
  ```

  **禁止做**:
  - 不要移除删除按钮
  - 不要修改版本选择功能
  - 不要破坏现有卡片布局

  **推荐 Agent Profile**:
  - **Category**: `quick`
  - **Skills**: 无需特殊技能

  **并行化**:
  - **可并行**: NO
  - **并行组**: Wave 3 (依赖 Wave 2)
  - **阻塞**: Task 7
  - **被阻塞**: Task 4, 5

  **验收标准**:
  - [ ] 两个按钮都显示正确
  - [ ] "工具详情"跳转到详情页
  - [ ] "立即使用"跳转到投递页
  - [ ] version 参数正确传递
  - [ ] `npm run typecheck` 通过

  **QA 场景**:

  ```
  场景：工具详情按钮验证 (Playwright)
    步骤:
      1. 访问工具列表页
      2. 选择一个工具的版本
      3. 点击"工具详情"按钮
      4. 验证当前 URL 为 /tools/{id}/detail
      5. 验证 version query 参数存在
      6. 验证详情页正确加载
    预期结果：正确跳转到详情页
    证据：.sisyphus/evidence/task-6-detail-nav.png

  场景：立即使用按钮验证 (Playwright)
    步骤:
      1. 访问工具列表页
      2. 选择一个工具的版本
      3. 点击"立即使用"按钮
      4. 验证当前 URL 为 /tools/{id}/submit
      5. 验证 version query 参数存在
      6. 验证投递页正确加载
    预期结果：正确跳转到投递页
    证据：.sisyphus/evidence/task-6-submit-nav.png
  ```

  **修改后**:

  ```typescript
  router.push({
    path: `/tools/${tool.toolID}/submit`,
    query: { version: ... },
  })
  ```

  **禁止做**:
  - 不要修改其他逻辑
  - 不要移除版本选择功能

  **推荐 Agent Profile**:
  - **Category**: `quick`
  - **Skills**: 无需特殊技能

  **并行化**:
  - **可并行**: NO
  - **并行组**: Wave 3 (依赖 Wave 2)
  - **阻塞**: Task 7
  - **被阻塞**: Task 4, 5

  **验收标准**:
  - [ ] 点击"立即使用"跳转到正确路径
  - [ ] version 参数正确传递
  - [ ] `npm run typecheck` 通过

  **QA 场景**:

  ```
  场景：跳转逻辑验证 (Playwright)
    步骤:
      1. 访问工具列表页
      2. 选择一个工具的版本
      3. 点击"立即使用"按钮
      4. 验证当前 URL 为 /tools/{id}/submit
      5. 验证 version query 参数存在
    预期结果：正确跳转
    证据：.sisyphus/evidence/task-6-navigation-test.png
  ```

---

- [ ] 7. 集成测试和 QA

  **做什么**:
  - 运行 `npm run test:run` 确保所有测试通过
  - 运行 `npm run typecheck` 确保类型检查通过
  - 运行 `npm run lint` 确保代码规范通过
  - 启动开发服务器进行手动验证
  - 使用 Playwright 执行端到端测试场景

  **推荐 Agent Profile**:
  - **Category**: `deep`
  - **Skills**: [`playwright`]
  - **理由**: 需要执行完整的集成验证

  **并行化**:
  - **可并行**: NO
  - **并行组**: Wave 3 (依赖 Wave 2)
  - **阻塞**: Task 8
  - **被阻塞**: Task 2, 4, 6

  **验收标准**:
  - [ ] `npm run test:run` 全部通过
  - [ ] `npm run typecheck` 无错误
  - [ ] `npm run lint` 无警告
  - [ ] Playwright 场景测试全部通过

  **QA 场景**:

  ```
  场景：完整投递流程 (Playwright)
    步骤:
      1. 访问工具列表页
      2. 点击 CNV 工具的"立即使用"
      3. 验证跳转到投递页面
      4. 填写样本文件路径
      5. 填写样本名
      6. 选择样本类型
      7. 点击提交
      8. 验证成功提示
      9. 验证页面跳转或显示任务 ID
    预期结果：完整流程顺畅
    证据：.sisyphus/evidence/task-7-e2e-test.mp4
  ```

---

- [ ] 8. 最终验证和清理

  **做什么**:
  - 检查所有修改的文件
  - 运行完整测试套件
  - 清理临时文件和调试代码
  - 准备 git 提交

  **推荐 Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`git-master`]
  - **理由**: 需要正确的 git 提交规范

  **并行化**:
  - **可并行**: NO
  - **并行组**: Wave 3 (最后任务)
  - **阻塞**: 无
  - **被阻塞**: Task 7

  **验收标准**:
  - [ ] 所有文件符合代码规范
  - [ ] 无 console.log 调试代码
  - [ ] 无 TODO 注释
  - [ ] git status 干净

  **提交信息**:

  ```
  feat(tools): 实现工具任务投递功能

  - 新增动态参数表单组件
  - 实现 getToolparameter API 和 Mock
  - 实现 submitTask API 和 Mock
  - 更新 Pinia Store 状态管理
  - 添加 /tools/:toolId/submit 路由
  - 更新工具列表页跳转逻辑
  ```

---

## Final Verification Wave

- [ ] F1. **计划合规审计** - `oracle`
      验证所有 Must Have 已实现，Must NOT Have 未违反

- [ ] F2. **代码质量审查** - `unspecified-high`
      运行 typecheck + lint + test，检查代码质量

- [ ] F3. **真实手动 QA** - `unspecified-high` + `playwright`
      执行完整投递流程测试

- [ ] F4. **范围保真度检查** - `deep`
      验证功能与计划一致，无范围蔓延

---

## Commit Strategy

- **提交 1**: `feat(types): 添加工具参数和任务提交类型定义`
  - 文件：`src/types/tool.d.ts`
  - 验证：`npm run typecheck`

- **提交 2**: `feat(api): 实现工具参数和任务提交 API`
  - 文件：`src/api/tool.ts`
  - 验证：`npm run test:run src/api/tool.spec.ts`

- **提交 3**: `feat(store): 添加工具参数和任务提交状态管理`
  - 文件：`src/stores/tool.ts`
  - 验证：`npm run test:run src/stores/tool.spec.ts`

- **提交 4**: `feat(components): 实现任务投递页面组件`
  - 文件：`src/views/tools/submit.vue`
  - 验证：Playwright E2E 测试

- **提交 5**: `feat(router): 添加工具详情页和投递页路由`
  - 文件：`src/router/index.ts`
  - 路由：`/tools/:toolId/detail` 和 `/tools/:toolId/submit`
  - 验证：手动访问两个路由

- **提交 6**: `feat(tools): 更新工具列表页按钮布局`
  - 文件：`src/views/tools/index.vue`
  - 改动：添加"工具详情"按钮，修改"立即使用"跳转逻辑
  - 验证：Playwright 导航测试

- **提交 7**: `chore: 最终清理和验证`
  - 文件：所有相关文件
  - 验证：完整测试套件

---

## Success Criteria

### 验证命令

```bash
npm run typecheck  # 预期：无错误
npm run test:run   # 预期：所有测试通过
npm run lint       # 预期：无警告
npm run dev        # 预期：开发服务器启动成功
```

### 最终检查清单

- [ ] 所有 Must Have 功能已实现
- [ ] 所有 Must NOT Have 未被违反
- [ ] 所有测试通过
- [ ] 代码符合规范
- [ ] 功能可正常使用
- [ ] Mock 数据工作正常
- [ ] 表单验证有效
- [ ] 提交成功有提示
