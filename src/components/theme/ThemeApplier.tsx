import * as React from 'react'
import { useSiteSettings, resolveTheme, useApplyTheme } from '@/hooks/useSiteSettings'
import { useUIStore } from '@/stores/uiStore'

export function ThemeApplier({ pageTitle }: { pageTitle?: string }) {
  const { data: settings } = useSiteSettings()
  const { theme, setTheme } = useUIStore()

  const resolved = React.useMemo(() => resolveTheme(theme), [theme])

  useApplyTheme(settings, resolved, pageTitle)

  React.useEffect(() => {
    if (!settings) return
    const stored = localStorage.getItem('campuspulse-ui')
    const hasUserOverride = stored ? JSON.parse(stored).state?.theme : false
    if (!hasUserOverride) {
      setTheme(settings.theme.mode)
    }
  }, [settings, setTheme])

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        root.classList.remove('light', 'dark')
        root.classList.add(resolveTheme('system'))
      }
      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    }
  }, [theme, resolved])

  return null
}
