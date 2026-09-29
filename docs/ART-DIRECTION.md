# Pencere — art direction

All production scenery is original generated artwork, not filtered photography. Research photographs were consulted for landmark facts, atmosphere and regional forms; they are not shipped or passed through a pixelation filter. The scenes are artistic interpretations, not geographically exact panoramas.

| Scene | Landmark / composition | Depth and light | Independent layers |
|---|---|---|---|
| Maiden sunset | Lantern, tapered upper roof, masonry shaft, low island buildings; centered for phones | Warm limestone against hazy peninsula; cool near sea | Illustrated balcony + table/cup; ferry/gull/cloud sprites; water glints; steam |
| Maiden night | Same location; separately painted night interpretation | Navy sky, amber tower, long water highlights | Darkened balcony; ferry; warm glints |
| Galata | Cylindrical masonry, circular gallery, conical roof above Beyoğlu roofs | Slate rainy haze, warm rooms, dark window surround | Window artwork; slowly falling droplets; distant cloud |
| Bosphorus | Bridge pylons and suspension catenary across distant hills | Amber coastline separated by navy water | Balcony, passing ferry, reflections |
| Ortaköy | Ornate single dome and two thin minarets with bridge behind | Rose dusk, white illuminated stone, blue-violet strait | Stone terrace, cloud, ferry, water |
| Istanbul roofs | Chimneys, terracotta roof planes, historic domes and minarets | Golden side light, increasingly pale distant ridges | Tile foreground, birds, cloud |
| Cappadocia | Eroded tuff cones, inhabited rock formations, layered valleys | Peach sunrise and violet valley haze | Stone overlook; five independently floating balloons at different scales |
| Aegean coast | An imagined Turkish coastal bay, stone/white houses and offshore island | Clear near water, warm distant sky | Flowering stone terrace, small distant boat, water |
| Paris | Iron lattice tower, mansard roofs, chimney stacks | Evening warm windows and mauve distance | Balcony and small cup, cloud, steam |
| Tokyo | Ordinary dense Japanese neighborhood, tower behind, narrow wet road | Restrained amber lights in blue-grey rain | Apartment window, droplets, distant traffic points |

Working resolution: 960×540; thumbnail: 480×270. Nearest-neighbor sampling is applied to already-created pixel artwork, never to a source photo. Landmark tops are protected by top-aligned controlled crop in wide phone viewports. Ortaköy's horizontal focal point is shifted to preserve its mosque in portrait. Foreground artwork is independent and occupies about 8–20% of the visible height. Source PNG originals are retained in art/originals, production assets in public/scenes and public/layers.

Motion uses bounded CSS/Web Animations, no continuous JS rendering. Ferry passes take 60–90 seconds followed by 45–90 seconds of quiet; gulls wait 20–60 seconds between flights. All timers/animations clean up, pause in hidden tabs and respect reduced motion. The rain is slow window droplets rather than fast full-screen streaks.

The final hero adds a separate transparent life layer: a black-haired adult man and blonde adult woman, viewed from behind with natural distance, plus a small coffee table and dusty/cornflower/hydrangea-blue planters. It occupies the lower-right and bottom edge without crossing the landmark. A clipped upper-body duplicate moves by about one pixel over 7.4 seconds for breathing/clothing/hair presence; two independently clipped flower groups sway in opposite directions over 8.5 and 10.2 seconds. The base layer remains stable, so the effect reads as ambient motion rather than character animation.
