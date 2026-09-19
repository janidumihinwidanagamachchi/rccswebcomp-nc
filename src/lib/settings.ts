import type { PaletteMode, SiteSettings, ThemeMode, ThemePalette } from '@/types'

export interface FontOption {
  value: string
  label: string
  family: string
  weights: string[]
}

export const FONT_OPTIONS: FontOption[] = [
  {
    value: 'Inter',
    label: 'Inter',
    family: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Nunito Sans',
    label: 'Nunito Sans',
    family: '"Nunito Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weights: ['200', '300', '400', '600', '700', '800', '900'],
  },
  {
    value: 'Open Sans',
    label: 'Open Sans',
    family: '"Open Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weights: ['300', '400', '600', '700', '800'],
  },
  {
    value: 'Shippori Mincho B1',
    label: 'Shippori Mincho B1',
    family: '"Shippori Mincho B1", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['400', '500', '600', '700', '800'],
  },
  {
    value: 'Domine',
    label: 'Domine',
    family: '"Domine", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['400', '500', '600', '700'],
  },
  {
    value: 'Playfair Display',
    label: 'Playfair Display',
    family: '"Playfair Display", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['400', '500', '600', '700', '800', '900'],
  },
  {
    value: 'Bebas Neue',
    label: 'Bebas Neue',
    family: '"Bebas Neue", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
    weights: ['400'],
  },
  {
    value: 'Roboto',
    label: 'Roboto',
    family: '"Roboto", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Poppins',
    label: 'Poppins',
    family: '"Poppins", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Montserrat',
    label: 'Montserrat',
    family: '"Montserrat", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Lato',
    label: 'Lato',
    family: '"Lato", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100', '300', '400', '700', '900'],
  },
  {
    value: 'Oswald',
    label: 'Oswald',
    family: '"Oswald", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
    weights: ['200..700'],
  },
  {
    value: 'Raleway',
    label: 'Raleway',
    family: '"Raleway", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Merriweather',
    label: 'Merriweather',
    family: '"Merriweather", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['300', '400', '700', '900'],
  },
  {
    value: 'Crimson Pro',
    label: 'Crimson Pro',
    family: '"Crimson Pro", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['200..900'],
  },
  {
    value: 'Space Grotesk',
    label: 'Space Grotesk',
    family: '"Space Grotesk", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['300..700'],
  },
  {
    value: 'Plus Jakarta Sans',
    label: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['200..800'],
  },
  {
    value: 'DM Sans',
    label: 'DM Sans',
    family: '"DM Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..1000'],
  },
  {
    value: 'Geist',
    label: 'Geist',
    family: '"Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Geist Mono',
    label: 'Geist Mono',
    family: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
    weights: ['100..900'],
  },
  {
    value: 'JetBrains Mono',
    label: 'JetBrains Mono',
    family: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
    weights: ['100..800'],
  },
  {
    value: 'Fira Code',
    label: 'Fira Code',
    family: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
    weights: ['300..700'],
  },
  {
    value: 'Source Sans 3',
    label: 'Source Sans 3',
    family: '"Source Sans 3", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['200..900'],
  },
  {
    value: 'Ubuntu',
    label: 'Ubuntu',
    family: '"Ubuntu", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['300', '400', '500', '700'],
  },
  {
    value: 'Work Sans',
    label: 'Work Sans',
    family: '"Work Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Manrope',
    label: 'Manrope',
    family: '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['200..800'],
  },
  {
    value: 'Outfit',
    label: 'Outfit',
    family: '"Outfit", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Figtree',
    label: 'Figtree',
    family: '"Figtree", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['300..900'],
  },
  {
    value: 'Onest',
    label: 'Onest',
    family: '"Onest", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..900'],
  },
  {
    value: 'Instrument Sans',
    label: 'Instrument Sans',
    family: '"Instrument Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['400..700'],
  },
  {
    value: 'Bricolage Grotesque',
    label: 'Bricolage Grotesque',
    family: '"Bricolage Grotesque", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['200..800'],
  },
  {
    value: 'Syne',
    label: 'Syne',
    family: '"Syne", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['400..800'],
  },
  {
    value: 'Space Mono',
    label: 'Space Mono',
    family: '"Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
    weights: ['400', '700'],
  },
  {
    value: 'IBM Plex Sans',
    label: 'IBM Plex Sans',
    family: '"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..700'],
  },
  {
    value: 'IBM Plex Serif',
    label: 'IBM Plex Serif',
    family: '"IBM Plex Serif", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['100..700'],
  },
  {
    value: 'Libre Baskerville',
    label: 'Libre Baskerville',
    family: '"Libre Baskerville", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['400', '700'],
  },
  {
    value: 'Cormorant Garamond',
    label: 'Cormorant Garamond',
    family: '"Cormorant Garamond", ui-serif, Georgia, "Times New Roman", serif',
    weights: ['300..700'],
  },
  {
    value: 'Sora',
    label: 'Sora',
    family: '"Sora", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weights: ['100..800'],
  },
]

export interface PaletteField {
  key: keyof ThemePalette
  label: string
}

export const PALETTE_FIELDS: PaletteField[] = [
  { key: 'background', label: 'Background' },
  { key: 'foreground', label: 'Text / Foreground' },
  { key: 'card', label: 'Card Background' },
  { key: 'cardForeground', label: 'Card Text' },
  { key: 'popover', label: 'Popover Background' },
  { key: 'popoverForeground', label: 'Popover Text' },
  { key: 'primary', label: 'Primary' },
  { key: 'primaryForeground', label: 'Primary Text' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'secondaryForeground', label: 'Secondary Text' },
  { key: 'muted', label: 'Muted' },
  { key: 'mutedForeground', label: 'Muted Text' },
  { key: 'accent', label: 'Accent' },
  { key: 'accentForeground', label: 'Accent Text' },
  { key: 'destructive', label: 'Destructive' },
  { key: 'destructiveForeground', label: 'Destructive Text' },
  { key: 'border', label: 'Border' },
  { key: 'input', label: 'Input' },
  { key: 'ring', label: 'Ring / Focus' },
]

export interface ThemePreset {
  id: string
  name: string
  settings: Pick<SiteSettings, 'colors' | 'fonts' | 'theme'>
}

// Royal Navy & Gold
const ROYAL_LIGHT: ThemePalette = {
  background: '#f8fafc',
  foreground: '#0b132b',
  card: '#ffffff',
  cardForeground: '#0b132b',
  popover: '#ffffff',
  popoverForeground: '#0b132b',
  primary: '#ffd700',
  primaryForeground: '#0b132b',
  secondary: '#edf2f7',
  secondaryForeground: '#0b132b',
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#48cae4',
  accentForeground: '#0b132b',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#ffd700',
}

const ROYAL_DARK: ThemePalette = {
  background: '#070d1e',
  foreground: '#f8fafc',
  card: '#131b33',
  cardForeground: '#ffffff',
  popover: '#1a2440',
  popoverForeground: '#e2e8f0',
  primary: '#ffd700',
  primaryForeground: '#070d1e',
  secondary: '#2b3d54',
  secondaryForeground: '#ffffff',
  muted: '#0f1c33',
  mutedForeground: '#94a3b8',
  accent: '#48cae4',
  accentForeground: '#070d1e',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#22324a',
  input: '#0e1a2e',
  ring: '#ffd700',
}

// Default 2
const DEFAULT_2_LIGHT: ThemePalette = {
  background: '#ffffff',
  foreground: '#171717',
  card: '#f5f5f5',
  cardForeground: '#171717',
  popover: '#ffffff',
  popoverForeground: '#171717',
  primary: '#262626',
  primaryForeground: '#ffffff',
  secondary: '#e5e5e5',
  secondaryForeground: '#171717',
  muted: '#f0f0f0',
  mutedForeground: '#737373',
  accent: '#525252',
  accentForeground: '#ffffff',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#d4d4d4',
  input: '#e5e5e5',
  ring: '#171717',
}

const DEFAULT_2_DARK: ThemePalette = {
  background: '#0a0a0a',
  foreground: '#f5f5f5',
  card: '#171717',
  cardForeground: '#f5f5f5',
  popover: '#262626',
  popoverForeground: '#f5f5f5',
  primary: '#e5e5e5',
  primaryForeground: '#0a0a0a',
  secondary: '#262626',
  secondaryForeground: '#f5f5f5',
  muted: '#141414',
  mutedForeground: '#a3a3a3',
  accent: '#a3a3a3',
  accentForeground: '#0a0a0a',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#262626',
  input: '#171717',
  ring: '#e5e5e5',
}

// Apple Black
const APPLE_LIGHT: ThemePalette = {
  background: '#ffffff',
  foreground: '#000000',
  card: '#f2f2f7',
  cardForeground: '#000000',
  popover: '#ffffff',
  popoverForeground: '#000000',
  primary: '#007aff',
  primaryForeground: '#ffffff',
  secondary: '#e5e5ea',
  secondaryForeground: '#000000',
  muted: '#f2f2f7',
  mutedForeground: '#8e8e93',
  accent: '#5856d6',
  accentForeground: '#ffffff',
  destructive: '#ff3b30',
  destructiveForeground: '#ffffff',
  border: '#e5e5ea',
  input: '#e5e5ea',
  ring: '#007aff',
}

const APPLE_DARK: ThemePalette = {
  background: '#000000',
  foreground: '#f5f5f7',
  card: '#1c1c1e',
  cardForeground: '#ffffff',
  popover: '#2c2c2e',
  popoverForeground: '#ffffff',
  primary: '#0a84ff',
  primaryForeground: '#ffffff',
  secondary: '#3a3a3c',
  secondaryForeground: '#ffffff',
  muted: '#1c1c1e',
  mutedForeground: '#8e8e93',
  accent: '#5e5ce6',
  accentForeground: '#ffffff',
  destructive: '#ff453a',
  destructiveForeground: '#ffffff',
  border: '#38383a',
  input: '#1c1c1e',
  ring: '#0a84ff',
}

// Obsidian & Rose Gold
const ROSE_GOLD_LIGHT: ThemePalette = {
  background: '#fdf8f7',
  foreground: '#0a0a0a',
  card: '#ffffff',
  cardForeground: '#0a0a0a',
  popover: '#ffffff',
  popoverForeground: '#0a0a0a',
  primary: '#b07566',
  primaryForeground: '#ffffff',
  secondary: '#f2e8e5',
  secondaryForeground: '#0a0a0a',
  muted: '#f8f0ee',
  mutedForeground: '#78716c',
  accent: '#e8b0a0',
  accentForeground: '#0a0a0a',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#ead5ce',
  input: '#ead5ce',
  ring: '#b07566',
}

const ROSE_GOLD_DARK: ThemePalette = {
  background: '#0a0a0a',
  foreground: '#fafafa',
  card: '#171717',
  cardForeground: '#ffffff',
  popover: '#262626',
  popoverForeground: '#fafafa',
  primary: '#e0a996',
  primaryForeground: '#0a0a0a',
  secondary: '#383838',
  secondaryForeground: '#fafafa',
  muted: '#121212',
  mutedForeground: '#737373',
  accent: '#f5d0c5',
  accentForeground: '#0a0a0a',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#262626',
  input: '#171717',
  ring: '#e0a996',
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'royal-college',
    name: 'Royal Navy & Gold',
    settings: {
      theme: { mode: 'dark' as ThemeMode, radius: '0.75rem' },
      colors: { light: ROYAL_LIGHT, dark: ROYAL_DARK },
      fonts: {
        body: 'Nunito Sans',
        heading: 'Shippori Mincho B1',
        display: 'Bebas Neue',
      },
    },
  },
  {
    id: 'default-2',
    name: 'Default 2',
    settings: {
      theme: { mode: 'dark' as ThemeMode, radius: '0.75rem' },
      colors: { light: DEFAULT_2_LIGHT, dark: DEFAULT_2_DARK },
      fonts: {
        body: 'Inter',
        heading: 'Inter',
        display: 'Bebas Neue',
      },
    },
  },
  {
    id: 'apple-black',
    name: 'Apple Black',
    settings: {
      theme: { mode: 'dark' as ThemeMode, radius: '0.75rem' },
      colors: { light: APPLE_LIGHT, dark: APPLE_DARK },
      fonts: {
        body: 'Inter',
        heading: 'Inter',
        display: 'Inter',
      },
    },
  },
  {
    id: 'rose-gold',
    name: 'Obsidian & Rose Gold',
    settings: {
      theme: { mode: 'dark' as ThemeMode, radius: '0.75rem' },
      colors: { light: ROSE_GOLD_LIGHT, dark: ROSE_GOLD_DARK },
      fonts: {
        body: 'Inter',
        heading: 'Inter',
        display: 'Inter',
      },
    },
  },
]

export const DEFAULT_SETTINGS: SiteSettings = {
  theme: { mode: 'dark', radius: '0.75rem' },
  colors: { light: ROYAL_LIGHT, dark: ROYAL_DARK },
  fonts: {
    body: 'Nunito Sans',
    heading: 'Shippori Mincho B1',
    display: 'Bebas Neue',
  },
  brand: {
    name: 'CampusPulse',
    motto: 'Disce Aut Discede',
    logoUrl: '',
  },
  seo: {
    title: 'CampusPulse | School Events Command Center',
    description:
      'Discover, register, and experience every school event in one beautiful command center built for students, teachers, and parents.',
    ogImageUrl: '',
  },
  hero: {
    badge: "BTUI'26 Competition Entry",
    headline: 'Your school events, reimagined.',
    subtitle:
      'Discover, register, and experience every school event in one beautiful command center built for students, teachers, and parents.',
    primaryCta: { label: 'Browse Events', href: '/events' },
    secondaryCta: { label: 'View Calendar', href: '/calendar' },
    backgroundImageUrl: '',
    showCountdown: true,
  },
}

function deepMerge(target: Record<string, unknown>, source: unknown): Record<string, unknown> {
  if (!source || typeof source !== 'object') return target
  const result: Record<string, unknown> = { ...target }
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === 'object'
    ) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value)
    } else {
      result[key] = value
    }
  }
  return result
}

export function normalizeSettings(raw: unknown): SiteSettings {
  const base = structuredClone(DEFAULT_SETTINGS)
  if (!raw || typeof raw !== 'object') return base

  const typed = raw as Partial<SiteSettings> & { colors?: { primary?: string; accent?: string; light?: ThemePalette; dark?: ThemePalette } }

  if (typed.colors && 'primary' in typed.colors && typeof typed.colors.primary === 'string') {
    const primary = typed.colors.primary
    const accent = typed.colors.accent ?? base.colors.light.accent
    base.colors.light = { ...base.colors.light, primary }
    base.colors.light.accent = accent
    base.colors.dark = { ...base.colors.dark, primary }
    base.colors.dark.accent = accent
    delete (typed.colors as { primary?: string }).primary
    delete (typed.colors as { accent?: string }).accent
  }

  return deepMerge(base as unknown as Record<string, unknown>, typed as Record<string, unknown>) as unknown as SiteSettings
}

export function findFontOption(value: string): FontOption | undefined {
  return FONT_OPTIONS.find((f) => f.value === value)
}

export function getFontFamily(value: string): string {
  return findFontOption(value)?.family ?? findFontOption('Inter')!.family
}

export function contrastForeground(hex: string): string {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.substring(0, 2), 16)
  const g = parseInt(normalized.substring(2, 4), 16)
  const b = parseInt(normalized.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#0f172a' : '#ffffff'
}

export function loadGoogleFonts(fontValues: string[]) {
  const unique = Array.from(new Set(fontValues.filter(Boolean)))
  const existing = new Set<string>()

  document.querySelectorAll('link[data-google-font]').forEach((el) => {
    existing.add(el.getAttribute('href') ?? '')
  })

  unique.forEach((font) => {
    const option = findFontOption(font)
    if (!option) return

    const family = encodeURIComponent(font)
    const weights = option.weights.join(',')
    const href = `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`

    if (existing.has(href)) return

    const link = document.createElement('link')
    link.setAttribute('data-google-font', font)
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  })
}

function toCssVarName(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function applyThemeSettings(settings: SiteSettings, mode: PaletteMode = 'dark') {
  const root = document.documentElement
  const palette = settings.colors[mode]

  ;(Object.keys(palette) as Array<keyof ThemePalette>).forEach((key) => {
    root.style.setProperty(`--${toCssVarName(key)}`, palette[key])
  })

  root.style.setProperty('--font-sans', getFontFamily(settings.fonts.body))
  root.style.setProperty('--font-serif', getFontFamily(settings.fonts.heading))
  root.style.setProperty('--font-display', getFontFamily(settings.fonts.display))
  root.style.setProperty('--radius', settings.theme.radius)

  loadGoogleFonts([settings.fonts.body, settings.fonts.heading, settings.fonts.display])
}
