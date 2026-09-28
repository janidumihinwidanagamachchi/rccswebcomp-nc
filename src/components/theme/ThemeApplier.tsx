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
    const stored = localStorage.getItem('rccswebcomp-ui')
    let storedTheme: string | undefined
    try {
      const parsed = stored ? JSON.parse(stored) : null
      storedTheme = parsed?.state?.theme
    } catch {
      storedTheme = undefined
    }
    if (!storedTheme) {
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
        const next = resolveTheme('system')
        root.classList.remove('light', 'dark')
        root.classList.add(next)
      }
      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    }
  }, [theme, resolved])

  return null
}
