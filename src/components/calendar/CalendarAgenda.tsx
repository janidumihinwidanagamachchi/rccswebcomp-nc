import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, isBefore, isSameDay, startOfDay } from 'date-fns'
import { Calendar, ChevronDown, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapse } from '@/components/motion/Collapse'
import { groupEventsByStartDate, formatDateRange } from '@/lib/calendar'
import { AddToCalendar } from './AddToCalendar'
import { cn } from '@/lib/utils'
import type { Event } from '@/types'

interface CalendarAgendaProps {
  events: Event[]
}

export function CalendarAgenda({ events }: CalendarAgendaProps) {
  const [showEarlier, setShowEarlier] = useState(false)
  const byDate = useMemo(() => groupEventsByStartDate(events), [events])

  const dates = useMemo(
    () =>
      Array.from(byDate.keys())
        .map((key) => new Date(`${key}T00:00:00`))
        .sort((a, b) => a.getTime() - b.getTime()),
    [byDate]
  )

  const today = startOfDay(new Date())
  const upcomingDates = dates.filter((date) => !isBefore(startOfDay(date), today))
  const earlierDates = dates.filter((date) => isBefore(startOfDay(date), today))

  if (dates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Calendar className="mb-3 h-10 w-10 text-quiet-ink" />
          <p className="font-medium">No events found</p>
          <p className="text-sm text-quiet-ink">Try clearing the category filter.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {upcomingDates.map((date) => (
        <AgendaDay key={date.toISOString()} date={date} events={byDate.get(format(date, 'yyyy-MM-dd')) || []} />
      ))}

      {earlierDates.length > 0 && (
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowEarlier(!showEarlier)}
            className="mb-2 w-full justify-between"
          >
            <span className="font-medium">Earlier events</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform duration-[var(--motion-uniform)]', showEarlier && 'rotate-180')}
            />
          </Button>
          <Collapse show={showEarlier} className="space-y-6">
            {earlierDates.map((date) => (
              <AgendaDay
                key={date.toISOString()}
                date={date}
                events={byDate.get(format(date, 'yyyy-MM-dd')) || []}
                past
              />
            ))}
          </Collapse>
        </div>
      )}
    </div>
  )
}

function AgendaDay({ date, events, past }: { date: Date; events: Event[]; past?: boolean }) {
  return (
    <div className={cn('space-y-3', past && 'opacity-70')}>
      <div className="sticky top-0 z-10 bg-canvas/80 py-2 backdrop-blur">
        <h3 className="text-lg font-semibold">
          {isSameDay(date, new Date()) ? 'Today' : format(date, 'EEEE, MMMM d, yyyy')}
        </h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <Badge style={{ backgroundColor: event.category?.color }}>{event.category?.name}</Badge>
                <Badge
                  variant={event.capacity && (event.registration_count || 0) >= event.capacity ? 'destructive' : 'outline'}
                >
                  {event.capacity ? `${event.registration_count || 0}/${event.capacity}` : 'Open'}
                </Badge>
              </div>
              <Link
                to={`/events/${event.slug}`}
                className="text-lg font-semibold hover:text-brand hover:underline"
              >
                {event.title}
              </Link>
              <p className="text-sm text-quiet-ink">{formatDateRange(event.start_date, event.end_date)}</p>
              <p className="flex items-center gap-1 text-sm text-quiet-ink">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </p>
              <AddToCalendar event={event} size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
