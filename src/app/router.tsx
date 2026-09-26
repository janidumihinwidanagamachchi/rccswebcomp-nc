import * as React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Shell } from '@/components/layout/Shell'
import { AnimatedErrorBoundary } from '@/components/ErrorBoundary'
import { HomePage } from '@/pages/HomePage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { AnnouncementsPage } from '@/pages/AnnouncementsPage'
import { TicketsPage } from '@/pages/TicketsPage'
import { TicketDetailPage } from '@/pages/TicketDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { PassportPage } from '@/pages/PassportPage'

const AdminDashboardPage = React.lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
)
const EventsManagerPage = React.lazy(() =>
  import('@/pages/admin/EventsManagerPage').then((m) => ({ default: m.EventsManagerPage }))
)
const EventFormPage = React.lazy(() =>
  import('@/pages/admin/EventFormPage').then((m) => ({ default: m.EventFormPage }))
)
const AnnouncementsManagerPage = React.lazy(() =>
  import('@/pages/admin/AnnouncementsManagerPage').then((m) => ({ default: m.AnnouncementsManagerPage }))
)
const RegistrationsManagerPage = React.lazy(() =>
  import('@/pages/admin/RegistrationsManagerPage').then((m) => ({ default: m.RegistrationsManagerPage }))
)
const TicketValidatePage = React.lazy(() =>
  import('@/pages/admin/TicketValidatePage').then((m) => ({ default: m.TicketValidatePage }))
)
const SettingsPage = React.lazy(() =>
  import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)

function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth()

  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-quiet-ink">Loading...</p>
        </div>
      </Shell>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function AdminFallback() {
  return (
    <Shell>
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-quiet-ink">Loading admin...</p>
      </div>
    </Shell>
  )
}

export function AppRouter() {
  return (
        <AnimatedErrorBoundary>
      <React.Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/ticket/:ticketNumber" element={<TicketDetailPage />} />
            <Route path="/passport" element={<PassportPage />} />
          </Route>

          {/* Auth routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/events" element={<EventsManagerPage />} />
            <Route path="/admin/events/new" element={<EventFormPage />} />
            <Route path="/admin/events/:id/edit" element={<EventFormPage />} />
            <Route path="/admin/announcements" element={<AnnouncementsManagerPage />} />
            <Route path="/admin/registrations" element={<RegistrationsManagerPage />} />
            <Route path="/admin/validate" element={<TicketValidatePage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<div className="p-20 text-center">Page not found</div>} />
        </Routes>
      </React.Suspense>
        </AnimatedErrorBoundary>
  )
}
