import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const INDEX_PATH = resolve(ROOT, 'index.html')
const SETTINGS_PATH = resolve(ROOT, 'supabase/data/site_settings.json')
const FONTS_PATH = resolve(ROOT, 'src/lib/fonts.json')
const START = '<!-- theme:start -->'
const END = '<!-- theme:end -->'

const FONT_FAMILIES = Object.fromEntries(
  JSON.parse(readFileSync(FONTS_PATH, 'utf8')).map((font) => [font.value, font.family])
)

function familyFor(value) {
  return FONT_FAMILIES[value] || FONT_FAMILIES['Inter']
}

function loadSettings() {
  if (!requireExists(SETTINGS_PATH)) {
    console.warn('[inject-theme] supabase/data/site_settings.json not found; leaving index.html unchanged.')
    return null
  }
  const rows = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'))
  const row = Array.isArray(rows)
    ? rows.find((r) => r?.key === 'site_settings' && r?.value)
    : rows?.value
  return row?.value || null
}

function requireExists(p) {
  try {
    readFileSync(p, 'utf8')
    return true
  } catch {
    return false
  }
}

function buildSnippet(settings) {
  const colors = settings.colors || {}
  const fonts = settings.fonts || {}
  const palette = {
    light: colors.light || {},
    dark: colors.dark || {},
  }
  const payload = {
    palette,
    fonts: {
      sans: familyFor(fonts.body || 'Inter'),
      serif: familyFor(fonts.heading || 'Inter'),
      display: familyFor(fonts.display || 'Bebas Neue'),
    },
    radius: settings.theme?.radius || '0.75rem',
    mode: settings.theme?.mode || 'dark',
  }

  return `${START}
<script>
  (function () {
    try {
      var t = ${JSON.stringify(payload)};
      var mode = null;
      try {
        var stored = JSON.parse(localStorage.getItem('rccswebcomp-ui') || 'null');
        mode = stored && stored.state && stored.state.theme;
      } catch (e) { /* ignore */ }
      if (!mode) mode = t.mode;
      var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var html = document.documentElement;
      html.classList.remove('light', 'dark');
      html.classList.add(dark ? 'dark' : 'light');
      var colors = dark ? t.palette.dark : t.palette.light;
      Object.keys(colors).forEach(function (key) {
        var name = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        html.style.setProperty('--' + name, colors[key]);
      });
      html.style.setProperty('--font-sans', t.fonts.sans);
      html.style.setProperty('--font-serif', t.fonts.serif);
      html.style.setProperty('--font-display', t.fonts.display);
      html.style.setProperty('--radius', t.radius);
    } catch (e) { /* never block first paint */ }
  })();
</script>
${END}`
}

function main() {
  const index = readFileSync(INDEX_PATH, 'utf8')
  const settings = loadSettings()
  const snippet = settings ? buildSnippet(settings) : ''

  let next
  const marker = new RegExp(`${escapeRegExp(START)}[\\s\\S]*?${escapeRegExp(END)}`)
  if (settings) {
    next = marker.test(index)
      ? index.replace(marker, snippet)
      : index.replace('</head>', `${snippet}\n  </head>`)
  } else {
    next = marker.test(index) ? index.replace(marker, '') : index
  }

  if (next !== index) {
    writeFileSync(INDEX_PATH, next)
    console.log(settings ? '[inject-theme] first-paint theme injected.' : '[inject-theme] snippet removed.')
  } else {
    console.log('[inject-theme] index.html is up to date.')
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

main()
