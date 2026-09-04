import type { SelectHTMLAttributes } from 'react'
import type { SelectOption } from '@/types'

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> & {
  label?: string
  error?: string
  options: SelectOption[]
  /** Shown as a disabled first option when no value is selected yet. */
  placeholder?: string
  classNames?: {
    wrapper?: string
    label?: string
    field?: string
  }
}
