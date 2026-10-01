import { useEffect, useState } from 'react'

type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: 'portrait') => Promise<void>
  unlock?: () => void
}

type WebkitFullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

type WebkitFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

const fullscreenElement = () => document.fullscreenElement ?? (document as WebkitFullscreenDocument).webkitFullscreenElement ?? null

export function useFullscreen() {
  const [nativeActive, setNativeActive] = useState(Boolean(fullscreenElement()))
  const [immersive, setImmersive] = useState(false)
  useEffect(() => {
    const onChange = () => {
      const active = Boolean(fullscreenElement())
      setNativeActive(active)
      if (active) setImmersive(false)
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  const toggle = async () => {
    const orientation = window.screen.orientation as LockableOrientation | undefined
    try {
      if (fullscreenElement()) {
        const webkitDocument = document as WebkitFullscreenDocument
        if (document.exitFullscreen) await document.exitFullscreen()
        else await webkitDocument.webkitExitFullscreen?.()
        orientation?.unlock?.()
        return
      }
      if (immersive) {
        setImmersive(false)
        return
      }
      const element = document.documentElement as WebkitFullscreenElement
      if (!element.requestFullscreen && !element.webkitRequestFullscreen) {
        setImmersive(true)
        return
      }
      if (element.requestFullscreen) await element.requestFullscreen()
      else await element.webkitRequestFullscreen?.()
      try { await orientation?.lock?.('portrait') } catch { /* Lock is optional, especially on iOS Safari. */ }
    } catch {
      // iOS and embedded browsers may reject native fullscreen; fixed immersive mode remains available.
      setImmersive(true)
    }
  }
  return { active: nativeActive || immersive, immersive, supported: Boolean(document.fullscreenEnabled), toggle }
}
