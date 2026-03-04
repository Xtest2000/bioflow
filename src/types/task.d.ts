export interface TaskStatistics {
  activeTask: number
  doneTask: number
  queuedTask: number
  terminatedTask: number
  totalTask: number
}

export interface Task {
  id: string
  name: string
  status: 'running' | 'completed' | 'failed' | 'pending'
  createdAt: string
  updatedAt: string
}
