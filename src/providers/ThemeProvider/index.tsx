import { useEffect } from 'react'
import type { ThemeProviderProps } from './types'
import { useTheme } from '@/hooks'

/**
 * Applies the resolved theme as a `dark` class on `<html>` — the hook Tailwind's
 * `darkMode: ['class']` looks for — and keeps the native `color-scheme` in sync
 * so form controls and scrollbars follow.
 *
 * The matching inline script in `index.html` does the same before first paint;
 * this only takes over once React is mounted.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  return <>{children}</>
}
