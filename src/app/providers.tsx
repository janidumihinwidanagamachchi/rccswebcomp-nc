import * as React from 'react'
import { MotionConfig } from 'motion/react'
import { useUIStore } from '@/stores/uiStore'
import { ThemeApplier } from '@/components/theme/ThemeApplier'
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
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <ThemeApplier />
      {children}
    </MotionConfig>
  )
}
