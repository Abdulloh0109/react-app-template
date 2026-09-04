import type { SemanticPalette, ThemeName } from './types'

/**
 * Semantic (theme-aware) color layer.
 *
 * The ramps in `colors.ts` are the *brand* — fixed hues that never change with
 * the theme. These tokens are the *roles* those hues play on screen (page
 * background, card surface, body text, borders…), and each role has a value per
 * theme. `tailwind.config.ts` turns them into CSS custom properties on `:root`
 * and `.dark`, then exposes them as utilities: `bg-canvas`, `text-content-muted`,
 * `border-line`.
 *
 * Rule of thumb when writing components:
 *   - structural color (surface, text, border) → semantic token
 *   - brand accent that must stay blue in both themes → `primary-*` ramp
 *
 * ── Ant Design ──────────────────────────────────────────────────────────────
 * The values below come from Ant Design v5's design tokens (light = default
 * algorithm, dark = dark algorithm), so the app reads as an AntD product.
 *
 * Where AntD's own pairing falls short of WCAG AA, we take the neighbouring
 * step from the *same* AntD palette rather than inventing a color — visually
 * indistinguishable, measurably readable. Those three cases are marked `AA:`
 * below, and `semantic.test.ts` enforces every pair.
 */
export const semanticTokens: Record<ThemeName, SemanticPalette> = {
  light: {
    /* structure — AntD colorBgLayout / colorBgContainer / colorFillAlter */
    'canvas': '#F5F5F5',
    'surface': '#FFFFFF',
    'surface-muted': '#FAFAFA',
    'surface-raised': '#FFFFFF',
    /* colorSplit (dividers, table rows) vs colorBorder (inputs, buttons) */
    'line': '#F0F0F0',
    'line-strong': '#D9D9D9',
    /* modal mask — stays dark in both themes */
    'overlay': '#000000',

    /* text — AntD colorText .88 / colorTextSecondary .65 / colorTextTertiary .45 */
    'content': '#1F1F1F',
    'content-muted': '#595959',
    'content-subtle': '#8C8C8C',
    'content-inverted': '#FFFFFF',

    /*
     * Interactive accent, split into two roles.
     *
     * `accent` is a FILL that carries `accent-contrast` (white) text. AntD uses
     * blue-6 (#1677FF) here, which is only 4.10:1 behind a white label — AA:
     * blue-7. Hover/active therefore deepen rather than lighten.
     *
     * `accent-text` is the accent as TEXT or an icon on a surface. In light they
     * coincide; in dark they must not (see the dark palette).
     */
    'accent': '#0958D9',
    'accent-hover': '#003EB3',
    'accent-active': '#002C8C',
    'accent-contrast': '#FFFFFF',
    'accent-text': '#0958D9',
    'accent-subtle': '#E6F4FF',

    /*
     * Destructive actions. AntD's danger button is red-5 (#FF4D4F), which only
     * reaches 3.27:1 behind a white label — AA: red-7 instead. Hover/active go
     * darker for the same reason.
     */
    'destructive': '#CF1322',
    'destructive-hover': '#A8071A',
    'destructive-active': '#820014',
    'destructive-contrast': '#FFFFFF',

    /* navigation shell — the classic AntD dark Sider */
    'nav': '#001529',
    'nav-content': '#FFFFFF',
    /* AntD selects with blue-6; AA: blue-7 behind the white label */
    'nav-active': '#0958D9',
    'nav-active-content': '#FFFFFF',

    /*
     * Status tones = AntD Tag. Each is palette step 1 (fill), step 3 (border)
     * and — AA: step 8 rather than AntD's step 7, which lands near 3.4:1.
     */
    'tone-success': '#F6FFED',
    'tone-success-border': '#B7EB8F',
    'tone-success-content': '#237804',
    'tone-warning': '#FFFBE6',
    'tone-warning-border': '#FFE58F',
    'tone-warning-content': '#874D00',
    'tone-danger': '#FFF1F0',
    'tone-danger-border': '#FFCCC7',
    'tone-danger-content': '#A8071A',
    'tone-info': '#E6F4FF',
    'tone-info-border': '#91CAFF',
    'tone-info-content': '#003EB3',
    'tone-neutral': '#FAFAFA',
    'tone-neutral-border': '#D9D9D9',
    'tone-neutral-content': '#434343',
  },

  dark: {
    /* structure — AntD dark colorBgLayout / Container / Elevated */
    'canvas': '#000000',
    'surface': '#141414',
    'surface-muted': '#1D1D1D',
    'surface-raised': '#1F1F1F',
    'line': '#303030',
    'line-strong': '#424242',
    'overlay': '#000000',

    /* text */
    'content': '#E8E8E8',
    'content-muted': '#A6A6A6',
    'content-subtle': '#7A7A7A',
    'content-inverted': '#141414',

    /* AntD dark blue-6 as the fill, dark blue-8 as text — a single value
       cannot satisfy both white-on-accent and accent-on-surface here. */
    'accent': '#1668DC',
    'accent-hover': '#1554AD',
    'accent-active': '#15417E',
    'accent-contrast': '#FFFFFF',
    'accent-text': '#65A9F3',
    'accent-subtle': '#111A2C',

    /* destructive — AntD dark red-6, darkening on press */
    'destructive': '#D32029',
    'destructive-hover': '#A61D24',
    'destructive-active': '#791A1F',
    'destructive-contrast': '#FFFFFF',

    /* the Sider keeps its navy in dark mode, as AntD's does */
    'nav': '#001529',
    'nav-content': '#E8E8E8',
    'nav-active': '#1668DC',
    'nav-active-content': '#FFFFFF',

    /* status tones — AntD dark palettes, step 1 fill / step 3 border / step 8 text */
    'tone-success': '#162312',
    'tone-success-border': '#274916',
    'tone-success-content': '#6ABE39',
    'tone-warning': '#2B2111',
    'tone-warning-border': '#594214',
    'tone-warning-content': '#E8B339',
    'tone-danger': '#2A1215',
    'tone-danger-border': '#58181C',
    'tone-danger-content': '#F37370',
    'tone-info': '#111A2C',
    'tone-info-border': '#15325B',
    'tone-info-content': '#65A9F3',
    'tone-neutral': '#262626',
    'tone-neutral-border': '#434343',
    'tone-neutral-content': '#D9D9D9',
  },
}

/** Token names, derived from the light palette so the two can never drift. */
export const semanticTokenNames = Object.keys(
  semanticTokens.light
) as SemanticTokenName[]

export type SemanticTokenName = keyof SemanticPalette

/** `#2F6BFF` → `47 107 255`, the space-separated form `rgb(… / <alpha>)` needs. */
export const hexToRgbChannels = (hex: string): string => {
  const normalized = hex.replace('#', '')
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Invalid hex color: "${hex}"`)
  }

  const int = parseInt(full, 16)
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`
}

/** CSS custom properties for one theme, e.g. `{ '--color-canvas': '245 245 245' }`. */
export const toCssVariables = (
  palette: SemanticPalette
): Record<string, string> =>
  Object.fromEntries(
    Object.entries(palette).map(([name, hex]) => [
      `--color-${name}`,
      hexToRgbChannels(hex),
    ])
  )
