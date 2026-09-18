/**
 * Home — mostra les peces del catàleg com a "Edició limitada" en una sola
 * fila (scroll horitzontal en pantalles petites).
 */

function mountProducts() {
  const grid = document.getElementById("product-grid-1");
  CATALOG.slice(0, 5).forEach((p) => grid.appendChild(buildProductCard(p)));
}

function mountFeatured() {
  const grid = document.getElementById("product-grid-2");
  if (!grid) return;
  [...PACKS, ...EDITIONS].forEach((entry) => grid.appendChild(buildCatalogCard(entry)));
}

mountProducts();
mountFeatured();
