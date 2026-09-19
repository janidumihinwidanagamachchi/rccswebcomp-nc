import { Link, useNavigate } from 'react-router-dom'
import { Menu, Moon, Sun, Ticket, LayoutDashboard, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme, mobileMenuOpen, setMobileMenuOpen } = useUIStore()
  const { user, profile, isAdmin, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { label: 'Events', href: '/events' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Announcements', href: '/announcements' },
  ]

  if (user) {
    navLinks.push({ label: 'My Tickets', href: '/tickets' })
    navLinks.push({ label: 'Passport', href: '/passport' })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-canvas/80 backdrop-blur-md',
        className
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-ink">
            <Ticket className="h-5 w-5" />
          </div>
          <span>RCCSWebComp-NC</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-quiet-ink transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              aria-label="Admin dashboard"
              className="hidden lg:flex"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Button>
          )}

          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-quiet-ink max-w-[120px] truncate">
                {profile?.full_name || user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth/login')}>
              Sign In
            </Button>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-6 pt-6">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-bold text-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Ticket className="h-6 w-6 text-brand" />
                  RCCSWebComp-NC
                </Link>
                <nav className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-lg font-medium text-quiet-ink hover:text-ink"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                  {isAdmin && (
                    <Button variant="outline" onClick={() => { navigate('/admin'); setMobileMenuOpen(false) }}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  )}
                  {user ? (
                    <Button variant="destructive" onClick={() => { handleSignOut(); setMobileMenuOpen(false) }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button onClick={() => { navigate('/auth/login'); setMobileMenuOpen(false) }}>
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
