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
    },
  ]

  it('initializes with one task', async () => {
    const store = useToolStore()
    store.toolParameters = mockParameters

    const wrapper = mount(Submit, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as unknown as { taskList: unknown[] }
    expect(vm.taskList).toHaveLength(1)
  })

  it('shows warning when downloading with no parameters', async () => {
    const store = useToolStore()
    store.toolParameters = []

    const wrapper = mount(Submit, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as unknown as { downloadTemplate: () => void }
    vm.downloadTemplate()

    const { ElMessage } = await import('element-plus')
    expect(ElMessage.warning).toHaveBeenCalledWith('暂无工具参数')
  })
})
