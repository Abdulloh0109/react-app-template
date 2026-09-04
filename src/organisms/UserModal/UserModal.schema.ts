import { z } from 'zod'
import type { SelectOption } from '@/types'

export const USER_ROLES = ['admin', 'manager', 'member'] as const
export const USER_STATUSES = ['active', 'inactive', 'pending'] as const

export const userSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Enter a valid email'),
  role: z.enum(USER_ROLES),
  status: z.enum(USER_STATUSES),
})

export type UserFormValues = z.infer<typeof userSchema>

export const defaultUserValues: UserFormValues = {
  full_name: '',
  email: '',
  role: 'member',
  status: 'active',
}

/** Built from the same tuples the schema validates, so the two cannot drift. */
const toOptions = (values: readonly string[]): SelectOption[] =>
  values.map((value) => ({ value, label: value }))

export const ROLE_OPTIONS = toOptions(USER_ROLES)
export const STATUS_OPTIONS = toOptions(USER_STATUSES)
