import { renderHook, waitFor } from '@testing-library/react'
import { AxiosError } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserQuery,
  useUsersQuery,
} from './queries'
import { API } from '@/lib/api'
import { db, resetDb } from '@/mocks'
import { createHookWrapper } from '@/test/utils'

/**
 * These run against the real axios instance with the mock adapter attached —
 * the same path the app takes. Mocking React Query itself would only prove the
 * mock works; this proves the URL, the query key and the response shape line up.
 */

beforeEach(() => {
  resetDb()
})

describe('useUsersQuery', () => {
  it('loads the first page', async () => {
    const { wrapper } = createHookWrapper('/users')
    const { result } = renderHook(() => useUsersQuery(), { wrapper })

    expect(result.current.isLoadingUsers).toBe(true)

    await waitFor(() => expect(result.current.users).toBeDefined())

    expect(result.current.users?.data).toHaveLength(10)
    expect(result.current.users?.pagination.current_page).toBe(1)
    expect(result.current.isUsersError).toBe(false)
  })

  it('forwards the URL search string to the API as query params', async () => {
    const { wrapper } = createHookWrapper('/users?search=ava&limit=5')
    const { result } = renderHook(() => useUsersQuery(), { wrapper })

    await waitFor(() => expect(result.current.users).toBeDefined())

    const names = result.current.users?.data.map((u) => u.full_name) ?? []
    expect(names.length).toBeGreaterThan(0)
    expect(names.every((name) => /ava/i.test(name))).toBe(true)
  })

  it('stays idle when disabled', async () => {
    const { wrapper } = createHookWrapper('/users')
    const { result } = renderHook(() => useUsersQuery({ enabledLoad: false }), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isLoadingUsers).toBe(false))
    expect(result.current.users).toBeUndefined()
  })

  it('surfaces a failed request as an error state, not an empty list', async () => {
    const original = API.defaults.adapter
    API.defaults.adapter = async (config) => {
      throw new AxiosError('Network down', 'ERR_NETWORK', config)
    }

    try {
      const { wrapper } = createHookWrapper('/users')
      const { result } = renderHook(() => useUsersQuery(), { wrapper })

      await waitFor(() => expect(result.current.isUsersError).toBe(true))
      expect(result.current.users).toBeUndefined()
    } finally {
      API.defaults.adapter = original
    }
  })
})

describe('useUserQuery', () => {
  it('does not fire until enabled', async () => {
    const { wrapper } = createHookWrapper()
    const { result } = renderHook(() => useUserQuery('1', false), { wrapper })

    await waitFor(() => expect(result.current.isLoadingUser).toBe(false))
    expect(result.current.user).toBeUndefined()
  })

  it('loads one user when enabled', async () => {
    const { wrapper } = createHookWrapper()
    const { result } = renderHook(() => useUserQuery('1', true), { wrapper })

    await waitFor(() => expect(result.current.user).toBeDefined())
    expect(result.current.user?.id).toBe('1')
  })
})

describe('mutations', () => {
  it('creates a user and reports it back through the callback', async () => {
    const { wrapper } = createHookWrapper()
    const { result } = renderHook(() => useCreateUser(), { wrapper })

    let created: { id: string; full_name: string } | undefined
    result.current.createUser(
      {
        full_name: 'Test Person',
        email: 'test@example.com',
        role: 'admin',
        status: 'active',
      },
      { onSuccess: (user) => (created = user) }
    )

    await waitFor(() => expect(created).toBeDefined())
    expect(created?.full_name).toBe('Test Person')
    expect(db.users[0].email).toBe('test@example.com')
  })

  it('updates a user', async () => {
    const { wrapper } = createHookWrapper()
    const { result } = renderHook(() => useUpdateUser(), { wrapper })

    let done = false
    result.current.updateUser(
      '1',
      {
        full_name: 'Renamed Person',
        email: db.users[0].email,
        role: 'member',
        status: 'inactive',
      },
      { onSuccess: () => (done = true) }
    )

    await waitFor(() => expect(done).toBe(true))
    expect(db.users.find((u) => u.id === '1')?.full_name).toBe('Renamed Person')
  })

  it('deletes a user', async () => {
    const before = db.users.length
    const { wrapper } = createHookWrapper()
    const { result } = renderHook(() => useDeleteUser(), { wrapper })

    let done = false
    result.current.deleteUser('1', { onSuccess: () => (done = true) })

    await waitFor(() => expect(done).toBe(true))
    expect(db.users).toHaveLength(before - 1)
  })

  it('refreshes the list after a create — the cache is invalidated', async () => {
    const { wrapper } = createHookWrapper('/users?limit=100')
    const { result } = renderHook(
      () => ({ list: useUsersQuery(), create: useCreateUser() }),
      { wrapper }
    )

    await waitFor(() => expect(result.current.list.users).toBeDefined())
    const before = result.current.list.users?.pagination.total_items ?? 0

    result.current.create.createUser({
      full_name: 'Fresh Person',
      email: 'fresh@example.com',
      role: 'member',
      status: 'pending',
    })

    await waitFor(() =>
      expect(result.current.list.users?.pagination.total_items).toBe(before + 1)
    )
  })

  it('reports a failed mutation through onError and leaves data alone', async () => {
    const original = API.defaults.adapter
    API.defaults.adapter = async (config) => {
      throw new AxiosError('Boom', 'ERR_BAD_REQUEST', config)
    }

    try {
      const before = db.users.length
      const { wrapper } = createHookWrapper()
      const { result } = renderHook(() => useCreateUser(), { wrapper })

      let failed = false
      result.current.createUser(
        {
          full_name: 'Nope',
          email: 'nope@example.com',
          role: 'member',
          status: 'active',
        },
        { onError: () => (failed = true) }
      )

      await waitFor(() => expect(failed).toBe(true))
      expect(db.users).toHaveLength(before)
    } finally {
      API.defaults.adapter = original
    }
  })
})
