import type {
  EventStatus,
  HighlightType,
  Priority,
  RegistrationStatus,
  Role,
} from '@/lib/constants'

export interface Profile {
  id: string
  full_name: string
  role: Role
  grade: number | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon: string
  sort_order: number
  created_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  short_description: string
  description: string
  category_id: string
  status: EventStatus
  start_date: string
  end_date: string
  location: string
  capacity: number | null
  registration_opens_at: string
  registration_closes_at: string
  image_url: string | null
  featured: boolean
  organizer_id: string
  created_at: string
  updated_at: string
  category?: Category
  organizer?: Profile
  registration_count?: number
  user_registration?: Registration | null
}

export interface Announcement {
  id: string
  title: string
  content: string
  priority: Priority
  category_id: string | null
  event_id: string | null
  published_at: string
  expires_at: string | null
  author_id: string
  created_at: string
  category?: Category
  event?: Event
  author?: Profile
}

export interface Registration {
  id: string
  event_id: string
  user_id: string
  ticket_number: string
  qr_code_data: string
  status: RegistrationStatus
  attendee_name: string
  attendee_email: string
  attendee_grade: number | null
  notes: string | null
  registered_at: string
  event?: Event
}

export interface Highlight {
  id: string
  event_id: string
  author_id: string
  content: string
  media_url: string | null
  type: HighlightType
  created_at: string
  event?: Event
  author?: Profile
}

export interface TicketWithEvent extends Registration {
  event: Event
}

export interface DashboardStats {
  totalEvents: number
  totalRegistrations: number
  upcomingEvents: number
  totalAnnouncements: number
}

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemePalette {
  canvas: string
  ink: string
  panel: string
  panelInk: string
  floating: string
  floatingInk: string
  brand: string
  brandInk: string
  alt: string
  altInk: string
  quiet: string
  quietInk: string
  highlight: string
  highlightInk: string
  danger: string
  dangerInk: string
  line: string
  field: string
  focus: string
}

export interface HeroSettings {
  badge: string
  headline: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  backgroundImageUrl: string
  showCountdown: boolean
}

export interface SiteSettings {
  theme: {
    mode: ThemeMode
    radius: string
  }
  colors: {
    light: ThemePalette
    dark: ThemePalette
  }
  fonts: {
    body: string
    heading: string
    display: string
  }
  brand: {
    name: string
    motto: string
    logoUrl: string
  }
  seo: {
    title: string
    description: string
    ogImageUrl: string
  }
  hero: HeroSettings
}

export type PaletteMode = 'light' | 'dark'
