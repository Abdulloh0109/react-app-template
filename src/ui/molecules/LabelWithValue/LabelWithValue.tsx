import type { ReactNode } from 'react'
import { Text } from '@/ui/atoms'
import { cn } from '@/utils'

export type LabelWithValueProps = {
  label?: ReactNode
  value?: ReactNode
  classNames?: {
    label?: string
    value?: string
  }
}

export const LabelWithValue = ({
  label,
  value,
  classNames,
}: LabelWithValueProps) => {
  return (
    <Text
      as="span"
      className={cn(
        'flex items-center gap-2.5 text-sm font-medium text-dark-40/[.5]',
        classNames?.label
      )}
    >
      {label}
      <span
        className={cn('text-sm font-semibold text-dark-30', classNames?.value)}
      >
        {value}
      </span>
    </Text>
  )
}
