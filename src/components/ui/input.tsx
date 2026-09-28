import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {}

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-lg border border-field bg-transparent px-3 py-1 text-sm shadow-sm transition-colors duration-[var(--motion-uniform)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-quiet-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Input }
