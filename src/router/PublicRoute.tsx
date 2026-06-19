import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { useAuthStore } from '@/store'

type Props = {
  children: ReactNode
}

export const PublicRoute = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}
