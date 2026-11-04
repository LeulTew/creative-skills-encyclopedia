/**
 * Signature First-Viewport 3D Centerpiece: Morphing Particle Specimens Engine
 * 2026 Frontier Edition // LeulTew Architecture
 * 
 * Implements:
 * 1. 12,000+ morphing particles with Top-to-Bottom Y-Axis Sorting Rule (AGI Readiness standard).
 * 2. 5 Distinct 3D specimens:
 *    - 'brackets': </> Code Brackets
 *    - 'temple': Classical Sanctuary Temple
 *    - 'gears': Interlocking Mechanical Gears
 *    - 'dna': Double-Helix DNA with Rungs
 *    - 'eye': AGI Neural Eye / Focal Core with Orbital Rings
 * 3. Real-time cursor repulsion dynamics with elastic spring recovery.
 * 4. Khronos PBR Neutral tone mapping with zero highlight burnout.
 * 5. SunChips whole-canvas Flavour World palette synchronization.
 * 6. High-DPI 1440px+ desktop viewport sizing without clipping or scrollbars.
 */

import * as THREE from 'three';

const PARTICLE_COUNT = 12000;
let scene, camera, renderer, particlesMesh, particleGeometry;
let currentPositions, targetPositions, velocities, baseColors;
let activeSpecimenKey = 'brackets';
let isMorphing = false;
let morphProgress = 1.0;
let morphStartTime = 0;
const MORPH_DURATION = 1400; // ms

// Interactive pointer repulsion state
let mouseWorld = new THREE.Vector3(9999, 9999, 0);
let targetMouseWorld = new THREE.Vector3(9999, 9999, 0);
let isPointerOver = false;
let animFrameId = null;

// Palette definitions matching SunChips Flavour Worlds
const FLAVOUR_PALETTES = {
  'ember': {
    top: new THREE.Color(0xf97316),    // High-chroma Ember
    mid: new THREE.Color(0xffb35c),    // Sunburst Amber
    bot: new THREE.Color(0x38bdf8),    // Cobalt Accent
    glow: 0xf97316
  },
  'cobalt': {
    top: new THREE.Color(0x38bdf8),    // Sky Blue
    mid: new THREE.Color(0x0284c7),    // Electric Cobalt
    bot: new THREE.Color(0x7dd3fc),    // Ice Blue
    glow: 0x38bdf8
  },
  'harvest-gold': {
    top: new THREE.Color(0xfef08a),    // Warm Sand
    mid: new THREE.Color(0xeab308),    // Roasted Harvest Gold
    bot: new THREE.Color(0xca8a04),    // Dark Amber
    glow: 0xeab308
  },
  'cosmic-violet': {
    top: new THREE.Color(0xec4899),    // Neon Fuchsia
    mid: new THREE.Color(0x8b5cf6),    // Electric Violet
    bot: new THREE.Color(0xc084fc),    // Soft Lavender
    glow: 0x8b5cf6
  }
};

let currentFlavourKey = 'ember';

// ============================================================================
// MATHEMATICAL SPECIMEN GENERATORS (Deterministic Procedural Point Clouds)
// ============================================================================

/**
 * 1. Code Brackets: < / > (Developer Tooling & Precision Engineering)
 */
function generateBracketsPositions(count) {
  const points = [];
  const third = Math.floor(count / 3);

  // Left bracket: <
  for (let i = 0; i < third; i++) {
    const t = (i / third) * 2 - 1; // -1 to 1
    const x = -1.6 - Math.abs(t) * 0.7;
    const y = t * 1.6;
    const z = (Math.random() - 0.5) * 0.45;
    points.push({ x, y, z });
  }

  // Slash: /
  for (let i = 0; i < third; i++) {
    const t = (i / third) * 2 - 1; // -1 to 1
    const x = -t * 0.65;
    const y = t * 1.8;
    const z = (Math.random() - 0.5) * 0.45;
    points.push({ x, y, z });
  }

  // Right bracket: >
  const rem = count - third * 2;
  for (let i = 0; i < rem; i++) {
    const t = (i / rem) * 2 - 1; // -1 to 1
    const x = 1.6 + Math.abs(t) * 0.7;
    const y = t * 1.6;
    const z = (Math.random() - 0.5) * 0.45;
    points.push({ x, y, z });
  }

  return sortPointsByDescendingY(points);
}

/**
 * 2. Sanctuary Temple: Pediment, Columns & Stylobate Base
 */
function generateTemplePositions(count) {
  const points = [];
  const pedimentCount = Math.floor(count * 0.32);
  const columnsCount = Math.floor(count * 0.48);
  const baseCount = count - pedimentCount - columnsCount;

  // Triangular Pediment & Roof Architrave (Y: 0.9 to 2.1)
  for (let i = 0; i < pedimentCount; i++) {
    const u = Math.random();
    const v = Math.random();
    // Sample within triangle: apex at (0, 2.1), base corners at (-2.3, 1.0) and (2.3, 1.0)
    let px = (1 - Math.sqrt(u)) * 0 + Math.sqrt(u) * ((1 - v) * -2.3 + v * 2.3);
    let py = (1 - Math.sqrt(u)) * 2.1 + Math.sqrt(u) * 1.0;
    let pz = (Math.random() - 0.5) * 0.7;
    points.push({ x: px, y: py, z: pz });
  }

  // 4 Cylindrical Pillars (Y: -1.0 to 1.0)
  const columnXs = [-1.6, -0.55, 0.55, 1.6];
  const ptsPerCol = Math.floor(columnsCount / 4);
  for (let c = 0; c < 4; c++) {
    const colX = columnXs[c];
    for (let i = 0; i < ptsPerCol; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.22;
      const y = (Math.random() * 2.0) - 1.0;
      points.push({
        x: colX + Math.cos(theta) * r,
        y: y,
        z: Math.sin(theta) * r
      });
    }
  }

  // Stepped Stylobate Plinth Base (Y: -1.0 to -1.6)
  for (let i = 0; i < baseCount; i++) {
    const step = Math.floor(Math.random() * 3); // 3 step layers
    const stepWidth = 2.6 + step * 0.3;
    const x = (Math.random() - 0.5) * stepWidth;
    const y = -1.05 - step * 0.18;
    const z = (Math.random() - 0.5) * 0.9;
    points.push({ x, y, z });
  }

  return sortPointsByDescendingY(points);
}

/**
 * 3. Interlocking Mechanical Gears: Central Hub, Spokes & Radial Teeth
 */
function generateGearsPositions(count) {
  const points = [];
  const teethCount = 14;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const isTooth = (Math.sin(angle * teethCount) > 0.15);
    const maxR = isTooth ? 2.15 : 1.75;
    const rType = Math.random();

    let r;
    if (rType < 0.25) {
      // Inner Hub Ring
      r = 0.35 + Math.random() * 0.3;
    } else if (rType < 0.40) {
      // 6 Spokes
      const spokeAngle = Math.round(angle / (Math.PI / 3)) * (Math.PI / 3);
      r = 0.65 + Math.random() * 0.95;
      const offset = (Math.random() - 0.5) * 0.15;
      const x = Math.cos(spokeAngle) * r - Math.sin(spokeAngle) * offset;
      const y = Math.sin(spokeAngle) * r + Math.cos(spokeAngle) * offset;
      const z = (Math.random() - 0.5) * 0.45;
      points.push({ x, y, z });
      continue;
    } else {
      // Outer Gear Rim & Teeth
      r = 1.5 + Math.random() * (maxR - 1.5);
    }

    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    const z = (Math.random() - 0.5) * 0.45;
    points.push({ x, y, z });
  }

  return sortPointsByDescendingY(points);
}

/**
 * 4. Double-Helix DNA: Entwined Strands & Periodic Horizontal Rungs
 */
function generateDNAPositions(count) {
  const points = [];
  const rungsCount = Math.floor(count * 0.28);
  const strandCount = count - rungsCount;
  const ptsPerStrand = Math.floor(strandCount / 2);

  const turns = 3.5;
  const height = 4.2;
  const radius = 1.25;

  // Strand 1
  for (let i = 0; i < ptsPerStrand; i++) {
    const t = (i / ptsPerStrand) * height - (height / 2);
    const theta = (t / height) * Math.PI * 2 * turns;
    const spread = (Math.random() - 0.5) * 0.18;
    points.push({
      x: Math.cos(theta) * (radius + spread),
      y: t,
      z: Math.sin(theta) * (radius + spread)
    });
  }

  // Strand 2 (180 degree phase shift)
  const remStrand = strandCount - ptsPerStrand;
  for (let i = 0; i < remStrand; i++) {
    const t = (i / remStrand) * height - (height / 2);
    const theta = (t / height) * Math.PI * 2 * turns + Math.PI;
    const spread = (Math.random() - 0.5) * 0.18;
    points.push({
      x: Math.cos(theta) * (radius + spread),
      y: t,
      z: Math.sin(theta) * (radius + spread)
    });
  }

  // Base-Pair Rungs across the double-helix
  const numRungs = 24;
  const ptsPerRung = Math.floor(rungsCount / numRungs);
  for (let r = 0; r < numRungs; r++) {
    const t = (r / numRungs) * height - (height / 2);
    const theta = (t / height) * Math.PI * 2 * turns;
    const x1 = Math.cos(theta) * radius;
    const z1 = Math.sin(theta) * radius;
    const x2 = Math.cos(theta + Math.PI) * radius;
    const z2 = Math.sin(theta + Math.PI) * radius;

    for (let i = 0; i < ptsPerRung; i++) {
      const frac = Math.random();
      points.push({
        x: x1 + (x2 - x1) * frac + (Math.random() - 0.5) * 0.08,
        y: t + (Math.random() - 0.5) * 0.06,
        z: z1 + (z2 - z1) * frac + (Math.random() - 0.5) * 0.08
      });
    }
  }

  return sortPointsByDescendingY(points);
}

/**
 * 5. AGI Neural Eye: High-Density Pupil Core & Concentric Orbital Rings
 */
function generateEyePositions(count) {
  const points = [];
  const coreCount = Math.floor(count * 0.40);
  const ringsCount = count - coreCount;

  // Dense Spherical Neural Core
  for (let i = 0; i < coreCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = Math.cbrt(Math.random()) * 0.85;

    points.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi)
    });
  }

  // 3 Concentric Inclined Orbital Rings
  const ringTilts = [0.25, -0.45, 0.75];
  const ringRadii = [1.5, 2.05, 2.65];
  const ptsPerRing = Math.floor(ringsCount / 3);

  for (let r = 0; r < 3; r++) {
    const tilt = ringTilts[r];
    const rad = ringRadii[r];
    for (let i = 0; i < ptsPerRing; i++) {
      const theta = Math.random() * Math.PI * 2;
      const thickness = (Math.random() - 0.5) * 0.16;
      let x = Math.cos(theta) * (rad + thickness);
      let y = Math.sin(theta) * (rad + thickness) * Math.cos(tilt);
      let z = Math.sin(theta) * (rad + thickness) * Math.sin(tilt);
      points.push({ x, y, z });
    }
  }

  return sortPointsByDescendingY(points);
}

/**
 * STRICT TOP-TO-BOTTOM Y-AXIS POINT SORTING RULE
 * Enforces descending Y-axis vertex ordering to guarantee that
 * wave cascades, color gradients, and morph transitions flow seamlessly.
 */
function sortPointsByDescendingY(points) {
  points.sort((a, b) => b.y - a.y);
  const arr = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    arr[i * 3] = points[i].x;
    arr[i * 3 + 1] = points[i].y;
    arr[i * 3 + 2] = points[i].z;
  }
  return arr;
}

// ============================================================================
// PARTICLE TEXTURE GENERATOR
// ============================================================================
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.6, 'rgba(249, 115, 22, 0.6)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ============================================================================
// COLOR GRADIENT RE-CALCULATION
// ============================================================================
function updateColorsForPalette(flavourKey) {
  if (!particleGeometry) return;
  const pal = FLAVOUR_PALETTES[flavourKey] || FLAVOUR_PALETTES.ember;
  const colorsAttr = particleGeometry.attributes.color;
  const posAttr = particleGeometry.attributes.position;
  if (!colorsAttr || !posAttr) return;

  let minY = -2.0;
  let maxY = 2.0;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const y = posAttr.getY(i);
    const normY = THREE.MathUtils.clamp((y - minY) / (maxY - minY), 0, 1);

    const c = new THREE.Color();
    if (normY > 0.5) {
      c.copy(pal.mid).lerp(pal.top, (normY - 0.5) * 2.0);
    } else {
      c.copy(pal.bot).lerp(pal.mid, normY * 2.0);
    }

    colorsAttr.setXYZ(i, c.r, c.g, c.b);
  }

  colorsAttr.needsUpdate = true;
}

// ============================================================================
// SPECIMEN MORPHING PIPELINE
// ============================================================================
export function morphToSpecimen(specimenKey) {
  if (specimenKey === activeSpecimenKey && !isMorphing) return;
  activeSpecimenKey = specimenKey;

  let newTargets;
  switch (specimenKey) {
    case 'temple':
      newTargets = generateTemplePositions(PARTICLE_COUNT);
      break;
    case 'gears':
      newTargets = generateGearsPositions(PARTICLE_COUNT);
      break;
    case 'dna':
      newTargets = generateDNAPositions(PARTICLE_COUNT);
      break;
    case 'eye':
      newTargets = generateEyePositions(PARTICLE_COUNT);
      break;
    case 'brackets':
    default:
      newTargets = generateBracketsPositions(PARTICLE_COUNT);
      break;
  }

  targetPositions.set(newTargets);
  isMorphing = true;
  morphStartTime = performance.now();

  // Update UI Pills
  const pills = document.querySelectorAll('.specimen-pill[data-specimen]');
  pills.forEach(pill => {
    if (pill.getAttribute('data-specimen') === specimenKey) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

// ============================================================================
// INITIALIZATION & LIFECYCLE
// ============================================================================
export function initHero3DSpecimens() {
  const container = document.getElementById('hero-3d-canvas-container');
  if (!container || typeof THREE === 'undefined') {
    return;
  }

  // Prevent duplicate canvas creation
  if (renderer && container.contains(renderer.domElement)) {
    return;
  }

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || (window.innerHeight - 120);

  // 1. Scene & Camera setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  // 2. WebGLRenderer with Khronos PBR Neutral Tone Mapping (Streak Standard)
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  // Preserve screen reader description
  const srDescription = container.querySelector('.sr-only');
  container.innerHTML = '';
  if (srDescription) container.appendChild(srDescription);
  container.appendChild(renderer.domElement);

  // 3. BufferGeometry Allocation
  currentPositions = new Float32Array(PARTICLE_COUNT * 3);
  targetPositions = new Float32Array(PARTICLE_COUNT * 3);
  velocities = new Float32Array(PARTICLE_COUNT * 3);
  baseColors = new Float32Array(PARTICLE_COUNT * 3);

  // Initial shape: < / > brackets
  const initialPoints = generateBracketsPositions(PARTICLE_COUNT);
  currentPositions.set(initialPoints);
  targetPositions.set(initialPoints);

  particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(baseColors, 3));

  // Initialize colors
  updateColorsForPalette(currentFlavourKey);

  // 4. Points Material
  const texture = createParticleTexture();
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.046,
    vertexColors: true,
    map: texture,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particlesMesh);

  // 5. Specimen Selector Pills Wiring
  const pills = document.querySelectorAll('.specimen-pill[data-specimen]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const spec = pill.getAttribute('data-specimen');
      if (spec) morphToSpecimen(spec);
    });
  });

  // 6. Navigation CTA Smooth Routing
  const councilCta = document.getElementById('hero-council-cta');
  const blenderCta = document.getElementById('hero-blender-cta');
  const deckCta = document.getElementById('hero-deck-cta');

  if (councilCta) {
    councilCta.addEventListener('click', () => {
      const councilTab = document.getElementById('tab-council');
      if (councilTab) councilTab.click();
      const sec = document.getElementById('section-council');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (blenderCta) {
    blenderCta.addEventListener('click', () => {
      const blenderTab = document.getElementById('tab-blender');
      if (blenderTab) blenderTab.click();
      const sec = document.getElementById('section-blender');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (deckCta) {
    deckCta.addEventListener('click', () => {
      if (typeof window.togglePresenterMode === 'function') {
        window.togglePresenterMode();
      }
    });
  }

  // 7. Cursor Pointer Interaction with Unprojected Raycasting
  const heroViewport = document.getElementById('hero-viewport');
  const raycaster = new THREE.Raycaster();
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ndc = new THREE.Vector2();

  function onPointerMove(e) {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(ndc, camera);
    const intersectPt = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, intersectPt);

    if (intersectPt) {
      targetMouseWorld.copy(intersectPt);
      isPointerOver = true;
    }
  }

  function onPointerLeave() {
    isPointerOver = false;
    targetMouseWorld.set(9999, 9999, 0);
  }

  if (heroViewport) {
    heroViewport.addEventListener('pointermove', onPointerMove, { passive: true });
    heroViewport.addEventListener('pointerleave', onPointerLeave);
  }

  // 8. Flavour Synchronization Registration
  window.updateParticlePalette = (flavourKey) => {
    currentFlavourKey = flavourKey;
    updateColorsForPalette(flavourKey);
  };

  // 9. Window Resize Handling (Desktop 1440px+ High-DPI Adaptation)
  function onResize() {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  window.addEventListener('resize', onResize);

  // 10. Animation & Physics Tick Loop
  let lastTime = performance.now();

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    // Smooth lerp mouse coordinates
    mouseWorld.lerp(targetMouseWorld, 0.12);

    // Continuous slow majestic rotation
    if (particlesMesh) {
      particlesMesh.rotation.y += 0.0035;
      particlesMesh.rotation.x = Math.sin(now * 0.0006) * 0.08;
    }

    const pos = particleGeometry.attributes.position;
    const repulseRadius = 1.4;
    const repulseForce = 18.0;
    const springDamping = 0.88;
    const springStiffness = 0.06;

    // Morph progress calculation
    let morphAlpha = 1.0;
    if (isMorphing) {
      const elapsed = now - morphStartTime;
      morphAlpha = Math.min(elapsed / MORPH_DURATION, 1.0);
      if (morphAlpha >= 1.0) {
        isMorphing = false;
      }
    }

    // Update individual particle physics
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      let px = currentPositions[idx];
      let py = currentPositions[idx + 1];
      let pz = currentPositions[idx + 2];

      const tx = targetPositions[idx];
      const ty = targetPositions[idx + 1];
      const tz = targetPositions[idx + 2];

      // Vertical delay cascade during morphing (top-to-bottom wave)
      const normY = THREE.MathUtils.clamp((py + 2.0) / 4.0, 0, 1);
      const staggeredProgress = THREE.MathUtils.clamp((morphAlpha - (1 - normY) * 0.25) / 0.75, 0, 1);
      // Smooth cubic ease-out
      const easeAlpha = 1 - Math.pow(1 - staggeredProgress, 3);

      const targetX = px + (tx - px) * (isMorphing ? easeAlpha * 0.15 : 0.08);
      const targetY = py + (ty - py) * (isMorphing ? easeAlpha * 0.15 : 0.08);
      const targetZ = pz + (tz - pz) * (isMorphing ? easeAlpha * 0.15 : 0.08);

      // Cursor Repulsion Dynamics
      let vx = velocities[idx];
      let vy = velocities[idx + 1];
      let vz = velocities[idx + 2];

      if (isPointerOver) {
        const dx = px - mouseWorld.x;
        const dy = py - mouseWorld.y;
        const dz = pz - mouseWorld.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < repulseRadius * repulseRadius && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const force = (1.0 - (dist / repulseRadius)) * repulseForce;
          vx += (dx / dist) * force * dt;
          vy += (dy / dist) * force * dt;
          vz += (dz / dist) * force * dt * 0.5;
        }
      }

      // Elastic Spring force toward target position
      vx += (targetX - px) * springStiffness;
      vy += (targetY - py) * springStiffness;
      vz += (targetZ - pz) * springStiffness;

      // Velocity damping
      vx *= springDamping;
      vy *= springDamping;
      vz *= springDamping;

      velocities[idx] = vx;
      velocities[idx + 1] = vy;
      velocities[idx + 2] = vz;

      px += vx;
      py += vy;
      pz += vz;

      currentPositions[idx] = px;
      currentPositions[idx + 1] = py;
      currentPositions[idx + 2] = pz;
    }

    pos.needsUpdate = true;

    // Render frame
    renderer.render(scene, camera);
  }

  animate();
}

export { initHero3DSpecimens as initHero3DStage };

