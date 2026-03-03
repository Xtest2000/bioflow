import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm } from '@/types'

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
}

const isMockMode = true

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))

  const isLoggedIn = computed(() => !!token.value)

  async function login(form: LoginForm) {
    if (isMockMode) {
      if (form.username === 'admin' && form.password === '123456') {
        const mockToken = 'mock_access_token_' + Date.now()
        const mockRefreshToken = 'mock_refresh_token_' + Date.now()
        token.value = mockToken
        refreshToken.value = mockRefreshToken
        user.value = MOCK_USER
        localStorage.setItem('access_token', mockToken)
        localStorage.setItem('refresh_token', mockRefreshToken)
        return
      }
      throw new Error('用户名或密码错误')
    }
  }

  async function logout() {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  async function fetchUser() {
    if (!token.value) return
    if (isMockMode && token.value.startsWith('mock_')) {
      user.value = MOCK_USER
      return
    }
  }

  return {
    user,
    token,
    refreshToken,
    isLoggedIn,
    login,
    logout,
    fetchUser,
  }
})
