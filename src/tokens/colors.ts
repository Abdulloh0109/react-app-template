import type { ColorShades } from './types'

/**
 * Brand color scale. Each token is a 10–50 shade ramp so utilities like
 * `bg-primary-10`, `text-dark-30` or `fill-danger-10` resolve in Tailwind.
 * Adjust these for a new project — every component reads from here.
 */
export const colorTokens: Record<string, ColorShades> = {
  dark: {
    10: '#242424',
    20: '#323234',
    30: '#424242',
    40: '#4A4A4A',
    50: '#747474',
  },
  gray: {
    10: '#B6B7BA',
    20: '#B5B5B5',
    30: '#D1D1D1',
    40: '#F2F2F2',
    50: '#F3F6F8',
  },
  primary: {
    10: '#2F6BFF',
    20: '#225AE0',
    30: '#1B49BD',
    40: '#C9D8FF',
    50: '#EEF3FF',
  },
  secondary: {
    10: '#606061',
    20: '#D9D9DF',
    30: '#E3E3E8',
    40: '#EFEFF3',
    50: '#F7F7FA',
  },
  success: {
    10: '#2EBF42',
    20: '#76BF97',
    30: '#CCFBE0',
    40: '#16A52A',
    50: '#F0F9E3',
  },
  danger: {
    10: '#F42929',
    20: '#EB2428',
    30: '#D61B1E',
    40: '#E69494',
    50: '#FFCCCE',
  },
  info: {
    10: '#1B9BE4',
    20: '#DFF8FF',
    30: '#D9EDFF',
    40: '#B8DBF6',
    50: '#99C5EC',
  },
  status: {
    10: '#CCF8E0',
    20: '#E8EAEE',
    30: '#FFF2CE',
    40: '#FFDDCC',
    50: '#FFC2C2',
    default: '#EFE5FF',
  },
  sidebar: {
    10: '#FFFFFF',
    20: '#2F6BFF',
    30: '#585858',
    40: '#434343',
    50: '#1F2937',
  },
}
