import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function generateTicketNumber(eventId: string) {
  const segment = eventId.slice(-6).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `EVT-${segment}-${random}`
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function toDate(date: string | Date): Date {
  return typeof date === 'string' ? new Date(date) : date
}

export function formatDateTimeLocal(date: string | Date) {
  const d = toDate(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function isEventLive(start: string | Date, end: string | Date) {
  const now = new Date()
  return toDate(start) <= now && toDate(end) >= now
}

export function isRegistrationOpen(
  opensAt: string | Date,
  closesAt: string | Date,
  capacity: number | null,
  registeredCount: number
) {
  const now = new Date()
  const hasCapacity = capacity === null || registeredCount < capacity
  return toDate(opensAt) <= now && toDate(closesAt) >= now && hasCapacity
}
