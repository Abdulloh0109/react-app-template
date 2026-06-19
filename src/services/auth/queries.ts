import { useNavigate } from 'react-router-dom'
import type {
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
} from './types'
import { ROUTES, URLS } from '@/constants'
import { useCreate, type ErrorResponseDto } from '@/lib/api'
import { useAuthStore } from '@/store'
import type { Callbacks } from '@/types'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setTokens, setUser, clearTokens } = useAuthStore((state) => state)

  const { mutate: loginMutate, isPending: isLoggingIn } = useCreate<
    LoginRequestDto,
    LoginResponseDto,
    ErrorResponseDto
  >(URLS.auth.login)

  const login = (
    data: LoginRequestDto,
    callbacks?: Callbacks<LoginResponseDto>
  ) => {
    return loginMutate(data, {
      onSuccess: (response) => {
        if (response.access_token) {
          setTokens(response.access_token, response.refresh_token)
          setUser(response.user)
          navigate(ROUTES.HOME, { replace: true })
          callbacks?.onSuccess?.(response)
        }
      },
      onError: (error) => callbacks?.onError?.(error),
    })
  }

  const { mutate: logoutMutate } = useCreate<
    undefined,
    LogoutResponseDto,
    ErrorResponseDto
  >(URLS.auth.logout)

  const logout = (callbacks?: Callbacks<LogoutResponseDto>) => {
    return logoutMutate(undefined, {
      onSuccess: (response) => {
        clearTokens()
        navigate(ROUTES.SIGNIN, { replace: true })
        callbacks?.onSuccess?.(response)
      },
      onError: (error) => callbacks?.onError?.(error),
    })
  }

  return { login, logout, isLoggingIn }
}
