import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Megaphone, ClipboardList, ScanLine, Settings, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Events', href: '/admin/events', icon: CalendarDays },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
  { label: 'Validate', href: '/admin/validate', icon: ScanLine },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col md:flex-row">
      <aside className="w-full border-b bg-quiet/30 md:w-64 md:border-b-0 md:border-r">
        <div className="flex flex-col gap-1 p-4">
          <Link
            to="/"
            className="mb-4 flex items-center gap-2 text-sm font-medium text-quiet-ink hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
          {adminLinks.map((link) => {
            const Icon = link.icon
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand text-brand-ink'
                    : 'text-quiet-ink hover:bg-highlight hover:text-[#c0c0c0]'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
