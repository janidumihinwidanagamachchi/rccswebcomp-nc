import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { MotionConfig } from 'motion/react'

export function StaticMotionBoundary() {
  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.motion = 'off'
    return () => {
      delete root.dataset.motion
    }
  }, [])

  return (
    <MotionConfig reducedMotion="always">
      <Outlet />
    </MotionConfig>
  )
}
