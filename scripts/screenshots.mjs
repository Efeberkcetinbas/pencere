import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const page=await browser.newPage({viewport:{width:1440,height:900}})
await fs.mkdir('docs/screenshots',{recursive:true})
await page.goto('http://127.0.0.1:4173/#/scenes')
await page.screenshot({path:'docs/screenshots/picker-desktop.png',fullPage:true})
const ids=['istanbul-maiden-tower','istanbul-maiden-night','istanbul-galata','istanbul-bosphorus','istanbul-ortakoy','istanbul-rooftops','cappadocia','aegean-coast','paris-eiffel','tokyo-rain']
for(const id of ids){
 for(const [w,h] of [[667,375],[844,390],[932,430]]){
  await page.setViewportSize({width:w,height:h});await page.goto(id==='istanbul-maiden-tower'?'http://127.0.0.1:4173/':'http://127.0.0.1:4173/#/scene/'+id);await page.waitForSelector('.is-ready');await page.waitForTimeout(400);await page.screenshot({path:`docs/screenshots/${id}-${w}x${h}.png`})
 }
}
await browser.close()
