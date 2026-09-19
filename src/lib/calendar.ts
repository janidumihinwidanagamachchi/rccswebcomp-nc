import { format, isBefore, isSameDay, startOfDay, endOfWeek, eachDayOfInterval } from 'date-fns'
import { toDate } from './utils'
import type { Category, Event } from '@/types'

export type CalendarView = 'month' | 'week' | 'agenda'

export interface EventSegment {
  event: Event
  startDate: Date
  endDate: Date
}

export function toCalendarDate(date: string | Date): Date {
  return toDate(date)
}

export function eventSegments(events: Event[]): EventSegment[] {
  return events.map((event) => ({
    event,
    startDate: toCalendarDate(event.start_date),
    endDate: toCalendarDate(event.end_date),
  }))
}

export function eventsForDate(segments: EventSegment[], date: Date): Event[] {
  const start = startOfDay(date)
  return segments
    .filter(
      (segment) =>
        startOfDay(segment.startDate) <= start && startOfDay(segment.endDate) >= start
    )
    .map((segment) => segment.event)
}

export function groupEventsByDate(segments: EventSegment[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>()
  for (const segment of segments) {
    const days = eachDayOfInterval({
      start: startOfDay(segment.startDate),
      end: startOfDay(segment.endDate),
    })
    for (const day of days) {
      const key = format(day, 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(segment.event)
    }
  }
  for (const [key, list] of map) {
    const seen = new Set<string>()
    map.set(
      key,
      list.filter((event) => {
        if (seen.has(event.id)) return false
        seen.add(event.id)
        return true
      })
    )
  }
  return map
}

export interface WeekSegment {
  event: Event
  startColumn: number
  endColumn: number
  lane: number
}

export function getWeekSegments(weekStart: Date, segments: EventSegment[]): WeekSegment[] {
  const weekEnd = endOfWeek(weekStart)
  const raw = segments
    .filter((segment) => segment.endDate >= weekStart && segment.startDate <= weekEnd)
    .map((segment) => {
      const start = segment.startDate < weekStart ? weekStart : segment.startDate
      const end = segment.endDate > weekEnd ? weekEnd : segment.endDate
      return {
        event: segment.event,
        startColumn: start.getDay(),
        endColumn: end.getDay(),
      }
    })
    .sort((a, b) => {
      if (a.startColumn !== b.startColumn) return a.startColumn - b.startColumn
      return b.endColumn - b.startColumn - (a.endColumn - a.startColumn)
    })

  const lanes: Array<{ endColumn: number }[]> = []
  const result: WeekSegment[] = []

  for (const item of raw) {
    let laneIndex = lanes.findIndex((lane) => {
      const last = lane[lane.length - 1]
      return last.endColumn < item.startColumn
    })
    if (laneIndex === -1) {
      laneIndex = lanes.length
      lanes.push([])
    }
    lanes[laneIndex].push({ endColumn: item.endColumn })
    result.push({ ...item, lane: laneIndex })
  }

  return result
}

export function isEventUpcoming(event: Event): boolean {
  return !isBefore(startOfDay(toCalendarDate(event.start_date)), startOfDay(new Date()))
}

export function isEventPast(event: Event): boolean {
  return isBefore(startOfDay(toCalendarDate(event.end_date)), startOfDay(new Date()))
}

export function filterEventsByCategory(events: Event[], categorySlug?: string): Event[] {
  if (!categorySlug || categorySlug === 'all') return events
  return events.filter((event) => event.category?.slug === categorySlug)
}

export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export function groupEventsByStartDate(events: Event[]): Map<string, Event[]> {
  const map = new Map<string, Event[]>()
  for (const event of events) {
    const key = format(toCalendarDate(event.start_date), 'yyyy-MM-dd')
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(event)
  }
  return map
}

export function formatDateRange(start: string | Date, end: string | Date): string {
  const s = toCalendarDate(start)
  const e = toCalendarDate(end)
  if (isSameDay(s, e)) return format(s, 'MMMM d, yyyy')
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${format(s, 'MMMM d')} – ${format(e, 'd, yyyy')}`
  }
  return `${format(s, 'MMM d, yyyy')} – ${format(e, 'MMM d, yyyy')}`
}

function formatUTCDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0]
}

function escapeICS(text: string): string {
  return text.replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n').replace(/\r/g, '')
}

export function generateICS(event: Event): string {
  const start = toCalendarDate(event.start_date)
  const end = toCalendarDate(event.end_date)
  const now = new Date()
  const uid = `${event.slug}-${event.id}@rccswebcomp.demo`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RCCSWebComp-NC//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatUTCDate(now)}Z`,
    `DTSTART:${formatUTCDate(start)}Z`,
    `DTEND:${formatUTCDate(end)}Z`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.short_description)}`,
    `LOCATION:${escapeICS(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadICS(event: Event) {
  const blob = new Blob([generateICS(event)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.slug}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function googleCalendarUrl(event: Event): string {
  const start = toCalendarDate(event.start_date)
  const end = toCalendarDate(event.end_date)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    dates: `${formatUTCDate(start)}Z/${formatUTCDate(end)}Z`,
    text: event.title,
    details: event.short_description,
    location: event.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function categoryStyle(category: Category | null | undefined) {
  return category ? { backgroundColor: category.color, color: '#ffffff' } : undefined
}
