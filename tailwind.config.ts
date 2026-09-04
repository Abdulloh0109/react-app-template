import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import tailwindCssAnimate from 'tailwindcss-animate'
import type { TextStyle } from './src/tokens'
import {
  colorTokens,
  semanticTokenNames,
  semanticTokens,
  toCssVariables,
  typographyTokens,
} from './src/tokens'

const { fontFamily, fontWeight, textStyles } = typographyTokens

const dynamicColors: Record<string, string | Record<string, string>> =
  Object.keys(colorTokens).reduce(
    (acc, color) => {
      acc[color] = colorTokens[color as keyof typeof colorTokens]
      return acc
    },
    {} as Record<string, string | Record<string, string>>
  )

/**
 * Semantic roles resolve through CSS custom properties, so a single class such
 * as `bg-surface` renders the right color in both themes. `<alpha-value>` keeps
 * opacity modifiers working (`bg-surface/60`).
 */
const semanticColors = Object.fromEntries(
  semanticTokenNames.map((name) => [
    name,
    `rgb(var(--color-${name}) / <alpha-value>)`,
  ])
)

/** Writes the light palette on `:root` and the dark one under `.dark`. */
const themeVariables = plugin(({ addBase }) => {
  addBase({
    ':root': toCssVariables(semanticTokens.light),
    '.dark': toCssVariables(semanticTokens.dark),
  })
})

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
  plugins: [tailwindCssAnimate, themeVariables],
  theme: {
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'overlayShow': 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'contentShow': 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      // Ant Design v5 radii: borderRadiusSM / borderRadius / borderRadiusLG.
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '8px',
        '2xl': '8px',
      },
      // Ant Design v5 elevation. `card` and `modal` are boxShadowTertiary and
      // boxShadowSecondary; the button shadows are AntD's `controlOutline`-style
      // 2px lift under solid buttons.
      boxShadow: {
        'card':
          '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        'modal':
          '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        'btn': '0 2px 0 rgba(0, 0, 0, 0.02)',
        'btn-primary': '0 2px 0 rgba(5, 145, 255, 0.1)',
        'btn-danger': '0 2px 0 rgba(255, 38, 5, 0.06)',
        // AntD's focus halo, used by inputs and selects.
        'focus': '0 0 0 2px rgb(var(--color-accent) / 0.15)',
      },
      // AntD control heights: controlHeightSM / controlHeight / controlHeightLG.
      height: {
        'control': '32px',
        'control-sm': '24px',
        'control-lg': '40px',
      },
      minHeight: {
        control: '32px',
      },
      colors: {
        ...dynamicColors,
        ...semanticColors,
      },
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
        // The dialog is centered by its flex parent, so this only scales/fades
        // — a translate here would knock it off-center.
        'contentShow': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
} satisfies Config
