export type UserRole = 'admin' | 'manager' | 'member'
export type UserStatus = 'active' | 'inactive' | 'pending'

export type UserResponseDto = {
  id: string
  full_name: string
  email: string
  role: UserRole
  status: UserStatus
  created_at: string
}

export type UserRequestDto = {
  full_name: string
  email: string
  role: UserRole
  status: UserStatus
}

export type DeleteUserResponse = {
  status: string
  id: string
}
