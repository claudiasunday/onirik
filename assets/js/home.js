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
 * En mòbil, la taula del hero és el visor 3D (carpeta 3d/). Es crea i es
 * carrega només en mòbil: en mode hero el component es carrega sol encara
 * que estigui amagat, així que en escriptori (on hi ha la foto del Figma)
 * ni s'afegeix ni es baixa el mòdul.
 */
function mountHeroBoard3D() {
  const slot = document.getElementById("hero-board-3d-slot");
  if (!slot || !window.matchMedia("(max-width: 859px)").matches) return;
  import("../../3d/dist/onirik-board.js").then(() => {
    // Fletxes de rotació: indiquen que la taula gira (en mòbil gira sola).
    slot.innerHTML = `
      <onirik-board-3d class="hero-board-3d" mode="hero" pose="front"></onirik-board-3d>
      <svg class="hero-rotate-arrows" viewBox="0 0 300 70" fill="none" aria-hidden="true">
        <path d="M14 22 C 10 46, 70 62, 128 62" />
        <path d="M172 62 C 236 62, 292 46, 286 20" />
        <path d="M286 20 L 276 32 M286 20 L 294 34" />
      </svg>`;
  });
}

mountProducts();
mountFeatured();
mountHeroBoard3D();
