/**
 * Home — omple les targetes de producte a partir de combinacions
 * predefinides de forma + disseny + color.
 */

const FEATURED_PRODUCTS = [
  { shapeId: "trik", designId: "tigre", colorId: null, discount: null },
  { shapeId: "lasai", designId: "natural", colorId: null, discount: null },
  { shapeId: "keki", designId: "ratlla-fosca", colorId: null, discount: 20 },
  { shapeId: "trik", designId: "ratlla-taronja", colorId: null, discount: null },
];

function productCard(entry) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  const price = entry.discount
    ? Math.round(shape.price * (1 - entry.discount / 100))
    : shape.price;

  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    ${entry.discount ? `<span class="badge">-${entry.discount}%</span>` : ""}
    <div class="thumb">${renderBoardSVG({
      shapeId: entry.shapeId,
      designId: entry.designId,
      colorId: entry.colorId,
    })}</div>
    <h3>${shape.name}</h3>
    <p class="p-type">Board tipo ${entry.shapeId === "lasai" ? "evolutive" : "fish"}</p>
    <p class="p-price">${price}€${
    entry.discount ? ` <s style="color:var(--c-muted);font-weight:400;">${shape.price}€</s>` : ""
  }</p>
  `;
  card.addEventListener("click", () => {
    window.location.href = "personalitza.html";
  });
  return card;
}

function mountProducts() {
  const grid1 = document.getElementById("product-grid-1");
  const grid2 = document.getElementById("product-grid-2");
  FEATURED_PRODUCTS.slice(0, 2).forEach((p) => grid1.appendChild(productCard(p)));
  FEATURED_PRODUCTS.slice(2, 4).forEach((p) => grid2.appendChild(productCard(p)));
}

document.getElementById("year").textContent = new Date().getFullYear();
mountProducts();
