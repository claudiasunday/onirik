/**
 * Tenda — llistat complet del catàleg: taules, packs (taula + roller) i
 * edicions especials, amb filtre per categoria, forma i ordenació per preu.
 */

const categoryTabs = document.querySelectorAll("[data-category]");
const shapeFilter = document.getElementById("filter-shape");
const sortSelect = document.getElementById("sort-select");
const grid = document.getElementById("shop-grid");
const countEl = document.getElementById("shop-count");

const CATEGORY_LABEL = {
  all: "peces",
  board: "taules",
  pack: "packs",
  edition: "edicions especials",
  accessori: "accessoris",
};

// Un únic llistat amb totes les categories, marcant les taules "normals"
// amb kind: "board" perquè el filtre de categoria les pugui distingir.
const ALL_ITEMS = [
  ...CATALOG.map((e) => ({ ...e, kind: e.kind || "board" })),
  ...PACKS,
  ...EDITIONS,
  { ...ROLLER, kind: "accessori" },
];

let activeCategory = new URLSearchParams(location.search).get("cat") || "all";
if (!CATEGORY_LABEL[activeCategory]) activeCategory = "all";

function setActiveCategory(cat) {
  activeCategory = cat;
  categoryTabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.category === cat));
  renderShop();
}

function renderShop() {
  let items =
    activeCategory === "all" ? [...ALL_ITEMS] : ALL_ITEMS.filter((e) => e.kind === activeCategory);

  if (shapeFilter.value !== "all") {
    items = items.filter((e) => e.shapeId === shapeFilter.value);
  }

  if (sortSelect.value === "price-asc") {
    items.sort((a, b) => getEntryPrice(a) - getEntryPrice(b));
  } else if (sortSelect.value === "price-desc") {
    items.sort((a, b) => getEntryPrice(b) - getEntryPrice(a));
  }

  grid.innerHTML = "";
  items.forEach((entry) => grid.appendChild(buildCatalogCard(entry)));
  const label = CATEGORY_LABEL[activeCategory] || "peces";
  countEl.textContent = `${items.length} ${label}`;
}

categoryTabs.forEach((btn) =>
  btn.addEventListener("click", () => setActiveCategory(btn.dataset.category))
);
shapeFilter.addEventListener("change", renderShop);
sortSelect.addEventListener("change", renderShop);

setActiveCategory(activeCategory);
