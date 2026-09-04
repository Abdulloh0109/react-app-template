import type { InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import { db, resetDb } from './db'
import { mockHandlers } from './handlers'
import type { ResponseDataWithPagination } from '@/lib/api'
import { MockHttpError } from '@/lib/api/mock/errors'
import type { MockContext, MockHandler } from '@/lib/api/mock'
import type { UserResponseDto } from '@/services'

const find = (method: MockHandler['method'], path: string): MockHandler => {
  const handler = mockHandlers.find(
    (h) => h.method === method && h.pattern.test(path)
  )
  if (!handler) throw new Error(`No handler for ${method} ${path}`)
  return handler
}

const call = <T>(
  method: MockHandler['method'],
  path: string,
  ctx: Partial<MockContext> = {}
): T => {
  const handler = find(method, path)
  return handler.resolve({
    params: {},
    body: undefined,
    match: path.match(handler.pattern) as RegExpMatchArray,
    config: {} as InternalAxiosRequestConfig,
    ...ctx,
  }) as T
}

type UserList = ResponseDataWithPagination<UserResponseDto>

beforeEach(() => {
  resetDb()
})

describe('GET /users', () => {
  it('returns the first page with pagination metadata', () => {
    const result = call<UserList>('get', '/users')

    expect(result.data).toHaveLength(10)
    expect(result.pagination).toMatchObject({
      current_page: 1,
      total_items: db.users.length,
      has_previous_page: false,
      has_next_page: true,
    })
  })

  it('honours page and limit', () => {
    const result = call<UserList>('get', '/users', {
      params: { page: '2', limit: '5' },
    })

    expect(result.data).toHaveLength(5)
    expect(result.data[0]).toEqual(db.users[5])
    expect(result.pagination.has_previous_page).toBe(true)
  })

  it('clamps a page beyond the end to the last page', () => {
    const result = call<UserList>('get', '/users', {
      params: { page: '999', limit: '10' },
    })

    expect(result.pagination.current_page).toBe(result.pagination.total_pages)
    expect(result.pagination.has_next_page).toBe(false)
  })

  it('searches name and email case-insensitively', () => {
    const byName = call<UserList>('get', '/users', {
      params: { search: 'AVA' },
    })
    expect(byName.data.every((u) => /ava/i.test(u.full_name))).toBe(true)

    const byEmail = call<UserList>('get', '/users', {
      params: { search: 'liam.bennett@' },
    })
    expect(byEmail.data).toHaveLength(1)
  })

  it('reports an empty page rather than failing when nothing matches', () => {
    const result = call<UserList>('get', '/users', {
      params: { search: 'no-such-person' },
    })

    expect(result.data).toEqual([])
    expect(result.pagination).toMatchObject({
      total_items: 0,
      total_pages: 1,
      has_next_page: false,
    })
  })

  it('filters by status', () => {
    const result = call<UserList>('get', '/users', {
      params: { status: 'active', limit: '100' },
    })

    expect(result.data.length).toBeGreaterThan(0)
    expect(result.data.every((u) => u.status === 'active')).toBe(true)
  })
})

describe('users CRUD', () => {
  it('creates a user at the top of the list with generated fields', () => {
    const before = db.users.length

    const created = call<UserResponseDto>('post', '/users', {
      body: {
        full_name: 'New Person',
        email: 'new@example.com',
        role: 'admin',
        status: 'active',
      },
    })

    expect(created.id).toBeTruthy()
    expect(created.created_at).toBeTruthy()
    expect(db.users).toHaveLength(before + 1)
    expect(db.users[0]).toEqual(created)
  })

  it('falls back to safe defaults for a partial body', () => {
    const created = call<UserResponseDto>('post', '/users', { body: {} })

    expect(created).toMatchObject({
      full_name: 'Unnamed',
      role: 'member',
      status: 'pending',
    })
  })

  it('returns one user by id, and null for an unknown id', () => {
    expect(call<UserResponseDto>('get', '/users/1')).toEqual(db.users[0])
    expect(call<UserResponseDto | null>('get', '/users/does-not-exist')).toBe(
      null
    )
  })

  it('updates a user without letting the body overwrite its id', () => {
    const updated = call<UserResponseDto>('put', '/users/1', {
      body: { full_name: 'Renamed', id: 'hacked' },
    })

    expect(updated.id).toBe('1')
    expect(updated.full_name).toBe('Renamed')
    expect(updated.email).toBe(db.users[0].email)
  })

  it('returns null when updating a user that is gone', () => {
    expect(
      call<UserResponseDto | null>('put', '/users/nope', {
        body: { full_name: 'x' },
      })
    ).toBe(null)
  })

  it('deletes a user and is idempotent on a second call', () => {
    const before = db.users.length

    expect(call<{ id: string }>('delete', '/users/1').id).toBe('1')
    expect(db.users).toHaveLength(before - 1)

    expect(call<{ id: string }>('delete', '/users/1').id).toBe('1')
    expect(db.users).toHaveLength(before - 1)
  })
})

describe('auth', () => {
  it('echoes the submitted email back in the session user', () => {
    const result = call<{ user: { email: string }; access_token: string }>(
      'post',
      '/auth/login',
      { body: { email: 'someone@example.com' } }
    )

    expect(result.access_token).toBeTruthy()
    expect(result.user.email).toBe('someone@example.com')
  })

  it('issues a new access token when a refresh token is presented', () => {
    const result = call<{ access_token: string }>('post', '/auth/refresh', {
      body: { refresh_token: 'mock-refresh-token' },
    })

    expect(result.access_token).toMatch(/^mock-access-token-/)
  })

  it('rejects a refresh with no token as 401', () => {
    expect(() => call('post', '/auth/refresh', { body: {} })).toThrow(
      MockHttpError
    )

    try {
      call('post', '/auth/refresh', { body: {} })
    } catch (error) {
      expect((error as MockHttpError).status).toBe(401)
    }
  })
})
