import { chromium } from '@playwright/test'
import { createServer } from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'

const root=path.resolve('dist')
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.mp3':'audio/mpeg','.woff':'font/woff','.woff2':'font/woff2','.md':'text/markdown; charset=utf-8'}
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1')
  if(!url.pathname.startsWith('/pencere/')){res.writeHead(404).end();return}
  const relative=decodeURIComponent(url.pathname.slice('/pencere/'.length))||'index.html'
  const file=path.resolve(root,relative)
  if(!file.startsWith(root)){res.writeHead(403).end();return}
  const data=await fs.readFile(file)
  res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'}).end(data)
 }catch{res.writeHead(404).end()}
})
await new Promise(resolve=>server.listen(4180,'127.0.0.1',resolve))
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const page=await browser.newPage({viewport:{width:844,height:390}})
const errors=[];const bad=[];const audio=[]
page.on('pageerror',error=>errors.push(error.message))
page.on('console',message=>{if(['error','warning'].includes(message.type()))errors.push(message.text())})
page.on('response',response=>{if(response.status()>=400)bad.push(response.url());if(response.url().includes('/audio/'))audio.push(response.url())})
await page.goto('http://127.0.0.1:4180/pencere/')
await page.waitForSelector('.viewer.is-ready')
await page.getByRole('button',{name:'Ortam sesini aç'}).click()
await page.waitForTimeout(800)
const result={
 rootHero:await page.locator('[data-testid="hero-life"]').count()===1,
 images:await page.locator('img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)),
 favicon:await page.locator('link[rel="icon"]').getAttribute('href'),
 audioRequests:audio,
 errors,bad,
 pass:false,
}
result.pass=result.rootHero&&result.images&&result.favicon==='./favicon.svg'&&audio.length===2&&errors.length===0&&bad.length===0
await fs.writeFile('docs/pages-smoke-results.json',JSON.stringify(result,null,2))
await browser.close();await new Promise(resolve=>server.close(resolve))
console.log(JSON.stringify(result))
if(!result.pass)process.exitCode=1
