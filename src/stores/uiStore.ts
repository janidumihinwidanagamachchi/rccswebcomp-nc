import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeMode } from '@/types'

interface UIState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const modes: ThemeMode[] = ['light', 'dark', 'system']

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        const idx = modes.indexOf(current)
        const next = modes[(idx + 1) % modes.length]
        set({ theme: next })
      },
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    {
      name: 'rccswebcomp-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
