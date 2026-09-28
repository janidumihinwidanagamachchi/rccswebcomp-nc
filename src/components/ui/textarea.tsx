import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.ComponentProps<'textarea'> {}

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-field bg-transparent px-3 py-2 text-sm shadow-sm transition-colors duration-[var(--motion-uniform)] placeholder:text-quiet-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
