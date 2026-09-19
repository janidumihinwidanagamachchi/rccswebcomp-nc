import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Countdown } from './Countdown'
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
      <div className="relative h-40 overflow-hidden bg-muted">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Calendar className="h-10 w-10 text-primary/40" />
          </div>
        )}
        {event.featured && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">Featured</Badge>
        )}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur">
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
          <span className="text-xs text-muted-foreground">{formatDate(event.start_date)}</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold leading-tight">{event.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{event.short_description}</p>
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {event.capacity ? `${event.capacity} spots` : 'Unlimited'}
          </span>
        </div>
        <Countdown targetDate={event.start_date} />
        <Button asChild className="mt-4 w-full">
          <Link to={`/events/${event.slug}`}>View Event</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
