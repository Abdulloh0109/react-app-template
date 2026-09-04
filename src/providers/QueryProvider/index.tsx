import { QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { client } from './queryClient'
import type { QueryProviderProps } from './types'

const Devtools = import.meta.env.DEV
  ? React.lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : null

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
