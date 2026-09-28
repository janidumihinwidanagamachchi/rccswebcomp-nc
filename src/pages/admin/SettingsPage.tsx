import { useEffect, useMemo, useState } from 'react'
import { Check, Palette, RotateCcw, Save, Type, Moon, Sun, Settings, Search, Briefcase, Sparkles } from 'lucide-react'

import { Shell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/AdminShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  applyThemeSettings,
  DEFAULT_SETTINGS,
  FONT_OPTIONS,
  PALETTE_FIELDS,
  THEME_PRESETS,
} from '@/lib/settings'
import { useSiteSettings, useUpdateSiteSettings, resolveTheme } from '@/hooks/useSiteSettings'
import { useUIStore } from '@/stores/uiStore'
import type { PaletteMode, SiteSettings, ThemePalette } from '@/types'

const THEME_MODES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Settings },
] as const

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded-md border border-field bg-transparent p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 font-mono text-xs uppercase"
          maxLength={7}
        />
      </div>
    </div>
  )
}

export function SettingsPage() {
  const { data: savedSettings, isLoading } = useSiteSettings()
  const update = useUpdateSiteSettings()
  const { theme: uiTheme } = useUIStore()

  const [draft, setDraft] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [previewMode, setPreviewMode] = useState<PaletteMode>(resolveTheme(uiTheme))

  useEffect(() => {
    if (savedSettings) {
      setDraft(savedSettings)
    }
  }, [savedSettings])

  useEffect(() => {
    setPreviewMode(resolveTheme(uiTheme))
  }, [uiTheme])

  useEffect(() => {
    applyThemeSettings(draft, previewMode)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(previewMode)
  }, [draft, previewMode])

  useEffect(() => {
    return () => {
      if (savedSettings) {
        applyThemeSettings(savedSettings, resolveTheme(uiTheme))
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(resolveTheme(uiTheme))
      }
    }
  }, [savedSettings, uiTheme])

  const handleSave = async () => {
    await update.mutateAsync(draft)
  }

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setDraft((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...preset.settings.theme },
      colors: { ...prev.colors, ...preset.settings.colors },
      fonts: { ...prev.fonts, ...preset.settings.fonts },
    }))
    setPreviewMode(resolveTheme(preset.settings.theme.mode))
  }

  const updateThemeField = <K extends keyof SiteSettings['theme']>(
    key: K,
    value: SiteSettings['theme'][K]
  ) => {
    setDraft((prev) => ({
      ...prev,
      theme: { ...prev.theme, [key]: value },
    }))
  }

  const updatePaletteColor = (
    mode: PaletteMode,
    key: keyof ThemePalette,
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [mode]: { ...prev.colors[mode], [key]: value },
      },
    }))
  }

  const updateBrand = <K extends keyof SiteSettings['brand']>(key: K, value: string) => {
    setDraft((prev) => ({ ...prev, brand: { ...prev.brand, [key]: value } }))
  }

  const updateSeo = <K extends keyof SiteSettings['seo']>(key: K, value: string) => {
    setDraft((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }))
  }

  const updateHero = <K extends keyof SiteSettings['hero']>(key: K, value: SiteSettings['hero'][K]) => {
    setDraft((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }))
  }

  const updateHeroCta = <K extends keyof SiteSettings['hero']['primaryCta']>(
    cta: 'primaryCta' | 'secondaryCta',
    key: K,
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      hero: { ...prev.hero, [cta]: { ...prev.hero[cta], [key]: value } },
    }))
  }

  const updateFont = <K extends keyof SiteSettings['fonts']>(key: K, value: string) => {
    setDraft((prev) => ({ ...prev, fonts: { ...prev.fonts, [key]: value } }))
  }

  const isEqual = useMemo(() => {
    return JSON.stringify(draft) === JSON.stringify(savedSettings ?? DEFAULT_SETTINGS)
  }, [draft, savedSettings])

  if (isLoading) {
    return (
      <Shell>
        <AdminShell>
          <div className="space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </AdminShell>
      </Shell>
    )
  }

  return (
    <Shell>
      <AdminShell>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Site Settings</h1>
            <p className="text-quiet-ink">
              Colors, fonts, branding, and SEO.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDraft(DEFAULT_SETTINGS)
                setPreviewMode('dark')
                applyThemeSettings(DEFAULT_SETTINGS, 'dark')
              }}
              disabled={update.isPending}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={update.isPending || isEqual}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="theme" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 sm:w-fit">
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="hero">Hero</TabsTrigger>
          </TabsList>

          {/* theme */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Presets
                </CardTitle>
                <CardDescription>Start from a preset.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {THEME_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      onClick={() => applyPreset(preset.id)}
                      className="justify-start"
                    >
                      <span
                        className="mr-2 inline-block h-4 w-4 rounded-full border"
                        style={{
                          background: `linear-gradient(135deg, ${preset.settings.colors.dark.brand} 50%, ${preset.settings.colors.dark.highlight} 50%)`,
                        }}
                      />
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Default Mode</CardTitle>
                  <CardDescription>Light, dark, or follow the system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {THEME_MODES.map((mode) => {
                      const Icon = mode.icon
                      return (
                        <Button
                          key={mode.value}
                          variant={draft.theme.mode === mode.value ? 'default' : 'outline'}
                          onClick={() => updateThemeField('mode', mode.value)}
                          className="flex-col gap-1 py-4"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{mode.label}</span>
                        </Button>
                      )
                    })}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">Border Radius</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="radius"
                        value={draft.theme.radius}
                        onChange={(e) => updateThemeField('radius', e.target.value)}
                        className="font-mono"
                      />
                      <div
                        className="h-9 w-9 rounded border"
                        style={{ borderRadius: draft.theme.radius }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>How the site looks right now.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Primary</Button>
                    <Button size="sm" variant="secondary">
                      Secondary
                    </Button>
                    <Button size="sm" variant="outline">
                      Outline
                    </Button>
                    <Button size="sm" variant="destructive">
                      Destructive
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-3">
                      <p className="font-medium">Event title</p>
                      <p className="text-sm text-quiet-ink">Tue 12 May · Main hall · 40 spots</p>
                    </CardContent>
                  </Card>
                  <div className="inline-block rounded-md bg-highlight px-3 py-2 text-sm font-medium text-highlight-ink">
                    Announced
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* colors */}
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Palette</span>
                  <div className="flex items-center gap-2 rounded-lg border p-1">
                    <Button
                      size="sm"
                      variant={previewMode === 'light' ? 'default' : 'ghost'}
                      onClick={() => setPreviewMode('light')}
                      className="h-7 gap-1 text-xs"
                    >
                      <Sun className="h-3.5 w-3.5" /> Light
                    </Button>
                    <Button
                      size="sm"
                      variant={previewMode === 'dark' ? 'default' : 'ghost'}
                      onClick={() => setPreviewMode('dark')}
                      className="h-7 gap-1 text-xs"
                    >
                      <Moon className="h-3.5 w-3.5" /> Dark
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Editing the <strong>{previewMode}</strong> palette. The Theme tab has a preview of the
                  result.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {PALETTE_FIELDS.map((field) => (
                    <ColorField
                      key={field.key}
                      label={field.label}
                      value={draft.colors[previewMode][field.key]}
                      onChange={(value) => updatePaletteColor(previewMode, field.key, value)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* typography */}
          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Fonts
                </CardTitle>
                <CardDescription>Loaded from Google Fonts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'body', label: 'Body Font' },
                  { key: 'heading', label: 'Heading Font' },
                  { key: 'display', label: 'Display Font' },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={`font-${field.key}`}>{field.label}</Label>
                    <Select
                      value={draft.fonts[field.key as keyof SiteSettings['fonts']]}
                      onValueChange={(value) =>
                        updateFont(field.key as keyof SiteSettings['fonts'], value)
                      }
                    >
                      <SelectTrigger id={`font-${field.key}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                <div className="rounded-lg border p-4">
                  <p className="font-display text-3xl">{draft.hero.headline || 'Headline'}</p>
                  <h3>{draft.hero.subtitle || 'Subtitle'}</h3>
                  <p>{draft.seo.description || 'Body text.'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* brand */}
          <TabsContent value="brand" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Brand
                </CardTitle>
                <CardDescription>Site name and contact address, used in the header, footer and page titles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Site Name</Label>
                  <Input
                    id="brand-name"
                    value={draft.brand.name}
                    onChange={(e) => updateBrand('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-contact">Contact Email</Label>
                  <Input
                    id="brand-contact"
                    type="email"
                    placeholder="office@school.edu"
                    value={draft.brand.contactEmail}
                    onChange={(e) => updateBrand('contactEmail', e.target.value)}
                  />
                  <p className="text-xs text-quiet-ink">Left empty, the footer shows no contact line.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* seo */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  SEO
                </CardTitle>
                <CardDescription>Page title and meta description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">Site Title</Label>
                  <Input
                    id="seo-title"
                    value={draft.seo.title}
                    onChange={(e) => updateSeo('title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    value={draft.seo.description}
                    onChange={(e) => updateSeo('description', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* hero */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Homepage Hero
                </CardTitle>
                <CardDescription>Edit the headline, badge, buttons, and countdown visibility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-badge">Badge Text</Label>
                  <Input
                    id="hero-badge"
                    value={draft.hero.badge}
                    onChange={(e) => updateHero('badge', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-headline">Headline</Label>
                  <Textarea
                    id="hero-headline"
                    value={draft.hero.headline}
                    onChange={(e) => updateHero('headline', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={draft.hero.subtitle}
                    onChange={(e) => updateHero('subtitle', e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero-primary-label">Primary Button Label</Label>
                    <Input
                      id="hero-primary-label"
                      value={draft.hero.primaryCta.label}
                      onChange={(e) => updateHeroCta('primaryCta', 'label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-primary-href">Primary Button Link</Label>
                    <Input
                      id="hero-primary-href"
                      value={draft.hero.primaryCta.href}
                      onChange={(e) => updateHeroCta('primaryCta', 'href', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hero-secondary-label">Secondary Button Label</Label>
                    <Input
                      id="hero-secondary-label"
                      value={draft.hero.secondaryCta.label}
                      onChange={(e) => updateHeroCta('secondaryCta', 'label', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-secondary-href">Secondary Button Link</Label>
                    <Input
                      id="hero-secondary-href"
                      value={draft.hero.secondaryCta.href}
                      onChange={(e) => updateHeroCta('secondaryCta', 'href', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-bg">Background Image URL</Label>
                  <Input
                    id="hero-bg"
                    value={draft.hero.backgroundImageUrl}
                    placeholder="https://... (optional)"
                    onChange={(e) => updateHero('backgroundImageUrl', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="hero-countdown"
                    type="checkbox"
                    checked={draft.hero.showCountdown}
                    onChange={(e) => updateHero('showCountdown', e.target.checked)}
                    className="h-4 w-4 rounded border-field"
                  />
                  <Label htmlFor="hero-countdown">Show upcoming event countdown card</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-quiet-ink">
            {update.isSuccess && (
              <span className="inline-flex items-center gap-1 text-emerald-500">
                <Check className="h-4 w-4" />
                Settings saved successfully.
              </span>
            )}
            {update.isError && (
              <span className="text-danger">Failed to save: {update.error.message}</span>
            )}
          </p>
          <Button onClick={handleSave} disabled={update.isPending || isEqual} size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </AdminShell>
    </Shell>
  )
}


