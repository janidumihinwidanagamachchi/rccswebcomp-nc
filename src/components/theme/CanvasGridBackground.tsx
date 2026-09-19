import * as React from 'react'

const SPACING = 88
const RADIUS = 520
const MAX_OPACITY = 0.85
const FALLBACK_LINE_COLOR = '96, 140, 255'

function hexToRgb(hex: string): string | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const value = parseInt(clean, 16)
  if (Number.isNaN(value)) return null
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `${r}, ${g}, ${b}`
}

function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function fadeCurve(t: number): number {
  t = Math.max(0, Math.min(1, t))
  return 0.5 - 0.5 * Math.cos(Math.PI * t)
}

export function CanvasGridBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(pointer: fine)').matches
  })

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    let DPR = 1
    let rafId = 0
    let pulse = 0

    const mouse = { x: -9999, y: -9999, active: false }
    const targetMouse = { x: -9999, y: -9999 }
    let lastAccentHex = ''
    let lineColor = FALLBACK_LINE_COLOR

    function updateLineColor() {
      const accent = getCssVar('--accent')
      if (accent && accent !== lastAccentHex) {
        lastAccentHex = accent
        lineColor = hexToRgb(accent) ?? FALLBACK_LINE_COLOR
      }
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas!.width = W * DPR
      canvas!.height = H * DPR
      canvas!.style.width = `${W}px`
      canvas!.style.height = `${H}px`
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function segmentGradient(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      colorRGB: string,
      mx: number,
      my: number
    ): CanvasGradient {
      const grad = ctx!.createLinearGradient(x1, y1, x2, y2)
      const steps = 12
      for (let s = 0; s <= steps; s++) {
        const u = s / steps
        const px = x1 + (x2 - x1) * u
        const py = y1 + (y2 - y1) * u
        const dist = Math.hypot(px - mx, py - my)
        const t = Math.max(0, 1 - dist / RADIUS)
        const op = fadeCurve(t) * MAX_OPACITY
        grad.addColorStop(u, `rgba(${colorRGB}, ${op})`)
      }
      return grad
    }

    function handlePointerMove(event: PointerEvent) {
      targetMouse.x = event.clientX
      targetMouse.y = event.clientY
      mouse.active = true
    }

    function handlePointerLeave() {
      mouse.active = false
    }

    function handlePointerDown() {
      pulse = 1
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H)

      mouse.x += (targetMouse.x - mouse.x) * 0.18
      mouse.y += (targetMouse.y - mouse.y) * 0.18

      updateLineColor()

      if (mouse.active) {
        const nearCol = Math.round(mouse.x / SPACING)
        const nearRow = Math.round(mouse.y / SPACING)
        const spanCols = Math.ceil(RADIUS / SPACING)
        const spanRows = Math.ceil(RADIUS / SPACING)

        for (let i = nearCol - spanCols; i <= nearCol + spanCols; i++) {
          const x = i * SPACING
          const dx = x - mouse.x
          if (Math.abs(dx) > RADIUS) continue
          const halfChord = Math.sqrt(RADIUS * RADIUS - dx * dx)
          const y1 = mouse.y - halfChord
          const y2 = mouse.y + halfChord
          const t = 1 - Math.abs(dx) / RADIUS
          ctx!.strokeStyle = segmentGradient(x, y1, x, y2, lineColor, mouse.x, mouse.y)
          ctx!.lineWidth = 1 + t * 1.2
          ctx!.beginPath()
          ctx!.moveTo(x, y1)
          ctx!.lineTo(x, y2)
          ctx!.stroke()
        }

        for (let j = nearRow - spanRows; j <= nearRow + spanRows; j++) {
          const y = j * SPACING
          const dy = y - mouse.y
          if (Math.abs(dy) > RADIUS) continue
          const halfChord = Math.sqrt(RADIUS * RADIUS - dy * dy)
          const x1 = mouse.x - halfChord
          const x2 = mouse.x + halfChord
          const t = 1 - Math.abs(dy) / RADIUS
          ctx!.strokeStyle = segmentGradient(x1, y, x2, y, lineColor, mouse.x, mouse.y)
          ctx!.lineWidth = 1 + t * 1.2
          ctx!.beginPath()
          ctx!.moveTo(x1, y)
          ctx!.lineTo(x2, y)
          ctx!.stroke()
        }

        for (let i = nearCol - spanCols; i <= nearCol + spanCols; i++) {
          for (let j = nearRow - spanRows; j <= nearRow + spanRows; j++) {
            const x = i * SPACING
            const y = j * SPACING
            const dx = x - mouse.x
            const dy = y - mouse.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d > RADIUS) continue
            const t = 1 - d / RADIUS
            const op = Math.pow(fadeCurve(t), 1.3) * MAX_OPACITY
            if (op < 0.02) continue
            const r = 1.4 + t * 2.4
            ctx!.beginPath()
            ctx!.arc(x, y, r, 0, Math.PI * 2)
            ctx!.fillStyle = `rgba(${lineColor}, ${op})`
            ctx!.fill()
          }
        }

        const grad = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, RADIUS * 0.9)
        grad.addColorStop(0, `rgba(${lineColor}, ${0.08 + pulse * 0.15})`)
        grad.addColorStop(0.5, `rgba(${lineColor}, ${0.045 + pulse * 0.08})`)
        grad.addColorStop(0.8, `rgba(${lineColor}, ${0.015 + pulse * 0.03})`)
        grad.addColorStop(1, `rgba(${lineColor}, 0)`)
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.arc(mouse.x, mouse.y, RADIUS * 0.9, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.beginPath()
        ctx!.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${lineColor}, 0.9)`
        ctx!.fill()
      }

      pulse *= 0.92
      rafId = requestAnimationFrame(draw)
    }

    resize()
    setEnabled(true)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('pointerdown', handlePointerDown)
    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('pointerdown', handlePointerDown)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
