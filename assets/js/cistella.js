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

  const isOffer = entry.kind === "roller-offer";
  const titleHtml =
    entry.kind === "custom" || isOffer
      ? display.title
      : `<a href="fitxa.html?id=${id}">${display.title}</a>`;

  const row = document.createElement("div");
  row.className = "cart-line";
  row.innerHTML = `
    <div class="cart-line-thumb">${display.thumbHtml}</div>
    <div class="cart-line-info">
      <h3>${titleHtml}</h3>
      ${
        isOffer
          ? `<p class="cart-line-price"><s>${entry.wasPrice}€</s> ${price}€ / unitat</p>
             <p class="cart-line-offer">Oferta amb la teva taula personalitzada</p>`
          : `<p class="cart-line-price">${price}€ / unitat</p>`
      }
    </div>
    ${
      isOffer
        ? `<p class="cart-line-qty-fixed">× ${qty}</p>`
        : `<div class="qty-stepper" role="group" aria-label="Quantitat">
      <button type="button" class="qty-btn" data-qty-minus aria-label="Treure una unitat">−</button>
      <span class="qty-value">${qty}</span>
      <button type="button" class="qty-btn" data-qty-plus aria-label="Afegir una unitat">+</button>
    </div>`
    }
    <p class="cart-line-subtotal">${price * qty}€</p>
    <button type="button" class="cart-line-remove" aria-label="Eliminar de la cistella">✕</button>
  `;

  if (!isOffer) {
    row.querySelector("[data-qty-minus]").addEventListener("click", () => {
      setCartQty(id, qty - 1);
      renderCart();
    });
    row.querySelector("[data-qty-plus]").addEventListener("click", () => {
      setCartQty(id, qty + 1);
      renderCart();
    });
  }
  row.querySelector(".cart-line-remove").addEventListener("click", () => {
    removeFromCart(id);
    renderCart();
  });

  return row;
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

  cartTotalEl.textContent = `${cartTotal()}€`;
}

cartClearEl.addEventListener("click", () => {
  clearCart();
  renderCart();
});

renderCart();
