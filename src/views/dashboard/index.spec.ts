import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Dashboard from './index.vue'

vi.mock('@/components/dashboard/ServerResources.vue', () => ({
  default: { template: '<div class="server-resources">ServerResources</div>' },
}))

vi.mock('@/components/dashboard/TaskOverview.vue', () => ({
  default: { template: '<div class="task-overview">TaskOverview</div>' },
}))

describe('Dashboard.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders dashboard layout', () => {
    const wrapper = mount(Dashboard)

    expect(wrapper.find('.dashboard').exists()).toBe(true)
    expect(wrapper.find('.content-grid').exists()).toBe(true)
  })

  it('renders left panel with ServerResources', () => {
    const wrapper = mount(Dashboard)

    expect(wrapper.find('.left-panel').exists()).toBe(true)
    expect(wrapper.find('.server-resources').exists()).toBe(true)
  })

  it('renders right panel with TaskOverview', () => {
    const wrapper = mount(Dashboard)

    expect(wrapper.find('.right-panel').exists()).toBe(true)
    expect(wrapper.find('.task-overview').exists()).toBe(true)
  })
})
