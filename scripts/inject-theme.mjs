import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const INDEX_PATH = resolve(ROOT, 'index.html')
const SETTINGS_PATH = resolve(ROOT, 'supabase/data/site_settings.json')
const START = '<!-- theme:start -->'
const END = '<!-- theme:end -->'

const FONT_FAMILIES = {
  'Inter': '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  'Nunito Sans': '"Nunito Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Open Sans': '"Open Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'Shippori Mincho B1': '"Shippori Mincho B1", ui-serif, Georgia, "Times New Roman", serif',
  'Domine': '"Domine", ui-serif, Georgia, "Times New Roman", serif',
  'Playfair Display': '"Playfair Display", ui-serif, Georgia, "Times New Roman", serif',
  'Bebas Neue': '"Bebas Neue", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  'Roboto': '"Roboto", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Poppins': '"Poppins", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Montserrat': '"Montserrat", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Lato': '"Lato", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Oswald': '"Oswald", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
  'Raleway': '"Raleway", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Merriweather': '"Merriweather", ui-serif, Georgia, "Times New Roman", serif',
  'Crimson Pro': '"Crimson Pro", ui-serif, Georgia, "Times New Roman", serif',
  'Space Grotesk': '"Space Grotesk", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Plus Jakarta Sans': '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'DM Sans': '"DM Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Geist': '"Geist", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Geist Mono': '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
  'JetBrains Mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
  'Fira Code': '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Mono", monospace',
  'Source Sans 3': '"Source Sans 3", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Ubuntu': '"Ubuntu", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Work Sans': '"Work Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Manrope': '"Manrope", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Outfit': '"Outfit", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  'Figtree': '"Figtree", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

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