import { useCallback, useEffect, useRef, useState } from 'react'

export function useAutoHideUI(delay = 3800, disabled = false) {
  const [visible, setVisible] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reveal = useCallback(() => {
    setVisible(true)
    if (timer.current) clearTimeout(timer.current)
    if (!disabled) timer.current = setTimeout(() => setVisible(false), delay)
  }, [delay, disabled])

  useEffect(() => {
    if (!disabled) timer.current = setTimeout(() => setVisible(false), delay)
    const events: (keyof WindowEventMap)[] = ['pointermove', 'pointerdown', 'keydown']
    events.forEach((event) => window.addEventListener(event, reveal, { passive: true }))
    return () => {
      events.forEach((event) => window.removeEventListener(event, reveal))
      if (timer.current) clearTimeout(timer.current)
    }
  }, [delay, disabled, reveal])

  return { visible, reveal }
}
