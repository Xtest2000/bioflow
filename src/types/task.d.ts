export interface TaskStatistics {
  running: number
  completed: number
  failed: number
  pending: number
}

export interface Task {
  id: string
  name: string
  status: 'running' | 'completed' | 'failed' | 'pending'
  createdAt: string
  updatedAt: string
}
