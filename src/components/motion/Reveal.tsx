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
   * How much this should feel like it is settling into place. Drives duration
   * and travel together, so a card and a hero panel do not end up identical
   * because both are "reveals".
   */
  scale?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * A single element rising into place on scroll.
 *
 * No useReducedMotion branch: MotionConfig reducedMotion="user" in Providers
 * already covers it, and swapping <motion.div> for <div> on a preference change
 * would remount the subtree.
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
