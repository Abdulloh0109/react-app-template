import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API, refreshClient } from '../axios'
import { ROUTES, URLS } from '@/constants'
import { useAuthStore } from '@/store'

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

type RefreshResponse = {
  access_token: string
  refresh_token?: string
}

/**
 * One in-flight refresh, shared by every request that got a 401 while it runs.
 * Without this, ten parallel calls would fire ten refreshes and nine of them
 * would race the store.
 */
let refreshPromise: Promise<string> | null = null

const requestNewAccessToken = async (): Promise<string> => {
  const { refreshToken, setTokens, setAccessToken } = useAuthStore.getState()

  if (!refreshToken) throw new Error('No refresh token available')

  const { data } = await refreshClient.post<RefreshResponse>(
    URLS.auth.refresh,
    { refresh_token: refreshToken }
  )

  if (!data?.access_token) throw new Error('Refresh response had no token')

  // Backends that rotate refresh tokens send a new one; those that do not keep
  // the existing one valid.
  if (data.refresh_token) {
    setTokens(data.access_token, data.refresh_token)
  } else {
    setAccessToken(data.access_token)
  }

  return data.access_token
}

/** Starts a refresh, or joins the one already running. */
const getRefreshedToken = (): Promise<string> => {
  refreshPromise ??= requestNewAccessToken().finally(() => {
    // Released as soon as the refresh settles — not after the replay — so a
    // later 401 is never served a stale promise.
    refreshPromise = null
  })
  return refreshPromise
}

const endSession = () => {
  useAuthStore.getState().clearTokens()
  if (window.location.pathname !== ROUTES.SIGNIN) {
    window.location.assign(ROUTES.SIGNIN)
  }
}

/**
 * On a 401: refresh the access token once, then replay the original request.
 * Requests that arrive during the refresh wait for the same promise instead of
 * starting their own. If the refresh fails — or the request had already been
 * retried — the session is cleared and the user lands on sign-in.
 */
export const errorInterceptor = async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined
  const status = error.response?.status

  const isRefreshCall = config?.url === URLS.auth.refresh
  const canRetry = status === 401 && config && !config._retry && !isRefreshCall

  if (!canRetry) {
    if (status === 401) endSession()
    return Promise.reject(error)
  }

  config._retry = true

  try {
    const accessToken = await getRefreshedToken()

    config.headers.Authorization = `Bearer ${accessToken}`
    return await API.request(config)
  } catch (refreshError) {
    endSession()
    return Promise.reject(refreshError)
  }
}

/** Test seam — clears the shared in-flight refresh between cases. */
export const __resetRefreshState = () => {
  refreshPromise = null
}
