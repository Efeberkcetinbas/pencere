import { useCallback, useEffect, useRef, useState } from 'react'
import { assetUrl, type AudioLayer } from '../types/scene'

// App-owned mixer survives route changes. Bounded voices and four cached recordings.
export function useAmbientAudio(layers: AudioLayer[]) {
  const ctx = useRef<AudioContext | null>(null)
  const master = useRef<GainNode | null>(null)
  const cache = useRef(new Map<string, AudioBuffer>())
  const voices = useRef(new Set<AudioBufferSourceNode>())
  const mix = useRef<GainNode | null>(null)
  const generation = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolumeState] = useState(.35)
  const [error, setError] = useState(false)
  const signature = JSON.stringify(layers)
  const toggle = useCallback(() => {
    if (!ctx.current) {
      try {
        ctx.current = new AudioContext()
        master.current = ctx.current.createGain()
        master.current.gain.value = .35
        master.current.connect(ctx.current.destination)
      } catch { setError(true); return }
    }
    void ctx.current.resume().catch(() => setError(true))
    setEnabled(on => !on)
  }, [])
  useEffect(() => {
    const context = ctx.current
    if (!context || !master.current) return
    const token = ++generation.current
    const old = mix.current
    mix.current = null
    old?.gain.cancelScheduledValues(context.currentTime)
    old?.gain.setTargetAtTime(0, context.currentTime, .35)
    for (const voice of voices.current) { try { voice.stop(context.currentTime + 1.5) } catch { /* ended */ } }
    if (!enabled) return
    const controller = new AbortController()
    const parsed = JSON.parse(signature) as AudioLayer[]
    if (parsed.length === 0) return
    void Promise.all(parsed.map(async layer => {
      let buffer = cache.current.get(layer.src)
      if (!buffer) {
        const response = await fetch(assetUrl(layer.src), { signal: controller.signal })
        if (!response.ok) throw new Error('Audio unavailable')
        buffer = await context.decodeAudioData(await response.arrayBuffer())
        if (token !== generation.current) return null
        cache.current.set(layer.src, buffer)
      }
      return { layer, buffer }
    })).then(decoded => {
      if (token !== generation.current || context.state === 'closed') return
      setError(false)
      const next = context.createGain()
      next.gain.setValueAtTime(0, context.currentTime)
      next.gain.linearRampToValueAtTime(1, context.currentTime + 1.2)
      next.connect(master.current!)
      mix.current = next
      let remaining = decoded.filter(Boolean).length
      for (const item of decoded) {
        if (!item) continue
        const source = context.createBufferSource()
        const level = context.createGain()
        source.buffer = item.buffer
        source.loop = true
        level.gain.value = item.layer.gain
        source.connect(level).connect(next)
        source.onended = () => { voices.current.delete(source); source.disconnect(); level.disconnect(); if (--remaining === 0) next.disconnect() }
        voices.current.add(source)
        source.start()
      }
    }).catch(e => { if (e.name !== 'AbortError' && token === generation.current) setError(true) })
    return () => controller.abort()
  }, [enabled, signature])
  const setVolume = useCallback((value: number) => {
    setVolumeState(value)
    if (ctx.current && master.current) master.current.gain.setTargetAtTime(value, ctx.current.currentTime, .1)
  }, [])
  useEffect(() => {
    const cacheMap = cache.current
    const generationRef = generation
    const visibility = () => {
      const context = ctx.current
      if (!context || context.state === 'closed') return
      void (document.hidden ? context.suspend() : context.resume()).catch(() => undefined)
    }
    document.addEventListener('visibilitychange', visibility)
    return () => { document.removeEventListener('visibilitychange', visibility); generationRef.current++; void ctx.current?.close().catch(() => undefined); ctx.current = null; cacheMap.clear() }
  }, [])
  return { enabled, volume, toggle, setVolume, error }
}
export type AmbientAudio = ReturnType<typeof useAmbientAudio>

