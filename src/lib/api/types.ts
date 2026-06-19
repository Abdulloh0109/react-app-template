export type EditData<T> = {
  url: string
  item: T
}

export type PaginationType = {
  total_pages: number
  current_page: number
  total_items: number
  has_next_page: boolean
  has_previous_page: boolean
}

export type ResponseData<T> = {
  data: T[]
}

export type ResponseDataWithPagination<T> = {
  status: string
  message: string
  pagination: PaginationType
  data: T[]
}

export type DeleteType = {
  status: string
  id: string
}

export type EnabledQuery = {
  enabledLoad?: boolean
  staleTime?: number
  params?: Record<string, string>
}

export type ErrorResponseDto = {
  detail: string
}
