import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useSetParams } from './useSetParams'

const wrapper =
  (route: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  )

const renderSetParams = (route = '/users') =>
  renderHook(() => ({ ...useSetParams(), location: useLocation() }), {
    wrapper: wrapper(route),
  })

describe('useSetParams', () => {
  it('reads a param, and returns an empty string when it is missing', () => {
    const { result } = renderSetParams('/users?search=ava')

    expect(result.current.getParam('search')).toBe('ava')
    expect(result.current.getParam('page')).toBe('')
  })

  it('writes a param into the URL', () => {
    const { result } = renderSetParams()

    act(() => result.current.setParam('page', '3'))

    expect(result.current.getParam('page')).toBe('3')
    expect(result.current.location.search).toBe('?page=3')
  })

  it('removes the key instead of leaving an empty value behind', () => {
    const { result } = renderSetParams('/users?search=ava&page=2')

    act(() => result.current.setParam('search', ''))

    expect(result.current.location.search).toBe('?page=2')
  })

  it('applies several keys in one update', () => {
    const { result } = renderSetParams('/users?search=old&page=4')

    act(() => result.current.setParams({ search: 'new', page: '' }))

    expect(result.current.location.search).toBe('?search=new')
  })

  it('keeps a stable identity across renders', () => {
    // UserTable puts `setParams` in an effect dependency array; an unstable
    // identity there re-runs the effect on every render and loops.
    const { result, rerender } = renderSetParams()
    const first = result.current.setParams
    const firstSetParam = result.current.setParam

    rerender()
    act(() => result.current.setParam('page', '2'))
    rerender()

    expect(result.current.setParams).toBe(first)
    expect(result.current.setParam).toBe(firstSetParam)
  })

  it('does not touch history when the value is already in the URL', () => {
    const { result } = renderSetParams('/users?search=ava')
    const before = result.current.location.key

    act(() => result.current.setParam('search', 'ava'))

    // Same location object => no navigation happened.
    expect(result.current.location.key).toBe(before)
  })
})
