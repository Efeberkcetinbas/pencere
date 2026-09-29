import { useEffect, useState } from 'react'

export function useFullscreen() {
  const [active, setActive] = useState(Boolean(document.fullscreenElement))
  useEffect(() => {
    const onChange = () => setActive(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { /* Browser chrome may deny fullscreen; the scene remains usable. */ }
  }
  return { active, supported: Boolean(document.fullscreenEnabled), toggle }
}
