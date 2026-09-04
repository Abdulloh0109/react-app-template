import * as React from 'react'
import { AppRouter } from './router'
import { ErrorBoundary, Toaster } from '@/_shared'
import { QueryProvider, ThemeProvider } from '@/providers'

export const App = () => {
  return (
    <React.Fragment>
      <ErrorBoundary>
        <ThemeProvider>
          <QueryProvider>
            <AppRouter />
          </QueryProvider>
        </ThemeProvider>
      </ErrorBoundary>
      <Toaster />
    </React.Fragment>
  )
}
