import type { FunctionComponent, SVGProps } from 'react'

/**
 * Shared, domain-agnostic types used across services, organisms and pages.
 * Keep cross-cutting contracts here; feature-specific DTOs live next to their
 * service (e.g. `src/services/users/types.ts`).
 */

export type SelectOption = {
  label: string
  value: string
}

export type StatusVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'default'

/** Row-level actions surfaced by table organisms. */
export type ActionsType = 'view' | 'edit' | 'delete'

/** Success/error hooks passed into service mutations. */
export type Callbacks<T = unknown> = {
  onSuccess?: (data: T) => void
  onError?: (error?: unknown) => void
}

/** Props every CRUD modal organism receives. */
export type ModalPropsType = {
  open: boolean
  onClose: () => void
  mode?: 'add' | 'edit'
  id?: string
}

export type LimitOptionsType = '10' | '20' | '50' | '100'

export type NavItem = {
  label: string
  href: string
  icon: FunctionComponent<SVGProps<SVGSVGElement>>
}
