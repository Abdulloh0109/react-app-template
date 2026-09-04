import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('ava'))
    expect(result.current).toBe('ava')
  })

  it('holds the old value until the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(399))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('ab')
  })

  it('only emits the final value of a fast burst', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: '' },
    })

    // Typing "ava" quickly must not fire three searches.
    ;['a', 'av', 'ava'].forEach((value) => {
      rerender({ value })
      act(() => vi.advanceTimersByTime(100))
    })

    expect(result.current).toBe('')

    act(() => vi.advanceTimersByTime(400))
    expect(result.current).toBe('ava')
  })

  it('honours a custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 1000),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'b' })
    act(() => vi.advanceTimersByTime(999))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('b')
  })
})
