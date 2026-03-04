import api from './index'
import type { TaskStatistics, Task } from '@/types/task.d'

export async function getTaskStatistics(): Promise<TaskStatistics> {
  const response = await api.get<TaskStatistics>('/tasks/statistics')
  return response.data
}

export function getMockTaskStatistics(): TaskStatistics {
  return {
    running: Math.floor(Math.random() * 5) + 1,
    completed: Math.floor(Math.random() * 50) + 20,
    failed: Math.floor(Math.random() * 10),
    pending: Math.floor(Math.random() * 8),
  }
}

export async function getRecentTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks/recent')
  return response.data
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
