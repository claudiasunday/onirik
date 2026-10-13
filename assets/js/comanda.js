/**
 * Comanda — pas final del carrito: resum de la cistella en mode només
 * lectura (referència + preu + miniatura, no editables) i un formulari
 * amb les dades de contacte. Com que no hi ha backend real darrere del
 * lloc, en enviar el formulari la comanda s'obre per WhatsApp amb tota
 * la informació ja escrita.
 */

const orderEmptyEl = document.getElementById("order-empty");
const orderLayoutEl = document.getElementById("order-layout");
const orderListEl = document.getElementById("order-list");
const orderTotalEl = document.getElementById("order-total");
const orderForm = document.getElementById("order-form");

function renderOrderLine(line) {
  const { qty, entry } = line;
  const display = catalogEntryDisplay(entry);
  const price = getEntryPrice(entry);
  const ref = shortProductRef(entry);

  const row = document.createElement("div");
  row.className = "cart-line order-line";
  row.innerHTML = `
    <div class="cart-line-thumb">${display.thumbHtml}</div>
    <div class="cart-line-info">
      <h3>${display.title}</h3>
      <p class="cart-line-price"><span class="order-ref">${ref}</span>${price}€ × ${qty}</p>
    </div>
    <p class="cart-line-subtotal">${price * qty}€</p>
  `;
  return row;
}

function buildFinalOrderMessage(lines, total, contact) {
  const items = lines
    .map((line) => {
      const display = catalogEntryDisplay(line.entry);
      const ref = shortProductRef(line.entry);
      const price = getEntryPrice(line.entry);
      return `- [${ref}] ${display.title} x${line.qty} — ${price * line.qty}€`;
    })
    .join("\n");
  const emailLine = contact.email ? `\nEmail: ${contact.email}` : "";
  return `Hola! Voldria confirmar aquesta comanda:\n${items}\n\nTotal: ${total}€\n\nNom: ${contact.name}\nTelèfon: ${contact.phone}${emailLine}`;
}

function renderOrder() {
  const lines = cartLines();

  if (!lines.length) {
    orderEmptyEl.hidden = false;
    orderLayoutEl.hidden = true;
    return;
  }

  orderEmptyEl.hidden = true;
  orderLayoutEl.hidden = false;

  orderListEl.innerHTML = "";
  lines.forEach((line) => orderListEl.appendChild(renderOrderLine(line)));

  orderTotalEl.textContent = `${cartTotal()}€`;
}

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const lines = cartLines();
  if (!lines.length) return;

  const contact = {
    name: document.getElementById("order-name").value.trim(),
    phone: document.getElementById("order-phone").value.trim(),
    email: document.getElementById("order-email").value.trim(),
  };

  const message = buildFinalOrderMessage(lines, cartTotal(), contact);
  window.open(whatsappOrderUrl(message), "_blank", "noopener");
});

renderOrder();
