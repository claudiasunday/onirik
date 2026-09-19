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
- Tipografia: Unbounded Black (900) (h1/h2, títols de nivell principal) + Onest (h3/subtítols en SemiBold, cos en Regular/Medium), totes dues de Google Fonts, carregades com a variable font (`wght@300..900`) perquè coincideixi amb el specimen de Google Fonts.
- Escala tipogràfica dels títols: tokens `--fs-*` a `:root` (`assets/css/styles.css`)
  perquè cada mida es defineixi un sol cop:
  - `--fs-h1-hero: clamp(34px, 5.5vw, 40px)` — títol del hero (Home).
  - `--fs-h1: 30px` — títol de pàgina (`.page-hero h1`).
  - `--fs-h2-lg` / `--fs-h2-lg-mobile` (26px / 21px) — intro de pas al configurador.
  - `--fs-h3-lg` / `--fs-h3-lg-mobile` (24px / 20px) — subtítol gran dins d'un pas.
  - `--fs-h2: 22px` — títol de secció (`.section-head h2`).
  - `--fs-h2-sm` / `--fs-h2-sm-mobile` (20px / 17px) — títols petits (contacte, wizard, prose...).
  Els h3 de mida de component (targetes, info-cards) queden fora d'aquesta escala.

## Com veure-ho en local

Qualsevol servidor estàtic simple funciona, per exemple:

```bash
python3 -m http.server 8000
```

i obre `http://localhost:8000/`.

## Packs i edicions especials (Tenda)

La Tenda (`tenda.html`) ja no només llista taules soltes: té un filtre de
categoria (Totes / Taules / Packs / Edicions especials / Accessoris) definit
a `assets/js/board.js`:

- `ROLLER` — el roller de suro com a accessori independent.
- `PACKS` — combinacions taula + roller amb preu conjunt (estalvi fix
  respecte comprar-ho per separat).
- `EDITIONS` — peces d'edició especial amb nom propi i unitats limitades
  (p. ex. "Muntanya Còsmica"), inspirades en les edicions reals de la tenda
  d'Onirik.

La Home (`index.html`) mostra una segona fila "Packs i edicions especials"
sota l'"Edició limitada". El filtre de categoria de la Tenda es pot
preseleccionar per URL (`tenda.html?cat=pack`).

## Pendent / següents passos

- Substituir les il·lustracions SVG de les taules i el roller per fotografia
  real de producte.
- Connectar el configurador i la tenda a un backend/carret real (ara
  `Afegir a la cistella` és només d'interfície).
- Ampliar el catàleg de formes/dissenys/colors més enllà dels exemples inicials.
- Crear una fitxa de producte pròpia per a packs i edicions especials (ara
  el clic porta al configurador, com la resta de targetes).
