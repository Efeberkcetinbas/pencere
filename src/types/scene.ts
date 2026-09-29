export type Quality = 'low' | 'balanced' | 'high'
export type ForegroundTheme = 'balcony' | 'window' | 'terrace' | 'rooftop' | 'none'
export type CouplePreset = 'hero' | 'window' | 'terrace' | 'night' | 'rooftop'
export type EffectKind = 'water' | 'ferry' | 'birds' | 'rain' | 'clouds' | 'lights' | 'balloons' | 'traffic' | 'steam'
export interface SceneLayer { id: string; kind: 'image' | EffectKind; src?: string; depth: number; top?: number; left?: number; width?: number; opacity?: number }
export interface AudioLayer { src: string; gain: number }
export interface SceneVariant { id: string; label: string; artwork: string; thumbnail: string; timeOfDay: 'dawn' | 'sunset' | 'evening' | 'night' }
export interface Scene {
  id: string; slug: string; title: string; city: string; country: string; location: string; description: string
  category: 'İstanbul' | 'Türkiye' | 'Dünya'; sceneType: 'pixel-art' | 'illustration' | 'photo' | 'video' | 'parallax'
  variants: SceneVariant[]; defaultVariant: string; thumbnail: string; foregroundType: ForegroundTheme; couplePreset: CouplePreset
  foregrounds: ForegroundTheme[]; layers: SceneLayer[]; ambientSound: AudioLayer[]; featured: boolean; tags: string[]
  focalPoint: [number, number]; accent: string
}
export const assetUrl = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')

