import type { ButtonHTMLAttributes, FunctionComponent, SVGProps } from 'react'
import type { buttonTokens } from './Button.tokens'

export type ButtonVariant = keyof (typeof buttonTokens)['variants']
export type ButtonSize = keyof (typeof buttonTokens)['sizes']

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>
  iconDimensions?: { height?: number; width?: number; viewBox?: string }
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  classNames?: {
    base?: string
    icon?: string
  }
}
