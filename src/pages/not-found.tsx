import { Link } from 'react-router-dom'
import { NotFoundIcon } from '@/assets/icons'
import { ROUTES } from '@/constants'
import { Text } from '@/ui'

export const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-canvas">
      <NotFoundIcon className="size-20 text-content-subtle" aria-hidden />
      <Text as="h1" className="text-2xl font-semibold text-content">
        Page not found
      </Text>
      <Link
        to={ROUTES.HOME}
        className="text-sm text-accent-text hover:text-accent-hover"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
