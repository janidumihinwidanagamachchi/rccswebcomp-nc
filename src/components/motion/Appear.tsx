import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_OUT } from './ease'

interface AppearProps {
  show: boolean
  children: React.ReactNode
  className?: string
}

export function Appear({ show, children, className }: AppearProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className={className}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
