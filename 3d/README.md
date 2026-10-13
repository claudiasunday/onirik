# Visor 3D — Keiki

Visor 3D de la taula Keiki per a la fitxa de producte. Funciona sense build step a la web:
els fitxers de `dist/` i `assets/` ja estan generats.

## Ús a qualsevol pàgina

```html
<link rel="preload" as="image" href="3d/assets/poster.webp" type="image/webp">  <!-- només si és a la part visible -->
<script type="module" src="3d/dist/onirik-board.js"></script>

<onirik-board-3d></onirik-board-3d>
```

- Mostra el **pòster** (`assets/poster.webp`) a l'instant i carrega el 3D quan el component s'apropa a la pantalla.
- Mida: ocupa el 100 % de l'ample amb proporció 4:5. Canvia l'ample amb CSS; si en canvies la proporció, el pòster es veurà amb `object-fit: contain`.
- Atributs: `loading="lazy | eager | interaction"`, `face="top | bottom"`, `assets="/ruta/a/assets/"`.
- API: `el.showFace('bottom')`, esdeveniments `ready` i `facechange`.
- Colors del selector: variables CSS `--ob-fg`, `--ob-bg`, `--ob-border`, `--ob-active-bg`, `--ob-active-fg`, `--ob-focus`.
- Sense WebGL2 o amb "estalvi de dades" activat, es queda el pòster (amb dades estalviades, carrega en tocar-lo).

## Pes i temps (4G simulat, CPU de mòbil mitjà)

| | Versió 1 (HTML únic) | Versió 2 (aquesta) |
|---|---|---|
| Primer que es veu | res fins als 6,9 s | pòster als 0,3 s |
| 3D interactiu | 6,9 s | 1,8 s, i només si el component és a pantalla |
| JavaScript | 2,2 MB, 6 peticions | 2 KB inicials + 153 KB gzip (1 petició, diferida) |
| Textures | generades al navegador (~1,4 s de CPU) | 250 KB de WebP precuinats |

## Estructura

```
src/config.js      mides, colors, franja, càmera, contorn
src/geometry.js    contorn, offset del grip, cos amb bisell, disc, logo inferior
src/scene.js       escena, llums, materials (un per cara), càmera, gir de cara
src/viewer.js      entrada del chunk 3D: carrega assets/ i munta l'escena
src/element.js     <onirik-board-3d>: pòster + càrrega diferida
src/procedural.js  generadors de textures (només els fa servir el forn)
bake.html          forn: genera textures + pòster i els descarrega
```

## Canviar el disseny

1. Edita `src/config.js` (mides, colors, posicions) o enganxa els SVG reals a `bake.html`.
2. `npm install && npm run build`
3. Obre `bake.html` amb un servidor local (`npx serve .`), revisa la taula i **Descarregar assets**.
   Substitueix els fitxers de `assets/`.

El pòster es genera amb la mateixa escena i càmera que el visor, així que el fos pòster → 3D no salta.
