import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
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
import type { Callbacks } from '@/types'

/**
 * One place that knows how this resource is keyed in the cache. Anything that
 * needs to invalidate users imports from here instead of assembling arrays by
 * hand — that is what keeps a rename to a single edit.
 */
export const usersKeys = {
  all: [QUERY_KEYS.USERS] as const,
  list: (search: string) => [QUERY_KEYS.USERS, search] as const,
  detail: (id: string) => [QUERY_KEYS.USER, id] as const,
}

/** Invalidates every users list, whatever page/search each one is on. */
const useInvalidateUsers = () => {
  const queryClient = useQueryClient()
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
    [queryClient]
  )
}

/**
 * Paginated list. The query key carries the URL search string, so changing
 * page/search/filter is what triggers a refetch — the table never holds its own
 * copy of that state.
 */
export const useUsersQuery = (options?: EnabledQuery) => {
  const { search } = useLocation()

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    error: usersError,
    refetch: refetchUsers,
  } = useGet<ResponseDataWithPagination<UserResponseDto>>(
    usersKeys.list(search),
    URLS.users.get,
    { enabledLoad: options?.enabledLoad ?? true }
  )

  return {
    users,
    isLoadingUsers,
    isUsersError,
    usersError,
    refetchUsers,
  }
}

/** Single user, for the edit form. Stays idle until `enabled` is true. */
export const useUserQuery = (id: string, enabled?: boolean) => {
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useGetOne<UserResponseDto>(
    usersKeys.detail(id),
    URLS.users.getById(id),
    enabled
  )

  return { user, isLoadingUser, isUserError }
}

export const useCreateUser = () => {
  const invalidate = useInvalidateUsers()
  const { mutate, isPending: isCreating } = useCreate<
    UserRequestDto,
    UserResponseDto
  >(URLS.users.create)

  const createUser = (
    data: UserRequestDto,
    callbacks?: Callbacks<UserResponseDto>
  ) =>
    mutate(data, {
      onSuccess: (response) => {
        invalidate()
        callbacks?.onSuccess?.(response)
      },
      onError: (error) => callbacks?.onError?.(error),
    })

  return { createUser, isCreating }
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const invalidate = useInvalidateUsers()
  const { mutate, isPending: isUpdating } = useUpdatePut<
    UserRequestDto,
    UserResponseDto
  >()

  const updateUser = (
    id: string,
    data: UserRequestDto,
    callbacks?: Callbacks<UserResponseDto>
  ) =>
    mutate(
      { url: URLS.users.update(id), item: data },
      {
        onSuccess: (response) => {
          invalidate()
          queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) })
          callbacks?.onSuccess?.(response)
        },
        onError: (error) => callbacks?.onError?.(error),
      }
    )

  return { updateUser, isUpdating }
}

export const useDeleteUser = () => {
  const invalidate = useInvalidateUsers()
  const { mutate, isPending: isDeleting } = useDelete<DeleteUserResponse>()

  const deleteUser = (id: string, callbacks?: Callbacks<DeleteUserResponse>) =>
    mutate(URLS.users.delete(id), {
      onSuccess: (response) => {
        invalidate()
        callbacks?.onSuccess?.(response)
      },
      onError: (error) => callbacks?.onError?.(error),
    })

  return { deleteUser, isDeleting }
}
