import fs from 'node:fs/promises'
import sharp from 'sharp'
await fs.mkdir('public/layers',{recursive:true})
const report=[]
const scenes=['maiden-sunset','maiden-night','galata','bosphorus','ortakoy','rooftops','cappadocia','aegean','paris','tokyo']
for(const id of scenes){
 const path=`art/originals/${id}.png`
 await fs.mkdir(`public/scenes/${id}`,{recursive:true})
 const art=await sharp(path).resize(960,540,{fit:'fill',kernel:'nearest'}).png().toBuffer()
 await sharp(art).avif({quality:75,effort:6,chromaSubsampling:'4:4:4'}).toFile(`public/scenes/${id}/background.avif`)
 await sharp(art).webp({quality:92,effort:6}).toFile(`public/scenes/${id}/background.webp`)
 await sharp(art).resize(480,270,{kernel:'nearest'}).webp({quality:85}).toFile(`public/scenes/${id}/thumbnail.webp`)
 report.push({id,bytes:(await fs.stat(`public/scenes/${id}/background.avif`)).size})
}
for(const id of ['balcony','window','terrace','rooftop']){
 await sharp(`art/originals/${id}.png`).resize(960,540,{fit:'fill',kernel:'nearest'}).png({palette:true,colours:256}).toFile(`public/layers/${id}.png`)
}
const sprite='art/originals/sprites.png'
const meta=await sharp(sprite).metadata()
const crops=[
 ['ferry',.14,.045,.70,.24,160],
 ['gull',.30,.32,.41,.15,40],
 ['balloon',.33,.505,.33,.275,80],
 ['cloud',.06,.82,.87,.12,400]
]
for(const [id,x,y,w,h,width] of crops){
 await sharp(sprite).extract({left:Math.round(x*meta.width),top:Math.round(y*meta.height),width:Math.round(w*meta.width),height:Math.round(h*meta.height)}).resize(width,null,{kernel:'nearest'}).png().toFile(`public/layers/${id}.png`)
}
await sharp('art/originals/hero-people-flowers-v1.png').resize(480,270,{fit:'fill',kernel:'nearest'}).resize(960,540,{kernel:'nearest'}).webp({lossless:true,effort:6}).toFile('public/layers/hero-people-flowers.webp')
report.push({id:'hero-people-flowers',bytes:(await fs.stat('public/layers/hero-people-flowers.webp')).size})
await sharp('public/layers/hero-people-flowers.webp').extract({left:0,top:385,width:300,height:155}).webp({lossless:true,effort:6}).toFile('public/layers/blue-flowers-left.webp')
await sharp('public/layers/hero-people-flowers.webp').extract({left:815,top:385,width:145,height:155}).webp({lossless:true,effort:6}).toFile('public/layers/blue-flowers-right.webp')
report.push({id:'blue-flowers-left',bytes:(await fs.stat('public/layers/blue-flowers-left.webp')).size},{id:'blue-flowers-right',bytes:(await fs.stat('public/layers/blue-flowers-right.webp')).size})
for(const [id,file] of [['couple-window','couple-window-rain-v1'],['couple-terrace','couple-terrace-v1'],['couple-night','couple-night-v1'],['couple-rooftop','couple-rooftop-v1']]){
 await sharp(`art/originals/${file}.png`).resize(480,270,{fit:'fill',kernel:'nearest'}).resize(960,540,{kernel:'nearest'}).webp({lossless:true,effort:6}).toFile(`public/layers/${id}.webp`)
 report.push({id,bytes:(await fs.stat(`public/layers/${id}.webp`)).size})
}
await fs.writeFile('docs/asset-sizes.json',JSON.stringify(report,null,2))
console.log(report)

