import { useState } from 'react'
import { assetUrl, type Scene } from '../types/scene'
import { Credits } from './Credits'
interface Props { scenes:Scene[];favorites:string[];recent:string[];onOpen:(scene:Scene)=>void }
export function ScenePicker({scenes,favorites,recent,onOpen}:Props){
 const [filter,setFilter]=useState('Hepsi')
 const filtered=scenes.filter(s=>filter==='Hepsi'||filter==='Favoriler'&&favorites.includes(s.id)||s.category===filter)
 const recentScenes=recent.map(id=>scenes.find(s=>s.id===id)).filter(Boolean) as Scene[]
 return <main className="picker"><header className="picker-header"><a className="brand" href="#/"><span className="brand-mark">P</span>Pencere</a><p className="eyebrow">Biraz uzaklara bak.</p><h1>Bugün nereyi<br/><em>izlemek istersin?</em></h1><p className="picker-intro">Bir manzara aç. Kahveni al.<br/>Dünya bir süre kendi halinde aksın.</p></header>
 <nav className="filters" aria-label="Manzara filtreleri">{['Hepsi','İstanbul','Türkiye','Dünya','Favoriler'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}<button className="random-button" onClick={()=>onOpen(scenes[Math.floor(Math.random()*scenes.length)])}>Bir yer seç ↗</button></nav>
 {recentScenes.length>0&&filter==='Hepsi'&&<section className="recent"><h2>Son baktıkların</h2><div>{recentScenes.slice(0,3).map(s=><button key={s.id} onClick={()=>onOpen(s)}>{s.title} · {s.variants[0].label}</button>)}</div></section>}
 <section className="scene-grid" aria-label="Manzaralar">{filtered.map((s,i)=><button key={s.id} className={`scene-card ${s.featured&&filter==='Hepsi'?'featured':''}`} onClick={()=>onOpen(s)}><img src={assetUrl(s.thumbnail)} alt="" loading={i<2?'eager':'lazy'} width="480" height="270"/><span className="card-shade"/><span className="card-copy"><span>{s.city}</span><strong>{s.title}</strong><small>{s.variants[0].label}</small></span><span className="card-open" aria-hidden="true">↗</span>{favorites.includes(s.id)&&<span className="card-favorite" aria-label="Favori">▰</span>}</button>)}</section>
 {filtered.length===0&&<p className="empty-state">Henüz favori manzaran yok.</p>}
 <footer><span>Acele etme. Manzara burada.</span><Credits/></footer></main>
}

