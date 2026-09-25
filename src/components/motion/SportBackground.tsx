// Decorative, atmospheric sports backdrop: a soft wash, two slow drifting
// glows and long diagonal speed lines. Paints with gradients only (no
// filter: blur) and animates transform only, so it stays on the compositor.
// Mounted behind all content at -z-10, so it never breaks position: sticky.
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
          className="animate-speed-sweep absolute inset-y-0 left-0 h-full w-[200%] motion-reduce:animate-none"
          style={{
            opacity: 'var(--sport-lines)',
            backgroundImage:
              'repeating-linear-gradient(76deg, color-mix(in srgb, var(--sport-lime) 60%, transparent) 0 1px, transparent 1px 96px)',
          }}
        />
        <div
          className="animate-speed-sweep absolute inset-y-0 left-0 h-full w-[200%] motion-reduce:animate-none"
          style={{
            opacity: 'calc(var(--sport-lines) * 0.8)',
            animationDelay: '-15s',
            backgroundImage:
              'repeating-linear-gradient(76deg, color-mix(in srgb, var(--sport-blue) 75%, transparent) 0 1px, transparent 1px 210px)',
          }}
        />
      </div>

      <div
        className="animate-glow-drift absolute -left-[18vw] -top-[20vh] h-[62vh] w-[62vh] rounded-full motion-reduce:animate-none"
        style={{
          opacity: 'var(--sport-glow-opacity)',
          backgroundImage: `radial-gradient(circle,
            color-mix(in srgb, var(--sport-lime) var(--sport-glow-tint), transparent) 0%,
            transparent 65%)`,
        }}
      />
      <div
        className="animate-glow-drift-slow absolute -bottom-[24vh] -right-[14vw] h-[70vh] w-[70vh] rounded-full motion-reduce:animate-none"
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
