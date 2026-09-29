import { useEffect, useState } from 'react'
export function useWakeLock(wanted: boolean) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    let lock: WakeLockSentinel | undefined
    let disposed = false
    const acquire = async () => {
      if (!wanted || document.hidden || lock && !lock.released) return
      try {
        const sentinel = await navigator.wakeLock?.request('screen')
        if (disposed) { await sentinel?.release(); return }
        lock = sentinel
        setActive(Boolean(lock))
        lock?.addEventListener('release', () => { if (!disposed) setActive(false) })
      } catch { if (!disposed) setActive(false) }
    }
    void acquire()
    document.addEventListener('visibilitychange', acquire)
    return () => { disposed = true; document.removeEventListener('visibilitychange', acquire); void lock?.release().catch(() => undefined) }
  }, [wanted])
  return { active: wanted && active, supported: 'wakeLock' in navigator }
}

