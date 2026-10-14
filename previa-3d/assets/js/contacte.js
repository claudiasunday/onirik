/**
 * Formulari de contacte — de moment sense backend real: simula l'enviament
 * i mostra un missatge de confirmació. Substituir per una crida real quan
 * hi hagi un servei (formspree, backend propi, etc.) al darrere.
 */

const form = document.getElementById("contact-form");
const success = document.getElementById("form-success");

// Arribar amb ?missatge=... (des d'una fitxa de producte, p. ex.) omple
// el camp de missatge perquè la persona no l'hagi de reescriure.
const prefill = new URLSearchParams(location.search).get("missatge");
if (prefill) {
  const messageField = document.getElementById("cf-message");
  if (messageField) messageField.value = prefill;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  success.style.display = "block";
  form.reset();
});
