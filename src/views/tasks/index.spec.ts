import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Tasks from './index.vue'
import { useTaskStore } from '@/stores/task'

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

describe('Tasks.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders tasks page', async () => {
    const wrapper = mount(Tasks)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('任务列表')
  })

  it('renders refresh button', async () => {
    const wrapper = mount(Tasks)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('刷新')
  })

  it('renders search input', async () => {
    const wrapper = mount(Tasks)
    await wrapper.vm.$nextTick()
    const input = wrapper.find('input[placeholder*="搜索"]')
    expect(input.exists()).toBe(true)
  })

  it('maps status types correctly', () => {
    const wrapper = mount(Tasks)
    const vm = wrapper.vm as unknown as {
      getStatusType: (status: string) => '' | 'success' | 'warning' | 'info' | 'danger'
    }
    expect(vm.getStatusType('completed')).toBe('success')
    expect(vm.getStatusType('running')).toBe('warning')
  })

  it('maps status text correctly', () => {
    const wrapper = mount(Tasks)
    const vm = wrapper.vm as unknown as { getStatusText: (status: string) => string }
    expect(vm.getStatusText('completed')).toBe('已完成')
    expect(vm.getStatusText('running')).toBe('运行中')
  })

  it('calls fetchAll on refresh', async () => {
    const store = useTaskStore()
    const fetchAllSpy = vi.spyOn(store, 'fetchAll').mockResolvedValue()
    const wrapper = mount(Tasks)
    await wrapper.vm.$nextTick()
    const vm = wrapper.vm as unknown as { handleRefresh: () => void }
    vm.handleRefresh()
    expect(fetchAllSpy).toHaveBeenCalled()
  })
})
