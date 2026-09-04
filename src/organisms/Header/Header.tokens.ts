/** AntD Layout.Header: 64px, white, hairline bottom border. */
export const headerTokens = {
  root: 'flex h-16 shrink-0 items-center justify-between border-b border-line bg-surface px-6',
  left: 'flex items-center gap-3',
  toggle:
    'flex size-10 items-center justify-center rounded text-content-muted transition-colors hover:bg-surface-muted hover:text-accent-text',
  right: 'flex items-center gap-1 sm:gap-2',
  user: 'flex items-center gap-2 pr-2',
  avatar:
    'flex size-8 items-center justify-center rounded-full bg-accent text-xs font-normal text-accent-contrast',
  name: 'hidden text-sm text-content sm:inline',
  themeToggle:
    'flex size-10 items-center justify-center rounded text-content-muted transition-colors hover:bg-surface-muted hover:text-accent-text',
  logout:
    'flex size-10 items-center justify-center rounded text-content-muted transition-colors hover:bg-tone-danger hover:text-tone-danger-content',
}
