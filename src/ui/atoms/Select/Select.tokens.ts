/** Matches `Input` exactly — same height, border and focus halo as Ant Design. */
export const selectTokens = {
  wrapper: 'flex flex-col gap-2 w-full',
  label: 'text-sm text-content',
  field: {
    base: 'h-control w-full appearance-none rounded border bg-surface pl-3 pr-9 text-sm text-content outline-none transition-colors',
    default:
      'border-line-strong hover:border-accent focus:border-accent focus:shadow-focus focus-visible:outline-none',
    error:
      'border-destructive hover:border-destructive-hover focus:border-destructive focus-visible:outline-none',
    disabled:
      'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-subtle',
  },
  chevron:
    'pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-content-subtle',
  error: 'text-xs text-tone-danger-content',
}
