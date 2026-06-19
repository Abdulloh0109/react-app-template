import type { Config } from 'tailwindcss'
import tailwindCssAnimate from 'tailwindcss-animate'
import type { TextStyle } from './src/tokens'
import { colorTokens, typographyTokens } from './src/tokens'

const { fontFamily, fontWeight, textStyles } = typographyTokens

const dynamicColors: Record<string, string | Record<string, string>> =
  Object.keys(colorTokens).reduce(
    (acc, color) => {
      acc[color] = colorTokens[color as keyof typeof colorTokens]
      return acc
    },
    {} as Record<string, string | Record<string, string>>
  )

const generateDynamicFontSizes = <T extends Record<string, TextStyle>>(
  styles: T
) =>
  (Object.keys(styles) as (keyof T)[]).reduce(
    (acc, key) => {
      acc[key as string] = [
        styles[key].fontSize,
        {
          fontWeight: styles[key].fontWeight,
          lineHeight: styles[key].lineHeight,
        },
      ]
      return acc
    },
    {} as Record<string, [string, { fontWeight: number; lineHeight: string }]>
  )

const generateFlatFontSizes = <T extends Record<string, TextStyle>>(
  styles: T
) =>
  (Object.keys(styles) as (keyof T)[]).reduce(
    (acc, key) => {
      acc[key as string] = [styles[key].fontSize, styles[key].lineHeight]
      return acc
    },
    {} as Record<string, [string, string]>
  )

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  plugins: [tailwindCssAnimate],
  theme: {
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'overlayShow': 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'contentShow': 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        '3xl': '0 4px 39px -13px rgba(66, 66, 66, 0.15)',
        '4xl': '0 2px 10px 0 rgba(209, 156, 5, 0.3)',
      },
      colors: dynamicColors,
      fontFamily: {
        mono: fontFamily.mono,
        sans: fontFamily.sans,
      },
      fontSize: {
        ...generateDynamicFontSizes(textStyles.body),
        ...generateDynamicFontSizes(textStyles.headings),
        ...generateDynamicFontSizes(textStyles.inline),
        ...generateFlatFontSizes(textStyles.link),
      },
      fontWeight: {
        black: String(fontWeight.black),
        bold: String(fontWeight.bold),
        medium: String(fontWeight.medium),
        regular: String(fontWeight.regular),
        semibold: String(fontWeight.semibold),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'overlayShow': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'contentShow': {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
    },
  },
} satisfies Config
