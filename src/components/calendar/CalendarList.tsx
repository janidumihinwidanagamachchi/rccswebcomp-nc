import { Link } from 'react-router-dom'
import { format, isSameDay } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime, toDate } from '@/lib/utils'
import type { Event } from '@/types'

interface CalendarListProps {
  events: Event[]
  selectedDate: Date | null
}

export function CalendarList({ events, selectedDate }: CalendarListProps) {
  const filtered = selectedDate
    ? events.filter((event) => isSameDay(toDate(event.start_date), selectedDate))
    : events

  if (filtered.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">
            {selectedDate
              ? `No events on ${format(selectedDate, 'MMMM d, yyyy')}`
              : 'No upcoming events'}
          </p>
          <p className="text-sm text-muted-foreground">
            {selectedDate ? 'Pick another date or clear the filter.' : 'Check back soon!'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((event) => (
        <Card key={event.id} className="overflow-hidden transition-shadow hover:shadow-md">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{event.category?.name}</Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(event.start_date)}
                </span>
              </div>
              <Link
                to={`/events/${event.slug}`}
                className="text-lg font-semibold hover:text-primary hover:underline"
              >
                {event.title}
              </Link>
              <p className="line-clamp-1 text-sm text-muted-foreground">{event.short_description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={event.capacity && (event.registration_count || 0) >= event.capacity ? 'destructive' : 'outline'}>
                {event.capacity
                  ? `${event.registration_count || 0}/${event.capacity}`
                  : 'Open'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
