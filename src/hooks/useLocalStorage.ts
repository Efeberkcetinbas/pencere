import { useCallback, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? (JSON.parse(saved) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const update = useCallback((next: T | ((current: T) => T)) => {
    setValue((current) => {
      const result = next instanceof Function ? next(current) : next
      try { localStorage.setItem(key, JSON.stringify(result)) } catch { /* Private mode/storage quota: keep session state. */ }
      return result
    })
  }, [key])

  return [value, update] as const
}
