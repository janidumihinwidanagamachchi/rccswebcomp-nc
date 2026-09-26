import { AnimatePresence, motion } from 'motion/react'
import { EventCard } from './EventCard'
import { dur, ease } from '@/components/motion/tokens'
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
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: dur.base, ease: ease.gentle, delay: Math.min(index, 5) * 0.04 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
