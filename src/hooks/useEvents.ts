import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import type { Event, Category } from '@/types'

const EVENTS_KEY = 'events'
const CATEGORIES_KEY = 'categories'

export function useEvents(filters?: { category?: string; status?: string; featured?: boolean }) {
  return useQuery({
    queryKey: [EVENTS_KEY, filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*, category:categories(*), registration_count:registrations(count)')
        .order('start_date', { ascending: true })

      if (filters?.category) {
        query = query.eq('category_id', filters.category)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      } else {
        query = query.in('status', ['published', 'completed'])
      }
      if (filters?.featured) {
        query = query.eq('featured', true)
      }

      const { data, error } = await query
      if (error) throw error

      return (data || []).map((event: any) => ({
        ...event,
        registration_count: event.registration_count?.[0]?.count ?? 0,
      })) as Event[]
    },
  })
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: [EVENTS_KEY, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, category:categories(*), registration_count:registrations(count)')
        .eq('slug', slug)
        .single()

      if (error) throw error
      return {
        ...data,
        registration_count: data.registration_count?.[0]?.count ?? 0,
      } as Event
    },
    enabled: !!slug,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return (data || []) as Category[]
    },
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (event: Partial<Event>) => {
      const payload = {
        ...event,
        slug: event.slug || slugify(event.title || ''),
      }
      const { data, error } = await supabase.from('events').insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...event }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase.from('events').update(event).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] })
    },
  })
}

export function useEventById(id?: string) {
  return useQuery({
    queryKey: [EVENTS_KEY, 'id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, category:categories(*)')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Event
    },
    enabled: !!id,
  })
}
