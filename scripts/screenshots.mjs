import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const page=await browser.newPage({viewport:{width:1440,height:900}})
await fs.mkdir('docs/screenshots',{recursive:true})
await page.goto('http://127.0.0.1:4173/#/scenes')
await page.screenshot({path:'docs/screenshots/picker-desktop.png',fullPage:true})
for(const [id,w,h] of [['hero',1920,1080],['hero',667,375],['hero',844,390],['hero',932,430],['hero',390,844],['istanbul-galata',667,375],['paris-eiffel',932,430],['cappadocia',844,390],['tokyo-rain',390,844],['istanbul-ortakoy',375,667]]){
 await page.setViewportSize({width:w,height:h});await page.goto(id==='hero'?'http://127.0.0.1:4173/':'http://127.0.0.1:4173/#/scene/'+id);await page.waitForSelector('.is-ready');await page.waitForTimeout(3600);await page.screenshot({path:`docs/screenshots/${id}-${w}x${h}.png`})
}
await browser.close()
