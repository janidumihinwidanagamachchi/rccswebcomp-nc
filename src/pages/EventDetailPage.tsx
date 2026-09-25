import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'motion/react'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Countdown } from '@/components/events/Countdown'
import { Reveal } from '@/components/motion/Reveal'
import { EASE_OUT } from '@/components/motion/ease'
import { HighlightComposer } from '@/components/announcements/HighlightComposer'
import { HighlightCard } from '@/components/announcements/HighlightCard'
import { AddToCalendar } from '@/components/calendar/AddToCalendar'
import { useEvent } from '@/hooks/useEvents'
import { useRegisterForEvent } from '@/hooks/useRegistrations'
import { useHighlights } from '@/hooks/useHighlights'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { registrationSchema, type RegistrationFormData } from '@/lib/validators'
import { formatDateTime, isRegistrationOpen, toDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuthStore()
  const { data: event, isLoading } = useEvent(slug || '')
  const { data: existingRegistration } = useQuery({
    queryKey: ['event-registration', event?.id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', event!.id)
        .eq('user_id', user!.id)
        .single()
      if (error) return null
      return data
    },
    enabled: !!event && !!user,
  })
  const { data: highlights } = useHighlights(event?.id)
  const register = useRegisterForEvent()
  const [submitted, setSubmitted] = useState(false)

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as any,
    defaultValues: {
      attendeeName: profile?.full_name || '',
      attendeeEmail: user?.email || '',
      attendeeGrade: profile?.grade || undefined,
    },
  })

  useEffect(() => {
    reset((values) => ({
      ...values,
      attendeeName: profile?.full_name || '',
      attendeeEmail: user?.email || '',
      attendeeGrade: profile?.grade || undefined,
    }))
  }, [profile, user, reset])

  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="mb-4 h-8 w-32" />
          <Skeleton className="mb-4 h-12 w-2/3" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </Shell>
    )
  }

  if (!event) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Button asChild className="mt-4">
            <Link to="/events">Back to events</Link>
          </Button>
        </div>
      </Shell>
    )
  }

  const registrationOpen = isRegistrationOpen(
    event.registration_opens_at,
    event.registration_closes_at,
    event.capacity,
    event.registration_count || 0
  )

  const onSubmit = async (data: RegistrationFormData) => {
    if (!user || !registrationOpen) return
    await register.mutateAsync({ event, userId: user.id, formData: data })
    setSubmitted(true)
  }

  const isHappeningNow = toDate(event.start_date) <= new Date() && toDate(event.end_date) >= new Date()

  return (
    <Shell transition>
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="animate-fade-up">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{event.category?.name}</Badge>
                {event.featured && <Badge>Featured</Badge>}
                {isHappeningNow && (
                  <Badge className="bg-emerald-500 text-white">Happening Now</Badge>
                )}
              </div>
              <h1 className="mb-4 text-3xl font-bold md:text-5xl">{event.title}</h1>
              <p className="mb-6 text-lg text-quiet-ink">{event.short_description}</p>

              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">{event.description}</p>
              </div>

              <Separator className="my-8" />

              {/* Live Highlights Feed */}
              <div>
                <h2 className="mb-4 text-2xl font-bold">Live updates</h2>
                {user && isHappeningNow && <HighlightComposer eventId={event.id} />}
                <div className="mt-4 space-y-4">
                  {highlights && highlights.length > 0 ? (
                    highlights.map((highlight) => (
                      <HighlightCard key={highlight.id} highlight={highlight} />
                    ))
                  ) : (
                    <p className="text-sm text-quiet-ink">No updates posted yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Reveal>
            <Card>
              <CardContent className="p-5">
                <Countdown
                  targetDate={event.start_date}
                  eventEndDate={event.end_date}
                  registrationOpensAt={event.registration_opens_at}
                  registrationClosesAt={event.registration_closes_at}
                  capacity={event.capacity}
                  registeredCount={event.registration_count || 0}
                  className="mb-6"
                />
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-quiet-ink" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-quiet-ink">{formatDateTime(event.start_date)}</p>
                      <p className="text-quiet-ink">to {formatDateTime(event.end_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-quiet-ink" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-quiet-ink">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-4 w-4 text-quiet-ink" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-quiet-ink">
                        {event.registration_count || 0} registered
                        {event.capacity ? ` / ${event.capacity} spots` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t">
                  <p className="mb-2 text-sm font-medium">Add to calendar</p>
                  <AddToCalendar event={event} />
                </div>
              </CardContent>
            </Card>
            </Reveal>

            {/* Registration Form */}
            <Reveal delay={0.08}>
            <Card>
              <CardHeader>
                <CardTitle>Register for this event</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait" initial={false}>
                  {!user ? (
                    <motion.div
                      key="signed-out"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="text-center"
                    >
                      <p className="mb-4 text-sm text-quiet-ink">
                        Sign in to register and get your ticket.
                      </p>
                      <Button asChild className="w-full">
                        <Link to="/auth/login">Sign In</Link>
                      </Button>
                    </motion.div>
                  ) : submitted || (existingRegistration && existingRegistration.status !== 'cancelled') ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className="text-center"
                    >
                      <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
                      <p className="font-semibold">You&apos;re registered!</p>
                      <p className="mb-4 text-sm text-quiet-ink">
                        Your ticket is waiting in My Tickets.
                      </p>
                      <Button asChild className="w-full">
                        <Link to="/tickets">View My Tickets</Link>
                      </Button>
                    </motion.div>
                  ) : !registrationOpen ? (
                    <motion.div
                      key="closed"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="flex items-start gap-3 rounded-lg bg-quiet p-3 text-sm"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 text-quiet-ink" />
                      <p className="text-quiet-ink">
                        Registration is closed, or the event is full.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <Label htmlFor="attendeeName">Full name</Label>
                        <Input id="attendeeName" {...formRegister('attendeeName')} />
                        {errors.attendeeName && (
                          <p className="text-xs text-danger">{errors.attendeeName.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="attendeeEmail">Email</Label>
                        <Input id="attendeeEmail" type="email" {...formRegister('attendeeEmail')} />
                        {errors.attendeeEmail && (
                          <p className="text-xs text-danger">{errors.attendeeEmail.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="attendeeGrade">Grade (optional)</Label>
                        <Input id="attendeeGrade" type="number" {...formRegister('attendeeGrade')} />
                        {errors.attendeeGrade && (
                          <p className="text-xs text-danger">{errors.attendeeGrade.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Textarea id="notes" {...formRegister('notes')} />
                      </div>
                      {register.isError && (
                        <p className="text-sm text-danger">
                          {(register.error as Error)?.message || 'Registration failed. You may already be registered.'}
                        </p>
                      )}
                      <Button type="submit" className="w-full" disabled={register.isPending}>
                        {register.isPending ? 'Registering...' : 'Get My Ticket'}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </Shell>
  )
}
