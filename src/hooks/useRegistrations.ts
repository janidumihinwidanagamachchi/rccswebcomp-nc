import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { generateTicketNumber } from '@/lib/utils'
import type { Registration, Event } from '@/types'

const REGISTRATIONS_KEY = 'registrations'

export function useMyRegistrations() {
  return useQuery({
    queryKey: [REGISTRATIONS_KEY, 'mine'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, event:events(*)')
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
    mutationFn: async ({ event, userId, formData }: { event: Event; userId: string; formData: any }) => {
      const ticketNumber = generateTicketNumber(event.id)
      const qrCodeData = JSON.stringify({
        ticket: ticketNumber,
        event: event.id,
        user: userId,
      })

      const { data, error } = await supabase
        .from('registrations')
        .insert({
          event_id: event.id,
          user_id: userId,
          ticket_number: ticketNumber,
          qr_code_data: qrCodeData,
          attendee_name: formData.attendeeName,
          attendee_email: formData.attendeeEmail,
          attendee_grade: formData.attendeeGrade || null,
          notes: formData.notes || null,
        })
        .select()
        .single()

      if (error) throw error
      return data as Registration
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATIONS_KEY] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
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
