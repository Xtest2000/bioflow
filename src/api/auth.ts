import api from './index'
import type { LoginForm, LoginResponse, User } from '@/types'

export async function login(data: LoginForm): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login/', data)
  return response.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout/')
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const response = await api.post<{ access: string }>('/auth/refresh/', { refresh })
  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>('/auth/user/')
  return response.data
}
