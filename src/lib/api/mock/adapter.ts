import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { AxiosError } from 'axios'
import { MockHttpError } from './errors'
import { mockHandlers } from '@/mocks'

export type MockContext = {
  params: Record<string, string>
  body: unknown
  /** Regex capture groups from the matched path (e.g. an `:id` segment). */
  match: RegExpMatchArray
  config: InternalAxiosRequestConfig
}

export type MockHandler = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  /** Matched against the request path (without query string). */
  pattern: RegExp
  resolve: (ctx: MockContext) => unknown | Promise<unknown>
}

/**
 * Simulated latency, so loading states are visible while developing. Set
 * `VITE_MOCK_DELAY=0` to remove it (the test setup does exactly that).
 */
const NETWORK_DELAY_MS = Number(import.meta.env.VITE_MOCK_DELAY ?? 350)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const toParams = (raw: unknown): Record<string, string> => {
  if (raw instanceof URLSearchParams) return Object.fromEntries(raw)
  if (raw && typeof raw === 'object') return raw as Record<string, string>
  return {}
}

const parseBody = (data: unknown): unknown => {
  if (typeof data !== 'string') return data
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

const toAxiosError = (
  message: string,
  code: string,
  config: InternalAxiosRequestConfig,
  status: number,
  statusText: string,
  detail: string
) =>
  new AxiosError(message, code, config, null, {
    data: { detail },
    status,
    statusText,
    headers: {},
    config,
  } as AxiosResponse)

/**
 * A drop-in axios adapter that serves requests from `src/mocks/handlers`.
 * Wired up in `axios.ts` only when `VITE_USE_MOCK === 'true'`, so production
 * code keeps using the real network adapter untouched.
 */
export const mockAdapter: AxiosAdapter = async (config) => {
  if (NETWORK_DELAY_MS > 0) await delay(NETWORK_DELAY_MS)

  const method = (config.method ?? 'get').toLowerCase()
  const path = (config.url ?? '').split('?')[0]
  const params = toParams(config.params)
  const body = parseBody(config.data)

  for (const handler of mockHandlers) {
    if (handler.method !== method) continue
    const match = path.match(handler.pattern)
    if (!match) continue

    try {
      const data = await handler.resolve({ params, body, match, config })

      return {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse
    } catch (error) {
      if (error instanceof MockHttpError) {
        throw toAxiosError(
          error.message,
          'ERR_BAD_RESPONSE',
          config,
          error.status,
          error.message,
          error.detail
        )
      }
      throw error
    }
  }

  throw toAxiosError(
    `No mock handler for ${method.toUpperCase()} ${path}`,
    'ERR_MOCK_NOT_FOUND',
    config,
    404,
    'Not Found',
    'Not found'
  )
}
