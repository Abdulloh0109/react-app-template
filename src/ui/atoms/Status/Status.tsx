import { statusTokens as tokens } from './Status.tokens'
import type { StatusProps } from './Status.types'
import { cn } from '@/utils'

export const Status = ({
  text,
  variant = 'default',
  className,
}: StatusProps) => {
  return (
    <span className={cn(tokens.base, tokens.variants[variant], className)}>
      {text}
    </span>
  )
}
