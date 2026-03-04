import api from './index'
import type { TaskStatistics, Task } from '@/types/task.d'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

export async function getTaskOverview(): Promise<TaskStatistics> {
  const response = await api.post<TaskStatistics>('/analysis/getTaskOverview/')
  return response.data
}

export function getMockTaskStatistics(): TaskStatistics {
  return {
    activeTask: Math.floor(Math.random() * 5) + 1,
    doneTask: Math.floor(Math.random() * 50) + 20,
    terminatedTask: Math.floor(Math.random() * 10),
    queuedTask: Math.floor(Math.random() * 8),
    totalTask: 0,
  }
}

export async function fetchTaskStatistics(): Promise<TaskStatistics> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const mockData = getMockTaskStatistics()
    mockData.totalTask =
      mockData.activeTask + mockData.doneTask + mockData.terminatedTask + mockData.queuedTask
    return mockData
  }

  return getTaskOverview()
}

export function getMockRecentTasks(): Task[] {
  return [
    {
      id: '1',
      name: '数据分析任务-A001',
      status: 'running',
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
}

export async function fetchRecentTasks(): Promise<Task[]> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockRecentTasks()
  }

  const response = await api.post<Task[]>('/analysis/getRecentTasks/')
  return response.data
}
