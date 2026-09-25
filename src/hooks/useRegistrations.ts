import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { type LeaderboardRow } from '@/lib/passport'
import type { Registration, Event } from '@/types'

const REGISTRATIONS_KEY = 'registrations'

// Ambiguous glyphs (I/O/0/1) are excluded so numbers stay readable aloud at
// the gate. Matches the EVT-XXXXXX-XXXX hint on the scanner's input.
const TICKET_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomTicketChars(length: number): string {
  const values = new Uint32Array(length)
  crypto.getRandomValues(values)
  return Array.from(values, (value) => TICKET_ALPHABET[value % TICKET_ALPHABET.length]).join('')
}

function generateTicketNumber(): string {
  return `EVT-${randomTicketChars(6)}-${randomTicketChars(4)}`
}

export function useMyRegistrations() {
  return useQuery({
    queryKey: [REGISTRATIONS_KEY, 'mine'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) return []

      const { data, error } = await supabase
        .from('registrations')
        .select('*, event:events(*, category:categories(*))')
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false })
      if (error) throw error
      return (data || []) as Registration[]
    },
  })
}

export function useEventRegistrations(eventId?: string) {
  return useQuery({
    queryKey: [REGISTRATIONS_KEY, 'event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, event:events(*), profile:profiles(*)')
        .eq('event_id', eventId!)
        .order('registered_at', { ascending: false })
      if (error) throw error
      return (data || []) as Registration[]
    },
    enabled: !!eventId,
  })
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      event,
      userId,
      formData,
    }: {
      event: Event
      userId: string
      formData: { attendeeName: string; attendeeEmail: string; attendeeGrade?: number | null; notes?: string }
    }) => {
      const payload = {
        event_id: event.id,
        user_id: userId,
        attendee_name: formData.attendeeName,
        attendee_email: formData.attendeeEmail,
        attendee_grade: formData.attendeeGrade ?? null,
        notes: formData.notes ?? null,
      }

      let lastError: unknown = null

      for (let attempt = 0; attempt < 4; attempt++) {
        const ticketNumber = generateTicketNumber()
        const qrCodeData = JSON.stringify({
          ticket: ticketNumber,
          event: event.id,
          user: userId,
        })

        const { data, error } = await supabase
          .from('registrations')
          .insert({ ...payload, ticket_number: ticketNumber, qr_code_data: qrCodeData })
          .select()
          .single()

        if (!error) return data as Registration

        lastError = error
        // 23505 is a unique violation: only a ticket_number collision is worth retrying.
        if (error.code !== '23505') break
      }

      throw lastError
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event-registration', variables.event.id, variables.userId] })
    },
  })
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_passport_leaderboard')
      if (error) throw error
      return (data || []) as LeaderboardRow[]
    },
  })
}

export function useCheckInRegistration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'registered' | 'attended' | 'cancelled' }) => {
      const { data, error } = await supabase
        .from('registrations')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Registration
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] })
    },
  })
}

export function useTicket(ticketNumber: string) {
  return useQuery({
    queryKey: [REGISTRATIONS_KEY, 'ticket', ticketNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, event:events(*)')
        .eq('ticket_number', ticketNumber)
        .single()
      if (error) throw error
      return data as Registration
    },
    enabled: !!ticketNumber,
  })
}

export function useVerifyTicket() {
  return useMutation({
    mutationFn: async (ticketNumber: string) => {
      const { data, error } = await supabase.rpc('verify_ticket', { ticket_text: ticketNumber.trim() })
      if (error) throw error

      const row = (
        data as Array<{
          ticket_number: string
          status: string
          event_title: string
          attendee_name: string
        }> | null
      )?.[0]
      if (!row) return null

      const { data: registration, error: lookupError } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('ticket_number', row.ticket_number)
        .single()

      if (lookupError) throw lookupError

      return {
        ...row,
        status: registration?.status ?? row.status,
        registrationId: registration?.id as string | undefined,
      }
    },
  })
}
