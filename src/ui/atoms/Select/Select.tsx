import { forwardRef, useId } from 'react'
import { selectTokens as tokens } from './Select.tokens'
import type { SelectProps } from './Select.types'
import { cn } from '@/utils'

/**
 * Native `<select>` styled to match `Input` — same label/error contract, same
 * token names. Native keeps keyboard and mobile behaviour for free; swap in a
 * listbox component only if a project needs multi-select or rich options.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, classNames, id, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const errorId = `${selectId}-error`

    return (
      <div className={cn(tokens.wrapper, classNames?.wrapper)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(tokens.label, classNames?.label)}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              tokens.field.base,
              error ? tokens.field.error : tokens.field.default,
              tokens.field.disabled,
              classNames?.field
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={tokens.chevron}
            aria-hidden
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {error && (
          <span id={errorId} className={tokens.error}>
            {error}
          </span>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
