/**
 * Formulari de contacte — de moment sense backend real: simula l'enviament
 * i mostra un missatge de confirmació. Substituir per una crida real quan
 * hi hagi un servei (formspree, backend propi, etc.) al darrere.
 */

const form = document.getElementById("contact-form");
const success = document.getElementById("form-success");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  success.style.display = "block";
  form.reset();
});
