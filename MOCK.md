# Mock 模式使用指南

## 快速启动

```bash
# 使用 mock 模式启动开发服务器
npm run dev:mock
```

等价于：

```bash
VITE_MOCK_MODE=true npm run dev
```

## 环境变量

Mock 模式由环境变量 `VITE_MOCK_MODE` 控制：

| 值               | 说明                               |
| ---------------- | ---------------------------------- |
| `true`           | Mock 模式 - 使用前端生成的模拟数据 |
| `false` 或未设置 | 正常模式 - 调用后端 API            |

## Mock 数据范围

目前支持 Mock 数据的模块：

### 1. 服务器资源 (`src/api/server.ts`)

```typescript
// Mock 数据包含：
{
  cpu: { usage: 20-80%, cores: 8 },
  memory: { used: 4-12GB, total: 16GB },
  disk: { used: 100-300GB, total: 500GB }
}
```

### 2. 任务统计 (`src/api/task.ts`)

```typescript
// Mock 数据包含：
{
  activeTask: 1-5,
  doneTask: 20-70,
  terminatedTask: 0-10,
  queuedTask: 0-8
}

// 最近任务列表（4 条模拟数据）
[
  { name: '数据分析任务-A001', status: 'running' },
  { name: '报表生成任务-B002', status: 'completed' },
  { name: '数据同步任务-C003', status: 'failed' },
  { name: '清洗任务-D004', status: 'pending' }
]
```

## 工作原理

```
┌─────────────────┐
│  VITE_MOCK_MODE │
│     = true      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ API 模块检测    │
│ import.meta.env │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌──────────┐
│ Mock  │ │ 真实 API │
│ 数据  │ │  调用    │
│ (前端)│ │ (后端)   │
└───────┘ └──────────┘
```

当 `VITE_MOCK_MODE=true` 时：

1. `src/api/server.ts` 和 `src/api/task.ts` 中的 `isMockMode` 为 `true`
2. 调用 `getMock*()` 函数生成随机模拟数据
3. 模拟 300ms 网络延迟后返回数据

## 扩展 Mock 数据

为其他模块添加 Mock 数据，参考以下模式：

```typescript
// src/api/xxx.ts
const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

export function getMockXxxData() {
  // 返回模拟数据
  return { ... }
}

export async function fetchXxx(): Promise<XxxData> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockXxxData()
  }
  // 真实 API 调用
  const response = await api.post<XxxData>('/api/endpoint/')
  return response.data
}
```

## 注意事项

1. **Mock 数据是随机的** - 每次刷新页面数据会变化
2. **模拟网络延迟** - Mock 模式有 300ms 延迟，模拟真实请求
3. **仅开发环境使用** - 生产环境应使用真实后端 API
