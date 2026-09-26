/** Duration scale in seconds. `instant`/`quick` are taps; `base` and up are entrances. */
export const dur = {
  instant: 0.12,
  quick: 0.18,
  base: 0.7,
  slow: 1.3,
  deliberate: 1.9,
  /** Unused. Keeps the top of the scale available. */
  cinematic: 2.6,
  /**
   * Overrides the scale above for the whole interaction layer.
   * Mirrored in CSS as --motion-uniform; change both together.
   */
  uniform: 0.7,
} as const

/** `gentle` eases from near zero for weight; the -Expo/-Quint curves read as floaty. */
export const ease = {
  gentle: [0.33, 0, 0.15, 1],
  /** Matches --ease-out-quint in the Tailwind theme. */
  outQuint: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const

export type EaseName = keyof typeof ease
export type CubicBezier = readonly [number, number, number, number]

/** Visual duration, not settling time: this Motion version has no visualDuration. */
export const spring = {
  snappy: { type: 'spring', duration: 0.18, bounce: 0.22 },
  gentle: { type: 'spring', duration: 0.32, bounce: 0.18 },
  soft: { type: 'spring', duration: 0.5, bounce: 0.2 },
} as const

/** Negative margin, not amount, so tall and short elements trigger at the same scroll position. */
export const viewport = {
  once: true,
  margin: '0px 0px -64px 0px',
} as const

/** Travel distance in pixels, scaled to element size. */
export const rise = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const
