import * as React from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { dur, ease } from './tokens'

/**
 * Masked line reveal, for a headline that is already split into lines.
 *
 * WHY IT TAKES CHILDREN RATHER THAN A STRING. The obvious implementation takes
 * the headline text and splits it into words itself. That would be wrong here:
 * the hero headline is admin-editable, arrives from site settings, and its
 * second line is a <span> carrying the brand colour. Re-parsing the string would
 * throw that away and rebuild it as flat text. This wraps whatever line
 * elements it is given and never inspects their contents, so the brand span, any
 * future markup, and the settings-driven line count all survive untouched.
 *
 * WHY NOT THE <noscript> FALLBACK a server-rendered page needs. Motion applies
 * its initial state after the HTML has painted, which on an SSR page means the
 * heading is briefly visible, then hidden, then animated in — hence a CSS
 * pre-hide plus a <noscript> override. This is a client-rendered SPA: the first
 * paint already has the initial state applied, so there is no flash and no
 * JS-disabled case to rescue. Adding the workaround here would be cargo cult.
 *
 * DESCENDERS. globals.css forces h1-h6 to var(--font-serif), and the hero sets
 * leading-[1.1]. An overflow:hidden mask therefore cuts through any glyph that
 * paints below the line box, and this headline has plenty: "school" and
 * "guesswork" both have descenders.
 *
 * The allowance has to be in em, not a hardcoded pixel value, because
 * --font-serif is not knowable at build time. globals.css defaults it to
 * "Shippori Mincho B1", but index.html and inject-theme.mjs both overwrite it
 * from the active theme at runtime, and the theme in use here resolves it to
 * Inter. Inter's ascent+descent is roughly 1.21em against a 1.1em line box, so
 * its descenders sit about 4px outside the box at the hero's 72px — a number
 * that would be wrong again at any other size or theme. An em value travels.
 *
 * The extra bottom padding is what stops the shear; the matching negative
 * margin gives it back, so a masked heading occupies exactly the same space as
 * an unmasked one and the rhythm below it does not shift.
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
  /**
   * Seconds between consecutive lines starting. Needs to grow with the
   * duration: at 0.09s against a 1.9s line the second line begins while the
   * first is 5% done, so the two read as a single movement rather than a
   * sequence. 0.16s keeps the cascade legible.
   */
  step?: number
  /** Seconds before the first line starts. */
  delay?: number
  /**
   * 'mount' for anything above the fold — a hero should animate on arrival, not
   * wait to be scrolled to. 'inView' for a heading further down the page.
   */
  trigger?: 'mount' | 'inView'
  /** Bottom breathing room for descenders, in em. */
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
