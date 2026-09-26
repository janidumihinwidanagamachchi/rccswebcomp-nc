/**
 * Motion tokens.
 *
 * The site had twenty hardcoded durations between 0.15 and 0.5, four different
 * easings, and two different viewport trigger offsets. Nothing related them to
 * each other, so "make this feel a bit slower" meant finding every call site by
 * hand and hoping you found them all.
 *
 * The organising idea is that slowness is budgeted by element size, not chosen
 * per element. A large element is on screen for a long time, so a slow entrance
 * reads as deliberate. A button is on screen for a fraction of a second, so the
 * same duration would read as lag. That is why the scale below is wide at the
 * top and why nothing in the "feedback" range is allowed to exceed `quick`.
 */

/**
 * Duration scale, in seconds. Named by intent rather than by number so the
 * right one is obvious at the call site.
 *
 * The two ends are deliberately far apart. instant and quick answer a tap and
 * are held at 0.12/0.18 no matter how slow the entrances get — a button that
 * answers in 0.5s reads as broken rather than cinematic, so slowness is spent
 * only where nothing is waiting on the visitor. base and above are entrances,
 * and those are now markedly slower than they were: 0.45 -> 0.7, 0.9 -> 1.3,
 * 1.4 -> 1.9. The effect is that arriving somewhere feels unhurried while
 * touching anything stays immediate.
 */
export const dur = {
  /** State acknowledgement on something already on screen: a toggle, a chip. */
  instant: 0.12,
  /** Direct manipulation: buttons, hovers, anything answering a click. */
  quick: 0.18,
  /** Default for a single element entering: cards, panels, one list item. */
  base: 0.7,
  /** Large elements, or a short stagger across a handful of items. */
  slow: 1.3,
  /** Hero-scale statements. One per screen, at most. */
  deliberate: 1.9,
  /**
   * Reserved. Deliberately unused so the top of the scale stays aspirational.
   * Raised from 1.9 to 2.6 when deliberate moved up to 1.9, because two names
   * for one number is worse than an unused step — the scale has to keep
   * increasing or "pick a slower one" stops being a choice.
   */
  cinematic: 2.6,
} as const

/**
 * Easings.
 *
 * `gentle` is the load-bearing one. Its second control point sits near 0
 * (0.33, 0, 0.15, 1), so the element starts moving imperceptibly and keeps
 * travelling the whole way, which reads as weight. `outQuint` and `outExpo`
 * start fast (y1 of 1 and 0.3) and spend most of the duration gliding, which
 * reads as floaty — right for a small chip, wrong for a headline. The existing
 * `EASE_OUT` was outQuint, which is why every reveal in the app had the same
 * slightly rushed quality regardless of the size of the thing revealing.
 */
export const ease = {
  /** Headlines, large panels, anything that should feel heavy. */
  gentle: [0.33, 0, 0.15, 1],
  /** Matches `--ease-out-quint` in the Tailwind theme. The previous default. */
  outQuint: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  /** Sheets and drawers. Fast out of the gate, long settle. */
  drawer: [0.32, 0.72, 0, 1],
} as const

export type EaseName = keyof typeof ease
export type CubicBezier = readonly [number, number, number, number]

/**
 * Spring presets.
 *
 * These use `duration` + `bounce`, not `stiffness`/`damping`/`mass`. The
 * stiffness family is hard to reason about because the numbers are coupled:
 * changing one to make something snappier silently changes how much it
 * overshoots. Duration-and-bounce separates the two, so the same duration with
 * a higher bounce is a visible comparison rather than a re-solve.
 *
 * `duration` here is the visual duration — how long the motion appears to take
 * — not the spring's settling time, which is derived from the bounce. This
 * version of Motion has no separate `visualDuration` option, so `duration` is
 * the correct name; the two springs already in Navbar and CalendarToolbar use
 * this same shape.
 */
export const spring = {
  /** Chips, small controls. Barely overshoots. */
  snappy: { type: 'spring', duration: 0.18, bounce: 0.22 },
  /** General interactive: cards lifting, menus, popovers. */
  gentle: { type: 'spring', duration: 0.32, bounce: 0.18 },
  /** Larger surfaces: sheets, drawers, the mobile nav. */
  soft: { type: 'spring', duration: 0.5, bounce: 0.2 },
} as const

/**
 * Scroll-trigger defaults.
 *
 * `Reveal` fired at -80px and `Stagger` at -60px. Two arbitrary numbers for
 * the same intent, so an element could begin animating noticeably earlier or
 * later purely depending on which wrapper it happened to be inside. Unifying at
 * -64px sits between the two; the difference is a few frames of lead time and
 * nobody will ever perceive it, whereas the inconsistency was a real trap when
 * you were trying to tune the feel.
 *
 * `margin` rather than `amount` on purpose: `amount` is a fraction of the
 * element, so a tall panel and a short chip would begin at very different
 * scroll positions. A pixel offset is constant regardless of what is animating.
 */
export const viewport = {
  once: true,
  margin: '0px 0px -64px 0px',
} as const

/**
 * Distance a rising element travels, in pixels. Small elements barely need to
 * move — at 8px a chip already reads as arriving. Large elements need room for
 * the motion to be legible at all.
 */
export const rise = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const
