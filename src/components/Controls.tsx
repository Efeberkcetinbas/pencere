import { useEffect, useRef, useState } from 'react'
import type { ForegroundTheme, Quality, Scene, SceneVariant } from '../types/scene'
import type { AmbientAudio } from '../hooks/useAmbientAudio'
import { Icon } from './Icon'
import { Credits } from './Credits'
interface Props {
 scene:Scene;visible:boolean;favorite:boolean;audio:AmbientAudio;variant:SceneVariant;foreground:ForegroundTheme;settings:boolean;quality:Quality;clock:boolean;
 onBack:()=>void;onFavorite:()=>void;onCoffee:()=>void;onFullscreen:()=>void;onSettings:(v:boolean)=>void;onClock:(v:boolean)=>void;onQuality:(v:Quality)=>void;
 onVariant:(v:SceneVariant)=>void;onForeground:(v:ForegroundTheme)=>void;
}
const names: Record<ForegroundTheme,string> = {balcony:'Balkon',window:'Pencere',terrace:'Teras',rooftop:'Çatı',none:'Açık manzara'}
export function Controls(p:Props){
 const dialog=useRef<HTMLDialogElement>(null)
 const [copied,setCopied]=useState(false)
 const [personal,setPersonal]=useState('Bunu görünce aklıma sen geldin.')
 useEffect(()=>{if(p.settings)dialog.current?.showModal();else dialog.current?.close()},[p.settings])
 const share=async()=>{const url=new URL(location.href);url.hash=`/view/${p.scene.slug}?message=${encodeURIComponent(personal)}`;try{await navigator.clipboard.writeText(url.href);setCopied(true)}catch{setCopied(false)}}
 const button=(label:string,icon:Parameters<typeof Icon>[0]['name'],action:()=>void,active=false)=><button className={`icon-button ${active?'active':''}`} title={label} aria-label={label} aria-pressed={active} onClick={action}><Icon name={icon}/></button>
 return <><div className={`scene-ui ${p.visible?'is-visible':''}`} inert={!p.visible}>
   <div className="scene-topbar">{button('Manzara değiştir','back',p.onBack)}<div className="scene-heading"><span>{p.scene.city} · {p.variant.label}</span><strong>{p.scene.title}</strong></div>{button(p.favorite?'Favorilerden çıkar':'Favoriye ekle','bookmark',p.onFavorite,p.favorite)}</div>
   <div className="scene-bottombar"><div className="control-cluster">{button(p.audio.enabled?'Ortam sesini kapat':'Ortam sesini aç',p.audio.enabled?'sound':'mute',p.audio.toggle,p.audio.enabled)}<span className="sound-caption">{p.audio.error?'Ses yüklenemedi':p.audio.enabled?'Şehrin sesi':'Sesi aç'}</span></div>
   <div className="control-cluster">{button('Kahve modu','coffee',p.onCoffee)}{button('Tam ekran','expand',p.onFullscreen)}{button('Ayarlar','sliders',()=>p.onSettings(true))}</div></div>
 </div>
 <dialog ref={dialog} className="settings-dialog" onCancel={()=>p.onSettings(false)} onClick={e=>{if(e.target===dialog.current)p.onSettings(false)}}><div className="settings-content">
 <div className="dialog-heading"><h2>Manzaranı ayarla</h2>{button('Ayarları kapat','close',()=>p.onSettings(false))}</div>
 <label>Atmosfer<select aria-label="Atmosfer" value={p.variant.id} onChange={e=>p.onVariant(p.scene.variants.find(v=>v.id===e.target.value)!)}>{p.scene.variants.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}</select></label>
 <label>Bakış<select aria-label="Ön plan" value={p.foreground} onChange={e=>p.onForeground(e.target.value as ForegroundTheme)}>{p.scene.foregrounds.map(f=><option key={f} value={f}>{names[f]}</option>)}</select></label>
 <label>Hareket yoğunluğu<select aria-label="Kalite" value={p.quality} onChange={e=>p.onQuality(e.target.value as Quality)}><option value="low">Düşük · daha az hareket</option><option value="balanced">Dengeli</option><option value="high">Yüksek · hafif derinlik</option></select></label>
 <label>Ortam sesi<input aria-label="Ses seviyesi" type="range" min="0" max="1" step=".05" value={p.audio.volume} onChange={e=>p.audio.setVolume(Number(e.target.value))}/></label>
 <label className="check-label">Saati göster<input type="checkbox" checked={p.clock} onChange={e=>p.onClock(e.target.checked)}/></label>
 <div className="share-section"><label>Küçük bir not<select aria-label="Paylaşım notu" value={personal} onChange={e=>{setPersonal(e.target.value);setCopied(false)}}>{['Bunu görünce aklıma sen geldin.','Bugün manzaran biraz güzel olsun.','Biraz burada kal.','Kahveni al, burası güzel.','Belki biraz burada kalırsın.','Bazı manzaralar paylaşınca daha güzel.',''].map(s=><option key={s} value={s}>{s||'Not ekleme'}</option>)}</select></label><button className="text-button" onClick={()=>void share()}>{copied?'Bağlantı kopyalandı':'Bu manzarayı paylaş ↗'}</button></div>
 <Credits/>
 </div></dialog></>
}

