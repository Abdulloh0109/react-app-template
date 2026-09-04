import { QueryClient } from '@tanstack/react-query'

/**
 * Single app-wide cache. Lives apart from the provider component so importing
 * it does not break React Fast Refresh, and so tests can build their own client
 * with the same defaults.
 */
export const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
})
