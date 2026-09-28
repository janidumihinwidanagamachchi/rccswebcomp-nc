import * as React from 'react'
import { motion } from 'motion/react'
import { dur, ease, viewport, rise } from './tokens'

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
  scale?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  y,
  once = viewport.once,
  scale = 'md',
  disabled = false,
}: RevealProps) {
  const distance = y ?? rise[scale]

  return (
    <motion.div
      className={className}
      initial={disabled ? false : { opacity: 0, y: distance }}
      whileInView={disabled ? undefined : { opacity: 1, y: 0 }}
      viewport={disabled ? undefined : { once, margin: viewport.margin }}
      transition={disabled ? undefined : { duration: dur.base, ease: ease.gentle, delay }}
    >
      {children}
    </motion.div>
  )
}
