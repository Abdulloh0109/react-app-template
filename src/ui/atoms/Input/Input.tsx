import { forwardRef, useId } from 'react'
import { inputTokens as tokens } from './Input.tokens'
import type { InputProps } from './Input.types'
import { cn } from '@/utils'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, classNames, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className={cn(tokens.wrapper, classNames?.wrapper)}>
        {label && (
          <label htmlFor={inputId} className={cn(tokens.label, classNames?.label)}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            tokens.field.base,
            error ? tokens.field.error : tokens.field.default,
            tokens.field.disabled,
            classNames?.field
          )}
          {...props}
        />
        {error && <span className={tokens.error}>{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
