import { HomeIcon, UsersIcon } from '@/assets/icons'
import { ROUTES } from '@/constants'
import type { NavItem } from '@/types'

export const SIDEBAR_NAVLIST: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.HOME,
    icon: HomeIcon,
  },
  {
    label: 'Users',
    href: ROUTES.USERS,
    icon: UsersIcon,
  },
]
