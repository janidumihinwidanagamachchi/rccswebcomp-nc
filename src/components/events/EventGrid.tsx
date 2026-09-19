import { motion } from 'framer-motion'
import { EventCard } from './EventCard'
import type { Event } from '@/types'

interface EventGridProps {
  events: Event[]
}

export function EventGrid({ events }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <p className="text-lg font-medium">No events found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </div>
  )
}
