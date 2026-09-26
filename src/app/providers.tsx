import * as React from 'react'
import { MotionConfig } from 'motion/react'
import { useUIStore } from '@/stores/uiStore'
import { ThemeApplier } from '@/components/theme/ThemeApplier'
import { resolveTheme } from '@/hooks/useSiteSettings'
import { dur, ease } from '@/components/motion/tokens'

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()

  React.useEffect(() => {
    const resolved = resolveTheme(theme)
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
  }, [theme])

  return (
      <MotionConfig reducedMotion="user" transition={{ duration: dur.quick, ease: ease.gentle }}>
      <ThemeApplier />
      {children}
    </MotionConfig>
  )
}
