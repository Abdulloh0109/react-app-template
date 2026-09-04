import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { ThemeName } from '@/tokens'
import { useThemeStore } from '@/store'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const subscribeToSystemTheme = (onChange: () => void) => {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

const getSystemTheme = (): ThemeName =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'

/** Server/prerender fallback — no `matchMedia` there. */
const getServerTheme = (): ThemeName => 'light'

/**
 * Read and change the theme from anywhere.
 *
 * `theme` is what is actually on screen; `preference` is what the user picked
 * (`system` follows the OS and re-renders when it flips). `ThemeProvider` is
 * what puts the resulting `dark` class on `<html>` — components should never
 * touch the DOM for theming themselves.
 */
export const useTheme = () => {
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)

  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerTheme
  )

  const theme: ThemeName = preference === 'system' ? systemTheme : preference

  const toggleTheme = useCallback(() => {
    setPreference(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setPreference])

  return useMemo(
    () => ({ theme, preference, setPreference, toggleTheme }),
    [theme, preference, setPreference, toggleTheme]
  )
}
