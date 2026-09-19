import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const { user, profile, isLoading, isAdmin, refreshProfile, signOut } = useAuthStore()

  useEffect(() => {
    refreshProfile()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        refreshProfile()
      } else {
        useAuthStore.getState().setAuth(null, null)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [refreshProfile])

  return { user, profile, isLoading, isAdmin, signOut }
}
