import * as React from 'react'
import { Calendar } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { dur, ease } from '@/components/motion/tokens'

interface EventCoverProps {
  src: string | null | undefined
  alt: string
  className?: string
}

export function EventCover({ src, alt, className }: EventCoverProps) {
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    setFailed(false)
  }, [src])

    const settle = {
      initial: { opacity: 0, scale: 1.03 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: dur.slow, ease: ease.gentle },
    }

    if (!src || failed) {
      return (
        <motion.div
          {...settle}
          className={cn(
            'flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5',
            className
          )}
        >
          <Calendar className="h-10 w-10 text-brand/40" />
        </motion.div>
      )
    }

    return (
      <motion.img
        {...settle}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', className)}
      />
    )
}
