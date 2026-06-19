import { useEffect, useMemo, useState } from 'react'
import { userTableColumns } from './UserTable.data'
import { userTableTokens as tokens } from './UserTable.tokens'
import { toast } from '@/_shared'
import { useDebounce, useSetParams } from '@/hooks'
import { UserModal } from '@/organisms'
import { useUsers } from '@/services'
import type { ActionsType } from '@/types'
import { Button, Modal, Pagination, SearchInput, Table, Text } from '@/ui'

export const UserTable = () => {
  const { getParam, setParam } = useSetParams()
  const { users, isLoadingUsers, deleteUser } = useUsers()

  const [searchValue, setSearchValue] = useState(() => getParam('search'))
  const debouncedSearch = useDebounce(searchValue)

  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setParam('search', debouncedSearch)
    setParam('page', '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const handleAction = (id: string, action: ActionsType) => {
    if (action === 'edit') setEditId(id)
    if (action === 'delete') setDeleteId(id)
  }

  const columns = useMemo(() => userTableColumns(handleAction), [])

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

  return (
    <div className={tokens.wrapper}>
      <div className={tokens.toolbar}>
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by name or email"
        />
      </div>

      <div className={tokens.tableArea}>
        <Table
          columns={columns}
          data={users?.data ?? []}
          isLoading={isLoadingUsers}
          emptyText="No users found"
        />
      </div>

      <div className={tokens.footer}>
        <Text className={tokens.total}>
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
              classNames={{ base: 'bg-danger-10 hover:bg-danger-20' }}
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
