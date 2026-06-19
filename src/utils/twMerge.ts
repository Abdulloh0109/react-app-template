import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import type { ColorShades, FontStyles } from '@/tokens'
import { colorTokens, typographyTokens } from '@/tokens'

export type FontSizeConverterOptions = { splitClassName: boolean }

export const convertToGroupedFontSizes = (
  styles: FontStyles,
  { splitClassName }: FontSizeConverterOptions = { splitClassName: true }
) => {
  const grouped: Record<string, string[]> = {}

  Object.keys(styles).forEach((key) => {
    const [base, size] = splitClassName ? key.split('-') : ['', key]
    const className = `text-${splitClassName ? base : key}`

    if (!grouped[className]) {
      grouped[className] = []
    }

    grouped[className].push(size)
  })

  return grouped
}

const convertToGroupedColors = (colors: Record<string, ColorShades>) => {
  const grouped: Record<string, string[]> = {}

  Object.entries(colors).forEach(([colorName, shades]) => {
    const className = `text-${colorName}`

    grouped[className] = Object.keys(shades).filter(
      (shade) => !isNaN(Number(shade))
    )
  })

  return grouped
}

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        convertToGroupedFontSizes(typographyTokens.textStyles.body),
        convertToGroupedFontSizes(typographyTokens.textStyles.headings, {
          splitClassName: false,
        }),
        convertToGroupedFontSizes(typographyTokens.textStyles.link, {
          splitClassName: false,
        }),
      ],
      'text-color': [convertToGroupedColors(colorTokens)],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
