import type { ThemePreference } from '@/tokens'

export type ThemeState = {
  /** What the user chose. `system` defers to the OS setting. */
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}
