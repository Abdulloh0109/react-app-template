import type { SVGProps } from 'react'

/**
 * Inline icon components. In the source project these are imported from `.svg`
 * files via `vite-plugin-svgr` (`import Icon from './icon.svg?react'`). Inline
 * components keep the template dependency-free — swap to svgr imports anytime.
 *
 * Each icon uses `fill="currentColor"` (or `stroke`) so Tailwind `fill-*` /
 * `text-*` utilities control its color.
 */
type IconProps = SVGProps<SVGSVGElement>

export const PlusIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const SearchIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path
      d="m20 20-3-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const EditIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M4 20h4l10-10-4-4L4 16v4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="m13.5 6.5 4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const DeleteIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const EyeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const MenuIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const LogoutIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const HomeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M3 11 12 3l9 8M5 10v10h14V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const UsersIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M18 20a6 6 0 0 0-3-5.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const NotFoundIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M9 9h.01M15 9h.01M9 15c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)
