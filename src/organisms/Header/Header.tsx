import { headerTokens as tokens } from './Header.tokens'
import { LogoutIcon, MenuIcon } from '@/assets/icons'
import { useAuth } from '@/services'
import { useAuthStore } from '@/store'

type Props = {
  onToggleSidebar: () => void
}

export const Header = ({ onToggleSidebar }: Props) => {
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuth()

  const initials = user?.full_name
    ?.split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')

  return (
    <header className={tokens.root}>
      <div className={tokens.left}>
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          className={tokens.toggle}
        >
          <MenuIcon className="size-5" />
        </button>
      </div>

      <div className={tokens.right}>
        <div className={tokens.user}>
          <span className={tokens.avatar}>{initials || 'U'}</span>
          <span className={tokens.name}>{user?.full_name ?? 'User'}</span>
        </div>
        <button
          type="button"
          aria-label="Log out"
          onClick={() => logout()}
          className={tokens.logout}
        >
          <LogoutIcon className="size-5" />
        </button>
      </div>
    </header>
  )
}
