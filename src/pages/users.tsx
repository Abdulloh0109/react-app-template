import { useState } from 'react'
import { PlusIcon, UsersIcon } from '@/assets/icons'
import { UserModal, UserTable } from '@/organisms'
import { PagesLayout } from '@/templates'
import { Button } from '@/ui'

export const UsersPage = () => {
  const [openAdd, setOpenAdd] = useState(false)

  return (
    <PagesLayout
      title={
        <div className="flex items-center gap-3">
          <UsersIcon className="size-7 text-primary-10" />
          <h1 className="text-2xl font-bold text-dark-20">Users</h1>
        </div>
      }
      actions={
        <Button icon={PlusIcon} onClick={() => setOpenAdd(true)}>
          Add user
        </Button>
      }
      content={<UserTable />}
      modal={
        openAdd && (
          <UserModal mode="add" open={openAdd} onClose={() => setOpenAdd(false)} />
        )
      }
    />
  )
}
