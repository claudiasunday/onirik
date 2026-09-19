/**
 * Onirik Boards — dades de producte i render de la taula en SVG.
 * Comparteixen aquest fitxer la Home (targetes de producte) i el
 * configurador "Personalitza la teva taula".
 */

const SHAPES = [
  {
    // Cua notada/fishtail ("Peix — la que tiene cola" a les fotos reals).
    id: "peix",
    name: "PEIX",
    tag: "PRO",
    price: 149,
    tagline: "Rendiment i control per a nivells avançats.",
    description:
      "Pensada per a qui ja domina l'equilibri i busca precisió: la cua notada dona un control extra en gir i frenada, tant a l'aigua com a la neu.",
    activities: ["surf", "snow", "skim"],
    path:
      "M100,6 C132,6 160,58 164,148 C167,206 158,244 142,272 " +
      "L124,258 L100,286 L76,258 L58,272 " +
      "C42,244 33,206 36,148 C40,58 68,6 100,6 Z",
  },
  {
    // Forma "ull"/fulla, punta al nas i a la cua (com al producte real:
    // "Lasai significa Calma en Euskera").
    id: "lasai",
    name: "LASAI",
    tag: "INICIACIÓ",
    price: 129,
    tagline: "Calma i estabilitat per començar.",
    description:
      "Base àmplia i estable, ideal per iniciar-se en l'equilibri, fer ioga o tonificar sense pressa. \"Lasai\" significa calma en euskera.",
    activities: ["yoga", "tonificacio"],
    path:
      "M100,6 C140,36 172,94 172,150 C172,206 140,262 100,294 " +
      "C60,262 28,206 28,150 C28,94 60,36 100,6 Z",
  },
  {
    // Nas apuntat + cantell pla/facetat (tall angular, no arrodonit), com
    // a les fotos reals de "La free".
    id: "la-free",
    name: "LA FREE",
    tag: "FREESTYLE",
    price: 139,
    tagline: "Agilitat i estil per a moviments lliures.",
    description:
      "Nas apuntat i cantells facetats per a qui busca maniobrabilitat i un toc freestyle, tant al surf com a l'skim.",
    activities: ["surf", "skim"],
    path:
      "M100,6 C130,6 155,48 158,118 L158,228 L134,268 L100,286 " +
      "L66,268 L42,228 L42,118 C45,48 70,6 100,6 Z",
  },
  {
    // Forma arrodonida clàssica (encara no tenim foto real de la Keki:
    // es manté tal com estava).
    id: "keki",
    name: "KEKI",
    tag: "+KIDS",
    price: 119,
    tagline: "Estable, versàtil i divertida.",
    description:
      "Perfecta per a qui busca una taula que s'adapta a diferents condicions i nivells. La seva forma arrodonida dona estabilitat sense renunciar a la diversió.",
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
// Cada patró (`kind`) defineix quina part de la taula és "de color": la
// resta és sempre fusta o un to fix propi del disseny. El pas 3 (color)
// només pinta aquesta zona concreta — mai substitueix tot el disseny.
const DESIGNS = [
  { id: "fusta-natural", name: "Fusta amb vernis", kind: "wood", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "fusta-teca", name: "Fusta amb vernis teca", kind: "wood", wood: ["#a9723f", "#6b3d1f"] },
  { id: "solid", name: "Fullcolor sòlid", kind: "solid", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "franja-dreta", name: "Franja al mig-dret", kind: "franja-dreta", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "franges-centre", name: "Franja gran i franges petites", kind: "franges-centre", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "diagonal", name: "Diagonal amb franja", kind: "diagonal", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "meitat", name: "Meitat de color", kind: "meitat", wood: ["#e7c9a0", "#c98a4b"] },
];

// To neutre que marca, abans de triar color, quina zona d'un disseny és
// "de color" (la resta del disseny ja es veu amb el seu aspecte final).
const COLOR_PLACEHOLDER = "#cfcfcf";
// To fix (no editable) que usen els blocs foscos d'alguns dissenys.
const DESIGN_DARK = "#313030";

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

// Roller de suro — accessori que es ven sol o en pack amb una taula.
const ROLLER = {
  id: "roller-suro",
  name: "Roller de suro",
  price: 39,
  tagline: "Suro massís, 11 cm de diàmetre.",
  description:
    "El complement natural de la teva balance board: suro massís, lleuger i amb el grip just per practicar a qualsevol superfície, dins o fora de casa.",
};

let __uid = 0;

/**
 * Genera el markup SVG d'una taula.
 * @param {Object} opts
 * @param {string} opts.shapeId
 * @param {string} [opts.designId]
 * @param {string} [opts.colorId] - pinta només la zona "de color" del disseny triat
 * @param {boolean} [opts.showLogo]
 */
function renderBoardSVG({ shapeId, designId, colorId, showLogo = true }) {
  const shape = SHAPES.find((s) => s.id === shapeId) || SHAPES[0];
  const design = DESIGNS.find((d) => d.id === designId) || DESIGNS[0];
  const color = COLORS.find((c) => c.id === colorId);
  const uid = `b${__uid++}`;
  const gradId = `grad-${uid}`;
  const clipId = `clip-${uid}`;
  const [woodA, woodB] = design.wood;
  // Zona "de color" del disseny: mentre no se'n triï cap, es marca amb un
  // to neutre perquè es vegi on s'aplicarà, sense donar-la per definitiva.
  const accent = color ? color.hex : COLOR_PLACEHOLDER;

  let layers;
  switch (design.kind) {
    case "solid":
      // Tot el disseny és la zona de color.
      layers = `<rect x="0" y="0" width="200" height="300" fill="${accent}" />`;
      break;

    case "franja-dreta":
      // Bloc fosc a l'esquerra + franja de color + fusta a la dreta.
      layers = `
        <rect x="0" y="0" width="200" height="300" fill="url(#${gradId})" />
        <rect x="0" y="0" width="110" height="300" fill="${DESIGN_DARK}" />
        <rect x="110" y="0" width="14" height="300" fill="${accent}" />
      `;
      break;

    case "franges-centre":
      // Fusta a l'esquerra, dues franges petites al centre (una fixa,
      // una de color) i un bloc fosc gran a la dreta.
      layers = `
        <rect x="0" y="0" width="200" height="300" fill="url(#${gradId})" />
        <rect x="92" y="0" width="108" height="300" fill="${DESIGN_DARK}" />
        <rect x="76" y="0" width="8" height="300" fill="${DESIGN_DARK}" />
        <rect x="84" y="0" width="8" height="300" fill="${accent}" />
      `;
      break;

    case "diagonal":
      // Meitat fosca / meitat fusta partides en diagonal, amb una franja
      // de color seguint el tall.
      layers = `
        <polygon points="0,0 0,300 200,300" fill="url(#${gradId})" />
        <polygon points="0,0 200,0 200,300" fill="${DESIGN_DARK}" />
        <line x1="0" y1="0" x2="200" y2="300" stroke="${accent}" stroke-width="16" />
      `;
      break;

    case "meitat":
      // Meitat fusta, meitat de color.
      layers = `
        <rect x="0" y="0" width="200" height="300" fill="url(#${gradId})" />
        <rect x="100" y="0" width="100" height="300" fill="${accent}" />
      `;
      break;

    case "wood":
    default:
      // Fusta massissa: el color no hi té cap efecte.
      layers = `<rect x="0" y="0" width="200" height="300" fill="url(#${gradId})" />`;
      break;
  }

  return `
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${shape.name}">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${woodA}" />
          <stop offset="100%" stop-color="${woodB}" />
        </linearGradient>
        <clipPath id="${clipId}">
          <path d="${shape.path}" />
        </clipPath>
      </defs>
      <g clip-path="url(#${clipId})">
        ${layers}
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

/**
 * Genera el markup SVG del roller de suro (accessori i packs).
 */
function renderRollerSVG() {
  const uid = `r${__uid++}`;
  const gradId = `cork-grad-${uid}`;
  return `
    <svg viewBox="0 0 200 220" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${ROLLER.name}">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#d9b98a" />
          <stop offset="100%" stop-color="#a97b45" />
        </linearGradient>
      </defs>
      <rect x="52" y="34" width="96" height="158" rx="22" fill="url(#${gradId})" />
      <ellipse cx="100" cy="34" rx="48" ry="17" fill="#e6c9a0" stroke="rgba(0,0,0,0.12)" stroke-width="2" />
      <image href="assets/images/logo-icon.png" x="76" y="17" width="48" height="34" opacity="0.85" />
    </svg>
  `;
}

/**
 * Foto real del roller de suro (substitueix el render SVG on hi ha espai
 * per a una imatge de producte real).
 */
function renderRollerPhoto() {
  return `<img class="roller-photo" src="assets/images/roller-suro.png" alt="${ROLLER.name}" loading="lazy" />`;
}

/**
 * Miniatura d'una taula del catàleg: fa servir la foto real del producte
 * quan n'hi ha (camp `photo` a l'entrada), i si no cau al render SVG
 * dinàmic (necessari per a packs/edicions on el color es tria en viu).
 */
function renderBoardThumb(entry) {
  if (entry.photo) {
    const shape = SHAPES.find((s) => s.id === entry.shapeId);
    return `<img class="board-photo" src="${entry.photo}" alt="${shape ? shape.name : ""}" loading="lazy" />`;
  }
  return renderBoardSVG({
    shapeId: entry.shapeId,
    designId: entry.designId,
    colorId: entry.colorId,
  });
}

// Catàleg de mostra usat tant a la Home ("Edició limitada") com a la Tenda.
const CATALOG = [
  { id: "p1", shapeId: "peix", designId: "diagonal", colorId: "taronja", discount: null },
  { id: "p2", shapeId: "lasai", designId: "fusta-natural", colorId: null, discount: null },
  { id: "p3", shapeId: "keki", designId: "franja-dreta", colorId: "negre", discount: 20 },
  { id: "p4", shapeId: "peix", designId: "franja-dreta", colorId: "taronja", discount: null },
  { id: "p5", shapeId: "lasai", designId: "fusta-teca", colorId: null, discount: null },
  { id: "p6", shapeId: "keki", designId: "solid", colorId: "negre", discount: 15, photo: "assets/images/board-keki-negre.png" },
  { id: "p7", shapeId: "la-free", designId: "meitat", colorId: "taronja", discount: null },
  { id: "p8", shapeId: "lasai", designId: "franges-centre", colorId: "teal", discount: null },
  { id: "p9", shapeId: "la-free", designId: "fusta-natural", colorId: null, discount: null },
];

// Packs — taula + roller de suro amb preu conjunt (estalvi respecte
// comprar-ho per separat). Un pack per forma, per mantenir la simetria
// amb el catàleg de taules.
const PACKS = [
  { id: "pk1", kind: "pack", shapeId: "peix", designId: "franja-dreta", colorId: "vermell", packPrice: 169 },
  { id: "pk2", kind: "pack", shapeId: "lasai", designId: "franges-centre", colorId: "lavanda", packPrice: 149 },
  { id: "pk3", kind: "pack", shapeId: "keki", designId: "fusta-teca", colorId: null, packPrice: 139 },
  { id: "pk4", kind: "pack", shapeId: "la-free", designId: "diagonal", colorId: "blau", packPrice: 159 },
];

// Edicions especials — peces amb nom propi i tirada limitada (no es
// repeteixen quan s'esgoten). Inspirades en peces reals com "Muntanya
// Còsmica" de la tenda d'Onirik.
const EDITIONS = [
  {
    id: "ed1",
    kind: "edition",
    editionName: "Muntanya Còsmica",
    shapeId: "lasai",
    designId: "diagonal",
    colorId: "lavanda",
    price: 179,
    units: 5,
    story: "Inspirada en les nits d'estiu al Pirineu: una franja còsmica sobre fusta natural.",
  },
  {
    id: "ed2",
    kind: "edition",
    editionName: "Marea Salvatge",
    shapeId: "peix",
    designId: "meitat",
    colorId: "teal",
    price: 199,
    units: 4,
    story: "Mig fusta, mig mar: per a qui no vol perdre l'onatge de vista.",
  },
  {
    id: "ed3",
    kind: "edition",
    editionName: "Bosc Daurat",
    shapeId: "la-free",
    designId: "fusta-teca",
    colorId: null,
    price: 159,
    units: 6,
    story: "Vernís de teca calent, de vetes profundes: fusta i prou.",
  },
];

const SHAPE_TYPE_LABEL = {
  peix: "fish",
  lasai: "evolutive",
  "la-free": "freestyle",
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
    <div class="thumb">${renderBoardThumb(entry)}</div>
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

/**
 * Preu efectiu d'una entrada del catàleg (taula normal, pack, edició o accessori).
 */
function getEntryPrice(entry) {
  if (entry.kind === "pack") return entry.packPrice;
  if (entry.kind === "edition") return entry.price;
  if (entry.kind === "accessori") return entry.price;
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  return entry.discount ? Math.round(shape.price * (1 - entry.discount / 100)) : shape.price;
}

function buildPackCard(entry) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  const separatePrice = shape.price + ROLLER.price;
  const save = separatePrice - entry.packPrice;

  const card = document.createElement("div");
  card.className = "product-card pack-card";
  card.innerHTML = `
    <span class="badge badge-pack">Pack</span>
    <div class="thumb pack-thumb">
      <div class="pack-thumb-board">${renderBoardSVG({
        shapeId: entry.shapeId,
        designId: entry.designId,
        colorId: entry.colorId,
      })}</div>
      <div class="pack-thumb-roller">${renderRollerPhoto()}</div>
    </div>
    <h3>${shape.name} + Roller</h3>
    <p class="p-type">Taula i roller de suro</p>
    <p class="p-price">${entry.packPrice}€ <s style="color:var(--c-muted);font-weight:400;">${separatePrice}€</s></p>
    <p class="p-save">Estalvia ${save}€</p>
  `;
  card.addEventListener("click", () => (window.location.href = "personalitza.html"));
  return card;
}

function buildEditionCard(entry) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);

  const card = document.createElement("div");
  card.className = "product-card edition-card";
  card.innerHTML = `
    <span class="badge badge-edition">Edició especial</span>
    <div class="thumb">${renderBoardSVG({
      shapeId: entry.shapeId,
      designId: entry.designId,
      colorId: entry.colorId,
    })}</div>
    <h3>${entry.editionName}</h3>
    <p class="p-type">${shape.name} · Queden ${entry.units} unitats</p>
    <p class="p-price">${entry.price}€</p>
  `;
  card.addEventListener("click", () => (window.location.href = "personalitza.html"));
  return card;
}

function buildAccessoryCard(entry) {
  const card = document.createElement("div");
  card.className = "product-card accessory-card";
  card.innerHTML = `
    <div class="thumb roller-thumb">${renderRollerPhoto()}</div>
    <h3>${entry.name}</h3>
    <p class="p-type">${entry.tagline}</p>
    <p class="p-price">${entry.price}€</p>
  `;
  card.addEventListener("click", () => (window.location.href = "personalitza.html"));
  return card;
}

/**
 * Punt d'entrada únic per pintar qualsevol targeta del catàleg (taula,
 * pack, edició especial o accessori), segons `entry.kind`.
 */
function buildCatalogCard(entry) {
  if (entry.kind === "pack") return buildPackCard(entry);
  if (entry.kind === "edition") return buildEditionCard(entry);
  if (entry.kind === "accessori") return buildAccessoryCard(entry);
  return buildProductCard(entry);
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
