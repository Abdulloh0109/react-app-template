import { Outlet } from 'react-router-dom'
import { mainLayoutTokens as tokens } from './main-layout.tokens'
import { SIDEBAR_NAVLIST } from '@/constants'
import { Header } from '@/organisms'
import { useSidebarStore } from '@/store'
import { Sidebar } from '@/ui'

export const MainLayout = () => {
  const { isExtended, setIsExtended } = useSidebarStore((state) => state)

  return (
    <div className={tokens.root}>
      <Sidebar
        navList={SIDEBAR_NAVLIST}
        isExpanded={isExtended}
        onCollapse={() => setIsExtended(!isExtended)}
      />
      <div className={tokens.main}>
        <Header onToggleSidebar={() => setIsExtended(!isExtended)} />
        <div className={tokens.page}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
