import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

function getCsrfFromCookie(): string | null {
  const match = document.cookie.match(/csrftoken=([^;]+)/)
  return match && match[1] ? match[1] : null
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const csrfToken = getCsrfFromCookie() || localStorage.getItem('csrf_token')
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('csrf_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
