import { useAuth } from '@/hooks/useAuth'
import { AppRouter } from './router'

function App() {
  useAuth()
  return <AppRouter />
}

export default App
