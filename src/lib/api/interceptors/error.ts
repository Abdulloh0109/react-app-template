import type { AxiosError } from 'axios'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/store'

/**
 * Minimal error interceptor: on 401 it clears the session and bounces to the
 * sign-in page. The source project additionally queues requests and replays
 * them after a silent token refresh — add that here when the backend exposes a
 * refresh endpoint.
 */
export const errorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    useAuthStore.getState().clearTokens()
    if (window.location.pathname !== ROUTES.SIGNIN) {
      window.location.assign(ROUTES.SIGNIN)
    }
  }

  return Promise.reject(error)
}
