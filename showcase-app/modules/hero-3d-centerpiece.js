/**
 * Hero 3D Centerpiece - Sculptural 3D WebGL PBR Engine
 * Creative Engineering & Skills Encyclopedia (2026 Edition)
 * Architecture: LeulTew // NVIDIA RTX 5070 Ti // Three.js r170+
 *
 * Implements:
 * 1. Awwwards-caliber WebGL 3D Glass Sculpture in Three.js r170+:
 *    - Base Geometries: Superquadric Torus Knot, Gyroid Manifold Core, and Sculptural Ribbon
 *    - Physically Based Transmission Material (MeshPhysicalMaterial):
 *      * transmission: 0.92, roughness: 0.08, ior: 1.52, thickness: 1.2
 *      * clearcoat: 1.0, clearcoatRoughness: 0.04
 *      * color: 0xffffff, attenuationColor: 0x38bdf8, attenuationDistance: 2.5
 * 2. Dual Interior/Exterior Caustic Lighting Rig:
 *    - Sunset Amber (#f59e0b) Interior Point Light inside glass cavity
 *    - Electric Sapphire (#38bdf8) Exterior Orbiting Point Light
 *    - Studio Rim Light & Ambient Fill for crisp specular caustics
 *    - Khronos PBR Neutral Tone Mapping (NeutralToneMapping) with 1.05 exposure & sRGB color space
 * 3. Interaction & Inertial Motion:
 *    - Damped mouse/pointer tracking: lerp(currentRotation, targetRotation, 0.05)
 *    - Smooth continuous ambient rotation when idle
 *    - Elastic spring scale morph during geometry switching
 * 4. SunChips Whole-Canvas Flavour World Palette Synchronization:
 *    - Dynamic chromatic cross-fading via updateParticlePalette(flavourKey)
 *    - Smooth lerp interpolation across Ember, Cobalt, Harvest Gold, and Cosmic Violet
 */

import * as THREE from 'three';

// Safe Three.js instance resolver
const _THREE = (typeof THREE !== 'undefined' && THREE.Scene)
  ? THREE
  : (typeof window !== 'undefined' && window.THREE ? window.THREE : THREE);

// ============================================================================
// PALETTES & FLAVOUR WORLDS
// ============================================================================

export const FLAVOUR_PALETTES = {
  'ember': {
    name: 'Ember Glow',
    glassAttenuation: 0xf97316, // High-Chroma Ember
    glassColor: 0xffffff,
    interiorLight: 0xf59e0b,    // Sunset Amber
    exteriorLight: 0x38bdf8,    // Electric Sapphire accent
    coreEmissive: 0xf59e0b,
    rimLight: 0xffedd5
  },
  'cobalt': {
    name: 'Electric Cobalt',
    glassAttenuation: 0x38bdf8, // Electric Sapphire
    glassColor: 0xf0f9ff,
    interiorLight: 0x0284c7,    // Deep Cobalt
    exteriorLight: 0x38bdf8,    // Sapphire Sky
    coreEmissive: 0x38bdf8,
    rimLight: 0xbae6fd
  },
  'harvest-gold': {
    name: 'Harvest Gold',
    glassAttenuation: 0xeab308, // Roasted Gold
    glassColor: 0xfefce8,
    interiorLight: 0xfde047,    // Warm Sand Gold
    exteriorLight: 0xca8a04,    // Deep Umber Gold
    coreEmissive: 0xfacc15,
    rimLight: 0xfef08a
  },
  'cosmic-violet': {
    name: 'Cosmic Violet',
    glassAttenuation: 0xec4899, // Neon Fuchsia
    glassColor: 0xfdf4ff,
    interiorLight: 0x8b5cf6,    // Electric Violet
    exteriorLight: 0xec4899,    // Cosmic Fuchsia
    coreEmissive: 0xa855f7,
    rimLight: 0xf5d0fe
  }
};

// Aliases for user convenience and compatibility
FLAVOUR_PALETTES['harvest'] = FLAVOUR_PALETTES['harvest-gold'];
FLAVOUR_PALETTES['cosmic'] = FLAVOUR_PALETTES['cosmic-violet'];

// ============================================================================
// PROCEDURAL GEOMETRY FACTORIES
// ============================================================================

/**
 * 1. Superquadric Torus Knot (Primary Hero Sculpture)
 * Mathematical knot curve with smooth high-density radial tesselation
 */
function createTorusKnotGeometry() {
  const geo = new _THREE.TorusKnotGeometry(1.1, 0.38, 200, 48, 2, 3);
  geo.computeVertexNormals();
  return geo;
}

/**
 * 2. Gyroid Manifold Core (Icosahedron with harmonic trigonometric gyroid displacement)
 * Nodal equation: sin(x)*cos(y) + sin(y)*cos(z) + sin(z)*cos(x)
 */
function createGyroidGeometry() {
  const geo = new _THREE.IcosahedronGeometry(1.22, 16);
  const pos = geo.attributes.position;
  const v = new _THREE.Vector3();
  const scale = 2.8;
  const amplitude = 0.22;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const gx = v.x * scale;
    const gy = v.y * scale;
    const gz = v.z * scale;
    const gyroid = Math.sin(gx) * Math.cos(gy) + Math.sin(gy) * Math.cos(gz) + Math.sin(gz) * Math.cos(gx);
    const normal = v.clone().normalize();
    v.addScaledVector(normal, gyroid * amplitude);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * 3. Sculptural Ribbon (Cinqfoil knot ribbon curve with slender profile)
 */
function createRibbonGeometry() {
  const geo = new _THREE.TorusKnotGeometry(1.25, 0.19, 240, 48, 3, 5);
  geo.computeVertexNormals();
  return geo;
}

/**
 * 4. Internal Refraction Caustic Core (Luminous faceted jewel)
 */
function createInternalCoreGeometry() {
  const geo = new _THREE.IcosahedronGeometry(0.38, 2);
  geo.computeVertexNormals();
  return geo;
}

// ============================================================================
// STAGE SINGLETON STATE
// ============================================================================

let containerEl = null;
let scene = null;
let camera = null;
let renderer = null;
let animFrameId = null;
let resizeObserver = null;
let isInitialized = false;

// Meshes & Groups
let sculptureGroup = null;
let glassMesh = null;
let coreMesh = null;
let currentGeometryKey = 'torus';

// Lighting Rig
let lightInterior = null; // Sunset Amber point light
let lightExterior = null; // Electric Sapphire point light
let lightRim = null;      // Specular rim light
let lightAmbient = null;  // Subtle ambient fill

// Materials
let glassMaterial = null;
let coreMaterial = null;

// Dynamic Colors (Lerp Targets)
const currentAttenuationColor = new _THREE.Color(0x38bdf8);
const targetAttenuationColor = new _THREE.Color(0x38bdf8);

const currentInteriorColor = new _THREE.Color(0xf59e0b);
const targetInteriorColor = new _THREE.Color(0xf59e0b);

const currentExteriorColor = new _THREE.Color(0x38bdf8);
const targetExteriorColor = new _THREE.Color(0x38bdf8);

const currentCoreColor = new _THREE.Color(0xf59e0b);
const targetCoreColor = new _THREE.Color(0xf59e0b);

// Interaction & Inertia State
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let ambientRotationX = 0;
let ambientRotationY = 0;

const AMBIENT_SPEED_X = 0.0012;
const AMBIENT_SPEED_Y = 0.0035;
let isPointerOver = false;
let lastPointerTime = 0;

// Morph / Geometry Switch Animation State
let isSwitchingGeometry = false;
let switchStartTime = 0;
let switchDuration = 480; // ms
let pendingGeometryKey = null;
let switchPhase = 'out'; // 'out' | 'in'

// Accessibility
let prefersReducedMotion = false;

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function checkReducedMotion() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}

function handlePointerMove(e) {
  if (!containerEl || prefersReducedMotion) return;

  isPointerOver = true;
  lastPointerTime = performance.now();

  const rect = containerEl.getBoundingClientRect();
  const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
  const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

  const ndcX = ((clientX - rect.left) / (rect.width || 1)) * 2 - 1;
  const ndcY = -(((clientY - rect.top) / (rect.height || 1)) * 2 - 1);

  // Damped pointer targets (pitch and yaw)
  targetRotationY = ndcX * 0.85;
  targetRotationX = -ndcY * 0.65;
}

function handlePointerEnter() {
  isPointerOver = true;
  lastPointerTime = performance.now();
}

function handlePointerLeave() {
  isPointerOver = false;
}

function handlePillClick(e) {
  const btn = e.target.closest('[data-specimen], [data-geometry]');
  if (!btn) return;

  const geoKey = btn.getAttribute('data-geometry') || btn.getAttribute('data-specimen');
  if (geoKey) {
    switchGeometry(geoKey);
  }
}

function setupEventListeners() {
  if (typeof window === 'undefined') return;

  checkReducedMotion();
  if (window.matchMedia) {
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkReducedMotion);
  }

  // Pointer tracking across hero section and window for smooth inertia
  const heroSection = document.getElementById('hero-viewport') || containerEl;
  if (heroSection) {
    heroSection.addEventListener('pointermove', handlePointerMove, { passive: true });
    heroSection.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    heroSection.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    heroSection.addEventListener('touchmove', handlePointerMove, { passive: true });
  }

  // Wire interactive specimen and geometry buttons in the DOM
  document.addEventListener('click', handlePillClick);
}

function removeEventListeners() {
  if (typeof window === 'undefined') return;

  const heroSection = document.getElementById('hero-viewport') || containerEl;
  if (heroSection) {
    heroSection.removeEventListener('pointermove', handlePointerMove);
    heroSection.removeEventListener('pointerenter', handlePointerEnter);
    heroSection.removeEventListener('pointerleave', handlePointerLeave);
    heroSection.removeEventListener('touchmove', handlePointerMove);
  }
  document.removeEventListener('click', handlePillClick);
  if (window.matchMedia) {
    window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', checkReducedMotion);
  }
}

// ============================================================================
// GEOMETRY SWITCHING & MORPH LOGIC
// ============================================================================

export function switchGeometry(key) {
  if (!key || !glassMesh) return;

  // Normalize key
  let normalizedKey = 'torus';
  const lKey = key.toLowerCase();

  if (lKey === 'torus' || lKey === 'torusknot' || lKey === 'brackets') {
    normalizedKey = 'torus';
  } else if (lKey === 'gyroid' || lKey === 'core' || lKey === 'temple' || lKey === 'eye') {
    normalizedKey = 'gyroid';
  } else if (lKey === 'ribbon' || lKey === 'gears' || lKey === 'dna') {
    normalizedKey = 'ribbon';
  }

  if (normalizedKey === currentGeometryKey && !isSwitchingGeometry) {
    return;
  }

  // Trigger smooth scale down -> swap -> scale up transition
  lastPointerTime = performance.now();
  pendingGeometryKey = normalizedKey;
  isSwitchingGeometry = true;
  switchStartTime = performance.now();
  switchPhase = 'out';

  // Update active status on UI pills
  updatePillUI(key);
}

// Backwards-compatible alias
export const morphToSpecimen = switchGeometry;
export const setSpecimen = switchGeometry;

function updatePillUI(activeKey) {
  if (typeof document === 'undefined') return;

  const pills = document.querySelectorAll('.specimen-pill[data-specimen], button[data-geometry]');
  pills.forEach(pill => {
    const spec = pill.getAttribute('data-specimen') || pill.getAttribute('data-geometry');
    const isMatch = (spec === activeKey) ||
      (activeKey === 'torus' && spec === 'brackets') ||
      (activeKey === 'gyroid' && (spec === 'temple' || spec === 'eye')) ||
      (activeKey === 'ribbon' && (spec === 'gears' || spec === 'dna'));

    if (isMatch) {
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      pill.setAttribute('aria-pressed', 'true');
    } else {
      pill.classList.remove('active');
      pill.removeAttribute('aria-selected');
      pill.setAttribute('aria-pressed', 'false');
    }
  });

  // Update tech readout text if element exists
  const techReadout = document.querySelector('.hero-tech-readout');
  if (techReadout) {
    const geoLabels = {
      'torus': 'Superquadric Torus Knot · WebGL PBR Glass · Dual Caustics',
      'gyroid': 'Gyroid Manifold Core · Refractive Dispersion · Live Three.js r170+',
      'ribbon': 'Sculptural Ribbon · Optical Transmission 0.92 · Neutral Tone Mapping'
    };
    techReadout.textContent = geoLabels[pendingGeometryKey || currentGeometryKey] || geoLabels['torus'];
  }
}

function applyNewGeometry(key) {
  if (!glassMesh) return;

  const oldGeo = glassMesh.geometry;
  let newGeo;

  if (key === 'gyroid') {
    newGeo = createGyroidGeometry();
  } else if (key === 'ribbon') {
    newGeo = createRibbonGeometry();
  } else {
    newGeo = createTorusKnotGeometry();
  }

  glassMesh.geometry = newGeo;
  if (oldGeo) oldGeo.dispose();
  currentGeometryKey = key;
}

// ============================================================================
// DYNAMIC FLAVOUR PALETTE SYNCHRONIZATION
// ============================================================================

export function updateParticlePalette(flavourKey) {
  const normKey = (flavourKey || 'ember').toLowerCase();
  const palette = FLAVOUR_PALETTES[normKey] || FLAVOUR_PALETTES['ember'];

  targetAttenuationColor.set(palette.glassAttenuation);
  targetInteriorColor.set(palette.interiorLight);
  targetExteriorColor.set(palette.exteriorLight);
  targetCoreColor.set(palette.coreEmissive);

  if (lightRim && palette.rimLight) {
    lightRim.color.set(palette.rimLight);
  }
}

// Backwards-compatible alias
export const setCenterpiecePalette = updateParticlePalette;

// ============================================================================
// RENDER LOOP & INERTIAL PHYSICS (WITH INTERSECTION OBSERVER THROTTLING)
// ============================================================================

let isPaused = false;
let heroIntersectionObserver = null;

export function pauseHero3D() {
  isPaused = true;
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

export function resumeHero3D() {
  if (!isPaused && animFrameId) return;
  isPaused = false;
  if (isInitialized && renderer && scene && camera && sculptureGroup) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(renderLoop);
  }
}

function renderLoop(time) {
  if (isPaused || (typeof document !== 'undefined' && document.hidden)) return;
  animFrameId = requestAnimationFrame(renderLoop);

  if (!renderer || !scene || !camera || !sculptureGroup) return;

  const now = performance.now();

  // 1. Damped Mouse/Pointer Tracking & Inertia (lerp 0.05) with WCAG 2.2.2 Idle Rest
  // Continuous ambient drift automatically pauses after 2,500ms of user inactivity
  const isIdle = !isPointerOver && !isSwitchingGeometry && (now - lastPointerTime > 2500);
  const driftVelocityFactor = (prefersReducedMotion || isIdle)
    ? Math.max(0, 1.0 - (now - lastPointerTime - 2500) / 1000)
    : 1.0;

  if (!prefersReducedMotion) {
    currentRotationX += (targetRotationX - currentRotationX) * 0.05;
    currentRotationY += (targetRotationY - currentRotationY) * 0.05;

    // Ambient Continuous Rotation with smooth idle rest
    ambientRotationY += AMBIENT_SPEED_Y * driftVelocityFactor;
    ambientRotationX += AMBIENT_SPEED_X * driftVelocityFactor;

    // Gradual decay of interactive pointer offset when idle for > 2.0s
    if (!isPointerOver && (now - lastPointerTime > 2000)) {
      targetRotationX *= 0.97;
      targetRotationY *= 0.97;
    }
  }

  sculptureGroup.rotation.x = currentRotationX + ambientRotationX;
  sculptureGroup.rotation.y = currentRotationY + ambientRotationY;
  sculptureGroup.rotation.z = Math.sin(time * 0.0006) * 0.05 * driftVelocityFactor;

  // 2. Geometry Switch Scale Animation
  if (isSwitchingGeometry) {
    const elapsed = now - switchStartTime;
    const progress = Math.min(1.0, elapsed / (switchDuration * 0.5));

    if (switchPhase === 'out') {
      // Scale down with slight spin
      const scale = 1.0 - Math.sin(progress * (Math.PI / 2)) * 0.92;
      sculptureGroup.scale.setScalar(Math.max(0.08, scale));
      sculptureGroup.rotation.y += progress * 0.08;

      if (progress >= 1.0) {
        applyNewGeometry(pendingGeometryKey);
        switchPhase = 'in';
        switchStartTime = performance.now();
      }
    } else if (switchPhase === 'in') {
      // Elastic spring back to 1.0
      const inProgress = Math.min(1.0, (now - switchStartTime) / (switchDuration * 0.5));
      // Overshoot spring curve
      const p = inProgress;
      const overshoot = Math.sin(p * Math.PI * 0.5) + Math.sin(p * Math.PI) * 0.12;
      const scale = 0.08 + overshoot * 0.92;
      sculptureGroup.scale.setScalar(scale);

      if (inProgress >= 1.0) {
        sculptureGroup.scale.setScalar(1.0);
        isSwitchingGeometry = false;
      }
    }
  }

  // 3. Smooth Dynamic Color Lerp across Flavour Palettes
  currentAttenuationColor.lerp(targetAttenuationColor, 0.04);
  currentInteriorColor.lerp(targetInteriorColor, 0.04);
  currentExteriorColor.lerp(targetExteriorColor, 0.04);
  currentCoreColor.lerp(targetCoreColor, 0.04);

  if (glassMaterial) {
    glassMaterial.attenuationColor.copy(currentAttenuationColor);
  }
  if (lightInterior) {
    lightInterior.color.copy(currentInteriorColor);
    // Subtle internal orbit through the glass cavity
    const tSec = time * 0.001;
    lightInterior.position.set(
      Math.sin(tSec * 1.2) * 0.35,
      Math.cos(tSec * 1.4) * 0.35,
      Math.sin(tSec * 0.9) * 0.25
    );
  }
  if (lightExterior) {
    lightExterior.color.copy(currentExteriorColor);
    // Exterior orbiting caustics light
    const tSec = time * 0.0008;
    lightExterior.position.set(
      Math.cos(tSec) * 3.2,
      Math.sin(tSec * 0.8) * 2.0 + 0.4,
      Math.sin(tSec) * 3.2
    );
  }
  if (coreMaterial) {
    coreMaterial.emissive.copy(currentCoreColor);
  }
  if (coreMesh) {
    // Reverse counter-rotation for internal jewel core with WCAG 2.2.2 idle rest
    coreMesh.rotation.y -= 0.015 * driftVelocityFactor;
    coreMesh.rotation.x += 0.008 * driftVelocityFactor;
  }

  // 4. Render Scene with Khronos PBR Neutral Tone Mapping
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

  // Idempotent re-entrance guard
  if (isInitialized && renderer && camera) {
    const w = containerEl.clientWidth || 800;
    const h = containerEl.clientHeight || 540;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    return;
  }

  // Viewport Dimensions
  const width = containerEl.clientWidth || window.innerWidth || 800;
  const height = containerEl.clientHeight || 540;

  // 1. Scene & Camera Setup
  scene = new _THREE.Scene();
  camera = new _THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 4.4);

  // 2. High-Performance WebGL Renderer with Khronos Neutral Tone Mapping
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  renderer = new _THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2.0));

  // Strict Tone Mapping & Color Space Configuration
  renderer.toneMapping = _THREE.NeutralToneMapping || _THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = _THREE.SRGBColorSpace;

  // Mount canvas into container while preserving accessibility text
  const srText = containerEl.querySelector('p.sr-only');
  containerEl.innerHTML = '';
  if (srText) containerEl.appendChild(srText);

  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.outline = 'none';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  containerEl.appendChild(renderer.domElement);

  // 3. Dual Interior/Exterior Caustic Lighting Rig
  // A. Interior Point Light (Sunset Amber #f59e0b) - sits inside glass core
  lightInterior = new _THREE.PointLight(0xf59e0b, 4.8, 8.0, 2.0);
  lightInterior.position.set(0, 0, 0);
  scene.add(lightInterior);

  // B. Exterior Orbiting Point Light (Electric Sapphire #38bdf8)
  lightExterior = new _THREE.PointLight(0x38bdf8, 4.2, 12.0, 2.0);
  lightExterior.position.set(-2.8, 1.8, 2.5);
  scene.add(lightExterior);

  // C. Directional Rim Light for Crisp Specular Caustic Highlights
  lightRim = new _THREE.DirectionalLight(0xffedd5, 1.4);
  lightRim.position.set(3.5, 4.5, 3.0);
  scene.add(lightRim);

  // D. Soft Ambient Light for Shadow Detail
  lightAmbient = new _THREE.AmbientLight(0x0a101d, 0.85);
  scene.add(lightAmbient);

  // 4. Physical Acrylic Glass Sculpture Assembly
  sculptureGroup = new _THREE.Group();
  scene.add(sculptureGroup);

  // Awwwards-Caliber MeshPhysicalMaterial
  glassMaterial = new _THREE.MeshPhysicalMaterial({
    transmission: 0.92,
    roughness: 0.08,
    ior: 1.52,
    thickness: 1.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    color: 0xffffff,
    attenuationColor: 0x38bdf8,
    attenuationDistance: 2.5,
    reflectivity: 0.9,
    specularIntensity: 1.0,
    specularColor: 0xffffff,
    transparent: true,
    side: _THREE.DoubleSide
  });

  const baseGeometry = createTorusKnotGeometry();
  glassMesh = new _THREE.Mesh(baseGeometry, glassMaterial);
  glassMesh.castShadow = true;
  glassMesh.receiveShadow = true;
  sculptureGroup.add(glassMesh);

  // Luminous Refractive Internal Core
  coreMaterial = new _THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xf59e0b,
    emissiveIntensity: 2.2,
    roughness: 0.25,
    metalness: 0.85,
    wireframe: true
  });
  const coreGeometry = createInternalCoreGeometry();
  coreMesh = new _THREE.Mesh(coreGeometry, coreMaterial);
  sculptureGroup.add(coreMesh);

  // Synchronize initial palette with DOM body data-flavour
  const initialFlavour = document.body.getAttribute('data-flavour') || 'ember';
  updateParticlePalette(initialFlavour);

  // 5. Interaction & Responsive Observers
  setupEventListeners();

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

  // 6. Launch Render Loop with IntersectionObserver & Visibility Listener
  if (typeof IntersectionObserver !== 'undefined' && containerEl) {
    if (heroIntersectionObserver) heroIntersectionObserver.disconnect();
    heroIntersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !(typeof document !== 'undefined' && document.hidden)) {
          resumeHero3D();
        } else {
          pauseHero3D();
        }
      });
    }, { threshold: 0.05 });
    heroIntersectionObserver.observe(containerEl);
  }

  function handleHeroVisibilityChange() {
    if (typeof document === 'undefined') return;
    if (document.hidden) {
      pauseHero3D();
    } else if (containerEl) {
      const rect = containerEl.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        resumeHero3D();
      }
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleHeroVisibilityChange);
  }

  isPaused = false;
  lastPointerTime = performance.now();
  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = requestAnimationFrame(renderLoop);
}

// Backwards compatibility alias
export const initHero3DSpecimens = initHero3DStage;

// ============================================================================
// DISPOSAL & CLEANUP
// ============================================================================

export function disposeHero3DStage() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  removeEventListeners();

  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleHeroVisibilityChange);
  }

  if (resizeObserver && containerEl) {
    resizeObserver.unobserve(containerEl);
    resizeObserver = null;
  }

  if (heroIntersectionObserver) {
    heroIntersectionObserver.disconnect();
    heroIntersectionObserver = null;
  }

  if (glassMesh) {
    if (glassMesh.geometry) glassMesh.geometry.dispose();
    glassMesh = null;
  }

  if (coreMesh) {
    if (coreMesh.geometry) coreMesh.geometry.dispose();
    coreMesh = null;
  }

  if (glassMaterial) {
    glassMaterial.dispose();
    glassMaterial = null;
  }

  if (coreMaterial) {
    coreMaterial.dispose();
    coreMaterial = null;
  }

  if (lightInterior && scene) scene.remove(lightInterior);
  if (lightExterior && scene) scene.remove(lightExterior);
  if (lightRim && scene) scene.remove(lightRim);
  if (lightAmbient && scene) scene.remove(lightAmbient);

  if (renderer) {
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    const gl = renderer.getContext();
    if (gl) {
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
    renderer.dispose();
    renderer = null;
  }

  scene = null;
  camera = null;
  sculptureGroup = null;
  isInitialized = false;
}

// ============================================================================
// WINDOW REGISTRATIONS & AUTO-MOUNTING
// ============================================================================

if (typeof window !== 'undefined') {
  window.initHero3DStage = initHero3DStage;
  window.initHero3DSpecimens = initHero3DStage;
  window.disposeHero3DStage = disposeHero3DStage;
  window.switchHeroGeometry = switchGeometry;
  window.morphToSpecimen = switchGeometry;
  window.setSpecimen = switchGeometry;
  window.updateParticlePalette = updateParticlePalette;
  window.setCenterpiecePalette = updateParticlePalette;

  // Auto-mount if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHero3DStage();
    });
  } else {
    setTimeout(() => {
      initHero3DStage();
    }, 0);
  }
}
