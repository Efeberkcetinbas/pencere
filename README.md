# Pencere — Final V1

Telefonu yatay çevirip masaya bıraktığınızda yaşayan küçük bir dijital pencereye dönüşen, 10 özgün pixel-art manzaralı ambient web deneyimi. Ana URL doğrudan İstanbul / Kız Kulesi gün batımı sahnesini açar; manzara seçici ikincil ekrandır.

## Deneyim

- Tüm 10 sahnede aynı yetişkin çiftin ortama göre uyarlanmış doğal kompozisyonu; uygun sahnelerde mavi çiçekler
- Kullanıcı etkileşiminden sonra başlayan, sahne geçişlerinde crossfade yapan yerel CC0 ortam sesleri
- Yaklaşık 3 saniyede kaybolan minimal kontroller
- Wake Lock kullanan, görünür çıkış kontrollü Coffee Mode
- Favoriler, son görüntülenenler, kalite/foreground/atmosfer seçenekleri ve kişisel manzara bağlantısı
- Portrait desteği; 667×375, 844×390 ve 932×430 yatay telefonlar öncelikli

## Teknoloji ve mimari

- React 19 + TypeScript + Vite
- `src/data/scenes.ts` merkezli data-driven scene registry
- AVIF/WebP background, optimize şeffaf WebP/PNG katmanlar
- CSS ve Web Animations API ile sınırlandırılmış hareket; sürekli `requestAnimationFrame` yok
- Web Audio API mixer, görünürlük yönetimi ve sahne crossfade’i
- Hash rotaları ve göreli Vite base path ile GitHub Pages uyumluluğu
- `prefers-reduced-motion`, safe area, fullscreen ve Wake Lock graceful fallback

## Kurulum ve doğrulama

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm test
npm run preview
```

Chrome tabanlı Playwright release testi production preview üzerinde çalışır. Gerçek 10 dakikalık soak testi için preview açıkken `node scripts/soak.mjs` kullanılabilir.

## Rotalar

- `/` veya `#/` — doğrudan Kız Kulesi hero sahnesi
- `#/scenes` — manzara seçici
- `#/scene/:slug` — standart sahne görünümü
- `#/view/:slug?message=...` — paylaşılabilir özel görünüm

Hash routing doğrudan yenilemede `404.html` gerektirmez. `base: './'` sayesinde repository adı bilinmeden GitHub project Pages altında asset yolları çözülür.

## Sahne ekleme

1. 16:9 ana görseli `art/originals` altına ekleyin ve `scripts/prepare-art.mjs` içindeki sahne listesine dahil edin.
2. `src/data/scenes.ts` içindeki `scenes` dizisine `Scene` tipine uygun kayıt ekleyin.
3. `variants`, `layers`, `foregrounds` ve `ambientSound` alanlarını tanımlayın.
4. Gerekirse `src/components/SceneArt.tsx` içindeki genel layer renderer’a yeni bir efekt türü ekleyin.
5. Lisanslı üçüncü taraf içerik kullanılıyorsa [ASSET_SOURCES.md](ASSET_SOURCES.md) belgesini güncelleyin.

Production yapısı:

```text
public/
  scenes/<scene>/background.avif
  scenes/<scene>/background.webp
  scenes/<scene>/thumbnail.webp
  layers/
  audio/
```

## GitHub Pages

`.github/workflows/pages.yml`, `main` branch push’unda `npm ci`, lint, typecheck ve build çalıştırır; yalnızca `dist/` Pages artifact’ı olarak yüklenir. Repository Pages ayarlarında kaynak olarak **GitHub Actions** seçilmelidir.

## İçerik ve lisans

Tüm sahne resimleri ile hero karakter/çiçek katmanı bu proje için özgün olarak üretildi. Araştırma fotoğrafları uygulamaya dahil edilmedi ve üretim girdisi olarak kullanılmadı. Dağıtılan sesler CC0 kaynaklarından yerel, kısaltılmış ve döngüye hazırlanmış türevlerdir. Ayrıntılar ve attribution kayıtları [ASSET_SOURCES.md](ASSET_SOURCES.md) içindedir.
