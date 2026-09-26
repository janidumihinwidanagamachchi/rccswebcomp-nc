import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { dur, ease } from './tokens'

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
            transition={{ duration: dur.quick, ease: ease.gentle }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
