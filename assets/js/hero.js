/**
 * Hero de la Home — selector d'audiència (Boards / Tallers / Col·labora).
 * En triar una opció canvien el titular, el text i el CTA, sense canviar
 * l'estructura. El selector viu a la capçalera en escriptori (layout.js)
 * i dins del hero en mòbil: hero.js els escolta tots dos i els manté
 * sincronitzats (qualsevol `.hero-tabs button[data-key]` de la pàgina).
 */

const HERO_DATA = {
  particulars: {
    eyebrow: "Personalitza la teva taula",
    headline: "Troba el teu equilibri, en 3 passos",
    subtext:
      "Balance boards fetes a mà, una a una. Tria la forma, el disseny i el color en tres passos i emporta't una taula única.",
    cta: "Crea la teva taula",
    ctaHref: "personalitza.html",
  },
  tallers: {
    eyebrow: "Tu també ho pots fer.",
    headline: "Tallers d'equilibri i de fabricació",
    subtext:
      "Pensats per a totes les edats i tots els nivells, en format grupal o privat: aprèn a mantenir l'equilibri o construeix la teva pròpia taula, amb les nostres taules o amb la que ja tinguis a casa.",
    cta: "Descobreix els tallers",
    ctaHref: "que-fem.html",
  },
  espais: {
    eyebrow: "Porta ONIRIK al teu espai",
    headline: "Balance al teu espai",
    subtext:
      "Estudis de ioga, gimnasos, hotels i espais de benestar: incorpora tallers o taules ONIRIK personalitzades per als vostres clients o equip.",
    cta: "Parla'ns del teu espai",
    ctaHref: "contacte.html",
  },
};

function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const tabs = document.querySelectorAll(".hero-tabs button[data-key]");
  const swap = document.getElementById("hero-swap");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function applyData(d) {
    document.getElementById("hero-eyebrow").textContent = d.eyebrow;
    document.getElementById("hero-headline").textContent = d.headline;
    document.getElementById("hero-subtext").textContent = d.subtext;

    const cta = document.getElementById("hero-cta");
    cta.textContent = d.cta;
    cta.setAttribute("href", d.ctaHref);
  }

  function selectAudience(key) {
    const d = HERO_DATA[key];
    if (!d) return;
    hero.setAttribute("data-audience", key);
    tabs.forEach((btn) => {
      btn.setAttribute(
        "aria-pressed",
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
}

initHero();
