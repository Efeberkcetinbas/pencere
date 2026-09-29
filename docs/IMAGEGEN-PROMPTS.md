# Image generation prompt record

Mode: OpenAI built-in image generation. No reference photograph was passed to the generator. Real-world photos listed in `ASSET_SOURCES.md` were inspected only for independent geographic and architectural research.

## Scene set

Each 16:9 background prompt requested an original premium modern cinematic pixel-art environment, crisp intentional pixel clusters, restrained painterly shading, no text/logo/watermark, with the landmark protected from the bottom foreground crop:

1. Kız Kulesi sunset — centered tower, calm Bosphorus, muted coral/peach/lavender sunset, distant historical Istanbul silhouette.
2. Kız Kulesi night — centered warmly lit tower, navy sky, long restrained water reflections.
3. Rainy Galata — cylindrical masonry tower and conical roof above Beyoğlu roofs, blue-grey rain haze, warm windows.
4. Bosphorus night — bridge pylons and catenary, dark water, amber shoreline, deep navy atmosphere.
5. Ortaköy evening — mosque dome and minarets with bridge behind, rose dusk, blue-violet strait.
6. Istanbul rooftops — terracotta planes, chimneys, domes and minarets, golden side light and atmospheric depth.
7. Cappadocia dawn — layered tuff valleys and rock formations, peach/lavender sunrise, generous open sky.
8. Aegean coast — imagined Turkish bay, white/stone houses, clear water, warm restrained evening light.
9. Paris evening — Eiffel silhouette, mansard roofs and chimneys, mauve distance and warm windows.
10. Tokyo rain — dense ordinary neighborhood, distant tower, narrow wet road, restrained amber lights and blue-grey rain.

Separate transparent prompts requested a balcony railing/table, window surround, stone terrace, tiled rooftop, and a sprite sheet containing a ferry, gull, balloon and cloud, all in the same pixel-art language.

## Final hero foreground prompt

> Create a transparent 16:9 foreground overlay for a responsive website hero: two generic adults quietly viewing an Istanbul sunset from behind, a short black-haired man in dark simple clothing and a natural blonde-haired woman in warm neutral clothing, placed on the lower-right with comfortable distance. Add sparse dusty/cornflower/hydrangea-blue balcony flowers along the lower edge and a tiny side table with one coffee cup. Keep all content within the lowest 23%, preserve the center/left landmark area, use premium 16/32-bit cinematic pixel art with warm rim light and adult proportions. Actual alpha transparency; no scenery, sky, water, buildings, tower, railing, text, logo, embrace, kissing, hearts, anime, chibi or photorealism.

The selected output is saved as `art/originals/hero-people-flowers-v1.png`, then downsampled and nearest-neighbor expanded into `public/layers/hero-people-flowers.webp` to align its pixel grid with the existing scene.

## Global couple variants

Mode: OpenAI built-in image generation, using the final hero foreground only as a character/style reference. The same adult couple, rear/three-quarter view, restrained body language and pixel-art scale were required in every prompt. No real-world photograph was used.

1. Window / rain — place the blonde woman nearest the implied glass and the black-haired man slightly behind with a cup; cool rainy rim light, one sparse muted-blue planter, transparent 16:9 overlay, lower-left composition. Saved as `art/originals/couple-window-rain-v1.png`.
2. Terrace / open air — place both adults at a quiet overlook, woman leaning lightly toward the implied view and man just behind; warm open-air rim light and sparse dusty-blue flowers at the lower corners, transparent 16:9 overlay. Saved as `art/originals/couple-terrace-v1.png`.
3. Night balcony — place both adults on the lower-right in slightly darker versions of the same clothing, woman holding a cup; cool navy ambience with restrained warm city rim light and deep-blue flowers, transparent 16:9 overlay. Saved as `art/originals/couple-night-v1.png`.
4. Rooftop — seat the black-haired man on an implied low ledge and place the blonde woman standing nearby, both facing the view; warm roof light, one small muted-blue pot, transparent 16:9 overlay. Saved as `art/originals/couple-rooftop-v1.png`.

The production files are `public/layers/couple-window.webp`, `couple-terrace.webp`, `couple-night.webp` and `couple-rooftop.webp`. They use the same downsample/nearest-neighbor expansion pipeline as the hero layer.
