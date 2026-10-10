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
  { id: "familia", href: "familia-onirik.html", label: "Família ONIRIK" },
  { id: "contacte", href: "contacte.html", label: "Contacta'm" },
];

function renderHeader() {
  const current = document.body.dataset.page || "";
  const mount = document.getElementById("site-header");
  if (!mount) return;
  mount.innerHTML = `
    <header class="site-header">
      <a href="index.html" class="logo onirik-logo${current === "home" ? " onirik-logo--animated" : ""}">
        <div class="onirik-logo__icon-wrap">
          <img class="onirik-logo__favicon" src="assets/images/logo-icon.png" alt="" />
          <img class="onirik-logo__favicon-overlay" src="assets/images/logo-icon-mono-white.png" alt="" aria-hidden="true" />
        </div>
        <span class="onirik-logo__wordmark-box">
          <img class="onirik-logo__wordmark" src="assets/images/logo-wordmark.png" alt="ONIRIK BOARDS" />
          <img class="onirik-logo__wordmark-overlay" src="assets/images/logo-wordmark.png" alt="" aria-hidden="true" />
        </span>
      </a>
      <nav class="main-nav">
        ${NAV_ITEMS.map(
          (item) =>
            `<a href="${item.href}"${item.id === current ? ' class="active"' : ""}>${item.label}</a>`
        ).join("")}
      </nav>
      <div class="header-actions">
        <a class="btn btn-primary btn-compra" href="personalitza.html">Crea la teva taula</a>
        <button class="icon-btn menu-btn" id="menu-toggle" aria-label="Menú">☰</button>
      </div>
    </header>
    <nav class="mobile-nav" id="mobile-nav" hidden>
      ${NAV_ITEMS.map(
        (item) =>
          `<a href="${item.href}"${item.id === current ? ' class="active"' : ""}>${item.label}</a>`
      ).join("")}
      <a class="btn btn-primary btn-compra mobile-nav-cta" href="personalitza.html">Crea la teva taula</a>
    </nav>
  `;
  const toggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  let backdrop = document.getElementById("mobile-nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "mobile-nav-backdrop";
    backdrop.className = "mobile-nav-backdrop";
    backdrop.hidden = true;
    document.body.appendChild(backdrop);
  }

  const setMenuOpen = (open) => {
    mobileNav.hidden = !open;
    backdrop.hidden = !open;
    toggle.textContent = open ? "✕" : "☰";
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("mobile-nav-open", open);
  };

  toggle.setAttribute("aria-expanded", "false");
  toggle.addEventListener("click", () => setMenuOpen(mobileNav.hidden));
  backdrop.addEventListener("click", () => setMenuOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileNav.hidden) setMenuOpen(false);
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
    current === "contacte" || current === "personalitza"
      ? ""
      : `
    <section class="container">
      <div class="contact-teaser">
        <div>
          <h2>Vols alguna cosa personalitzada?</h2>
          <p>Escriu-nos i t'ajudem a trobar la teva balance board ideal.</p>
        </div>
        <a class="btn btn-primary" href="contacte.html">Contacta'm</a>
      </div>
    </section>
  `;
  mount.innerHTML = `
    ${teaser}
    <footer class="site-footer">
      <div class="footer-top container">
        <div class="footer-col">
          <h3 class="footer-col-title">Descobreix</h3>
          <div class="footer-links">
            ${NAV_ITEMS.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
          </div>
        </div>
        <div class="footer-col">
          <h3 class="footer-col-title">Contacta'ns</h3>
          <div class="footer-contact">
            <a href="mailto:info@onirikboards.com">✉️ info@onirikboards.com</a>
            <a href="https://wa.me/34625579914">💬 +34 625 57 99 14</a>
            <a href="https://www.instagram.com/onirikboards" target="_blank" rel="noopener">📷 @onirikboards</a>
          </div>
        </div>
        <div class="footer-col footer-col--social">
          <h3 class="footer-col-title">Segueix-nos</h3>
          <a class="footer-social-icon" href="https://www.instagram.com/onirikboards" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
      <div class="footer-hero">
        <div class="footer-wordmark-row container">
          <img src="assets/images/logo-boards-orange.png" alt="ONIRIK Boards" class="footer-hero-logo" />
        </div>
        <img src="assets/images/footer-board-roller.png" alt="Balance board ONIRIK amb roller de suro" class="footer-hero-photo" />
      </div>
      <div class="footer-bottom container">
        <p class="footer-claim">🤟🏾 Balance as an attitude</p>
        <p class="footer-tagline">Balance boards fetes a mà, una a una.</p>
        <p class="copyright">© <span id="year"></span> ONIRIK BOARDS — tots els drets reservats.</p>
      </div>
    </footer>
  `;
  document.getElementById("year").textContent = new Date().getFullYear();
}

renderHeader();
renderFooter();
initHeaderScroll();
