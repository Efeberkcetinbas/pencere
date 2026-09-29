import { useEffect, useState } from 'react'
export function usePortraitHint() {
 const [visible,setVisible]=useState(()=>{try{return !localStorage.getItem('pencere:portrait-hint')&&matchMedia('(orientation: portrait)').matches}catch{return false}})
 useEffect(()=>{
  if(!visible)return
  try{localStorage.setItem('pencere:portrait-hint','seen')}catch{/* optional preference */}
  const timer=setTimeout(()=>setVisible(false),8000)
  return()=>clearTimeout(timer)
 },[visible])
 return visible
}
