import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import type { QueryProviderProps } from './types'

const Devtools = import.meta.env.DEV
  ? React.lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null

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

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={client}>
      {children}
      {Devtools ? (
        <React.Suspense fallback={null}>
          <Devtools initialIsOpen={false} />
        </React.Suspense>
      ) : null}
    </QueryClientProvider>
  )
}
