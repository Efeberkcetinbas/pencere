# TASK-002 audit

The workspace had no Git history or AGENTS.md. React/Vite foundation and hash routes are retained.

- SceneArt hardcoded three scene IDs; Scene.layers was unused. Replace with asset/effect descriptors consumed by one renderer.
- All backgrounds, landmarks and thumbnails were CSS silhouettes. Replace with original generated pixel artwork and separate foreground/motion assets.
- Web Audio synthesized noise; volume changes rebuilt sources and buffers. Replace with recorded, licensed local audio, bounded voices and gain-only volume changes.
- SceneViewer remounted on scene changes; audio ownership must move above the viewer for crossfades.
- Loading used a fixed timeout instead of image decode. Gate reveal on decode with timeout/error fallback.
- Coffee Mode exited on any tap and its effect depended on an unstable object. Use explicit exit control and visibility-aware wake lock.
- LocalStorage writes could throw; validate persisted arrays and catch unavailable storage.
- Portrait hid atmosphere controls entirely. Move all controls into an accessible settings dialog.
- Google fonts were remote. Bundle font subsets, favicon and Pages workflow.
- TASK-001 fullscreen PASS meant fallback only; native fullscreen was not verified. TASK-002 report will distinguish supported, denied and device-only checks.
