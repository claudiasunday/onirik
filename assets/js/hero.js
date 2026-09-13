/**
 * Hero de la Home — selector d'audiència (Boards / Tallers / Col·labora).
 * En triar una pestanya canvien el titular, el text,
 * el CTA, la insígnia i la taula il·lustrada, sense canviar l'estructura.
 * Depèn de board.js (renderBoardSVG), que ha d'anar carregat abans.
 */

const HERO_DATA = {
  particulars: {
    eyebrow: "Personalitza la teva taula",
    headline: "Troba el teu equilibri, a la teva mida",
    subtext:
      "Balance boards fetes a mà, taller a taller. Tria la forma, el disseny i el color en tres passos i emporta't una taula única.",
    cta: "Personalitza la teva taula",
    ctaHref: "personalitza.html",
    secondary: "Veure totes les taules",
    secondaryHref: "tenda.html",
    icon: "bag",
    blob: "var(--c-orange)",
    board: { shapeId: "trik", designId: "ratlla-taronja", colorId: null },
  },
  tallers: {
    eyebrow: "Aprèn a mantenir l'equilibri",
    headline: "Viu l'experiència Onirik en un taller",
    subtext:
      "Tallers d'equilibri i de fabricació pensats per a totes les edats, amb les nostres taules o amb la que ja tinguis a casa.",
    cta: "Descobreix els tallers",
    ctaHref: "que-fem.html",
    secondary: "Parla'ns del teu grup",
    secondaryHref: "contacte.html",
    icon: "group",
    blob: "var(--c-wood)",
    board: { shapeId: "lasai", designId: "natural", colorId: null },
  },
  espais: {
    eyebrow: "Porta Onirik al teu espai",
    headline: "Col·labora amb Onirik",
    subtext:
      "Estudis de ioga, gimnasos, hotels i espais de benestar: incorpora tallers o taules Onirik personalitzades per als vostres clients o equip.",
    cta: "Parla'ns del teu espai",
    ctaHref: "contacte.html",
    secondary: "Veure col·laboracions",
    secondaryHref: "familia-onirik.html",
    icon: "building",
    blob: "var(--c-muted)",
    board: { shapeId: "keki", designId: "bloc-negre", colorId: "blanc" },
  },
};

function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const tabs = hero.querySelectorAll(".hero-tabs button");
  const swap = document.getElementById("hero-swap");
  const blob = hero.querySelector(".hero-blob");
  const illustration = document.getElementById("hero-illustration");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function applyData(d) {
    document.getElementById("hero-eyebrow").textContent = d.eyebrow;
    document.getElementById("hero-headline").textContent = d.headline;
    document.getElementById("hero-subtext").textContent = d.subtext;

    const cta = document.getElementById("hero-cta");
    document.getElementById("hero-cta-label").textContent = d.cta;
    cta.setAttribute("href", d.ctaHref);

    const secondary = document.getElementById("hero-secondary");
    secondary.textContent = d.secondary;
    secondary.setAttribute("href", d.secondaryHref);

    hero.querySelectorAll(".hero-badge-icon").forEach((icon) => {
      icon.classList.toggle(
        "is-active",
        icon.getAttribute("data-icon") === d.icon
      );
    });

    blob.style.background = d.blob;
    illustration.innerHTML = renderBoardSVG(d.board);
  }

  function selectAudience(key) {
    const d = HERO_DATA[key];
    if (!d) return;
    hero.setAttribute("data-audience", key);
    tabs.forEach((btn) => {
      btn.setAttribute(
        "aria-selected",
        btn.getAttribute("data-key") === key ? "true" : "false"
      );
    });

    if (reduceMotion) {
      applyData(d);
      return;
    }
    swap.classList.add("is-changing");
    window.setTimeout(() => {
      applyData(d);
      swap.classList.remove("is-changing");
    }, 140);
  }

  tabs.forEach((btn) => {
    btn.addEventListener("click", () =>
      selectAudience(btn.getAttribute("data-key"))
    );
  });

  // La còpia de "particulars" ja és al HTML; només cal pintar la taula.
  illustration.innerHTML = renderBoardSVG(HERO_DATA.particulars.board);
}

initHero();
