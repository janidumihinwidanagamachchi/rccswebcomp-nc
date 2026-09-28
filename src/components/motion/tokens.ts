export const dur = {
  base: 0.7,
  slow: 1.3,
  deliberate: 1.9,
  uniform: 0.7,
} as const

export const ease = {
  gentle: [0.33, 0, 0.15, 1],
  outQuint: [0.22, 1, 0.36, 1],
} as const

export const spring = {
  snappy: { type: 'spring', duration: 0.18, bounce: 0.22 },
  gentle: { type: 'spring', duration: 0.32, bounce: 0.18 },
  soft: { type: 'spring', duration: 0.5, bounce: 0.2 },
} as const

export const viewport = {
  once: true,
  margin: '0px 0px -64px 0px',
} as const

export const rise = {
  sm: 8,
  md: 16,
  lg: 24,
} as const
