import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

/**
 * jsdom has no `matchMedia`. `useTheme` subscribes to it on every render, so a
 * stub is required app-wide rather than per test file. Defaults to light; a
 * test that cares can override `window.matchMedia` itself.
 */
const createMatchMedia = (matches: boolean) => (query: string) =>
  ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }) as unknown as MediaQueryList

beforeEach(() => {
  window.matchMedia = createMatchMedia(false)
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})
