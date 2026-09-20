import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Announcement } from '@/types'

const ANNOUNCEMENTS_KEY = 'announcements'

export function useAnnouncements({ admin = false }: { admin?: boolean } = {}) {
  return useQuery({
    queryKey: [ANNOUNCEMENTS_KEY, { admin }],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select('*, category:categories(*), event:events(id,title,slug)')
        .order('published_at', { ascending: false })

      if (!admin) {
        query = query
          .lte('published_at', new Date().toISOString())
          .or('expires_at.is.null,expires_at.gt.now()')
      }

      const { data, error } = await query
      if (error) throw error
      return (data || []) as Announcement[]
    },
  })
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (announcement: Partial<Announcement>) => {
      const { data, error } = await supabase.from('announcements').insert(announcement).select().single()
      if (error) throw error
      return data as Announcement
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] })
    },
  })
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...announcement }: Partial<Announcement> & { id: string }) => {
      const { data, error } = await supabase.from('announcements').update(announcement).eq('id', id).select().single()
      if (error) throw error
      return data as Announcement
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] })
    },
  })
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANNOUNCEMENTS_KEY] })
    },
  })
}
