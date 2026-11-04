/**
 * Hero 3D Centerpiece & Morphing Particle Specimens Module
 * Creative Engineering & Skills Encyclopedia (2026 Edition)
 * Architecture: LeulTew // NVIDIA RTX 5070 Ti // Three.js r170+
 *
 * Implements:
 * 1. 14,400+ Procedural Morphing Particles across 5 distinct specimens:
 *    - "brackets": </> Code Brackets & Ambient Syntax Matrix
 *    - "temple": Sanctuary Temple columns, pediment & 3-tier stylobate
 *    - "gears": Interlocking kinematic cogs, spokes & teeth
 *    - "dna": Double helix strands with base pairs & hydrogen bonds
 *    - "eye": AGI Neural Eye / HAL pupil with concentric 3D orbital rings
 * 2. Vertical Y-Axis Point Sorting Rule (points.sort((a, b) => b.y - a.y)):
 *    - Top-to-bottom deterministic ordering for coherent wavefront morphs
 *    - Normalized Y attribute (normY) for smooth colour gradients
 *    - Ember rim at top (normY ~ 1.0) to Electric Cobalt at bottom (normY ~ 0.0)
 * 3. Morphological Spring Physics & Top-to-Bottom Cascading Wavefront:
 *    - easeInOutCubic interpolation with per-particle height-based delay
 *    - Mid-morph helical swirl & particle dust snap
 * 4. Interactive 3D Cursor Repulsion with Elastic Return:
 *    - Raycast/unproject cursor to 3D world plane (z = 0)
 *    - Radial force with smooth quadratic falloff & elastic spring settling
 *    - 2.5s idle rest timeout for WCAG 2.2.2 compliance
 *    - prefers-reduced-motion accessibility support
 * 5. Dynamic SunChips Flavour Palette Synchronization:
 *    - Real-time retinting across Ember, Cobalt, Harvest Gold, and Cosmic Violet
 */

import * as THREE from 'three';

// Fallback resolver for Three.js instance
const _THREE = (typeof THREE !== 'undefined' && THREE.Scene)
  ? THREE
  : (typeof window !== 'undefined' && window.THREE ? window.THREE : THREE);

// ============================================================================
// CONSTANTS & FLAVOUR COLOR PALETTES
// ============================================================================

export const PARTICLE_COUNT = 14400;

export const FLAVOUR_PALETTES = {
  'ember': {
    top: '#ffb35c',    // Sunburst Amber
    bottom: '#0284c7', // Electric Cobalt
    rim: '#f97316',    // High-Chroma Ember
    glow: 'rgba(249, 115, 22, 0.4)'
  },
  'cobalt': {
    top: '#38bdf8',    // Sky Blue
    bottom: '#050b14', // Midnight Navy
    rim: '#0284c7',    // Electric Cobalt
    glow: 'rgba(56, 189, 248, 0.4)'
  },
  'harvest-gold': {
    top: '#fef08a',    // Warm Sand
    bottom: '#2a2418', // Umber Rim
    rim: '#eab308',    // Roasted Harvest Gold
    glow: 'rgba(234, 179, 8, 0.4)'
  },
  'cosmic-violet': {
    top: '#ec4899',    // Neon Fuchsia
    bottom: '#150f26', // Abyssal Black
    rim: '#8b5cf6',    // Electric Violet
    glow: 'rgba(139, 92, 246, 0.4)'
  }
};

// ============================================================================
// PROCEDURAL SPECIMEN GENERATORS (14,400 PARTICLES EACH)
// All specimens adhere to the Vertical Y-Axis Point Sorting Rule
// ============================================================================

/**
 * Specimen 1: "brackets" - </> Code Brackets & Ambient Syntax Matrix
 */
function generateBrackets(N) {
  const points = [];

  // Left bracket < (Two angled beams meeting at left vertex)
  const nBracket = Math.floor(N * 0.26); // ~3,744
  for (let i = 0; i < nBracket; i++) {
    const t = Math.random();
    const isTop = t < 0.5;
    const u = isTop ? t * 2 : (t - 0.5) * 2;
    let x, y;
    if (isTop) {
      x = -0.55 + (-1.95 - -0.55) * u;
      y = 1.45 + (0.0 - 1.45) * u;
    } else {
      x = -1.95 + (-0.55 - -1.95) * u;
      y = 0.0 + (-1.45 - 0.0) * u;
    }
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.pow(Math.random(), 0.6) * 0.15;
    points.push({
      x: x + Math.cos(angle) * rad,
      y: y + Math.sin(angle) * rad * 0.7,
      z: (Math.random() - 0.5) * 0.35 + Math.sin(angle) * rad
    });
  }

  // Slash / (Slanted central beam)
  const nSlash = Math.floor(N * 0.24); // ~3,456
  for (let i = 0; i < nSlash; i++) {
    const u = Math.random();
    const x = 0.65 + (-0.65 - 0.65) * u;
    const y = 1.78 + (-1.78 - 1.78) * u;
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.pow(Math.random(), 0.6) * 0.15;
    points.push({
      x: x + Math.cos(angle) * rad,
      y: y + Math.sin(angle) * rad * 0.7,
      z: (Math.random() - 0.5) * 0.35 + Math.sin(angle) * rad
    });
  }

  // Right bracket > (Two angled beams meeting at right vertex)
  for (let i = 0; i < nBracket; i++) {
    const t = Math.random();
    const isTop = t < 0.5;
    const u = isTop ? t * 2 : (t - 0.5) * 2;
    let x, y;
    if (isTop) {
      x = 0.55 + (1.95 - 0.55) * u;
      y = 1.45 + (0.0 - 1.45) * u;
    } else {
      x = 1.95 + (0.55 - 1.95) * u;
      y = 0.0 + (-1.45 - 0.0) * u;
    }
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.pow(Math.random(), 0.6) * 0.15;
    points.push({
      x: x + Math.cos(angle) * rad,
      y: y + Math.sin(angle) * rad * 0.7,
      z: (Math.random() - 0.5) * 0.35 + Math.sin(angle) * rad
    });
  }

  // Terminal cursor underscore & Ambient syntax halo matrix
  while (points.length < N) {
    const t = Math.random();
    if (t < 0.35) {
      // Underscore beam at bottom
      const u = Math.random();
      points.push({
        x: -0.65 + u * 1.3,
        y: -1.78 + (Math.random() - 0.5) * 0.09,
        z: (Math.random() - 0.5) * 0.22
      });
    } else {
      // Ambient framing matrix particles
      const phi = Math.random() * Math.PI * 2;
      const rx = 2.15 + (Math.random() - 0.5) * 0.45;
      const ry = 1.85 + (Math.random() - 0.5) * 0.45;
      points.push({
        x: Math.cos(phi) * rx,
        y: Math.sin(phi) * ry,
        z: (Math.random() - 0.5) * 0.4
      });
    }
  }

  // VERTICAL Y-AXIS POINT SORTING RULE
  points.sort((a, b) => b.y - a.y);
  return points;
}

/**
 * Specimen 2: "temple" - Sanctuary Temple Columns & Pediment
 */
function generateTemple(N) {
  const points = [];

  // 1. Triangular Pediment & Entablature (Roof)
  const nRoof = Math.floor(N * 0.28);
  for (let i = 0; i < nRoof; i++) {
    const t = Math.random();
    if (t < 0.45) {
      // Slanted gable beams
      const side = Math.random() < 0.5 ? -1 : 1;
      const u = Math.random();
      const x = side * (u * 2.3);
      const y = 1.88 - u * 0.82;
      points.push({
        x: x + (Math.random() - 0.5) * 0.12,
        y: y + (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.45
      });
    } else if (t < 0.75) {
      // Cornice / architrave horizontal beam
      const x = (Math.random() - 0.5) * 4.6;
      const y = 1.06 + (Math.random() - 0.5) * 0.14;
      points.push({
        x,
        y,
        z: (Math.random() - 0.5) * 0.55
      });
    } else {
      // Tympanum interior triangle
      const u = Math.random();
      const v = Math.random() * (1 - u);
      const x = -2.25 * u + 2.25 * v;
      const y = 1.84 * (1 - u - v) + 1.06 * (u + v);
      points.push({
        x,
        y,
        z: (Math.random() - 0.5) * 0.28
      });
    }
  }

  // 2. 6 Classical Fluted Columns
  const colCenters = [-2.0, -1.2, -0.4, 0.4, 1.2, 2.0];
  const nColTotal = Math.floor(N * 0.46);
  const nPerCol = Math.floor(nColTotal / colCenters.length);
  for (let c = 0; c < colCenters.length; c++) {
    const cx = colCenters[c];
    for (let i = 0; i < nPerCol; i++) {
      const u = Math.random();
      const y = -1.02 + u * 1.98; // -1.02 to 0.96
      const angle = Math.random() * Math.PI * 2;
      const fluting = Math.cos(angle * 8) * 0.022;
      const rad = 0.155 + fluting + (Math.random() - 0.5) * 0.03;
      const flare = (y > 0.86 || y < -0.92) ? 0.065 : 0.0;
      points.push({
        x: cx + Math.cos(angle) * (rad + flare),
        y: y,
        z: Math.sin(angle) * (rad + flare) + (Math.random() - 0.5) * 0.06
      });
    }
  }

  // 3. Stepped Stylobate / Crepidoma (3 stone base tiers)
  while (points.length < N) {
    const step = Math.random();
    let y, w, d;
    if (step < 0.35) {
      y = -1.05 - Math.random() * 0.18;
      w = 2.25; d = 0.75;
    } else if (step < 0.7) {
      y = -1.23 - Math.random() * 0.2;
      w = 2.5; d = 0.95;
    } else {
      y = -1.43 - Math.random() * 0.22;
      w = 2.75; d = 1.15;
    }
    const x = (Math.random() - 0.5) * 2 * w;
    const z = (Math.random() - 0.5) * 2 * d;
    points.push({ x, y, z });
  }

  // VERTICAL Y-AXIS POINT SORTING RULE
  points.sort((a, b) => b.y - a.y);
  return points;
}

/**
 * Specimen 3: "gears" - Interlocking Mechanical Cogs & Teeth
 */
function generateGears(N) {
  const points = [];

  function addGear(cx, cy, cz, outerR, pitchR, hubR, teeth, numSpokes, count) {
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const z = cz + (Math.random() - 0.5) * 0.35;

      if (t < 0.45) {
        // Outer rim & Teeth
        const toothPhase = (angle * teeth) % (Math.PI * 2);
        const isTooth = toothPhase < Math.PI;
        const rBase = pitchR + (isTooth ? (outerR - pitchR) * 0.95 : -0.08);
        const r = rBase + (Math.random() - 0.5) * 0.08;
        points.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          z
        });
      } else if (t < 0.70) {
        // Spokes
        const spokeIndex = Math.floor(Math.random() * numSpokes);
        const spokeAngle = (spokeIndex / numSpokes) * Math.PI * 2;
        const u = Math.random();
        const r = hubR + (pitchR - 0.08 - hubR) * u;
        const perp = (Math.random() - 0.5) * 0.08;
        const x = cx + Math.cos(spokeAngle) * r - Math.sin(spokeAngle) * offset(spokeAngle, perp);
        const y = cy + Math.sin(spokeAngle) * r + Math.cos(spokeAngle) * perp;
        points.push({ x, y, z });
      } else {
        // Hub & Axle bore
        const r = hubR * Math.sqrt(Math.random() * 0.7 + 0.3);
        points.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          z
        });
      }
    }
  }

  function offset(ang, val) {
    return val;
  }

  // Gear 1 (Main Driving Gear, 14 teeth)
  const n1 = Math.floor(N * 0.46);
  addGear(-0.75, 0.15, 0.0, 1.35, 1.15, 0.38, 14, 6, n1);

  // Gear 2 (Interlocking Secondary Gear, 10 teeth)
  const n2 = Math.floor(N * 0.34);
  addGear(0.88, -0.45, 0.06, 1.02, 0.86, 0.30, 10, 4, n2);

  // Gear 3 (Upper Pinion Gear, 8 teeth)
  while (points.length < N) {
    const angle = Math.random() * Math.PI * 2;
    const z = -0.08 + (Math.random() - 0.5) * 0.28;
    const teeth = 8;
    const pitchR = 0.54, outerR = 0.65, hubR = 0.22;
    const toothPhase = (angle * teeth) % (Math.PI * 2);
    const isTooth = toothPhase < Math.PI;
    const r = (isTooth ? outerR : pitchR - 0.06) + (Math.random() - 0.5) * 0.06;
    points.push({
      x: -0.22 + Math.cos(angle) * r,
      y: 1.52 + Math.sin(angle) * r,
      z
    });
  }

  // VERTICAL Y-AXIS POINT SORTING RULE
  points.sort((a, b) => b.y - a.y);
  return points;
}

/**
 * Specimen 4: "dna" - Double Helix Strands with Base Pairs
 */
function generateDNA(N) {
  const points = [];
  const nStrand = Math.floor(N * 0.35); // 35% each strand

  // Strand A (Sugar-Phosphate backbone 1)
  for (let i = 0; i < nStrand; i++) {
    const u = i / nStrand;
    const y = -2.2 + u * 4.4;
    const theta = (u - 0.5) * Math.PI * 5.4; // 2.7 full turns
    const R = 1.18;
    const tubeAngle = Math.random() * Math.PI * 2;
    const tubeR = Math.pow(Math.random(), 0.5) * 0.14;
    const bx = Math.cos(theta) * R;
    const bz = Math.sin(theta) * R;
    points.push({
      x: bx + Math.cos(tubeAngle) * tubeR,
      y: y + Math.sin(tubeAngle) * tubeR * 0.5,
      z: bz + (Math.random() - 0.5) * 0.14
    });
  }

  // Strand B (Sugar-Phosphate backbone 2, phase shifted by PI)
  for (let i = 0; i < nStrand; i++) {
    const u = i / nStrand;
    const y = -2.2 + u * 4.4;
    const theta = (u - 0.5) * Math.PI * 5.4 + Math.PI;
    const R = 1.18;
    const tubeAngle = Math.random() * Math.PI * 2;
    const tubeR = Math.pow(Math.random(), 0.5) * 0.14;
    const bx = Math.cos(theta) * R;
    const bz = Math.sin(theta) * R;
    points.push({
      x: bx + Math.cos(tubeAngle) * tubeR,
      y: y + Math.sin(tubeAngle) * tubeR * 0.5,
      z: bz + (Math.random() - 0.5) * 0.14
    });
  }

  // 26 Base-pair rungs & hydrogen bonds bridging Strand A and Strand B
  const numRungs = 26;
  while (points.length < N) {
    const rungIdx = Math.floor(Math.random() * numRungs);
    const u = (rungIdx + 0.5) / numRungs;
    const y = -2.0 + u * 4.0;
    const theta = (u - 0.5) * Math.PI * 5.4;
    const R = 1.18;
    const xA = Math.cos(theta) * R;
    const zA = Math.sin(theta) * R;
    const xB = Math.cos(theta + Math.PI) * R;
    const zB = Math.sin(theta + Math.PI) * R;

    const s = Math.random();
    const rx = xA + (xB - xA) * s;
    const rz = zA + (zB - zA) * s;
    const jitter = (Math.random() - 0.5) * 0.08;
    points.push({
      x: rx + jitter,
      y: y + jitter * 0.6,
      z: rz + jitter
    });
  }

  // VERTICAL Y-AXIS POINT SORTING RULE
  points.sort((a, b) => b.y - a.y);
  return points;
}

/**
 * Specimen 5: "eye" - AGI Neural Eye / HAL Pupil with Concentric Orbital Rings
 */
function generateEye(N) {
  const points = [];

  // 1. Core HAL singularity pupil (Dense radiant center core)
  const nCore = Math.floor(N * 0.18);
  for (let i = 0; i < nCore; i++) {
    const phi = Math.random() * Math.PI * 2;
    const costheta = Math.random() * 2 - 1;
    const u = Math.pow(Math.random(), 0.7);
    const r = u * 0.32;
    const theta = Math.acos(costheta);
    points.push({
      x: r * Math.sin(theta) * Math.cos(phi),
      y: r * Math.sin(theta) * Math.sin(phi),
      z: r * Math.cos(theta) * 0.55
    });
  }

  // 2. Iris & Neural rays
  const nIris = Math.floor(N * 0.28);
  for (let i = 0; i < nIris; i++) {
    const angle = Math.random() * Math.PI * 2;
    const u = Math.pow(Math.random(), 0.5);
    const r = 0.32 + u * 0.68;
    const filament = Math.sin(angle * 24) * 0.04;
    points.push({
      x: Math.cos(angle) * (r + filament),
      y: Math.sin(angle) * (r + filament),
      z: (Math.random() - 0.5) * 0.18
    });
  }

  // 3. Sclera / Almond Eye contours
  const nSclera = Math.floor(N * 0.24);
  for (let i = 0; i < nSclera; i++) {
    const u = (Math.random() - 0.5) * 2;
    const x = u * 2.1;
    const isTop = Math.random() < 0.5;
    const arch = Math.cos(u * Math.PI * 0.5);
    const yBase = (isTop ? 1 : -1) * (0.2 + arch * 0.95);
    const y = yBase + (Math.random() - 0.5) * 0.15;
    const zDome = (1 - (x * x) / (2.2 * 2.2) - (y * y) / (1.2 * 1.2));
    const z = (zDome > 0 ? Math.sqrt(zDome) * 0.4 : 0) + (Math.random() - 0.5) * 0.15;
    points.push({ x, y, z });
  }

  // 4. Concentric Neural Orbital Gimbal Rings (3 tilted 3D rings)
  const rotX = (x, y, z, ang) => ({
    x,
    y: y * Math.cos(ang) - z * Math.sin(ang),
    z: y * Math.sin(ang) + z * Math.cos(ang)
  });
  const rotZ = (x, y, z, ang) => ({
    x: x * Math.cos(ang) - y * Math.sin(ang),
    y: x * Math.sin(ang) + y * Math.cos(ang),
    z
  });
  const rotY = (x, y, z, ang) => ({
    x: x * Math.cos(ang) + z * Math.sin(ang),
    y,
    z: -x * Math.sin(ang) + z * Math.cos(ang)
  });

  const nRing = Math.floor((N - points.length) / 3);
  // Ring 1 (Tilted around X by 25 deg)
  for (let i = 0; i < nRing; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.48 + (Math.random() - 0.5) * 0.08;
    const p = rotX(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.08, 0.45);
    points.push(p);
  }
  // Ring 2 (Tilted around Z by -45 deg)
  for (let i = 0; i < nRing; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.88 + (Math.random() - 0.5) * 0.08;
    const p = rotZ(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.08, -0.75);
    points.push(p);
  }
  // Ring 3 (Tilted around Y by 35 deg)
  while (points.length < N) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.25 + (Math.random() - 0.5) * 0.08;
    const p = rotY(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.08, 0.6);
    points.push(p);
  }

  // VERTICAL Y-AXIS POINT SORTING RULE
  points.sort((a, b) => b.y - a.y);
  return points;
}

// ============================================================================
// DATA PACKING & NORMALIZED Y COMPUTATION
// ============================================================================

function packSpecimenData(points) {
  const N = points.length;
  const positions = new Float32Array(N * 3);
  const normY = new Float32Array(N);

  let yMin = Infinity, yMax = -Infinity;
  for (let i = 0; i < N; i++) {
    const y = points[i].y;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  }
  const ySpan = Math.max(0.0001, yMax - yMin);

  for (let i = 0; i < N; i++) {
    const p = points[i];
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
    // Normalized Y attribute: 1.0 at apex, 0.0 at base
    normY[i] = Math.min(1.0, Math.max(0.0, (p.y - yMin) / ySpan));
  }

  return { positions, normY };
}

// Generate and pack all 5 specimens
let SPECIMEN_CACHE = null;
function getSpecimenCache() {
  if (!SPECIMEN_CACHE) {
    SPECIMEN_CACHE = {
      'brackets': packSpecimenData(generateBrackets(PARTICLE_COUNT)),
      'temple': packSpecimenData(generateTemple(PARTICLE_COUNT)),
      'gears': packSpecimenData(generateGears(PARTICLE_COUNT)),
      'dna': packSpecimenData(generateDNA(PARTICLE_COUNT)),
      'eye': packSpecimenData(generateEye(PARTICLE_COUNT))
    };
  }
  return SPECIMEN_CACHE;
}

// Easing helper
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================================================
// THREE.JS GLSL SHADERS
// ============================================================================

const vertexShader = `
  attribute float aNormY;
  attribute float aRandom;
  
  uniform float uTime;
  uniform vec3 uColorTop;
  uniform vec3 uColorBottom;
  uniform vec3 uColorRim;
  uniform float uPointSize;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Top-to-bottom color gradient driven by aNormY
    vec3 baseColor = mix(uColorBottom, uColorTop, aNormY);
    
    // Warm rim highlight along top edges
    float rimFactor = pow(aNormY, 2.2);
    vColor = mix(baseColor, uColorRim, rimFactor * 0.45);
    
    // Subtle procedural sparkle
    float sparkle = sin(uTime * 2.2 + aRandom * 6.28318) * 0.15 + 0.85;
    vColor *= sparkle;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation with distance
    gl_PointSize = uPointSize * (280.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.5, 42.0);
    
    vAlpha = 0.82 + 0.18 * aNormY;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Procedural glowing circular point sprite with hot center core
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    
    // Gaussian falloff
    float core = smoothstep(0.5, 0.0, dist);
    float halo = exp(-dist * 6.5);
    float alpha = (core * 0.55 + halo * 0.45) * vAlpha;
    
    // Luminous hotspot at center
    vec3 outColor = vColor + vec3(1.0) * pow(core, 4.0) * 0.65;
    
    gl_FragColor = vec4(outColor, alpha);
  }
`;

// ============================================================================
// STAGE STATE & LIFECYCLE
// ============================================================================

let scene = null;
let camera = null;
let renderer = null;
let pointsMesh = null;
let pointsGeometry = null;
let pointsMaterial = null;
let containerEl = null;
let animFrameId = null;
let resizeObserver = null;

let isInitialized = false;
let currentSpecimenKey = 'brackets';
let targetSpecimenKey = 'brackets';

// Physics buffers
let currentPositions = null;
let velocities = null;
let sourcePositions = null;
let currentNormY = null;
let sourceNormY = null;

// Morphing animation state
let isMorphing = false;
let morphStartTime = 0;
const MORPH_DURATION = 1250; // ms

// Interactive pointer repulsion state
const raycaster = new _THREE.Raycaster();
const planeZ0 = new _THREE.Plane(new _THREE.Vector3(0, 0, 1), 0);
const cursor3D = new _THREE.Vector3(9999, 9999, 9999);
let isPointerActive = false;
let lastPointerTime = 0;
const IDLE_TIMEOUT_MS = 2500; // WCAG 2.2.2 compliance

// Color lerp state
const currentColorTop = new _THREE.Color();
const currentColorBottom = new _THREE.Color();
const currentColorRim = new _THREE.Color();
const targetColorTop = new _THREE.Color();
const targetColorBottom = new _THREE.Color();
const targetColorRim = new _THREE.Color();

// ============================================================================
// PUBLIC API: updateParticlePalette
// ============================================================================

export function updateParticlePalette(flavourKey) {
  const palette = FLAVOUR_PALETTES[flavourKey] || FLAVOUR_PALETTES['ember'];
  targetColorTop.set(palette.top);
  targetColorBottom.set(palette.bottom);
  targetColorRim.set(palette.rim);
}

// ============================================================================
// PUBLIC API: setSpecimen
// ============================================================================

export function setSpecimen(specimenKey) {
  const cache = getSpecimenCache();
  if (!cache[specimenKey] || (specimenKey === currentSpecimenKey && !isMorphing)) {
    return;
  }

  // Freeze current positions as starting source for the morph
  if (currentPositions && sourcePositions) {
    sourcePositions.set(currentPositions);
  }
  if (currentNormY && sourceNormY) {
    sourceNormY.set(currentNormY);
  }

  targetSpecimenKey = specimenKey;
  morphStartTime = performance.now();
  isMorphing = true;

  // Update UI specimen selector buttons
  if (typeof document !== 'undefined') {
    const pills = document.querySelectorAll('.specimen-pill[data-specimen]');
    pills.forEach(pill => {
      const match = pill.getAttribute('data-specimen') === specimenKey;
      if (match) {
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
      } else {
        pill.classList.remove('active');
        pill.removeAttribute('aria-selected');
      }
    });
  }
}

// ============================================================================
// EVENT LISTENERS: POINTER & SPECIMEN BUTTONS
// ============================================================================

function setupEventListeners() {
  if (typeof window === 'undefined' || !containerEl) return;

  // 1. Pointer move repulsion
  const handlePointerMove = (e) => {
    if (!renderer || !camera || !containerEl) return;
    const rect = containerEl.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // Check if cursor is within interactive region of viewport
    const inside = (
      e.clientX >= rect.left - 40 &&
      e.clientX <= rect.right + 40 &&
      e.clientY >= rect.top - 40 &&
      e.clientY <= rect.bottom + 40
    );

    if (inside) {
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(new _THREE.Vector2(mouseX, mouseY), camera);
      const intersectPoint = new _THREE.Vector3();
      if (raycaster.ray.intersectPlane(planeZ0, intersectPoint)) {
        cursor3D.copy(intersectPoint);
        isPointerActive = true;
        lastPointerTime = performance.now();
      }
    } else {
      isPointerActive = false;
      cursor3D.set(9999, 9999, 9999);
    }
  };

  const handlePointerLeave = () => {
    isPointerActive = false;
    cursor3D.set(9999, 9999, 9999);
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  containerEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });

  // 2. Specimen button clicks
  const pills = document.querySelectorAll('.specimen-pill[data-specimen]');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const spec = pill.getAttribute('data-specimen');
      if (spec) setSpecimen(spec);
    });
  });
}

// ============================================================================
// ANIMATION & PHYSICS RENDER LOOP
// ============================================================================

function renderLoop(now) {
  animFrameId = requestAnimationFrame(renderLoop);

  if (!renderer || !scene || !camera || !pointsGeometry) return;

  // Check WCAG prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Idle timeout check (WCAG 2.2.2 pause after 2.5s)
  if (isPointerActive && now - lastPointerTime > IDLE_TIMEOUT_MS) {
    isPointerActive = false;
    cursor3D.set(9999, 9999, 9999);
  }

  // Smooth colour palette lerp
  currentColorTop.lerp(targetColorTop, 0.06);
  currentColorBottom.lerp(targetColorBottom, 0.06);
  currentColorRim.lerp(targetColorRim, 0.06);

  if (pointsMaterial && pointsMaterial.uniforms) {
    pointsMaterial.uniforms.uTime.value = now * 0.001;
    pointsMaterial.uniforms.uColorTop.value.copy(currentColorTop);
    pointsMaterial.uniforms.uColorBottom.value.copy(currentColorBottom);
    pointsMaterial.uniforms.uColorRim.value.copy(currentColorRim);
  }

  // Morph progress evaluation
  const cache = getSpecimenCache();
  const targetSpec = cache[targetSpecimenKey];
  const targetPositions = targetSpec.positions;
  const targetNormY = targetSpec.normY;

  let morphProgress = 1.0;
  if (isMorphing) {
    const elapsed = now - morphStartTime;
    morphProgress = Math.min(1.0, elapsed / MORPH_DURATION);
    if (morphProgress >= 1.0) {
      isMorphing = false;
      currentSpecimenKey = targetSpecimenKey;
    }
  }

  // Cursor repulsion radius & force
  const repRadius = 0.95;
  const repRadiusSq = repRadius * repRadius;
  const repForceCoeff = prefersReducedMotion ? 0 : 0.22;
  const kSpring = prefersReducedMotion ? 0.35 : 0.09;
  const damping = prefersReducedMotion ? 0.70 : 0.86;

  // Physics integration for each particle
  const posAttr = pointsGeometry.attributes.position;
  const normYAttr = pointsGeometry.attributes.aNormY;
  const posArray = posAttr.array;
  const normYArray = normYAttr.array;

  const cx = cursor3D.x;
  const cy = cursor3D.y;
  const cz = cursor3D.z;
  const cursorActive = isPointerActive && !prefersReducedMotion;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // 1. Compute Base Morph Target Position
    let idealX, idealY, idealZ;
    if (isMorphing) {
      // Cascading top-to-bottom delay based on particle height
      const pNormY = sourceNormY[i];
      const pDelay = (1.0 - pNormY) * 0.32; // Top particles morph first
      const pProgress = Math.min(1.0, Math.max(0.0, (morphProgress - pDelay) / (1.0 - 0.32)));
      const t = easeInOutCubic(pProgress);

      const sx = sourcePositions[i3];
      const sy = sourcePositions[i3 + 1];
      const sz = sourcePositions[i3 + 2];
      const tx = targetPositions[i3];
      const ty = targetPositions[i3 + 1];
      const tz = targetPositions[i3 + 2];

      idealX = sx + (tx - sx) * t;
      idealY = sy + (ty - sy) * t;
      idealZ = sz + (tz - sz) * t;

      // Mid-morph helical swirl
      if (t > 0.0 && t < 1.0 && !prefersReducedMotion) {
        const swirl = Math.sin(t * Math.PI) * 0.16;
        idealX += -Math.sin(idealY * 1.6) * swirl;
        idealZ += Math.cos(idealY * 1.6) * swirl;
      }

      // Interpolate normY
      const snY = sourceNormY[i];
      const tnY = targetNormY[i];
      currentNormY[i] = snY + (tnY - snY) * t;
      normYArray[i] = currentNormY[i];
    } else {
      idealX = targetPositions[i3];
      idealY = targetPositions[i3 + 1];
      idealZ = targetPositions[i3 + 2];
    }

    // 2. Cursor Repulsion Force
    let curX = currentPositions[i3];
    let curY = currentPositions[i3 + 1];
    let curZ = currentPositions[i3 + 2];

    if (cursorActive) {
      const dx = curX - cx;
      const dy = curY - cy;
      const dz = curZ - cz;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < repRadiusSq && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const force = (1.0 - dist / repRadius) * repForceCoeff;
        velocities[i3] += (dx / dist) * force;
        velocities[i3 + 1] += (dy / dist) * force;
        velocities[i3 + 2] += ((dz / dist) + 0.5) * force; // Outward z-burst
      }
    }

    // 3. Elastic Spring Physics Return
    const fx = (idealX - curX) * kSpring;
    const fy = (idealY - curY) * kSpring;
    const fz = (idealZ - curZ) * kSpring;

    velocities[i3] = (velocities[i3] + fx) * damping;
    velocities[i3 + 1] = (velocities[i3 + 1] + fy) * damping;
    velocities[i3 + 2] = (velocities[i3 + 2] + fz) * damping;

    curX += velocities[i3];
    curY += velocities[i3 + 1];
    curZ += velocities[i3 + 2];

    currentPositions[i3] = curX;
    currentPositions[i3 + 1] = curY;
    currentPositions[i3 + 2] = curZ;

    posArray[i3] = curX;
    posArray[i3 + 1] = curY;
    posArray[i3 + 2] = curZ;
  }

  posAttr.needsUpdate = true;
  if (isMorphing) {
    normYAttr.needsUpdate = true;
  }

  // Subtle holographic tilt & ambient breathing
  if (!prefersReducedMotion && pointsMesh) {
    const tSec = now * 0.001;
    pointsMesh.rotation.y = Math.sin(tSec * 0.22) * 0.16;
    pointsMesh.rotation.x = Math.cos(tSec * 0.18) * 0.06;
  }

  renderer.render(scene, camera);
}

// ============================================================================
// PUBLIC API: initHero3DStage
// ============================================================================

export function initHero3DStage() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  containerEl = document.getElementById('hero-3d-canvas-container');
  if (!containerEl) {
    return;
  }

  // Idempotent re-entrance protection
  if (isInitialized && renderer && camera) {
    const w = containerEl.clientWidth || 800;
    const h = containerEl.clientHeight || 500;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    return;
  }

  // Dimensions
  const width = containerEl.clientWidth || window.innerWidth || 800;
  const height = containerEl.clientHeight || 540;

  // Three.js Scene, Camera, Renderer
  scene = new _THREE.Scene();
  camera = new _THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 4.8);

  renderer = new _THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = _THREE.NeutralToneMapping || _THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = _THREE.SRGBColorSpace;

  // Mount canvas while preserving accessibility screen-reader text
  const srText = containerEl.querySelector('p.sr-only');
  containerEl.innerHTML = '';
  if (srText) containerEl.appendChild(srText);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.outline = 'none';
  containerEl.appendChild(renderer.domElement);

  // Initialize Specimen Cache & Geometry
  const cache = getSpecimenCache();
  const initialSpec = cache['brackets'];

  currentPositions = new Float32Array(initialSpec.positions);
  velocities = new Float32Array(PARTICLE_COUNT * 3);
  sourcePositions = new Float32Array(initialSpec.positions);
  currentNormY = new Float32Array(initialSpec.normY);
  sourceNormY = new Float32Array(initialSpec.normY);

  const randoms = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    randoms[i] = Math.random();
  }

  pointsGeometry = new _THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new _THREE.BufferAttribute(new Float32Array(currentPositions), 3));
  pointsGeometry.setAttribute('aNormY', new _THREE.BufferAttribute(new Float32Array(currentNormY), 1));
  pointsGeometry.setAttribute('aRandom', new _THREE.BufferAttribute(randoms, 1));

  // Determine initial colour palette from DOM body data-flavour
  const activeFlavour = document.body.getAttribute('data-flavour') || 'ember';
  const initialPalette = FLAVOUR_PALETTES[activeFlavour] || FLAVOUR_PALETTES['ember'];

  currentColorTop.set(initialPalette.top);
  currentColorBottom.set(initialPalette.bottom);
  currentColorRim.set(initialPalette.rim);
  targetColorTop.set(initialPalette.top);
  targetColorBottom.set(initialPalette.bottom);
  targetColorRim.set(initialPalette.rim);

  pointsMaterial = new _THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uColorTop: { value: currentColorTop },
      uColorBottom: { value: currentColorBottom },
      uColorRim: { value: currentColorRim },
      uPointSize: { value: 28.0 }
    },
    transparent: true,
    depthWrite: false,
    blending: _THREE.AdditiveBlending
  });

  pointsMesh = new _THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(pointsMesh);

  // Event Listeners for controls and cursor
  setupEventListeners();

  // Responsive Resize Handling via ResizeObserver
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && renderer && camera) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(containerEl);
  }

  isInitialized = true;

  // Start Animation Loop
  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = requestAnimationFrame(renderLoop);
}

// Backwards compatibility alias
export const initHero3DSpecimens = initHero3DStage;
export const morphToSpecimen = setSpecimen;

// ============================================================================
// CLEANUP & DISPOSAL
// ============================================================================

export function disposeHero3DStage() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (resizeObserver && containerEl) {
    resizeObserver.unobserve(containerEl);
    resizeObserver = null;
  }
  if (pointsGeometry) {
    pointsGeometry.dispose();
    pointsGeometry = null;
  }
  if (pointsMaterial) {
    pointsMaterial.dispose();
    pointsMaterial = null;
  }
  if (renderer) {
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer.dispose();
    renderer = null;
  }
  scene = null;
  camera = null;
  pointsMesh = null;
  isInitialized = false;
}

// ============================================================================
// WINDOW REGISTRATIONS & AUTO-MOUNTING
// ============================================================================

if (typeof window !== 'undefined') {
  window.initHero3DStage = initHero3DStage;
  window.initHero3DSpecimens = initHero3DStage;
  window.updateParticlePalette = updateParticlePalette;
  window.setSpecimen = setSpecimen;
  window.morphToSpecimen = setSpecimen;
  window.disposeHero3DStage = disposeHero3DStage;

  // Auto-mount when DOM is ready if not already invoked by app.js
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHero3DStage();
    });
  } else {
    // If DOM is already interactive/complete, initialize on next microtask
    setTimeout(() => {
      initHero3DStage();
    }, 0);
  }
}
