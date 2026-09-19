import { useMemo } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyRegistrations } from '@/hooks/useRegistrations'
import { BADGES } from '@/lib/constants'
import { Trophy, Calendar, MapPin } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

export function PassportPage() {
  const { data: registrations, isLoading } = useMyRegistrations()

  const attended = useMemo(
    () => (registrations || []).filter((r) => r.status === 'attended'),
    [registrations]
  )

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    attended.forEach((r) => {
      const slug = r.event?.category?.slug
      if (slug) counts[slug] = (counts[slug] || 0) + 1
    })
    return counts
  }, [attended])

  const uniqueCategories = Object.keys(categoryCounts).length

  const earnedBadges = useMemo(() => {
    return BADGES.filter((badge) => {
      if (badge.category) {
        return (categoryCounts[badge.category] || 0) >= badge.threshold
      }
      if (badge.id === 'all-rounder') return uniqueCategories >= badge.threshold
      if (badge.id === 'early-bird') return attended.length >= badge.threshold
      return false
    })
  }, [categoryCounts, uniqueCategories, attended.length])

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Event Passport</h1>
          <p className="text-muted-foreground">Collect stamps and unlock badges by attending events.</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Events attended</p>
              <p className="text-3xl font-bold">{attended.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Categories explored</p>
              <p className="text-3xl font-bold">{uniqueCategories}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Badges earned</p>
              <p className="text-3xl font-bold">{earnedBadges.length}</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mb-4 text-xl font-bold">Badges</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const earned = earnedBadges.some((b) => b.id === badge.id)
            return (
              <Card
                key={badge.id}
                className={earned ? 'border-primary/50 bg-primary/5' : 'opacity-60'}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    {earned && <Badge className="mt-2">Earned</Badge>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <h2 className="mb-4 text-xl font-bold">Collected Stamps</h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : attended.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {attended.map((registration) => (
              <Card key={registration.id} className="overflow-hidden">
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: registration.event?.category?.color || 'var(--primary)' }}
                />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{registration.event?.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(registration.event?.start_date || new Date())}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {registration.event?.location}
                    </span>
                  </div>
                  <Badge className="mt-3" variant="secondary">
                    Attended
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Attend events to collect your first stamps.</p>
        )}
      </div>
    </Shell>
  )
}
