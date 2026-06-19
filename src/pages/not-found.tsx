import { Link } from 'react-router-dom'
import { NotFoundIcon } from '@/assets/icons'
import { ROUTES } from '@/constants'
import { Text } from '@/ui'

export const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <NotFoundIcon className="size-20 text-dark-40/40" />
      <Text className="text-3xl font-semibold text-dark-40">
        Page not found
      </Text>
      <Link
        to={ROUTES.HOME}
        className="text-base font-medium text-primary-10 hover:text-primary-20"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
