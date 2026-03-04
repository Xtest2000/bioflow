import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

const api: AxiosInstance = axios.create({
  baseURL: isMockMode ? '/api' : 'http://172.29.167.191:4080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const csrfToken = localStorage.getItem('csrf_token')
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
