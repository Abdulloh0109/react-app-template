import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils'

export type ModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/**
 * Dependency-free modal built on a portal + overlay. Swap in a Radix/Headless
 * dialog here if a project needs focus-trapping or stacking guarantees — the
 * organism-facing API (`open`, `onClose`, `title`, `footer`) stays the same.
 */
export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-10/40 p-4 animate-overlayShow"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          'flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-3xl animate-contentShow',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-gray-40 px-6 py-4">
            <h2 className="text-lg font-semibold text-dark-20">{title}</h2>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-md p-1 text-dark-50 transition-colors hover:bg-gray-40 hover:text-dark-30"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none">
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
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-40 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
