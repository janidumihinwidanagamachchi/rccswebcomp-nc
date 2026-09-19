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
        "background": "#f8fafc",
        "foreground": "#0b132b",
        "card": "#ffffff",
        "cardForeground": "#0b132b",
        "popover": "#ffffff",
        "popoverForeground": "#0b132b",
        "primary": "#ffd700",
        "primaryForeground": "#0b132b",
        "secondary": "#edf2f7",
        "secondaryForeground": "#0b132b",
        "muted": "#f1f5f9",
        "mutedForeground": "#64748b",
        "accent": "#48cae4",
        "accentForeground": "#0b132b",
        "destructive": "#ef4444",
        "destructiveForeground": "#ffffff",
        "border": "#e2e8f0",
        "input": "#e2e8f0",
        "ring": "#ffd700"
      },
      "dark": {
        "background": "#070d1e",
        "foreground": "#f8fafc",
        "card": "#131b33",
        "cardForeground": "#ffffff",
        "popover": "#1a2440",
        "popoverForeground": "#e2e8f0",
        "primary": "#ffd700",
        "primaryForeground": "#070d1e",
        "secondary": "#2b3d54",
        "secondaryForeground": "#ffffff",
        "muted": "#0f1c33",
        "mutedForeground": "#94a3b8",
        "accent": "#48cae4",
        "accentForeground": "#070d1e",
        "destructive": "#ef4444",
        "destructiveForeground": "#ffffff",
        "border": "#22324a",
        "input": "#0e1a2e",
        "ring": "#ffd700"
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
