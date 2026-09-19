import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'

const GLOW_SIZE = 700
const REVEAL_RADIUS = 420

export function CursorGlow() {
  const [enabled, setEnabled] = React.useState(false)
  const centerRef = React.useRef({ x: 0, y: 0 })

  const rawX = useMotionValue(-GLOW_SIZE)
  const rawY = useMotionValue(-GLOW_SIZE)
  const x = useSpring(rawX, { stiffness: 140, damping: 24, mass: 0.45 })
  const y = useSpring(rawY, { stiffness: 140, damping: 24, mass: 0.45 })

  const gridMask = useMotionTemplate`radial-gradient(${REVEAL_RADIUS}px circle at ${x}px ${y}px, #000 0%, #000 35%, transparent 78%)`

  const orbAX = useTransform(x, (v) => (v - centerRef.current.x) * 0.04)
  const orbAY = useTransform(y, (v) => (v - centerRef.current.y) * 0.04)
  const orbBX = useTransform(x, (v) => (v - centerRef.current.x) * -0.03)
  const orbBY = useTransform(y, (v) => (v - centerRef.current.y) * -0.03)

  React.useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return

    const updateCenter = () => {
      centerRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    }
    updateCenter()

    const centerX = centerRef.current.x
    const centerY = centerRef.current.y
    rawX.set(centerX)
    rawY.set(centerY)
    x.set(centerX)
    y.set(centerY)

    const handleMove = (event: MouseEvent) => {
      rawX.set(event.clientX)
      rawY.set(event.clientY)
    }

    setEnabled(true)
    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('resize', updateCenter)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('resize', updateCenter)
    }
  }, [rawX, rawY, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed -z-10"
        style={{
          x: orbAX,
          y: orbAY,
          top: '-12%',
          left: '-8%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at center, color-mix(in srgb, var(--accent) 20%, transparent), transparent 68%)',
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed -z-10"
        style={{
          x: orbBX,
          y: orbBY,
          bottom: '-14%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at center, color-mix(in srgb, var(--primary) 16%, transparent), transparent 68%)',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 -z-10 rounded-full"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          marginLeft: -GLOW_SIZE / 2,
          marginTop: -GLOW_SIZE / 2,
          x,
          y,
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--accent) 18%, transparent), color-mix(in srgb, var(--primary) 8%, transparent) 52%, transparent 74%)',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="cursor-grid pointer-events-none fixed inset-0 -z-10"
        style={{ maskImage: gridMask, WebkitMaskImage: gridMask }}
      />
    </>
  )
}
