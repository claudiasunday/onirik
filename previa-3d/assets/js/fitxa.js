/**
 * Fitxa de producte — pàgina de detall per a qualsevol peça de la Tenda
 * (taula, pack, edició especial o accessori), generada dinàmicament a
 * partir de les dades de board.js segons l'id a la URL (?id=...). Un sol
 * fitxer per a totes les fitxes, en lloc d'un HTML per peça: les 13
 * taules + 4 packs + 3 edicions + l'accessori comparteixen estructura i
 * només canvien les dades, igual que el configurador i la Tenda ja fan.
 */

const FITXA_ALL = [
  ...CATALOG.map((e) => ({ ...e, kind: e.kind || "board" })),
  ...PACKS,
  ...EDITIONS,
  { ...ROLLER, kind: "accessori" },
];

function findEntry(id) {
  return FITXA_ALL.find((e) => e.id === id);
}

function fitxaPriceBlock(current, original) {
  if (original && original !== current) {
    return `<p class="fitxa-price">${current}€ <s>${original}€</s></p>`;
  }
  return `<p class="fitxa-price">${current}€</p>`;
}

function fitxaActivities(activities) {
  if (!activities || !activities.length) return "";
  return `
    <p class="shape-activities-label">Ideal per a</p>
    <div class="activity-row activity-chips">
      ${activities
        .map(
          (a) =>
            `<div class="activity-chip"><span class="activity-chip-icon" aria-hidden="true">${activityIcon(
              a
            )}</span><span class="activity-chip-label">${ACTIVITY_LABELS[a]}</span></div>`
        )
        .join("")}
    </div>
  `;
}

function fitxaCta(title, entryId) {
  const msg = encodeURIComponent(`Hola! Estic interessat/da en: ${title}.`);
  return `
    <div class="fitxa-cta">
      <div class="fitxa-cta-main">
        <div class="qty-stepper" role="group" aria-label="Quantitat">
          <button type="button" class="qty-btn" data-qty-minus aria-label="Treure una unitat">−</button>
          <span class="qty-value" data-qty-value>1</span>
          <button type="button" class="qty-btn" data-qty-plus aria-label="Afegir una unitat">+</button>
        </div>
        <button type="button" class="btn btn-primary" data-add-to-cart>Afegeix a la cistella</button>
      </div>
      <button type="button" class="wizard-cta-link" data-buy-now>Comana-la ara →</button>
      <a class="wizard-cta-link" href="personalitza.html">O personalitza la teva pròpia →</a>
    </div>
    <p class="fitxa-cart-confirm" data-cart-confirm hidden>✓ Afegit a la cistella · <a href="cistella.html">Veure-la →</a></p>
  `;
}

/**
 * Connecta el selector de quantitat i el botó "Afegeix a la cistella" de
 * la fitxa que s'acaba de pintar (es crida des de setFitxa, un cop
 * l'HTML ja existeix al DOM).
 */
function wireFitxaCta(entryId) {
  const detail = document.getElementById("fitxa-detail");
  const qtyValue = detail.querySelector("[data-qty-value]");
  const minusBtn = detail.querySelector("[data-qty-minus]");
  const plusBtn = detail.querySelector("[data-qty-plus]");
  const addBtn = detail.querySelector("[data-add-to-cart]");
  const buyNowBtn = detail.querySelector("[data-buy-now]");
  const confirm = detail.querySelector("[data-cart-confirm]");
  if (!qtyValue || !addBtn) return;

  let qty = 1;
  minusBtn.addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValue.textContent = qty;
  });
  plusBtn.addEventListener("click", () => {
    qty += 1;
    qtyValue.textContent = qty;
  });
  addBtn.addEventListener("click", () => {
    addToCart(entryId, qty);
    confirm.hidden = false;
    qty = 1;
    qtyValue.textContent = qty;
  });
  buyNowBtn.addEventListener("click", () => {
    addToCart(entryId, qty);
    window.location.href = "comanda.html";
  });
}

function setFitxa({ previewHtml, title, badge, tagline, priceHtml, extra = "", description, activitiesHtml = "", specs, ctaTitle, entryId }) {
  document.title = `${title} — ONIRIK BOARDS`;
  document.getElementById("fitxa-preview").innerHTML = previewHtml;
  document.getElementById("fitxa-detail").innerHTML = `
    <div class="option-head">
      <h1>${title}</h1>
      ${badge ? `<span class="tag${badge.className ? " " + badge.className : ""}">${badge.label}</span>` : ""}
    </div>
    ${tagline ? `<p class="shape-tagline">${tagline}</p>` : ""}
    ${priceHtml}
    ${extra}
    <p class="shape-description">${description}</p>
    ${activitiesHtml}
    ${specs ? `<p class="fitxa-specs">${specs}</p>` : ""}
    ${fitxaCta(ctaTitle, entryId)}
  `;
  wireFitxaCta(entryId);
}

function renderBoardFitxa(entry) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  const design = DESIGNS.find((d) => d.id === entry.designId);
  const color = entry.colorId ? COLORS.find((c) => c.id === entry.colorId) : null;
  const price = entry.discount ? Math.round(shape.price * (1 - entry.discount / 100)) : shape.price;
  const title = design ? `${shape.name} — ${design.name}` : shape.name;

  setFitxa({
    previewHtml: `${entry.discount ? `<span class="fitxa-badge">-${entry.discount}%</span>` : ""}${renderBoardThumb(entry)}`,
    title,
    badge: { label: shape.tag },
    tagline: shape.tagline,
    priceHtml: fitxaPriceBlock(price, entry.discount ? shape.price : null),
    description: shape.description,
    activitiesHtml: fitxaActivities(shape.activities),
    specs: `Fusta contraplacada, fabricada i vernissada a mà en sèries curtes.${
      design ? ` Disseny: ${design.name.toLowerCase()}.` : ""
    }${color ? ` Color: ${color.name.toLowerCase()}.` : ""}`,
    ctaTitle: title,
    entryId: entry.id,
  });
}

function renderPackFitxa(entry) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);
  const separatePrice = shape.price + ROLLER.price;
  const save = separatePrice - entry.packPrice;
  const title = `${shape.name} + Roller de suro`;

  setFitxa({
    previewHtml: `
      <div class="thumb pack-thumb fitxa-pack-thumb">
        <div class="pack-thumb-board">${renderBoardSVG({
          shapeId: entry.shapeId,
          designId: entry.designId,
          colorId: entry.colorId,
        })}</div>
        <div class="pack-thumb-roller">${renderRollerPhoto()}</div>
      </div>
    `,
    title,
    badge: { label: "Pack", className: "badge-pack" },
    tagline: shape.tagline,
    priceHtml: fitxaPriceBlock(entry.packPrice, separatePrice),
    extra: `<p class="p-save">Estalvia ${save}€ respecte comprar-ho per separat</p>`,
    description: `${shape.description} ${ROLLER.description}`,
    activitiesHtml: fitxaActivities(shape.activities),
    specs: "Inclou una taula i un roller de suro massís de 11 cm de diàmetre.",
    ctaTitle: title,
    entryId: entry.id,
  });
}

function renderEditionFitxa(entry) {
  const shape = SHAPES.find((s) => s.id === entry.shapeId);

  setFitxa({
    previewHtml: renderBoardSVG({
      shapeId: entry.shapeId,
      designId: entry.designId,
      colorId: entry.colorId,
    }),
    title: entry.editionName,
    badge: { label: "Edició especial", className: "badge-edition" },
    tagline: `${shape.name} · Queden ${entry.units} unitats`,
    priceHtml: fitxaPriceBlock(entry.price),
    description: `${entry.story} ${shape.description}`,
    activitiesHtml: fitxaActivities(shape.activities),
    specs: "Peça de tirada limitada: un cop esgotada, no es torna a fabricar.",
    ctaTitle: entry.editionName,
    entryId: entry.id,
  });
}

function renderAccessoriFitxa(entry) {
  setFitxa({
    previewHtml: renderRollerPhoto(),
    title: entry.name,
    tagline: entry.tagline,
    priceHtml: fitxaPriceBlock(entry.price),
    description: entry.description,
    specs: "Compatible amb qualsevol taula ONIRIK. Suro massís, 11 cm de diàmetre.",
    ctaTitle: entry.name,
    entryId: entry.id,
  });
}

function renderNotFoundFitxa() {
  document.title = "Producte no trobat — ONIRIK BOARDS";
  document.getElementById("fitxa-main").innerHTML = `
    <div class="option-panel">
      <div class="shape-detail">
        <h1>Producte no trobat</h1>
        <p class="shape-description">Aquesta peça ja no està disponible o l'enllaç no és correcte.</p>
        <div class="fitxa-cta">
          <a class="btn btn-primary" href="tenda.html">Tornar a la tenda</a>
        </div>
      </div>
    </div>
  `;
}

// "També et pot interessar": 3 altres taules amb foto real, excloent la
// peça actual (si és una taula) perquè no es recomani a si mateixa.
function renderRelated(currentId) {
  const pool = CATALOG.filter((e) => e.photo && e.id !== currentId);
  if (!pool.length) return;
  const picks = pool.slice(0, 3);
  const section = document.getElementById("fitxa-related-section");
  const grid = document.getElementById("fitxa-related");
  picks.forEach((entry) => grid.appendChild(buildProductCard(entry)));
  section.hidden = false;
}

const fitxaParams = new URLSearchParams(location.search);
const fitxaEntry = findEntry(fitxaParams.get("id"));

if (!fitxaEntry) {
  renderNotFoundFitxa();
} else {
  if (fitxaEntry.kind === "pack") renderPackFitxa(fitxaEntry);
  else if (fitxaEntry.kind === "edition") renderEditionFitxa(fitxaEntry);
  else if (fitxaEntry.kind === "accessori") renderAccessoriFitxa(fitxaEntry);
  else renderBoardFitxa(fitxaEntry);
  renderRelated(fitxaEntry.id);
}
