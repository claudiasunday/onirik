/**
 * Capçalera i peu compartits per a totes les pàgines del lloc.
 * S'injecten via JS (en lloc de duplicar HTML a cada pàgina) i marquen
 * l'enllaç actiu segons `data-page` al <body>.
 *
 * Estructura de navegació calcada del lloc real onirikboards.com
 * (CONÓCENOS / QUÉ HACEMOS / TIENDA / FAMILIA ONIRIK / CONTACTO),
 * traduïda al català i amb el disseny propi (no el seu UI).
 */

const NAV_ITEMS = [
  { id: "coneix-nos", href: "coneix-nos.html", label: "Coneix-nos" },
  { id: "que-fem", href: "que-fem.html", label: "Què fem" },
  { id: "tenda", href: "tenda.html", label: "Tenda" },
  { id: "familia", href: "familia-onirik.html", label: "Família Onirik" },
  { id: "contacte", href: "contacte.html", label: "Contacta'm" },
];

function renderHeader() {
  const current = document.body.dataset.page || "";
  const mount = document.getElementById("site-header");
  if (!mount) return;
  mount.innerHTML = `
    <header class="site-header">
      <a href="index.html" class="logo">
        <img src="assets/images/logo.png" alt="Onirik Boards" />
      </a>
      <nav class="main-nav">
        ${NAV_ITEMS.map(
          (item) =>
            `<a href="${item.href}"${item.id === current ? ' class="active"' : ""}>${item.label}</a>`
        ).join("")}
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary btn-compra" href="tenda.html">🛒 Compra</a>
        <button class="icon-btn menu-btn" id="menu-toggle" aria-label="Menú">☰</button>
      </div>
    </header>
    <nav class="mobile-nav" id="mobile-nav" hidden>
      ${NAV_ITEMS.map(
        (item) =>
          `<a href="${item.href}"${item.id === current ? ' class="active"' : ""}>${item.label}</a>`
      ).join("")}
    </nav>
  `;
  const toggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  toggle.addEventListener("click", () => {
    mobileNav.hidden = !mobileNav.hidden;
  });
}

/**
 * Navbar fixa: comença transparent i passa a fons blanc en fer scroll
 * (mateix comportament que claudiasunday.com).
 */
function initHeaderScroll() {
  const mount = document.getElementById("site-header");
  if (!mount) return;
  const SCROLL_THRESHOLD = 8;
  const onScroll = () => {
    mount.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;
  const current = document.body.dataset.page || "";
  const teaser =
    current === "contacte"
      ? ""
      : `
    <section class="container">
      <div class="contact-teaser">
        <div>
          <h2>Vols alguna cosa personalitzada?</h2>
          <p>Escriu-nos i t'ajudem a trobar la teva balance board ideal.</p>
        </div>
        <a class="btn btn-dark" href="contacte.html">Contacta'm</a>
      </div>
    </section>
  `;
  mount.innerHTML = `
    ${teaser}
    <footer class="site-footer">
      <div class="footer-grid container">
        <div class="footer-brand">
          <img src="assets/images/logo.png" alt="Onirik Boards" class="footer-logo" />
          <p class="footer-claim">🤟🏾 Balance as an attitude</p>
          <p>Balance boards fetes a mà, taller a taller.</p>
        </div>
        <div class="footer-links">
          ${NAV_ITEMS.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
        </div>
        <div class="footer-contact">
          <a href="mailto:info@onirikboards.com">✉️ info@onirikboards.com</a>
          <a href="https://wa.me/34625579914">💬 +34 625 57 99 14</a>
          <a href="https://www.instagram.com/onirikboards" target="_blank" rel="noopener">📷 @onirikboards</a>
        </div>
      </div>
      <p class="copyright">© <span id="year"></span> Onirik Boards — tots els drets reservats.</p>
    </footer>
  `;
  document.getElementById("year").textContent = new Date().getFullYear();
}

renderHeader();
renderFooter();
initHeaderScroll();
