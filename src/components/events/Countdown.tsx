import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { intervalToDuration, isFuture, isPast } from 'date-fns'
import { cn, toDate } from '@/lib/utils'
import { spring } from '@/components/motion/tokens'

interface CountdownProps {
  targetDate: string | Date
  eventEndDate?: string | Date
  registrationOpensAt?: string | Date
  registrationClosesAt?: string | Date
  capacity?: number | null
  registeredCount?: number
  className?: string
}

export function Countdown({
  targetDate,
  eventEndDate,
  registrationOpensAt,
  registrationClosesAt,
  capacity,
  registeredCount = 0,
  className,
}: CountdownProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const start = toDate(targetDate)
  const end = eventEndDate ? toDate(eventEndDate) : start

  let label = 'Event starts in'
  let target = start

  if (registrationOpensAt && isFuture(toDate(registrationOpensAt))) {
    label = 'Registration opens in'
    target = toDate(registrationOpensAt)
  } else if (isFuture(start)) {
    if (registrationClosesAt && isFuture(toDate(registrationClosesAt))) {
      label = 'Registration closes in'
      target = toDate(registrationClosesAt)
    } else {
      label = 'Event starts in'
      target = start
    }
  } else if (isPast(start) && isFuture(end)) {
    label = 'Happening now'
    target = end
  } else if (isPast(end)) {
    label = 'Event ended'
  }

  const duration = intervalToDuration({ start: now, end: target > now ? target : now })
  const isFull = capacity !== null && capacity !== undefined && registeredCount >= capacity

  if (label === 'Event ended') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-quiet-ink', className)}>
        <span className="h-2 w-2 rounded-full bg-slate-400" />
        Event has ended
      </div>
    )
  }

  if (label === 'Happening now') {
    return (
      <div className={cn('flex items-center gap-2 text-sm font-medium text-emerald-500', className)}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Happening now
      </div>
    )
  }

  const blocks = [
    { value: duration.days || 0, label: 'Days' },
    { value: duration.hours || 0, label: 'Hrs' },
    { value: duration.minutes || 0, label: 'Min' },
    { value: duration.seconds || 0, label: 'Sec' },
  ]

    return (
      <div className={cn('space-y-1', className)}>
        <p className="text-xs font-medium text-quiet-ink">{label}</p>
        <div className="flex items-center gap-2">
          {blocks.map((block, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Keyed on the value so only the block that actually changed
                  animates. Animating all four every second would be noise, and
                  at dur.uniform it would be four simultaneous 700ms movements
                  competing with each other. The seconds block ticks, the rest
                  sit still. */}
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-quiet text-sm font-bold">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={block.value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={spring.snappy}
                    className="tabular-nums"
                  >
                    {String(block.value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] text-quiet-ink">{block.label}</span>
            </div>
          ))}
        </div>
        {isFull && <p className="text-xs font-medium text-red-500">Sold out</p>}
      </div>
    )
}
