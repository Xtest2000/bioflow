import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Detail from './detail.vue'
import { useToolStore } from '@/stores/tool'

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

describe('Detail.vue', () => {
  let pinia: ReturnType<typeof createPinia>
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/tools/:id', name: 'tool-detail', component: Detail },
        { path: '/tools', name: 'tools', component: { template: '<div/>' } },
      ],
    })
    router.push('/tools/1?version=V1.0.0.0')
  })

  const mockDetail = {
    toolID: 1,
    toolName: 'CNV 检测工具',
    toolDesc: 'CNV 检测工具描述',
    toolDesc_en: 'CNV Detection Tool',
    version: 'V1.0.0.0',
    developer: '开发者',
    published: '2024-01-01',
    inFileDesc: ['输入文件 1', '输入文件 2'],
    outFileDesc: ['输出文件 1'],
    workflowDesc: ['步骤 1'],
  }

  it('renders back button', async () => {
    const wrapper = mount(Detail, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('返回工具库')
  })

  it('renders loading state', async () => {
    const store = useToolStore()
    store.isLoading = true

    const wrapper = mount(Detail, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('加载中...')
  })

  it('renders tool detail', async () => {
    const store = useToolStore()
    store.currentToolDetail = mockDetail
    store.isLoading = false

    const wrapper = mount(Detail, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('CNV 检测工具')
    expect(wrapper.text()).toContain('V1.0.0.0')
    expect(wrapper.text()).toContain('开发者')
  })

  it('renders input file list', async () => {
    const store = useToolStore()
    store.currentToolDetail = mockDetail
    store.isLoading = false

    const wrapper = mount(Detail, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('输入文件 1')
    expect(wrapper.text()).toContain('输入文件 2')
  })

  it('renders output file list', async () => {
    const store = useToolStore()
    store.currentToolDetail = mockDetail
    store.isLoading = false

    const wrapper = mount(Detail, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('输出文件 1')
  })

  it('navigates back', async () => {
    const routerPushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Detail, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as unknown as { handleBack: () => void }
    vm.handleBack()

    expect(routerPushSpy).toHaveBeenCalledWith('/tools')
  })
})
