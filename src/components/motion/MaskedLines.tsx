import * as React from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { dur, ease } from './tokens'

/**
 * Takes line elements as children, not a string: the second hero line is a
 * brand-coloured span, so re-parsing the text would flatten that markup.
 *
 * `descender` is in em because --font-serif is set at runtime, so its metrics
 * are not knowable at build time. Leading-[1.1] is tighter than most fonts'
 * ascent+descent and would shear descenders off without it.
 */

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
  /** Seconds between lines starting. Needs to grow with `dur.deliberate` or the lines read as one movement. */
  step?: number
  /** Seconds before the first line starts. */
  delay?: number
  /** 'mount' for above-the-fold, 'inView' for further down the page. */
  trigger?: 'mount' | 'inView'
  /** Descender clearance in em. */
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
