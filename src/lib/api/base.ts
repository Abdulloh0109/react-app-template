import {
  useMutation,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { API } from './axios'
import type {
  DetailQueryKey,
  EditData,
  EnabledQuery,
  ListQueryKey,
} from './types'

export const useGet = <T>(
  key: ListQueryKey,
  url: string,
  options?: EnabledQuery
): UseQueryResult<T> => {
  const params = new URLSearchParams(key[1] ?? '')
  return useQuery<T>({
    queryKey: key,
    queryFn: async (): Promise<T> => {
      const { data } = await API.get<T>(url, { params })
      return data
    },
    enabled: (options?.enabledLoad ?? true) && !!url,
    ...(options?.staleTime !== undefined && { staleTime: options.staleTime }),
  })
}

export const useGetOne = <T>(
  key: DetailQueryKey,
  url: string,
  enabled?: boolean
): UseQueryResult<T> => {
  const isEnabled = enabled ?? !!url
  return useQuery<T>({
    queryKey: key,
    queryFn: async (): Promise<T> => {
      const { data } = await API.get<T>(url)
      return data
    },
    enabled: isEnabled,
  })
}

export const useCreate = <T, U, V = Error>(url: string) => {
  return useMutation<U, AxiosError<V>, T>({
    mutationFn: async (body: T) => {
      const { data } = await API.post<U>(url, body)
      return data
    },
  })
}

export const useUpdatePut = <T, U, V = Error>() => {
  return useMutation<U, AxiosError<V>, EditData<T>>({
    mutationFn: async ({ url, item }) => {
      const { data } = await API.put<U>(url, item)
      return data
    },
  })
}

export const useUpdatePatch = <T, U, V = Error>() => {
  return useMutation<U, AxiosError<V>, EditData<T>>({
    mutationFn: async ({ url, item }) => {
      const { data } = await API.patch<U>(url, item)
      return data
    },
  })
}

export const useDelete = <T, V = Error>() => {
  return useMutation<T, AxiosError<V>, string>({
    mutationFn: async (url: string) => {
      const { data } = await API.delete<T>(url)
      return data
    },
  })
}
