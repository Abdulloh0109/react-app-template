import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

type Options = Omit<RenderOptions, 'wrapper'> & {
  /** Initial URL, e.g. `/users?search=ava&page=2`. */
  route?: string
}

/**
 * A cache per test. Sharing one client leaks results between cases and is the
 * usual source of "passes alone, fails in the suite".
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })

/**
 * Renders with the providers every app component assumes: a router (services
 * read the URL for pagination) and a React Query cache.
 */
export const renderWithProviders = (
  ui: ReactElement,
  { route = '/', ...options }: Options = {}
) => {
  const queryClient = createTestQueryClient()

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  )

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  }
}

/** Hook-only variant, for testing service hooks without a component. */
export const createHookWrapper = (route = '/') => {
  const queryClient = createTestQueryClient()

  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  )

  return { wrapper, queryClient }
}
