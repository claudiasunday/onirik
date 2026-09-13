/**
 * Tenda — llistat complet del catàleg amb filtre per forma i ordenació
 * per preu (versió senzilla del "Filtrar per" que hi havia al Figma).
 */

const shapeFilter = document.getElementById("filter-shape");
const sortSelect = document.getElementById("sort-select");
const grid = document.getElementById("shop-grid");
const countEl = document.getElementById("shop-count");

function priceOf(entry) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  return entry.discount ? Math.round(shape.price * (1 - entry.discount / 100)) : shape.price;
}

function renderShop() {
  let items = [...CATALOG];

  if (shapeFilter.value !== "all") {
    items = items.filter((e) => e.shapeId === shapeFilter.value);
  }

  if (sortSelect.value === "price-asc") {
    items.sort((a, b) => priceOf(a) - priceOf(b));
  } else if (sortSelect.value === "price-desc") {
    items.sort((a, b) => priceOf(b) - priceOf(a));
  }

  grid.innerHTML = "";
  items.forEach((entry) => grid.appendChild(buildProductCard(entry)));
  countEl.textContent = `${items.length} ${items.length === 1 ? "taula" : "taules"}`;
}

shapeFilter.addEventListener("change", renderShop);
sortSelect.addEventListener("change", renderShop);

renderShop();
