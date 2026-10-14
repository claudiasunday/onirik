// Poses del mode hero. Fitxer petit compartit pel component (pòster i proporció, abans de
// carregar el 3D) i per l'escena (pose, encaix i moviment).
export const HERO_POSES = {
  // Home: dreta, en diagonal i girada. Encaix per esfera (hi cap en qualsevol gir).
  diagonal: {
    yawDeg: -34, rollDeg: -22, tiltDeg: 56, cameraPolarDeg: 84,
    fit: 'sphere', margin: 1.04,
    pointerYawDeg: 22, pointerTiltDeg: 9, scrollYawDeg: 50, scrollTiltDeg: -14,
    autoRotateDegPerSec: 16,
    aspect: '1 / 1', poster: { file: 'poster-hero.webp', width: 1000, height: 1000 },
  },
  // Pàgina BOARD: de cara, vertical, com una foto de producte. Encaix per alçada.
  front: {
    yawDeg: 0, rollDeg: 0, tiltDeg: 90, cameraPolarDeg: 90,
    fit: 'box', margin: 1.05,
    pointerYawDeg: 14, pointerTiltDeg: 6, scrollYawDeg: 0, scrollTiltDeg: 0,
    autoRotateDegPerSec: 16,
    aspect: '2 / 5', poster: { file: 'poster-hero-front.webp', width: 800, height: 2000 },
  },
};
