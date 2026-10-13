var d=new URL("../assets/",import.meta.url).href,l=new URL("./onirik-board-3d.js",import.meta.url).href,h=`
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
`,n=class extends HTMLElement{#t=null;#o=null;#e=null;#s=null;#i=null;connectedCallback(){if(this.shadowRoot)return;let t=this.getAttribute("assets")||d,o=t.endsWith("/")?t:t+"/",s=this.attachShadow({mode:"open"});s.innerHTML=`<style>${h}</style>
      <img class="poster" src="${o}poster.webp" width="1000" height="1250" decoding="async"
           alt="Taula d'equilibri Keiki: grip negre, marge de fusta i disc amb el logo gravat">
      <canvas role="img" tabindex="0" aria-label="Model 3D de la taula. Arrossega per girar-la; roda o pessic per apropar."></canvas>
      <div class="toggle" role="group" aria-label="Cara visible">
        <button type="button" data-face="top" aria-pressed="true">Cara de dalt</button>
        <button type="button" data-face="bottom" aria-pressed="false">Cara de sota</button>
      </div>`,this.dataset.state="poster",s.querySelectorAll(".toggle button").forEach(a=>a.addEventListener("click",()=>this.showFace(a.dataset.face))),this.getAttribute("face")==="bottom"&&(this.#i="bottom");let e=this.getAttribute("loading")||"lazy",i=navigator.connection&&navigator.connection.saveData,r=()=>this.load();this.addEventListener("pointerdown",r,{once:!0}),this.addEventListener("focusin",r,{once:!0}),e==="eager"&&!i?this.load():e==="lazy"&&!i&&(this.#e=new IntersectionObserver(a=>{a.some(c=>c.isIntersecting)&&(this.#e.disconnect(),this.#e=null,this.#r(()=>this.load()))},{rootMargin:"300px 0px"}),this.#e.observe(this))}disconnectedCallback(){this.#e&&this.#e.disconnect(),this.#s&&this.#s.disconnect(),this.#t&&(this.#t.dispose(),this.#t=null)}#r(t){"requestIdleCallback"in window?requestIdleCallback(t,{timeout:1500}):setTimeout(t,200)}load(){if(this.#o)return this.#o;if(!this.#n())return this.dataset.state="nowebgl",this.#o=Promise.resolve(null);this.dataset.state="loading";let t=this.shadowRoot,o=this.getAttribute("assets")||d,s=matchMedia("(prefers-reduced-motion: reduce)").matches;return this.#o=import(l).then(e=>e.mount({canvas:t.querySelector("canvas"),container:this,assetsBase:o,reduceMotion:s})).then(e=>(this.#t=e,this.#s=new ResizeObserver(()=>e.resize()),this.#s.observe(this),e.on((i,r)=>{i==="flipend"&&this.#a(!1)}),requestAnimationFrame(()=>{this.dataset.state="ready"}),this.#i&&this.showFace(this.#i),this.dispatchEvent(new CustomEvent("ready")),e)).catch(e=>(console.error("[onirik-board-3d]",e),this.dataset.state="error",null)),this.#o}get viewer(){return this.#t}showFace(t){if(!this.#t){this.#i=t,this.load();return}this.#t.showFace(t==="bottom")&&(this.#a(!0),this.shadowRoot.querySelectorAll(".toggle button").forEach(o=>o.setAttribute("aria-pressed",String(o.dataset.face===t))),this.dispatchEvent(new CustomEvent("facechange",{detail:{face:t}})))}#a(t){this.shadowRoot.querySelectorAll(".toggle button").forEach(o=>{o.disabled=t})}#n(){return typeof WebGL2RenderingContext<"u"}};customElements.get("onirik-board-3d")||customElements.define("onirik-board-3d",n);
