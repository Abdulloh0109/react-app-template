import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ThemeState } from './types'

/**
 * Persisted under `theme-preference`. The inline script in `index.html` reads
 * the same key before React mounts, which is what prevents a light flash on a
 * dark-theme reload — keep the two in sync if you rename the store.
 */
export const THEME_STORAGE_KEY = 'theme-preference'

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preference: state.preference }),
    }
  )
)
