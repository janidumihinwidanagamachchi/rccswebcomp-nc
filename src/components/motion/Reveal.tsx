import * as React from 'react'
import { motion } from 'motion/react'
import { dur, ease, viewport, rise } from './tokens'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
  /**
   * How much this element should feel like it is settling into place. Drives
   * both the duration and the default travel distance, so a card and a hero
   * panel do not end up with the same 0.5s/18px because they were both
   * "reveals".
   */
  scale?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * A single element rising into place on scroll.
 *
 * Note there is no `useReducedMotion()` branch here. It used to early-return a
 * plain <div> when the preference was set, on the assumption that Motion would
 * otherwise animate anyway. It does not: Providers already sets
 * `<MotionConfig reducedMotion="user">`, which covers every Motion component in
 * the tree. The branch was not only redundant, it was harmful — swapping
 * <motion.div> for <div> changes the element type, so toggling the OS setting
 * mid-session remounted the subtree and threw away its state.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y,
  once = viewport.once,
  scale = 'md',
}: RevealProps) {
  const distance = y ?? rise[scale]

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: viewport.margin }}
      transition={{ duration: dur.base, ease: ease.gentle, delay }}
    >
      {children}
    </motion.div>
  )
}
