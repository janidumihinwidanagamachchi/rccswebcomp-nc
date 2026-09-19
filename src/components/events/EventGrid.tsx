import { EventCard } from './EventCard'
import type { Event } from '@/types'

interface EventGridProps {
  events: Event[]
}

export function EventGrid({ events }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <p className="text-lg font-medium">Nothing here yet</p>
        <p className="text-sm text-quiet-ink">Try a different search or category.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <div key={event.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  )
}
