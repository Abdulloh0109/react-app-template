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
