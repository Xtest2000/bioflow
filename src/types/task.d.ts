// 支持不同大小写的任务状态（API 可能返回 RUNNING, Running, running 等格式）
export type TaskStatus = string

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

export interface TaskListItem {
  taskID: number
  taskName: string
  taskProjectName: string
  taskSendTime: string
  taskRunTime: string
  taskStatus: TaskStatus
  taskToolName: string
  taskToolVersion: string
}

export interface TaskListParams {
  pageNum: number
  pageSize: number
  startTime?: string
  endTime?: string
  taskStatus?: TaskStatus
  toolName?: string
  toolVersion?: string
  taskProject?: string
}

export interface Pagination {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
}

export interface TaskListResponse {
  tasks: TaskListItem[]
  pagination: Pagination
}

export interface TaskParam {
  key: string
  name: string
  desc: string
  type: string
  value: string
  required: boolean
  visible: boolean
  default?: string
  options?: string[]
}

export interface TaskStep {
  StepName: string
  StepStartTime: string | null
  StepEndTime: string | null
  StepRunTime: string
  StepExitCode: number | null
  StepStdout: string | null
  StepStderr: string | null
}

export interface TaskDetail {
  taskEndTime: string | null
  taskErrorLog: string | null
  taskName: string
  taskParams: TaskParam[]
  taskPath: Record<string, unknown>
  taskRunTime: string
  taskSendTime: string
  taskStatus: TaskStatus
  taskStep: TaskStep[]
  taskToolName: string
  taskToolVersion: string
}

export interface CancelTaskParams {
  taskIds: string[]
}

export interface CancelTaskResult {
  status: string
  taskID: number
  message: string
  code: number
}

export interface CancelTaskResponse {
  task_list: CancelTaskResult[]
  task_status: number
}

export interface DeleteTaskParams {
  taskIds: string[]
}

export interface DeleteTaskResult {
  toolID: number
  message: string
  code: number
}

export interface DeleteTaskResponse {
  task_list: DeleteTaskResult[]
  task_status: number
}
