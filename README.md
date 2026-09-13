# Onirik Boards — Home + Personalitza la teva taula

Prototip web estàtic (HTML/CSS/JS, sense build step) amb dues pantalles:

- **`index.html`** — Home: capçalera, bloc "Tria la teva taula en 3 passos!",
  targetes de producte ("Edició limitada"), secció de beneficis i contacte.
- **`personalitza.html`** — Configurador "Personalitza la teva taula" en 3
  passos (forma → disseny → color) + pantalla de resum "Dissenyat per tu",
  seguint el flux ja explorat al Figma del projecte.

## Origen

Aquest repositori parteix de dues fonts:

1. El disseny original a Figma (fa 3 anys): paleta de marca, tipografia i el
   concepte del bloc "Tria la teva taula en 3 pasos!".
2. L'evolució posterior del mateix fitxer Figma, que ja incloïa el
   configurador de 3 passos, la fitxa de producte i la tenda amb filtres.

## Estructura

```
index.html
personalitza.html
assets/
  css/styles.css   — tokens de marca (color, tipografia, radis) i estils
  images/          — fotografia del hero (veure "Crèdits d'imatge")
  js/board.js      — dades de producte (formes, dissenys, colors) + render SVG
  js/home.js       — targetes de producte de la Home
  js/personalitza.js — lògica del configurador de 3 passos
```

## Crèdits d'imatge

- `assets/images/hero-balance-board.jpg` — foto de Gustavo Torres a Unsplash
  (llicència Unsplash, ús lliure comercial):
  https://unsplash.com/photos/rBLTWS3WsQ8. Substitueix-la per fotografia
  pròpia de producte quan en tinguis.

## Marca

- Taronja `#f9b54f` / fosc `#313030` / crema `#f2e5d5`.
- Tipografia: Space Grotesk (títols, substitut de "PP Telegraf") + Inter (cos).

## Com veure-ho en local

Qualsevol servidor estàtic simple funciona, per exemple:

```bash
python3 -m http.server 8000
```

i obre `http://localhost:8000/`.

## Pendent / següents passos

- Substituir les il·lustracions SVG de les taules per fotografia real de producte.
- Connectar el configurador a un backend/carret real (ara `Afegir a la cistella`
  és només d'interfície).
- Decidir si es manté "Space Grotesk" o es compra/instal·la "PP Telegraf".
- Ampliar el catàleg de formes/dissenys/colors més enllà dels exemples inicials.
