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
 * En mòbil i tablet, la taula del hero és el visor 3D (carpeta 3d/). Es
 * crea i es carrega només per sota de 1100px: en mode hero el component es
 * carrega sol encara que estigui amagat, així que en escriptori (on hi ha
 * la foto del Figma) ni s'afegeix ni es baixa el mòdul.
 */
function mountHeroBoard3D() {
  const slot = document.getElementById("hero-board-3d-slot");
  if (!slot || !window.matchMedia("(max-width: 1099px)").matches) return;
  import("../../3d/dist/onirik-board.js").then(() => {
    slot.innerHTML = `
      <onirik-board-3d class="hero-board-3d" mode="hero" pose="front"></onirik-board-3d>`;
  });
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
