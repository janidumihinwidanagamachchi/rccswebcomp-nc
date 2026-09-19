import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, onMouseMove, ...props }: React.ComponentProps<'div'>) {
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
    onMouseMove?.(event)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'card-spotlight card-texture relative overflow-hidden rounded-xl border bg-panel/60 text-panel-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
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
