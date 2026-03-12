import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToolStore } from './tool'

vi.mock('@/api/tool', () => {
  return {
    fetchToolList: vi.fn(async () => ({
      pagination: { currentPage: 1, pageSize: '10', total: 1, totalPages: 1 },
      tools: [
        {
          toolID: 1,
          toolName: 'CNV',
          toolDesc: '测试工具',
          toolDesc_en: 'Test tool',
          toolImg: '/test/logo.jpg',
          versions: ['V1.0.0.0'],
        },
      ],
    })),
    fetchToolDetail: vi.fn(async () => ({
      toolID: 1,
      toolName: 'CNV',
      toolDesc: '测试工具',
      toolDesc_en: 'Test tool',
      version: 'V1.0.0.0',
      developer: 'tester',
      published: '2023-01-01',
      inFileDesc: ['输入文件'],
      outFileDesc: ['输出文件'],
      workflowDesc: ['工作流程'],
    })),
    fetchToolParameter: vi.fn(async () => ({
      params: [
        {
          controlType: 'file',
          key: 'test.file',
          name: '测试文件',
          desc: '测试描述',
          required: true,
          type: 'File',
          visible: true,
          enabled_for_sequencing: true,
        },
        {
          controlType: 'string',
          key: 'test.name',
          name: '测试名称',
          desc: '测试描述',
          required: true,
          type: 'String',
          visible: true,
        },
      ],
      toolID: 1,
      tool_real_time_analysis: false,
    })),
    fetchSubmitTask: vi.fn(async () => ({
      code: 200,
      message: '任务提交成功',
      taskID: 'task_123',
    })),
    fetchBatchSubmitTask: vi.fn(async (params: { list: Array<{ taskName: string }> }) => ({
      code: 200,
      message: '批量任务提交成功',
      data: params.list.map((task, index) => ({
        taskID: `task_${index}`,
        taskName: task.taskName,
        taskStatus: 'Submitted',
      })),
    })),
    addTool: vi.fn(async () => ({
      id: 1,
      tool_name: 'TestTool',
      tool_version: 'V1.0.0.0',
      created: '2023-01-01',
      message: 'Tool created successfully',
    })),
    deleteTool: vi.fn(async () => ({
      code: 200,
      message: '删除成功',
      toolID: '1',
    })),
  }
})

describe('useToolStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = useToolStore()
    expect(store.tools).toHaveLength(0)
    expect(store.pagination.currentPage).toBe(1)
    expect(store.isLoading).toBe(false)
    expect(store.submitting).toBe(false)
  })

  it('fetches tools successfully', async () => {
    const store = useToolStore()
    await store.fetchTools(1, 10)

    expect(store.tools).toHaveLength(1)
    expect(store.tools[0]?.toolName).toBe('CNV')
    expect(store.pagination.total).toBe(1)
    expect(store.isLoading).toBe(false)
  })

  it('fetches tool parameters successfully', async () => {
    const store = useToolStore()
    await store.fetchToolParameters(1, 'V1.0.0.0')

    expect(store.toolParameters).toHaveLength(2)
    expect(store.toolParameters[0]?.name).toBe('测试文件')
    expect(store.toolParameters[1]?.controlType).toBe('string')
  })

  it('submits single task successfully', async () => {
    const store = useToolStore()
    await store.submitTask(1, 'V1.0.0.0', {
      'test.file': '/path/to/file.txt',
      'test.name': 'test_sample',
    })

    expect(store.submitSuccess).toBe(true)
    expect(store.submitting).toBe(false)
  })

  it('submits batch tasks successfully', async () => {
    const store = useToolStore()
    const batchTasks = [
      {
        taskName: '任务 1',
        projectName: '项目 1',
        is_sequence: 'false',
        params: {
          'test.file': '/path/to/file1.txt',
          'test.name': 'sample1',
        },
      },
      {
        taskName: '任务 2',
        projectName: '项目 2',
        is_sequence: 'true',
        params: {
          'test.file': '/path/to/file2.txt',
          'test.name': 'sample2',
        },
      },
    ]

    await store.submitBatchTask(1, 'V1.0.0.0', batchTasks)

    expect(store.submitSuccess).toBe(true)
    expect(store.submitting).toBe(false)
  })

  it('handles batch task submission with multiple tasks', async () => {
    const store = useToolStore()
    const mockTasks = Array.from({ length: 5 }, (_, i) => ({
      taskName: `任务${i + 1}`,
      projectName: `项目${i + 1}`,
      is_sequence: i % 2 === 0 ? 'true' : 'false',
      params: {
        'test.file': `/path/to/file${i}.txt`,
        'test.name': `sample${i}`,
      },
    }))

    await store.submitBatchTask(1, 'V1.0.0.0', mockTasks)

    expect(store.submitSuccess).toBe(true)
  })

  it('resets submission state', () => {
    const store = useToolStore()
    store.submitting = true
    store.submitError = 'some error'
    store.submitSuccess = true
    store.submitTaskId = 'task_123'

    store.resetSubmitState()

    expect(store.submitting).toBe(false)
    expect(store.submitError).toBeNull()
    expect(store.submitSuccess).toBe(false)
    expect(store.submitTaskId).toBeNull()
  })

  it('sets search name', () => {
    const store = useToolStore()
    store.setSearchName('CNV')
    expect(store.searchName).toBe('CNV')
  })
})
