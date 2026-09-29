import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const page=await browser.newPage({viewport:{width:844,height:390}})
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text())})
await page.addInitScript(()=>{
 const original=AudioContext.prototype.createBufferSource
 window.__voices={created:0,active:0,max:0}
 AudioContext.prototype.createBufferSource=function(){const s=original.call(this);window.__voices.created++;window.__voices.active++;window.__voices.max=Math.max(window.__voices.max,window.__voices.active);s.addEventListener('ended',()=>window.__voices.active--);return s}
})
await page.goto('http://127.0.0.1:4173/')
await page.waitForSelector('.is-ready')
await page.getByRole('button',{name:'Ortam sesini aç'}).click()
await page.getByRole('button',{name:'Kahve modu',exact:true}).click()
const started=Date.now();const samples=[]
const cdp=await page.context().newCDPSession(page)
await cdp.send('Performance.enable')
await fs.mkdir('docs/screenshots',{recursive:true})
for(let minute=0;minute<=10;minute++){
 if(minute)await page.waitForTimeout(60000)
 const heap=await cdp.send('Runtime.getHeapUsage')
 const sample=await page.evaluate(()=>({
  coffee:document.querySelector('.viewer').classList.contains('coffee-mode'),
  ui:Number(getComputedStyle(document.querySelector('.coffee-controls')).opacity),
  images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),
  nodes:document.querySelectorAll('*').length,
  animations:document.getAnimations().length,
  heroLife:document.querySelectorAll('[data-testid="hero-life"]').length,
  birdLayers:document.querySelectorAll('.sprite-birds').length,
  ferryLayers:document.querySelectorAll('.sprite-ferry').length,
  flowerAnimations:document.querySelectorAll('.hero-flowers-left,.hero-flowers-right').length,
  characterAnimations:document.querySelectorAll('.hero-people-motion').length,
  voices:window.__voices,
 }))
 samples.push({minute,elapsed:Date.now()-started,heap:heap.usedSize,...sample})
 console.log(JSON.stringify(samples.at(-1)))
 if(minute===1||minute===10)await page.screenshot({path:`docs/screenshots/coffee-${minute}min.png`})
}
const result={started:new Date(started).toISOString(),elapsed:Date.now()-started,errors,samples,pass:errors.length===0&&samples.every(s=>s.coffee&&s.images&&s.heroLife===1&&s.birdLayers===1&&s.ferryLayers===1&&s.flowerAnimations===2&&s.characterAnimations===1&&s.voices.active<=2)&&samples.slice(1).every(s=>s.ui===0)}
await fs.writeFile('docs/soak-results.json',JSON.stringify(result,null,2))
await browser.close()
if(!result.pass)process.exitCode=1
