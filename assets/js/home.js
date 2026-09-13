/**
 * Home — mostra les 4 primeres peces del catàleg com a "Edició limitada".
 */

function mountProducts() {
  const grid1 = document.getElementById("product-grid-1");
  const grid2 = document.getElementById("product-grid-2");
  CATALOG.slice(0, 2).forEach((p) => grid1.appendChild(buildProductCard(p)));
  CATALOG.slice(2, 4).forEach((p) => grid2.appendChild(buildProductCard(p)));
}

mountProducts();
