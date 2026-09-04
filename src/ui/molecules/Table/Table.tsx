import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { tableTokens as tokens } from './Table.tokens'
import { Button, Spinner, Text } from '@/ui/atoms'
import { cn } from '@/utils'

export type TableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  /** Renders the error state instead of rows; pair with `onRetry`. */
  isError?: boolean
  errorText?: string
  onRetry?: () => void
  emptyText?: string
  emptyHint?: string
  className?: string
  onRowClick?: (row: TData) => void
  /** Accessible name for the table, announced by screen readers. */
  caption?: string
}

/**
 * Owns the four states every data table needs — loading, error, empty and rows
 * — so feature tables never have to re-implement them (and never quietly skip
 * the error one).
 */
export const Table = <TData,>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorText = 'Could not load this list.',
  onRetry,
  emptyText = 'No data',
  emptyHint,
  className,
  onRowClick,
  caption,
}: TableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderStateRow = (content: ReactNode) => (
    <tr>
      <td colSpan={columns.length} className={tokens.empty}>
        {content}
      </td>
    </tr>
  )

  return (
    <div className={cn(tokens.scroll, className)}>
      <table className={tokens.table}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={tokens.thead}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className={tokens.th}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody aria-busy={isLoading}>
          {isLoading
            ? renderStateRow(
                <Spinner className="mx-auto size-6 text-accent-text" />
              )
            : isError
              ? renderStateRow(
                  <div className="flex flex-col items-center gap-3">
                    <Text className="text-tone-danger-content">
                      {errorText}
                    </Text>
                    {onRetry && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={onRetry}
                      >
                        Try again
                      </Button>
                    )}
                  </div>
                )
              : data.length === 0
                ? renderStateRow(
                    <div className="flex flex-col items-center gap-1">
                      <Text className="font-medium text-content">
                        {emptyText}
                      </Text>
                      {emptyHint && (
                        <Text className="text-content-subtle">{emptyHint}</Text>
                      )}
                    </div>
                  )
                : table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(tokens.tr, onRowClick && 'cursor-pointer')}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={tokens.td}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
        </tbody>
      </table>
    </div>
  )
}
