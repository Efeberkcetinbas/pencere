import { useCallback, useEffect, useRef, useState } from 'react'
import type { ForegroundTheme, Quality, Scene, SceneVariant } from '../types/scene'
import type { AmbientAudio } from '../hooks/useAmbientAudio'
import { useAutoHideUI } from '../hooks/useAutoHideUI'
import { useFullscreen } from '../hooks/useFullscreen'
import { useWakeLock } from '../hooks/useWakeLock'
import { Controls } from './Controls'
import { LoadingScreen } from './LoadingScreen'
import { PersonalMessage } from './PersonalMessage'
import { SceneArt } from './SceneArt'
import { usePortraitHint } from '../hooks/usePortraitHint'
interface Props { scene: Scene; favorite: boolean; special?: boolean; message?: string; audio: AmbientAudio; onBack: () => void; onFavorite: () => void }
export function SceneViewer({ scene, favorite, special=false, message, audio, onBack, onFavorite }: Props) {
  const [variant, setVariant] = useState<SceneVariant>(scene.variants[0])
  const [foreground, setForeground] = useState<ForegroundTheme>(scene.foregroundType)
  const [coffee, setCoffee] = useState(false)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [settings, setSettings] = useState(false)
  const [quality, setQuality] = useState<Quality>('balanced')
  const [clock, setClock] = useState(false)
  const [time, setTime] = useState(new Date())
  const root = useRef<HTMLElement>(null)
  const { visible, reveal } = useAutoHideUI(3000, settings)
  const fullscreen = useFullscreen()
  const wake = useWakeLock(coffee)
  const portraitHint = usePortraitHint()
  const ready = useCallback((error: boolean) => { setFailed(error); setLoading(false) }, [])
  useEffect(() => {
    const visibility = () => root.current?.classList.toggle('is-paused', document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => document.removeEventListener('visibilitychange', visibility)
  }, [])
  useEffect(() => {
    if (!clock) return
    const timer = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [clock])
  const changeVariant = (next: SceneVariant) => { setLoading(true); setFailed(false); setVariant(next) }
  const enterCoffee = () => { setCoffee(true); setSettings(false) }
  return <main ref={root} className={`viewer ${coffee ? 'coffee-mode' : ''} ${loading ? 'is-loading' : 'is-ready'}`} onPointerMove={event => {
    if (quality !== 'high' || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.current?.style.setProperty('--parallax', `${(event.clientX / innerWidth - .5) * 3}px`)
  }} onKeyDown={event => { if(event.key==='Escape') { setSettings(false); if(coffee) setCoffee(false) } }}>
    <SceneArt key={variant.id} scene={scene} variant={variant} foreground={foreground} quality={quality} onReady={ready} />
    {!coffee && <Controls scene={scene} visible={visible} favorite={favorite} audio={audio} variant={variant} foreground={foreground}
      settings={settings} quality={quality} clock={clock} onClock={setClock} onQuality={setQuality} onSettings={setSettings}
      onBack={onBack} onFavorite={onFavorite} onCoffee={enterCoffee} onFullscreen={fullscreen.toggle} onVariant={changeVariant} onForeground={setForeground} />}
    {coffee && <div className={`coffee-controls ${visible ? 'is-visible' : ''}`}><span>{wake.active ? 'Ekran açık tutuluyor' : 'Kahve zamanı'}</span><button onClick={() => {setCoffee(false);reveal()}}>Kahve modundan çık</button></div>}
    {clock && <time className="scene-clock">{time.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}</time>}
    {portraitHint && !coffee && !special && !loading && <p className="portrait-hint">Yatay görünümde daha güzel.</p>}
    {!loading && special && message !== '' && <PersonalMessage key={variant.id} text={message || 'Bunu görünce aklıma sen geldin.'} />}
    {failed && <p className="asset-notice" role="status">Manzara yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin. <button onClick={() => location.reload()}>Yeniden dene</button></p>}
    {loading && <LoadingScreen city={scene.city} />}
  </main>
}

