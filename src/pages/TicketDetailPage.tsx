import { useParams, Link } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { QRCodeDisplay } from '@/components/tickets/QRCodeDisplay'
import { Reveal } from '@/components/motion/Reveal'
import { useTicket } from '@/hooks/useRegistrations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, MapPin, Ticket, ArrowLeft, Download } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export function TicketDetailPage() {
  const { ticketNumber } = useParams<{ ticketNumber: string }>()
  const { data: registration, isLoading } = useTicket(ticketNumber || '')

  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="mx-auto h-[500px] max-w-md rounded-xl" />
        </div>
      </Shell>
    )
  }

  if (!registration || !registration.event) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Ticket not found</h1>
          <Button asChild className="mt-4">
            <Link to="/tickets">Back to tickets</Link>
          </Button>
        </div>
      </Shell>
    )
  }

  const event = registration.event

  return (
    <Shell transition>
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/tickets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to tickets
          </Link>
        </Button>

        <Reveal className="mx-auto max-w-md">
        <Card className="overflow-hidden">
          <div className="bg-brand p-6 text-brand-ink">
            <div className="flex items-center gap-2">
              <Ticket className="h-6 w-6" />
              <span className="font-bold tracking-tight">RCCSWebComp-NC Ticket</span>
            </div>
          </div>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <Badge variant={registration.status === 'attended' ? 'default' : 'outline'}>
              {registration.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-quiet-ink">
                <CalendarDays className="h-4 w-4" />
                {formatDateTime(event.start_date)}
              </div>
              <div className="flex items-center gap-2 text-quiet-ink">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-quiet p-6">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-4 animate-pulse rounded-2xl bg-brand/20 blur-2xl print:hidden"
              />
              <div className="relative">
                <QRCodeDisplay value={registration.qr_code_data} size={200} />
              </div>
              <p className="relative mt-4 font-mono text-sm font-medium">{registration.ticket_number}</p>
            </div>

            <div className="text-center text-xs text-quiet-ink">
              <p>Show this at the door.</p>
              <p>Ticket for {registration.attendee_name}</p>
            </div>

            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Print / Save
            </Button>
          </CardContent>
        </Card>
        </Reveal>
      </div>
    </Shell>
  )
}
