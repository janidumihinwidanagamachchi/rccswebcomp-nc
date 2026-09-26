import { ease } from './tokens'

/** Aliases for existing importers. Definitions live in tokens.ts. */
export const EASE_OUT: [number, number, number, number] = [...ease.outQuint]
export const EASE_IN_OUT: [number, number, number, number] = [...ease.inOutQuart]
