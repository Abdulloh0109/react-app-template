import { z } from 'zod'

export const userSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['admin', 'manager', 'member']),
  status: z.enum(['active', 'inactive', 'pending']),
})

export type UserFormValues = z.infer<typeof userSchema>

export const defaultUserValues: UserFormValues = {
  full_name: '',
  email: '',
  role: 'member',
  status: 'active',
}
