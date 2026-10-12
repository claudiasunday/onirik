/**
 * Cistella — llistat editable de les peces desades (localStorage via
 * cart.js), amb quantitats, subtotal i una comanda final enviada com a
 * missatge prefet al formulari de contacte.
 */

const cartEmptyEl = document.getElementById("cart-empty");
const cartLayoutEl = document.getElementById("cart-layout");
const cartListEl = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");
const cartCheckoutEl = document.getElementById("cart-checkout");
const cartClearEl = document.getElementById("cart-clear");

function renderCartLine(line) {
  const { id, qty, entry } = line;
  const display = catalogEntryDisplay(entry);
  const price = getEntryPrice(entry);

  const row = document.createElement("div");
  row.className = "cart-line";
  row.innerHTML = `
    <div class="cart-line-thumb">${display.thumbHtml}</div>
    <div class="cart-line-info">
      <h3><a href="fitxa.html?id=${id}">${display.title}</a></h3>
      <p class="cart-line-price">${price}€ / unitat</p>
    </div>
    <div class="qty-stepper" role="group" aria-label="Quantitat">
      <button type="button" class="qty-btn" data-qty-minus aria-label="Treure una unitat">−</button>
      <span class="qty-value">${qty}</span>
      <button type="button" class="qty-btn" data-qty-plus aria-label="Afegir una unitat">+</button>
    </div>
    <p class="cart-line-subtotal">${price * qty}€</p>
    <button type="button" class="cart-line-remove" aria-label="Eliminar de la cistella">✕</button>
  `;

  row.querySelector("[data-qty-minus]").addEventListener("click", () => {
    setCartQty(id, qty - 1);
    renderCart();
  });
  row.querySelector("[data-qty-plus]").addEventListener("click", () => {
    setCartQty(id, qty + 1);
    renderCart();
  });
  row.querySelector(".cart-line-remove").addEventListener("click", () => {
    removeFromCart(id);
    renderCart();
  });

  return row;
}

function buildOrderMessage(lines, total) {
  const items = lines
    .map((line) => `- ${catalogEntryDisplay(line.entry).title} x${line.qty}`)
    .join("\n");
  return `Hola! Voldria fer aquesta comanda:\n${items}\n\nTotal: ${total}€`;
}

function renderCart() {
  const lines = cartLines();

  if (!lines.length) {
    cartEmptyEl.hidden = false;
    cartLayoutEl.hidden = true;
    return;
  }

  cartEmptyEl.hidden = true;
  cartLayoutEl.hidden = false;

  cartListEl.innerHTML = "";
  lines.forEach((line) => cartListEl.appendChild(renderCartLine(line)));

  const total = cartTotal();
  cartTotalEl.textContent = `${total}€`;
  cartCheckoutEl.href = `contacte.html?missatge=${encodeURIComponent(buildOrderMessage(lines, total))}`;
}

cartClearEl.addEventListener("click", () => {
  clearCart();
  renderCart();
});

renderCart();
