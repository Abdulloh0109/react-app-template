import * as React from 'react'
import { AppRouter } from './router'
import { Toaster } from '@/_shared'
import { QueryProvider } from '@/providers'

export const App = () => {
  return (
    <React.Fragment>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
      <Toaster />
    </React.Fragment>
  )
}
