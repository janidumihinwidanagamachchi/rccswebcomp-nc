import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { dur, ease } from '@/components/motion/tokens'

function Card({ className, onMouseMove, ...props }: React.ComponentProps<'div'>) {
  const frame = React.useRef(0)

  // Two conditions, and the second one is not optional.
  //
  // Motion's whileHover fires on pointerenter, which a tap also produces. On a
  // touch screen that leaves the card stuck in its hovered state after the
  // finger lifts, with no pointerleave coming to undo it. globals.css already
  // defines a `hoverable:` variant that only matches (hover: hover) and
  // (pointer: fine) for exactly this reason; this is the JS equivalent.
  //
  // Reduced motion has to be checked here rather than left to a
  // `motion-reduce:transform-none` class, because Motion writes the hover
  // transform as an inline style and an inline style outranks any class rule.
  // Verified: with the preference set, the card lifted 4px regardless.
  //
  // Deliberately NOT a global `transform: none !important` in the reduced-motion
  // media query: the switch thumb reaches its "on" position with a translateX,
  // which is position rather than animation, and that would collapse it to the
  // left.
  const [canHover, setCanHover] = React.useState(false)
  React.useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setCanHover(fine.matches && !calm.matches)
    sync()
    fine.addEventListener('change', sync)
    calm.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      calm.removeEventListener('change', sync)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!frame.current) {
      const el = event.currentTarget
      const { clientX, clientY } = event
      frame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${clientX - rect.left}px`)
        el.style.setProperty('--my', `${clientY - rect.top}px`)
        frame.current = 0
      })
    }
    onMouseMove?.(event)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      // Hover motion, not entrance motion. That distinction matters: most cards
      // in the app already sit inside a Reveal or Stagger, and adding an inner
      // entrance would double up — the wrapper's whileInView and an inner one
      // fire at different scroll thresholds and visibly tear. whileHover is
      // orthogonal to all of that, so it is safe on a wrapped card.
      whileHover={canHover ? { y: -4 } : undefined}
      transition={{ duration: dur.uniform, ease: ease.gentle }}
      className={cn(
        'card-spotlight card-texture relative overflow-hidden rounded-xl border bg-panel/60 text-panel-ink shadow-sm backdrop-blur-md hoverable:hover:shadow-xl motion-reduce:transform-none',
        className
      )}
      {...(props as React.ComponentProps<typeof motion.div>)}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-quiet-ink', className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
