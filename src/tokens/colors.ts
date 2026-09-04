import type { ColorShades } from './types'

/**
 * Brand color ramps, taken from Ant Design v5's palettes.
 *
 * These are the *fixed* hues — they mean the same thing in light and dark. For
 * anything structural (page, card, text, border) reach for the semantic tokens
 * in `semantic.ts` instead, which is what makes dark mode work without a single
 * `dark:` class.
 *
 * Each token is a 10–50 ramp so utilities like `bg-primary-10` or `text-dark-30`
 * resolve in Tailwind. Adjust these for a new brand — everything follows.
 */
export const colorTokens: Record<string, ColorShades> = {
  /* AntD neutral text scale (gray-10 → gray-7) */
  dark: {
    10: '#1F1F1F',
    20: '#262626',
    30: '#434343',
    40: '#595959',
    50: '#8C8C8C',
  },
  /* AntD neutral surface scale (gray-6 → gray-2) */
  gray: {
    10: '#BFBFBF',
    20: '#D9D9D9',
    30: '#F0F0F0',
    40: '#F5F5F5',
    50: '#FAFAFA',
  },
  /* AntD blue: 6 / 5 / 7 / 3 / 1 */
  primary: {
    10: '#1677FF',
    20: '#4096FF',
    30: '#0958D9',
    40: '#91CAFF',
    50: '#E6F4FF',
  },
  secondary: {
    10: '#595959',
    20: '#D9D9D9',
    30: '#F0F0F0',
    40: '#F5F5F5',
    50: '#FAFAFA',
  },
  /* AntD green: 6 / 5 / 3 / 8 / 1 */
  success: {
    10: '#52C41A',
    20: '#73D13D',
    30: '#B7EB8F',
    40: '#237804',
    50: '#F6FFED',
  },
  /* AntD red: 5 / 6 / 7 / 3 / 1 */
  danger: {
    10: '#FF4D4F',
    20: '#F5222D',
    30: '#CF1322',
    40: '#FFA39E',
    50: '#FFF1F0',
  },
  /* AntD blue tints */
  info: {
    10: '#1677FF',
    20: '#E6F4FF',
    30: '#BAE0FF',
    40: '#91CAFF',
    50: '#69B1FF',
  },
  /* AntD Tag fills */
  status: {
    10: '#F6FFED',
    20: '#FAFAFA',
    30: '#FFFBE6',
    40: '#FFF7E6',
    50: '#FFF1F0',
    default: '#F9F0FF',
  },
  /* AntD dark Sider */
  sidebar: {
    10: '#FFFFFF',
    20: '#1677FF',
    30: '#8C8C8C',
    40: '#002140',
    50: '#001529',
  },
}
