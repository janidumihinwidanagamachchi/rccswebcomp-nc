import { Shell } from '@/components/layout/Shell'
import { TicketCard } from '@/components/tickets/TicketCard'
import { useMyRegistrations } from '@/hooks/useRegistrations'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Ticket } from 'lucide-react'

export function TicketsPage() {
  const { data: registrations, isLoading } = useMyRegistrations()

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">My Tickets</h1>
          <p className="text-quiet-ink">Your sign-ups and QR tickets.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : registrations && registrations.length > 0 ? (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <TicketCard key={registration.id} registration={registration} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
            <Ticket className="mb-4 h-12 w-12 text-quiet-ink" />
            <h2 className="text-xl font-semibold">No tickets yet</h2>
            <p className="mb-6 text-quiet-ink">
              Sign up for an event and it shows up here.
            </p>
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        )}
      </div>
    </Shell>
  )
}
