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

  // No useReducedMotion() branch: MotionConfig reducedMotion="user" in
  // Providers already suppresses the transition. The old early-return swapped
  // <motion.div> for <div>, remounting the whole page subtree if the visitor
  // changed the OS setting while the site was open.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: dur.quick, ease: ease.gentle }}
    >
      {children}
    </motion.div>
  )
}
