import { Shell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEvents } from '@/hooks/useEvents'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { CalendarDays, Users, Megaphone, Ticket } from 'lucide-react'

export function AdminDashboardPage() {
  const { data: events, isLoading: eventsLoading } = useEvents({})
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements()

  const totalEvents = events?.length || 0
  const upcomingEvents = events?.filter((e) => new Date(e.start_date) > new Date()).length || 0
  const totalRegistrations = events?.reduce((sum, e) => sum + (e.registration_count || 0), 0) || 0
  const totalAnnouncements = announcements?.length || 0

  const stats = [
    { label: 'Total Events', value: totalEvents, icon: CalendarDays, loading: eventsLoading },
    { label: 'Upcoming Events', value: upcomingEvents, icon: Ticket, loading: eventsLoading },
    { label: 'Total Registrations', value: totalRegistrations, icon: Users, loading: eventsLoading },
    { label: 'Announcements', value: totalAnnouncements, icon: Megaphone, loading: announcementsLoading },
  ]

  return (
    <Shell>
      <AdminShell>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Events, sign-ups, and announcements at a glance.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="relative overflow-hidden">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                </CardHeader>
                <CardContent>
                  {stat.loading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    <p className="text-4xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </AdminShell>
    </Shell>
  )
}
