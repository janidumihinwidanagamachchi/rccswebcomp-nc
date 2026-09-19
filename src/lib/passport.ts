import { BADGES } from './constants'
import type { Registration } from '@/types'

export interface PassportStats {
  attended: Registration[]
  categoryCounts: Record<string, number>
  uniqueCategories: number
  earnedBadges: typeof BADGES
  earlyBirdCount: number
}

export function computePassportStats(registrations: Registration[]): PassportStats {
  const attended = registrations.filter((r) => r.status === 'attended')

  const categoryCounts: Record<string, number> = {}
  attended.forEach((r) => {
    const slug = r.event?.category?.slug
    if (slug) categoryCounts[slug] = (categoryCounts[slug] || 0) + 1
  })

  const uniqueCategories = Object.keys(categoryCounts).length

  const earlyBirdCount = registrations.filter((r) => {
    if (r.status === 'cancelled') return false
    const eventStart = r.event?.start_date ? new Date(r.event.start_date) : null
    const registeredAt = r.registered_at ? new Date(r.registered_at) : null
    return eventStart && registeredAt && registeredAt < eventStart
  }).length

  const earnedBadges = BADGES.filter((badge) => {
    if (badge.category) return (categoryCounts[badge.category] || 0) >= badge.threshold
    if (badge.id === 'all-rounder') return uniqueCategories >= badge.threshold
    if (badge.id === 'early-bird') return earlyBirdCount >= badge.threshold
    return false
  })

  return { attended, categoryCounts, uniqueCategories, earnedBadges, earlyBirdCount }
}
