import type { Scene, SceneLayer, SceneVariant, ForegroundTheme, AudioLayer, CouplePreset } from '../types/scene'
const variant = (id: string, label: string, art: string, timeOfDay: SceneVariant['timeOfDay']): SceneVariant => ({ id, label, artwork: `scenes/${art}/background`, thumbnail: `scenes/${art}/thumbnail.webp`, timeOfDay })
const sunset = variant('sunset', 'Gün batımı', 'maiden-sunset', 'sunset')
const night = variant('night', 'Gece', 'maiden-night', 'night')
const sea: AudioLayer[] = [{ src: 'audio/sea.mp3', gain: .8 }, { src: 'audio/city.mp3', gain: .12 }]
const rain: AudioLayer[] = [{ src: 'audio/rain.mp3', gain: .7 }, { src: 'audio/city.mp3', gain: .08 }]
const city: AudioLayer[] = [{ src: 'audio/city.mp3', gain: .65 }]
const effects = (...kinds: SceneLayer['kind'][]): SceneLayer[] => kinds.map((kind, i) => ({ id: kind, kind, depth: i + 1 }))
function make(id: string, title: string, cityName: string, category: Scene['category'], variants: SceneVariant[], foregroundType: ForegroundTheme, couplePreset: CouplePreset, layers: SceneLayer[], ambientSound: AudioLayer[], description: string): Scene {
  return { id, slug: id, title, city: cityName, country: category === 'Dünya' ? (cityName === 'Paris' ? 'Fransa' : 'Japonya') : 'Türkiye', location: title,
    description, category, variants, defaultVariant: variants[0].id, thumbnail: variants[0].thumbnail, foregroundType, couplePreset,
    foregrounds: foregroundType === 'none' ? ['none'] : [foregroundType, 'none'], layers, ambientSound, sceneType: 'pixel-art',
    featured: id === 'istanbul-maiden-tower', tags: [cityName, variants[0].label], focalPoint: [50, 50], accent: '#e8b58d' }
}
export const scenes: Scene[] = [
  make('istanbul-maiden-tower', 'Kız Kulesi', 'İstanbul', 'İstanbul', [sunset, night], 'balcony', 'hero', effects('water', 'clouds', 'ferry', 'birds', 'lights', 'steam'), sea, 'Boğaz’da günün son ışığı. Kahven soğumadan biraz kal.'),
  make('istanbul-maiden-night', 'Kız Kulesi', 'İstanbul', 'İstanbul', [night, sunset], 'balcony', 'night', effects('water', 'ferry', 'lights', 'steam'), sea, 'Suyun üzerinde, şehrin sıcak ışıkları.'),
  make('istanbul-galata', 'Galata', 'İstanbul', 'İstanbul', [variant('rain', 'Yağmurlu akşam', 'galata', 'evening')], 'window', 'window', effects('rain', 'clouds', 'lights'), rain, 'Yağmur eski çatıların sesini yumuşatır.'),
  make('istanbul-bosphorus', 'Boğaz', 'İstanbul', 'İstanbul', [variant('night', 'Gece', 'bosphorus', 'night')], 'balcony', 'night', effects('water', 'ferry', 'lights'), sea, 'İki kıyı arasında, sessiz bir gece.'),
  make('istanbul-ortakoy', 'Ortaköy', 'İstanbul', 'İstanbul', [variant('evening', 'Akşam', 'ortakoy', 'evening')], 'terrace', 'terrace', effects('water', 'ferry', 'clouds', 'birds'), sea, 'Köprünün altında akşam ağır ağır iner.'),
  make('istanbul-rooftops', 'İstanbul çatıları', 'İstanbul', 'İstanbul', [variant('golden', 'Altın saat', 'rooftops', 'sunset')], 'rooftop', 'rooftop', effects('clouds', 'birds', 'lights'), city, 'Kiremitler, bacalar ve uzakta tanıdık bir silüet.'),
  make('cappadocia', 'Kapadokya', 'Nevşehir', 'Türkiye', [variant('dawn', 'Gün doğumu', 'cappadocia', 'dawn')], 'terrace', 'terrace', effects('balloons', 'clouds'), [{ src: 'audio/wind.mp3', gain: .7 }], 'Vadiler uyanırken balonlar göğe karışır.'),
  make('aegean-coast', 'Ege kıyısı', 'Ege', 'Türkiye', [variant('sunset', 'Gün batımı', 'aegean', 'sunset')], 'terrace', 'terrace', effects('water', 'ferry', 'birds'), [{ src: 'audio/sea.mp3', gain: .75 }], 'Tuzlu hava, sakin bir koy, acele etmeyen bir akşam.'),
  make('paris-eiffel', 'Eiffel', 'Paris', 'Dünya', [variant('evening', 'Akşam', 'paris', 'evening')], 'balcony', 'night', effects('clouds', 'lights', 'steam'), city, 'Çatıların ardında bir şehir usulca ışıldar.'),
  make('tokyo-rain', 'Tokyo', 'Tokyo', 'Dünya', [variant('rain', 'Yağmurlu gece', 'tokyo', 'night')], 'window', 'window', effects('rain', 'traffic', 'lights'), rain, 'Camdaki damlaların ardında şehir yaşamaya devam eder.'),
]
export const getScene = (id: string) => scenes.find(scene => scene.id === id || scene.slug === id)

