// Construeix els tres paquets a dist/. Ús: npm run build
import { build } from 'esbuild';

const common = { bundle: true, format: 'esm', minify: true, target: ['es2022'], legalComments: 'none', logLevel: 'info' };

await Promise.all([
  // Component lleuger: no inclou Three.js; importa el visor quan cal
  build({ ...common, entryPoints: ['src/element.js'], outfile: 'dist/onirik-board.js', external: ['./onirik-board-3d.js'] }),
  // Visor: Three.js + escena, en un sol fitxer
  build({ ...common, entryPoints: ['src/viewer.js'], outfile: 'dist/onirik-board-3d.js' }),
  // Forn de textures (no es fa servir a la web)
  build({ ...common, entryPoints: ['src/bake.js'], outfile: 'dist/bake.js' }),
]);
