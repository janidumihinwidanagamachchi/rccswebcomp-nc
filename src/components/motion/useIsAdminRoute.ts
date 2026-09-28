import { useLocation } from 'react-router-dom'

export function useIsAdminRoute() {
  return useLocation().pathname.startsWith('/admin')
}
