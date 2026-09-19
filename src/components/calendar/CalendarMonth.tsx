import { useMemo, useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, toDate } from '@/lib/utils'
import type { Event } from '@/types'

interface CalendarMonthProps {
  events: Event[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

export function CalendarMonth({ events, selectedDate, onSelectDate }: CalendarMonthProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth))
    const end = endOfWeek(endOfMonth(currentMonth))
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>()
    events.forEach((event) => {
      const key = format(toDate(event.start_date), 'yyyy-MM-dd')
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(event)
    })
    return map
  }, [events])

  return (
    <div className="card-texture rounded-xl border bg-card/60 p-4 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDay.get(key) || []
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                'relative flex h-20 flex-col items-start justify-start rounded-lg border p-1 text-left transition-colors hover:bg-accent',
                !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                isSelected && 'border-primary bg-primary/10'
              )}
            >
              <span className={cn('text-sm font-medium', isSelected && 'text-primary')}>
                {format(day, 'd')}
              </span>
              <div className="mt-1 flex w-full flex-wrap gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: event.category?.color || 'var(--primary)' }}
                    title={event.title}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
