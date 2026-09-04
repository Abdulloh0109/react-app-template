import type { StatusVariant } from '@/types'

/**
 * Ant Design v5 Tag: a 4px-radius chip with a tinted fill, a 1px border one
 * step darker, and label text dark enough to clear WCAG AA (AntD own pairing
 * lands near 3.4:1 — see the note in `src/tokens/semantic.ts`).
 */
export const statusTokens = {
  base: 'inline-flex h-[22px] items-center justify-center rounded-sm border px-2 text-xs font-normal leading-none w-max',
  variants: {
    success:
      'bg-tone-success border-tone-success-border text-tone-success-content',
    danger: 'bg-tone-danger border-tone-danger-border text-tone-danger-content',
    warning:
      'bg-tone-warning border-tone-warning-border text-tone-warning-content',
    info: 'bg-tone-info border-tone-info-border text-tone-info-content',
    default:
      'bg-tone-neutral border-tone-neutral-border text-tone-neutral-content',
  } satisfies Record<StatusVariant, string>,
}
