import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Thin wrapper around the URL search params — table organisms use it to keep
 * pagination/search/filter state shareable and back-button friendly.
 */
export const useSetParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        return next
      })
    },
    [setSearchParams]
  )

  const getParam = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams]
  )

  return { searchParams, setParam, getParam }
}
