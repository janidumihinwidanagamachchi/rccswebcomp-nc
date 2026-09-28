import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Countdown } from './Countdown'
import { EventCover } from './EventCover'
import { cn, formatDate } from '@/lib/utils'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const capacityPercent = event.capacity
    ? Math.min(100, (event.registration_count || 0) / event.capacity * 100)
    : 0

  const registeredCount = event.registration_count || 0
  const pulseColor =
    event.capacity && registeredCount >= event.capacity
      ? 'bg-red-500'
      : capacityPercent >= 75
      ? 'bg-amber-500'
      : 'bg-emerald-500'

  return (
    <Card className="group overflow-hidden">
      <div className="relative h-40 overflow-hidden bg-quiet">
        {event.image_url ? (
          <>
            <EventCover
              src={event.image_url}
              alt=""
              className="transition-transform duration-[var(--motion-uniform)] ease-out hoverable:group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/70 via-canvas/10 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5 transition-transform duration-[var(--motion-uniform)] ease-out hoverable:group-hover:scale-105">
            <Calendar className="h-10 w-10 text-brand/40 transition-transform duration-[var(--motion-uniform)] ease-out hoverable:group-hover:scale-90" />
          </div>
        )}
        {event.featured && (
          <Badge className="absolute left-3 top-3 bg-brand text-brand-ink">Featured</Badge>
        )}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-canvas/90 px-2 py-1 text-xs font-medium backdrop-blur">
          <span className={cn('relative flex h-2 w-2')}>
            <span className={cn('absolute inline-flex h-full w-full animate-pulse-ring rounded-full opacity-75', pulseColor)} />
            <span className={cn('relative inline-flex h-2 w-2 rounded-full', pulseColor)} />
          </span>
          {event.capacity
            ? `${registeredCount}/${event.capacity} registered`
            : `${registeredCount} registered`}
        </div>
      </div>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary">{event.category?.name || 'Event'}</Badge>
          <span className="text-xs text-quiet-ink">{formatDate(event.start_date)}</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold leading-tight">{event.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-quiet-ink">{event.short_description}</p>
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-quiet-ink">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {event.capacity ? `${event.capacity} spots` : 'Unlimited'}
          </span>
        </div>
        <Countdown
          targetDate={event.start_date}
          eventEndDate={event.end_date}
          registrationOpensAt={event.registration_opens_at}
          registrationClosesAt={event.registration_closes_at}
          capacity={event.capacity}
          registeredCount={event.registration_count || 0}
        />
        <Button asChild className="mt-4 w-full">
          <Link to={`/events/${event.slug}`}>
            View Event
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-[var(--motion-uniform)] ease-out group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
