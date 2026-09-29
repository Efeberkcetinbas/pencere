import { useEffect, useState } from 'react'
import { ScenePicker } from './components/ScenePicker'
import { SceneViewer } from './components/SceneViewer'
import { getScene, scenes } from './data/scenes'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useAmbientAudio } from './hooks/useAmbientAudio'
import type { Scene } from './types/scene'
function readRoute(){
 const [path,query]=location.hash.replace(/^#\/?/,'').split('?')
 const parts=path.split('/')
 const params=new URLSearchParams(query)
 const picker=parts[0]==='scenes'
 return {id:picker?undefined:(parts[1]||'istanbul-maiden-tower'),picker,special:parts[0]==='view',message:params.has('message')?params.get('message')!.slice(0,160):undefined}
}
export default function App(){
 const [route,setRoute]=useState(readRoute)
 const [savedFavorites,setFavorites]=useLocalStorage<string[]>('pencere:favorites',[])
 const [savedRecent,setRecent]=useLocalStorage<string[]>('pencere:recent',[])
 const favorites=Array.isArray(savedFavorites)?savedFavorites.filter(s=>typeof s==='string'):[]
 const recent=Array.isArray(savedRecent)?savedRecent.filter(s=>typeof s==='string'):[]
 const scene=route.picker?undefined:getScene(route.id ?? 'istanbul-maiden-tower')
 const audio=useAmbientAudio(scene?.ambientSound??[])
 useEffect(()=>{const update=()=>setRoute(readRoute());window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update)},[])
 useEffect(()=>{
  if(!scene)return
  setRecent(current=>[scene.id,...(Array.isArray(current)?current:[]).filter(id=>id!==scene.id)].slice(0,4))
  document.title=`${scene.title} · ${scene.city} — Pencere`
 },[scene,setRecent])
 const open=(next:Scene)=>{location.hash=`/scene/${next.slug}`}
 const home=()=>{location.hash='/scenes';document.title='Pencere — Manzaralar'}
 const toggleFavorite=(id:string)=>setFavorites(current=>{const safe=Array.isArray(current)?current:[];return safe.includes(id)?safe.filter(item=>item!==id):[...safe,id]})
 return scene?<SceneViewer key={scene.id+String(route.special)+(route.message??'')} scene={scene} special={route.special} message={route.message} audio={audio} favorite={favorites.includes(scene.id)} onBack={home} onFavorite={()=>toggleFavorite(scene.id)}/>:<ScenePicker scenes={scenes} favorites={favorites} recent={recent} onOpen={open}/>
}

