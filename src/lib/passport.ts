import { BADGES } from './constants'
import type { Registration } from '@/types'

export interface BadgeInputs {
  categoryCounts: Record<string, number>
  uniqueCategories: number
  earlyBirdCount: number
}

export function evaluateBadges(input: BadgeInputs): typeof BADGES {
  return BADGES.filter((badge) => {
    if (badge.category) return (input.categoryCounts[badge.category] || 0) >= badge.threshold
    if (badge.id === 'all-rounder') return input.uniqueCategories >= badge.threshold
    if (badge.id === 'early-bird') return input.earlyBirdCount >= badge.threshold
    return false
  })
}

export interface PassportStats extends BadgeInputs {
  attended: Registration[]
  earnedBadges: typeof BADGES
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

  const earnedBadges = evaluateBadges({ categoryCounts, uniqueCategories, earlyBirdCount })

  return { attended, categoryCounts, uniqueCategories, earnedBadges, earlyBirdCount }
}

export interface LeaderboardRow {
  user_id: string
  full_name: string
  role: string
  attended_count: number
  unique_categories: number
  early_bird_count: number
  categories: { slug: string; color: string }[]
}

export interface LeaderboardStats {
  attended: number
  uniqueCategories: number
  earlyBirdCount: number
  earnedBadges: typeof BADGES
}

export function computeLeaderboardStats(row: LeaderboardRow): LeaderboardStats {
  const categoryCounts: Record<string, number> = {}
  row.categories.forEach((c) => {
    categoryCounts[c.slug] = (categoryCounts[c.slug] || 0) + 1
  })

  return {
    attended: row.attended_count,
    uniqueCategories: row.unique_categories,
    earlyBirdCount: row.early_bird_count,
    earnedBadges: evaluateBadges({
      categoryCounts,
      uniqueCategories: row.unique_categories,
      earlyBirdCount: row.early_bird_count,
    }),
  }
}
