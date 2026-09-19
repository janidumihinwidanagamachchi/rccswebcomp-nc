export const ROLES = {
  STUDENT: 'student',
  PARENT: 'parent',
  TEACHER: 'teacher',
  ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS]

export const REGISTRATION_STATUS = {
  REGISTERED: 'registered',
  ATTENDED: 'attended',
  CANCELLED: 'cancelled',
} as const

export type RegistrationStatus = (typeof REGISTRATION_STATUS)[keyof typeof REGISTRATION_STATUS]

export const PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const

export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY]

export const HIGHLIGHT_TYPE = {
  TEXT: 'text',
  PHOTO: 'photo',
  RESULT: 'result',
} as const

export type HighlightType = (typeof HIGHLIGHT_TYPE)[keyof typeof HIGHLIGHT_TYPE]

export const DEFAULT_CATEGORIES = [
  { name: 'Academic', slug: 'academic', color: 'bg-blue-500', icon: 'GraduationCap' },
  { name: 'Sports', slug: 'sports', color: 'bg-orange-500', icon: 'Trophy' },
  { name: 'Arts', slug: 'arts', color: 'bg-pink-500', icon: 'Palette' },
  { name: 'Culture', slug: 'culture', color: 'bg-purple-500', icon: 'Globe' },
  { name: 'Tech', slug: 'tech', color: 'bg-cyan-500', icon: 'Cpu' },
  { name: 'Music', slug: 'music', color: 'bg-rose-500', icon: 'Music' },
]

export const BADGES = [
  { id: 'culture-explorer', name: 'Culture Explorer', description: 'Attended 3+ culture events', category: 'culture', threshold: 3 },
  { id: 'sports-fanatic', name: 'Sports Fanatic', description: 'Attended 3+ sports events', category: 'sports', threshold: 3 },
  { id: 'tech-pioneer', name: 'Tech Pioneer', description: 'Attended 3+ tech events', category: 'tech', threshold: 3 },
  { id: 'all-rounder', name: 'All-Rounder', description: 'Attended events in 5+ different categories', category: null, threshold: 5 },
  { id: 'early-bird', name: 'Early Bird', description: 'Registered for 3+ events before they start', category: null, threshold: 3 },
]

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}
