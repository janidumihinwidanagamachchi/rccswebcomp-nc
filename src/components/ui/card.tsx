import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, onMouseMove, ...props }: React.ComponentProps<'div'>) {
  const frame = React.useRef(0)

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
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'card-spotlight card-texture relative overflow-hidden rounded-xl border bg-panel/60 text-panel-ink shadow-sm backdrop-blur-md transition-[transform,box-shadow,background-color,border-color] duration-[var(--motion-uniform)] ease-out hoverable:hover:-translate-y-0.5 hoverable:hover:shadow-xl motion-reduce:transition-none',
        className
      )}
      {...props}
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
