import { describe, expect, it } from 'vitest'
import { cn } from './twMerge'

describe('cn', () => {
  it('keeps the last of two conflicting utilities', () => {
    expect(cn('px-2', 'px-5')).toBe('px-5')
  })

  it('resolves conflicts between semantic color tokens', () => {
    // The project extends tailwind-merge with its own color/font-size groups;
    // without that, both classes would survive and the winner would depend on
    // stylesheet order.
    expect(cn('text-content', 'text-content-muted')).toBe('text-content-muted')
    expect(cn('bg-surface', 'bg-canvas')).toBe('bg-canvas')
  })

  it('does not confuse a font-size token with a text color', () => {
    // `text-body-14` is a size, `text-accent-text` is a color — both start `text-`.
    expect(cn('text-body-14', 'text-accent-text')).toBe(
      'text-body-14 text-accent-text'
    )
  })

  it('drops falsy values and flattens conditionals', () => {
    const isHidden = false
    expect(cn('flex', isHidden && 'hidden', undefined, ['gap-2'])).toBe(
      'flex gap-2'
    )
  })

  it('lets a caller override a base class', () => {
    // This is what every `classNames={{ base: ... }}` prop relies on.
    expect(cn('rounded-lg bg-accent', 'bg-danger-10')).toBe(
      'rounded-lg bg-danger-10'
    )
  })
})
