import { useState } from 'react'
import { CheckCircle2, XCircle, Search } from 'lucide-react'
import { Shell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/AdminShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { QRCodeDisplay } from '@/components/tickets/QRCodeDisplay'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useEvents } from '@/hooks/useEvents'
import { useEventRegistrations, useCheckInRegistration } from '@/hooks/useRegistrations'
import { formatDate } from '@/lib/utils'

export function RegistrationsManagerPage() {
  const { data: events, isLoading: eventsLoading } = useEvents({})
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [search, setSearch] = useState('')
  const { data: registrations, isLoading } = useEventRegistrations(selectedEventId || undefined)
  const checkIn = useCheckInRegistration()

  const filtered = (registrations || []).filter((r) => {
    const term = search.toLowerCase()
    return (
      r.attendee_name.toLowerCase().includes(term) ||
      r.ticket_number.toLowerCase().includes(term) ||
      r.attendee_email.toLowerCase().includes(term)
    )
  })

  return (
    <Shell>
      <AdminShell>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Registrations</h1>
          <p className="text-quiet-ink">View attendees and check in tickets.</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-full sm:w-[320px]">
              <SelectValue placeholder={eventsLoading ? 'Loading events...' : 'Select an event'} />
            </SelectTrigger>
            <SelectContent>
              {events?.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-quiet-ink" />
            <Input
              placeholder="Search by name, email, or ticket number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="divide-y">
                {filtered.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold">{registration.attendee_name}</h3>
                        <Badge variant={registration.status === 'attended' ? 'default' : 'secondary'}>
                          {registration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-quiet-ink">
                        {registration.attendee_email} • {registration.ticket_number} •{' '}
                        {formatDate(registration.registered_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{registration.ticket_number}</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col items-center py-4">
                            <QRCodeDisplay value={registration.qr_code_data} size={220} />
                            <p className="mt-4 font-semibold">{registration.attendee_name}</p>
                            <p className="text-sm text-quiet-ink">{registration.event?.title}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {registration.status !== 'attended' ? (
                        <Button
                          size="sm"
                          onClick={() => checkIn.mutate({ id: registration.id, status: 'attended' })}
                          disabled={checkIn.isPending}
                        >
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                          Check In
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => checkIn.mutate({ id: registration.id, status: 'registered' })}
                          disabled={checkIn.isPending}
                        >
                          <XCircle className="mr-2 h-3.5 w-3.5" />
                          Undo
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-quiet-ink">
                {selectedEventId
                  ? 'No registrations found for this event.'
                  : 'Select an event to view registrations.'}
              </div>
            )}
          </CardContent>
        </Card>
      </AdminShell>
    </Shell>
  )
}
