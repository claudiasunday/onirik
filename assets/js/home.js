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
    slot.innerHTML = `
      <onirik-board-3d class="hero-board-3d" mode="hero" pose="front"></onirik-board-3d>`;
  });
}

mountProducts();
mountFeatured();
mountHeroBoard3D();
