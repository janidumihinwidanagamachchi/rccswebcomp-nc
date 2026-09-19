import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Shell } from '@/components/layout/Shell'
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
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { EventsManagerPage } from '@/pages/admin/EventsManagerPage'
import { EventFormPage } from '@/pages/admin/EventFormPage'
import { AnnouncementsManagerPage } from '@/pages/admin/AnnouncementsManagerPage'
import { RegistrationsManagerPage } from '@/pages/admin/RegistrationsManagerPage'
import { SettingsPage } from '@/pages/admin/SettingsPage'

function ProtectedRoute({ requireAdmin = false }: { requireAdmin?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth()

  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
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

export function AppRouter() {
  return (
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
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<div className="p-20 text-center">Page not found</div>} />
    </Routes>
  )
}
