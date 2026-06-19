import type { AuthUser } from '@/store'

export type LoginRequestDto = {
  email: string
  password: string
}

export type LoginResponseDto = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: AuthUser
}

export type LogoutResponseDto = {
  ok: boolean
  message: string
}
