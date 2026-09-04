import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Thin wrapper around the URL search params — table organisms use it to keep
 * pagination/search/filter state shareable and back-button friendly.
 *
 * Two guarantees callers depend on:
 *  1. `setParam`/`setParams` keep a stable identity, so they are safe in an
 *     effect dependency array (React Router does not promise this for
 *     `setSearchParams`, and an unstable setter there loops).
 *  2. Writing values that are already in the URL is a no-op, so a mount-time
 *     sync does not push a duplicate history entry.
 *
 * An empty string removes the key rather than leaving `?search=` behind.
 */
export const useSetParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const setSearchParamsRef = useRef(setSearchParams)
  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    setSearchParamsRef.current = setSearchParams
    searchParamsRef.current = searchParams
  })

  /** Update several keys in one history entry. */
  const setParams = useCallback((entries: Record<string, string>) => {
    const current = searchParamsRef.current
    const next = new URLSearchParams(current)

    Object.entries(entries).forEach(([key, value]) => {
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
    })

    if (next.toString() === current.toString()) return
    setSearchParamsRef.current(next)
  }, [])

  const setParam = useCallback(
    (key: string, value: string) => setParams({ [key]: value }),
    [setParams]
  )

  const getParam = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams]
  )

  return { searchParams, setParam, setParams, getParam }
}
