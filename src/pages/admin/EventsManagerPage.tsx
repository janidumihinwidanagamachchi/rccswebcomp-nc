import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Shell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/AdminShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useEvents, useDeleteEvent } from '@/hooks/useEvents'
import { formatDate } from '@/lib/utils'

export function EventsManagerPage() {
  const { data: events, isLoading } = useEvents({})
  const deleteEvent = useDeleteEvent()

  return (
    <Shell>
      <AdminShell>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="text-quiet-ink">Create, edit, and publish school events.</p>
          </div>
          <Button asChild>
            <Link to="/admin/events/new">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {events?.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-quiet-ink">
                        {formatDate(event.start_date)} • {event.location} •{' '}
                        {event.registration_count || 0} registered
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/admin/events/${event.id}/edit`}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete this event? This cannot be undone.')) {
                            deleteEvent.mutate(event.id)
                          }
                        }}
                        disabled={deleteEvent.isPending}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AdminShell>
    </Shell>
  )
}
