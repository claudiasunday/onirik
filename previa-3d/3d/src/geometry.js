// Geometria de la taula: contorn, offset, cos extruït amb bisell, grip, disc i logo inferior.
// Espai "forma": x = ample, y = llarg (punta a +y), z = gruix.
import * as THREE from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';
import { CONFIG, HALF_OUTLINE } from './config.js';

const V2 = THREE.Vector2;
const clamp01 = (x) => Math.min(1, Math.max(0, x));

/* ---------- Contorn normalitzat (unitats de llarg, y=0 punta) ---------- */
export function outlineFromHalf(half = HALF_OUTLINE) {
  const right = [];
  for (let i = 0; i < half.length; i += 2) right.push([half[i], half[i + 1]]);
  const left = right.slice(1, -1).reverse().map(([x, y]) => [-x, y]);
  return right.concat(left);
}

/* ---------- Mides a escala real ---------- */
export function boardDims(norm, cfg = CONFIG) {
  const L = cfg.lengthCm;
  const xs = norm.map((p) => p[0]);
  const natW = Math.max(...xs) - Math.min(...xs);
  const sx = cfg.widthCm ? cfg.widthCm / (natW * L) : 1;
  const W = natW * L * sx;
  const P = norm.map(([x, y]) => new V2(x * L * sx, L / 2 - y * L));
  if (THREE.ShapeUtils.isClockWise(P)) P.reverse();
  const T = cfg.thicknessCm;
  const cum = [0];
  for (let i = 1; i <= P.length; i++) cum.push(cum[i - 1] + P[i % P.length].distanceTo(P[i - 1]));
  const perimeter = cum[P.length];
  return {
    L, W, T, P, cum, perimeter,
    r: Math.min(cfg.edgeRadiusCm, T / 2 - 0.05),
    gT: cfg.gripThicknessCm,
    topZ: T / 2, botZ: -T / 2,
    edgeTiles: Math.max(1, Math.round(perimeter / cfg.edgeTileCm)),
    discR: cfg.disc.diameterCm / 2,
    discCx: 0, discCy: L / 2 - cfg.disc.centerFromNose * L,
    botLogoHalf: (cfg.bottomLogo.diameterCm / 2) * cfg.bottomLogo.extent,
    blX: (0.5 - cfg.bottomLogo.fx) * W,             // esquerra de la foto (vista des de sota) = +x
    blY: L / 2 - cfg.bottomLogo.fy * L,
    // mapatges planars: v = 1 a la punta; la cara inferior va emmirallada en u (es veu des de sota)
    uTop: (x) => (x + W / 2) / W,
    uBot: (x) => (W / 2 - x) / W,
    vOf: (y) => (y + L / 2) / L,
  };
}

/* ---------- Offset cap endins amb eliminació de bucles ---------- */
function polyArea(P) { let a = 0; for (let i = 0, n = P.length; i < n; i++) { const p = P[i], q = P[(i + 1) % n]; a += p.x * q.y - q.x * p.y; } return a / 2; }
function segIntersect(p1, p2, p3, p4) {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  if (Math.abs(d) < 1e-12) return null;
  const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
  const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
  return (t > 0 && t < 1 && u > 0 && u < 1) ? new V2(p1.x + t * (p2.x - p1.x), p1.y + t * (p2.y - p1.y)) : null;
}
function removeLoops(P) {
  for (let guard = 0; guard < 400; guard++) {
    let changed = false;
    const n = P.length;
    search:
    for (let i = 0; i < n; i++) {
      for (let j = i + 2; j < n; j++) {
        if (i === 0 && j === n - 1) continue;
        const X = segIntersect(P[i], P[(i + 1) % n], P[j], P[(j + 1) % n]);
        if (!X) continue;
        const inner = P.slice(i + 1, j + 1);
        const outer = P.slice(j + 1).concat(P.slice(0, i + 1));
        P = Math.abs(polyArea(inner)) > Math.abs(polyArea(outer)) ? [X, ...inner] : [...outer, X];
        changed = true;
        break search;
      }
    }
    if (!changed) break;
  }
  return P;
}
export function offsetInward(P, d) {
  const n = P.length, out = [];
  for (let i = 0; i < n; i++) {
    const a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n];
    const e1 = b.clone().sub(a).normalize(), e2 = c.clone().sub(b).normalize();
    const n1 = new V2(-e1.y, e1.x), n2 = new V2(-e2.y, e2.x);
    const bis = n1.clone().add(n2);
    if (bis.lengthSq() < 1e-10) bis.copy(n1); else bis.normalize();
    const k = Math.min(4, 1 / Math.max(0.25, bis.dot(n1)));
    out.push(b.clone().addScaledVector(bis, d * k));
  }
  return removeLoops(out);
}

/* ---------- Cos: extrusió amb bisell arrodonit, 3 grups (sup / inf / cantell) ---------- */
export function buildBodyGeometry(D) {
  const { P, T, r, topZ, botZ, cum, perimeter, edgeTiles, uTop, uBot, vOf } = D;
  const g0 = new THREE.ExtrudeGeometry(new THREE.Shape(P), {
    depth: T - 2 * r, steps: 1, curveSegments: 1,
    bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelOffset: -r, bevelSegments: 5,
  });
  g0.translate(0, 0, -(T - 2 * r) / 2);
  g0.deleteAttribute('uv');
  const g = toCreasedNormals(g0, THREE.MathUtils.degToRad(42));
  const pos = g.attributes.position.array, nrm = g.attributes.normal.array;
  const tri = pos.length / 9, eps = 1e-4;
  const buckets = [[], [], []];
  for (let t = 0; t < tri; t++) {
    const z0 = pos[t * 9 + 2], z1 = pos[t * 9 + 5], z2 = pos[t * 9 + 8];
    if (Math.abs(z0 - topZ) < eps && Math.abs(z1 - topZ) < eps && Math.abs(z2 - topZ) < eps) buckets[0].push(t);
    else if (Math.abs(z0 - botZ) < eps && Math.abs(z1 - botZ) < eps && Math.abs(z2 - botZ) < eps) buckets[1].push(t);
    else buckets[2].push(t);
  }
  // Longitud d'arc del contorn més proper (memoritzada: cada vèrtex del cantell es repeteix ~6 cops)
  const arcCache = new Map();
  const nearestArc = (x, y) => {
    const key = Math.round(x * 1000) * 1e6 + Math.round(y * 1000);
    const hit = arcCache.get(key);
    if (hit !== undefined) return hit;
    let best = 0, bd = Infinity;
    for (let i = 0; i < P.length; i++) { const dx = P[i].x - x, dy = P[i].y - y, dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = i; } }
    let s = cum[best], bestD = bd;
    const prev = (best - 1 + P.length) % P.length, next = (best + 1) % P.length;
    for (const [a, b, sa] of [[prev, best, best === 0 ? cum[P.length - 1] : cum[best - 1]], [best, next, cum[best]]]) {
      const A = P[a], B = P[b], ex = B.x - A.x, ey = B.y - A.y, l2 = ex * ex + ey * ey || 1;
      const tt = clamp01(((x - A.x) * ex + (y - A.y) * ey) / l2), px = A.x + ex * tt - x, py = A.y + ey * tt - y, dd = px * px + py * py;
      if (dd <= bestD) { bestD = dd; s = sa + tt * Math.sqrt(l2); }
    }
    const res = s / perimeter;
    arcCache.set(key, res);
    return res;
  };
  const order = buckets[0].concat(buckets[1], buckets[2]);
  const P3 = new Float32Array(order.length * 9), N3 = new Float32Array(order.length * 9), UV = new Float32Array(order.length * 6);
  const n0 = buckets[0].length, n1 = n0 + buckets[1].length;
  const us = [[0, 0], [0, 0], [0, 0]];
  order.forEach((t, k) => {
    P3.set(pos.subarray(t * 9, t * 9 + 9), k * 9);
    N3.set(nrm.subarray(t * 9, t * 9 + 9), k * 9);
    const group = k < n0 ? 0 : k < n1 ? 1 : 2;
    for (let vtx = 0; vtx < 3; vtx++) {
      const x = pos[t * 9 + vtx * 3], y = pos[t * 9 + vtx * 3 + 1], z = pos[t * 9 + vtx * 3 + 2];
      if (group === 0) { us[vtx][0] = uTop(x); us[vtx][1] = vOf(y); }
      else if (group === 1) { us[vtx][0] = uBot(x); us[vtx][1] = vOf(y); }
      else { us[vtx][0] = nearestArc(x, y) * edgeTiles; us[vtx][1] = (z - botZ) / T; }
    }
    if (group === 2) {                                   // costura del cantell a la punta
      const umax = Math.max(us[0][0], us[1][0], us[2][0]);
      for (const q of us) if (umax - q[0] > edgeTiles / 2) q[0] += edgeTiles;
    }
    for (let vtx = 0; vtx < 3; vtx++) { UV[k * 6 + vtx * 2] = us[vtx][0]; UV[k * 6 + vtx * 2 + 1] = us[vtx][1]; }
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(P3, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(N3, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(UV, 2));
  out.addGroup(0, n0 * 3, 0);
  out.addGroup(n0 * 3, buckets[1].length * 3, 1);
  out.addGroup(n1 * 3, buckets[2].length * 3, 2);
  out.computeBoundingSphere();
  g0.dispose();
  return out;
}

/* ---------- Grip: offset del contorn amb forat per al disc ---------- */
export function buildGripGeometry(D, cfg = CONFIG) {
  const shape = new THREE.Shape(offsetInward(D.P, cfg.gripMarginCm));
  shape.holes.push(new THREE.Path().absarc(D.discCx, D.discCy, D.discR + 0.05, 0, Math.PI * 2, true));
  const g = new THREE.ExtrudeGeometry(shape, { depth: D.gT, bevelEnabled: false, curveSegments: 72 });
  g.translate(0, 0, D.topZ);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / cfg.gripTileCm, p.getY(i) / cfg.gripTileCm);
  return g;
}

// UV de fusta (canal 0) + UV local del logo (canal 1)
function decalUVs(g, D, cx, cy, halfExtentCm, uFn) {
  const p = g.attributes.position, n = p.count;
  const uv = new Float32Array(n * 2), uv1 = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const x = p.getX(i), y = p.getY(i);
    uv[i * 2] = uFn(x); uv[i * 2 + 1] = D.vOf(y);
    uv1[i * 2] = (x - cx) / (2 * halfExtentCm) + 0.5; uv1[i * 2 + 1] = (y - cy) / (2 * halfExtentCm) + 0.5;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('uv1', new THREE.BufferAttribute(uv1, 2));
}

/* ---------- Disc de fusta amb logo, enrasat amb el grip ---------- */
export function buildDiscGeometry(D) {
  const shape = new THREE.Shape().absarc(D.discCx, D.discCy, D.discR, 0, Math.PI * 2, false);
  const g = new THREE.ExtrudeGeometry(shape, { depth: D.gT, bevelEnabled: false, curveSegments: 96 });
  g.translate(0, 0, D.topZ);
  decalUVs(g, D, D.discCx, D.discCy, D.discR, D.uTop);
  return g;
}

/* ---------- Logo petit gravat a la cara inferior ---------- */
export function buildBottomLogoGeometry(D) {
  const g = new THREE.CircleGeometry(D.botLogoHalf, 96);
  g.rotateY(Math.PI);                                    // mira cap a -z
  g.translate(D.blX, D.blY, D.botZ - 0.004);
  decalUVs(g, D, D.blX, D.blY, D.botLogoHalf, D.uBot);
  return g;
}
