import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertIcon } from '@/assets/icons'

type Props = {
  children: ReactNode
  /** Rendered instead of the default card; receives nothing, keep it simple. */
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

type State = { error: Error | null }

/**
 * Catches render/lifecycle errors below it so one broken component shows a card
 * instead of a blank page. Mounted once in `App.tsx`; the router additionally
 * renders `RouteErrorPage` for errors thrown inside a route.
 *
 * It does NOT catch errors in event handlers or async code — React never has
 * those on the render path. Report those through `toast.error` at the call site.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Swap for your error reporter (Sentry, etc.) when the project has one.
    console.error('Unhandled render error:', error, info.componentStack)
    this.props.onError?.(error, info)
  }

  private reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas p-6 text-center"
      >
        <AlertIcon className="size-12 text-tone-danger-content" aria-hidden />
        <h1 className="text-xl font-semibold text-content">
          Something went wrong
        </h1>
        <p className="max-w-md text-sm text-content-muted">
          The page ran into an unexpected error. Try again, or reload if it
          keeps happening.
        </p>
        {import.meta.env.DEV && (
          <pre className="max-w-xl overflow-auto rounded border border-line bg-surface-muted p-3 text-left text-xs text-content-muted">
            {this.state.error.message}
          </pre>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={this.reset}
            className="inline-flex h-control items-center rounded bg-accent px-4 text-sm text-accent-contrast shadow-btn-primary transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-control items-center rounded border border-line-strong bg-surface px-4 text-sm text-content shadow-btn transition-colors hover:border-accent hover:text-accent-text"
          >
            Reload page
          </button>
        </div>
      </div>
    )
  }
}
