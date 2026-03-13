import api from './index'
import type { TaskStatistics, Task } from '@/types/task.d'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

// Mock 任务存储 - 支持动态添加
let mockTasks: Task[] = [
  {
    id: '1',
    name: '数据分析任务-A001',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '报表生成任务-B002',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '3',
    name: '数据同步任务-C003',
    status: 'failed',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: '4',
    name: '清洗任务-D004',
    status: 'pending',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
]

// 添加新任务到 Mock 列表
export function addMockTasks(newTasks: Task[]) {
  mockTasks = [...newTasks, ...mockTasks]
}

export async function getTaskOverview(): Promise<TaskStatistics> {
  const response = await api.post<TaskStatistics>('/analysis/getTaskOverview/')
  return response.data
}

export function getMockTaskStatistics(): TaskStatistics {
  const activeTask = mockTasks.filter((t) => t.status === 'running').length
  const doneTask = mockTasks.filter((t) => t.status === 'completed').length
  const terminatedTask = mockTasks.filter((t) => t.status === 'failed').length
  const queuedTask = mockTasks.filter((t) => t.status === 'pending').length
  return {
    activeTask,
    doneTask,
    terminatedTask,
    queuedTask,
    totalTask: mockTasks.length,
  }
}

export async function fetchTaskStatistics(): Promise<TaskStatistics> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockTaskStatistics()
  }

  return getTaskOverview()
}

export function getMockRecentTasks(): Task[] {
  return mockTasks
}

export async function fetchRecentTasks(): Promise<Task[]> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockRecentTasks()
  }

  const response = await api.post<Task[]>('/analysis/getRecentTasks/')
  return response.data
}
