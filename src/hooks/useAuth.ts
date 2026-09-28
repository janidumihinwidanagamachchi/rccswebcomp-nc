import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/queryClient'

export function useAuth() {
  const { user, profile, isLoading, isAdmin, refreshProfile, signOut } = useAuthStore()

  useEffect(() => {
    refreshProfile()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setTimeout(() => refreshProfile(), 0)
      } else {
        useAuthStore.getState().setAuth(null, null)
        queryClient.clear()
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [refreshProfile])

  return { user, profile, isLoading, isAdmin, signOut }
}
