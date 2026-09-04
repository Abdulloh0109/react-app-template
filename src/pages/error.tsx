import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { AlertIcon } from '@/assets/icons'
import { ROUTES } from '@/constants'
import { Text } from '@/ui'

/**
 * Router-level fallback (`errorElement`). Catches anything thrown while
 * rendering a route — including a failed lazy chunk, which is the common one in
 * production after a deploy.
 */
export const RouteErrorPage = () => {
  const error = useRouteError()

  const { title, detail } = isRouteErrorResponse(error)
    ? {
        title: `${error.status} ${error.statusText}`,
        detail: 'That page could not be loaded.',
      }
    : {
        title: 'Something went wrong',
        detail: 'This section ran into an unexpected error.',
      }

  return (
    <div
      role="alert"
      className="flex h-screen flex-col items-center justify-center gap-4 bg-canvas p-6 text-center"
    >
      <AlertIcon className="size-12 text-tone-danger-content" aria-hidden />
      <h1 className="text-2xl font-semibold text-content">{title}</h1>
      <Text className="max-w-md text-content-muted">{detail}</Text>

      {import.meta.env.DEV && error instanceof Error && (
        <pre className="max-w-xl overflow-auto rounded border border-line bg-surface-muted p-3 text-left text-xs text-content-muted">
          {error.message}
        </pre>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-control items-center rounded bg-accent px-4 text-sm text-accent-contrast shadow-btn-primary transition-colors hover:bg-accent-hover"
        >
          Reload page
        </button>
        <Link
          to={ROUTES.HOME}
          className="inline-flex h-control items-center rounded border border-line-strong bg-surface px-4 text-sm text-content shadow-btn transition-colors hover:border-accent hover:text-accent-text"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
