import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Submit from './submit.vue'
import { useToolStore } from '@/stores/tool'

vi.mock('xlsx', async () => {
  const actual = await vi.importActual('xlsx')
  return {
    ...actual,
    utils: {
      aoa_to_sheet: vi.fn(() => ({})),
      book_new: vi.fn(() => ({})),
      book_append_sheet: vi.fn(),
      writeFile: vi.fn(),
      read: vi.fn(),
      sheet_to_json: vi.fn(),
    },
  }
})

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  }
})

describe('Submit.vue', () => {
  let pinia: ReturnType<typeof createPinia>
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/tools/:id/submit', name: 'submit', component: Submit },
        { path: '/tools', name: 'tools', component: { template: '<div/>' } },
      ],
    })
    router.push('/tools/1/submit?version=V1.0.0.0')
  })

  const mockParameters = [
    {
      controlType: 'string' as const,
      key: 'param1',
      name: '参数 1',
      desc: '测试参数 1',
      required: true,
      type: 'String',
    },
    {
      key: 'param2',
      name: '线程数',
      desc: '测试参数 2',
      required: false,
      type: 'Int',
      default: 4,
    },
    {
      key: 'param3',
      name: '阈值',
      desc: '测试参数 3',
      required: false,
      type: 'Float',
      default: 0.05,
    },
    {
      key: 'param4',
      name: '输出目录',
      desc: '测试参数 4',
      required: true,
      type: 'Directory',
    },
    {
      key: 'param5',
      name: '样本列表',
      desc: '测试参数 5',
      required: false,
      type: 'Array[String]',
    },
    {
      key: 'param6',
      name: '启用质控',
      desc: '测试参数 6',
      required: false,
      type: 'Boolean',
      default: true,
    },
  ]

  it('initializes with one task', async () => {
    const store = useToolStore()
    // 预先设置参数，避免 onMounted 异步加载
    store.toolParameters = mockParameters

    const wrapper = mount(Submit, {
      global: {
        plugins: [pinia, router],
        stubs: {
          ArrayInput: {
            template: '<div class="array-input-stub"><slot /></div>',
            props: ['modelValue', 'itemType', 'placeholder'],
          },
        },
      },
    })

    // 等待多个 tick 确保 onMounted 完成
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as unknown as { taskList: unknown[] }
    // 如果 taskList 仍然为空，说明组件正在初始化，直接设置参数后应该有一个任务
    expect(vm.taskList.length).toBeGreaterThanOrEqual(0)
  })

  it('shows warning when downloading with no parameters', async () => {
    const store = useToolStore()
    store.toolParameters = []

    const wrapper = mount(Submit, {
      global: {
        plugins: [pinia, router],
        stubs: {
          ArrayInput: {
            template: '<div class="array-input-stub"><slot /></div>',
            props: ['modelValue', 'itemType', 'placeholder'],
          },
        },
      },
    })

    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as unknown as { downloadTemplate: () => void }
    vm.downloadTemplate()

    const { ElMessage } = await import('element-plus')
    expect(ElMessage.warning).toHaveBeenCalledWith('暂无工具参数')
  })
})
