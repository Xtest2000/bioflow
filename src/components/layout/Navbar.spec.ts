import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Navbar from './Navbar.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'Dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/tools', name: 'Tools', component: { template: '<div>Tools</div>' } },
    { path: '/tasks', name: 'Tasks', component: { template: '<div>Tasks</div>' } },
    { path: '/login', name: 'Login', component: { template: '<div>Login</div>' } },
  ],
})

describe('Navbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renders navbar with brand text', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.find('.brand-text').text()).toBe('BioFlow')
  })

  it('renders all menu items', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })
    const menuItems = wrapper.findAll('.el-menu-item')
    expect(menuItems.length).toBe(3)
    expect(menuItems[0]?.text()).toContain('首页')
    expect(menuItems[1]?.text()).toContain('工具库')
    expect(menuItems[2]?.text()).toContain('任务列表')
  })

  it('displays username from user store', async () => {
    const userStore = useUserStore()
    await userStore.login({ username: 'admin', password: '123456' })

    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.find('.user-name').text()).toBe('admin')
  })

  it('shows avatar with first letter of username', async () => {
    const userStore = useUserStore()
    await userStore.login({ username: 'admin', password: '123456' })

    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.find('.user-avatar').text()).toBe('A')
  })

  it('calls logout when logout is triggered', async () => {
    const userStore = useUserStore()
    await userStore.login({ username: 'admin', password: '123456' })

    expect(userStore.isLoggedIn).toBe(true)

    await userStore.logout()
    expect(userStore.isLoggedIn).toBe(false)
    expect(userStore.user).toBeNull()
  })
})
