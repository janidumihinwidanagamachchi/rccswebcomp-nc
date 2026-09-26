import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Ticket,
  Sparkles,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Shell } from '@/components/layout/Shell'
import { MaskedLines } from '@/components/motion/MaskedLines'
import { Reveal } from '@/components/motion/Reveal'
import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { EventGrid } from '@/components/events/EventGrid'
import { Countdown } from '@/components/events/Countdown'
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard'
import { useEvents } from '@/hooks/useEvents'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useAuthStore } from '@/stores/authStore'
import { toDate } from '@/lib/utils'

export function HomePage() {
  const { user, profile } = useAuthStore()
  const { data: events, isLoading: eventsLoading } = useEvents({ status: 'published' })
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements()
  const { data: settings } = useSiteSettings()
  const hero = settings?.hero

  const featuredEvents = events?.filter((e) => e.featured).slice(0, 3) || []
  const upcomingEvents = events?.slice(0, 6) || []
  const latestAnnouncements = announcements?.slice(0, 3) || []

  const now = new Date()
  const nextEvent = events?.find((e) => toDate(e.end_date) >= now)

  return (
    <Shell transition>
      <div className="relative">
        {user ? (
          <section className="container mx-auto px-4 pt-8">
            <Reveal className="flex items-center justify-between gap-4 rounded-lg border bg-panel/60 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <User className="h-4 w-4 shrink-0 text-brand" />
                <p className="truncate text-sm font-medium">
                  Welcome back,{' '}
                  <span className="text-brand">{profile?.full_name || user.email}</span>
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/tickets">My Tickets</Link>
              </Button>
            </Reveal>
          </section>
        ) : (
          <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center overflow-hidden border-b py-12 md:py-16">
            {hero?.backgroundImageUrl && (
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${hero.backgroundImageUrl})` }}
              />
            )}

            <HeroParticles />

            <div className="container relative z-10 mx-auto px-4">
              <div className="mx-auto max-w-4xl text-center">
                <div className="animate-fade-up">
                  <Badge variant="secondary" className="mb-5 rounded-full px-4 py-1.5 text-sm shadow-sm">
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    {hero?.badge || "BTUI'26 Competition Entry"}
                  </Badge>
                  <h1 className="mb-6 text-balance text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
                    <MaskedLines step={0.09}>
                      {hero?.headline ? (
                        hero.headline.split('\n').map((line, idx) => <span key={idx}>{line}</span>)
                      ) : (
                        <>
                          <span>What&apos;s on at school,</span>
                          <span className="text-brand">without the guesswork.</span>
                        </>
                      )}
                    </MaskedLines>
                  </h1>
                  <p
                    className="animate-fade-up mx-auto mb-10 max-w-2xl text-lg text-quiet-ink md:text-xl"
                    style={{ animationDelay: '150ms' }}
                  >
                    {hero?.subtitle ||
                      'See what\u2019s coming up, register in a minute, and keep your QR ticket in your pocket.'}
                  </p>
                  <div
                    className="animate-fade-up flex flex-col justify-center gap-3 sm:flex-row"
                    style={{ animationDelay: '300ms' }}
                  >
                    <Button asChild size="lg" className="shadow-lg shadow-brand/20">
                      <Link to={hero?.primaryCta?.href || '/events'}>
                        {hero?.primaryCta?.label || 'Browse Events'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to={hero?.secondaryCta?.href || '/calendar'}>
                        <CalendarDays className="mr-2 h-5 w-5" />
                        {hero?.secondaryCta?.label || 'View Calendar'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {hero?.showCountdown !== false && nextEvent && (
          <section className="container mx-auto px-4 pt-8">
            <Reveal className="mx-auto max-w-2xl">
              <Card className="border-brand/20 bg-brand/5">
                <CardContent className="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                <div>
                  <p className="text-sm font-medium text-brand">Up next</p>
                  <h2 className="text-xl font-semibold">{nextEvent.title}</h2>
                  <p className="text-sm text-quiet-ink">{nextEvent.short_description}</p>
                </div>
                <Countdown
                  targetDate={nextEvent.start_date}
                  eventEndDate={nextEvent.end_date}
                  registrationOpensAt={nextEvent.registration_opens_at}
                  registrationClosesAt={nextEvent.registration_closes_at}
                  capacity={nextEvent.capacity}
                  registeredCount={nextEvent.registration_count || 0}
                  className="text-right"
                />
              </CardContent>
            </Card>
            </Reveal>
          </section>
        )}

        <section className="container mx-auto px-4 py-16">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Featured Events</h2>
              <p className="text-quiet-ink">Worth planning your week around.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/events">View all</Link>
            </Button>
          </Reveal>
          {eventsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : (
            <Reveal>
              <EventGrid events={featuredEvents.length ? featuredEvents : upcomingEvents.slice(0, 3)} />
            </Reveal>
          )}
        </section>

        <section className="container mx-auto px-4 py-16">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Latest Announcements</h2>
              <p className="text-quiet-ink">Notices and changes from staff.</p>
            </div>
            <Button asChild variant="ghost">
              <Link to="/announcements">View all</Link>
            </Button>
          </Reveal>
          {announcementsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestAnnouncements.map((announcement) => (
                <StaggerItem key={announcement.id}>
                  <AnnouncementCard announcement={announcement} compact />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>

        <section className="container mx-auto px-4 py-16">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Browse Events', desc: "See what's coming up", href: '/events', icon: CalendarDays },
              { label: 'My Tickets', desc: 'Your sign-ups and QR codes', href: '/tickets', icon: Ticket },
              { label: 'Calendar', desc: 'The term at a glance', href: '/calendar', icon: CalendarDays },
              { label: 'Announcements', desc: 'What staff need you to know', href: '/announcements', icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon
              return (
                <StaggerItem key={item.label}>
                  <Card className="h-full">
                    <CardContent className="p-5">
                      <Icon className="mb-3 h-8 w-8 text-brand" />
                      <h3 className="font-semibold">{item.label}</h3>
                      <p className="text-sm text-quiet-ink">{item.desc}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              )
            })}
          </Stagger>
        </section>
      </div>
    </Shell>
  )
}

function HeroParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        const size = 4 + Math.random() * 8
        const left = Math.random() * 100
        const top = Math.random() * 100
        const duration = 4 + Math.random() * 6
        const delay = Math.random() * 4
        return {
          key: i,
          size,
          left,
          top,
          duration,
          delay,
        }
      }),
    []
  )

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.key}
          className="animate-float pointer-events-none absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 'color-mix(in srgb, var(--sport-lime) 40%, transparent)',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  )
}
