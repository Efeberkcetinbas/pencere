import { useEffect, useState } from 'react'

export interface ViewportLayout {
  width: number
  height: number
  isLandscape: boolean
  isCompactLandscape: boolean
  screenOrientation: string
}

function readViewport(): ViewportLayout {
  const viewport = window.visualViewport
  const width = Math.round(viewport?.width ?? window.innerWidth)
  const height = Math.round(viewport?.height ?? window.innerHeight)
  const isLandscape = width > height
  return {
    width,
    height,
    isLandscape,
    isCompactLandscape: isLandscape && height <= 600,
    screenOrientation: window.screen.orientation?.type ?? 'unavailable',
  }
}

export function useViewportLayout() {
  const [layout, setLayout] = useState<ViewportLayout>(readViewport)

  useEffect(() => {
    let frame = 0
    let followUp = 0
    const measure = () => {
      const next = readViewport()
      setLayout(current => current.width === next.width && current.height === next.height && current.screenOrientation === next.screenOrientation ? current : next)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      clearTimeout(followUp)
      frame = requestAnimationFrame(measure)
      followUp = window.setTimeout(measure, 180)
    }
    const viewport = window.visualViewport
    window.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)
    document.addEventListener('fullscreenchange', schedule)
    viewport?.addEventListener('resize', schedule)
    window.screen.orientation?.addEventListener('change', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(followUp)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
      document.removeEventListener('fullscreenchange', schedule)
      viewport?.removeEventListener('resize', schedule)
      window.screen.orientation?.removeEventListener('change', schedule)
    }
  }, [])

  return layout
}
