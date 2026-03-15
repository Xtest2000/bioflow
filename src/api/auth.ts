import api from './index'
import type { LoginForm, LoginResponse, User } from '@/types'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

export async function login(data: LoginForm): Promise<LoginResponse> {
  if (isMockMode) {
    if (data.username === 'admin' && data.password === '123456') {
      return {
        csrf_token: 'mock_csrf_token_' + Date.now(),
        msg: 'success',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
        },
      }
    }
    throw new Error('用户名或密码错误')
  }

  const response = await api.post<LoginResponse>('/analysis/login/', data)
  return response.data
}

export async function logout(): Promise<void> {
  try {
    if (!isMockMode) {
      await api.post('/analysis/logout/')
    }
  } finally {
    // 无论 API 调用成功与否，都清除本地存储
    localStorage.removeItem('csrf_token')
  }
}

export async function register(data: LoginForm): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/analysis/register/', data)
  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/analysis/user/')
  return response.data
}
