import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { assetUrl, type ForegroundTheme, type Quality, type Scene, type SceneLayer, type SceneVariant } from '../types/scene'

function RandomSprite({ kind, quality }: { kind: 'birds' | 'ferry'; quality: Quality }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current!
    let timer: ReturnType<typeof setTimeout>
    let animation: Animation | undefined
    let disposed = false
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const schedule = () => {
      if (disposed || document.hidden || reduced.matches || quality === 'low') return
      const delay = kind === 'birds' ? 20000 + Math.random() * 40000 : 45000 + Math.random() * 45000
      timer = setTimeout(run, delay)
    }
    const run = () => {
      if (disposed || document.hidden) return
      const direction = Math.random() > .5 ? 1 : -1
      el.style.top = kind === 'birds' ? `${12 + Math.random() * 20}%` : '74%'
      if (kind === 'birds') {
        const count = 1 + Math.floor(Math.random() * 3)
        el.querySelectorAll('img').forEach((bird, index) => {
          bird.style.display = index < count ? 'block' : 'none'
          bird.style.translate = `${index * 13}px ${index % 2 ? 7 : 0}px`
        })
      }
      const duration = kind === 'ferry' ? 60000 + Math.random() * 30000 : 18000 + Math.random() * 7000
      animation = el.animate([
        { transform: `translateX(${direction > 0 ? -15 : 110}vw) scaleX(${direction})`, opacity: 0 },
        { opacity: .8, offset: .1 },
        { opacity: .8, offset: .9 },
        { transform: `translateX(${direction > 0 ? 110 : -15}vw) scaleX(${direction})`, opacity: 0 },
      ], { duration, easing: 'linear' })
      animation.onfinish = schedule
    }
    const visibility = () => { clearTimeout(timer); animation?.cancel(); if (!document.hidden) schedule() }
    document.addEventListener('visibilitychange', visibility)
    reduced.addEventListener('change', visibility)
    // Initial ferry is already far out, then passes are spaced and randomized.
    timer = setTimeout(run, kind === 'ferry' ? 6000 : 24000)
    if (quality === 'low' || reduced.matches) clearTimeout(timer)
    return () => { disposed = true; clearTimeout(timer); animation?.cancel(); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', visibility) }
  }, [kind, quality])
  if (kind === 'birds') return <span ref={ref} className="moving-sprite sprite-birds" aria-hidden="true">{[0,1,2].map(i=><img key={i} src={assetUrl('layers/gull.png')} alt="" />)}</span>
  return <img ref={node => { ref.current = node }} className="moving-sprite sprite-ferry" src={assetUrl('layers/ferry.png')} alt="" />
}
function Layer({ layer, quality }: { layer: SceneLayer; quality: Quality }) {
  const style = { zIndex: layer.depth, '--layer-top': `${layer.top ?? 68}%`, opacity: layer.opacity } as CSSProperties
  switch (layer.kind) {
    case 'image': return <img className="image-layer" src={assetUrl(layer.src!)} alt="" style={{ ...style, top: `${layer.top ?? 0}%`, left: `${layer.left ?? 0}%`, width: `${layer.width ?? 100}%` }} />
    case 'birds': case 'ferry': return <RandomSprite kind={layer.kind} quality={quality} />
    case 'balloons': return <div className="balloon-layer" style={style}>{[0,1,2,3,4].map(i => <img key={i} src={assetUrl('layers/balloon.png')} alt="" style={{ left: `${22+i*13}%`, top: `${9+(i%3)*8}%`, width: `${2+(i%3)*1.4}%`, animationDelay: `-${i*9}s` }} />)}</div>
    case 'clouds': return <div className="cloud-layer" style={style}><img src={assetUrl('layers/cloud.png')} alt="" /></div>
    case 'rain': return <div className="rain-layer" style={style}>{Array.from({length: quality === 'low' ? 6 : quality === 'high' ? 24 : 14}, (_, i) => <i key={i} style={{ left:`${(i*37)%100}%`, top:`${(i*17)%70}%`, animationDelay:`-${i*2.3}s`, animationDuration:`${9+i%7}s` }} />)}</div>
    case 'water': return <div className="water-shimmer" style={style}>{Array.from({length:quality === 'low' ? 8 : 24}, (_, i) => <i key={i} style={{left:`${(i*31)%100}%`,top:`${(i*19)%100}%`,width:`${2+i%5}%`,animationDelay:`-${i*1.7}s`}} />)}</div>
    case 'traffic': return <div className="traffic-layer" style={style}><i /><i /><i /></div>
    case 'lights': return <div className="light-breath" style={style} />
    case 'steam': return <div className="steam-layer" style={style}><i /><i /><i /></div>
  }
}
export function SceneArt({ scene, variant, foreground, quality, onReady }: { scene: Scene; variant: SceneVariant; foreground: ForegroundTheme; quality: Quality; onReady: (failed: boolean) => void }) {
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let cancelled = false
    const images = Array.from(ref.current!.querySelectorAll('img'))
    const timeout = setTimeout(() => { if (!cancelled) { setFailed(true); onReady(true) } }, 15000)
    void Promise.all(images.map(img => img.decode().catch(() => { if (img.classList.contains('scene-background')) throw new Error('background') })))
      .then(() => { if (!cancelled) { clearTimeout(timeout); onReady(false) } })
      .catch(() => { if (!cancelled) { clearTimeout(timeout); setFailed(true); onReady(true) } })
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [onReady])
  const heroLife = scene.id === 'istanbul-maiden-tower' && foreground === 'balcony'
  return <div ref={ref} className={`scene-art quality-${quality} ${failed ? 'art-failed' : ''}`} role="img" aria-label={`${scene.city}, ${scene.title}, ${variant.label}`}>
    <picture className="scene-picture"><source srcSet={assetUrl(variant.artwork + '.avif')} type="image/avif" /><img className="scene-background" src={assetUrl(variant.artwork + '.webp')} alt="" style={{objectPosition:`${scene.focalPoint[0]}% ${scene.focalPoint[1]}%`}} /></picture>
    {scene.layers.map(layer => <Layer key={layer.id} layer={layer} quality={quality} />)}
    {foreground !== 'none' && <img className={`foreground-art foreground-${foreground}`} src={assetUrl(`layers/${foreground}.png`)} alt="" />}
    {heroLife && <div className="hero-life-group" data-testid="hero-life" aria-hidden="true">
      <img className="hero-life hero-life-base" src={assetUrl('layers/hero-people-flowers.webp')} alt="" />
      <img className="hero-life hero-people-motion" src={assetUrl('layers/hero-people-flowers.webp')} alt="" />
      <img className="hero-life hero-flowers-left" src={assetUrl('layers/hero-people-flowers.webp')} alt="" />
      <img className="hero-life hero-flowers-right" src={assetUrl('layers/hero-people-flowers.webp')} alt="" />
    </div>}
    <div className="vignette" />
  </div>
}

