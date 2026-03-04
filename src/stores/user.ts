import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm } from '@/types'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

const MOCK_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const csrfToken = ref<string | null>(localStorage.getItem('csrf_token'))

  const isLoggedIn = computed(() => !!csrfToken.value)

  async function login(form: LoginForm) {
    const response = await apiLogin(form)
    csrfToken.value = response.csrf_token
    user.value = response.user
    localStorage.setItem('csrf_token', response.csrf_token)
  }

  async function logout() {
    await apiLogout()
    csrfToken.value = null
    user.value = null
  }

  async function fetchUser() {
    if (!csrfToken.value) return
    if (isMockMode && csrfToken.value.startsWith('mock_')) {
      user.value = MOCK_USER
      return
    }
  }

  return {
    user,
    csrfToken,
    isLoggedIn,
    login,
    logout,
    fetchUser,
  }
})
