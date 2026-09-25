import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_OUT } from './ease'

interface CollapseProps {
  show: boolean
  children: React.ReactNode
  className?: string
}

// Opacity-only disclosure: no transform, so sticky descendants keep working.
export function Collapse({ show, children, className }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
