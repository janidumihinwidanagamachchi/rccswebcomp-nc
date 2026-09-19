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
  { key: 'canvas', label: 'Background' },
  { key: 'ink', label: 'Text / Foreground' },
  { key: 'panel', label: 'Card Background' },
  { key: 'panelInk', label: 'Card Text' },
  { key: 'floating', label: 'Popover Background' },
  { key: 'floatingInk', label: 'Popover Text' },
  { key: 'brand', label: 'Primary' },
  { key: 'brandInk', label: 'Primary Text' },
  { key: 'alt', label: 'Secondary' },
  { key: 'altInk', label: 'Secondary Text' },
  { key: 'quiet', label: 'Muted' },
  { key: 'quietInk', label: 'Muted Text' },
  { key: 'highlight', label: 'Accent' },
  { key: 'highlightInk', label: 'Accent Text' },
  { key: 'danger', label: 'Destructive' },
  { key: 'dangerInk', label: 'Destructive Text' },
  { key: 'line', label: 'Border' },
  { key: 'field', label: 'Input' },
  { key: 'focus', label: 'Ring / Focus' },
]

export interface ThemePreset {
  id: string
  name: string
  settings: Pick<SiteSettings, 'colors' | 'fonts' | 'theme'>
}

// Royal Navy & Gold
const ROYAL_LIGHT: ThemePalette = {
  canvas: '#f8fafc',
  ink: '#0b132b',
  panel: '#ffffff',
  panelInk: '#0b132b',
  floating: '#ffffff',
  floatingInk: '#0b132b',
  brand: '#ffd700',
  brandInk: '#0b132b',
  alt: '#edf2f7',
  altInk: '#0b132b',
  quiet: '#f1f5f9',
  quietInk: '#64748b',
  highlight: '#48cae4',
  highlightInk: '#0b132b',
  danger: '#ef4444',
  dangerInk: '#ffffff',
  line: '#e2e8f0',
  field: '#e2e8f0',
  focus: '#ffd700',
}

const ROYAL_DARK: ThemePalette = {
  canvas: '#070d1e',
  ink: '#f8fafc',
  panel: '#131b33',
  panelInk: '#ffffff',
  floating: '#1a2440',
  floatingInk: '#e2e8f0',
  brand: '#ffd700',
  brandInk: '#070d1e',
  alt: '#2b3d54',
  altInk: '#ffffff',
  quiet: '#0f1c33',
  quietInk: '#94a3b8',
  highlight: '#48cae4',
  highlightInk: '#070d1e',
  danger: '#ef4444',
  dangerInk: '#ffffff',
  line: '#22324a',
  field: '#0e1a2e',
  focus: '#ffd700',
}

// Default 2
const DEFAULT_2_LIGHT: ThemePalette = {
  canvas: '#ffffff',
  ink: '#171717',
  panel: '#f5f5f5',
  panelInk: '#171717',
  floating: '#ffffff',
  floatingInk: '#171717',
  brand: '#262626',
  brandInk: '#ffffff',
  alt: '#e5e5e5',
  altInk: '#171717',
  quiet: '#f0f0f0',
  quietInk: '#737373',
  highlight: '#525252',
  highlightInk: '#ffffff',
  danger: '#ef4444',
  dangerInk: '#ffffff',
  line: '#d4d4d4',
  field: '#e5e5e5',
  focus: '#171717',
}

const DEFAULT_2_DARK: ThemePalette = {
  canvas: '#0a0a0a',
  ink: '#f5f5f5',
  panel: '#171717',
  panelInk: '#f5f5f5',
  floating: '#262626',
  floatingInk: '#f5f5f5',
  brand: '#e5e5e5',
  brandInk: '#0a0a0a',
  alt: '#262626',
  altInk: '#f5f5f5',
  quiet: '#141414',
  quietInk: '#a3a3a3',
  highlight: '#a3a3a3',
  highlightInk: '#0a0a0a',
  danger: '#ef4444',
  dangerInk: '#ffffff',
  line: '#262626',
  field: '#171717',
  focus: '#e5e5e5',
}

// Apple Black
const APPLE_LIGHT: ThemePalette = {
  canvas: '#ffffff',
  ink: '#000000',
  panel: '#f2f2f7',
  panelInk: '#000000',
  floating: '#ffffff',
  floatingInk: '#000000',
  brand: '#007aff',
  brandInk: '#ffffff',
  alt: '#e5e5ea',
  altInk: '#000000',
  quiet: '#f2f2f7',
  quietInk: '#8e8e93',
  highlight: '#5856d6',
  highlightInk: '#ffffff',
  danger: '#ff3b30',
  dangerInk: '#ffffff',
  line: '#e5e5ea',
  field: '#e5e5ea',
  focus: '#007aff',
}

const APPLE_DARK: ThemePalette = {
  canvas: '#000000',
  ink: '#f5f5f7',
  panel: '#1c1c1e',
  panelInk: '#ffffff',
  floating: '#2c2c2e',
  floatingInk: '#ffffff',
  brand: '#0a84ff',
  brandInk: '#ffffff',
  alt: '#3a3a3c',
  altInk: '#ffffff',
  quiet: '#1c1c1e',
  quietInk: '#8e8e93',
  highlight: '#5e5ce6',
  highlightInk: '#ffffff',
  danger: '#ff453a',
  dangerInk: '#ffffff',
  line: '#38383a',
  field: '#1c1c1e',
  focus: '#0a84ff',
}

// Obsidian & Rose Gold
const ROSE_GOLD_LIGHT: ThemePalette = {
  canvas: '#fdf8f7',
  ink: '#0a0a0a',
  panel: '#ffffff',
  panelInk: '#0a0a0a',
  floating: '#ffffff',
  floatingInk: '#0a0a0a',
  brand: '#b07566',
  brandInk: '#ffffff',
  alt: '#f2e8e5',
  altInk: '#0a0a0a',
  quiet: '#f8f0ee',
  quietInk: '#78716c',
  highlight: '#e8b0a0',
  highlightInk: '#0a0a0a',
  danger: '#ef4444',
  dangerInk: '#ffffff',
  line: '#ead5ce',
  field: '#ead5ce',
  focus: '#b07566',
}

const ROSE_GOLD_DARK: ThemePalette = {
  canvas: '#0a0a0a',
  ink: '#fafafa',
  panel: '#171717',
  panelInk: '#ffffff',
  floating: '#262626',
  floatingInk: '#fafafa',
  brand: '#e0a996',
  brandInk: '#0a0a0a',
  alt: '#383838',
  altInk: '#fafafa',
  quiet: '#121212',
  quietInk: '#737373',
  highlight: '#f5d0c5',
  highlightInk: '#0a0a0a',
  danger: '#ef4444',
  dangerInk: '#ffffff',
  line: '#262626',
  field: '#171717',
  focus: '#e0a996',
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
    name: 'RCCSWebComp-NC',
    motto: 'Disce Aut Discede',
    logoUrl: '',
  },
  seo: {
    title: 'RCCSWebComp-NC | School Events',
    description:
      'School events, QR tickets, and announcements for one campus.',
    ogImageUrl: '',
  },
  hero: {
    badge: "BTUI'26 Competition Entry",
    headline: "What's on at school,\nwithout the guesswork.",
    subtitle:
      'See what\u2019s coming up, register in a minute, and keep your QR ticket in your pocket.',
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

const LEGACY_COLOR_KEYS: Record<string, keyof ThemePalette> = {
  background: 'canvas',
  foreground: 'ink',
  card: 'panel',
  cardForeground: 'panelInk',
  popover: 'floating',
  popoverForeground: 'floatingInk',
  primary: 'brand',
  primaryForeground: 'brandInk',
  secondary: 'alt',
  secondaryForeground: 'altInk',
  muted: 'quiet',
  mutedForeground: 'quietInk',
  accent: 'highlight',
  accentForeground: 'highlightInk',
  destructive: 'danger',
  destructiveForeground: 'dangerInk',
  border: 'line',
  input: 'field',
  ring: 'focus',
}

function migratePalette(raw: unknown): Partial<ThemePalette> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const mapped = LEGACY_COLOR_KEYS[key] ?? key
    if (typeof value === 'string') out[mapped] = value
  }
  return out as Partial<ThemePalette>
}

export function normalizeSettings(raw: unknown): SiteSettings {
  const base = structuredClone(DEFAULT_SETTINGS)
  if (!raw || typeof raw !== 'object') return base

  const typed = raw as Partial<SiteSettings> & { colors?: { primary?: string; accent?: string; light?: ThemePalette; dark?: ThemePalette } }

  if (typed.colors && 'primary' in typed.colors && typeof typed.colors.primary === 'string') {
    const primary = typed.colors.primary
    const accent = typed.colors.accent ?? base.colors.light.highlight
    base.colors.light = { ...base.colors.light, brand: primary }
    base.colors.light.highlight = accent
    base.colors.dark = { ...base.colors.dark, brand: primary }
    base.colors.dark.highlight = accent
    delete (typed.colors as { primary?: string }).primary
    delete (typed.colors as { accent?: string }).accent
  }

  if (typed.colors) {
    if (typed.colors.light) typed.colors.light = migratePalette(typed.colors.light) as ThemePalette
    if (typed.colors.dark) typed.colors.dark = migratePalette(typed.colors.dark) as ThemePalette
  }

  return deepMerge(base as unknown as Record<string, unknown>, typed as Record<string, unknown>) as unknown as SiteSettings
}

export function findFontOption(value: string): FontOption | undefined {
  return FONT_OPTIONS.find((f) => f.value === value)
}

export function getFontFamily(value: string): string {
  return findFontOption(value)?.family ?? findFontOption('Inter')!.family
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
