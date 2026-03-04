import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

vi.mock('@/api/auth', () => ({
  login: vi.fn(async (data: { username: string; password: string }) => {
    if (data.username === 'admin' && data.password === '123456') {
      return {
        csrf_token: 'mock_csrf_token',
        msg: 'success',
        user: { id: 1, username: 'admin', email: 'admin@example.com' },
      }
    }
    throw new Error('用户名或密码错误')
  }),
  logout: vi.fn(async () => {}),
}))

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with no user', () => {
    const store = useUserStore()
    expect(store.user).toBeNull()
    expect(store.csrfToken).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('login with correct credentials', async () => {
    const store = useUserStore()
    await store.login({ username: 'admin', password: '123456' })

    expect(store.user).not.toBeNull()
    expect(store.user?.username).toBe('admin')
    expect(store.csrfToken).not.toBeNull()
    expect(store.isLoggedIn).toBe(true)
  })

  it('login with wrong credentials throws error', async () => {
    const store = useUserStore()
    await expect(store.login({ username: 'wrong', password: 'wrong' })).rejects.toThrow()
    expect(store.user).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('logout clears user data', async () => {
    const store = useUserStore()
    await store.login({ username: 'admin', password: '123456' })
    expect(store.isLoggedIn).toBe(true)

    await store.logout()
    expect(store.user).toBeNull()
    expect(store.csrfToken).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('persists token to localStorage', async () => {
    const store = useUserStore()
    await store.login({ username: 'admin', password: '123456' })

    expect(localStorage.getItem('csrf_token')).not.toBeNull()
  })
})
