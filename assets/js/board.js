/**
 * Onirik Boards — dades de producte i render de la taula en SVG.
 * Comparteixen aquest fitxer la Home (targetes de producte) i el
 * configurador "Personalitza la teva taula".
 */

const SHAPES = [
  {
    id: "trik",
    name: "TRIK",
    tag: "PRO",
    price: 149,
    activities: ["surf", "snow", "skim"],
    path:
      "M100,6 C132,6 160,58 164,148 C167,206 158,244 142,272 " +
      "L124,258 L100,286 L76,258 L58,272 " +
      "C42,244 33,206 36,148 C40,58 68,6 100,6 Z",
  },
  {
    id: "lasai",
    name: "LASAI",
    tag: "INICIACIÓ",
    price: 129,
    activities: ["yoga", "tonificacio"],
    path:
      "M100,10 C142,10 172,64 172,150 C172,238 142,290 100,290 " +
      "C58,290 28,238 28,150 C28,64 58,10 100,10 Z",
  },
  {
    id: "keki",
    name: "KEKI",
    tag: "+KIDS",
    price: 119,
    activities: ["skim", "tonificacio"],
    path:
      "M100,6 C136,6 160,58 162,148 C164,214 150,262 122,286 " +
      "C112,292 88,292 78,286 C50,262 36,214 38,148 " +
      "C40,58 64,6 100,6 Z",
  },
];

const ACTIVITY_LABELS = {
  surf: "surf",
  snow: "snow",
  skim: "skim",
  yoga: "ioga",
  tonificacio: "tonificació",
};

// "Disseny" — patrons / acabats aplicats a la superfície de la taula.
const DESIGNS = [
  { id: "natural", name: "Natural clar", stops: ["#e7c9a0", "#c98a4b"] },
  { id: "natural-fosc", name: "Natural fosc", stops: ["#a9723f", "#6b3d1f"] },
  { id: "bloc-negre", name: "Bloc negre", stops: ["#3a3a3a", "#161616"] },
  { id: "ratlla-taronja", name: "Ratlla central", stops: ["#e7c9a0", "#c98a4b"], stripe: "#f9b54f" },
  { id: "ratlla-fosca", name: "Ratlla fosca", stops: ["#e7c9a0", "#c98a4b"], stripe: "#232323" },
  { id: "tigre", name: "Tigre", stops: ["#f9b54f", "#232B4d"], zigzag: true },
];

// "Color" — a l'estil del disseny original, s'aplica a la meitat de la taula.
const COLORS = [
  { id: "blau", name: "Blau", hex: "#6f9ce8" },
  { id: "blanc", name: "Blanc", hex: "#ffffff" },
  { id: "lavanda", name: "Lavanda", hex: "#d9cdf0" },
  { id: "taronja", name: "Taronja", hex: "#f9b54f" },
  { id: "vermell", name: "Vermell", hex: "#c23b3b" },
  { id: "sàlvia", name: "Sàlvia", hex: "#8fada0" },
  { id: "teal", name: "Teal", hex: "#1f8a7a" },
  { id: "negre", name: "Negre", hex: "#141414" },
];

let __uid = 0;

/**
 * Genera el markup SVG d'una taula.
 * @param {Object} opts
 * @param {string} opts.shapeId
 * @param {string} [opts.designId]
 * @param {string} [opts.colorId] - si es passa, pinta la meitat dreta de la taula
 * @param {boolean} [opts.showLogo]
 */
function renderBoardSVG({ shapeId, designId, colorId, showLogo = true }) {
  const shape = SHAPES.find((s) => s.id === shapeId) || SHAPES[0];
  const design = DESIGNS.find((d) => d.id === designId) || DESIGNS[0];
  const color = COLORS.find((c) => c.id === colorId);
  const uid = `b${__uid++}`;
  const gradId = `grad-${uid}`;
  const clipId = `clip-${uid}`;

  let stripeMarkup = "";
  if (design.stripe) {
    stripeMarkup = `<rect x="92" y="4" width="16" height="292" fill="${design.stripe}" />`;
  }

  let zigzagMarkup = "";
  if (design.zigzag) {
    const [a, b] = design.stops;
    const stripes = [];
    for (let i = -2; i < 14; i++) {
      stripes.push(
        `<rect x="${i * 20 - 40}" y="-20" width="12" height="360" fill="${
          i % 2 === 0 ? a : b
        }" transform="rotate(20 100 150)" />`
      );
    }
    zigzagMarkup = stripes.join("");
  }

  const colorMarkup = color
    ? `<rect x="100" y="0" width="100" height="300" fill="${color.hex}" />`
    : "";

  return `
    <svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${shape.name}">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${design.stops[0]}" />
          <stop offset="100%" stop-color="${design.stops[1]}" />
        </linearGradient>
        <clipPath id="${clipId}">
          <path d="${shape.path}" />
        </clipPath>
      </defs>
      <g clip-path="url(#${clipId})">
        <rect x="0" y="0" width="200" height="300" fill="url(#${gradId})" />
        ${design.zigzag ? zigzagMarkup : ""}
        ${stripeMarkup}
        ${colorMarkup}
      </g>
      <path d="${shape.path}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" />
      ${
        showLogo
          ? `<circle cx="100" cy="190" r="9" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2" />
             <circle cx="100" cy="190" r="3" fill="rgba(0,0,0,0.35)" />`
          : ""
      }
    </svg>
  `;
}

// Catàleg de mostra usat tant a la Home ("Edició limitada") com a la Tenda.
const CATALOG = [
  { id: "p1", shapeId: "trik", designId: "tigre", colorId: null, discount: null },
  { id: "p2", shapeId: "lasai", designId: "natural", colorId: null, discount: null },
  { id: "p3", shapeId: "keki", designId: "ratlla-fosca", colorId: null, discount: 20 },
  { id: "p4", shapeId: "trik", designId: "ratlla-taronja", colorId: null, discount: null },
  { id: "p5", shapeId: "lasai", designId: "natural-fosc", colorId: null, discount: null },
  { id: "p6", shapeId: "keki", designId: "bloc-negre", colorId: null, discount: 15 },
  { id: "p7", shapeId: "trik", designId: "natural", colorId: "taronja", discount: null },
  { id: "p8", shapeId: "lasai", designId: "ratlla-fosca", colorId: "teal", discount: null },
];

const SHAPE_TYPE_LABEL = {
  trik: "fish",
  lasai: "evolutive",
  keki: "fish",
};

function buildProductCard(entry, { onClick } = {}) {
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
    <p class="p-type">Board tipo ${SHAPE_TYPE_LABEL[entry.shapeId]}</p>
    <p class="p-price">${price}€${
    entry.discount ? ` <s style="color:var(--c-muted);font-weight:400;">${shape.price}€</s>` : ""
  }</p>
  `;
  card.addEventListener("click", () => {
    if (onClick) onClick(entry);
    else window.location.href = "personalitza.html";
  });
  return card;
}

function activityIcon(key) {
  const icons = {
    surf: "🏄",
    snow: "🏂",
    skim: "🛹",
    yoga: "🧘",
    tonificacio: "💪",
  };
  return icons[key] || "•";
}
