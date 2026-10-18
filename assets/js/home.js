/**
 * Home — mostra un tast del catàleg ("Edició limitada" i "Packs i
 * edicions especials") com a graella directa, sense carousel: just les
 * peces que caben en una fila d'escriptori (4). La resta es veu a la
 * Tenda, enllaçada des del "Veure més" de cada secció.
 */

function mountProducts() {
  const grid = document.getElementById("product-grid-1");
  // Només taules amb foto real: igual que a la Tenda, cap il·lustració
  // SVG generada en aquest aparador.
  CATALOG.filter((p) => p.photo)
    .slice(0, 4)
    .forEach((p) => grid.appendChild(buildProductCard(p)));
}

function mountFeatured() {
  const grid = document.getElementById("product-grid-2");
  if (!grid) return;
  [...PACKS.slice(0, 2), ...EDITIONS.slice(0, 2)].forEach((entry) =>
    grid.appendChild(buildCatalogCard(entry))
  );
}

/**
 * La taula del hero és el visor 3D (carpeta 3d/), girant 360°. En mòbil i
 * tablet va a sobre del text (slot); en escriptori substitueix la foto de
 * la columna del mig, que es queda com a reserva si el JS no carrega.
 */
function mountHeroBoard3D() {
  const slot = document.getElementById("hero-board-3d-slot");
  if (!slot) return;
  const mq = window.matchMedia("(max-width: 859px)");
  // La foto de la columna del mig queda com a reserva (si el JS no carrega).
  const img = document.querySelector("img.hero-board");
  let board = null;
  let first = true;

  // Si canvia el breakpoint (p. ex. en fer la finestra més estreta), la taula
  // es torna a crear al lloc que toca: un component mogut de lloc no es
  // tornaria a muntar (el visor es desmunta en treure'l del DOM).
  const place = () => {
    if (board) board.remove();
    board = document.createElement("onirik-board-3d");
    board.setAttribute("mode", "hero");
    board.setAttribute("pose", "front");
    board.setAttribute("autorotate", "");
    if (mq.matches) {
      // Mòbil: a sobre del text.
      board.className = "hero-board-3d";
      slot.appendChild(board);
      if (first) showBoardHint(slot);
    } else if (img) {
      // Tauleta i escriptori: al lloc de la foto, a la dreta del text.
      board.className = "hero-board";
      img.after(board);
    }
    if (img) img.hidden = !mq.matches && Boolean(board.isConnected);
    first = false;
  };

  import("../../3d/dist/onirik-board.js").then(() => {
    place();
    mq.addEventListener("change", place);
  });
}

/**
 * Pista "Tap and hold" al mig de la taula 3D (només pantalles tàctils): una
 * mà que es tanca. Surt quan la taula ja és 3D i desapareix als 3 segons o
 * en tocar-la.
 */
const HAND_OPEN = '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>';
const HAND_CLOSED = '<path d="M18 11.5V9a2 2 0 0 0-4 0v1.4"/><path d="M14 10V8a2 2 0 0 0-4 0v2"/><path d="M10 9.9V9a2 2 0 0 0-4 0v5"/><path d="M6 14a2 2 0 0 0-4 0"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/>';

function showBoardHint(slot) {
  if (!window.matchMedia("(hover: none) and (max-width: 859px)").matches) return;
  const boardEl = slot.querySelector("onirik-board-3d");
  if (!boardEl) return;
  const svg = (cls, d) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const show = () => {
    const hint = document.createElement("div");
    hint.className = "board-hint";
    hint.innerHTML = `<span class="board-hint-hand">${svg("is-open", HAND_OPEN)}${svg("is-closed", HAND_CLOSED)}</span><span class="board-hint-text">Tap and hold</span>`;
    slot.appendChild(hint);
    const hide = () => {
      hint.classList.add("is-out");
      setTimeout(() => hint.remove(), 450);
    };
    const timer = setTimeout(hide, 3000);
    boardEl.addEventListener("touchstart", () => { clearTimeout(timer); hide(); }, { once: true, passive: true });
  };
  if (boardEl.dataset.state === "ready") show();
  else boardEl.addEventListener("ready", show, { once: true });
}

/**
 * En mòbil, els 3 passos s'apilen com cartes (CSS sticky). Aquí només
 * calculem quant ha tapat cada targeta la següent (--stack, de 0 a 1)
 * perquè el CSS l'encongeixi i l'enfosqueixi de manera progressiva.
 */
function initValueStepsStack() {
  const steps = [...document.querySelectorAll(".value-steps--mobile .value-step")];
  const mq = window.matchMedia("(max-width: 859px) and (prefers-reduced-motion: no-preference)");
  if (steps.length < 2) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    if (!mq.matches) {
      steps.forEach((el) => el.style.removeProperty("--stack"));
      return;
    }
    steps.forEach((el, i) => {
      let stack = 0;
      // Cada targeta de sobre que ja s'hi acosta n'afegeix una part.
      for (let j = i + 1; j < steps.length; j++) {
        const gap = steps[j].getBoundingClientRect().top - el.getBoundingClientRect().top;
        const h = el.offsetHeight;
        stack += Math.min(1, Math.max(0, 1 - gap / h));
      }
      el.style.setProperty("--stack", Math.min(stack, 2).toFixed(3));
    });
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

mountProducts();
mountFeatured();
mountHeroBoard3D();
initValueStepsStack();
