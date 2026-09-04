/**
 * Ant Design v5 button.
 *
 * Sizes are AntD control heights (32 / 24px) rather than free padding, so
 * buttons line up with inputs and selects on the same row. Solid variants carry
 * AntD 2px "lift" shadow; `secondary` is AntD default button — white with a
 * hairline border that turns primary on hover.
 *
 * Colors are semantic roles (`accent`, `content`, `line`), so every variant is
 * correct in light and dark without a single `dark:` override.
 */
export const buttonTokens = {
  base: 'group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded border font-normal outline-none transition-colors disabled:cursor-not-allowed',
  sizes: {
    medium: {
      padding: 'h-control px-4',
      fontSize: 'text-sm',
    },
    small: {
      padding: 'h-control-sm px-2',
      fontSize: 'text-xs',
    },
  },
  variants: {
    primary: {
      base: 'bg-accent text-accent-contrast border-accent shadow-btn-primary',
      hover: 'hover:bg-accent-hover hover:border-accent-hover',
      active: 'active:bg-accent-active active:border-accent-active',
      focus: 'focus-visible:outline-offset-1',
      disabled:
        'disabled:bg-surface-muted disabled:text-content-subtle disabled:border-line-strong disabled:shadow-none',
    },
    secondary: {
      base: 'bg-surface text-content border-line-strong shadow-btn',
      hover: 'hover:border-accent hover:text-accent-text',
      active: 'active:border-accent-active',
      focus: 'focus-visible:outline-offset-1',
      disabled:
        'disabled:bg-surface-muted disabled:text-content-subtle disabled:border-line-strong disabled:shadow-none',
    },
    danger: {
      base: 'bg-destructive text-destructive-contrast border-destructive shadow-btn-danger',
      hover: 'hover:bg-destructive-hover hover:border-destructive-hover',
      active: 'active:bg-destructive-active active:border-destructive-active',
      focus: 'focus-visible:outline-offset-1',
      disabled:
        'disabled:bg-surface-muted disabled:text-content-subtle disabled:border-line-strong disabled:shadow-none',
    },
    /**
     * AntD "link" button. AntD lightens the label on hover; here it underlines
     * instead — a lighter blue drops under AA on a white surface, and the
     * darker fill steps are unreadable as text in dark mode.
     */
    text: {
      base: 'bg-transparent text-accent-text border-transparent',
      hover: 'hover:underline',
      active: 'active:underline',
      focus: 'focus-visible:outline-offset-1',
      disabled: 'disabled:text-content-subtle',
    },
  },
  /**
   * Icons in `src/assets/icons` draw with `currentColor`, so tint them with
   * `text-*`. A `fill-*` here would beat their `fill="none"` attribute and blob
   * out stroke-only paths.
   */
  icon: {
    primary: 'text-accent-contrast',
    secondary: 'text-current',
    danger: 'text-destructive-contrast',
    text: 'text-current',
  },
}
