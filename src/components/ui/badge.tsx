import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-[transform,background-color,color,border-color] duration-[var(--motion-uniform)] focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 active:scale-95 motion-reduce:transition-none',
        {
          'border-transparent bg-brand text-brand-ink hover:bg-brand/80': variant === 'default',
          'border-transparent bg-alt text-alt-ink hover:bg-alt/80': variant === 'secondary',
          'text-ink': variant === 'outline',
          'border-transparent bg-danger text-danger-ink hover:bg-danger/80': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
