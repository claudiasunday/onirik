// Generadors procedurals de textures (canvas). NOMÉS els fa servir el forn (bake.html):
// el visor carrega els WebP ja cuinats i no executa res d'això.
import { CONFIG } from './config.js';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const srgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/* ---------- Soroll de valor (determinista, opcionalment periòdic) ---------- */
function hash2(i, j, s) {
  let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(s, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}
function vnoise(x, y, s = 0, px = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  let x0 = xi, x1 = xi + 1, y0 = yi, y1 = yi + 1;
  if (px) { const w = (q) => ((q % px) + px) % px; x0 = w(x0); x1 = w(x1); y0 = w(y0); y1 = w(y1); }
  const a = hash2(x0, y0, s), b = hash2(x1, y0, s), c = hash2(x0, y1, s), d = hash2(x1, y1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, oct, s = 0, px = 0) {
  let sum = 0, amp = 0.5, norm = 0;
  for (let o = 0; o < oct; o++) {
    sum += amp * vnoise(x, y, s + o * 17, px); norm += amp;
    x *= 2; y *= 2; if (px) px *= 2; amp *= 0.5;
  }
  return sum / norm;
}

export function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function heightToNormalCanvas(h, w, hh, strength, wrap) {
  const c = makeCanvas(w, hh), ctx = c.getContext('2d'), img = ctx.createImageData(w, hh), d = img.data;
  const at = (x, y) => {
    if (wrap) { x = (x + w) % w; y = (y + hh) % hh; } else { x = Math.min(w - 1, Math.max(0, x)); y = Math.min(hh - 1, Math.max(0, y)); }
    return h[y * w + x];
  };
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
    const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
    const l = Math.hypot(dx, dy, 1), i = (y * w + x) * 4;
    d[i] = (-dx / l * 0.5 + 0.5) * 255; d[i + 1] = (-dy / l * 0.5 + 0.5) * 255; d[i + 2] = (1 / l * 0.5 + 0.5) * 255; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* ---------- Veta de bedoll: pàl·lida, fibra fina longitudinal i alguna flama suau ---------- */
function woodSample(xCm, sCm, seed) {
  const warp = (fbm(xCm * 0.03 + seed, sCm * 0.008, 3, seed) - 0.5) * 30;
  const ring = Math.abs(((xCm + warp) / 4.2) % 1 + 1) % 1;
  const line = smooth(0.44, 0.5, ring) * (1 - smooth(0.5, 0.58, ring));
  const band = fbm(xCm * 0.06 + 40, sCm * 0.015, 3, seed + 3);
  const streak = fbm(xCm * 3.2 + seed, sCm * 0.05, 2, seed + 9);
  const fleck = vnoise(xCm * 14, sCm * 0.7, seed + 21);
  const tone = 0.16 * line + 0.34 * (band - 0.5) * 2 + 0.22 * (streak - 0.5) * 2 + 0.07 * (fleck - 0.5) * 2;
  return { tone, height: 0.3 * line + 0.7 * streak };
}

/* 1) Fusta de la cara superior (marge + disc) */
export function makeTopWood(D, C = CONFIG.colors) {
  const w = 384, h = Math.round(w * D.L / D.W);
  const c = makeCanvas(w, h), ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
  const base = srgb(C.wood), dark = srgb(C.woodDark);
  for (let j = 0; j < h; j++) {
    const s = (j + 0.5) / h * D.L;
    for (let i = 0; i < w; i++) {
      const { tone } = woodSample((i + 0.5) / w * D.W, s, 11);
      const col = mix(base, dark, clamp01(0.35 + tone * 0.9));
      d.set([col[0], col[1], col[2], 255], (j * w + i) * 4);
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* 2) Cara inferior: fusta + pintura verda + franja (coordenades de la foto 2) */
export function makeBottomMaps(D, cfg = CONFIG) {
  const C = cfg.colors, S = cfg.stripe;
  const w = 640, h = Math.round(w * D.L / D.W);
  const color = makeCanvas(w, h), rough = makeCanvas(w, h);
  const cctx = color.getContext('2d'), rctx = rough.getContext('2d');
  const cimg = cctx.createImageData(w, h), rimg = rctx.createImageData(w, h);
  const height = new Float32Array(w * h);
  const base = srgb(C.wood), dark = srgb(C.woodDark), green = srgb(C.green), orange = srgb(C.orange);
  const angle = Math.atan2(-S.slope * D.L, D.W);
  const pxPerFy = h * Math.cos(angle);
  const layers = [[0, null, 0.74, 0], [S.bands[0], orange, 0.84, 1], [S.bands[1], null, 0.74, 0], [S.bands[2], green, 0.9, 1], [S.bands[3], null, 0.74, 0]];
  for (let j = 0; j < h; j++) {
    const v = (j + 0.5) / h, fy = 1 - v, s = v * D.L;
    for (let i = 0; i < w; i++) {
      const u = (i + 0.5) / w, fx = u, x = (1 - u) * D.W;   // uBot ja emmiralla: u = fx de la foto
      const wd = woodSample(x, s, 5);
      const col = mix(base, dark, clamp01(0.35 + wd.tone * 0.9));
      const dist = fy - (S.edgeAtCenter + S.slope * (fx - 0.5));
      let paint = green, rgh = 0.9, isPaint = 1;
      for (const [o, lc, lr, lp] of layers) {
        const f = clamp01(0.5 + (dist - o) * pxPerFy);
        if (f <= 0) break;
        paint = mix(paint, lc || col, f);
        rgh += (lr - rgh) * f; isPaint += (lp - isPaint) * f;
      }
      const speck = (vnoise(i * 0.9, j * 0.9, 77) - 0.5) * 0.06 + (fbm(x * 0.4, s * 0.4, 2, 31) - 0.5) * 0.06;
      const pc = paint.map((cc) => cc * (1 + speck * isPaint));
      const k = j * w + i;
      cimg.data.set([pc[0], pc[1], pc[2], 255], k * 4);
      const rv = Math.round(rgh * 255); rimg.data.set([rv, rv, rv, 255], k * 4);
      // relleu: fibra de la fusta + esglaó de la pintura (sense el motejat, que pesa molt i no es veu)
      height[k] = wd.height * 0.25 * (1 - isPaint) + isPaint * 0.35;
    }
  }
  cctx.putImageData(cimg, 0, 0); rctx.putImageData(rimg, 0, 0);
  return { color, rough, normal: heightToNormalCanvas(height, w, h, 1.6, false) };
}

/* 3) Cantell de contraxapat: capes horitzontals, periòdic al llarg del perímetre */
export function makeEdge(cfg = CONFIG) {
  const C = cfg.colors, N = cfg.plies;
  const w = 1024, h = 256, c = makeCanvas(w, h), ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data;
  const A = srgb(C.plyA), B = srgb(C.plyB), G = srgb(C.glue);
  const plyJitter = Array.from({ length: N + 1 }, (_, k) => (k === 0 || k === N) ? 0 : (hash2(k, 3, 9) - 0.5) * 0.18);
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h;
    for (let x = 0; x < w; x++) {
      const wav = (vnoise(x / w * 24, v * 4, 5, 24) - 0.5) * 0.25 / N;
      const pv = (v + wav) * N;
      const k = Math.min(N - 1, Math.max(0, Math.floor(pv)));
      const isA = k % 2 === 0;
      let col = isA ? A : B;
      if (isA) { const st = vnoise(x / w * 220, pv * 9, 13, 220) - 0.5; col = col.map((cc) => cc * (1 + st * 0.10)); }
      else { const po = vnoise(x / w * 520, pv * 40, 17, 520); col = col.map((cc) => cc * (1 - 0.12 * smooth(0.62, 0.85, po))); }
      const tone = (vnoise(x / w * 12, k * 3.1 + plyJitter[k], 21, 12) - 0.5) * 0.08;
      col = col.map((cc) => cc * (1 + tone));
      const dEdge = Math.abs(pv - Math.round(pv)) * (h / N);
      const glue = (Math.round(pv) > 0 && Math.round(pv) < N) ? 1 - smooth(0.4, 1.4, dEdge) : 0;
      col = mix(col, G, glue * 0.55);
      d.set([col[0], col[1], col[2], 255], (y * w + x) * 4);
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/* 4) Grip: teixit de tafetà + borrissol, tessel·la periòdica */
export function makeGrip() {
  const n = 256, P8 = 8, h = new Float32Array(n * n);
  const c = makeCanvas(n, n), ctx = c.getContext('2d'), img = ctx.createImageData(n, n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const cx = Math.floor(x / P8), cy = Math.floor(y / P8);
    const fx = (x % P8 + 0.5) / P8, fy = (y % P8 + 0.5) / P8;
    const warp = Math.sin(Math.PI * fx) * (0.55 + 0.45 * (0.5 + 0.5 * Math.cos(Math.PI * (y + 0.5) / P8 + Math.PI * cx)));
    const weft = Math.sin(Math.PI * fy) * (0.55 + 0.45 * (0.5 + 0.5 * Math.cos(Math.PI * (x + 0.5) / P8 + Math.PI * cy + Math.PI)));
    const fuzz = vnoise(x / 4, y / 4, 3, n / 4) * 0.35 + vnoise(x / 2, y / 2, 7, n / 2) * 0.15;
    const v = Math.max(warp, weft) * 0.75 + fuzz;
    h[y * n + x] = v;
    const g = 255 * (0.80 + 0.2 * clamp01(v));
    img.data.set([g, g, g, 255], (y * n + x) * 4);
  }
  ctx.putImageData(img, 0, 0);
  return { color: c, normal: heightToNormalCanvas(h, n, n, 2.2, true) };
}

/* 5) Logo gravat. r normalitzat al radi exterior del logo.
   Meitat davantera: anells 0,81–1 i 0,375–0,53. Meitat del darrere: 0,625–0,78 i 0,16–0,31. Línia a l'eix. */
function logoDepth(lx, ly) {
  const groove = (r, a, b) => { if (r < a || r > b) return 0; const t = (r - a) / (b - a); return clamp01(Math.min(t, 1 - t) / 0.28); };
  const r = Math.hypot(lx, ly);
  let d = 0;
  if (ly > 0.004) d = Math.max(groove(r, 0.81, 1.0), groove(r, 0.375, 0.53));
  else if (ly < -0.004) d = Math.max(groove(r, 0.625, 0.78), groove(r, 0.16, 0.31));
  if (Math.abs(ly) < 0.022 && Math.abs(lx) < 1.04) d = Math.max(d, 0.55 * clamp01(1 - Math.abs(ly) / 0.022) * smooth(1.04, 1.0, Math.abs(lx)));
  return d;
}
async function logoHeightField(size, extent, svgText) {
  const h = new Float32Array(size * size);
  if (svgText) {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const c = makeCanvas(size, size), ctx = c.getContext('2d');
    const box = (2 / extent) * size, s = box / Math.max(img.width, img.height);
    ctx.filter = `blur(${Math.max(1, size / 260)}px)`;
    ctx.translate(size / 2, size / 2); ctx.scale(1, -1);
    ctx.drawImage(img, -img.width * s / 2, -img.height * s / 2, img.width * s, img.height * s);
    const d = ctx.getImageData(0, 0, size, size).data;
    for (let i = 0; i < size * size; i++) h[i] = d[i * 4 + 3] / 255;
    URL.revokeObjectURL(url);
  } else {
    const ss = 2;
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      let acc = 0;
      for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
        const lx = ((x + (sx + 0.5) / ss) / size * 2 - 1) * extent;
        const ly = ((y + (sy + 0.5) / ss) / size * 2 - 1) * extent;
        acc += logoDepth(lx, ly);
      }
      h[y * size + x] = acc / (ss * ss);
    }
  }
  return h;
}
// Normal (RGB) + oclusió (A) en un sol canvas
export async function makeLogo(size, extent, strength, svgText = null) {
  const h = await logoHeightField(size, extent, svgText);
  const normal = heightToNormalCanvas(h.map((v) => -v), size, size, strength, false);
  const ctx = normal.getContext('2d'), img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < size * size; i++) img.data[i * 4 + 3] = 255 * (1 - 0.72 * h[i]);
  ctx.putImageData(img, 0, 0);
  return normal;
}

/* 6) Ombra de contacte: silueta desenfocada (negre amb alfa) */
export function makeShadow(D, cfg = CONFIG) {
  const m = cfg.shadowMarginCm, sw = D.W + 2 * m, sh = D.L + 2 * m, res = 4;
  const c = makeCanvas(Math.round(sw * res), Math.round(sh * res)), ctx = c.getContext('2d');
  const path = new Path2D();
  D.P.forEach((p, i) => { const X = (p.x + sw / 2) * res, Y = (sh / 2 - p.y) * res; i ? path.lineTo(X, Y) : path.moveTo(X, Y); });
  path.closePath();
  ctx.fillStyle = '#000';
  ctx.filter = `blur(${2.6 * res}px)`; ctx.globalAlpha = 0.32; ctx.fill(path);
  ctx.filter = `blur(${0.5 * res}px)`; ctx.globalAlpha = 0.55; ctx.fill(path);
  return c;
}
