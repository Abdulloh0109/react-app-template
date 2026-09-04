import { db, nextId, type MockUser } from './db'
import { MockHttpError } from '@/lib/api/mock/errors'
import type { MockHandler } from '@/lib/api/mock'
import type { ResponseDataWithPagination } from '@/lib/api'

const paginate = <T>(
  items: T[],
  page: number,
  limit: number
): ResponseDataWithPagination<T> => {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * limit
  const data = items.slice(start, start + limit)

  return {
    status: 'success',
    message: 'OK',
    pagination: {
      total_pages: totalPages,
      current_page: currentPage,
      total_items: totalItems,
      has_next_page: currentPage < totalPages,
      has_previous_page: currentPage > 1,
    },
    data,
  }
}

export const mockHandlers: MockHandler[] = [
  /* ---------------------------------- auth --------------------------------- */
  {
    method: 'post',
    pattern: /^\/auth\/login$/,
    resolve: ({ body }) => {
      const { email } = (body ?? {}) as { email?: string }
      return {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          id: '1',
          full_name: 'Demo Admin',
          email: email ?? 'admin@example.com',
        },
      }
    },
  },
  {
    method: 'post',
    pattern: /^\/auth\/logout$/,
    resolve: () => ({ ok: true, message: 'Logged out' }),
  },
  {
    // Exercised by the silent-refresh interceptor. Rejects with a 401 when no
    // refresh token is presented, which is what pushes the user to sign-in.
    method: 'post',
    pattern: /^\/auth\/refresh$/,
    resolve: ({ body }) => {
      const { refresh_token } = (body ?? {}) as { refresh_token?: string }
      if (!refresh_token) {
        throw new MockHttpError(401, 'Invalid refresh token')
      }
      return {
        access_token: `mock-access-token-${Date.now()}`,
        refresh_token: 'mock-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
      }
    },
  },

  /* --------------------------------- users --------------------------------- */
  {
    method: 'get',
    pattern: /^\/users$/,
    resolve: ({ params }) => {
      const search = (params.search ?? '').toLowerCase()
      const status = params.status ?? ''
      const page = Number(params.page ?? 1)
      const limit = Number(params.limit ?? 10)

      let result = db.users
      if (search) {
        result = result.filter(
          (u) =>
            u.full_name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        )
      }
      if (status) {
        result = result.filter((u) => u.status === status)
      }

      return paginate(result, page, limit)
    },
  },
  {
    method: 'get',
    pattern: /^\/users\/([^/]+)$/,
    resolve: ({ match }) => db.users.find((u) => u.id === match[1]) ?? null,
  },
  {
    method: 'post',
    pattern: /^\/users$/,
    resolve: ({ body }) => {
      const payload = (body ?? {}) as Partial<MockUser>
      const user: MockUser = {
        id: nextId(),
        full_name: payload.full_name ?? 'Unnamed',
        email: payload.email ?? '',
        role: payload.role ?? 'member',
        status: payload.status ?? 'pending',
        created_at: new Date().toISOString(),
      }
      db.users.unshift(user)
      return user
    },
  },
  {
    method: 'put',
    pattern: /^\/users\/([^/]+)$/,
    resolve: ({ match, body }) => {
      const id = match[1]
      const index = db.users.findIndex((u) => u.id === id)
      if (index === -1) return null
      db.users[index] = {
        ...db.users[index],
        ...(body as Partial<MockUser>),
        id,
      }
      return db.users[index]
    },
  },
  {
    method: 'delete',
    pattern: /^\/users\/([^/]+)$/,
    resolve: ({ match }) => {
      const id = match[1]
      db.users = db.users.filter((u) => u.id !== id)
      return { status: 'success', id }
    },
  },
]
