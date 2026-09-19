import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, QrCode } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Registration } from '@/types'

interface TicketCardProps {
  registration: Registration
}

export function TicketCard({ registration }: TicketCardProps) {
  const event = registration.event
  if (!event) return null

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 p-5">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary">{event.category?.name || 'Event'}</Badge>
            <Badge variant={registration.status === 'attended' ? 'default' : 'outline'}>
              {registration.status}
            </Badge>
          </div>
          <h3 className="mb-1 text-lg font-semibold">{event.title}</h3>
          <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-quiet-ink">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(event.start_date)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          </div>
          <p className="text-sm font-mono text-quiet-ink">{registration.ticket_number}</p>
        </div>
        <div className="flex items-center justify-center border-t bg-quiet/30 p-5 sm:border-l sm:border-t-0">
          <Button asChild>
            <Link to={`/ticket/${registration.ticket_number}`}>
              <QrCode className="mr-2 h-4 w-4" />
              View Ticket
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
