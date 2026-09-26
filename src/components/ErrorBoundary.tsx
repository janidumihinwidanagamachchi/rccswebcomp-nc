import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/motion/Reveal'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

    render() {
      if (this.state.hasError) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
            <p className="mb-6 max-w-md text-quiet-ink">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <Button onClick={() => window.location.reload()}>Reload page</Button>
          </div>
        )
      }

      return this.props.children
    }
  }

/**
 * ErrorBoundary is a class component, so it cannot use a hook-based Reveal to
 * animate its fallback — and the fallback is exactly the state that most needs
 * to feel handled rather than abrupt. Wrapping the class in a function gives
 * somewhere for the motion to live without converting the boundary itself,
 * which would mean reimplementing componentDidCatch for no benefit.
 *
 * The reveal is on mount and deliberately short-lived: this is a dead end the
 * user has to leave, so it should resolve quickly and point at the reload
 * button rather than lingering.
 */
export function AnimatedErrorBoundary({ children }: Props) {
  return (
    <Reveal scale="lg">
      <ErrorBoundary>{children}</ErrorBoundary>
    </Reveal>
  )
}
