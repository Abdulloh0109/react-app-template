/**
 * Centralized API endpoint map. Services reference these instead of hard-coding
 * paths, which keeps the mock handlers (`src/mocks/handlers.ts`) and the real
 * backend in sync.
 */
export const URLS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  users: {
    get: '/users',
    create: '/users',
    getById: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
}
