import { cn } from '@/utils'

export type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const buildPages = (current: number, total: number): (number | '...')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)

  return pages
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null

  const pages = buildPages(currentPage, totalPages)
  // AntD pagination items are 32px squares; the current page is outlined in
  // primary rather than filled.
  const baseBtn =
    'flex h-control min-w-control items-center justify-center rounded border px-2 text-sm transition-colors'

  return (
    <nav className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          baseBtn,
          'border-line-strong bg-surface text-content-muted hover:border-accent hover:text-accent-text disabled:bg-surface-muted disabled:text-content-subtle disabled:hover:border-line-strong disabled:hover:text-content-subtle'
        )}
      >
        Prev
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`gap-${idx}`} className="px-1 text-content-subtle">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              baseBtn,
              page === currentPage
                ? 'border-accent bg-surface font-medium text-accent-text'
                : 'border-line-strong bg-surface text-content-muted hover:border-accent hover:text-accent-text'
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          baseBtn,
          'border-line-strong bg-surface text-content-muted hover:border-accent hover:text-accent-text disabled:bg-surface-muted disabled:text-content-subtle disabled:hover:border-line-strong disabled:hover:text-content-subtle'
        )}
      >
        Next
      </button>
    </nav>
  )
}
