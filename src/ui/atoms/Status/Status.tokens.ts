import type { StatusVariant } from '@/types'

export const statusTokens = {
  base: 'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium w-max',
  variants: {
    success: 'bg-success-30 text-success-40',
    danger: 'bg-status-50 text-danger-20',
    warning: 'bg-status-30 text-primary-30',
    info: 'bg-info-30 text-info-10',
    default: 'bg-status-default text-dark-40',
  } satisfies Record<StatusVariant, string>,
}
