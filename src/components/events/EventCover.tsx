import * as React from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventCoverProps {
  src: string | null | undefined
  alt: string
  className?: string
}

// Falls back to the gradient placeholder when there is no photo, and also when
// a stored URL fails to load, so one bad row cannot break a card.
export function EventCover({ src, alt, className }: EventCoverProps) {
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5',
          className
        )}
      >
        <Calendar className="h-10 w-10 text-brand/40" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-cover', className)}
    />
  )
}
