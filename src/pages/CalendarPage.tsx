import { useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { CalendarMonth } from '@/components/calendar/CalendarMonth'
import { CalendarList } from '@/components/calendar/CalendarList'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useEvents } from '@/hooks/useEvents'

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { data: events, isLoading } = useEvents({ status: 'published' })

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Event Calendar</h1>
            <p className="text-muted-foreground">Browse all school events by month.</p>
          </div>
          {selectedDate && (
            <Button variant="outline" onClick={() => setSelectedDate(null)}>
              Clear date filter
            </Button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-[500px] rounded-xl" />
            ) : (
              <CalendarMonth
                events={events || []}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            )}
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">
              {selectedDate ? 'Events on selected date' : 'Upcoming events'}
            </h2>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <CalendarList events={events || []} selectedDate={selectedDate} />
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
}
