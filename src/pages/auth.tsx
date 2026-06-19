import { Authorization } from '@/organisms'
import { AuthLayout } from '@/templates'

export const AuthPage = () => {
  return (
    <AuthLayout
      authForm={<Authorization />}
      imageSide={
        <div className="flex flex-col items-center gap-4 px-12 text-center text-sidebar-10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary-10 text-2xl font-bold">
            A
          </div>
          <h2 className="text-3xl font-bold">React App Template</h2>
          <p className="max-w-xs text-sm text-sidebar-10/70">
            Atomic-design starter with an in-project UI kit, mock data layer and
            a ready CRUD flow.
          </p>
        </div>
      }
    />
  )
}
