// <onirik-board-3d>: component lleuger (~3 KB). Mostra el pòster a l'instant i
// només carrega el visor 3D (Three.js) quan el component és a prop de la pantalla.
//
//   <script type="module" src="3d/dist/onirik-board.js"></script>
//   <onirik-board-3d></onirik-board-3d>
//
// Atributs:
//   assets   carpeta de textures/pòster (per defecte ../assets/ relatiu a aquest fitxer)
//   loading  "lazy" (per defecte: en apropar-se a la pantalla) | "eager" | "interaction" (només en tocar-lo)
//   face     "top" | "bottom"  cara inicial
//   pose     (mode hero) "diagonal" (per defecte, Home) | "front" (de cara, pàgina BOARD)
//   mode     "viewer" (per defecte: girable amb el dit/ratolí i selector de cara)
//            "hero"   (decoratiu: segueix el cursor i l'scroll; en pantalles tàctils gira sol;
//                      no captura el tacte, així l'scroll del mòbil no es bloqueja)
// API:  el.showFace('bottom' | 'top')   ·   event "facechange" (detail.face)

import { HERO_POSES } from './poses.js';

const DEFAULT_ASSETS = new URL('../assets/', import.meta.url).href;
const VIEWER_URL = new URL('./onirik-board-3d.js', import.meta.url).href;

const css = `
:host { display: block; position: relative; aspect-ratio: 4 / 5; width: 100%; contain: content;
  --ob-fg: #1d1d1b; --ob-bg: rgba(255,255,255,.8); --ob-border: rgba(0,0,0,.1);
  --ob-active-bg: #1d1d1b; --ob-active-fg: #fff; --ob-focus: #e27f0c; }
.poster, canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.poster { object-fit: contain; transition: opacity .45s ease; pointer-events: none; }
canvas { opacity: 0; transition: opacity .45s ease; touch-action: none; cursor: grab; outline: none; }
canvas:active { cursor: grabbing; }
:host([data-state="ready"]) canvas { opacity: 1; }
:host([data-state="ready"]) .poster { opacity: 0; }
.toggle { position: absolute; left: 50%; bottom: 3%; transform: translateX(-50%);
  display: flex; gap: 2px; padding: 3px; border-radius: 999px; background: var(--ob-bg);
  border: 1px solid var(--ob-border); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  font-family: inherit; font-size: 13px; font-weight: 500; line-height: 1; opacity: 0; visibility: hidden; transition: opacity .3s ease .2s; }
:host([data-state="ready"]) .toggle { opacity: 1; visibility: visible; }
.toggle button { appearance: none; border: 0; background: transparent; color: var(--ob-fg); font: inherit;
  min-height: 36px; padding: 0 16px; border-radius: 999px; cursor: pointer; transition: background-color .2s, color .2s; }
.toggle button[aria-pressed="true"] { background: var(--ob-active-bg); color: var(--ob-active-fg); }
.toggle button:focus-visible { outline: 2px solid var(--ob-focus); outline-offset: 2px; }
:host([mode="hero"]) { aspect-ratio: var(--ob-aspect, 1 / 1); }
:host([mode="hero"]) { contain: layout style; }
/* El canvas sobresurt del component perquè la taula no es retalli en girar-la o inclinar-la */
:host([mode="hero"]) canvas { pointer-events: none; touch-action: auto; cursor: auto; left: -20%; top: -20%; width: 140%; height: 140%; }
:host([mode="hero"][pose="front"]) canvas { left: -100%; width: 300%; top: -8%; height: 116%; }
:host([mode="hero"]) { cursor: grab; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
:host([mode="hero"][data-dragging]) { cursor: grabbing; }
@media (prefers-reduced-motion: reduce) { .poster, canvas, .toggle { transition: none; } }
`;

class OnirikBoard3D extends HTMLElement {
  #viewer = null;
  #loading = null;
  #io = null;
  #ro = null;
  #pendingFace = null;
  #ac = null;          // AbortController dels listeners del mode hero
  #onScreen = true;

  get #isHero() { return this.getAttribute('mode') === 'hero'; }
  get #poseName() { return HERO_POSES[this.getAttribute('pose')] ? this.getAttribute('pose') : 'diagonal'; }
  get #pose() { return HERO_POSES[this.#poseName]; }

  connectedCallback() {
    if (this.shadowRoot) return;
    const assets = this.getAttribute('assets') || DEFAULT_ASSETS;
    const base = assets.endsWith('/') ? assets : assets + '/';
    const root = this.attachShadow({ mode: 'open' });
    if (this.#isHero) {
      const P = this.#pose;
      this.style.setProperty('--ob-aspect', P.aspect);
      root.innerHTML = `<style>${css}</style>
      <img class="poster" src="${base}${P.poster.file}" width="${P.poster.width}" height="${P.poster.height}" decoding="async" fetchpriority="high"
           alt="Taula d'equilibri Keiki: grip negre, marge de fusta i disc amb el logo gravat">
      <canvas role="img" aria-label="Taula d'equilibri Keiki en 3D"></canvas>`;
      this.dataset.state = 'poster';
      this.#hideBrokenPoster();
      const saveData = navigator.connection && navigator.connection.saveData;
      if (!saveData) this.#idle(() => this.load());
      return;
    }
    root.innerHTML = `<style>${css}</style>
      <img class="poster" src="${base}poster.webp" width="1000" height="1250" decoding="async"
           alt="Taula d'equilibri Keiki: grip negre, marge de fusta i disc amb el logo gravat">
      <canvas role="img" tabindex="0" aria-label="Model 3D de la taula. Arrossega per girar-la; roda o pessic per apropar."></canvas>
      <div class="toggle" role="group" aria-label="Cara visible">
        <button type="button" data-face="top" aria-pressed="true">Cara de dalt</button>
        <button type="button" data-face="bottom" aria-pressed="false">Cara de sota</button>
      </div>`;
    this.dataset.state = 'poster';
    this.#hideBrokenPoster();
    root.querySelectorAll('.toggle button').forEach((b) => b.addEventListener('click', () => this.showFace(b.dataset.face)));
    if (this.getAttribute('face') === 'bottom') this.#pendingFace = 'bottom';

    const mode = this.getAttribute('loading') || 'lazy';
    const saveData = navigator.connection && navigator.connection.saveData;
    // Interacció sobre el pòster: carrega de seguida
    const now = () => this.load();
    this.addEventListener('pointerdown', now, { once: true });
    this.addEventListener('focusin', now, { once: true });
    if (mode === 'eager' && !saveData) this.load();
    else if (mode === 'lazy' && !saveData) {
      this.#io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { this.#io.disconnect(); this.#io = null; this.#idle(() => this.load()); }
      }, { rootMargin: '300px 0px' });
      this.#io.observe(this);
    }
  }

  disconnectedCallback() {
    if (this.#io) this.#io.disconnect();
    if (this.#ac) this.#ac.abort();
    if (this.#ro) this.#ro.disconnect();
    if (this.#viewer) { this.#viewer.dispose(); this.#viewer = null; }
  }

  #hideBrokenPoster() { const img = this.shadowRoot.querySelector('.poster'); img.addEventListener('error', () => img.remove(), { once: true }); }

  #idle(fn) { ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200); }

  load() {
    if (this.#loading) return this.#loading;
    if (!this.#webglOK()) { this.dataset.state = 'nowebgl'; return (this.#loading = Promise.resolve(null)); }
    this.dataset.state = 'loading';
    const root = this.shadowRoot;
    const assets = this.getAttribute('assets') || DEFAULT_ASSETS;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.#loading = import(VIEWER_URL)
      .then((m) => m.mount({ canvas: root.querySelector('canvas'), container: this, assetsBase: assets, reduceMotion, mode: this.#isHero ? 'hero' : 'viewer', pose: this.#poseName }))
      .then((viewer) => {
        this.#viewer = viewer;
        this.#ro = new ResizeObserver(() => viewer.resize());
        this.#ro.observe(this);
        viewer.on((type, face) => { if (type === 'flipend') this.#setButtonsBusy(false); });
        if (this.#isHero) this.#startHeroMotion(viewer, reduceMotion);
        requestAnimationFrame(() => { this.dataset.state = 'ready'; });
        if (this.#pendingFace) this.showFace(this.#pendingFace);
        this.dispatchEvent(new CustomEvent('ready'));
        return viewer;
      })
      .catch((err) => { console.error('[onirik-board-3d]', err); this.dataset.state = 'error'; return null; });
    return this.#loading;
  }

  // Hero: cursor + scroll a l'escriptori; rotació contínua en tàctil. Es pausa fora de pantalla.
  #startHeroMotion(viewer, reduceMotion) {
    if (reduceMotion) return;                         // es queda quieta a la pose base
    const H = viewer.heroConfig;
    const ac = (this.#ac = new AbortController());
    const opt = { passive: true, signal: ac.signal };
    // Atribut "autorotate": gira 360° sense parar també amb ratolí (el cursor només inclina).
    const spin = this.hasAttribute('autorotate');
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    let px = 0, py = 0, sp = 0;
    let drag = null, hold = null;                   // arrossegament (més avall)

    const scrollProgress = () => {                  // 0 a dalt de tot · 1 quan el hero ja ha sortit per dalt
      const r = this.getBoundingClientRect();
      return Math.min(1, Math.max(0, scrollY / Math.max(1, r.bottom + scrollY)));
    };
    const push = () => {
      if (fine && !spin) viewer.setPose({ yaw: px * H.pointerYawDeg + sp * H.scrollYawDeg, tilt: py * H.pointerTiltDeg + sp * H.scrollTiltDeg });
      else if (fine) viewer.setPose({ tilt: py * H.pointerTiltDeg + sp * H.scrollTiltDeg });
      else viewer.setPose({ tilt: sp * H.scrollTiltDeg });   // el yaw el porta l'autorotació
    };
    if (fine) {
      addEventListener('pointermove', (e) => {
        px = (e.clientX / innerWidth) * 2 - 1;
        py = (e.clientY / innerHeight) * 2 - 1;
        if (this.#onScreen && !drag) push();
      }, opt);
      document.documentElement.addEventListener('pointerleave', () => { px = 0; py = 0; if (!drag) push(); }, opt);
    }
    const autoRotate = () => { if (!fine || spin) viewer.setAutoRotate(H.autoRotateDegPerSec); };
    autoRotate();
    addEventListener('scroll', () => { sp = scrollProgress(); if (this.#onScreen && !drag) push(); }, opt);
    sp = scrollProgress(); push();

    // Arrossegar per girar la taula (yaw) i inclinar-ne l'eix (tilt). Amb el ratolí, de seguida;
    // amb el dit, després de mantenir-lo premut un moment: un lliscament normal continua fent scroll.
    // El dit va amb touch events: el preventDefault del touchmove és el que bloqueja l'scroll de
    // manera fiable a iOS i Android (amb pointer events el navegador cancel·la el gest per fer scroll).
    const DEG_PER_PX = 0.5, MAX_TILT = 75, HOLD_MS = 250, SLOP_PX = 10;
    const grab = (id, x, y) => {
      hold = null;
      drag = { id, x, y, ...viewer.pose };
      viewer.setAutoRotate(0);
      if (typeof id === 'number') { try { this.setPointerCapture(id); } catch {} }
      this.dataset.dragging = '';
    };
    const moveTo = (x, y) => {
      const yaw = drag.yaw + (x - drag.x) * DEG_PER_PX;
      const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, drag.tilt + (y - drag.y) * DEG_PER_PX));
      viewer.setPose({ yaw, tilt });
      viewer.snapPose();
    };
    const release = () => {
      if (hold) { clearTimeout(hold.timer); hold = null; }
      if (!drag) return;
      drag = null;
      delete this.dataset.dragging;
      push();                                         // l'eix torna a la pose base, suau
      autoRotate();
    };
    const sig = { signal: ac.signal };
    // Ratolí (i llapis)
    this.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch' || e.button || drag) return;
      e.preventDefault();
      grab(e.pointerId, e.clientX, e.clientY);
    }, sig);
    this.addEventListener('pointermove', (e) => { if (drag && drag.id === e.pointerId) moveTo(e.clientX, e.clientY); }, sig);
    const endPointer = (e) => { if (drag && drag.id === e.pointerId) release(); };
    this.addEventListener('pointerup', endPointer, sig);
    this.addEventListener('pointercancel', endPointer, sig);
    this.addEventListener('lostpointercapture', endPointer, sig);
    // Dit
    this.addEventListener('touchstart', (e) => {
      release();
      if (e.touches.length !== 1) return;            // dos dits: pessic/zoom del navegador
      const { clientX: x, clientY: y } = e.touches[0];
      hold = { x, y, timer: setTimeout(() => grab('touch', x, y), HOLD_MS) };
    }, { passive: true, signal: ac.signal });
    this.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (hold && Math.hypot(t.clientX - hold.x, t.clientY - hold.y) > SLOP_PX) { release(); return; }
      if (!drag || drag.id !== 'touch') return;
      if (e.cancelable) e.preventDefault();          // amb la taula agafada, la pàgina no fa scroll
      moveTo(t.clientX, t.clientY);
    }, { passive: false, signal: ac.signal });
    this.addEventListener('touchend', release, sig);
    this.addEventListener('touchcancel', release, sig);
    this.addEventListener('contextmenu', (e) => { if (drag || hold) e.preventDefault(); }, sig);

    const sync = () => viewer.setRunning(this.#onScreen && !document.hidden);
    document.addEventListener('visibilitychange', sync, { signal: ac.signal });
    const io = new IntersectionObserver(([e]) => { this.#onScreen = e.isIntersecting; sync(); });
    io.observe(this);
    ac.signal.addEventListener('abort', () => io.disconnect());
  }

  /** Instància del visor (null fins que carrega): renderer, scene, camera, controls… */
  get viewer() { return this.#viewer; }

  showFace(face) {
    if (!this.#viewer) { this.#pendingFace = face; this.load(); return; }
    if (!this.#viewer.showFace(face === 'bottom')) return;
    this.#setButtonsBusy(true);
    this.shadowRoot.querySelectorAll('.toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.face === face)));
    this.dispatchEvent(new CustomEvent('facechange', { detail: { face } }));
  }

  #setButtonsBusy(busy) { this.shadowRoot.querySelectorAll('.toggle button').forEach((b) => { b.disabled = busy; }); }

  #webglOK() {
    return typeof WebGL2RenderingContext !== 'undefined';   // Three.js r16x+ només fa servir WebGL2
  }
}

if (!customElements.get('onirik-board-3d')) customElements.define('onirik-board-3d', OnirikBoard3D);
