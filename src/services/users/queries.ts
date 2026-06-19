import { useLocation } from 'react-router-dom'
import type {
  DeleteUserResponse,
  UserRequestDto,
  UserResponseDto,
} from './types'
import { QUERY_KEYS, URLS } from '@/constants'
import {
  useCreate,
  useDelete,
  useGet,
  useGetOne,
  useUpdatePut,
  type EnabledQuery,
  type ResponseDataWithPagination,
} from '@/lib/api'
import { client } from '@/providers'
import type { Callbacks } from '@/types'

export const useUsers = (options?: EnabledQuery) => {
  const { search } = useLocation()

  const { data: users, isLoading: isLoadingUsers } = useGet<
    ResponseDataWithPagination<UserResponseDto>
  >([QUERY_KEYS.USERS, search], URLS.users.get, {
    enabledLoad: options?.enabledLoad ?? true,
  })

  const useGetUserById = (id: string, enabled?: boolean) => {
    const { data: user, isLoading: isLoadingUser } = useGetOne<UserResponseDto>(
      [QUERY_KEYS.USER, id],
      URLS.users.getById(id),
      enabled
    )
    return { user, isLoadingUser }
  }

  const invalidate = () => {
    client.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] })
  }

  const { mutate: createUserMutate, isPending: isCreating } = useCreate<
    UserRequestDto,
    UserResponseDto
  >(URLS.users.create)

  const createUser = (
    data: UserRequestDto,
    callbacks?: Callbacks<UserResponseDto>
  ) => {
    return createUserMutate(data, {
      onSuccess: (response) => {
        invalidate()
        callbacks?.onSuccess?.(response)
      },
      onError: (error) => callbacks?.onError?.(error),
    })
  }

  const { mutate: updateUserMutate, isPending: isUpdating } = useUpdatePut<
    UserRequestDto,
    UserResponseDto
  >()

  const updateUser = (
    id: string,
    data: UserRequestDto,
    callbacks?: Callbacks<UserResponseDto>
  ) => {
    return updateUserMutate(
      { url: URLS.users.update(id), item: data },
      {
        onSuccess: (response) => {
          invalidate()
          client.invalidateQueries({ queryKey: [QUERY_KEYS.USER, id] })
          callbacks?.onSuccess?.(response)
        },
        onError: (error) => callbacks?.onError?.(error),
      }
    )
  }

  const { mutate: deleteUserMutate } = useDelete<DeleteUserResponse>()

  const deleteUser = (
    id: string,
    callbacks?: Callbacks<DeleteUserResponse>
  ) => {
    return deleteUserMutate(URLS.users.delete(id), {
      onSuccess: (response) => {
        invalidate()
        callbacks?.onSuccess?.(response)
      },
      onError: (error) => callbacks?.onError?.(error),
    })
  }

  return {
    users,
    isLoadingUsers,
    useGetUserById,
    createUser,
    updateUser,
    deleteUser,
    isCreating,
    isUpdating,
  }
}
