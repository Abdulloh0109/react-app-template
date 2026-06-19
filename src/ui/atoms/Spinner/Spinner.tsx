import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

export type SpinnerProps = HTMLAttributes<HTMLSpanElement>

export const Spinner = ({ className, ...props }: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-label="loading"
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
      {...props}
    />
  )
}
