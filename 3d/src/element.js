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
// API:  el.showFace('bottom' | 'top')   ·   event "facechange" (detail.face)

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
@media (prefers-reduced-motion: reduce) { .poster, canvas, .toggle { transition: none; } }
`;

class OnirikBoard3D extends HTMLElement {
  #viewer = null;
  #loading = null;
  #io = null;
  #ro = null;
  #pendingFace = null;

  connectedCallback() {
    if (this.shadowRoot) return;
    const assets = this.getAttribute('assets') || DEFAULT_ASSETS;
    const base = assets.endsWith('/') ? assets : assets + '/';
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${css}</style>
      <img class="poster" src="${base}poster.webp" width="1000" height="1250" decoding="async"
           alt="Taula d'equilibri Keiki: grip negre, marge de fusta i disc amb el logo gravat">
      <canvas role="img" tabindex="0" aria-label="Model 3D de la taula. Arrossega per girar-la; roda o pessic per apropar."></canvas>
      <div class="toggle" role="group" aria-label="Cara visible">
        <button type="button" data-face="top" aria-pressed="true">Cara de dalt</button>
        <button type="button" data-face="bottom" aria-pressed="false">Cara de sota</button>
      </div>`;
    this.dataset.state = 'poster';
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
    if (this.#ro) this.#ro.disconnect();
    if (this.#viewer) { this.#viewer.dispose(); this.#viewer = null; }
  }

  #idle(fn) { ('requestIdleCallback' in window) ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200); }

  load() {
    if (this.#loading) return this.#loading;
    if (!this.#webglOK()) { this.dataset.state = 'nowebgl'; return (this.#loading = Promise.resolve(null)); }
    this.dataset.state = 'loading';
    const root = this.shadowRoot;
    const assets = this.getAttribute('assets') || DEFAULT_ASSETS;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.#loading = import(VIEWER_URL)
      .then((m) => m.mount({ canvas: root.querySelector('canvas'), container: this, assetsBase: assets, reduceMotion }))
      .then((viewer) => {
        this.#viewer = viewer;
        this.#ro = new ResizeObserver(() => viewer.resize());
        this.#ro.observe(this);
        viewer.on((type, face) => { if (type === 'flipend') this.#setButtonsBusy(false); });
        requestAnimationFrame(() => { this.dataset.state = 'ready'; });
        if (this.#pendingFace) this.showFace(this.#pendingFace);
        this.dispatchEvent(new CustomEvent('ready'));
        return viewer;
      })
      .catch((err) => { console.error('[onirik-board-3d]', err); this.dataset.state = 'error'; return null; });
    return this.#loading;
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
