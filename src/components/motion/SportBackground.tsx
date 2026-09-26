// Decorative, atmospheric sports backdrop: a soft wash, two glows and long
// diagonal speed lines. Paints with gradients only (no filter: blur) and is
// mounted behind all content at -z-10, so it never breaks position: sticky.
//
// The motion has been removed. It used to drift the glows (26s and 38s) and
// sweep the lines across at 44s, which is what made the page read as "live" at
// a glance. Everything static is untouched — the same gradients, the same
// colours, the same opacities, the same positions — so the composition is
// exactly as designed, just held still.
//
// One thing is not simply "the animation removed". glow-drift peaked at
// translate(4%, -6%) scale(1.08) at the midpoint of its cycle, so dropping the
// animation outright would have shrunk the lime glow to its base size and
// centred it — a visible change to the design rather than a removal of motion.
// That midpoint is now baked in as a static transform, so the glow still sits
// at the size and offset it was actually rendering at.
export function SportBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg,
            color-mix(in srgb, var(--sport-blue) var(--sport-wash-a), transparent) 0%,
            transparent 38%,
            color-mix(in srgb, var(--sport-lime) var(--sport-wash-b), transparent) 100%)`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 h-full w-[200%]"
          style={{
            opacity: 'var(--sport-lines)',
            backgroundImage:
              'repeating-linear-gradient(76deg, color-mix(in srgb, var(--sport-lime) 60%, transparent) 0 1px, transparent 1px 96px)',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 h-full w-[200%]"
          style={{
            opacity: 'calc(var(--sport-lines) * 0.8)',
            backgroundImage:
              'repeating-linear-gradient(76deg, color-mix(in srgb, var(--sport-blue) 75%, transparent) 0 1px, transparent 1px 210px)',
          }}
        />
      </div>

      <div
        className="absolute -left-[18vw] -top-[20vh] h-[62vh] w-[62vh] rounded-full"
        style={{
          // The midpoint glow-drift used to pass through. Static now, but the
          // same size and offset, so nothing about the layout shifts.
          transform: 'translate(4%, -6%) scale(1.08)',
          opacity: 'var(--sport-glow-opacity)',
          backgroundImage: `radial-gradient(circle,
            color-mix(in srgb, var(--sport-lime) var(--sport-glow-tint), transparent) 0%,
            transparent 65%)`,
        }}
      />
      <div
        className="absolute -bottom-[24vh] -right-[14vw] h-[70vh] w-[70vh] rounded-full"
        style={{
          // The second glow ran the same keyframes in reverse, so it started at
          // the neutral end already. No static transform needed here.
          opacity: 'var(--sport-glow-opacity)',
          backgroundImage: `radial-gradient(circle,
            color-mix(in srgb, var(--sport-blue) var(--sport-glow-tint), transparent) 0%,
            transparent 65%)`,
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-[36vh]"
        style={{
          backgroundImage: 'linear-gradient(180deg, var(--canvas) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
