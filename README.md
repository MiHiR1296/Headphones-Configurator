# Headphones Configurator

Premium Three.js product configurator for the Auralux H1 headphones concept.

Live deployment target: `https://mihir1296.github.io/Headphones-Configurator/`

## Features

- Web-ready GLB exported from the Blender source scene with render-visible modifiers evaluated.
- Full-screen React + Three.js configurator with startup reveal and idle motion.
- Texture-preserving material controls for pearl earcups, headband, brushed metal, grey plastic, and stitches.
- Presets, hero/detail camera views, pauseable idle rotation, dedicated information mode, screenshots, and shareable URL state.
- GitHub Pages workflow for automatic deployment from `main`.

## Local Development

```bash
npm install
npm run dev
```

Production preview:

```bash
npm run build
npm run preview
```

## Asset Pipeline

The current GLB lives at:

```text
public/assets/models/headphones.glb
```

It was exported from:

```text
/Users/mihirbotle/Desktop/Personal/Website/Blender Archviz/Headphones/Headphones.blend
```

The app maps mesh names from that export to semantic groups in `src/config/product.ts`, then tints cloned Blender materials so texture, normal, roughness, and metallic detail remain visible. Source-material options keep the imported Blender materials untouched.

## Verification

Checks run during implementation:

- `npm run lint`
- `npm run build`
- Browser verification on desktop and mobile using Playwright with material controls, information-mode focus checks, URL-state checks, and screenshots.
