import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Calendar, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { eventSegments, eventsForDate, isEventUpcoming, isEventPast } from '@/lib/calendar'
import { formatDateTime } from '@/lib/utils'
import type { Event } from '@/types'

interface CalendarListProps {
  events: Event[]
  selectedDate: Date | null
}

export function CalendarList({ events, selectedDate }: CalendarListProps) {
  const segments = useMemo(() => eventSegments(events), [events])
  const [showEarlier, setShowEarlier] = useState(false)

  const filtered = useMemo(() => {
    if (selectedDate) {
      return eventsForDate(segments, selectedDate).sort(
        (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      )
    }
    const upcoming = events.filter(isEventUpcoming).sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    return upcoming.slice(0, 8)
  }, [segments, events, selectedDate])

  const earlier = useMemo(
    () =>
      events
        .filter((event) => isEventPast(event))
        .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())
        .slice(0, 10),
    [events]
  )

  if (filtered.length === 0 && earlier.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="mb-3 h-10 w-10 text-quiet-ink" />
          <p className="font-medium">
            {selectedDate ? `No events on ${format(selectedDate, 'MMMM d, yyyy')}` : 'No upcoming events'}
          </p>
          <p className="text-sm text-quiet-ink">
            {selectedDate ? 'Pick another date or clear the filter.' : 'Nothing on the calendar yet.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map((event) => (
        <EventListItem key={event.id} event={event} />
      ))}

      {!selectedDate && earlier.length > 0 && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEarlier(!showEarlier)}
            className="w-full justify-between"
          >
            <span>Earlier events</span>
            {showEarlier ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {showEarlier && (
            <div className="mt-2 space-y-3">
              {earlier.map((event) => (
                <EventListItem key={event.id} event={event} muted />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EventListItem({ event, muted }: { event: Event; muted?: boolean }) {
  return (
    <Card className={muted ? 'opacity-60' : undefined}>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{event.category?.name}</Badge>
          <Badge
            variant={event.capacity && (event.registration_count || 0) >= event.capacity ? 'destructive' : 'outline'}
          >
            {event.capacity ? `${event.registration_count || 0}/${event.capacity}` : 'Open'}
          </Badge>
        </div>
        <Link to={`/events/${event.slug}`} className="font-semibold hover:text-brand hover:underline">
          {event.title}
        </Link>
        <p className="text-xs text-quiet-ink">{formatDateTime(event.start_date)}</p>
        <p className="flex items-center gap-1 text-xs text-quiet-ink">
          <MapPin className="h-3 w-3" />
          {event.location}
        </p>
      </CardContent>
    </Card>
  )
}
