import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'
import type { Profile } from '@/types'

interface AuthState {
  user: { id: string; email: string } | null
  profile: Profile | null
  isLoading: boolean
  isAdmin: boolean
  setAuth: (user: { id: string; email: string } | null, profile: Profile | null) => void
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      isAdmin: false,
      setAuth: (user, profile) =>
        set({
          user,
          profile,
          isAdmin: profile?.role === 'admin',
          isLoading: false,
        }),
      refreshProfile: async () => {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          if (userError) throw userError
          if (!user) {
            set({ user: null, profile: null, isAdmin: false, isLoading: false })
            return
          }

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          if (profileError) throw profileError

          get().setAuth({ id: user.id, email: user.email ?? '' }, profile)
        } catch {
          set({ isLoading: false })
        }
      },
      signOut: async () => {
        try {
          await supabase.auth.signOut()
        } finally {
          queryClient.clear()
          set({ user: null, profile: null, isAdmin: false, isLoading: false })
        }
      },
    }),
    {
      name: 'rccswebcomp-auth',
      version: 1,
      partialize: (state) => ({ user: state.user, profile: state.profile, isAdmin: state.isAdmin }),
    }
  )
)
