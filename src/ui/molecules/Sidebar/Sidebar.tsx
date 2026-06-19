import { NavLink } from 'react-router-dom'
import type { NavItem } from '@/types'
import { cn } from '@/utils'

export type SidebarProps = {
  navList: NavItem[]
  isExpanded: boolean
  onCollapse: () => void
  brand?: string
}

export const Sidebar = ({
  navList,
  isExpanded,
  onCollapse,
  brand = 'Acme',
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        'flex h-screen flex-col bg-sidebar-50 py-6 text-sidebar-10 transition-[width] duration-200',
        isExpanded ? 'w-60' : 'w-[76px]'
      )}
    >
      <div className="flex items-center gap-3 px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-10 font-semibold text-white">
          {brand.charAt(0)}
        </div>
        {isExpanded && <span className="text-base font-semibold">{brand}</span>}
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1 px-3">
        {navList.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-40 text-sidebar-20'
                  : 'text-sidebar-10/80 hover:bg-sidebar-40/60'
              )
            }
          >
            <Icon className="size-5 shrink-0" />
            {isExpanded && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onCollapse}
        className="mx-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-10/70 transition-colors hover:bg-sidebar-40/60"
      >
        <span className="flex size-5 items-center justify-center">
          {isExpanded ? '«' : '»'}
        </span>
        {isExpanded && <span>Collapse</span>}
      </button>
    </aside>
  )
}
