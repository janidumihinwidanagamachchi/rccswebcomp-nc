import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { DEFAULT_SETTINGS, applyThemeSettings, normalizeSettings } from '@/lib/settings'
import type { PaletteMode, SiteSettings, ThemeMode } from '@/types'

const SETTINGS_KEY = 'site_settings'

type SettingsRow = {
  key: string
  value: unknown
}

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', SETTINGS_KEY)
        .single<SettingsRow>()

      if (error) {
        console.warn('Failed to load site settings, using defaults:', error.message)
        return DEFAULT_SETTINGS
      }

      return normalizeSettings(data?.value)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: SETTINGS_KEY, value: settings, updated_at: new Date().toISOString() })

      if (error) throw error
      return settings
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(['site_settings'], settings)
    },
  })
}

function applySeo(settings: SiteSettings, pageTitle?: string) {
  const brand = settings.brand.name || 'CampusPulse'
  const siteTitle = settings.seo.title || brand
  const fullTitle = pageTitle ? `${pageTitle} | ${brand}` : siteTitle

  if (document.title !== fullTitle) {
    document.title = fullTitle
  }

  const setMeta = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
    if (!el) {
      el = document.createElement('meta')
      el.name = name
      document.head.appendChild(el)
    }
    if (el.content !== content) el.content = content
  }

  setMeta('description', settings.seo.description)
}

export function useApplyTheme(settings?: SiteSettings, mode?: PaletteMode, pageTitle?: string) {
  useEffect(() => {
    if (!settings || !mode) return
    applyThemeSettings(settings, mode)
    applySeo(settings, pageTitle)
  }, [settings, mode, pageTitle])
}

export function resolveTheme(mode: ThemeMode): PaletteMode {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}
