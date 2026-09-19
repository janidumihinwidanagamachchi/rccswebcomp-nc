import { Link } from 'react-router-dom'
import { Ticket, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Ticket className="h-5 w-5 text-primary" />
            CampusPulse
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            The modern command center for school events, built for students, teachers, and parents.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-rose-500" /> for BTUI&apos;26
          </p>
        </div>
      </div>
    </footer>
  )
}
