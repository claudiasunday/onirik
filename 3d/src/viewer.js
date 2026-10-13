// Chunk pesat (Three.js + escena). El carrega <onirik-board-3d> només quan cal.
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { boardDims } from './geometry.js';
import { createViewer } from './scene.js';

export const TEXTURE_FILES = {
  topWood: 'top-wood.webp',
  bottomColor: 'bottom-color.webp',
  bottomRough: 'bottom-rough.webp',
  bottomNormal: 'bottom-normal.webp',
  edge: 'edge.webp',
  gripColor: 'grip-color.webp',
  gripNormal: 'grip-normal.webp',
  discLogo: 'disc-logo.webp',
  bottomLogo: 'bottom-logo.webp',
  shadow: 'shadow.webp',
};

export async function mount({ canvas, container, assetsBase, reduceMotion = false }) {
  const base = assetsBase.endsWith('/') ? assetsBase : assetsBase + '/';
  const loader = new THREE.TextureLoader();
  // Tot en paral·lel: contorn + 10 textures
  const [outline, ...texList] = await Promise.all([
    fetch(base + 'outline.json').then((r) => { if (!r.ok) throw new Error('outline.json ' + r.status); return r.json(); }),
    ...Object.values(TEXTURE_FILES).map((f) => loader.loadAsync(base + f)),
  ]);
  const tex = Object.fromEntries(Object.keys(TEXTURE_FILES).map((k, i) => [k, texList[i]]));
  const D = boardDims(outline.points, CONFIG);
  return createViewer({ canvas, container, D, tex, cfg: CONFIG, reduceMotion });
}
