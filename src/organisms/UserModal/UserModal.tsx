import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  defaultUserValues,
  userSchema,
  type UserFormValues,
} from './UserModal.schema'
import { toast } from '@/_shared'
import { useCreateUser, useUpdateUser, useUserQuery } from '@/services'
import type { ModalPropsType } from '@/types'
import { Button, Input, Modal, Select, Spinner, Text } from '@/ui'

export const UserModal = ({
  open,
  onClose,
  mode = 'add',
  id,
}: ModalPropsType) => {
  const isEdit = mode === 'edit'

  const { user, isLoadingUser, isUserError } = useUserQuery(
    id ?? '',
    isEdit && !!id
  )
  const { createUser, isCreating } = useCreateUser()
  const { updateUser, isUpdating } = useUpdateUser()

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

  const isSaving = isCreating || isUpdating
  const isBusy = isEdit && isLoadingUser

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
            isLoading={isSaving}
            disabled={isBusy || isUserError}
          >
            {isEdit ? 'Save changes' : 'Create'}
          </Button>
        </>
      }
    >
      {isBusy ? (
        <div className="flex justify-center py-10">
          <Spinner className="size-6 text-accent-text" />
        </div>
      ) : isUserError ? (
        <Text className="py-6 text-center text-tone-danger-content">
          Could not load this user. Close the dialog and try again.
        </Text>
      ) : (
        <form
          id="user-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
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
          <Select
            label="Role"
            options={ROLE_OPTIONS}
            error={errors.role?.message}
            classNames={{ field: 'capitalize' }}
            {...register('role')}
          />
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            error={errors.status?.message}
            classNames={{ field: 'capitalize' }}
            {...register('status')}
          />
        </form>
      )}
    </Modal>
  )
}
