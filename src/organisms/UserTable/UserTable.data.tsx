import type { ColumnDef } from '@tanstack/react-table'
import { DeleteIcon, EditIcon } from '@/assets/icons'
import type { UserResponseDto, UserStatus } from '@/services'
import type { ActionsType, StatusVariant } from '@/types'
import { Status, Text } from '@/ui'
import { formatDate } from '@/utils'

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
      <Text className="font-semibold text-dark-20">
        {row.original.full_name}
      </Text>
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
          aria-label="Edit"
          onClick={() => onAction(row.original.id, 'edit')}
          className="rounded-md p-1.5 text-dark-50 transition-colors hover:bg-gray-40 hover:text-primary-10"
        >
          <EditIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Delete"
          onClick={() => onAction(row.original.id, 'delete')}
          className="rounded-md p-1.5 text-dark-50 transition-colors hover:bg-gray-40 hover:text-danger-10"
        >
          <DeleteIcon className="size-5" />
        </button>
      </div>
    ),
  },
]
