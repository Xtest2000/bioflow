export interface User {
  id: number
  username: string
  email: string
}

export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  csrf_token: string
  msg: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
