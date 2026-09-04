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
        'flex items-center gap-2 text-sm text-content-muted',
        classNames?.label
      )}
    >
      {label}
      <span className={cn('text-sm text-content', classNames?.value)}>
        {value}
      </span>
    </Text>
  )
}
