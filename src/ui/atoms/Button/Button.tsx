import { forwardRef } from 'react'
import { buttonTokens as tokens } from './Button.tokens'
import type { ButtonProps } from './Button.types'
import { Spinner } from '@/ui/atoms/Spinner'
import { cn } from '@/utils'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      classNames,
      disabled = false,
      icon: Icon,
      iconDimensions = { height: 16, width: 16 },
      iconPosition = 'left',
      size = 'medium',
      variant = 'primary',
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const sizeStyles = tokens.sizes[size]
    const variantStyles = tokens.variants[variant]
    const iconVariantStyles = tokens.icon[variant]

    const renderIcon = (position: 'left' | 'right') =>
      !!Icon &&
      iconPosition === position && (
        <Icon
          aria-hidden
          className={cn(iconVariantStyles, classNames?.icon)}
          height={iconDimensions.height}
          width={iconDimensions.width}
          viewBox={iconDimensions.viewBox}
        />
      )

    return (
      <button
        {...props}
        ref={ref}
        type={props.type ?? 'button'}
        disabled={disabled || isLoading}
        className={cn(
          tokens.base,
          sizeStyles.padding,
          sizeStyles.fontSize,
          variantStyles.base,
          variantStyles.focus,
          !disabled && !isLoading && variantStyles.hover,
          !disabled && !isLoading && variantStyles.active,
          (disabled || isLoading) && variantStyles.disabled,
          classNames?.base
        )}
      >
        {isLoading && <Spinner className="size-4" />}
        {renderIcon('left')}
        {children}
        {renderIcon('right')}
      </button>
    )
  }
)

Button.displayName = 'Button'
