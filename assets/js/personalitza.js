/**
 * Configurador "Personalitza la teva taula" — 3 passos (forma, disseny,
 * color) + resum final, seguint el flux ja dissenyat a Figma.
 */

const state = {
  step: 1,
  maxStep: 1,
  shapeIndex: 0,
  designId: null,
  colorId: null,
};

const els = {
  preview: document.getElementById("board-preview"),
  title: document.getElementById("wizard-title"),
  dots: document.querySelectorAll(".step-dot"),
  connectors: document.querySelectorAll(".step-connector"),
  panels: {
    1: document.getElementById("panel-shape"),
    2: document.getElementById("panel-design"),
    3: document.getElementById("panel-color"),
    4: document.getElementById("panel-summary"),
  },
  shapeName: document.getElementById("shape-name"),
  shapeTag: document.getElementById("shape-tag"),
  shapeTagline: document.getElementById("shape-tagline"),
  shapeDescription: document.getElementById("shape-description"),
  shapeActivities: document.getElementById("shape-activities"),
  shapeGrid: document.getElementById("shape-grid"),
  designGrid: document.getElementById("design-grid"),
  colorGrid: document.getElementById("color-grid"),
  btnStep1: document.getElementById("btn-step1"),
  btnStep1Label: document.getElementById("btn-step1-label"),
  btnStep2: document.getElementById("btn-step2"),
  btnStep3: document.getElementById("btn-step3"),
  sumShape: document.getElementById("sum-shape"),
  sumDesign: document.getElementById("sum-design"),
  sumColor: document.getElementById("sum-color"),
  sumPrice: document.getElementById("sum-price"),
  btnAddCart: document.getElementById("btn-add-cart"),
  btnMoreCustom: document.getElementById("btn-more-custom"),
  customModalBackdrop: document.getElementById("custom-modal-backdrop"),
  customModal: document.getElementById("custom-modal"),
  customModalClose: document.getElementById("custom-modal-close"),
  customModalBody: document.getElementById("custom-modal-body"),
  customModalForm: document.getElementById("custom-modal-form"),
  customModalEmail: document.getElementById("custom-modal-email"),
  customModalMessage: document.getElementById("custom-modal-message"),
  customModalSuccess: document.getElementById("custom-modal-success"),
};

function currentShape() {
  return SHAPES[state.shapeIndex];
}

function renderPreview() {
  els.preview.innerHTML = renderBoardSVG({
    shapeId: currentShape().id,
    designId: state.designId || "fusta-natural",
    colorId: state.colorId,
  });
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
        `<div class="activity-chip"><span class="activity-chip-icon">${activityIcon(
          a
        )}</span><span class="activity-chip-label">${ACTIVITY_LABELS[a]}</span></div>`
    )
    .join("");
  els.btnStep1Label.textContent = `Escollir ${shape.name}`;
  // Targetes de cada forma (nom a sota + marca de selecció): es poden
  // triar directament clicant-hi, sense passar per fletxes.
  els.shapeGrid.innerHTML = SHAPES.map((s, i) => {
    const selected = i === state.shapeIndex ? " selected" : "";
    return `<button type="button" class="shape-card${selected}" data-index="${i}" title="${s.name}">
      <span class="swatch swatch-shape">
        ${renderBoardSVG({ shapeId: s.id, designId: "fusta-natural", colorId: null, showLogo: false })}
        <span class="shape-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
        </span>
      </span>
      <span class="shape-card-name">${s.name}</span>
    </button>`;
  }).join("");
}

// Genera el fons pla (CSS) de cada swatch del selector de disseny, seguint
// la mateixa zona "de color" (aquí en taronja, a mode d'exemple) que farà
// servir renderBoardSVG un cop es triï un color de debò al pas 3.
function designSwatchBackground(d) {
  const [, wood] = d.wood;
  const accent = "#f9b54f";
  const dark = "#313030";
  switch (d.kind) {
    case "solid":
      return dark;
    case "franja-dreta":
      return `linear-gradient(90deg, ${dark} 0 55%, ${accent} 55% 62%, ${wood} 62% 100%)`;
    case "franges-centre":
      return `linear-gradient(90deg, ${wood} 0 38%, ${dark} 38% 42%, ${accent} 42% 46%, ${dark} 46% 100%)`;
    case "diagonal":
      return `linear-gradient(135deg, ${dark} 0 46%, ${accent} 46% 54%, ${wood} 54% 100%)`;
    case "meitat":
      return `linear-gradient(90deg, ${wood} 0 50%, ${accent} 50% 100%)`;
    case "wood":
    default:
      return `linear-gradient(135deg, ${d.wood[0]}, ${d.wood[1]})`;
  }
}

function renderDesignStep() {
  els.designGrid.innerHTML = DESIGNS.map((d) => {
    const selected = state.designId === d.id ? " selected" : "";
    return `<button class="swatch${selected}" data-id="${d.id}" title="${d.name}" style="background:${designSwatchBackground(
      d
    )}"></button>`;
  }).join("");
}

function renderColorStep() {
  els.colorGrid.innerHTML = COLORS.map((c) => {
    const selected = state.colorId === c.id ? " selected" : "";
    return `<button class="swatch swatch-color${selected}" data-id="${c.id}" title="${c.name}" style="background:${c.hex}"></button>`;
  }).join("");
}

function renderSummary() {
  const shape = currentShape();
  const design = DESIGNS.find((d) => d.id === state.designId);
  const color = COLORS.find((c) => c.id === state.colorId);
  els.sumShape.textContent = shape.name;
  els.sumDesign.textContent = design.name;
  els.sumColor.textContent = color.name;
  els.sumPrice.textContent = `${shape.price}€`;
}

function render() {
  // Marca el pas actual al <main>: el pas 1 (forma) ja mostra la imatge
  // de la taula a cada targeta i a la fitxa de detall, així que la vista
  // prèvia gran de dalt hi és redundant i es pot encongir en mòbil
  // (vegeu CSS [data-step="1"] .board-preview) per no tapar el CTA.
  document.querySelector(".wizard").dataset.step = state.step;

  // step indicator — els punts ja visitats (<= maxStep) es poden clicar
  // per tornar-hi o saltar-hi de nou, sense perdre les tries fetes.
  els.dots.forEach((dot) => {
    const n = Number(dot.dataset.step);
    dot.classList.toggle("active", n === state.step);
    dot.classList.toggle("done", n < state.step);
    dot.classList.toggle("reachable", n <= state.maxStep);
  });

  // Línia entre els punts: tota taronja si el pas ja s'ha completat,
  // mig taronja mentre s'hi és (indica progrés cap al següent) i grisa
  // si encara no s'hi ha arribat.
  els.connectors.forEach((line) => {
    const n = Number(line.dataset.connector);
    line.classList.toggle("done", n < state.step);
    line.classList.toggle("active", n === state.step);
  });

  // panels
  Object.entries(els.panels).forEach(([step, panel]) => {
    panel.hidden = Number(step) !== state.step;
  });

  if (state.step === 1) renderShapeStep();
  if (state.step === 2) renderDesignStep();
  if (state.step === 3) renderColorStep();
  if (state.step === 4) renderSummary();

  els.btnStep2.disabled = !state.designId;
  els.btnStep3.disabled = !state.colorId;

  renderPreview();
}

// --- Navegació entre passos -------------------------------------------

function unlockStep(n) {
  state.maxStep = Math.max(state.maxStep, n);
}

// Els punts 1/2/3 permeten tornar a qualsevol pas ja visitat (mai saltar
// endavant a un que encara no s'ha desbloquejat completant l'anterior).
function goToStep(n) {
  if (n === state.step || n > state.maxStep) return;
  state.step = n;
  render();
}

els.dots.forEach((dot) => {
  dot.addEventListener("click", () => goToStep(Number(dot.dataset.step)));
  dot.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToStep(Number(dot.dataset.step));
    }
  });
});

// Graella de targetes de formes: se selecciona directament clicant-hi
// (la navegació cap enrere es fa amb els punts de pas, ja clicables).
els.shapeGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".shape-card");
  if (!btn) return;
  state.shapeIndex = Number(btn.dataset.index);
  render();
});

els.btnStep1.addEventListener("click", () => {
  state.step = 2;
  unlockStep(2);
  render();
});

els.designGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".swatch");
  if (!btn) return;
  state.designId = btn.dataset.id;
  render();
});

els.btnStep2.addEventListener("click", () => {
  if (!state.designId) return;
  state.step = 3;
  unlockStep(3);
  render();
});

els.colorGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".swatch");
  if (!btn) return;
  state.colorId = btn.dataset.id;
  render();
});

els.btnStep3.addEventListener("click", () => {
  if (!state.colorId) return;
  state.step = 4;
  unlockStep(4);
  render();
});

els.btnAddCart.addEventListener("click", () => {
  els.btnAddCart.textContent = "Afegit a la cistella ✓";
  els.btnAddCart.disabled = true;
});

// --- Popup "Personalitza la taula encara més" --------------------------

function openCustomModal() {
  // Cada vegada que s'obre, comença de nou pel formulari (per si la
  // vegada anterior es va arribar a enviar la petició).
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
}

els.btnMoreCustom.addEventListener("click", openCustomModal);
els.customModalClose.addEventListener("click", closeCustomModal);
els.customModalBackdrop.addEventListener("click", closeCustomModal);
els.customModalDone = document.getElementById("custom-modal-done");
els.customModalDone.addEventListener("click", closeCustomModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !els.customModal.hidden) closeCustomModal();
});

els.customModalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Sense backend real: simulem l'enviament de la petició (nom, email
  // i missatge) i mostrem la confirmació, seguint el mateix patró que
  // "Afegit a la cistella".
  els.customModalBody.hidden = true;
  els.customModalSuccess.hidden = false;
});

render();
