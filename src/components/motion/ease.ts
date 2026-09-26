import { ease } from './tokens'

/**
 * Kept as named aliases because ten files already import these, and a rename
 * would have churned every one of them for no behavioural gain.
 *
 * The definitions now live in tokens.ts, so the Tailwind theme's
 * --ease-out-quint and the JS easing used at runtime have a single source and
 * cannot drift apart.
 *
 * New code should prefer `ease.gentle` for anything large; `EASE_OUT` is
 * outQuint, which is fast-out and floaty by design.
 */
export const EASE_OUT: [number, number, number, number] = [...ease.outQuint]
export const EASE_IN_OUT: [number, number, number, number] = [...ease.inOutQuart]
