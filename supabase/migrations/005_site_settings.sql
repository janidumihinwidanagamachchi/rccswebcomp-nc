-- Site-wide settings store (appearance, brand, SEO)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings (Royal Navy & Gold preset)
INSERT INTO site_settings (key, value)
VALUES (
  'site_settings',
  '{
    "theme": { "mode": "dark", "radius": "0.75rem" },
    "colors": {
      "light": {
        "canvas": "#f8fafc",
        "ink": "#0b132b",
        "panel": "#ffffff",
        "panelInk": "#0b132b",
        "floating": "#ffffff",
        "floatingInk": "#0b132b",
        "brand": "#ffd700",
        "brandInk": "#0b132b",
        "alt": "#edf2f7",
        "altInk": "#0b132b",
        "quiet": "#f1f5f9",
        "quietInk": "#64748b",
        "highlight": "#48cae4",
        "highlightInk": "#0b132b",
        "danger": "#ef4444",
        "dangerInk": "#ffffff",
        "line": "#e2e8f0",
        "field": "#e2e8f0",
        "focus": "#ffd700"
      },
      "dark": {
        "canvas": "#070d1e",
        "ink": "#f8fafc",
        "panel": "#131b33",
        "panelInk": "#ffffff",
        "floating": "#1a2440",
        "floatingInk": "#e2e8f0",
        "brand": "#ffd700",
        "brandInk": "#070d1e",
        "alt": "#2b3d54",
        "altInk": "#ffffff",
        "quiet": "#0f1c33",
        "quietInk": "#94a3b8",
        "highlight": "#48cae4",
        "highlightInk": "#070d1e",
        "danger": "#ef4444",
        "dangerInk": "#ffffff",
        "line": "#22324a",
        "field": "#0e1a2e",
        "focus": "#ffd700"
      }
    },
    "fonts": { "body": "Nunito Sans", "heading": "Shippori Mincho B1", "display": "Bebas Neue" },
    "brand": { "name": "RCCSWebComp-NC", "motto": "Disce Aut Discede", "logoUrl": "" },
    "seo": { "title": "RCCSWebComp-NC | School Events", "description": "School events, QR tickets, and announcements for one campus.", "ogImageUrl": "" },
    "hero": { "badge": "BTUI''26 Competition Entry", "headline": "What''s on at school,\nwithout the guesswork.", "subtitle": "See what''s coming up, register in a minute, and keep your QR ticket in your pocket.", "primaryCta": { "label": "Browse Events", "href": "/events" }, "secondaryCta": { "label": "View Calendar", "href": "/calendar" }, "backgroundImageUrl": "", "showCountdown": true }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
