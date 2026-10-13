// Forn: genera les textures procedurals, en previsualitza el resultat amb la mateixa escena
// que el visor i exporta assets/*.webp + outline.json + poster.webp.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { CONFIG } from './config.js';
import { outlineFromHalf, boardDims } from './geometry.js';
import { makeTopWood, makeBottomMaps, makeEdge, makeGrip, makeLogo, makeShadow } from './procedural.js';
import { createViewer } from './scene.js';
import { TEXTURE_FILES } from './viewer.js';

function outlineFromSVG(svgText) {
  const data = new SVGLoader().parse(svgText);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  if (!shapes.length) throw new Error("L'SVG del contorn no té cap path tancat");
  const area = (s) => Math.abs(THREE.ShapeUtils.area(s.getPoints()));
  const shape = shapes.sort((a, b) => area(b) - area(a))[0];
  const pts = shape.getSpacedPoints(360); pts.pop();
  const box = new THREE.Box2().setFromPoints(pts);
  const L = box.max.y - box.min.y, cx = (box.min.x + box.max.x) / 2;
  return pts.map((p) => [(p.x - cx) / L, (p.y - box.min.y) / L]);   // punta a dalt a l'SVG → y=0
}

const QUALITY = { color: 0.86, data: 0.92 };
const toBlob = (canvas, q) => new Promise((res) => canvas.toBlob(res, 'image/webp', q));

export async function bake({ outlineSVG = null, logoSVG = null, previewCanvas, previewContainer } = {}) {
  const t0 = performance.now();
  const norm = outlineSVG ? outlineFromSVG(outlineSVG) : outlineFromHalf();
  const D = boardDims(norm, CONFIG);
  const bottom = makeBottomMaps(D);
  const grip = makeGrip();
  const canvases = {
    topWood: makeTopWood(D),
    bottomColor: bottom.color,
    bottomRough: bottom.rough,
    bottomNormal: bottom.normal,
    edge: makeEdge(),
    gripColor: grip.color,
    gripNormal: grip.normal,
    discLogo: await makeLogo(512, 1 / CONFIG.disc.logoScale, 16, logoSVG),
    bottomLogo: await makeLogo(384, CONFIG.bottomLogo.extent, 12, logoSVG),
    shadow: makeShadow(D),
  };
  const genMs = Math.round(performance.now() - t0);
  const tex = Object.fromEntries(Object.entries(canvases).map(([k, c]) => [k, new THREE.CanvasTexture(c)]));
  const viewer = await createViewer({ canvas: previewCanvas, container: previewContainer, D, tex, preserveDrawingBuffer: true });

  async function exportAll() {
    const colorKeys = new Set(['topWood', 'bottomColor', 'edge', 'gripColor', 'shadow']);
    const files = {};
    for (const [k, c] of Object.entries(canvases)) files[TEXTURE_FILES[k]] = await toBlob(c, colorKeys.has(k) ? QUALITY.color : QUALITY.data);
    const rounded = norm.map(([x, y]) => [Math.round(x * 1e5) / 1e5, Math.round(y * 1e5) / 1e5]);
    files['outline.json'] = new Blob([JSON.stringify({ points: rounded })], { type: 'application/json' });
    files['poster.webp'] = await renderPoster();
    return files;
  }

  // Pòster: mateixa càmera i encaix que el component (4:5, franja del selector reservada)
  async function renderPoster() {
    const { width, height } = CONFIG.poster;
    const r = viewer.renderer, prevPR = r.getPixelRatio();
    const box = previewContainer.getBoundingClientRect();
    previewContainer.style.width = width + 'px'; previewContainer.style.height = height + 'px';
    r.setPixelRatio(1);
    viewer.resetView();
    r.render(viewer.scene, viewer.camera);
    const blob = await toBlob(r.domElement, 0.9);
    previewContainer.style.width = box.width + 'px'; previewContainer.style.height = box.height + 'px';
    r.setPixelRatio(prevPR); viewer.resize();
    return blob;
  }

  return { viewer, exportAll, genMs };
}
