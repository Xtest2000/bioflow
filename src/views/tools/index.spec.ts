import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Tools from './index.vue'
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

describe('Tools.vue', () => {
  let pinia: ReturnType<typeof createPinia>
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/tools', name: 'tools', component: Tools },
        { path: '/tools/:id', name: 'tool-detail', component: { template: '<div/>' } },
      ],
    })
    router.push('/tools')
  })

  const mockTools = [
    {
      toolID: 1,
      toolName: 'CNV',
      toolDesc: 'CNV 检测工具',
      toolDesc_en: 'CNV Detection Tool',
      toolImg: '/cnv.png',
      versions: ['V1.0.0.0'],
    },
    {
      toolID: 2,
      toolName: 'SNP',
      toolDesc: 'SNP 检测工具',
      toolDesc_en: 'SNP Detection Tool',
      toolImg: '/snp.png',
      versions: ['V2.0.0.0', 'V1.0.0.0'],
    },
  ]

  it('renders tools page', async () => {
    const wrapper = mount(Tools, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('工具库')
  })

  it('renders search input', async () => {
    const wrapper = mount(Tools, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.find('input[placeholder*="搜索"]')
    expect(input.exists()).toBe(true)
  })

  it('renders add tool button', async () => {
    const wrapper = mount(Tools, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('添加工具')
  })

  it('navigates to tool detail', async () => {
    const store = useToolStore()
    store.tools = mockTools

    const routerPushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Tools, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as unknown as { handleViewDetail: (tool: { toolID: number }) => void }
    vm.handleViewDetail(mockTools[0]!)

    expect(routerPushSpy).toHaveBeenCalledWith({
      path: '/tools/1',
      query: { version: 'V1.0.0.0' },
    })
  })

  it('navigates to submit page', async () => {
    const store = useToolStore()
    store.tools = mockTools

    const routerPushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(Tools, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.vm.$nextTick()

    const vm = wrapper.vm as unknown as { handleUseTool: (tool: { toolID: number }) => void }
    vm.handleUseTool(mockTools[0]!)

    expect(routerPushSpy).toHaveBeenCalledWith({
      path: '/tools/1/submit',
      query: { version: 'V1.0.0.0' },
    })
  })
})
