import { useMemo } from 'react'
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { CalendarWeekGrid } from './CalendarWeekGrid'
import { eventSegments } from '@/lib/calendar'
import type { Event } from '@/types'
import { Reveal } from '@/components/motion/Reveal'

interface CalendarWeekProps {
  events: Event[]
  currentDate: Date
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

export function CalendarWeek({ events, currentDate, selectedDate, onSelectDate }: CalendarWeekProps) {
  const segments = useMemo(() => eventSegments(events), [events])
  const days = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(currentDate), end: endOfWeek(currentDate) }),
    [currentDate]
  )

  // Container-level reveal, not a per-cell stagger: the grid is dense and a
  // cell cascade would run for seconds at dur.uniform.
  return (
    <Reveal scale="md">
      <div className="card-texture rounded-xl border bg-panel/60 p-4 backdrop-blur-md">
        <CalendarWeekGrid
          days={days}
          segments={segments}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      </div>
    </Reveal>
  )
}
