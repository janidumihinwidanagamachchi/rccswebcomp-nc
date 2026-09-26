import * as React from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { motion } from 'motion/react'
import { dur, ease } from './tokens'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation()
  const navigationType = useNavigationType()

  React.useEffect(() => {
    if (navigationType !== 'PUSH') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.key, navigationType])

  // No useReducedMotion branch: MotionConfig reducedMotion="user" in Providers
  // already suppresses this, and the old early-return swapped <motion.div> for
  // <div>, remounting the page subtree on a preference change.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: dur.uniform, ease: ease.gentle }}
    >
      {children}
    </motion.div>
  )
}
