/**
 * Onirik Boards — dades de producte i render de la taula en SVG.
 * Comparteixen aquest fitxer la Home (targetes de producte) i el
 * configurador "Personalitza la teva taula".
 */

const SHAPES = [
  {
    // Cua notada/fishtail ("Peix — la que tiene cola" a les fotos reals).
    id: "peix",
    // Foto real de la forma (selector de forma del configurador, com al Figma)
    photo: "assets/images/board-peix-negre-mostassa.png",
    name: "PEIX",
    tag: "PRO",
    price: 149,
    tagline: "Rendiment i control per a nivells avançats.",
    description:
      "Pensada per a qui ja domina l'equilibri i busca precisió: la cua notada dona un control extra en gir i frenada, tant a l'aigua com a la neu.",
    activities: ["surf", "snow", "skim"],
    // Silueta traçada de la foto real (simètrica), viewBox 200x300
    path:
      "M98.7,6.0 L83.1,27.3 L70.8,47.1 L61.8,65.6 L56.1,81.8 L51.0,106.7 L47.4,134.9 L46.5,152.2 " +
      "L46.8,184.9 L48.6,205.6 L53.7,234.1 L59.7,243.7 L66.0,260.7 L69.6,268.2 L82.2,290.1 L84.6,293.4 " +
      "L86.1,294.0 L88.5,293.4 L99.3,277.5 L100.7,277.5 L111.5,293.4 L113.9,294.0 L115.4,293.4 " +
      "L117.8,290.1 L130.4,268.2 L134.0,260.7 L140.3,243.7 L145.7,235.6 L146.9,232.3 L151.4,205.6 " +
      "L152.9,190.0 L153.5,177.4 L153.2,144.5 L151.7,126.2 L147.5,97.7 L143.9,81.8 L139.4,68.6 " +
      "L130.7,49.8 L122.3,35.4 L103.1,7.8 L101.3,6.0 Z",
    // Posició del disc amb el logo gravat (com a la foto)
    disc: [68, 231],
  },
  {
    // Forma "ull"/fulla, punta al nas i a la cua (com al producte real:
    // "Lasai significa Calma en Euskera").
    id: "lasai",
    // Foto real de la forma (selector de forma del configurador, com al Figma)
    photo: "assets/images/board-lasai-blau.png",
    name: "LASAI",
    tag: "INICIACIÓ",
    price: 129,
    tagline: "Calma i estabilitat per començar.",
    description:
      "Base àmplia i estable, ideal per iniciar-se en l'equilibri, fer ioga o tonificar sense pressa. \"Lasai\" significa calma en euskera.",
    activities: ["yoga", "tonificacio"],
    // Silueta traçada de la foto real (simètrica), viewBox 200x300
    path:
      "M98.1,6.0 L92.3,11.8 L85.3,20.9 L74.0,38.1 L63.8,57.7 L57.4,74.3 L51.6,94.0 L46.9,118.3 " +
      "L45.2,138.5 L44.9,162.0 L46.6,180.0 L50.2,201.6 L54.9,219.3 L63.8,243.4 L70.1,256.4 L82.0,275.2 " +
      "L95.3,291.0 L98.1,293.4 L100.8,294.0 L103.0,292.6 L112.7,282.1 L122.4,268.8 L129.9,256.4 " +
      "L135.1,245.9 L140.9,231.5 L147.3,211.6 L152.0,189.7 L154.8,166.2 L155.1,145.2 L153.1,118.3 " +
      "L150.6,103.7 L145.6,83.7 L137.6,61.1 L126.0,38.1 L114.7,20.9 L107.7,11.8 L102.5,6.3 Z",
    // Posició del disc amb el logo gravat (com a la foto)
    disc: [71, 187],
  },
  {
    // Nas apuntat + cantell pla/facetat (tall angular, no arrodonit), com
    // a les fotos reals de "La free".
    id: "la-free",
    // Foto real de la forma (selector de forma del configurador, com al Figma)
    photo: "assets/images/board-keki-negre.png",
    name: "LA FREE",
    tag: "FREESTYLE",
    price: 139,
    tagline: "Agilitat i estil per a moviments lliures.",
    description:
      "Nas apuntat i cantells facetats per a qui busca maniobrabilitat i un toc freestyle, tant al surf com a l'skim.",
    activities: ["surf", "skim"],
    // Silueta traçada de la foto real (simètrica), viewBox 200x300
    path:
      "M98.8,6.0 L95.8,7.2 L89.6,12.0 L83.0,18.8 L76.4,28.1 L64.2,51.7 L58.5,65.4 L52.8,82.4 L46.9,109.9 " +
      "L44.5,134.3 L45.1,170.1 L48.4,207.5 L51.7,232.2 L55.8,256.4 L60.6,277.0 L64.2,288.3 L66.3,292.8 " +
      "L67.8,294.0 L132.2,294.0 L134.3,291.9 L139.4,277.0 L142.7,263.3 L146.6,243.6 L151.0,212.5 " +
      "L154.3,179.1 L155.2,163.0 L155.5,134.3 L154.6,120.9 L151.9,103.0 L147.2,82.4 L141.5,65.4 " +
      "L133.4,46.6 L123.6,28.1 L115.5,17.0 L110.4,12.0 L104.2,7.2 L101.2,6.0 Z",
    // Posició del disc amb el logo gravat (com a la foto)
    disc: [100, 150],
  },
  {
    // Forma arrodonida clàssica (encara no tenim foto real de la Keki:
    // es manté tal com estava).
    id: "keki",
    // Foto real de la forma (selector de forma del configurador, com al Figma)
    photo: "assets/images/board-peix-blau.png",
    name: "KEKI",
    tag: "+KIDS",
    price: 119,
    tagline: "Estable, versàtil i divertida.",
    description:
      "Perfecta per a qui busca una taula que s'adapta a diferents condicions i nivells. La seva forma arrodonida dona estabilitat sense renunciar a la diversió.",
    activities: ["skim", "tonificacio"],
    // Silueta traçada de la foto real (simètrica), viewBox 200x300
    path:
      "M96.4,6.0 L93.0,7.7 L87.4,12.2 L76.5,22.8 L69.0,32.3 L63.9,40.7 L59.2,50.5 L56.1,59.7 L52.5,73.7 " +
      "L48.8,92.1 L46.6,110.6 L45.8,126.0 L46.6,182.7 L49.9,236.1 L55.3,279.5 L57.2,291.8 L59.5,294.0 " +
      "L61.7,293.7 L91.3,276.4 L94.1,275.3 L99.7,274.7 L104.5,275.0 L108.7,276.4 L138.3,293.7 " +
      "L140.5,294.0 L142.5,292.6 L147.8,256.8 L150.6,229.7 L152.8,195.6 L154.2,126.0 L153.4,110.6 " +
      "L151.2,92.1 L147.5,73.7 L142.8,56.1 L138.9,46.0 L132.7,34.8 L123.5,22.8 L109.5,9.6 L103.6,6.0 " +
      "L101.4,6.0 L100.0,7.1 L98.6,6.0 Z",
    // Posició del disc amb el logo gravat (com a la foto)
    disc: [100, 150],
  },
];

const ACTIVITY_LABELS = {
  surf: "surf",
  snow: "snow",
  skim: "skim",
  yoga: "ioga",
  tonificacio: "tonificació",
};

// Noms curts (1-2 paraules): els llargs ("Franja gran i franges petites")
// es tallaven al carrusel mòbil (76px) i descrivien la geometria en lloc
// de donar-li nom. La miniatura ja ensenya com és.
// "Disseny" — patrons / acabats aplicats a la superfície de la taula.
// Cada patró (`kind`) defineix quina part de la taula és "de color": la
// resta és sempre fusta o un to fix propi del disseny. El pas 3 (color)
// només pinta aquesta zona concreta — mai substitueix tot el disseny.
const DESIGNS = [
  { id: "fusta-natural", name: "Fusta natural", kind: "wood", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "fusta-teca", name: "Fusta teca", kind: "wood", wood: ["#a9723f", "#6b3d1f"] },
  { id: "solid", name: "Color sòlid", kind: "solid", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "franja-dreta", name: "Franja", kind: "franja-dreta", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "franges-centre", name: "Ratlles", kind: "franges-centre", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "diagonal", name: "Diagonal", kind: "diagonal", wood: ["#e7c9a0", "#c98a4b"] },
  { id: "meitat", name: "Meitat i meitat", kind: "meitat", wood: ["#e7c9a0", "#c98a4b"] },
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

// Oferta del configurador: el roller afegit a una taula personalitzada
// costa només això (en lloc del preu del roller sol).
const ROLLER_ADDON_PRICE = 10;

// Canal real de comandes: WhatsApp (no hi ha backend de veritat darrere
// del formulari de contacte, així que qualsevol comanda amb dades ja
// triades —cistella, fitxa— s'envia per aquí, on sí que arriba algú).
const WHATSAPP_PHONE = "34625579914";

function whatsappOrderUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

// Referència curta de producte (forma + tipus), de cara al client: mai
// inclou lot de fabricació ni quantitat —això ho assigna la Clàudia més
// tard, quan passa la comanda a l'Excel d'estoc intern.
const REF_SHAPE_CODE = {
  peix: "PE",
  lasai: "LAS",
  "la-free": "LFR",
  keki: "KEK",
};

function shortProductRef(entry) {
  if (entry.kind === "accessori") return "ROL";
  if (entry.kind === "roller-offer") return "ROL-OF";
  const shapeCode = REF_SHAPE_CODE[entry.shapeId] || "XX";
  if (entry.kind === "custom") return `${shapeCode}-PER`;
  if (entry.kind === "pack") return `${shapeCode}-PACK`;
  if (entry.kind === "edition") return `${shapeCode}-EDI`;
  return `${shapeCode}-BAS`;
}

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

  // Volum: el cantell de contraxapat (la mateixa silueta desplaçada cap
  // avall), la cara de dalt amb el disseny, llum de dalt a baix, un bisell
  // clar a la vora i el disc de fusta amb el logo gravat.
  const [discX, discY] = shape.disc || [100, 190];
  const shadeId = `shade-${uid}`;
  const discId = `disc-${uid}`;
  const shadowId = `shadow-${uid}`;
  return `
    <svg viewBox="0 0 200 300" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${shape.name}">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${woodA}" />
          <stop offset="100%" stop-color="${woodB}" />
        </linearGradient>
        <linearGradient id="${shadeId}" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.22" />
          <stop offset="45%" stop-color="#fff" stop-opacity="0" />
          <stop offset="100%" stop-color="#000" stop-opacity="0.16" />
        </linearGradient>
        <radialGradient id="${discId}" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0%" stop-color="#e6cfa6" />
          <stop offset="100%" stop-color="#c9a878" />
        </radialGradient>
        <filter id="${shadowId}" x="-20%" y="-10%" width="140%" height="125%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#313030" flood-opacity="0.18" />
        </filter>
        <clipPath id="${clipId}">
          <path d="${shape.path}" />
        </clipPath>
      </defs>
      <g filter="url(#${shadowId})">
        <path d="${shape.path}" transform="translate(0 3.5)" fill="#b8955f" />
        <path d="${shape.path}" transform="translate(0 3.5)" fill="none" stroke="#8c6b3e" stroke-width="1" />
        <g clip-path="url(#${clipId})">
          ${layers}
          <rect x="0" y="0" width="200" height="300" fill="url(#${shadeId})" />
        </g>
        <path d="${shape.path}" fill="none" stroke="#f1dfbf" stroke-opacity="0.75" stroke-width="2.4" clip-path="url(#${clipId})" />
        <path d="${shape.path}" fill="none" stroke="rgba(0,0,0,0.22)" stroke-width="0.8" />
      </g>
      ${
        showLogo
          ? `<g transform="translate(${discX} ${discY})">
               <circle r="12.5" fill="url(#${discId})" stroke="#a88456" stroke-width="0.8" />
               <path d="M-8,1.5 A8,8 0 0 1 8,1.5" fill="none" stroke="#8c6b3e" stroke-width="1.6" stroke-linecap="round" />
               <path d="M-5,1.5 A5,5 0 0 1 5,1.5" fill="none" stroke="#8c6b3e" stroke-width="1.6" stroke-linecap="round" />
               <path d="M-3,4 Q0,7 3,4" fill="none" stroke="#8c6b3e" stroke-width="1.6" stroke-linecap="round" />
             </g>`
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
/**
 * Foto de l'altra cara d'una taula amb foto: si la foto és la cara amb grip,
 * la de sota (fusta); si és la cara del dibuix, la mateixa forma amb grip.
 */
function entryAltPhoto(entry) {
  if (!entry.photo) return null;
  // Les imatges de reverse/ tenen la mateixa silueta que cada foto (en mirall):
  // fusta per a les fotos amb grip, i grip per a la que es presenta pel dibuix.
  return `assets/images/reverse/${entry.photo.split("/").pop().replace(".png", ".webp")}`;
}

function renderBoardThumb(entry, { withAlt = false } = {}) {
  if (entry.photo) {
    const shape = SHAPES.find((s) => s.id === entry.shapeId);
    const alt = withAlt ? entryAltPhoto(entry) : null;
    return `<img class="board-photo" src="${entry.photo}" alt="${shape ? shape.name : ""}" loading="lazy" />${
      alt ? `<img class="board-photo board-photo--alt" src="${alt}" alt="" loading="lazy" aria-hidden="true" />` : ""
    }`;
  }
  return renderBoardSVG({
    shapeId: entry.shapeId,
    designId: entry.designId,
    colorId: entry.colorId,
  });
}

// Catàleg de mostra usat tant a la Home ("Edició limitada") com a la Tenda.
const CATALOG = [
  // face: "design" = la foto mostra la cara del dibuix (la de sota, descoberta); la
  // cara amb grip és l'altra. Per defecte les fotos mostren la cara amb grip.
  { id: "p1", shapeId: "peix", designId: "diagonal", colorId: "taronja", discount: null, photo: "assets/images/board-peix-diagonal-verd.png", face: "design" },
  { id: "p2", shapeId: "lasai", designId: "fusta-natural", colorId: null, discount: null },
  { id: "p3", shapeId: "keki", designId: "franja-dreta", colorId: "negre", discount: 20 },
  { id: "p4", shapeId: "peix", designId: "franja-dreta", colorId: "taronja", discount: null },
  { id: "p5", shapeId: "lasai", designId: "fusta-teca", colorId: null, discount: null },
  { id: "p6", shapeId: "la-free", designId: "solid", colorId: "negre", discount: 15, photo: "assets/images/board-keki-negre.png" },
  { id: "p7", shapeId: "la-free", designId: "meitat", colorId: "taronja", discount: null },
  { id: "p8", shapeId: "lasai", designId: "franges-centre", colorId: "teal", discount: null },
  { id: "p9", shapeId: "la-free", designId: "fusta-natural", colorId: null, discount: null },
  { id: "p10", shapeId: "keki", designId: "solid", colorId: null, discount: null, photo: "assets/images/board-peix-blau.png" },
  { id: "p11", shapeId: "peix", designId: "solid", colorId: null, discount: null, photo: "assets/images/board-peix-negre-mostassa.png" },
  { id: "p12", shapeId: "lasai", designId: "solid", colorId: null, discount: null, photo: "assets/images/board-lasai-blau.png" },
  { id: "p13", shapeId: "la-free", designId: "solid", colorId: null, discount: null, photo: "assets/images/board-keki-teca-blau.png" },
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

// Totes les entrades del catàleg (taules, packs, edicions i l'accessori)
// en un sol llistat, per cercar qualsevol peça pel seu id — usat per la
// cistella (i reutilitzable per qualsevol altra pàgina que ho necessiti).
const ALL_CATALOG_ENTRIES = [
  ...CATALOG.map((e) => ({ ...e, kind: e.kind || "board" })),
  ...PACKS,
  ...EDITIONS,
  { ...ROLLER, kind: "accessori" },
];

function findCatalogEntry(id) {
  return ALL_CATALOG_ENTRIES.find((e) => e.id === id);
}

/**
 * Títol i miniatura "de visualització" d'una entrada del catàleg (taula,
 * pack, edició o accessori), per a qualsevol lloc que la mostri fora de
 * la seva targeta pròpia — p. ex. la cistella.
 */
function catalogEntryDisplay(entry) {
  if (entry.kind === "roller-offer") {
    return { title: `${ROLLER.name} (oferta)`, thumbHtml: renderRollerPhoto() };
  }
  if (entry.kind === "custom") {
    const shape = SHAPES.find((s) => s.id === entry.shapeId);
    const design = DESIGNS.find((d) => d.id === entry.designId);
    return {
      title: `${shape.name} personalitzada${design ? ` — ${design.name}` : ""}`,
      thumbHtml: renderBoardSVG({
        shapeId: entry.shapeId,
        designId: entry.designId,
        colorId: entry.colorId,
      }),
    };
  }
  if (entry.kind === "pack") {
    const shape = SHAPES.find((s) => s.id === entry.shapeId);
    return {
      title: `${shape.name} + Roller`,
      thumbHtml: `<div class="pack-thumb-board">${renderBoardSVG({
        shapeId: entry.shapeId,
        designId: entry.designId,
        colorId: entry.colorId,
      })}</div>`,
    };
  }
  if (entry.kind === "edition") {
    return {
      title: entry.editionName,
      thumbHtml: renderBoardSVG({
        shapeId: entry.shapeId,
        designId: entry.designId,
        colorId: entry.colorId,
      }),
    };
  }
  if (entry.kind === "accessori") {
    return { title: entry.name, thumbHtml: renderRollerPhoto() };
  }
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  return { title: shape.name, thumbHtml: renderBoardThumb(entry) };
}

/**
 * Fa que una targeta de producte (div, no <a>) sigui operable amb
 * teclat: focusable (tabindex) i activable amb Enter/Espai, a més del
 * clic de ratolí. Sense això les targetes eren invisibles per a
 * navegació amb teclat/lector de pantalla.
 */
function makeCardInteractive(card, onActivate) {
  card.setAttribute("role", "link");
  card.tabIndex = 0;
  card.addEventListener("click", onActivate);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  });
}

function buildProductCard(entry, { onClick } = {}) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  const price = entry.discount
    ? Math.round(shape.price * (1 - entry.discount / 100))
    : shape.price;

  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    ${entry.discount ? `<span class="badge">-${entry.discount}%</span>` : ""}
    <div class="thumb">${renderBoardThumb(entry, { withAlt: true })}</div>
    <h3>${shape.name}</h3>
    <p class="p-type">Board tipo ${SHAPE_TYPE_LABEL[entry.shapeId]}</p>
    <p class="p-price">${price}€${
    entry.discount ? ` <s style="color:var(--c-muted-light);font-weight:400;">${shape.price}€</s>` : ""
  }</p>
  `;
  makeCardInteractive(card, () => {
    if (onClick) onClick(entry);
    else window.location.href = `fitxa.html?id=${entry.id}`;
  });
  return card;
}

/**
 * Preu efectiu d'una entrada del catàleg (taula normal, pack, edició o accessori).
 */
function getEntryPrice(entry) {
  if (entry.kind === "custom" || entry.kind === "roller-offer") return entry.price;
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
    <p class="p-price">${entry.packPrice}€ <s style="color:var(--c-muted-light);font-weight:400;">${separatePrice}€</s></p>
    <p class="p-save">Estalvia ${save}€</p>
  `;
  makeCardInteractive(card, () => (window.location.href = `fitxa.html?id=${entry.id}`));
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
  makeCardInteractive(card, () => (window.location.href = `fitxa.html?id=${entry.id}`));
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
  makeCardInteractive(card, () => (window.location.href = `fitxa.html?id=${entry.id}`));
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
