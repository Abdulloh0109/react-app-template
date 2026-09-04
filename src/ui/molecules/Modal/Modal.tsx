import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'

export type ModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  /** Accessible name when `title` is omitted or is not plain text. */
  ariaLabel?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Dependency-free dialog: portal + scrim, Escape to close, focus moved in on
 * open, trapped while open and restored to the trigger on close.
 *
 * Swap in a Radix/Headless dialog if a project needs stacking or scroll-lock
 * guarantees beyond this — the organism-facing API (`open`, `onClose`, `title`,
 * `footer`) is deliberately the same shape.
 */
export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  ariaLabel,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()

  const getFocusable = useCallback(
    () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
        // Deliberately not an `offsetParent`/layout check: the dialog lives in
        // a `position: fixed` container, where `offsetParent` is null for every
        // descendant, which would empty the list and break the trap.
      ).filter(
        (el) =>
          !el.hasAttribute('hidden') &&
          el.getAttribute('aria-hidden') !== 'true'
      ),
    []
  )

  // Remember the trigger so focus can go back to it when the dialog closes.
  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    return () => previouslyFocused.current?.focus?.()
  }, [open])

  // Focus the dialog itself rather than its first control: screen readers
  // announce the dialog name, and Enter cannot accidentally hit the close
  // button. Tab then walks into the content.
  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (e.shiftKey && (active === first || active === dialogRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose, getFocusable])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/*
        The scrim is a real button rather than a div with a click handler: it
        gets keyboard/pointer semantics for free and keeps the dialog itself out
        of the click path, so a drag that starts inside cannot close the dialog.
        It stays out of the tab order — Escape and the header button are the
        keyboard routes out.
      */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Dismiss dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-overlay/45 animate-overlayShow"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        tabIndex={-1}
        className={cn(
          // A border, not just a shadow: `shadow-3xl` is tuned for light and all
          // but disappears against a dark canvas.
          // `surface-raised` is AntD colorBgElevated: identical to the card in
          // light, one step lighter in dark so the dialog lifts off the page.
          'relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-line bg-surface-raised shadow-modal animate-contentShow',
          className
        )}
      >
        {title && (
          <div className="flex items-start justify-between gap-4 px-6 pb-3 pt-5">
            <h2 id={titleId} className="text-base font-semibold text-content">
              {title}
            </h2>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={onClose}
              className="-mr-2 -mt-1 flex size-8 shrink-0 items-center justify-center rounded text-content-subtle transition-colors hover:bg-surface-muted hover:text-content"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-2">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 pb-5 pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
