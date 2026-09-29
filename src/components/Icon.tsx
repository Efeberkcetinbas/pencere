type IconName = 'back' | 'bookmark' | 'heart' | 'sound' | 'mute' | 'coffee' | 'expand' | 'sliders' | 'music' | 'close'

const paths: Record<IconName, string> = {
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  back: 'M19 12H5m6-6-6 6 6 6', heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 0-7.8Z',
  sound: 'M11 5 6 9H2v6h4l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12', mute: 'M11 5 6 9H2v6h4l5 4V5Zm5 4 6 6m0-6-6 6',
  coffee: 'M3 8h14v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm14 2h2a3 3 0 0 1 0 6h-2M7 3v2m4-2v2', expand: 'M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5',
  sliders: 'M4 6h16M8 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm12 12H4m12 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM4 12h16m-6 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z', music: 'M9 18V5l11-2v13M9 9l11-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm11-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', close: 'm6 6 12 12M18 6 6 18',
}

export function Icon({ name, filled = false }: { name: IconName; filled?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}
