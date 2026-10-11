/**
 * Home — mostra un tast del catàleg ("Edició limitada" i "Packs i
 * edicions especials") com a graella directa, sense carousel: just les
 * peces que caben en una fila d'escriptori (4). La resta es veu a la
 * Tenda, enllaçada des del "Veure més" de cada secció.
 */

function mountProducts() {
  const grid = document.getElementById("product-grid-1");
  CATALOG.slice(0, 4).forEach((p) => grid.appendChild(buildProductCard(p)));
}

function mountFeatured() {
  const grid = document.getElementById("product-grid-2");
  if (!grid) return;
  [...PACKS.slice(0, 2), ...EDITIONS.slice(0, 2)].forEach((entry) =>
    grid.appendChild(buildCatalogCard(entry))
  );
}

mountProducts();
mountFeatured();
