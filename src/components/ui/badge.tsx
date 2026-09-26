import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { spring } from '@/components/motion/tokens'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <motion.div
      // Spring rather than a tween: a press reads better as the badge being
      // pushed and released, which a CSS transition cannot express.
      whileTap={{ scale: 0.95 }}
      transition={spring.snappy}
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 motion-reduce:transform-none',
        {
          'border-transparent bg-brand text-brand-ink hover:bg-brand/80': variant === 'default',
          'border-transparent bg-alt text-alt-ink hover:bg-alt/80': variant === 'secondary',
          'text-ink': variant === 'outline',
          'border-transparent bg-danger text-danger-ink hover:bg-danger/80': variant === 'destructive',
        },
        className
      )}
      {...(props as React.ComponentProps<typeof motion.div>)}
    />
  )
}

export { Badge }
