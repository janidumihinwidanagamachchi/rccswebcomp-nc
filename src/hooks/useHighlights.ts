import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Highlight } from '@/types'

const HIGHLIGHTS_KEY = 'highlights'

export function useHighlights(eventId?: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [HIGHLIGHTS_KEY, eventId || 'all'],
    queryFn: async () => {
      let q = supabase
        .from('highlights')
        .select('*, event:events(id,title,slug), author:profiles(full_name)')
        .order('created_at', { ascending: false })

      if (eventId) {
        q = q.eq('event_id', eventId)
      }

      const { data, error } = await q
      if (error) throw error
      return (data || []) as Highlight[]
    },
  })

  useEffect(() => {
    const channel = supabase
      .channel('highlights')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'highlights' },
        () => {
          queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient, eventId])

  return query
}

export function useCreateHighlight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (highlight: Partial<Highlight>) => {
      const { data, error } = await supabase.from('highlights').insert(highlight).select().single()
      if (error) throw error
      return data as Highlight
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] })
    },
  })
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('highlights').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_KEY] })
    },
  })
}
