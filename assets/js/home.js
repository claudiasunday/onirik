/**
 * Home — mostra les peces del catàleg com a "Edició limitada" en una sola
 * fila (scroll horitzontal en pantalles petites).
 */

function mountProducts() {
  const grid = document.getElementById("product-grid-1");
  CATALOG.slice(0, 5).forEach((p) => grid.appendChild(buildProductCard(p)));
}

mountProducts();
