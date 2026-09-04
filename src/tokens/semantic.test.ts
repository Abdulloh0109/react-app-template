import { describe, expect, it } from 'vitest'
import { colorTokens } from './colors'
import { hexToRgbChannels, semanticTokens, toCssVariables } from './semantic'
import type { SemanticPalette } from './types'

/** WCAG relative luminance. */
const luminance = (hex: string): number => {
  const [r, g, b] = hexToRgbChannels(hex)
    .split(' ')
    .map((channel) => {
      const c = Number(channel) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio, 1 (identical) to 21 (black on white). */
const contrast = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

/**
 * Pairs that must stay readable. Colors are the one thing that silently
 * degrades — a designer tweaks a hex and nothing fails — so the palette is
 * checked rather than eyeballed.
 */
const AA_NORMAL = 4.5
const AA_LARGE = 3

const textPairs: Array<[keyof SemanticPalette, keyof SemanticPalette]> = [
  ['content', 'canvas'],
  ['content', 'surface'],
  ['content-muted', 'canvas'],
  ['content-muted', 'surface'],
  ['content-muted', 'surface-muted'],
  ['accent-contrast', 'accent'],
  ['accent-contrast', 'accent-hover'],
  ['accent-contrast', 'accent-active'],
  ['accent-text', 'surface'],
  ['accent-text', 'canvas'],
  ['destructive-contrast', 'destructive'],
  ['destructive-contrast', 'destructive-hover'],
  ['destructive-contrast', 'destructive-active'],
  ['nav-content', 'nav'],
  ['nav-active-content', 'nav-active'],
  ['tone-info-content', 'accent-subtle'],
  ['tone-success-content', 'tone-success'],
  ['tone-warning-content', 'tone-warning'],
  ['tone-danger-content', 'tone-danger'],
  ['tone-info-content', 'tone-info'],
  ['tone-neutral-content', 'tone-neutral'],
]

/** Subtle/secondary text is allowed the large-text threshold. */
const largeTextPairs: Array<[keyof SemanticPalette, keyof SemanticPalette]> = [
  ['content-subtle', 'canvas'],
  ['content-subtle', 'surface'],
  ['content-subtle', 'surface-muted'],
]

describe('hexToRgbChannels', () => {
  it('converts six-digit hex to space-separated channels', () => {
    expect(hexToRgbChannels('#2F6BFF')).toBe('47 107 255')
  })

  it('expands three-digit shorthand', () => {
    expect(hexToRgbChannels('#fff')).toBe('255 255 255')
  })

  it('rejects anything that is not a hex color', () => {
    expect(() => hexToRgbChannels('rgb(0,0,0)')).toThrow(/Invalid hex color/)
    expect(() => hexToRgbChannels('#12345')).toThrow(/Invalid hex color/)
  })
})

describe('toCssVariables', () => {
  it('prefixes every token and emits rgb channels', () => {
    const vars = toCssVariables(semanticTokens.light)

    // Derived from the palette, not hardcoded: rebranding must not break this.
    expect(vars['--color-accent']).toBe(
      hexToRgbChannels(semanticTokens.light.accent)
    )
    expect(Object.keys(vars)).toHaveLength(
      Object.keys(semanticTokens.light).length
    )
    expect(Object.keys(vars).every((key) => key.startsWith('--color-'))).toBe(
      true
    )
    expect(
      Object.values(vars).every((value) =>
        /^\d{1,3} \d{1,3} \d{1,3}$/.test(value)
      )
    ).toBe(true)
  })
})

describe('contrast helper', () => {
  // Proves the checks below can actually fail — a contrast assertion that
  // passes for every input would be worse than no assertion at all.
  it('scores known pairs correctly', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 1)
    expect(contrast('#777777', '#888888')).toBeLessThan(AA_NORMAL)
    expect(contrast('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5)
  })
})

describe('semantic palette', () => {
  it('never shadows a brand ramp', () => {
    // `theme.colors` spreads the ramps and then the semantic tokens. A semantic
    // token named after a ramp (`danger`) would silently replace the whole
    // `danger-10..50` scale — hence `destructive`.
    const rampNames = Object.keys(colorTokens)
    const collisions = Object.keys(semanticTokens.light).filter((name) =>
      rampNames.includes(name)
    )
    expect(collisions).toEqual([])
  })

  it('defines exactly the same tokens in both themes', () => {
    expect(Object.keys(semanticTokens.dark).sort()).toEqual(
      Object.keys(semanticTokens.light).sort()
    )
  })

  it.each(['light', 'dark'] as const)(
    '%s: every value is a valid hex color',
    (theme) => {
      Object.entries(semanticTokens[theme]).forEach(([name, value]) => {
        expect(value, `${theme}.${name}`).toMatch(/^#[0-9a-fA-F]{3,6}$/)
      })
    }
  )

  describe.each(['light', 'dark'] as const)('%s contrast', (theme) => {
    it.each(textPairs)(
      `%s on %s clears AA (${AA_NORMAL}:1)`,
      (foreground, background) => {
        const palette = semanticTokens[theme]
        const ratio = contrast(palette[foreground], palette[background])
        expect(
          Number(ratio.toFixed(2)),
          `${theme}: ${foreground} on ${background}`
        ).toBeGreaterThanOrEqual(AA_NORMAL)
      }
    )

    it.each(largeTextPairs)(
      `%s on %s clears AA large (${AA_LARGE}:1)`,
      (foreground, background) => {
        const palette = semanticTokens[theme]
        const ratio = contrast(palette[foreground], palette[background])
        expect(
          Number(ratio.toFixed(2)),
          `${theme}: ${foreground} on ${background}`
        ).toBeGreaterThanOrEqual(AA_LARGE)
      }
    )
  })
})
