export type AuthUser = {
  id: string
  full_name: string
  email: string
}

export type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  user: AuthUser | null
  setTokens: (access: string, refresh: string) => void
  /** Used by the silent-refresh interceptor; leaves the refresh token alone. */
  setAccessToken: (access: string) => void
  setUser: (user: AuthUser) => void
  clearTokens: () => void
}
