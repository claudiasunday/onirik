/**
 * Configurador "Personalitza la teva taula" — 3 passos (forma, disseny,
 * color) + resum final.
 *
 * Regla clau: els dissenys de fusta massissa (kind "wood") no tenen cap
 * zona de color, així que el pas 3 se salta (abans t'obligava a triar
 * un color que no canviava res de la taula).
 */

const state = {
  step: 1,
  maxStep: 1, // pas més llunyà al qual s'ha arribat amb "Continua"
  shapeIndex: 0,
  designId: null,
  colorId: null,
};

const OPTION_CHECK = `<span class="option-check" aria-hidden="true">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
</span>`;

const $ = (id) => document.getElementById(id);

const els = {
  wizard: document.querySelector(".wizard"),
  preview: $("board-preview"),
  steps: document.querySelectorAll(".wizard-step"),
  panels: {
    1: $("panel-shape"),
    2: $("panel-design"),
    3: $("panel-color"),
    4: $("panel-summary"),
  },
  title: $("step-title"),
  shapeName: $("shape-name"),
  shapeTag: $("shape-tag"),
  shapeTagline: $("shape-tagline"),
  shapeDescription: $("shape-description"),
  shapeActivities: $("shape-activities"),
  shapeGrid: $("shape-grid"),
  designGrid: $("design-grid"),
  designHint: $("design-hint"),
  colorGrid: $("color-grid"),
  barShape: $("bar-shape"),
  barDesign: $("bar-design"),
  barColor: $("bar-color"),
  barPrice: $("bar-price"),
  nav: $("wizard-nav"),
  btnBack: $("btn-back"),
  btnNext: $("btn-next"),
  btnNextLabel: $("btn-next-label"),
  error: $("wizard-error"),
  sumShape: $("sum-shape"),
  sumDesign: $("sum-design"),
  sumColor: $("sum-color"),
  sumColorEdit: $("sum-color-edit"),
  sumPrice: $("sum-price"),
  btnAddCart: $("btn-add-cart"),
  btnMoreCustom: $("btn-more-custom"),
  customModalBackdrop: $("custom-modal-backdrop"),
  customModal: $("custom-modal"),
  customModalClose: $("custom-modal-close"),
  customModalBody: $("custom-modal-body"),
  customModalForm: $("custom-modal-form"),
  customModalEmail: $("custom-modal-email"),
  customModalSuccess: $("custom-modal-success"),
  customModalDone: $("custom-modal-done"),
};

const STEP_COPY = {
  1: { title: "Quina taula s'adapta a tu?" },
  2: { title: "Quin acabat t'agrada més?" },
  3: { title: "Quin color la fa teva?" },
  4: { title: "Dissenyada per tu" },
};

// --- Dades derivades ---------------------------------------------------

const currentShape = () => SHAPES[state.shapeIndex];
const currentDesign = () => DESIGNS.find((d) => d.id === state.designId);
const currentColor = () => COLORS.find((c) => c.id === state.colorId);

// El color només té sentit si el disseny té una zona per pintar.
function needsColor(design = currentDesign()) {
  return !design || design.kind !== "wood";
}

function totalSteps() {
  return needsColor() ? 3 : 2;
}

function isComplete() {
  return !!currentDesign() && (!needsColor() || !!currentColor());
}

// Es pot saltar a un pas des de la barra si ja s'hi ha arribat abans i
// té sentit amb les tries actuals (p. ex. el color, només si cal).
function isReachable(n) {
  if (n === 1) return true;
  if (n === 2) return state.maxStep >= 2;
  if (n === 3) return state.maxStep >= 3 && !!currentDesign() && needsColor();
  if (n === 4) return state.maxStep >= 4 && isComplete();
  return false;
}

// --- Render ------------------------------------------------------------

function renderPreview() {
  els.preview.innerHTML = renderBoardSVG({
    shapeId: currentShape().id,
    designId: state.designId || "fusta-natural",
    colorId: state.colorId,
  });
}

function optionCard({ selected, attrs, swatchClass = "", swatchStyle = "", inner = "", name, meta = "" }) {
  return `<button type="button" class="option-card${selected ? " selected" : ""}" ${attrs} aria-pressed="${selected}">
    <span class="swatch ${swatchClass}"${swatchStyle ? ` style="${swatchStyle}"` : ""}>${inner}${OPTION_CHECK}</span>
    <span class="option-card-name">${name}</span>
    ${meta}
  </button>`;
}

function renderShapeStep() {
  const shape = currentShape();
  els.shapeName.textContent = shape.name;
  els.shapeTag.textContent = shape.tag;
  els.shapeTagline.textContent = shape.tagline;
  els.shapeDescription.textContent = shape.description;
  els.shapeActivities.innerHTML = shape.activities
    .map(
      (a) =>
        `<div class="activity-chip"><span class="activity-chip-icon" aria-hidden="true">${activityIcon(
          a
        )}</span><span class="activity-chip-label">${ACTIVITY_LABELS[a]}</span></div>`
    )
    .join("");
  els.shapeGrid.innerHTML = SHAPES.map((s, i) =>
    optionCard({
      selected: i === state.shapeIndex,
      attrs: `data-index="${i}"`,
      swatchClass: "swatch-shape",
      inner: renderBoardSVG({ shapeId: s.id, designId: "fusta-natural", showLogo: false }),
      name: s.name,
      meta: `<span class="option-card-price">${s.price}€</span>`,
    })
  ).join("");
}

// Cada disseny es mostra aplicat a la forma JA triada (no un quadrat
// abstracte): així es veu exactament què et quedarà. La zona de color va
// en gris fins que es tria al pas 3 — igual que a la vista gran.
function renderDesignStep() {
  const shape = currentShape();
  els.designGrid.innerHTML = DESIGNS.map((d) =>
    optionCard({
      selected: state.designId === d.id,
      attrs: `data-id="${d.id}"`,
      swatchClass: "swatch-shape",
      inner: renderBoardSVG({ shapeId: shape.id, designId: d.id, colorId: state.colorId, showLogo: false }),
      name: d.name,
      meta: needsColor(d) ? "" : `<span class="option-card-meta">Sense pintar</span>`,
    })
  ).join("");
  const design = currentDesign();
  els.designHint.hidden = !design || !needsColor(design) || !!currentColor();
}

function renderColorStep() {
  els.colorGrid.innerHTML = COLORS.map((c) =>
    optionCard({
      selected: state.colorId === c.id,
      attrs: `data-id="${c.id}"`,
      swatchClass: "swatch-color",
      swatchStyle: `background:${c.hex}`,
      name: c.name,
    })
  ).join("");
}

function renderSummary() {
  const shape = currentShape();
  const design = currentDesign();
  const color = currentColor();
  els.sumShape.textContent = shape.name;
  els.sumDesign.textContent = design.name;
  els.sumColor.textContent = needsColor() ? color.name : "Sense color";
  els.sumColorEdit.hidden = !needsColor();
  els.sumPrice.textContent = `${shape.price}€`;
}

// Barra de progrés + resum. El preu només depèn de la forma, així que és
// definitiu des del primer clic: res de "des de" (prometria variacions
// que no existeixen).
function renderBar() {
  const design = currentDesign();
  const color = currentColor();
  const values = {
    1: currentShape().name,
    2: design ? design.name : "Per triar",
    3: !needsColor() ? "No cal" : color ? color.name : "Per triar",
  };
  els.barShape.textContent = values[1];
  els.barDesign.textContent = values[2];
  els.barColor.textContent = values[3];
  els.barPrice.textContent = `${currentShape().price}€`;

  els.steps.forEach((btn) => {
    const n = Number(btn.dataset.step);
    const skipped = n === 3 && !needsColor();
    const done = (n === 1 && state.maxStep > 1) || (n === 2 && !!design) || (n === 3 && !!color && !skipped);
    const isCurrent = n === state.step;
    btn.classList.toggle("is-current", isCurrent);
    btn.classList.toggle("is-done", done && !isCurrent);
    btn.classList.toggle("is-pending", !done && !isCurrent);
    btn.classList.toggle("is-skipped", skipped);
    btn.disabled = isCurrent ? false : !isReachable(n);
    if (isCurrent) btn.setAttribute("aria-current", "step");
    else btn.removeAttribute("aria-current");
  });
}

function renderNav() {
  const s = state.step;
  els.btnBack.hidden = s === 1;
  els.nav.hidden = s === 4;
  const labels = {
    1: `Continua amb ${currentShape().name}`,
    2: currentDesign() && !needsColor() ? "Veure el resum" : "Següent: color",
    3: "Veure el resum",
  };
  if (labels[s]) els.btnNextLabel.textContent = labels[s];
}

function render() {
  const s = state.step;
  els.wizard.dataset.step = s;

  Object.entries(els.panels).forEach(([n, panel]) => {
    panel.hidden = Number(n) !== s;
  });

  els.title.textContent = STEP_COPY[s].title;

  if (s === 1) renderShapeStep();
  if (s === 2) renderDesignStep();
  if (s === 3) renderColorStep();
  if (s === 4) renderSummary();

  renderBar();
  renderNav();
  renderPreview();
}

// --- Navegació ---------------------------------------------------------

function clearError() {
  els.error.textContent = "";
}

function goToStep(n) {
  if (n === state.step) return;
  clearError();
  state.step = n;
  state.maxStep = Math.max(state.maxStep, n);
  render();
  // Torna a dalt i porta el focus a la pregunta nova: en mòbil, sense
  // això, el pas següent començava a mitja pantalla.
  window.scrollTo({ top: 0, behavior: "smooth" });
  els.title.focus({ preventScroll: true });
}

function next() {
  const s = state.step;
  if (s === 1) return goToStep(2);
  if (s === 2) {
    if (!currentDesign()) {
      els.error.textContent = "Tria un disseny per continuar.";
      return;
    }
    if (!needsColor()) {
      state.colorId = null;
      return goToStep(4);
    }
    return goToStep(3);
  }
  if (s === 3) {
    if (!currentColor()) {
      els.error.textContent = "Tria un color per continuar.";
      return;
    }
    return goToStep(4);
  }
}

function back() {
  const s = state.step;
  if (s === 4) return goToStep(needsColor() ? 3 : 2);
  if (s > 1) goToStep(s - 1);
}

els.steps.forEach((btn) =>
  btn.addEventListener("click", () => {
    const n = Number(btn.dataset.step);
    if (isReachable(n)) goToStep(n);
  })
);

els.btnNext.addEventListener("click", next);
els.btnBack.addEventListener("click", back);

document.querySelectorAll(".summary-edit").forEach((btn) =>
  btn.addEventListener("click", () => goToStep(Number(btn.dataset.goto)))
);

// --- Selecció d'opcions ------------------------------------------------

function onPick(grid, apply) {
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".option-card");
    if (!card) return;
    apply(card);
    clearError();
    render();
    // render() reescriu la graella: recuperem el focus a la mateixa
    // targeta perquè el teclat no "salti" a l'inici de la pàgina.
    // (e.detail === 0 => activat amb teclat, no amb ratolí)
    const attr = "index" in card.dataset ? "index" : "id";
    const again = grid.querySelector(`[data-${attr}="${card.dataset[attr]}"]`);
    if (again && e.detail === 0) again.focus();
  });
}

onPick(els.shapeGrid, (card) => {
  state.shapeIndex = Number(card.dataset.index);
});

onPick(els.designGrid, (card) => {
  state.designId = card.dataset.id;
});

onPick(els.colorGrid, (card) => {
  state.colorId = card.dataset.id;
});

els.btnAddCart.addEventListener("click", () => {
  els.btnAddCart.textContent = "Afegida a la cistella ✓";
  els.btnAddCart.disabled = true;
});

// --- Popup "Fem-la encara més teva" ------------------------------------

function openCustomModal() {
  els.customModalForm.reset();
  els.customModalBody.hidden = false;
  els.customModalSuccess.hidden = true;
  els.customModal.hidden = false;
  els.customModalBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  els.customModalEmail.focus();
}

function closeCustomModal() {
  els.customModal.hidden = true;
  els.customModalBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
  els.btnMoreCustom.focus();
}

els.btnMoreCustom.addEventListener("click", openCustomModal);
els.customModalClose.addEventListener("click", closeCustomModal);
els.customModalBackdrop.addEventListener("click", closeCustomModal);
els.customModalDone.addEventListener("click", closeCustomModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !els.customModal.hidden) closeCustomModal();
});

els.customModalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Sense backend real: simulem l'enviament i mostrem la confirmació.
  els.customModalBody.hidden = true;
  els.customModalSuccess.hidden = false;
  els.customModalDone.focus();
});

render();
