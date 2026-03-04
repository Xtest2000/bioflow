import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Login from './index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
  ],
})

describe('Login', () => {
  it('renders login form', () => {
    setActivePinia(createPinia())
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.find('.login-card').exists()).toBe(true)
  })

  it('renders title', () => {
    setActivePinia(createPinia())
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.text()).toContain('BioFlow')
  })

  it('shows test account hint', () => {
    setActivePinia(createPinia())
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.text()).toContain('admin / 123456')
  })

  it('has login button', () => {
    setActivePinia(createPinia())
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    })
    const button = wrapper.find('.login-btn')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('登 录')
  })
})
