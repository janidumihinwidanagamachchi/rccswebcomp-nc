import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { dur, ease } from '@/components/motion/tokens'

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

/** Shared by both render paths so the press reads identically either way. */
const press = {
  whileTap: { scale: 0.97 },
  transition: { duration: dur.uniform, ease: ease.gentle },
}

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium',
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
  )

  // asChild renders through Radix's Slot, which merges these props onto its
  // single child — usually a react-router <Link>, i.e. a plain <a>. Motion
  // props like whileTap are meaningless to a plain <a>: it ignores them
  // silently, so a naive conversion would drop the press animation on exactly
  // the buttons you notice most, including both hero CTAs.
  //
  // So the asChild path keeps the CSS press, which the child honours, and only
  // the real <button> path uses Motion. Converting the link call sites to
  // motion.a is the proper follow-up, but it touches every <Button asChild> in
  // the app and is a larger change than this one.
  if (asChild) {
    return (
      <Slot
        className={cn(
          classes,
          'cursor-pointer transition-[transform,background-color,color,border-color,box-shadow,opacity] duration-[var(--motion-uniform)] active:scale-[0.97] motion-reduce:transition-none'
        )}
        {...props}
      />
    )
  }

  return (
    <motion.button
      className={cn(
        classes,
        'transition-[background-color,color,border-color,box-shadow,opacity] duration-[var(--motion-uniform)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50'
      )}
      {...press}
      {...(props as React.ComponentProps<typeof motion.button>)}
    />
  )
}

export { Button }
