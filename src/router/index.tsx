import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { ROUTES } from '@/constants'
import { AuthPage, NotFoundPage } from '@/pages'
import { MainLayout } from '@/templates'
import { Spinner } from '@/ui'

// Feature pages are code-split so the initial bundle stays small.
const HomePage = lazy(() =>
  import('@/pages').then((m) => ({ default: m.HomePage }))
)
const UsersPage = lazy(() =>
  import('@/pages').then((m) => ({ default: m.UsersPage }))
)

const suspense = (node: ReactNode) => (
  <Suspense
    fallback={
      <div className="flex h-full w-full items-center justify-center py-20">
        <Spinner className="size-8 text-primary-10" />
      </div>
    }
  >
    {node}
  </Suspense>
)

const router = createBrowserRouter([
  {
    path: ROUTES.SIGNIN,
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: suspense(<HomePage />) },
      { path: 'users', element: suspense(<UsersPage />) },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
