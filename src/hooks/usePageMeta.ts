import { useEffect } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function usePageMeta(title?: string) {
  const { data: settings } = useSiteSettings()

  useEffect(() => {
    if (!settings) return
    const brand = settings.brand.name || 'CampusPulse'
    const siteTitle = settings.seo.title || brand
    document.title = title ? `${title} | ${brand}` : siteTitle
  }, [settings, title])
}
