import type { ElementType, HTMLAttributes } from 'react'

export type TextProps = HTMLAttributes<HTMLElement> & {
  /** Render as a different element (e.g. `span`, `p`, `label`). */
  as?: ElementType
}
