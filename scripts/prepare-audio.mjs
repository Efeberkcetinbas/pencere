import fs from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import ffmpeg from 'ffmpeg-static'
const recordings = {
 sea: 'https://cdn.freesound.org/previews/699/699225_10386277-hq.mp3',
 rain: 'https://cdn.freesound.org/previews/607/607228_11069322-hq.mp3',
 wind: 'https://bigsoundbank.com/UPLOAD/mp3/0097.mp3',
 city: 'https://bigsoundbank.com/UPLOAD/mp3/2763.mp3',
}
await fs.mkdir('tmp/audio',{recursive:true})
await fs.mkdir('public/audio',{recursive:true})
for (const [id,url] of Object.entries(recordings)) {
 const input=`tmp/audio/${id}.mp3`
 if(!await fs.stat(input).catch(()=>null)) {
  const response=await fetch(url)
  if(!response.ok) throw new Error(`${id}: ${response.status}`)
  await fs.writeFile(input,Buffer.from(await response.arrayBuffer()))
 }
 // 48 seconds, quiet normalized mix; wrap last 3 seconds into the beginning.
 const pcm=execFileSync(ffmpeg,['-v','error','-ss','4','-i',input,'-t','51','-af','highpass=f=70,lowpass=f=6500,loudnorm=I=-25:TP=-5:LRA=7','-ar','32000','-ac','2','-f','f32le','pipe:1'],{maxBuffer:32*1024*1024})
 const frames=32000*48, cross=32000*3
 if(pcm.length<32000*51*8)throw new Error(`${id}: recording too short`)
 const output=Buffer.from(pcm.subarray(0,frames*8))
 for(let i=0;i<cross;i++)for(let channel=0;channel<2;channel++){
   const t=i/cross
   const head=pcm.readFloatLE((i*2+channel)*4)
   const tail=pcm.readFloatLE(((frames+i)*2+channel)*4)
   output.writeFloatLE(head*t+tail*(1-t),(i*2+channel)*4)
 }
 execFileSync(ffmpeg,['-v','error','-y','-f','f32le','-ar','32000','-ac','2','-i','pipe:0','-b:a','96k',`public/audio/${id}.mp3`],{input:output,maxBuffer:1024*1024})
 console.log(id,(await fs.stat(`public/audio/${id}.mp3`)).size)
}
