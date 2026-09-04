/**
 * Ant Design v5 input: white field, 1px #d9d9d9 border, 32px tall, and AntD
 * focus treatment — the border turns primary and a soft 2px halo appears.
 */
export const inputTokens = {
  wrapper: 'flex flex-col gap-2 w-full',
  label: 'text-sm text-content',
  field: {
    base: 'h-control w-full rounded border bg-surface px-3 text-sm text-content outline-none transition-colors placeholder:text-content-subtle',
    default:
      'border-line-strong hover:border-accent focus:border-accent focus:shadow-focus focus-visible:outline-none',
    error:
      'border-destructive hover:border-destructive-hover focus:border-destructive focus:shadow-none focus-visible:outline-none',
    disabled:
      'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-content-subtle disabled:hover:border-line-strong',
  },
  error: 'text-xs text-tone-danger-content',
}
