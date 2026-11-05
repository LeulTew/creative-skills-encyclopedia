/**
 * Hero 3D Centerpiece - Bridge Module to Production 3D GLB Stage
 * Creative Engineering & Skills Encyclopedia (2026 Edition)
 * Architecture: LeulTew // NVIDIA RTX 5070 Ti // Three.js r170+
 *
 * Bridges the legacy procedural interface to the production-grade Blender GLB stage
 * located at showcase-app/modules/stage-3d.js.
 */

import {
  initStage3D,
  setSpecimen,
  setFlavour,
  setScrollProgress,
  disposeStage3D,
  MODEL_REGISTRY,
  FLAVOUR_LIGHTING
} from './stage-3d.js';

export const FLAVOUR_PALETTES = {
  'ember': {
    name: 'Ember Glow',
    glassAttenuation: 0xf97316,
    glassColor: 0xffffff,
    interiorLight: 0xf59e0b,
    exteriorLight: 0x38bdf8,
    coreEmissive: 0xf59e0b,
    rimLight: 0xffedd5
  },
  'cobalt': {
    name: 'Electric Cobalt',
    glassAttenuation: 0x38bdf8,
    glassColor: 0xf0f9ff,
    interiorLight: 0x0284c7,
    exteriorLight: 0x38bdf8,
    coreEmissive: 0x38bdf8,
    rimLight: 0xbae6fd
  },
  'harvest-gold': {
    name: 'Harvest Gold',
    glassAttenuation: 0xeab308,
    glassColor: 0xfefce8,
    interiorLight: 0xfde047,
    exteriorLight: 0xca8a04,
    coreEmissive: 0xfacc15,
    rimLight: 0xfef08a
  },
  'cosmic-violet': {
    name: 'Cosmic Violet',
    glassAttenuation: 0xec4899,
    glassColor: 0xfdf4ff,
    interiorLight: 0x8b5cf6,
    exteriorLight: 0xec4899,
    coreEmissive: 0xa855f7,
    rimLight: 0xf5d0fe
  }
};

FLAVOUR_PALETTES['harvest'] = FLAVOUR_PALETTES['harvest-gold'];
FLAVOUR_PALETTES['cosmic'] = FLAVOUR_PALETTES['cosmic-violet'];

export function initHero3DStage() {
  return initStage3D();
}

export const initHero3DSpecimens = initStage3D;

export function switchGeometry(key) {
  setSpecimen(key);
}

export const morphToSpecimen = switchGeometry;
export { setSpecimen };

export function updateParticlePalette(flavourKey) {
  setFlavour(flavourKey);
}

export const setCenterpiecePalette = updateParticlePalette;

export function pauseHero3D() {
  // Graceful no-op or handled via stage3D
}

export function resumeHero3D() {
  // Graceful no-op or handled via stage3D
}

export function disposeHero3DStage() {
  disposeStage3D();
}

// Window registrations for global access
if (typeof window !== 'undefined') {
  window.initHero3DStage = initHero3DStage;
  window.initHero3DSpecimens = initHero3DStage;
  window.disposeHero3DStage = disposeHero3DStage;
  window.switchHeroGeometry = switchGeometry;
  window.morphToSpecimen = switchGeometry;
  window.setSpecimen = switchGeometry;
  window.updateParticlePalette = updateParticlePalette;
  window.setCenterpiecePalette = updateParticlePalette;
}
