import axios from 'axios'
import {
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from './interceptors'
import { mockAdapter } from './mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const baseConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30_000,
}

export const API = axios.create(baseConfig)

/**
 * Interceptor-free client used only to refresh the access token. Going through
 * `API` would put a 401 on the refresh call back into `errorInterceptor` and
 * recurse.
 */
export const refreshClient = axios.create(baseConfig)

// Serve every request from the in-memory mock layer until a real backend is
// available. Flip VITE_USE_MOCK to "false" to hit VITE_BASE_URL instead.
if (USE_MOCK) {
  API.defaults.adapter = mockAdapter
  refreshClient.defaults.adapter = mockAdapter
}

API.interceptors.request.use(requestInterceptor)
API.interceptors.response.use(responseInterceptor, errorInterceptor)
