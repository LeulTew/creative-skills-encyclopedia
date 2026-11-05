/**
 * Hero 3D Specimens - Bridge Module to Production 3D GLB Stage
 * Creative Engineering & Skills Encyclopedia (2026 Edition)
 * Architecture: LeulTew // NVIDIA RTX 5070 Ti // Three.js r170+
 */

import { initStage3D, setSpecimen, setFlavour } from './stage-3d.js';

export function initHero3DSpecimens() {
  return initStage3D();
}

export function morphToSpecimen(specimenKey) {
  setSpecimen(specimenKey);
}

if (typeof window !== 'undefined') {
  window.initHero3DSpecimens = initHero3DSpecimens;
  window.morphToSpecimen = morphToSpecimen;
}
