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

  it('renders filter section', async () => {
    const wrapper = mount(Tasks)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('时间范围')
    expect(wrapper.text()).toContain('状态')
  })

  it('maps status types correctly', () => {
    const wrapper = mount(Tasks)
    const vm = wrapper.vm as unknown as {
      getStatusType: (status: string) => '' | 'success' | 'warning' | 'info' | 'danger'
    }
    expect(vm.getStatusType('COMPLETE')).toBe('success')
    expect(vm.getStatusType('RUNNING')).toBe('warning')
    expect(vm.getStatusType('FAILED')).toBe('danger')
  })

  it('calls fetchTaskList on refresh', async () => {
    const store = useTaskStore()
    const fetchSpy = vi.spyOn(store, 'fetchTaskList').mockResolvedValue()
    const wrapper = mount(Tasks)
    await wrapper.vm.$nextTick()
    const vm = wrapper.vm as unknown as { handleRefresh: () => void }
    vm.handleRefresh()
    expect(fetchSpy).toHaveBeenCalled()
  })
})
