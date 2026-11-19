# Rohan Krishna — 3D Portfolio

A responsive personal portfolio built with semantic HTML, CSS and Three.js.

## Run locally

Because the 3D scene uses JavaScript modules, run the site through a local web server rather than opening `index.html` directly.

### Python
```bash
python -m http.server 8000
```
Then open http://localhost:8000

### Node.js
```bash
npx serve .
```

## Files
- `index.html` — page structure and portfolio content
- `styles.css` — responsive layout, typography, effects and project artwork
- `script.js` — Three.js hero scene and interactions

## Customize
- Update personal details, descriptions and links in `index.html`.
- Adjust colors in the `:root` variables in `styles.css`.
- The Three.js scene is in `script.js`.

## Notes
- Three.js and Google Fonts are loaded from CDNs, so an internet connection is needed for those assets.
- The 3D scene respects reduced-motion preferences and caps renderer pixel ratio for performance.
