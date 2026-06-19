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
  const baseBtn =
    'flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm transition-colors'

  return (
    <nav className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          baseBtn,
          'border-gray-30 text-dark-40 hover:border-primary-10 disabled:opacity-40 disabled:hover:border-gray-30'
        )}
      >
        Prev
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`gap-${idx}`} className="px-1 text-gray-10">
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
                ? 'border-primary-10 bg-primary-10 text-white'
                : 'border-gray-30 text-dark-40 hover:border-primary-10'
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
          'border-gray-30 text-dark-40 hover:border-primary-10 disabled:opacity-40 disabled:hover:border-gray-30'
        )}
      >
        Next
      </button>
    </nav>
  )
}
