// Escena del visor. Rep textures ja carregades (WebP cuinats) o canvas (forn).
// Sense mapa d'entorn ni ombres en temps real: llum d'estudi amb 4 llums i ombra precuinada.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CONFIG } from './config.js';
import { buildBodyGeometry, buildGripGeometry, buildDiscGeometry, buildBottomLogoGeometry } from './geometry.js';

const clamp01 = (x) => Math.min(1, Math.max(0, x));

// Configura una textura segons el seu ús. tex.image pot ser <img>, ImageBitmap o <canvas>.
export function prepTexture(tex, { color = false, repeat = false, channel = 0 } = {}) {
  tex.flipY = false;                                     // fila 0 = v 0 (cua)
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  tex.channel = channel;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

// L'oclusió del logo va a l'alfa del normal map (un fitxer menys): llegim .a en lloc de .r
function aoFromAlpha(mat) {
  mat.onBeforeCompile = (sh) => {
    // els #include es resolen després d'aquest hook: substituïm el chunk sencer
    sh.fragmentShader = sh.fragmentShader.replace('#include <aomap_fragment>',
      THREE.ShaderChunk.aomap_fragment.replace('texture2D( aoMap, vAoMapUv ).r', 'texture2D( aoMap, vAoMapUv ).a'));
  };
  mat.customProgramCacheKey = () => 'ao-alpha';
  return mat;
}

function studioEnvironment() {
  const w = 64, h = 32, data = new Uint16Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const el = (0.5 - (y + 0.5) / h) * Math.PI;          // +π/2 zenit … −π/2 nadir
    for (let x = 0; x < w; x++) {
      const az = ((x + 0.5) / w) * Math.PI * 2;
      let v = el > 0 ? 0.75 + 0.35 * Math.sin(el) : 0.42 + 0.18 * (1 + Math.sin(el));   // sostre clar, terra gris
      // dues finestres/softbox
      const box = (a0, e0, sa, se, k) => Math.exp(-(((az - a0) / sa) ** 2) - (((el - e0) / se) ** 2)) * k;
      v += box(2.4, 0.55, 0.45, 0.25, 2.2) + box(5.6, 0.35, 0.35, 0.2, 1.2);
      const i = (y * w + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = THREE.DataUtils.toHalfFloat(v); data[i + 3] = THREE.DataUtils.toHalfFloat(1);
    }
  }
  const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.HalfFloatType);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

/**
 * @param {object} o
 * @param {HTMLCanvasElement} o.canvas
 * @param {HTMLElement} o.container  element que marca la mida
 * @param {object} o.D               mides (geometry.boardDims)
 * @param {object} o.tex             textures: topWood, bottomColor, bottomRough, bottomNormal, edge, gripColor, gripNormal, discLogo, bottomLogo, shadow
 * @param {boolean} [o.reduceMotion]
 */
export async function createViewer({ canvas, container, D, tex, cfg = CONFIG, reduceMotion = false, preserveDrawingBuffer = false }) {
  const { L, W, T } = D;
  const C = cfg.colors;

  prepTexture(tex.topWood, { color: true });
  prepTexture(tex.bottomColor, { color: true });
  prepTexture(tex.bottomRough);
  prepTexture(tex.bottomNormal);
  prepTexture(tex.edge, { color: true }); tex.edge.wrapS = THREE.RepeatWrapping;
  prepTexture(tex.gripColor, { color: true, repeat: true });
  prepTexture(tex.gripNormal, { repeat: true });
  prepTexture(tex.discLogo, { channel: 1 });
  prepTexture(tex.bottomLogo, { channel: 1 });
  prepTexture(tex.shadow, { color: true }); tex.shadow.flipY = false;

  /* --- Renderer --- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.maxPixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;      // fidel al color de producte

  const scene = new THREE.Scene();
  // Entorn d'estudi minúscul (64×32): dona els reflexos neutres d'una sala blanca. El PMREM d'una
  // textura tan petita és gairebé gratuït, a diferència del RoomEnvironment (cub 256 + 6 renders).
  scene.environment = studioEnvironment();
  scene.environmentIntensity = 0.55;
  const hemi = new THREE.HemisphereLight(0xfbf8f2, 0xc8c6c0, 1.6);
  const key = new THREE.DirectionalLight(0xfff7ef, 2.0); key.position.set(-70, 130, 55);
  const fill = new THREE.DirectionalLight(0xe9eefb, 0.55); fill.position.set(100, 60, 50);
  const rim = new THREE.DirectionalLight(0xffffff, 1.6); rim.position.set(45, 22, -120);
  scene.add(hemi, key, fill, rim);
  const lights = { hemi, key, fill, rim };

  /* --- Materials (un per cara) --- */
  const topWoodMat = new THREE.MeshStandardMaterial({ map: tex.topWood, roughness: 0.72, metalness: 0 });
  const bottomMat = new THREE.MeshStandardMaterial({
    map: tex.bottomColor, roughnessMap: tex.bottomRough, roughness: 1, metalness: 0,
    normalMap: tex.bottomNormal, normalScale: new THREE.Vector2(0.5, 0.5),
  });
  const edgeMat = new THREE.MeshStandardMaterial({ map: tex.edge, roughness: 0.8, metalness: 0 });
  const gripMat = new THREE.MeshStandardMaterial({
    color: C.grip, map: tex.gripColor, normalMap: tex.gripNormal, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 0.95, metalness: 0,
  });
  const discMat = aoFromAlpha(new THREE.MeshStandardMaterial({
    map: tex.topWood, normalMap: tex.discLogo, aoMap: tex.discLogo, roughness: 0.74, metalness: 0,
  }));
  const botLogoMat = aoFromAlpha(new THREE.MeshStandardMaterial({
    map: tex.bottomColor, normalMap: tex.bottomLogo, aoMap: tex.bottomLogo, roughness: 0.74, metalness: 0,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  }));

  /* --- Malles --- */
  const body = new THREE.Mesh(buildBodyGeometry(D), [topWoodMat, bottomMat, edgeMat]);
  const grip = new THREE.Mesh(buildGripGeometry(D, cfg), gripMat);
  const disc = new THREE.Mesh(buildDiscGeometry(D), discMat);
  const botLogo = new THREE.Mesh(buildBottomLogoGeometry(D), botLogoMat);

  const shapeSpace = new THREE.Group();                  // forma (z gruix) → món (y amunt, punta cap a -z)
  shapeSpace.add(body, grip, disc, botLogo);
  shapeSpace.rotation.x = -Math.PI / 2;
  const pivot = new THREE.Group();                       // gira sobre l'eix llarg per ensenyar l'altra cara
  pivot.add(shapeSpace);
  pivot.position.y = T / 2;
  scene.add(pivot);

  const m = cfg.shadowMarginCm;
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(W + 2 * m, L + 2 * m),
    new THREE.MeshBasicMaterial({ map: tex.shadow, transparent: true, depthWrite: false, toneMapped: false }),
  );
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.02; shadow.renderOrder = -1;
  // PlaneGeometry té v=1 a dalt; la textura de l'ombra té la punta a la fila 0 → flipY=false i invertim v
  shadow.geometry.attributes.uv.array.forEach((_, i, a) => { if (i % 2) a[i] = 1 - a[i]; });
  scene.add(shadow);

  /* --- Càmera --- */
  const cam = cfg.camera;
  const camera = new THREE.PerspectiveCamera(cam.fov, 1, 10, 3000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.enablePan = false; controls.rotateSpeed = 0.7;
  controls.maxPolarAngle = THREE.MathUtils.degToRad(84);
  controls.target.set(0, T / 2, 0);

  const fitPts = [];
  D.P.forEach((p, i) => { if (i % 3 === 0) fitPts.push(new THREE.Vector3(p.x, T, -p.y), new THREE.Vector3(p.x, 0, -p.y)); });
  const dir = (() => {
    const pol = THREE.MathUtils.degToRad(cam.polarDeg), az = THREE.MathUtils.degToRad(cam.azimuthDeg);
    return new THREE.Vector3(Math.sin(pol) * Math.sin(az), Math.cos(pol), Math.sin(pol) * Math.cos(az));
  })();
  const q = new THREE.Vector3();
  function fits(d) {
    camera.position.copy(controls.target).addScaledVector(dir, d);
    camera.lookAt(controls.target); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
    const lim = 1 / cam.margin;
    return fitPts.every((p) => { q.copy(p).project(camera); return Math.abs(q.x) <= lim && Math.abs(q.y) <= lim; });
  }
  function placeCamera() {
    let lo = 20, hi = 3000;
    for (let i = 0; i < 28; i++) { const mid = (lo + hi) / 2; if (fits(mid)) hi = mid; else lo = mid; }
    camera.position.copy(controls.target).addScaledVector(dir, hi);
    controls.minDistance = hi * 0.45; controls.maxDistance = hi * 1.8;
    controls.update();
  }

  /* --- Render sota demanda --- */
  let frameQueued = false, flip = null, face = 0, userMoved = false, disposed = false;
  const listeners = new Set();
  function requestRender() { if (!frameQueued && !disposed) { frameQueued = true; requestAnimationFrame(frame); } }
  function frame(now) {
    frameQueued = false;
    let again = controls.update();
    if (flip) {
      const t = clamp01((now - flip.start) / flip.dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const a = flip.from + (flip.to - flip.from) * e;
      const lift = Math.abs(Math.sin(a)) * (W / 2 + 1);
      pivot.rotation.z = a;
      pivot.position.y = T / 2 + lift;
      const k = 1 - Math.min(0.75, lift / (W / 2) * 0.75);
      shadow.material.opacity = k;
      shadow.scale.set(1 + (1 - k) * 0.25, 1, 1 + (1 - k) * 0.08);
      if (t < 1) again = true; else { flip = null; listeners.forEach((fn) => fn('flipend', face)); }
    }
    renderer.render(scene, camera);
    if (again) requestRender();
  }
  controls.addEventListener('change', requestRender);
  controls.addEventListener('start', () => { userMoved = true; });

  function resize(uiSafe = true) {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const safe = uiSafe ? h * cam.uiSafeFrac : 0;           // proporcional: el pòster encaixa igual a qualsevol mida
    camera.aspect = w / (h - safe);
    camera.clearViewOffset();
    if (!userMoved) placeCamera();
    camera.setViewOffset(w, h - safe, 0, 0, w, h);     // la franja del selector queda fora de l'encaix
    camera.updateProjectionMatrix();
    requestRender();
  }

  function showFace(target) {
    target = target ? 1 : 0;
    if (target === face || flip) return false;
    face = target;
    flip = { from: pivot.rotation.z, to: target ? Math.PI : 0, start: performance.now(), dur: reduceMotion ? 1 : 1100 };
    requestRender();
    return true;
  }

  // Compila els shaders sense bloquejar (KHR_parallel_shader_compile quan n'hi ha)
  resize();
  await renderer.compileAsync(scene, camera);
  renderer.render(scene, camera);

  return {
    renderer, scene, camera, controls, lights,
    resize, showFace, requestRender,
    resetView() { userMoved = false; resize(); },
    get face() { return face; },
    on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    dispose() {
      disposed = true;
      controls.dispose();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      [topWoodMat, bottomMat, edgeMat, gripMat, discMat, botLogoMat, shadow.material].forEach((mt) => mt.dispose());
      Object.values(tex).forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}
