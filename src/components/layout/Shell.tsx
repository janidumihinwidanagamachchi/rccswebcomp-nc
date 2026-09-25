import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { PageTransition } from '@/components/motion/PageTransition'

interface ShellProps {
  children: React.ReactNode
  transition?: boolean
}

export function Shell({ children, transition = false }: ShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {transition ? <PageTransition>{children}</PageTransition> : children}
      </main>
      <Footer />
    </div>
  )
}
