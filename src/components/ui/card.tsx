import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { dur, ease } from '@/components/motion/tokens'

function Card({ className, onMouseMove, ...props }: React.ComponentProps<'div'>) {
  const frame = React.useRef(0)

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
