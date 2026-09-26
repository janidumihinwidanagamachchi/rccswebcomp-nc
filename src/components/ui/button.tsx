import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }: ButtonProps) {
  const Comp = (asChild ? Slot : 'button') as React.ElementType
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[transform,background-color,color,border-color,box-shadow,opacity] duration-[var(--motion-uniform)] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus active:scale-[0.97] motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-brand text-brand-ink hover:bg-brand/90': variant === 'default',
          'bg-alt text-alt-ink hover:bg-alt/80': variant === 'secondary',
          'border border-field bg-canvas hover:bg-highlight hover:text-highlight-ink': variant === 'outline',
          'hover:bg-highlight hover:text-highlight-ink': variant === 'ghost',
          'bg-danger text-danger-ink hover:bg-danger/90': variant === 'destructive',
          'text-brand underline-offset-4 hover:underline': variant === 'link',
          'h-9 px-4 py-2': size === 'default',
          'h-8 rounded-md px-3 text-xs': size === 'sm',
          'h-10 rounded-md px-8': size === 'lg',
          'h-9 w-9': size === 'icon',
        },
        className
      )}
      {...props}
    />
  )
}

export { Button }
