import * as React from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const reduce = useReducedMotion()

  React.useEffect(() => {
    if (navigationType !== 'PUSH') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.key, navigationType])

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
