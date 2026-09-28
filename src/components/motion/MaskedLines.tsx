import * as React from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { dur, ease } from './tokens'


const container = (step: number, delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: step, delayChildren: delay } },
})

const line: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: dur.deliberate, ease: ease.gentle },
  },
}

interface MaskedLinesProps {
  children: React.ReactNode
  className?: string
  step?: number
  delay?: number
  trigger?: 'mount' | 'inView'
  descender?: number
}

export function MaskedLines({
  children,
  className,
  step = 0.16,
  delay = 0,
  trigger = 'mount',
  descender = 0.16,
}: MaskedLinesProps) {
  const lines = React.Children.toArray(children)
  const triggerProps =
    trigger === 'mount'
      ? { animate: 'visible' as const }
      : { whileInView: 'visible' as const, viewport: { once: true, amount: 0.4 } }

  return (
    <motion.span
      className={className}
      variants={container(step, delay)}
      initial="hidden"
      {...triggerProps}
    >
      {lines.map((child, i) => (
        <span
          key={i}
          className="block overflow-hidden"
          style={{ paddingBottom: `${descender}em`, marginBottom: `-${descender}em` }}
        >
          <motion.span variants={line} className="block will-change-transform">
            {child}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
