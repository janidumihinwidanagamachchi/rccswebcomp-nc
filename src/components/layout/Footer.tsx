import { Link } from 'react-router-dom'
import { Ticket, Heart } from 'lucide-react'
import { useSiteSettings } from '@/hooks/useSiteSettings'

export function Footer() {
  const { data: settings } = useSiteSettings()
  const contactEmail = settings?.brand.contactEmail?.trim()

  return (
    <footer className="border-t bg-canvas/80 backdrop-blur-md py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Ticket className="h-5 w-5 text-brand" />
            {settings?.brand.name || 'RCCSWebComp-NC'}
          </Link>
          <div className="text-center text-sm text-quiet-ink md:text-left">
            <p>Events, tickets, and announcements for one school.</p>
            {contactEmail && (
              <p>
                Questions?{' '}
                <a className="hover:text-ink hover:underline" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
            )}
          </div>
          <p className="flex items-center gap-1 text-sm text-quiet-ink">
            Made with <Heart className="h-4 w-4 animate-heartbeat text-rose-500" /> for BTUI&apos;26
          </p>
        </div>
      </div>
    </footer>
  )
}
