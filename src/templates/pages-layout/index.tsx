import type { ReactNode } from 'react'
import { pagesLayoutTokens as tokens } from './pages-layout.tokens'

type Props = {
  title?: ReactNode
  actions?: ReactNode
  content: ReactNode
  modal?: ReactNode
}

/** Standard list/detail page shell: title row + actions + a content card. */
export const PagesLayout = ({ title, actions, content, modal }: Props) => {
  return (
    <main className={tokens.wrapper}>
      <div className={tokens.header}>
        {(title || actions) && (
          <div className={tokens.title}>
            {title}
            {actions && <div className={tokens.actions}>{actions}</div>}
          </div>
        )}
        <div className={tokens.content}>{content}</div>
      </div>
      {modal}
    </main>
  )
}
