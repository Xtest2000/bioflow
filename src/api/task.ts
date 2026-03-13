import api from './index'
import type {
  TaskStatistics,
  Task,
  TaskListParams,
  TaskListResponse,
  TaskDetail,
  TaskListItem,
} from '@/types/task.d'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

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

export async function getTaskList(params: TaskListParams): Promise<TaskListResponse> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockTaskList(params)
  }
  const response = await api.post<TaskListResponse>('/analysis/getTaskList/', params)
  return response.data
}

export async function getTaskDetail(taskID: number): Promise<TaskDetail> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockTaskDetail(taskID)
  }
  const response = await api.post<TaskDetail>('/analysis/getTaskDetail/', { taskID })
  return response.data
}

const mockTaskList: TaskListItem[] = [
  {
    taskID: 1,
    taskName: 'CNV-样本A001分析',
    taskProjectName: '肿瘤检测项目',
    taskSendTime: '2026-03-13 09:30:00',
    taskRunTime: '00:15:32',
    taskStatus: 'RUNNING',
    taskToolName: 'CycloneCNV',
    taskToolVersion: 'V1.1.0.0',
  },
  {
    taskID: 2,
    taskName: 'SNV-全外显子分析',
    taskProjectName: '遗传病筛查',
    taskSendTime: '2026-03-13 08:45:00',
    taskRunTime: '00:45:12',
    taskStatus: 'COMPLETE',
    taskToolName: 'GATK-SNV',
    taskToolVersion: 'V2.0.0.0',
  },
  {
    taskID: 3,
    taskName: 'RNA-表达定量',
    taskProjectName: '转录组研究',
    taskSendTime: '2026-03-12 16:20:00',
    taskRunTime: '00:32:45',
    taskStatus: 'FAILED',
    taskToolName: 'RNA-Seq',
    taskToolVersion: 'V1.5.0.0',
  },
  {
    taskID: 4,
    taskName: 'CNV-样本B002分析',
    taskProjectName: '肿瘤检测项目',
    taskSendTime: '2026-03-13 10:00:00',
    taskRunTime: '00:00:00',
    taskStatus: 'QUEUED',
    taskToolName: 'CycloneCNV',
    taskToolVersion: 'V1.1.0.0',
  },
  {
    taskID: 5,
    taskName: '甲基化分析',
    taskProjectName: '表观遗传研究',
    taskSendTime: '2026-03-13 07:15:00',
    taskRunTime: '00:28:33',
    taskStatus: 'COMPLETE',
    taskToolName: 'Methylation',
    taskToolVersion: 'V1.0.0.0',
  },
  {
    taskID: 6,
    taskName: 'SV-结构变异检测',
    taskProjectName: '基因组变异分析',
    taskSendTime: '2026-03-13 09:00:00',
    taskRunTime: '00:05:22',
    taskStatus: 'TERMINATED',
    taskToolName: 'SV-Detector',
    taskToolVersion: 'V1.2.0.0',
  },
  {
    taskID: 7,
    taskName: 'SNV-靶向测序分析',
    taskProjectName: '遗传病筛查',
    taskSendTime: '2026-03-13 10:30:00',
    taskRunTime: '00:00:00',
    taskStatus: 'SUBMITTED',
    taskToolName: 'GATK-SNV',
    taskToolVersion: 'V2.0.0.0',
  },
  {
    taskID: 8,
    taskName: 'CNV-胚系变异分析',
    taskProjectName: '产前诊断',
    taskSendTime: '2026-03-12 14:00:00',
    taskRunTime: '01:12:08',
    taskStatus: 'COMPLETE',
    taskToolName: 'CycloneCNV',
    taskToolVersion: 'V1.0.0.0',
  },
]

export function getMockTaskList(params?: TaskListParams): TaskListResponse {
  let filteredTasks = [...mockTaskList]

  if (params?.taskStatus) {
    filteredTasks = filteredTasks.filter((t) => t.taskStatus === params.taskStatus)
  }

  if (params?.toolName) {
    const toolNameLower = params.toolName.toLowerCase()
    filteredTasks = filteredTasks.filter((t) =>
      t.taskToolName.toLowerCase().includes(toolNameLower)
    )
  }

  if (params?.taskProject) {
    const projectLower = params.taskProject.toLowerCase()
    filteredTasks = filteredTasks.filter((t) =>
      t.taskProjectName.toLowerCase().includes(projectLower)
    )
  }

  if (params?.startTime) {
    const startTime = params.startTime
    filteredTasks = filteredTasks.filter((t) => t.taskSendTime >= startTime)
  }
  if (params?.endTime) {
    const endTime = params.endTime
    filteredTasks = filteredTasks.filter((t) => t.taskSendTime <= endTime)
  }

  const pageNum = params?.pageNum ?? 1
  const pageSize = params?.pageSize ?? 10
  const total = filteredTasks.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (pageNum - 1) * pageSize
  const pagedTasks = filteredTasks.slice(start, start + pageSize)

  return {
    tasks: pagedTasks,
    pagination: {
      currentPage: pageNum,
      pageSize,
      total,
      totalPages,
    },
  }
}

export function getMockTaskDetail(taskID: number): TaskDetail {
  const task = mockTaskList.find((t) => t.taskID === taskID)
  const taskName = task?.taskName ?? `任务${taskID}`
  const toolName = task?.taskToolName ?? 'Unknown'
  const toolVersion = task?.taskToolVersion ?? 'V1.0.0.0'
  const status = task?.taskStatus ?? 'COMPLETE'

  return {
    taskEndTime: status === 'COMPLETE' ? '2026-03-13 10:35:00' : null,
    taskErrorLog:
      status === 'FAILED'
        ? 'Error: Memory allocation failed at step alignment\nInsufficient RAM for processing large BAM file'
        : null,
    taskName,
    taskParams: [
      {
        key: 'input.fastq',
        name: '测序文件',
        desc: '输入的FASTQ测序数据文件',
        type: 'File',
        value: '/data/samples/sample_001_R1.fastq.gz',
        required: true,
        visible: true,
      },
      {
        key: 'input.reference',
        name: '参考基因组',
        desc: '参考基因组FASTA文件路径',
        type: 'File',
        value: '/data/reference/hg38.fa',
        required: true,
        visible: true,
      },
      {
        key: 'sample.name',
        name: '样本名称',
        desc: '样本标识符',
        type: 'String',
        value: taskName.replace(/[^a-zA-Z0-9]/g, '_'),
        required: true,
        visible: true,
      },
      {
        key: 'params.threads',
        name: '线程数',
        desc: '并行处理线程数',
        type: 'Integer',
        value: '8',
        required: false,
        visible: true,
        default: '4',
      },
      {
        key: 'internal.config',
        name: '内部配置',
        desc: '流程内部配置文件',
        type: 'File',
        value: '/opt/pipeline/config.yaml',
        required: true,
        visible: false,
      },
    ],
    taskPath: {
      output: '/data/results/task_' + taskID,
      logs: '/data/logs/task_' + taskID,
    },
    taskRunTime: task?.taskRunTime ?? '00:25:30',
    taskSendTime: task?.taskSendTime ?? '2026-03-13 09:00:00',
    taskStatus: status,
    taskStep: [
      {
        StepName: 'preprocessing.qc',
        StepStartTime: '2026-03-13 09:00:05',
        StepEndTime: '2026-03-13 09:02:30',
        StepRunTime: '00:02:25',
        StepExitCode: 0,
        StepStdout:
          'FastQC analysis completed\nPer base sequence quality: PASS\nPer sequence GC content: PASS',
        StepStderr: null,
      },
      {
        StepName: 'preprocessing.trim',
        StepStartTime: '2026-03-13 09:02:35',
        StepEndTime: '2026-03-13 09:08:12',
        StepRunTime: '00:05:37',
        StepExitCode: 0,
        StepStdout:
          'Trimmed 2,345,678 reads\nAdapter sequences removed: 98.5%\nQuality trimming: 1.2% bases removed',
        StepStderr: null,
      },
      {
        StepName: 'alignment.bwa',
        StepStartTime: '2026-03-13 09:08:15',
        StepEndTime: '2026-03-13 09:22:45',
        StepRunTime: '00:14:30',
        StepExitCode: 0,
        StepStdout:
          'Alignment completed\nTotal reads: 2,345,678\nMapped reads: 2,298,432 (98.0%)\nProperly paired: 2,245,678 (95.8%)',
        StepStderr: null,
      },
      {
        StepName: 'variant.calling',
        StepStartTime: '2026-03-13 09:22:50',
        StepEndTime: status === 'FAILED' ? null : '2026-03-13 09:35:00',
        StepRunTime: status === 'FAILED' ? '00:00:05' : '00:12:10',
        StepExitCode: status === 'FAILED' ? 1 : 0,
        StepStdout:
          status === 'FAILED'
            ? null
            : 'Variant calling completed\nTotal variants: 1,234\nSNPs: 1,100\nIndels: 134',
        StepStderr:
          status === 'FAILED' ? 'Memory allocation failed\nRequired: 32GB, Available: 16GB' : null,
      },
      {
        StepName: 'annotation.annotate',
        StepStartTime: status === 'COMPLETE' ? '2026-03-13 09:35:05' : null,
        StepEndTime: status === 'COMPLETE' ? '2026-03-13 09:42:30' : null,
        StepRunTime: status === 'COMPLETE' ? '00:07:25' : '00:00:00',
        StepExitCode: status === 'COMPLETE' ? 0 : null,
        StepStdout:
          status === 'COMPLETE'
            ? 'Annotation completed using ANNOVAR\nPathogenic: 5\nLikely pathogenic: 12\nVUS: 89'
            : null,
        StepStderr: null,
      },
    ],
    taskToolName: toolName,
    taskToolVersion: toolVersion,
  }
}

export async function fetchRecentTasks(): Promise<TaskListItem[]> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return getMockTaskList().tasks
  }

  const response = await getTaskList({
    pageNum: 1,
    pageSize: 10,
  })
  return response.tasks
}
