import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir:'./tests',timeout:60000,
  use:{baseURL:'http://127.0.0.1:4173',headless:true,launchOptions:{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}},
  webServer:{command:'npm run preview -- --host 127.0.0.1',url:'http://127.0.0.1:4173',reuseExistingServer:true},
  reporter:[['list'],['json',{outputFile:'docs/runtime-results.json'}]],
})
