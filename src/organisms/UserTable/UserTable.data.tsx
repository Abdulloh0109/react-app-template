import type { ColumnDef } from '@tanstack/react-table'
import { DeleteIcon, EditIcon } from '@/assets/icons'
import type { UserResponseDto, UserStatus } from '@/services'
import type { ActionsType, StatusVariant } from '@/types'
import { Status, Text } from '@/ui'
import { cn, formatDate } from '@/utils'

/** 40px min hit area — comfortably tappable without breaking the row height. */
const actionButton =
  'flex size-8 items-center justify-center rounded text-content-subtle transition-colors hover:bg-surface-muted hover:text-accent-text'

const STATUS_VARIANT: Record<UserStatus, StatusVariant> = {
  active: 'success',
  inactive: 'danger',
  pending: 'warning',
}

export const userTableColumns = (
  onAction: (id: string, action: ActionsType) => void
): ColumnDef<UserResponseDto>[] => [
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => (
      <Text className="text-content">{row.original.full_name}</Text>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <Text>{row.original.email}</Text>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <Text className="capitalize">{row.original.role}</Text>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Status
        text={row.original.status}
        variant={STATUS_VARIANT[row.original.status]}
        className="capitalize"
      />
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => <Text>{formatDate(row.original.created_at)}</Text>,
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          aria-label={`Edit ${row.original.full_name}`}
          onClick={() => onAction(row.original.id, 'edit')}
          className={actionButton}
        >
          <EditIcon className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={`Delete ${row.original.full_name}`}
          onClick={() => onAction(row.original.id, 'delete')}
          className={cn(
            actionButton,
            'hover:text-tone-danger-content hover:bg-tone-danger'
          )}
        >
          <DeleteIcon className="size-5" aria-hidden />
        </button>
      </div>
    ),
  },
]
