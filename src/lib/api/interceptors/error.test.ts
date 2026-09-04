import type { AxiosAdapter, AxiosResponse } from 'axios'
import { AxiosError } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { API, refreshClient } from '../axios'
import { __resetRefreshState } from './error'
import { ROUTES, URLS } from '@/constants'
import { useAuthStore } from '@/store'

/**
 * The silent-refresh path is the one piece of the data layer that is hard to
 * verify by hand: it only shows up when a token expires, and getting it wrong
 * logs users out at random. `refreshClient` keeps using the mock handlers, so
 * the real `/auth/refresh` contract is exercised; only the resource endpoint is
 * stubbed to expire on demand.
 */

const ok = (data: unknown, config: Parameters<AxiosAdapter>[0]) =>
  ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }) as AxiosResponse

const unauthorized = (config: Parameters<AxiosAdapter>[0]) =>
  new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, null, {
    data: { detail: 'Token expired' },
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config,
  } as AxiosResponse)

let originalAdapter: AxiosAdapter | undefined
let assign: ReturnType<typeof vi.fn>

beforeEach(() => {
  originalAdapter = API.defaults.adapter as AxiosAdapter
  __resetRefreshState()

  useAuthStore.setState({
    accessToken: 'expired-token',
    refreshToken: 'valid-refresh-token',
    isAuthenticated: true,
    user: { id: '1', full_name: 'Demo Admin', email: 'admin@example.com' },
  })

  assign = vi.fn()
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { pathname: '/users', assign },
  })
})

afterEach(() => {
  API.defaults.adapter = originalAdapter
})

/** Rejects any request still carrying `expired-token`; succeeds otherwise. */
const expiringAdapter = (onCall?: () => void): AxiosAdapter => {
  return async (config) => {
    onCall?.()
    if (config.headers.Authorization === 'Bearer expired-token') {
      throw unauthorized(config)
    }
    return ok({ token: config.headers.Authorization }, config)
  }
}

describe('errorInterceptor', () => {
  it('refreshes once on 401 and replays the original request', async () => {
    let calls = 0
    API.defaults.adapter = expiringAdapter(() => calls++)

    const response = await API.get('/users')

    expect(response.status).toBe(200)
    // Original attempt + replay.
    expect(calls).toBe(2)
    expect(useAuthStore.getState().accessToken).toMatch(/^mock-access-token-/)
    expect(response.data.token).toBe(
      `Bearer ${useAuthStore.getState().accessToken}`
    )
    expect(assign).not.toHaveBeenCalled()
  })

  it('shares one refresh across concurrent 401s', async () => {
    API.defaults.adapter = expiringAdapter()
    const refreshSpy = vi.spyOn(refreshClient, 'post')

    const responses = await Promise.all([
      API.get('/users'),
      API.get('/users/1'),
      API.get('/users/2'),
    ])

    expect(responses.every((r) => r.status === 200)).toBe(true)
    expect(refreshSpy).toHaveBeenCalledTimes(1)
  })

  it('ends the session when the refresh itself fails', async () => {
    useAuthStore.setState({ refreshToken: null })
    API.defaults.adapter = expiringAdapter()

    await expect(API.get('/users')).rejects.toThrow()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(assign).toHaveBeenCalledWith(ROUTES.SIGNIN)
  })

  it('does not retry a request that already failed after a refresh', async () => {
    let calls = 0
    // Always 401, even with a fresh token — a genuinely forbidden resource.
    API.defaults.adapter = async (config) => {
      calls++
      throw unauthorized(config)
    }

    await expect(API.get('/users')).rejects.toThrow()

    expect(calls).toBe(2)
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('never refreshes in response to the refresh endpoint failing', async () => {
    let calls = 0
    API.defaults.adapter = async (config) => {
      calls++
      throw unauthorized(config)
    }

    await expect(API.post(URLS.auth.refresh, {})).rejects.toThrow()

    // One attempt only — no retry loop.
    expect(calls).toBe(1)
    expect(assign).toHaveBeenCalledWith(ROUTES.SIGNIN)
  })

  it('passes non-401 errors straight through and keeps the session', async () => {
    API.defaults.adapter = async (config) => {
      throw new AxiosError('Server error', 'ERR_BAD_RESPONSE', config, null, {
        data: { detail: 'boom' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config,
      } as AxiosResponse)
    }

    await expect(API.get('/users')).rejects.toMatchObject({
      response: { status: 500 },
    })

    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    expect(assign).not.toHaveBeenCalled()
  })

  it('does not redirect when the user is already on the sign-in page', async () => {
    useAuthStore.setState({ refreshToken: null })
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: ROUTES.SIGNIN, assign },
    })
    API.defaults.adapter = expiringAdapter()

    await expect(API.get('/users')).rejects.toThrow()

    expect(assign).not.toHaveBeenCalled()
  })
})
