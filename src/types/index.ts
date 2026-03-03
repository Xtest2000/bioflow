export interface User {
  id: number
  username: string
  email: string
  role: string
}

export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
