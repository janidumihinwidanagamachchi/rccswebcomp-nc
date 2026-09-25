import { Link } from 'react-router-dom'
import { format, isSameDay, isSameMonth, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { getWeekSegments } from '@/lib/calendar'
import type { EventSegment } from '@/lib/calendar'

interface CalendarWeekGridProps {
  days: Date[]
  segments: EventSegment[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  referenceMonth?: Date
}

export function CalendarWeekGrid({
  days,
  segments,
  selectedDate,
  onSelectDate,
  referenceMonth,
}: CalendarWeekGridProps) {
  if (days.length !== 7) return null

  const weekSegments = getWeekSegments(days[0], segments)
  const maxLane = weekSegments.reduce((max, segment) => Math.max(max, segment.lane + 1), 2)

  return (
    <div
      className="relative grid grid-cols-7 border-x border-b first:border-t"
      style={{ gridTemplateRows: `2.5rem repeat(${maxLane}, 1.5rem)` }}
    >
      {days.map((day, index) => {
        const selected = selectedDate ? isSameDay(day, selectedDate) : false
        const currentMonth = referenceMonth ? isSameMonth(day, referenceMonth) : true
        return (
          <button
            key={`header-${day.toISOString()}`}
            type="button"
            onClick={() => onSelectDate(day)}
            className={cn(
              'relative z-10 flex items-start justify-end border-r border-b last:border-r-0 p-1.5 text-right transition-colors hover:bg-highlight focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              !currentMonth && 'bg-quiet/30 text-quiet-ink',
              selected && 'bg-brand/10'
            )}
            style={{ gridColumn: index + 1, gridRow: 1 }}
            aria-label={format(day, 'MMMM d, yyyy')}
            aria-pressed={selected}
          >
            <span
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium',
                isToday(day) && 'bg-brand text-canvas',
                selected && 'text-brand'
              )}
            >
              {format(day, 'd')}
            </span>
          </button>
        )
      })}

      {Array.from({ length: maxLane }).map((_, lane) =>
        days.map((day, index) => {
          const selected = selectedDate ? isSameDay(day, selectedDate) : false
          const currentMonth = referenceMonth ? isSameMonth(day, referenceMonth) : true
          return (
            <div
              key={`cell-${lane}-${day.toISOString()}`}
              role="button"
              tabIndex={0}
              aria-label={`Select ${format(day, 'd MMMM yyyy')}`}
              onClick={() => onSelectDate(day)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectDate(day)
                }
              }}
              className={cn(
                'border-r border-b last:border-r-0 transition-colors',
                !currentMonth && 'bg-quiet/30',
                selected && 'bg-brand/5'
              )}
              style={{ gridColumn: index + 1, gridRow: lane + 2 }}
            />
          )
        })
      )}

      {weekSegments.map((segment) => (
        <Link
          key={`${segment.event.id}-${format(days[0], 'yyyy-MM-dd')}`}
          to={`/events/${segment.event.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="z-20 mx-0.5 my-0.5 rounded px-2 py-0.5 text-xs font-medium truncate transition-transform hover:scale-[1.02] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          style={{
            gridColumn: `${segment.startColumn + 1} / span ${segment.endColumn - segment.startColumn + 1}`,
            gridRow: segment.lane + 2,
            backgroundColor: segment.event.category?.color || 'var(--brand)',
            color: '#ffffff',
          }}
          title={segment.event.title}
        >
          {segment.event.title}
        </Link>
      ))}
    </div>
  )
}
