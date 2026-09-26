import * as React from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { dur, ease, viewport, rise } from './tokens'

function container(stagger: number, delay: number): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: rise.md },
  show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.gentle } },
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
}

/**
 * Reveals direct children one after another as the group enters the viewport.
 *
 * `stagger` is the gap between items starting, not their duration, so raising it
 * lengthens the sequence without making any single item slower.
 *
 * No useReducedMotion branch — MotionConfig reducedMotion="user" covers it, and
 * the old early-return remounted the subtree on a preference change.
 */
export function Stagger({ children, className, stagger = 0.06, delay = 0 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: viewport.once, margin: viewport.margin }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}
