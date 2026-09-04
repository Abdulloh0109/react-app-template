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
        // AntD Layout.Sider: 200px expanded, 80px collapsed.
        'flex h-screen flex-col bg-nav py-4 text-nav-content transition-[width] duration-200',
        isExpanded ? 'w-[200px]' : 'w-20'
      )}
    >
      <div className="flex h-8 items-center gap-3 px-6">
        <div className="flex size-8 shrink-0 items-center justify-center rounded bg-accent text-sm font-semibold text-accent-contrast">
          {brand.charAt(0)}
        </div>
        {isExpanded && <span className="text-base font-medium">{brand}</span>}
      </div>

      <nav aria-label="Main" className="mt-6 flex flex-1 flex-col gap-1 px-2">
        {navList.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === '/'}
            className={({ isActive }) =>
              cn(
                // AntD menu item: 40px tall, 6px radius, primary fill when selected.
                'flex h-10 items-center gap-3 rounded px-4 text-sm transition-colors',
                isActive
                  ? 'bg-nav-active text-nav-active-content'
                  : 'text-nav-content/65 hover:bg-white/10 hover:text-nav-content'
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
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className="mx-2 flex h-10 items-center gap-3 rounded px-4 text-sm text-nav-content/65 transition-colors hover:bg-white/10 hover:text-nav-content"
      >
        <span className="flex size-5 items-center justify-center">
          {isExpanded ? '«' : '»'}
        </span>
        {isExpanded && <span>Collapse</span>}
      </button>
    </aside>
  )
}
