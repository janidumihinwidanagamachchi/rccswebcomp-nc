import * as React from 'react'
import { useUIStore } from '@/stores/uiStore'
import { ThemeApplier } from '@/components/theme/ThemeApplier'
import { CanvasGridBackground } from '@/components/theme/CanvasGridBackground'
import { resolveTheme } from '@/hooks/useSiteSettings'

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()

  React.useEffect(() => {
    const resolved = resolveTheme(theme)
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
  }, [theme])

  return (
    <>
      <ThemeApplier />
      <CanvasGridBackground />
      {children}
    </>
  )
}
