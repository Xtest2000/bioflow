import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with no user', () => {
    const store = useUserStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('login with correct credentials', async () => {
    const store = useUserStore()
    await store.login({ username: 'admin', password: '123456' })

    expect(store.user).not.toBeNull()
    expect(store.user?.username).toBe('admin')
    expect(store.token).not.toBeNull()
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
    expect(store.token).toBeNull()
    expect(store.isLoggedIn).toBe(false)
  })

  it('persists token to localStorage', async () => {
    const store = useUserStore()
    await store.login({ username: 'admin', password: '123456' })

    expect(localStorage.getItem('access_token')).not.toBeNull()
    expect(localStorage.getItem('refresh_token')).not.toBeNull()
  })
})
