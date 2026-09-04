export type FontWeight = 400 | 500 | 600 | 700 | 900
export type FontSize = 8 | 10 | 12 | 14 | 16 | 18
export type FontWeightClass =
  `font-${Extract<keyof TypographyTokens['fontWeight'], string>}`

export type FontStyles =
  TypographyTokens['textStyles'][keyof TypographyTokens['textStyles']]

export type TextStyle = {
  fontSize: string
  fontWeight: FontWeight
  lineHeight: string
}

export type TypographyTokens = {
  fontFamily: {
    mono: [string, string]
    sans: [string, string]
  }
  fontWeight: {
    black: number
    bold: number
    semibold: number
    medium: number
    regular: number
  }
  textStyles: {
    body: Record<`body-${FontSize}`, TextStyle>
    headings: Record<`h${1 | 2 | 3 | 4 | 5 | 6}`, TextStyle>
    inline: Record<'p' | 'span', TextStyle>
    link: Record<FontSize, TextStyle>
  }
}

export type ColorShades = {
  10: string
  20: string
  30: string
  40: string
  50?: string
  default?: string
}

export type ThemeName = 'light' | 'dark'

/** Theme preference as stored/exposed to users — `system` follows the OS. */
export type ThemePreference = ThemeName | 'system'

/**
 * Every semantic color role, with one hex value per theme. Adding a key here
 * makes `bg-<key>` / `text-<key>` / `border-<key>` available in Tailwind and
 * forces both themes to define it.
 */
export type SemanticPalette = {
  'canvas': string
  'surface': string
  'surface-muted': string
  'surface-raised': string
  'line': string
  'line-strong': string
  'overlay': string

  'content': string
  'content-muted': string
  'content-subtle': string
  'content-inverted': string

  'accent': string
  'accent-hover': string
  'accent-active': string
  'accent-contrast': string
  /** The accent as text/icon on a surface — not always equal to `accent`. */
  'accent-text': string
  'accent-subtle': string

  'destructive': string
  'destructive-hover': string
  'destructive-active': string
  'destructive-contrast': string

  'nav': string
  'nav-content': string
  'nav-active': string
  'nav-active-content': string

  'tone-success': string
  'tone-success-border': string
  'tone-success-content': string
  'tone-warning': string
  'tone-warning-border': string
  'tone-warning-content': string
  'tone-danger': string
  'tone-danger-border': string
  'tone-danger-content': string
  'tone-info': string
  'tone-info-border': string
  'tone-info-content': string
  'tone-neutral': string
  'tone-neutral-border': string
  'tone-neutral-content': string
}
