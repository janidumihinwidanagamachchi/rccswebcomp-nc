import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { CalendarWeekGrid } from './CalendarWeekGrid'
import { chunk, eventSegments } from '@/lib/calendar'
import type { Event } from '@/types'

interface CalendarMonthProps {
  events: Event[]
  currentDate: Date
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  onMonthChange: (date: Date) => void
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarMonth({
  events,
  currentDate,
  selectedDate,
  onSelectDate,
  onMonthChange,
}: CalendarMonthProps) {
  const segments = useMemo(() => eventSegments(events), [events])

  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate))
    const end = endOfWeek(endOfMonth(currentDate))
    const days = eachDayOfInterval({ start, end })
    return chunk(days, 7)
  }, [currentDate])

  return (
    <div className="card-texture rounded-xl border bg-panel/60 p-4 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h3>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-quiet-ink">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="space-y-0">
        {weeks.map((week) => (
          <CalendarWeekGrid
            key={format(week[0], 'yyyy-MM-dd')}
            days={week}
            segments={segments}
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              onSelectDate(date)
              if (!isSameMonth(date, currentDate)) {
                onMonthChange(date)
              }
            }}
            referenceMonth={currentDate}
          />
        ))}
      </div>
    </div>
  )
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}
