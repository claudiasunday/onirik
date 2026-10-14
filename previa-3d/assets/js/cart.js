/**
 * Cistella de la compra — basada en localStorage (no hi ha backend real,
 * igual que la resta del lloc): guarda id + quantitat de cada peça.
 * Compartida per totes les pàgines (afegir des de la fitxa, veure-la a
 * cistella.html, comptador a la capçalera). Requereix que board.js
 * (findCatalogEntry, getEntryPrice) s'hagi carregat abans.
 */

const CART_KEY = "onirik-cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    // localStorage no disponible (mode privat, quota plena...): la
    // cistella no es podrà desar, però no cal trencar la pàgina per això.
  }
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const line = cart.find((l) => l.id === id);
  if (line) line.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
}

// Afegeix una taula personalitzada (configurador "Personalitza la teva
// taula"): no té id de catàleg, així que es guarda sencera a la línia
// (en lloc de només l'id) amb un id generat només per identificar-la
// dins la cistella.
function addCustomToCart(customEntry, qty = 1) {
  const cart = getCart();
  const id = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  cart.push({ id, qty, custom: customEntry });
  saveCart(cart);
  return id;
}

function removeFromCart(id) {
  saveCart(getCart().filter((l) => l.id !== id));
}

function setCartQty(id, qty) {
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  const cart = getCart();
  const line = cart.find((l) => l.id === id);
  if (line) {
    line.qty = qty;
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

// Línies de la cistella ja resoltes contra el catàleg (ignora ids que ja
// no hi existeixin, per si el catàleg canvia).
function cartLines() {
  return getCart()
    .map((line) => {
      const entry = line.custom || findCatalogEntry(line.id);
      return entry ? { ...line, entry } : null;
    })
    .filter(Boolean);
}

function cartCount() {
  return getCart().reduce((sum, line) => sum + line.qty, 0);
}

function cartTotal() {
  return cartLines().reduce((sum, line) => sum + getEntryPrice(line.entry) * line.qty, 0);
}

// Actualitza qualsevol badge de la cistella present a la pàgina (n'hi pot
// haver més d'un: capçalera d'escriptori i mòbil).
function updateCartBadge() {
  const badges = document.querySelectorAll(".cart-badge");
  if (!badges.length) return;
  const count = cartCount();
  badges.forEach((badge) => {
    badge.textContent = count;
    badge.hidden = count === 0;
  });
}

updateCartBadge();
