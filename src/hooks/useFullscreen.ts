import { useEffect, useState, type RefObject } from 'react'

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape') => Promise<void>
  unlock?: () => void
}

export function useFullscreen(target: RefObject<HTMLElement | null>) {
  const [nativeActive, setNativeActive] = useState(Boolean(document.fullscreenElement))
  const [immersive, setImmersive] = useState(false)
  useEffect(() => {
    const onChange = () => {
      const active = Boolean(document.fullscreenElement)
      setNativeActive(active)
      if (active) setImmersive(false)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = async () => {
    const orientation = window.screen.orientation as LockableOrientation | undefined
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        orientation?.unlock?.()
        return
      }
      if (immersive) {
        setImmersive(false)
        return
      }
      const element = target.current ?? document.documentElement
      if (!element.requestFullscreen) {
        setImmersive(true)
        return
      }
      await element.requestFullscreen()
      try { await orientation?.lock?.('landscape') } catch { /* Lock is optional, especially on iOS Safari. */ }
    } catch {
      // iOS and embedded browsers may reject native fullscreen; fixed immersive mode remains available.
      setImmersive(true)
    }
  }
  return { active: nativeActive || immersive, immersive, supported: Boolean(document.fullscreenEnabled), toggle }
}
