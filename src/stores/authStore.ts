import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
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
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          set({ user: null, profile: null, isAdmin: false, isLoading: false })
          return
        }
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        get().setAuth({ id: user.id, email: user.email! }, profile)
      },
      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null, isAdmin: false, isLoading: false })
      },
    }),
    {
      name: 'campuspulse-auth',
      partialize: (state) => ({ user: state.user, profile: state.profile, isAdmin: state.isAdmin }),
    }
  )
)
