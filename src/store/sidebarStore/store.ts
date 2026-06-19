import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SidebarState } from './types'

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isExtended: true,
      setIsExtended: (state) => set({ isExtended: state }),
    }),
    {
      name: 'sidebar-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isExtended: state.isExtended }),
    }
  )
)
