import axios from 'axios'
import {
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from './interceptors'
import { mockAdapter } from './mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30_000,
})

// Serve every request from the in-memory mock layer until a real backend is
// available. Flip VITE_USE_MOCK to "false" to hit VITE_BASE_URL instead.
if (USE_MOCK) {
  API.defaults.adapter = mockAdapter
}

API.interceptors.request.use(requestInterceptor)
API.interceptors.response.use(responseInterceptor, errorInterceptor)
