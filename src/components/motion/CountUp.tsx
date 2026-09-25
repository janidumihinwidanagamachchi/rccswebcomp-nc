import * as React from 'react'
import { animate, useReducedMotion } from 'motion/react'
import { EASE_OUT } from './ease'

interface CountUpProps {
  value: number
  duration?: number
  className?: string
}

export function CountUp({ value, duration = 0.9, className }: CountUpProps) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = React.useState(reduce ? value : 0)

  React.useEffect(() => {
    if (reduce) {
      setDisplay(value)
      return
    }

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(latest),
    })

    return () => controls.stop()
  }, [value, duration, reduce])

  return <span className={className}>{Math.round(display)}</span>
}
