import { useCallback, useEffect, useMemo, useState } from 'react'
import { userTableColumns } from './UserTable.data'
import { userTableTokens as tokens } from './UserTable.tokens'
import { toast } from '@/_shared'
import { useDebounce, useSetParams } from '@/hooks'
import { UserModal } from '@/organisms'
import { useDeleteUser, useUsersQuery } from '@/services'
import type { ActionsType } from '@/types'
import { Button, Modal, Pagination, SearchInput, Table, Text } from '@/ui'

export const UserTable = () => {
  const { getParam, setParam, setParams } = useSetParams()
  const { users, isLoadingUsers, isUsersError, refetchUsers } = useUsersQuery()
  const { deleteUser, isDeleting } = useDeleteUser()

  const [searchValue, setSearchValue] = useState(() => getParam('search'))
  const debouncedSearch = useDebounce(searchValue)

  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // A new search always resets to page 1 — otherwise page 4 of the old result
  // set shows an empty table for the new one.
  useEffect(() => {
    setParams({ search: debouncedSearch, page: '' })
  }, [debouncedSearch, setParams])

  const handleAction = useCallback((id: string, action: ActionsType) => {
    if (action === 'edit') setEditId(id)
    if (action === 'delete') setDeleteId(id)
  }, [])

  const columns = useMemo(() => userTableColumns(handleAction), [handleAction])

  const onConfirmDelete = () => {
    if (!deleteId) return
    deleteUser(deleteId, {
      onSuccess: () => {
        toast.success('User deleted')
        setDeleteId(null)
      },
      onError: () => toast.error('Could not delete user'),
    })
  }

  const pagination = users?.pagination
  const currentPage = pagination?.current_page ?? 1
  const totalPages = pagination?.total_pages ?? 1
  const hasSearch = debouncedSearch.length > 0

  return (
    <div className={tokens.wrapper}>
      <div className={tokens.toolbar}>
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by name or email"
          aria-label="Search users by name or email"
        />
      </div>

      <div className={tokens.tableArea}>
        <Table
          caption="Users"
          columns={columns}
          data={users?.data ?? []}
          isLoading={isLoadingUsers}
          isError={isUsersError}
          errorText="Could not load users."
          onRetry={() => refetchUsers()}
          emptyText={hasSearch ? 'No users match your search' : 'No users yet'}
          emptyHint={
            hasSearch
              ? 'Try a different name or email.'
              : 'Use “Add user” to create the first one.'
          }
        />
      </div>

      <div className={tokens.footer}>
        <Text className={tokens.total} aria-live="polite">
          {pagination?.total_items ?? 0} total
        </Text>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setParam('page', String(page))}
        />
      </div>

      {editId && (
        <UserModal
          mode="edit"
          id={editId}
          open={!!editId}
          onClose={() => setEditId(null)}
        />
      )}

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete user"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={onConfirmDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <Text>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </Text>
      </Modal>
    </div>
  )
}
