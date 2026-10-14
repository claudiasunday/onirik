var p=new URL("../assets/",import.meta.url).href,v=new URL("./onirik-board-3d.js",import.meta.url).href,f=`
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
:host([mode="hero"]) { aspect-ratio: 1 / 1; }
:host([mode="hero"]) canvas { pointer-events: none; touch-action: auto; cursor: auto; }
@media (prefers-reduced-motion: reduce) { .poster, canvas, .toggle { transition: none; } }
`,h=class extends HTMLElement{#t=null;#o=null;#e=null;#s=null;#i=null;#n=null;#a=!0;get#r(){return this.getAttribute("mode")==="hero"}connectedCallback(){if(this.shadowRoot)return;let t=this.getAttribute("assets")||p,s=t.endsWith("/")?t:t+"/",o=this.attachShadow({mode:"open"});if(this.#r){o.innerHTML=`<style>${f}</style>
      <img class="poster" src="${s}poster-hero.webp" width="1000" height="1000" decoding="async" fetchpriority="high"
           alt="Taula d'equilibri Keiki: grip negre, marge de fusta i disc amb el logo gravat">
      <canvas role="img" aria-label="Taula d'equilibri Keiki en 3D"></canvas>`,this.dataset.state="poster",this.#c(),navigator.connection&&navigator.connection.saveData||this.#l(()=>this.load());return}o.innerHTML=`<style>${f}</style>
      <img class="poster" src="${s}poster.webp" width="1000" height="1250" decoding="async"
           alt="Taula d'equilibri Keiki: grip negre, marge de fusta i disc amb el logo gravat">
      <canvas role="img" tabindex="0" aria-label="Model 3D de la taula. Arrossega per girar-la; roda o pessic per apropar."></canvas>
      <div class="toggle" role="group" aria-label="Cara visible">
        <button type="button" data-face="top" aria-pressed="true">Cara de dalt</button>
        <button type="button" data-face="bottom" aria-pressed="false">Cara de sota</button>
      </div>`,this.dataset.state="poster",this.#c(),o.querySelectorAll(".toggle button").forEach(i=>i.addEventListener("click",()=>this.showFace(i.dataset.face))),this.getAttribute("face")==="bottom"&&(this.#i="bottom");let e=this.getAttribute("loading")||"lazy",a=navigator.connection&&navigator.connection.saveData,n=()=>this.load();this.addEventListener("pointerdown",n,{once:!0}),this.addEventListener("focusin",n,{once:!0}),e==="eager"&&!a?this.load():e==="lazy"&&!a&&(this.#e=new IntersectionObserver(i=>{i.some(c=>c.isIntersecting)&&(this.#e.disconnect(),this.#e=null,this.#l(()=>this.load()))},{rootMargin:"300px 0px"}),this.#e.observe(this))}disconnectedCallback(){this.#e&&this.#e.disconnect(),this.#n&&this.#n.abort(),this.#s&&this.#s.disconnect(),this.#t&&(this.#t.dispose(),this.#t=null)}#c(){let t=this.shadowRoot.querySelector(".poster");t.addEventListener("error",()=>t.remove(),{once:!0})}#l(t){"requestIdleCallback"in window?requestIdleCallback(t,{timeout:1500}):setTimeout(t,200)}load(){if(this.#o)return this.#o;if(!this.#u())return this.dataset.state="nowebgl",this.#o=Promise.resolve(null);this.dataset.state="loading";let t=this.shadowRoot,s=this.getAttribute("assets")||p,o=matchMedia("(prefers-reduced-motion: reduce)").matches;return this.#o=import(v).then(e=>e.mount({canvas:t.querySelector("canvas"),container:this,assetsBase:s,reduceMotion:o,mode:this.#r?"hero":"viewer"})).then(e=>(this.#t=e,this.#s=new ResizeObserver(()=>e.resize()),this.#s.observe(this),e.on((a,n)=>{a==="flipend"&&this.#d(!1)}),this.#r&&this.#h(e,o),requestAnimationFrame(()=>{this.dataset.state="ready"}),this.#i&&this.showFace(this.#i),this.dispatchEvent(new CustomEvent("ready")),e)).catch(e=>(console.error("[onirik-board-3d]",e),this.dataset.state="error",null)),this.#o}#h(t,s){if(s)return;let o=t.heroConfig,e=this.#n=new AbortController,a={passive:!0,signal:e.signal},n=matchMedia("(hover: hover) and (pointer: fine)").matches,i=0,c=0,l=0,u=()=>{let r=this.getBoundingClientRect();return Math.min(1,Math.max(0,scrollY/Math.max(1,r.bottom+scrollY)))},d=()=>{n?t.setPose({yaw:i*o.pointerYawDeg+l*o.scrollYawDeg,tilt:c*o.pointerTiltDeg+l*o.scrollTiltDeg}):t.setPose({tilt:l*o.scrollTiltDeg})};n?(addEventListener("pointermove",r=>{i=r.clientX/innerWidth*2-1,c=r.clientY/innerHeight*2-1,this.#a&&d()},a),document.documentElement.addEventListener("pointerleave",()=>{i=0,c=0,d()},a)):t.setAutoRotate(o.autoRotateDegPerSec),addEventListener("scroll",()=>{l=u(),this.#a&&d()},a),l=u(),d();let g=()=>t.setRunning(this.#a&&!document.hidden);document.addEventListener("visibilitychange",g,{signal:e.signal});let b=new IntersectionObserver(([r])=>{this.#a=r.isIntersecting,g()});b.observe(this),e.signal.addEventListener("abort",()=>b.disconnect())}get viewer(){return this.#t}showFace(t){if(!this.#t){this.#i=t,this.load();return}this.#t.showFace(t==="bottom")&&(this.#d(!0),this.shadowRoot.querySelectorAll(".toggle button").forEach(s=>s.setAttribute("aria-pressed",String(s.dataset.face===t))),this.dispatchEvent(new CustomEvent("facechange",{detail:{face:t}})))}#d(t){this.shadowRoot.querySelectorAll(".toggle button").forEach(s=>{s.disabled=t})}#u(){return typeof WebGL2RenderingContext<"u"}};customElements.get("onirik-board-3d")||customElements.define("onirik-board-3d",h);
