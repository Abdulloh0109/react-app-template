import type { TextProps } from './Text.types'
import { cn } from '@/utils'

export const Text = ({
  as: Component = 'p',
  className,
  children,
  ...props
}: TextProps) => {
  return (
    <Component className={cn('text-sm text-content', className)} {...props}>
      {children}
    </Component>
  )
}
