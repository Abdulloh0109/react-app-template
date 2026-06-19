import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  defaultUserValues,
  userSchema,
  type UserFormValues,
} from './UserModal.schema'
import { toast } from '@/_shared'
import { useUsers } from '@/services'
import type { ModalPropsType } from '@/types'
import { Button, Input, Modal } from '@/ui'
import { cn } from '@/utils'

const ROLE_OPTIONS = ['admin', 'manager', 'member'] as const
const STATUS_OPTIONS = ['active', 'inactive', 'pending'] as const

const selectClass =
  'w-full rounded-[10px] border border-transparent bg-gray-40 px-4 py-2.5 text-sm capitalize text-dark-30 outline-none transition-colors focus:border-primary-10 focus:bg-white'

export const UserModal = ({ open, onClose, mode = 'add', id }: ModalPropsType) => {
  const isEdit = mode === 'edit'
  const { createUser, updateUser, useGetUserById, isCreating, isUpdating } =
    useUsers()
  const { user } = useGetUserById(id ?? '', isEdit && !!id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultUserValues,
  })

  useEffect(() => {
    if (isEdit && user) {
      reset({
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    }
  }, [isEdit, user, reset])

  const onSubmit = (values: UserFormValues) => {
    const callbacks = {
      onSuccess: () => {
        toast.success(isEdit ? 'User updated' : 'User created')
        onClose()
      },
      onError: () => toast.error('Something went wrong'),
    }

    if (isEdit && id) {
      updateUser(id, values, callbacks)
    } else {
      createUser(values, callbacks)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit user' : 'Add user'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            form="user-form"
            type="submit"
            isLoading={isCreating || isUpdating}
          >
            {isEdit ? 'Save changes' : 'Create'}
          </Button>
        </>
      }
    >
      <form
        id="user-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Input
          label="Full name"
          placeholder="Jane Cooper"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-40/[.7]">Role</label>
          <select className={cn(selectClass)} {...register('role')}>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark-40/[.7]">
            Status
          </label>
          <select className={cn(selectClass)} {...register('status')}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  )
}
