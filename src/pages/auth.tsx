import { Authorization } from '@/organisms'
import { AuthLayout } from '@/templates'

export const AuthPage = () => {
  return (
    <AuthLayout
      authForm={<Authorization />}
      imageSide={
        <div className="flex flex-col items-center gap-4 px-12 text-center text-nav-content">
          <div className="flex size-16 items-center justify-center rounded-lg bg-accent text-2xl font-semibold text-accent-contrast">
            A
          </div>
          <h2 className="text-3xl font-semibold">React App Template</h2>
          <p className="max-w-xs text-sm text-nav-content/70">
            Atomic-design starter with an in-project UI kit, mock data layer and
            a ready CRUD flow.
          </p>
        </div>
      }
    />
  )
}
