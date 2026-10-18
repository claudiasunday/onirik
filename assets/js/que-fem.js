/**
 * Hub "Què fem": les pestanyes del subnav (Equilibri / Fabricació /
 * Balanceboard) no naveguen a una altra pàgina — només substitueixen
 * el contingut de sota (el .prose, amb el seu propi h2). El h1 de dalt
 * es queda fix, igual que el subnav.
 */

const QUE_FEM_TOPICS = {
  equilibri: {
    title: "Tallers d'equilibri",
    image: "assets/images/equilibri-taller.webp",
    body: `
      <p>
        A ONIRIK BOARDS oferim també tallers d'equilibri, amb les nostres
        taules o bé amb la que ja tinguis a casa.
      </p>
      <p>
        El nostre focus principal són els tallers grupals a escoles,
        formant part així del desenvolupament físic de l'alumnat més
        jove. Ens hem anat obrint també a joves i adults amb classes
        privades durant l'estiu, gràcies a la col·laboració amb FASE WIND,
        on treballem tècnica de skimboard en una piscina.
      </p>
      <p>
        Oferim assessorament personalitzat i responem qualsevol pregunta
        que tinguis sobre el balanceboard: escriu-nos per aclarir dubtes o
        demanar un pressupost a mida.
      </p>
      <p><strong>Esperem veure't aviat en un dels nostres tallers!</strong></p>
    `,
    cards: `
      <div class="card-row">
        <a class="info-card" href="contacte.html">
          <h3>Demana pressupost</h3>
          <p>Explica'ns el teu grup, edats i disponibilitat.</p>
        </a>
      </div>
    `,
  },
  fabricacio: {
    title: "Tallers de fabricació artesanal",
    image: "assets/images/fabricacio-taller.webp",
    body: `
      <p>
        Oferim tallers engrescadors de balanceboard artesanal i
        personalitzat, on tu mateix/a construeixes la teva taula de
        principi a fi.
      </p>
      <p>
        El que ens distingeix és el nostre compromís amb la
        sostenibilitat: treballem, sempre que podem, amb materials
        reciclats o reutilitzats.
      </p>
      <p>
        Són tallers pensats com una oportunitat per explorar la
        creativitat, aprendre noves habilitats i contribuir a un estil de
        vida més sostenible.
      </p>
      <p>
        <strong>T'animes a crear la teva pròpia taula d'equilibri
        personalitzada?</strong> Contacta'ns per a més detalls sobre el
        programa de tallers.
      </p>
    `,
    cards: `
      <div class="card-row">
        <a class="info-card" href="contacte.html">
          <h3>Vull apuntar-m'hi</h3>
          <p>Escriu-nos i et diem les properes dates disponibles.</p>
        </a>
      </div>
    `,
  },
  yoga: {
    title: "Balanceboard com a estil de vida",
    body: `
      <p>
        Entrenar al gimnàs o a casa és important, però l'equilibri no es
        reforça només amb la força. Vam identificar aquest buit en les
        eines d'entrenament i vam desenvolupar el balanceboard com a
        solució.
      </p>
      <p>
        Amb una balanceboard pots entrenar en qualsevol moment i lloc,
        independentment del temps o l'època de l'any.
      </p>
      <p>
        No serveix només per a esportistes d'alt rendiment, sinó també per
        a qui busca un entrenament eficaç de tots els grups musculars,
        incloent el core i la resta de musculatura central.
      </p>
      <p>
        Per a nosaltres el balanceboard és un enfocament d'estil de vida
        per desenvolupar l'equilibri — una habilitat fonamental en molts
        esports — més enllà de l'entrenament de força tradicional.
      </p>
    `,
    cards: `
      <div class="card-row">
        <a class="info-card" href="personalitza.html">
          <h3>Personalitza la teva</h3>
          <p>Tria forma, disseny i color en 3 passos.</p>
        </a>
        <a class="info-card" href="tenda.html">
          <h3>Visita la tenda</h3>
          <p>Edicions limitades ja acabades.</p>
        </a>
      </div>
    `,
  },
  // Pestanya "Tricks & lifestyle" (l'URL es manté: que-fem-balanceboard.html):
  // secció més de nínxol, per a la comunitat skater.
  balanceboard: {
    title: "Tricks & lifestyle",
    image: "assets/images/tricks-lifestyle.webp",
    body: `
      <p>
        El balanceboard també és cultura de taula. En aquesta secció parlem
        de trucs, de sessions i de la gent que hi ha darrere de cada taula.
      </p>
      <p>
        Venim del surf, de l'skate i del snow: busquem aquella sensació de
        flow quan la taula respon i el cos va sol. Shuvits, 180s,
        cross-steps, manuals sobre el roller… cada truc comença amb mil
        intents.
      </p>
      <p>
        Ens agrada compartir-ho: vídeos, reptes i sessions per aprendre
        junts, des dels primers equilibris fins als trucs més tècnics.
      </p>
      <p>
        Si patines, si surfeges o simplement t'agrada l'estil de vida de
        taula, aquesta és la teva comunitat.
      </p>
    `,
    cards: `
      <div class="card-row">
        <a class="info-card" href="https://www.instagram.com/onirikboards" target="_blank" rel="noopener">
          <h3>Comparteix el teu truc</h3>
          <p>Etiqueta'ns a Instagram: @onirikboards.</p>
        </a>
        <a class="info-card" href="familia-onirik.html">
          <h3>Família ONIRIK</h3>
          <p>Riders i projectes que ens acompanyen.</p>
        </a>
        <a class="info-card" href="personalitza.html">
          <h3>Personalitza la teva</h3>
          <p>Tria forma, disseny i color en 3 passos.</p>
        </a>
      </div>
    `,
  },

};

function topicFromHref(href) {
  const match = href && href.match(/que-fem-(equilibri|fabricacio|yoga|balanceboard)\.html/);
  return match ? match[1] : null;
}

function initQueFemSubnav() {
  const prose = document.getElementById("que-fem-prose");
  const media = document.getElementById("que-fem-media");
  const subnav = document.querySelector(".subnav");
  if (!prose || !subnav) return;
  const links = [...subnav.querySelectorAll("a")];

  function applyTopic(topic) {
    const data = QUE_FEM_TOPICS[topic];
    if (!data) return;
    prose.innerHTML = `<h2>${data.title}</h2>${data.body}${data.cards}`;
    if (media) {
      media.setAttribute("aria-label", data.title);
      // Foto del taller si en tenim; si no, es queda el requadre gris.
      if (!media.dataset.placeholder) media.dataset.placeholder = media.innerHTML;
      media.classList.toggle("has-photo", Boolean(data.image));
      media.innerHTML = data.image
        ? `<img src="${data.image}" alt="${data.title}" loading="lazy" />`
        : media.dataset.placeholder;
    }
    links.forEach((a) =>
      a.classList.toggle("active", topicFromHref(a.getAttribute("href")) === topic)
    );
  }

  const initial = links.find((a) => a.classList.contains("active"));
  if (initial) applyTopic(topicFromHref(initial.getAttribute("href")));

  links.forEach((a) => {
    const topic = topicFromHref(a.getAttribute("href"));
    if (!topic) return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (!a.classList.contains("active")) applyTopic(topic);
    });
  });
}

initQueFemSubnav();
