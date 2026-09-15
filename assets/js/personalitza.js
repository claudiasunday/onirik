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
  panels: {
    1: document.getElementById("panel-shape"),
    2: document.getElementById("panel-design"),
    3: document.getElementById("panel-color"),
    4: document.getElementById("panel-summary"),
  },
  shapeName: document.getElementById("shape-name"),
  shapeTag: document.getElementById("shape-tag"),
  shapeActivities: document.getElementById("shape-activities"),
  shapeDots: document.getElementById("shape-dots"),
  shapeCarousel: document.getElementById("shape-carousel"),
  designGrid: document.getElementById("design-grid"),
  colorGrid: document.getElementById("color-grid"),
  btnStep1: document.getElementById("btn-step1"),
  btnStep2: document.getElementById("btn-step2"),
  btnStep3: document.getElementById("btn-step3"),
  backBtn: document.getElementById("back-btn"),
  sumShape: document.getElementById("sum-shape"),
  sumDesign: document.getElementById("sum-design"),
  sumColor: document.getElementById("sum-color"),
  sumPrice: document.getElementById("sum-price"),
  btnAddCart: document.getElementById("btn-add-cart"),
  btnSave: document.getElementById("btn-save"),
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
  els.shapeActivities.innerHTML = shape.activities
    .map((a) => `<span>${activityIcon(a)} ${ACTIVITY_LABELS[a]}</span>`)
    .join("");
  els.shapeDots.innerHTML = SHAPES.map(
    (s, i) =>
      `<button type="button" class="dot${i === state.shapeIndex ? " active" : ""}" data-index="${i}" aria-label="${s.name}"></button>`
  ).join("");
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
  // step indicator — els punts ja visitats (<= maxStep) es poden clicar
  // per tornar-hi o saltar-hi de nou, sense perdre les tries fetes.
  els.dots.forEach((dot) => {
    const n = Number(dot.dataset.step);
    dot.classList.toggle("active", n === state.step);
    dot.classList.toggle("done", n < state.step);
    dot.classList.toggle("reachable", n <= state.maxStep);
  });

  // panels
  Object.entries(els.panels).forEach(([step, panel]) => {
    panel.hidden = Number(step) !== state.step;
  });

  // shape carousel only visible on step 1
  els.shapeCarousel.style.visibility = state.step === 1 ? "visible" : "hidden";

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

els.backBtn.addEventListener("click", () => {
  if (state.step === 1) {
    window.location.href = "index.html";
    return;
  }
  state.step -= 1;
  render();
});

// Fletxes del carrusel: avancen/retrocedeixen entre les formes.
document.getElementById("shape-prev").addEventListener("click", () => {
  state.shapeIndex = (state.shapeIndex - 1 + SHAPES.length) % SHAPES.length;
  render();
});
document.getElementById("shape-next").addEventListener("click", () => {
  state.shapeIndex = (state.shapeIndex + 1) % SHAPES.length;
  render();
});
// Punts del carrusel: seleccionen directament la forma corresponent.
els.shapeDots.addEventListener("click", (e) => {
  const btn = e.target.closest(".dot");
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

els.btnSave.addEventListener("click", () => {
  els.btnSave.textContent = "Preselecció guardada ✓";
});

render();
