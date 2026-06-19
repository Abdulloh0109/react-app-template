import { useEffect, useRef } from 'react'

export const useClickOutside = <T extends HTMLElement>(
  handler: () => void
) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler])

  return ref
}
