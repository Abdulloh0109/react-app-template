import { format } from 'date-fns'

export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATE_TIME_FORMAT = 'dd.MM.yyyy HH:mm'

export const formatDate = (date: Date | string, pattern = DATE_FORMAT) => {
  if (!date) return ''
  return format(new Date(date), pattern)
}

export const formatDateTime = (date: Date | string) => {
  if (!date) return ''
  return format(new Date(date), DATE_TIME_FORMAT)
}
