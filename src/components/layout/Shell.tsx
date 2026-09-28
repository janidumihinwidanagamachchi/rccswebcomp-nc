import { useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PageTransition } from '@/components/motion/PageTransition'
import { SportBackground } from '@/components/motion/SportBackground'

interface ShellProps {
  children: React.ReactNode
  transition?: boolean
}

export function Shell({ children, transition = false }: ShellProps) {
  const { pathname } = useLocation()
  const showSportBackdrop = !pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen flex-col">
      {showSportBackdrop && <SportBackground />}
      <Navbar />
      <main className="flex-1">
        {transition ? <PageTransition>{children}</PageTransition> : children}
      </main>
      <Footer />
    </div>
  )
}
