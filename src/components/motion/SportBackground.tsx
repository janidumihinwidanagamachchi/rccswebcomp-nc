// Decorative sports backdrop: a soft wash, two glows and diagonal speed lines.
// Gradients only, no filter: blur, mounted behind content at -z-10 so it never
// breaks position: sticky.
//
// The glow transforms are the midpoints the removed glow-drift keyframes passed
// through, kept static so the composition does not change.
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
