import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { format, parseISO, addMonths, subMonths, addWeeks, subWeeks, startOfToday } from 'date-fns'
import { Shell } from '@/components/layout/Shell'
import { CalendarToolbar } from '@/components/calendar/CalendarToolbar'
import { CalendarMonth } from '@/components/calendar/CalendarMonth'
import { CalendarWeek } from '@/components/calendar/CalendarWeek'
import { CalendarAgenda } from '@/components/calendar/CalendarAgenda'
import { CalendarList } from '@/components/calendar/CalendarList'
import { Skeleton } from '@/components/ui/skeleton'
import { useEvents } from '@/hooks/useEvents'
import { useCategories } from '@/hooks/useEvents'
import { filterEventsByCategory, type CalendarView } from '@/lib/calendar'
import { cn } from '@/lib/utils'

export function CalendarPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: events, isLoading: eventsLoading } = useEvents({ status: 'published' })
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const view: CalendarView = (searchParams.get('view') as CalendarView) || 'month'
  const dateParam = searchParams.get('date')
  const selectedParam = searchParams.get('selected')

  const [currentDate, setCurrentDate] = useState(() =>
    dateParam ? parseISO(dateParam) : startOfToday()
  )
  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    selectedParam ? parseISO(selectedParam) : null
  )

  useEffect(() => {
    if (!searchParams.get('view') && typeof window !== 'undefined' && window.innerWidth < 768) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('view', 'agenda')
          return next
        },
        { replace: true }
      )
    }
  }, [])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    next.set('date', format(currentDate, 'yyyy-MM-dd'))
    if (selectedDate) {
      next.set('selected', format(selectedDate, 'yyyy-MM-dd'))
    } else {
      next.delete('selected')
    }
    setSearchParams(next, { replace: true })
  }, [currentDate, selectedDate])

  const category = searchParams.get('category') || 'all'
  const filteredEvents = useMemo(
    () => filterEventsByCategory(events || [], category),
    [events, category]
  )

  const handleViewChange = (next: CalendarView) => {
    setSearchParams(
      (prev) => {
        const updated = new URLSearchParams(prev)
        updated.set('view', next)
        return updated
      },
      { replace: true }
    )
  }

  const handleCategoryChange = (slug: string) => {
    setSearchParams(
      (prev) => {
        const updated = new URLSearchParams(prev)
        if (slug === 'all') updated.delete('category')
        else updated.set('category', slug)
        return updated
      },
      { replace: true }
    )
  }

  const handlePrev = () => {
    setCurrentDate((d) => (view === 'week' ? subWeeks(d, 1) : subMonths(d, 1)))
  }

  const handleNext = () => {
    setCurrentDate((d) => (view === 'week' ? addWeeks(d, 1) : addMonths(d, 1)))
  }

  const handleToday = () => {
    setCurrentDate(startOfToday())
    setSelectedDate(null)
  }

  const handleJumpToDate = (date: Date) => {
    setCurrentDate(date)
    setSelectedDate(null)
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate((current) => (current && isSameDay(current, date) ? null : date))
  }

  const isLoading = eventsLoading || categoriesLoading

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-10 w-48 rounded-lg" />
              <Skeleton className="h-10 w-72 rounded-lg" />
            </div>
            <Skeleton className="h-[500px] rounded-xl" />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <CalendarToolbar
                currentDate={currentDate}
                view={view}
                onViewChange={handleViewChange}
                onPrev={view === 'agenda' ? undefined : handlePrev}
                onNext={view === 'agenda' ? undefined : handleNext}
                onToday={handleToday}
                onJumpToDate={handleJumpToDate}
                category={category}
                categories={categories || []}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className={cn('lg:col-span-2', view === 'agenda' && 'lg:col-span-3')}>
                {view === 'month' && (
                  <CalendarMonth
                    events={filteredEvents}
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    onMonthChange={setCurrentDate}
                  />
                )}
                {view === 'week' && (
                  <CalendarWeek
                    events={filteredEvents}
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                  />
                )}
                {view === 'agenda' && <CalendarAgenda events={filteredEvents} />}
              </div>

              {view !== 'agenda' && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">
                    {selectedDate ? 'Events on selected date' : 'Upcoming events'}
                  </h2>
                  <CalendarList events={filteredEvents} selectedDate={selectedDate} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
