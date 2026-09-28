import { CalendarPlus, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadICS, googleCalendarUrl } from '@/lib/calendar'
import type { Event } from '@/types'

interface AddToCalendarProps {
  event: Event
  variant?: 'default' | 'outline'
  size?: 'sm' | 'default'
}

export function AddToCalendar({ event, variant = 'outline', size = 'sm' }: AddToCalendarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant={variant} size={size} onClick={() => downloadICS(event)}>
        <CalendarPlus className="mr-2 h-4 w-4" />
        Add to calendar
      </Button>
      <Button variant={variant} size={size} asChild>
        <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Google Calendar
        </a>
      </Button>
    </div>
  )
}
