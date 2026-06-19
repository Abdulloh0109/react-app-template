import type { TypographyTokens } from './types'

export const typographyTokens: TypographyTokens = {
  fontFamily: {
    mono: ['Inter', 'monospace'],
    sans: ['Inter', 'sans-serif'],
  },
  fontWeight: {
    black: 900,
    bold: 700,
    medium: 500,
    regular: 400,
    semibold: 600,
  },
  textStyles: {
    body: {
      'body-8': { fontSize: '8px', fontWeight: 500, lineHeight: '1' },
      'body-10': { fontSize: '10px', fontWeight: 500, lineHeight: '1.5' },
      'body-12': { fontSize: '12px', fontWeight: 500, lineHeight: '1.5' },
      'body-14': { fontSize: '14px', fontWeight: 500, lineHeight: '2' },
      'body-16': { fontSize: '16px', fontWeight: 500, lineHeight: '2' },
      'body-18': { fontSize: '18px', fontWeight: 500, lineHeight: '2' },
    },
    headings: {
      h1: { fontSize: '40px', fontWeight: 500, lineHeight: 'normal' },
      h2: { fontSize: '32px', fontWeight: 500, lineHeight: 'normal' },
      h3: { fontSize: '28px', fontWeight: 500, lineHeight: 'normal' },
      h4: { fontSize: '24px', fontWeight: 500, lineHeight: 'normal' },
      h5: { fontSize: '20px', fontWeight: 500, lineHeight: 'normal' },
      h6: { fontSize: '16px', fontWeight: 500, lineHeight: 'normal' },
    },
    inline: {
      p: { fontSize: '16px', fontWeight: 500, lineHeight: 'normal' },
      span: { fontSize: '14px', fontWeight: 500, lineHeight: 'normal' },
    },
    link: {
      8: { fontSize: '8px', fontWeight: 500, lineHeight: '1' },
      10: { fontSize: '10px', fontWeight: 500, lineHeight: '1.5' },
      12: { fontSize: '12px', fontWeight: 500, lineHeight: '1.5' },
      14: { fontSize: '14px', fontWeight: 500, lineHeight: '2' },
      16: { fontSize: '16px', fontWeight: 500, lineHeight: '2' },
      18: { fontSize: '18px', fontWeight: 500, lineHeight: '2' },
    },
  },
}
