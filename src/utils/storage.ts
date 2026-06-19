import type { KeyLocalStorage } from '@/types'

export const getLocalstorage = (key: KeyLocalStorage): string | null => {
  return localStorage.getItem(key)
}

export const setLocalstorage = (key: KeyLocalStorage, value: string): void => {
  localStorage.setItem(key, value)
}

export const removeLocalstorage = (key: KeyLocalStorage): void => {
  localStorage.removeItem(key)
}

export const clearLocalStorage = (): void => {
  localStorage.clear()
}
