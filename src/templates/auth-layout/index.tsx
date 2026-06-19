import type { ReactNode } from 'react'
import { authLayoutTokens as tokens } from './auth-layout.tokens'

type Props = {
  authForm: ReactNode
  imageSide?: ReactNode
  modal?: ReactNode
}

export const AuthLayout = ({ authForm, imageSide, modal }: Props) => {
  return (
    <div className={tokens.root}>
      <div className={tokens.formSide}>
        <div className={tokens.formInner}>{authForm}</div>
      </div>
      <div className={tokens.imageSide}>{imageSide}</div>
      {modal}
    </div>
  )
}
