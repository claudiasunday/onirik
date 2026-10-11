/**
 * Hub "Què fem": les pestanyes del subnav (Equilibri / Fabricació /
 * Balanceboard) no naveguen a una altra pàgina — només substitueixen
 * el contingut de sota (el .prose, amb el seu propi h2). El h1 de dalt
 * es queda fix, igual que el subnav.
 */

const QUE_FEM_TOPICS = {
  equilibri: {
    title: "Tallers d'equilibri",
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
  balanceboard: {
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
};

function topicFromHref(href) {
  const match = href && href.match(/que-fem-(equilibri|fabricacio|balanceboard)\.html/);
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
    if (media) media.setAttribute("aria-label", data.title);
    links.forEach((a) =>
      a.classList.toggle("active", topicFromHref(a.getAttribute("href")) === topic)
    );
  }

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
