import { ease } from './tokens'

/** Named aliases for the ten existing importers. Definitions live in tokens.ts so they cannot drift from the Tailwind theme. */
export const EASE_OUT: [number, number, number, number] = [...ease.outQuint]
export const EASE_IN_OUT: [number, number, number, number] = [...ease.inOutQuart]
