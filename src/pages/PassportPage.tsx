import { Trophy, Calendar, MapPin, Crown } from 'lucide-react'
import { Shell } from '@/components/layout/Shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyRegistrations, useLeaderboard } from '@/hooks/useRegistrations'
import { useAuthStore } from '@/stores/authStore'
import { BADGES } from '@/lib/constants'
import { computePassportStats, computeLeaderboardStats } from '@/lib/passport'
import { cn, formatDate } from '@/lib/utils'

export function PassportPage() {
  const { user } = useAuthStore()
  const { data: registrations, isLoading } = useMyRegistrations()
  const { data: leaderboard, isLoading: passportLoading } = useLeaderboard()

  const stats = computePassportStats(registrations || [])

  const rankedSubjects =
    leaderboard
      ?.map((row) => ({
        ...row,
        stats: computeLeaderboardStats(row),
      }))
      .sort((a, b) => b.stats.attended - a.stats.attended) || []

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Event Passport</h1>
          <p className="text-quiet-ink">Every event you attend adds a stamp.</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-quiet-ink">Events attended</p>
              <p className="text-3xl font-bold">{stats.attended.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-quiet-ink">Categories explored</p>
              <p className="text-3xl font-bold">{stats.uniqueCategories}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-quiet-ink">Badges earned</p>
              <p className="text-3xl font-bold">{stats.earnedBadges.length}</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="mb-4 text-xl font-bold">Badges</h2>
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const earned = stats.earnedBadges.some((b) => b.id === badge.id)
            return (
              <Card
                key={badge.id}
                className={earned ? 'border-brand/50 bg-brand/5' : 'opacity-60'}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      earned ? 'bg-brand text-brand-ink' : 'bg-quiet text-quiet-ink'
                    )}
                  >
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-quiet-ink">{badge.description}</p>
                    {earned && <Badge className="mt-2">Earned</Badge>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <>
          <h2 className="mb-4 text-xl font-bold">Leaderboard</h2>
          {passportLoading ? (
            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rankedSubjects.map((subject, index) => (
                <Card
                  key={subject.user_id}
                  className={cn(
                    'overflow-hidden',
                    subject.user_id === user?.id && 'border-brand/50 bg-brand/5'
                  )}
                >
                  <div className="flex items-center justify-between border-b bg-panel/40 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-ink">
                        {index + 1}
                      </span>
                      <p className="font-semibold">{subject.full_name}</p>
                    </div>
                    {subject.role === 'admin' && (
                      <Badge variant="secondary" className="gap-1">
                        <Crown className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="secondary">{subject.stats.attended} attended</Badge>
                      <Badge variant="secondary">{subject.stats.uniqueCategories} categories</Badge>
                      <Badge variant="secondary">{subject.stats.earnedBadges.length} badges</Badge>
                    </div>
                    {subject.stats.earnedBadges.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {subject.stats.earnedBadges.map((badge) => (
                          <Badge key={badge.id} className="text-[10px]">
                            {badge.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>

        <h2 className="mb-4 text-xl font-bold">Collected Stamps</h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : stats.attended.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.attended.map((registration) => (
              <Card key={registration.id} className="overflow-hidden">
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: registration.event?.category?.color || 'var(--brand)' }}
                />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{registration.event?.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-xs text-quiet-ink">
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
          <p className="text-quiet-ink">No stamps yet. Attend an event to get started.</p>
        )}
      </div>
    </Shell>
  )
}
