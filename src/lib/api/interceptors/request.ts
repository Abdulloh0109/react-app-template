import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}
