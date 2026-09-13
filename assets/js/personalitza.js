/**
 * Configurador "Personalitza la teva taula" — 3 passos (forma, disseny,
 * color) + resum final, seguint el flux ja dissenyat a Figma.
 */

const state = {
  step: 1,
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
    designId: state.designId || "natural",
    colorId: state.step >= 3 ? state.colorId : null,
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
    (_, i) => `<span class="dot${i === state.shapeIndex ? " active" : ""}"></span>`
  ).join("");
}

function renderDesignStep() {
  els.designGrid.innerHTML = DESIGNS.map((d) => {
    const bg = d.zigzag
      ? `repeating-linear-gradient(45deg, ${d.stops[0]} 0 10px, ${d.stops[1]} 10px 20px)`
      : `linear-gradient(135deg, ${d.stops[0]}, ${d.stops[1]})`;
    const selected = state.designId === d.id ? " selected" : "";
    return `<button class="swatch${selected}" data-id="${d.id}" title="${d.name}" style="background:${bg}"></button>`;
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
  // step indicator
  els.dots.forEach((dot) => {
    const n = Number(dot.dataset.step);
    dot.classList.toggle("active", n === state.step);
    dot.classList.toggle("done", n < state.step);
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

els.backBtn.addEventListener("click", () => {
  if (state.step === 1) {
    window.location.href = "index.html";
    return;
  }
  state.step -= 1;
  render();
});

document.getElementById("shape-prev").addEventListener("click", () => {
  state.shapeIndex = (state.shapeIndex - 1 + SHAPES.length) % SHAPES.length;
  render();
});
document.getElementById("shape-next").addEventListener("click", () => {
  state.shapeIndex = (state.shapeIndex + 1) % SHAPES.length;
  render();
});

els.btnStep1.addEventListener("click", () => {
  state.step = 2;
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
