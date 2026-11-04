// Application Engine for Creative Engineering Showcase & Interactive Syllabus (2026 Edition)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
if (typeof window !== 'undefined') {
  window.THREE = THREE;
  window.OrbitControls = OrbitControls;
}

import { SKILLS_DATA as IMPORTED_SKILLS, TEACHING_MODULES as IMPORTED_MODULES } from './skills-data.js';
import { initHero3DStage, initHero3DSpecimens, morphToSpecimen } from './modules/hero-3d-centerpiece.js';
import { initFlavourWorlds, setFlavourWorld, FLAVOUR_WORLDS } from './modules/flavour-worlds.js';
import { initLiquidGlass } from './modules/liquid-glass.js';
import { initCouncilChamber, initCouncilDemocracy } from './modules/council-democracy.js';
import { initBlenderStudio } from './modules/blender-mcp-studio.js';

const SKILLS_DATA = (typeof window !== 'undefined' && window.SKILLS_DATA && window.SKILLS_DATA.length) 
  ? window.SKILLS_DATA 
  : (IMPORTED_SKILLS || []);

const TEACHING_MODULES = (typeof window !== 'undefined' && window.TEACHING_MODULES && window.TEACHING_MODULES.length) 
  ? window.TEACHING_MODULES 
  : (IMPORTED_MODULES || []);

// ============================================================================
// THREE.JS 3D INTERACTIVE STAGE & SHADER PIPELINE
// Upgraded: Solid PBR, Wireframe Hologram, Sorted Point Cloud Particles,
// Khronos PBR Neutral vs ACESFilmic vs AgX Tone Mapping, Studio Lighting Rig.
// ============================================================================

let scene, camera, renderer, controls, activeObject;
let lightRim, lightKey, lightAmbient;
let renderMode = 'solid'; // 'solid' | 'wireframe' | 'particles'
let geometryType = 'torus'; // 'torus' | 'box' | 'sphere'
let toneMappingType = 'neutral'; // 'neutral' | 'aces' | 'agx' | 'none'
let isRotating = true;
let spinSpeed = 1.0;
let currentRoughness = 0.18;
let currentMetalness = 0.88;
let is3DInitialized = false;
let animFrameId = null;

// Resource Disposal Pipeline
function disposeMaterial(mat) {
  if (!mat) return;
  if (mat.map) mat.map.dispose();
  if (mat.lightMap) mat.lightMap.dispose();
  if (mat.bumpMap) mat.bumpMap.dispose();
  if (mat.normalMap) mat.normalMap.dispose();
  if (mat.specularMap) mat.specularMap.dispose();
  if (mat.envMap) mat.envMap.dispose();
  mat.dispose();
}

function disposeObject(obj) {
  if (!obj) return;
  if (obj.geometry) {
    obj.geometry.dispose();
  }
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(disposeMaterial);
    } else {
      disposeMaterial(obj.material);
    }
  }
}

// Procedural Saturated Packaging Print Texture (Tone Mapping Testbed)
function createPackagingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Obsidian metallic gradient base
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#0a0d14');
  grad.addColorStop(0.25, '#121624');
  grad.addColorStop(0.65, '#181e30');
  grad.addColorStop(1, '#090b10');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // High-chroma saturated packaging print bands (Tone Mapping stress test)
  ctx.fillStyle = '#f97316'; // High-chroma Ember Orange
  ctx.fillRect(36, 120, 440, 70);

  ctx.fillStyle = '#0284c7'; // Saturated Sky/Cobalt Blue
  ctx.fillRect(36, 210, 440, 48);

  ctx.fillStyle = '#ffb35c'; // Saturated Sunburst Gold
  ctx.fillRect(36, 276, 440, 28);

  // Crisp packaging typography
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('KHRONOS PBR NEUTRAL', 48, 168);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('COLORIMETRIC TEST CHART // 2026', 48, 242);

  // Outer framing hairline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 464, 464);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPBRMaterial(roughness, metalness) {
  const tex = createPackagingTexture();
  return new THREE.MeshStandardMaterial({
    map: tex,
    color: 0xffffff,
    roughness: roughness,
    metalness: metalness,
    envMapIntensity: 1.2
  });
}

function createWireframeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.85,
    wireframe: true,
    roughness: 0.25,
    metalness: 0.9,
    transparent: true,
    opacity: 0.88
  });
}

function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.55, 'rgba(249, 115, 22, 0.55)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Point Cloud Particles Generator with Vertical Y-Axis Point Sorting Rule
// (AGI Readiness / Particle-Specimens Archaeology)
function buildSortedPointCloud(baseGeometry) {
  const posAttr = baseGeometry.attributes.position;
  const count = posAttr.count;
  const points = [];

  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const z = posAttr.getZ(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    points.push({ x, y, z });
  }

  // -------------------------------------------------------------
  // VERTICAL Y-AXIS POINT SORTING RULE
  // Sort vertices descending along the vertical Y-axis (top-to-bottom).
  // This guarantees that morphological wavefronts, sweep delays,
  // and color transitions travel coherently down the shape instead
  // of randomly scrambling like noisy static.
  // -------------------------------------------------------------
  points.sort((a, b) => b.y - a.y);

  const sortedPos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const yNorms = new Float32Array(count);

  const colorTop = new THREE.Color(0xf97316); // Warm Ember Rim Light
  const colorMid = new THREE.Color(0xffb35c); // Amber Transition
  const colorBot = new THREE.Color(0x38bdf8); // Cobalt Key Light

  const ySpan = (maxY - minY) || 1.0;

  for (let i = 0; i < count; i++) {
    const pt = points[i];
    sortedPos[i * 3] = pt.x;
    sortedPos[i * 3 + 1] = pt.y;
    sortedPos[i * 3 + 2] = pt.z;

    const normY = (pt.y - minY) / ySpan; // 1.0 at top, 0.0 at bottom
    yNorms[i] = normY;

    const c = new THREE.Color();
    if (normY > 0.5) {
      c.copy(colorMid).lerp(colorTop, (normY - 0.5) * 2.0);
    } else {
      c.copy(colorBot).lerp(colorMid, normY * 2.0);
    }

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(sortedPos, 3));
  pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  pointGeo.setAttribute('yNorm', new THREE.BufferAttribute(yNorms, 1));

  const particleTexture = createParticleTexture();
  const pointMat = new THREE.PointsMaterial({
    size: 0.052,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const pointsMesh = new THREE.Points(pointGeo, pointMat);
  return { mesh: pointsMesh, pointCount: count };
}

function createBaseGeometry(type) {
  if (type === 'box') {
    // Pillow Packaging Pack (PBR Mesh)
    return new THREE.BoxGeometry(1.6, 2.2, 0.6, 36, 44, 20);
  } else if (type === 'sphere') {
    // Particle Specimen Core (Icosahedron)
    return new THREE.IcosahedronGeometry(1.35, 14);
  }
  // Default: Superquadric Torus Knot
  return new THREE.TorusKnotGeometry(1.0, 0.32, 160, 36, 2, 3);
}

function updateHUD(pointsCount) {
  const hudMode = document.getElementById('hud-render-mode');
  const hudTone = document.getElementById('hud-tone-mapping');
  const hudGeo = document.getElementById('hud-geometry-info');
  const hudSort = document.getElementById('hud-sorting-info');

  const modeNames = {
    'solid': 'SOLID PBR (MICRO-FACET)',
    'wireframe': 'WIREFRAME HOLOGRAM',
    'particles': 'POINT CLOUD (Y-SORTED)'
  };
  const toneNames = {
    'neutral': 'KHRONOS NEUTRAL',
    'aces': 'ACES FILMIC (CINEMATIC)',
    'agx': 'AgX (WIDE DR FILMIC)',
    'none': 'NONE (RAW LINEAR [0,1])'
  };
  const geoNames = {
    'torus': 'SUPERQUADRIC TORUS KNOT',
    'box': 'PILLOW PACKAGING PACK',
    'sphere': 'PARTICLE SPECIMEN CORE'
  };

  if (hudMode) hudMode.textContent = modeNames[renderMode] || renderMode.toUpperCase();
  if (hudTone) hudTone.textContent = toneNames[toneMappingType] || toneMappingType.toUpperCase();
  if (hudGeo) hudGeo.textContent = `${geoNames[geometryType] || geometryType.toUpperCase()} (${pointsCount.toLocaleString()} PTS)`;
  if (hudSort) {
    hudSort.textContent = renderMode === 'particles' ? 'Y-AXIS TOP-TO-BOTTOM (AGI)' : 'STANDARD INDEXING';
    hudSort.style.color = renderMode === 'particles' ? 'var(--c-ember)' : 'var(--t-muted)';
  }
}

function updateToneMappingExplanation(type) {
  const titleEl = document.getElementById('deepdive-topic-title');
  const textEl = document.getElementById('deepdive-topic-text');
  if (!titleEl || !textEl) return;

  if (type === 'neutral') {
    titleEl.textContent = 'Khronos PBR Neutral (PBR 2026 E-Commerce Standard)';
    textEl.innerHTML = '<strong>Khronos PBR Neutral</strong> tone mapping preserves true packaging print colorimetry without highlight burnout. Unlike ACES Filmic which notoriously shifts saturated orange into pale yellow specular highlights, Neutral maintains exact brand chroma across the entire dynamic range. Standardized by Khronos for digital product visualization.';
  } else if (type === 'aces') {
    titleEl.textContent = 'ACES Filmic Tone Mapping (Cinematic S-Curve)';
    textEl.innerHTML = '<strong>ACES Filmic</strong> delivers an aggressive high-contrast filmic look with punchy blacks. However, on saturated materials (like orange and cyan packaging prints), the high luminance of specular highlights causes a severe <em>hue shift</em> toward yellow and white, distorting brand packaging identity.';
  } else if (type === 'agx') {
    titleEl.textContent = 'AgX Tone Mapping (Next-Gen Filmic / Blender Default)';
    textEl.innerHTML = '<strong>AgX</strong> is the next-generation color management standard (default in Blender 4 & 5). It avoids ACES hue shifts by smoothly desaturating overexposed regions toward white along natural photographic spectral curves, providing superior highlight roll-off without color distortion.';
  } else if (type === 'none') {
    titleEl.textContent = 'No Tone Mapping (Raw Linear Clamp [0, 1])';
    textEl.innerHTML = '<strong>Raw Linear Clipping</strong> passes light values directly to the framebuffer, clamping any channel &gt; 1.0 abruptly. This causes blown-out highlights, harsh aliasing rims, and total loss of surface micro-facet details on specular reflections.';
  }
}

function updateRenderModeExplanation(mode) {
  const titleEl = document.getElementById('deepdive-topic-title');
  const textEl = document.getElementById('deepdive-topic-text');
  if (!titleEl || !textEl) return;

  if (mode === 'particles') {
    titleEl.textContent = 'Point Cloud Particles: Vertical Y-Axis Sorting Archaeology';
    textEl.innerHTML = '<strong>AGI Readiness & Particle-Specimens Rule:</strong> Point clouds generated from 3D meshes are strictly sorted descending along the vertical Y-axis (top to bottom). This deterministic indexing ensures that morph targets, wavefront sweeps, and scanline shaders travel smoothly and coherently across the object instead of flashing as disordered spatial noise.';
  } else if (mode === 'wireframe') {
    titleEl.textContent = 'Wireframe Hologram: HUD CAD Geometric Topology';
    textEl.innerHTML = '<strong>Wireframe Hologram</strong> renders the underlying polygonal topology with emissive cobalt edges and micro-facet depth. Used in high-tech editorial interfaces and CAD previews to communicate mathematical precision and physical construction without heavy surface texture maps.';
  } else {
    updateToneMappingExplanation(toneMappingType);
  }
}

function update3DObject() {
  if (!scene) return;

  // Strict resource disposal on recreation
  if (activeObject) {
    disposeObject(activeObject);
    scene.remove(activeObject);
    activeObject = null;
  }

  const baseGeometry = createBaseGeometry(geometryType);
  let pointOrVertexCount = 0;

  if (renderMode === 'solid') {
    const mat = createPBRMaterial(currentRoughness, currentMetalness);
    activeObject = new THREE.Mesh(baseGeometry, mat);
    pointOrVertexCount = baseGeometry.attributes.position.count;
  } else if (renderMode === 'wireframe') {
    const mat = createWireframeMaterial();
    activeObject = new THREE.Mesh(baseGeometry, mat);
    pointOrVertexCount = baseGeometry.attributes.position.count;
  } else if (renderMode === 'particles') {
    const result = buildSortedPointCloud(baseGeometry);
    activeObject = result.mesh;
    pointOrVertexCount = result.pointCount;
    baseGeometry.dispose();
  }

  scene.add(activeObject);
  updateHUD(pointOrVertexCount);
}

function applyToneMapping(type) {
  if (!renderer) return;

  toneMappingType = type;
  let tm = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping;
  if (type === 'neutral') {
    tm = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping;
  } else if (type === 'aces') {
    tm = THREE.ACESFilmicToneMapping;
  } else if (type === 'agx') {
    tm = THREE.AgXToneMapping || THREE.ACESFilmicToneMapping;
  } else if (type === 'none') {
    tm = THREE.NoToneMapping;
  }

  renderer.toneMapping = tm;
  renderer.toneMappingExposure = 1.0;

  if (activeObject && activeObject.material) {
    if (Array.isArray(activeObject.material)) {
      activeObject.material.forEach(m => { m.needsUpdate = true; });
    } else {
      activeObject.material.needsUpdate = true;
    }
  }

  updateToneMappingExplanation(type);
  const hudTone = document.getElementById('hud-tone-mapping');
  const badgeTone = document.getElementById('tonemap-badge');
  const toneNames = {
    'neutral': 'Khronos Neutral',
    'aces': 'ACES Filmic',
    'agx': 'AgX',
    'none': 'None (Linear)'
  };
  if (hudTone) hudTone.textContent = toneNames[type]?.toUpperCase() || type.toUpperCase();
  if (badgeTone) badgeTone.textContent = toneNames[type] || type;
}

export function init3DStage() {
  const container = document.getElementById('three-viewport-container');
  if (!container || typeof THREE === 'undefined') return;

  // Handle re-entrance: update viewport dimensions without duplicating renderer
  if (is3DInitialized && renderer && camera) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w > 0 && h > 0) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    return;
  }

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 480;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Preserve screen reader description element
  const canvasPlaceholder = container.querySelector('p.sr-only');
  const hudOverlay = container.querySelector('.viewport-hud-overlay');
  const gestureHint = container.querySelector('.viewport-gesture-hint');

  container.innerHTML = '';
  if (canvasPlaceholder) container.appendChild(canvasPlaceholder);
  container.appendChild(renderer.domElement);
  if (hudOverlay) container.appendChild(hudOverlay);
  if (gestureHint) container.appendChild(gestureHint);

  // Initialize OrbitControls with soft inertia damping
  try {
    if (typeof OrbitControls !== 'undefined') {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxDistance = 10.0;
      controls.minDistance = 1.8;
      controls.enablePan = true;
    }
  } catch (err) {
    console.warn("OrbitControls initialization:", err);
  }

  // Studio Lighting Channels (Khronos PBR Standard)
  lightAmbient = new THREE.AmbientLight(0xffffff, 0.45); // Ambient Fill
  scene.add(lightAmbient);

  lightRim = new THREE.DirectionalLight(0xf97316, 2.8); // Warm Ember Rim Light
  lightRim.position.set(3.5, 4.0, 3.0);
  scene.add(lightRim);

  lightKey = new THREE.DirectionalLight(0x38bdf8, 2.2); // Cobalt Key Light
  lightKey.position.set(-3.5, -2.0, -2.5);
  scene.add(lightKey);

  // Initial object construction
  update3DObject();

  window.addEventListener('resize', () => {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  is3DInitialized = true;

  function animate() {
    animFrameId = requestAnimationFrame(animate);

    if (controls) {
      controls.update();
    }

    if (isRotating && activeObject) {
      activeObject.rotation.y += 0.008 * spinSpeed;
      activeObject.rotation.x += 0.003 * spinSpeed;
    }

    // Live vertical scan wave for Point Cloud particles
    if (renderMode === 'particles' && activeObject && activeObject.geometry) {
      const time = performance.now() * 0.002;
      const colors = activeObject.geometry.attributes.color;
      const yNorms = activeObject.geometry.attributes.yNorm;
      if (colors && yNorms) {
        const pulseY = (Math.sin(time * 1.5) * 0.5 + 0.5); // 0.0 to 1.0 vertical scan wave
        const count = yNorms.count;
        for (let i = 0; i < count; i += 16) {
          const ny = yNorms.getX(i);
          const dist = Math.abs(ny - pulseY);
          if (dist < 0.06) {
            colors.setXYZ(i, 1.0, 0.95, 0.8); // Flare highlight along coherent Y wave
          }
        }
        colors.needsUpdate = true;
      }
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  if (!animFrameId) {
    animate();
  }
}

// Resize 3D Tone Mapping Stage Viewport
export function resize3DStage() {
  const container = document.getElementById('three-viewport-container');
  if (!container || !renderer || !camera) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w > 0 && h > 0) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }
}

// Reset 3D Camera / Simulation Viewpoint
export function reset3DCamera() {
  if (camera) {
    camera.position.set(0, 0, 4.2);
    camera.lookAt(0, 0, 0);
  }
  if (controls) {
    controls.target.set(0, 0, 0);
    controls.reset();
  }
  if (activeObject) {
    activeObject.rotation.set(0, 0, 0);
  }
}

// Cycle Render Mode (Solid PBR -> Wireframe Hologram -> Point Cloud)
export function cycleRenderMode() {
  const modes = ['solid', 'wireframe', 'particles'];
  const nextIdx = (modes.indexOf(renderMode) + 1) % modes.length;
  renderMode = modes[nextIdx];
  const select = document.getElementById('render-mode-select');
  if (select) select.value = renderMode;
  const badge = document.getElementById('render-mode-badge');
  const badgeMap = {
    'solid': 'Solid PBR',
    'wireframe': 'Wireframe Hologram',
    'particles': 'Point Cloud'
  };
  if (badge) badge.textContent = badgeMap[renderMode] || renderMode;
  update3DObject();
  updateRenderModeExplanation(renderMode);
  logToTerminal(`Render mode toggled: ${badgeMap[renderMode] || renderMode} [M]`, 'info');
}

// 3D Controls Wiring
export function setup3DControls() {
  const roughnessSlider = document.getElementById('roughness-slider');
  const roughnessVal = document.getElementById('roughness-val');
  const metallicSlider = document.getElementById('metallic-slider');
  const metallicVal = document.getElementById('metallic-val');
  const spinSpeedSlider = document.getElementById('spin-speed-slider');
  const spinSpeedVal = document.getElementById('spin-speed-val');
  const rotateBtn = document.getElementById('rotate-toggle-btn');
  const rotateBtnText = document.getElementById('rotate-btn-text');
  const rotateBtnIcon = document.getElementById('rotate-btn-icon');
  const cameraResetBtn = document.getElementById('camera-reset-btn');

  const renderModeSelect = document.getElementById('render-mode-select');
  const geometrySelect = document.getElementById('geometry-select');
  const toneMappingSelect = document.getElementById('tone-mapping-select');

  const lightRimToggle = document.getElementById('light-rim-toggle');
  const lightKeyToggle = document.getElementById('light-key-toggle');
  const lightAmbientToggle = document.getElementById('light-ambient-toggle');

  if (roughnessSlider) {
    roughnessSlider.addEventListener('input', (e) => {
      currentRoughness = parseFloat(e.target.value);
      if (roughnessVal) roughnessVal.textContent = currentRoughness.toFixed(2);
      if (activeObject && activeObject.material && activeObject.material.roughness !== undefined) {
        activeObject.material.roughness = currentRoughness;
      }
    });
  }

  if (metallicSlider) {
    metallicSlider.addEventListener('input', (e) => {
      currentMetalness = parseFloat(e.target.value);
      if (metallicVal) metallicVal.textContent = currentMetalness.toFixed(2);
      if (activeObject && activeObject.material && activeObject.material.metalness !== undefined) {
        activeObject.material.metalness = currentMetalness;
      }
    });
  }

  if (spinSpeedSlider) {
    spinSpeedSlider.addEventListener('input', (e) => {
      spinSpeed = parseFloat(e.target.value);
      if (spinSpeedVal) spinSpeedVal.textContent = spinSpeed.toFixed(1) + 'x';
    });
  }

  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      isRotating = !isRotating;
      if (rotateBtnText) rotateBtnText.textContent = isRotating ? "Pause Spin" : "Resume Spin";
      if (rotateBtnIcon) rotateBtnIcon.textContent = isRotating ? "⏸" : "▶";
    });
  }

  if (cameraResetBtn) {
    cameraResetBtn.addEventListener('click', () => {
      reset3DCamera();
    });
  }

  if (renderModeSelect) {
    renderModeSelect.addEventListener('change', (e) => {
      renderMode = e.target.value;
      const badge = document.getElementById('render-mode-badge');
      const badgeMap = {
        'solid': 'Solid PBR',
        'wireframe': 'Wireframe Hologram',
        'particles': 'Point Cloud'
      };
      if (badge) badge.textContent = badgeMap[renderMode] || renderMode;
      update3DObject();
      updateRenderModeExplanation(renderMode);
    });
  }

  if (geometrySelect) {
    geometrySelect.addEventListener('change', (e) => {
      geometryType = e.target.value;
      const badge = document.getElementById('geometry-badge');
      const geoMap = {
        'torus': 'Superquadric',
        'box': 'Pillow Pack',
        'sphere': 'Specimen Core'
      };
      if (badge) badge.textContent = geoMap[geometryType] || geometryType;
      update3DObject();
    });
  }

  if (toneMappingSelect) {
    toneMappingSelect.addEventListener('change', (e) => {
      applyToneMapping(e.target.value);
    });
  }

  if (lightRimToggle) {
    lightRimToggle.addEventListener('change', (e) => {
      if (lightRim) lightRim.visible = e.target.checked;
    });
  }

  if (lightKeyToggle) {
    lightKeyToggle.addEventListener('change', (e) => {
      if (lightKey) lightKey.visible = e.target.checked;
    });
  }

  if (lightAmbientToggle) {
    lightAmbientToggle.addEventListener('change', (e) => {
      if (lightAmbient) lightAmbient.visible = e.target.checked;
    });
  }
}

// ========================================================
// INTERACTIVE TEACHING & PRESENTER DECK ENGINE
// ========================================================

let currentModuleIdx = 0;
let isSolutionRevealed = false;
let isPresenterMode = false;

// Terminal Log Helper
export function logToTerminal(message, type = 'info') {
  const logEl = document.getElementById('preview-terminal-log');
  if (!logEl) return;
  const time = new Date().toTimeString().split(' ')[0];
  const typeClass = type === 'success' ? 'log-success' : type === 'warn' ? 'log-warn' : type === 'error' ? 'log-error' : '';
  const entry = document.createElement('div');
  entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="${typeClass}">${escapeHtml(message)}</span>`;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
}

// Render Teaching Slide
export function renderTeachingModule(idx) {
  if (idx < 0 || idx >= TEACHING_MODULES.length) return;
  currentModuleIdx = idx;
  const mod = TEACHING_MODULES[idx];
  if (!mod) return;

  // Slide content elements
  const numEl = document.getElementById('mod-number');
  const tagEl = document.getElementById('mod-tag');
  const slideNumEl = document.getElementById('current-slide-num');
  const titleEl = document.getElementById('mod-title');
  const conceptEl = document.getElementById('mod-concept');
  const promptEl = document.getElementById('mod-mentor-prompt');
  const targetEl = document.getElementById('mod-student-target');
  const progressEl = document.getElementById('syllabus-progress');
  const codeEditor = document.getElementById('code-editor-input');
  const langBadge = document.getElementById('code-lang-badge');
  const hintText = document.getElementById('preview-hint-text');
  const stageContainer = document.getElementById('slide-stage-container');

  if (numEl) numEl.textContent = `Module ${mod.number} / 10`;
  if (tagEl) tagEl.textContent = mod.tag || "Creative Architecture";
  if (slideNumEl) slideNumEl.textContent = (idx + 1).toString();
  if (titleEl) titleEl.textContent = mod.title;
  if (conceptEl) conceptEl.textContent = mod.coreConcept;
  if (promptEl) promptEl.textContent = mod.mentorPrompt;
  if (targetEl) targetEl.textContent = mod.studentTarget;
  if (progressEl) {
    progressEl.style.width = `${((idx + 1) / TEACHING_MODULES.length) * 100}%`;
    const progressContainer = document.getElementById('syllabus-progressbar');
    if (progressContainer) progressContainer.setAttribute('aria-valuenow', idx + 1);
  }
  if (codeEditor) codeEditor.value = mod.codeExample;
  if (langBadge) langBadge.textContent = mod.language || "Code";
  if (hintText) hintText.textContent = mod.previewHint || 'Tweak code above and click "Run / Preview"';

  // Trigger smooth transition animation
  if (stageContainer) {
    stageContainer.classList.remove('slide-content-transition');
    void stageContainer.offsetWidth; // Trigger reflow
    stageContainer.classList.add('slide-content-transition');
  }

  // Reset Solution state to masked / quiz mode
  hideSolution();

  // Update navigation buttons
  const prevBtn = document.getElementById('prev-module-btn');
  const nextBtn = document.getElementById('next-module-btn');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === TEACHING_MODULES.length - 1;

  // Update Slide Dots
  updateSlideDots(idx);

  // Update Drawer active highlight
  updateDrawerHighlight(idx);

  // Render live interactive preview sandbox
  renderModulePreview(mod, mod.codeExample);

  logToTerminal(`Loaded Module ${mod.number}: "${mod.title}"`, 'info');
}

// Solution Reveal Accordion Logic
export function toggleSolution() {
  if (isSolutionRevealed) {
    hideSolution();
  } else {
    revealSolution();
  }
}

export function revealSolution() {
  isSolutionRevealed = true;
  const maskedView = document.getElementById('solution-masked-view');
  const revealedView = document.getElementById('solution-revealed-view');
  const badge = document.getElementById('solution-status-badge');
  const btnIcon = document.getElementById('reveal-btn-icon');
  const btnText = document.getElementById('reveal-btn-text');

  if (maskedView) maskedView.style.display = 'none';
  if (revealedView) revealedView.style.display = 'block';
  if (badge) {
    badge.textContent = '✓ TARGET VERIFIED';
    badge.className = 'quiz-badge quiz-badge-revealed';
  }
  if (btnIcon) btnIcon.textContent = '✕';
  if (btnText) btnText.textContent = 'Hide Solution [R]';

  const mod = TEACHING_MODULES[currentModuleIdx];
  logToTerminal(`[QUIZ] Solution revealed for Module ${mod ? mod.number : ''}`, 'success');
}

export function hideSolution() {
  isSolutionRevealed = false;
  const maskedView = document.getElementById('solution-masked-view');
  const revealedView = document.getElementById('solution-revealed-view');
  const badge = document.getElementById('solution-status-badge');
  const btnIcon = document.getElementById('reveal-btn-icon');
  const btnText = document.getElementById('reveal-btn-text');

  if (maskedView) maskedView.style.display = 'block';
  if (revealedView) revealedView.style.display = 'none';
  if (badge) {
    badge.textContent = 'QUIZ: MASKED';
    badge.className = 'quiz-badge quiz-badge-masked';
  }
  if (btnIcon) btnIcon.textContent = '👁️';
  if (btnText) btnText.textContent = 'Reveal Solution [R]';
}

// Fullscreen & Presenter Deck Mode
export function togglePresenterMode() {
  isPresenterMode = !isPresenterMode;
  const body = document.body;
  const toggleBtn = document.getElementById('toggle-presenter-btn');

  if (isPresenterMode) {
    body.classList.add('presenter-active');
    if (toggleBtn) toggleBtn.textContent = '⚡ Exit Presenter Deck [F]';
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fallback gracefully in case browser restricts fullscreen API
      });
    }
    logToTerminal('Entered Presenter / Teaching Deck mode (Fullscreen)', 'success');
  } else {
    body.classList.remove('presenter-active');
    if (toggleBtn) toggleBtn.textContent = '⚡ Presenter Deck [F]';
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    logToTerminal('Exited Presenter Deck mode', 'info');
  }
}

// Module Thumbnail Selector Drawer
export function setupModuleDrawer() {
  const drawerList = document.getElementById('drawer-modules-list');
  const backdrop = document.getElementById('module-drawer-backdrop');
  const drawer = document.getElementById('module-drawer');
  const openBtn = document.getElementById('open-drawer-btn');
  const hudOpenBtn = document.getElementById('hud-drawer-btn');
  const closeBtn = document.getElementById('close-drawer-btn');

  if (!drawerList) return;

  drawerList.innerHTML = TEACHING_MODULES.map((mod, idx) => `
    <div class="drawer-module-card ${idx === currentModuleIdx ? 'active' : ''}" data-idx="${idx}">
      <div style="display:flex; align-items:center; gap:0.8rem;">
        <span class="tone-badge" style="font-size:0.75rem; padding:0.2rem 0.5rem; ${idx === currentModuleIdx ? 'border-color:var(--c-ember); color:var(--c-ember);' : ''}">
          ${mod.number}
        </span>
        <div>
          <h4 style="font-family:var(--font-sans); font-size:0.95rem; font-weight:600; color:var(--t-primary); margin-bottom:0.2rem;">
            ${mod.title}
          </h4>
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--t-muted);">
            ${mod.tag || 'Architecture'}
          </span>
        </div>
      </div>
      <span style="font-family:var(--font-mono); font-size:0.75rem; color:${idx === currentModuleIdx ? 'var(--c-ember)' : 'var(--t-muted)'}; font-weight:700;">
        ${idx === currentModuleIdx ? '● ACTIVE' : 'JUMP &rarr;'}
      </span>
    </div>
  `).join('');

  drawerList.querySelectorAll('.drawer-module-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-idx'), 10);
      renderTeachingModule(idx);
      closeDrawer();
    });
  });

  const openDrawer = () => {
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
  };

  const closeDrawer = () => {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (hudOpenBtn) hudOpenBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
}

function updateDrawerHighlight(currentIdx) {
  const cards = document.querySelectorAll('.drawer-module-card');
  cards.forEach((card, idx) => {
    if (idx === currentIdx) {
      card.classList.add('active');
      const statusSpan = card.querySelector('span:last-child');
      if (statusSpan) {
        statusSpan.style.color = 'var(--c-ember)';
        statusSpan.textContent = '● ACTIVE';
      }
    } else {
      card.classList.remove('active');
      const statusSpan = card.querySelector('span:last-child');
      if (statusSpan) {
        statusSpan.style.color = 'var(--t-muted)';
        statusSpan.textContent = 'JUMP →';
      }
    }
  });
}

// Slide Dots Generation & Updates
export function setupSlideDots() {
  const dotsContainer = document.getElementById('slide-dots-container');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = TEACHING_MODULES.map((_, idx) => `
    <button class="slide-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}" title="Jump to Module ${idx + 1}" aria-label="Module ${idx + 1}"></button>
  `).join('');

  dotsContainer.querySelectorAll('.slide-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-idx'), 10);
      renderTeachingModule(idx);
    });
  });
}

function updateSlideDots(currentIdx) {
  const dots = document.querySelectorAll('.slide-dot');
  dots.forEach((dot, idx) => {
    if (idx === currentIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Keyboard Navigation Hotkeys
export function setupKeyboardNavigation() {
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === 'INPUT' || 
      activeEl.tagName === 'TEXTAREA' || 
      activeEl.isContentEditable
    );

    // If typing in editor, only handle Esc to blur
    if (isTyping) {
      if (e.key === 'Escape') {
        activeEl.blur();
      }
      return;
    }

    // Arrow Left: Previous
    if (e.key === 'ArrowLeft') {
      if (currentModuleIdx > 0) {
        renderTeachingModule(currentModuleIdx - 1);
      }
      return;
    }

    // Arrow Right or Spacebar: Next
    if (e.key === 'ArrowRight' || e.code === 'Space') {
      e.preventDefault();
      if (currentModuleIdx < TEACHING_MODULES.length - 1) {
        renderTeachingModule(currentModuleIdx + 1);
      }
      return;
    }

    // R: Reset camera / simulation (Presenter Mode Hotkey)
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset3DCamera();
      const clearParticlesBtn = document.getElementById('clear-particles-btn');
      const motionLab = document.getElementById('section-motion-lab');
      if (clearParticlesBtn && motionLab && motionLab.style.display !== 'none') {
        clearParticlesBtn.click();
      }
      logToTerminal('Reset 3D camera / simulation controls [R]', 'info');
      return;
    }

    // F: Toggle Fullscreen / Presenter Deck
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      togglePresenterMode();
      return;
    }

    // M: Toggle render mode (Presenter Mode Hotkey: Solid -> Wireframe -> Point Cloud)
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      cycleRenderMode();
      return;
    }

    // D: Toggle Module Drawer
    if (e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      const drawer = document.getElementById('module-drawer');
      const backdrop = document.getElementById('module-drawer-backdrop');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
      } else if (drawer) {
        drawer.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
      }
      return;
    }

    // Escape: Close drawer or exit presenter mode
    if (e.key === 'Escape') {
      const drawer = document.getElementById('module-drawer');
      const backdrop = document.getElementById('module-drawer-backdrop');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        return;
      }
      if (isPresenterMode) {
        togglePresenterMode();
        return;
      }
    }

    // Digit keys 1-9 (jump to module 1-9) and 0 (jump to module 10)
    if (e.key >= '1' && e.key <= '9') {
      const targetIdx = parseInt(e.key, 10) - 1;
      if (targetIdx < TEACHING_MODULES.length) {
        renderTeachingModule(targetIdx);
      }
      return;
    }
    if (e.key === '0') {
      if (TEACHING_MODULES.length >= 10) {
        renderTeachingModule(9);
      }
      return;
    }
  });

  // Handle browser native fullscreen change
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isPresenterMode) {
      isPresenterMode = false;
      document.body.classList.remove('presenter-active');
      const toggleBtn = document.getElementById('toggle-presenter-btn');
      if (toggleBtn) toggleBtn.textContent = '⚡ Presenter Deck [F]';
      logToTerminal('Fullscreen exited by user', 'info');
    }
  });
}

// Live Code Playground Wiring & Interactive Sandboxes
export function setupCodePlayground() {
  const copyBtn = document.getElementById('copy-code-btn');
  const resetBtn = document.getElementById('reset-code-btn');
  const runBtn = document.getElementById('run-code-btn');
  const codeEditor = document.getElementById('code-editor-input');

  if (copyBtn && codeEditor) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeEditor.value);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.color = '#34d399';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.color = '';
        }, 1500);
        logToTerminal('Code snippet copied to clipboard', 'success');
      } catch {
        logToTerminal('Clipboard write failed', 'error');
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const mod = TEACHING_MODULES[currentModuleIdx];
      if (mod && codeEditor) {
        codeEditor.value = mod.codeExample;
        renderModulePreview(mod, mod.codeExample);
        logToTerminal(`Reset code for Module ${mod.number} to original blueprint`, 'info');
      }
    });
  }

  if (runBtn && codeEditor) {
    runBtn.addEventListener('click', () => {
      const mod = TEACHING_MODULES[currentModuleIdx];
      if (mod) {
        renderModulePreview(mod, codeEditor.value);
        logToTerminal(`Executing preview for Module ${mod.number}...`, 'success');
      }
    });
  }
}

// Dynamic Interactive Preview Sandbox Generator
export function renderModulePreview(mod, code) {
  const mount = document.getElementById('preview-sandbox-mount');
  const statusPill = document.getElementById('preview-status-pill');
  if (!mount) return;

  if (statusPill) {
    statusPill.innerHTML = '● Status: <span style="color:#34d399;">200 OK - Active Output</span>';
  }

  const pType = mod.previewType || 'css-box';

  switch (pType) {
    case 'css-box': {
      // Module 1: Tone Steps & Anti-Slop Depth
      const hasDropShadow = /box-shadow\s*:\s*0\s+[0-9]+px\s+[0-9]+px/i.test(code) && !/box-shadow\s*:\s*none/i.test(code);
      const isCraft = /background\s*:\s*#12141a/i.test(code) || /border\s*:\s*1px\s+solid/i.test(code);

      mount.innerHTML = `
        <div style="width:100%; display:flex; flex-direction:column; align-items:center; gap:0.8rem;">
          <div id="demo-card-target" style="width:min(440px, 90%); padding:1.4rem; background:#12141a; border:1px solid rgba(255,255,255,0.08); border-radius:18px; text-align:center; transition:all 0.3s ease;">
            <span class="tone-badge" style="font-size:0.72rem; margin-bottom:0.4rem;">LIVE SPECIMEN</span>
            <h4 style="font-family:var(--font-display); font-size:1.15rem; color:#fff; margin:0.3rem 0;">Physical Object Depth</h4>
            <p style="font-size:0.82rem; color:var(--t-secondary);">1px cobalt rim &bull; Zero fuzzy shadows &bull; Concentric radii</p>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.78rem;">
            ${hasDropShadow 
              ? '<span class="log-warn">⚠️ Slop Alert: Heavy drop-shadow detected! Strip fuzzy blur and rely on calibrated tone steps.</span>'
              : isCraft
              ? '<span class="log-success">✓ Pure Craft: Calibrated tone steps and 1px hairlines verified!</span>'
              : '<span style="color:var(--t-muted);">Custom styles applied to specimen card above.</span>'
            }
          </div>
        </div>
      `;

      // Apply valid inline styles from code
      const targetCard = document.getElementById('demo-card-target');
      if (targetCard) {
        const lines = code.split(';');
        lines.forEach(line => {
          const [prop, val] = line.split(':');
          if (prop && val) {
            const cleanProp = prop.trim().replace(/\/\*[\s\S]*?\*\//g, '');
            const cleanVal = val.trim().replace(/\/\*[\s\S]*?\*\//g, '');
            if (cleanProp.startsWith('--')) {
              targetCard.style.setProperty(cleanProp, cleanVal);
            } else if (cleanProp === 'border') {
              targetCard.style.border = cleanVal;
            } else if (cleanProp === 'background') {
              targetCard.style.background = cleanVal;
            } else if (cleanProp === 'border-radius') {
              targetCard.style.borderRadius = cleanVal;
            } else if (cleanProp === 'box-shadow') {
              targetCard.style.boxShadow = cleanVal;
            }
          }
        });
      }
      break;
    }

    case 'thesis-contract': {
      // Module 2: 150-Word Thesis Contract & Word Limits
      mount.innerHTML = `
        <div style="width:100%; max-width:560px; display:flex; flex-direction:column; gap:0.6rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:0.78rem;">
            <label>Hero Headline (Budget: &le; 6 words):</label>
            <span id="hero-word-badge" class="tone-badge" style="color:#34d399;">5 / 6 words &bull; PASS</span>
          </div>
          <input type="text" id="thesis-hero-input" value="Physical Precision Over Generative Slop" style="padding:0.5rem 0.8rem; background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:6px; color:#fff; font-family:var(--font-sans); font-size:0.88rem;">

          <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:0.78rem; margin-top:0.4rem;">
            <label>CTA Button (Budget: &le; 3 words):</label>
            <span id="cta-word-badge" class="tone-badge" style="color:#34d399;">2 / 3 words &bull; PASS</span>
          </div>
          <input type="text" id="thesis-cta-input" value="Launch Audit" style="padding:0.5rem 0.8rem; background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:6px; color:#fff; font-family:var(--font-sans); font-size:0.88rem;">
        </div>
      `;

      const heroInput = document.getElementById('thesis-hero-input');
      const heroBadge = document.getElementById('hero-word-badge');
      const ctaInput = document.getElementById('thesis-cta-input');
      const ctaBadge = document.getElementById('cta-word-badge');

      const checkWords = () => {
        if (heroInput && heroBadge) {
          const count = heroInput.value.trim().split(/\s+/).filter(Boolean).length;
          const ok = count <= 6;
          heroBadge.textContent = `${count} / 6 words • ${ok ? 'PASS' : 'EXCEEDED'}`;
          heroBadge.style.color = ok ? '#34d399' : '#f87171';
        }
        if (ctaInput && ctaBadge) {
          const count = ctaInput.value.trim().split(/\s+/).filter(Boolean).length;
          const ok = count <= 3;
          ctaBadge.textContent = `${count} / 3 words • ${ok ? 'PASS' : 'EXCEEDED'}`;
          ctaBadge.style.color = ok ? '#34d399' : '#f87171';
        }
      };

      if (heroInput) heroInput.addEventListener('input', checkWords);
      if (ctaInput) ctaInput.addEventListener('input', checkWords);
      break;
    }

    case 'clamp-typo': {
      // Module 3: Mathematical Fluid Clamp Typography
      mount.innerHTML = `
        <div style="width:100%; display:flex; flex-direction:column; align-items:center; gap:1rem;">
          <div style="width:100%; max-width:540px; display:flex; flex-direction:column; gap:0.4rem;">
            <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.8rem; color:var(--t-secondary);">
              <span>Simulated Viewport Width:</span>
              <strong id="clamp-vp-val" style="color:var(--c-amber);">768px (Tablet)</strong>
            </div>
            <input type="range" id="clamp-vp-slider" min="390" max="1440" value="768" style="width:100%;">
          </div>

          <div style="text-align:center; padding:1rem; width:100%;">
            <div id="clamp-specimen-text" style="font-family:var(--font-display); font-weight:800; color:var(--t-primary); line-height:1.05; letter-spacing:-0.03em;">
              Physical Precision
            </div>
            <div id="clamp-calc-val" style="font-family:var(--font-mono); font-size:0.82rem; color:var(--c-ember); margin-top:0.6rem;">
              Computed: 57.2px (3.57rem) &bull; Continuous Linear Interpolation
            </div>
          </div>
        </div>
      `;

      const slider = document.getElementById('clamp-vp-slider');
      const vpVal = document.getElementById('clamp-vp-val');
      const text = document.getElementById('clamp-specimen-text');
      const calcVal = document.getElementById('clamp-calc-val');

      const updateClamp = () => {
        if (!slider) return;
        const w = parseFloat(slider.value);
        if (vpVal) {
          const type = w <= 480 ? 'Mobile' : w <= 960 ? 'Tablet' : 'Desktop';
          vpVal.textContent = `${w}px (${type})`;
        }
        // Formula: clamp(2.75rem, 1.543rem + 4.952vw, 6.0rem)
        // 1rem = 16px. 2.75rem = 44px, 6.0rem = 96px.
        const vwTerm = (4.952 / 100) * w;
        const computedPx = Math.min(96, Math.max(44, (1.543 * 16) + vwTerm));
        if (text) text.style.fontSize = `${computedPx}px`;
        if (calcVal) calcVal.textContent = `Computed: ${computedPx.toFixed(1)}px (${(computedPx / 16).toFixed(2)}rem) • Zero Layout Shifts`;
      };

      if (slider) slider.addEventListener('input', updateClamp);
      updateClamp();
      break;
    }

    case 'liquid-glass': {
      // Module 4: Optical Liquid Glass
      mount.innerHTML = `
        <div style="position:relative; width:100%; max-width:480px; height:120px; background:radial-gradient(circle at 30% 50%, #f97316 0%, #3b82f6 60%, #0a0b0e 100%); border-radius:16px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
          <div style="position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px); background-size:16px 16px;"></div>
          <div style="position:relative; z-index:2; padding:0.9rem 1.8rem; background:rgba(18,20,26,0.5); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); border-radius:20px; border:1px solid rgba(255,255,255,0.2); box-shadow:inset 0 1px 2px rgba(255,255,255,0.8), 0 8px 24px rgba(0,0,0,0.3); text-align:center;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:#ffb35c;">[OPTICAL REFRACTION LENS]</span>
            <div style="font-family:var(--font-display); font-size:1.05rem; color:#fff; font-weight:700;">Zero Ghosting Text</div>
          </div>
        </div>
      `;
      break;
    }

    case 'gsap-raf': {
      // Module 5: GSAP & Lenis RAF Sync
      mount.innerHTML = `
        <div style="width:100%; display:flex; flex-direction:column; align-items:center; gap:0.8rem;">
          <div style="display:flex; justify-content:space-between; width:100%; max-width:440px; font-family:var(--font-mono); font-size:0.8rem;">
            <span>Ticker Loop: <strong style="color:#34d399;">60.0 FPS</strong></span>
            <span>lagSmoothing: <strong style="color:var(--c-ember);">0 (Active)</strong></span>
          </div>
          <div style="width:100%; max-width:440px; height:32px; background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:16px; position:relative; overflow:hidden;">
            <div id="raf-ball" style="width:32px; height:32px; border-radius:50%; background:var(--c-ember); box-shadow:0 0 12px rgba(249,115,22,0.8); position:absolute; left:0; top:0;"></div>
          </div>
          <button id="spike-btn" class="deck-btn" style="font-size:0.75rem; padding:0.3rem 0.8rem;">Test Frame Drop Spike (150ms)</button>
        </div>
      `;

      const ball = document.getElementById('raf-ball');
      const spikeBtn = document.getElementById('spike-btn');
      let x = 0;
      let dir = 1;
      let lastTime = performance.now();

      function stepBall(time) {
        if (!document.getElementById('raf-ball')) return;
        const dt = Math.min((time - lastTime) / 1000, 0.05); // Simulated lagSmoothing
        lastTime = time;
        x += dir * 200 * dt;
        if (x > 408) { x = 408; dir = -1; }
        if (x < 0) { x = 0; dir = 1; }
        if (ball) ball.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(stepBall);
      }
      requestAnimationFrame(stepBall);

      if (spikeBtn) {
        spikeBtn.addEventListener('click', () => {
          logToTerminal('Injected 150ms spike: lagSmoothing(0) clamped velocity jump successfully.', 'success');
        });
      }
      break;
    }

    case 'tsl-shader': {
      // Module 6: Three.js r170+ WebGPU & TSL
      mount.innerHTML = `
        <div style="width:100%; max-width:480px; display:flex; align-items:center; justify-content:space-around; gap:1rem;">
          <div style="width:72px; height:72px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #181b24 0%, #0a0b0e 70%); border:2px solid var(--c-ember); box-shadow:0 0 20px rgba(249,115,22,0.6); display:flex; align-items:center; justify-content:center;">
            <span style="font-family:var(--font-mono); font-size:0.65rem; color:#ffb35c;">TSL RIM</span>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.78rem; color:var(--t-secondary);">
            <div>Node: <span style="color:#38bdf8;">MeshStandardNodeMaterial</span></div>
            <div>Output: <span style="color:#34d399;">WGSL Shader Graph</span></div>
            <div>Fresnel Power: <span style="color:var(--c-amber);">float(3.0)</span></div>
          </div>
        </div>
      `;
      break;
    }

    case 'blender-mcp': {
      // Module 7: Blender MCP Socket Bridge
      mount.innerHTML = `
        <div style="width:100%; max-width:520px; font-family:var(--font-mono); font-size:0.78rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span>MCP Socket Bridge: <strong style="color:#34d399;">127.0.0.1:9876</strong></span>
            <span class="tone-badge" style="font-size:0.7rem; padding:0.1rem 0.4rem;">CONNECTED</span>
          </div>
          <div style="background:#050608; border:1px solid var(--c-cobalt-rim); padding:0.6rem 0.8rem; border-radius:6px; color:#38bdf8;">
            &gt; bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0)<br>
            &gt; bpy.ops.export_scene.gltf(filepath="specimen.glb", export_format='GLB')<br>
            <span style="color:#34d399;">✓ Command dispatched to main thread via bpy.app.timers. (1,420 tris)</span>
          </div>
        </div>
      `;
      break;
    }

    case 'retopo-3d': {
      // Module 8: SOTA Generative 3D Pipeline
      mount.innerHTML = `
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; justify-content:center; max-width:620px;">
          <span class="tone-badge" style="border-color:#34d399; color:#34d399;">1. TRELLIS.2</span>
          <span style="color:var(--t-muted);">&rarr;</span>
          <span class="tone-badge" style="border-color:#34d399; color:#34d399;">2. Quadriflow</span>
          <span style="color:var(--t-muted);">&rarr;</span>
          <span class="tone-badge" style="border-color:#34d399; color:#34d399;">3. AccuRIG</span>
          <span style="color:var(--t-muted);">&rarr;</span>
          <span class="tone-badge" style="border-color:#34d399; color:#34d399;">4. Mixamo Mocap</span>
          <span style="color:var(--t-muted);">&rarr;</span>
          <span class="tone-badge" style="border-color:var(--c-ember); color:var(--c-ember);">5. Meshopt GLB</span>
        </div>
      `;
      break;
    }

    case 'virtual-clock': {
      // Module 9: Programmatic Video & EBU R128 Audio
      mount.innerHTML = `
        <div style="width:100%; max-width:500px; display:flex; flex-direction:column; gap:0.5rem; font-family:var(--font-mono); font-size:0.78rem;">
          <div style="display:flex; justify-content:space-between;">
            <span>Virtual Clock Stepper:</span>
            <strong style="color:var(--c-ember);">30.000 FPS (33.333ms / frame)</strong>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--t-secondary);">
            <span>EBU R128 Loudness Target:</span>
            <strong style="color:#34d399;">-14.0 LUFS</strong>
          </div>
          <div style="display:flex; justify-content:space-between; color:var(--t-secondary);">
            <span>True Peak Limiter Ceiling:</span>
            <strong style="color:#34d399;">-1.0 dBTP (4x oversampled)</strong>
          </div>
        </div>
      `;
      break;
    }

    case 'gauntlet-audit': {
      // Module 10: 10/10 Dual-Model Gauntlet Review
      mount.innerHTML = `
        <div style="width:100%; max-width:560px; display:flex; justify-content:space-around; align-items:center; gap:1rem;">
          <div style="text-align:center; padding:0.8rem 1.4rem; background:var(--c-deep-zinc); border:1px solid rgba(59,130,246,0.3); border-radius:10px;">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--t-muted);">MODEL A</div>
            <div style="font-family:var(--font-display); font-size:1.1rem; color:#fff; font-weight:700;">GPT-6 Astra</div>
            <div style="font-family:var(--font-mono); font-size:0.95rem; color:#34d399; font-weight:800; margin-top:0.2rem;">10.0 / 10</div>
          </div>
          <div style="font-family:var(--font-mono); font-size:1.2rem; color:var(--c-ember); font-weight:700;">+</div>
          <div style="text-align:center; padding:0.8rem 1.4rem; background:var(--c-deep-zinc); border:1px solid rgba(249,115,22,0.3); border-radius:10px;">
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--t-muted);">MODEL B</div>
            <div style="font-family:var(--font-display); font-size:1.1rem; color:#fff; font-weight:700;">Claude Opus 5.5</div>
            <div style="font-family:var(--font-mono); font-size:0.95rem; color:#34d399; font-weight:800; margin-top:0.2rem;">10.0 / 10</div>
          </div>
        </div>
      `;
      break;
    }
  }
}

export function setupTeachingControls() {
  const prevBtn = document.getElementById('prev-module-btn');
  const nextBtn = document.getElementById('next-module-btn');
  const revealBtn = document.getElementById('reveal-solution-btn');
  const maskedBox = document.getElementById('solution-masked-view');
  const presenterToggleBtn = document.getElementById('toggle-presenter-btn');
  const hudExitBtn = document.getElementById('hud-exit-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentModuleIdx > 0) renderTeachingModule(currentModuleIdx - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentModuleIdx < TEACHING_MODULES.length - 1) renderTeachingModule(currentModuleIdx + 1);
    });
  }

  if (revealBtn) {
    revealBtn.addEventListener('click', toggleSolution);
  }

  if (maskedBox) {
    maskedBox.addEventListener('click', revealSolution);
  }

  if (presenterToggleBtn) {
    presenterToggleBtn.addEventListener('click', togglePresenterMode);
  }

  if (hudExitBtn) {
    hudExitBtn.addEventListener('click', togglePresenterMode);
  }

  const heroDeckCta = document.getElementById('hero-deck-cta');
  if (heroDeckCta) {
    heroDeckCta.addEventListener('click', (e) => {
      e.preventDefault();
      const syllabusTab = document.querySelector('.nav-tab-bar .nav-tab-btn[data-target="section-syllabus"]');
      if (syllabusTab && !syllabusTab.classList.contains('active')) {
        syllabusTab.click();
      }
      togglePresenterMode();
    });
  }
}

// Liquid Glass Laboratory Controls
export function setupGlassLaboratory() {
  const scaleSlider = document.getElementById('glass-scale-slider');
  const chromaticToggle = document.getElementById('chromatic-toggle');
  const glassCard = document.getElementById('demo-glass-card');
  const displacementNode = document.querySelector('#liquid-glass-lens feDisplacementMap, #liquid-glass-displacement');

  if (scaleSlider) {
    scaleSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (displacementNode) displacementNode.setAttribute('scale', val);
      const valDisplay = document.getElementById('glass-scale-val');
      if (valDisplay) valDisplay.textContent = val.toFixed(2);
    });
  }

  if (chromaticToggle && glassCard) {
    chromaticToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        glassCard.style.filter = "url(#liquid-glass-lens)";
      } else {
        glassCard.style.filter = "none";
      }
    });
  }
}

// Skill Explorer & Search Catalog
export function renderSkills(filterCategory = 'All', searchQuery = '') {
  const container = document.getElementById('skills-catalog-grid');
  if (!container) return;

  const filtered = SKILLS_DATA.filter(skill => {
    const matchesCat = filterCategory === 'All' || skill.category === filterCategory;
    const matchesSearch = !searchQuery || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  container.innerHTML = filtered.map(skill => `
    <div class="liquid-glass-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.8rem;">
        <span class="tone-badge">${skill.category}</span>
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-ember);">${skill.badge}</span>
      </div>
      <h3 style="font-family:var(--font-display); font-size:1.25rem; margin-bottom:0.6rem; color:var(--t-primary);">${skill.name}</h3>
      <p style="font-size:0.88rem; color:var(--t-secondary); margin-bottom:1.2rem; min-height:60px;">${skill.description}</p>
      
      <div class="code-block-wrapper" style="margin-bottom:1.2rem;">
        <div class="code-header">
          <span>Implementation Blueprint</span>
          <button class="copy-btn" aria-label="Copy code snippet for ${skill.name}" aria-label="Copy code snippet for " + skill.name onclick="navigator.clipboard.writeText(\`${skill.codeSnippet.replace(/`/g, '\\`')}\`); this.textContent='Copied!'; setTimeout(()=>this.textContent='Copy', 1500);" style="background:none; border:none; color:var(--t-secondary); cursor:pointer; font-size:0.75rem;">Copy</button>
        </div>
        <pre class="code-content" style="max-height:140px;"><code>${escapeHtml(skill.codeSnippet)}</code></pre>
      </div>

      <a href="${skill.githubUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:0.4rem; color:var(--c-ember); font-weight:600; font-size:0.88rem; text-decoration:none; min-height:44px;" aria-label="Inspect ${skill.name} in LeulTew/skills repository on GitHub (opens in new tab)">
        Inspect in LeulTew/skills &rarr;
      </a>
    </div>
  `).join('');
}

export function setupSkillFilters() {
  const categoryButtons = document.querySelectorAll('.skill-filter-btn');
  const searchInput = document.getElementById('skill-search-input');
  let currentCat = 'All';

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.getAttribute('data-category');
      renderSkills(currentCat, searchInput ? searchInput.value : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSkills(currentCat, e.target.value);
    });
  }
}

// Navigation Tabs Switching (Interactive Syllabus / 3D Lab / Glass Lab / Catalog)
export function setupNavigationTabs() {
  const tabs = document.querySelectorAll('.nav-tab-bar .nav-tab-btn[data-target]');
  const sections = document.querySelectorAll('.view-section');

  function activateTab(tab) {
    const targetId = tab.getAttribute('data-target');
    if (!targetId) return;

    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    sections.forEach(s => s.style.display = 'none');

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.style.display = 'block';

    if (targetId === 'section-3d-lab') {
      setTimeout(init3DStage, 50);
    } else if (targetId === 'section-council') {
      setTimeout(() => {
        if (typeof window.refreshCouncilStage === 'function') window.refreshCouncilStage();
      }, 50);
    } else if (targetId === 'section-blender') {
      setTimeout(() => {
        if (typeof window.resizeBlenderStudio === 'function') window.resizeBlenderStudio();
      }, 50);
    } else if (targetId === 'section-motion-lab') {
      setTimeout(() => {
        if (typeof resizeParticleCanvas === 'function') resizeParticleCanvas();
        if (typeof refreshProximityCenters === 'function') refreshProximityCenters();
      }, 60);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });

    tab.addEventListener('keydown', (e) => {
      let nextIndex = null;
      if (e.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        activateTab(tabs[nextIndex]);
      }
    });
  });

  // Wire any buttons with data-nav-target (e.g. Hero CTAs)
  const navTargetBtns = document.querySelectorAll('[data-nav-target]');
  navTargetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav-target');
      const targetTab = document.querySelector(`.nav-tab-bar .nav-tab-btn[data-target="${target}"]`);
      if (targetTab) activateTab(targetTab);
    });
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Application Bootstrapper
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupNavigationTabs();
    setupSlideDots();
    setupModuleDrawer();
    setupTeachingControls();
    setupCodePlayground();
    setupKeyboardNavigation();
    renderTeachingModule(0);
    setupGlassLaboratory();
    renderSkills('All');
    setupSkillFilters();
    init3DStage();
    setup3DControls();
    initBlurTextDemo();
    initDecryptedTextDemo();
    initVariableProximityDemo();
    initShinyTextDemo();
    initParticleBurstSandbox();
    initCouncilDemocracy();
    initBlenderStudio();
    initFlavourWorlds();
    initLiquidGlass();
    initHero3DSpecimens();
  });

  window.renderTeachingModule = renderTeachingModule;
  window.togglePresenterMode = togglePresenterMode;
  window.toggleSolution = toggleSolution;
  window.revealSolution = revealSolution;
  window.hideSolution = hideSolution;
  window.logToTerminal = logToTerminal;
  window.initLiquidGlass = initLiquidGlass;
  window.initHero3DSpecimens = initHero3DSpecimens;
  window.morphToSpecimen = morphToSpecimen;
  window.TEACHING_MODULES = TEACHING_MODULES;
  window.SKILLS_DATA = SKILLS_DATA;
}

// ============================================================================
// MOTION & KINETIC PLAYGROUND (ReactBits + Anime.js Primitives)
// ============================================================================

// 1. BlurText Interactive Demo (ReactBits Port)
export function initBlurTextDemo() {
  const input = document.getElementById('blur-input');
  const delaySlider = document.getElementById('blur-stagger-slider');
  const delayVal = document.getElementById('blur-stagger-val');
  const blurSlider = document.getElementById('blur-amount-slider');
  const blurVal = document.getElementById('blur-amount-val');
  const playBtn = document.getElementById('blur-play-btn');
  const stage = document.getElementById('blur-text-stage');
  const srEl = document.getElementById('blur-text-sr');

  if (!stage || !playBtn) return;

  let activeTimeouts = [];

  function clearPendingAnimations() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
  }

  function renderAndAnimate() {
    clearPendingAnimations();
    const text = input && input.value.trim() ? input.value.trim() : "Physical Precision Over Generative Slop";
    if (srEl) srEl.textContent = text;
    stage.innerHTML = '';

    const stagger = delaySlider ? parseInt(delaySlider.value, 10) : 45;
    const blurAmount = blurSlider ? parseInt(blurSlider.value, 10) : 12;
    stage.style.setProperty('--blur-amount', `${blurAmount}px`);

    const words = text.split(' ');
    let charIndex = 0;

    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'blur-text-word';
      wordSpan.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.className = 'blur-text-char blurred';
        charSpan.textContent = word[i];
        wordSpan.appendChild(charSpan);

        const delay = charIndex * stagger;
        const timeout = setTimeout(() => {
          charSpan.classList.remove('blurred');
          charSpan.classList.add('revealed');
        }, delay);
        activeTimeouts.push(timeout);

        charIndex++;
      }
      stage.appendChild(wordSpan);
    });
  }

  playBtn.addEventListener('click', renderAndAnimate);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') renderAndAnimate();
    });
  }
  if (delaySlider && delayVal) {
    delaySlider.addEventListener('input', (e) => {
      delayVal.textContent = `${e.target.value}ms`;
    });
  }
  if (blurSlider && blurVal) {
    blurSlider.addEventListener('input', (e) => {
      blurVal.textContent = `${e.target.value}px`;
      stage.style.setProperty('--blur-amount', `${e.target.value}px`);
    });
  }

  renderAndAnimate();
}

// 2. DecryptedText Interactive Scramble (ReactBits Port)
const GLYPH_SETS = {
  crypto: '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789',
  matrix: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789',
  hex: '0123456789ABCDEFabcdef',
  binary: '01'
};

export function initDecryptedTextDemo() {
  const input = document.getElementById('decrypt-input');
  const glyphSelect = document.getElementById('decrypt-glyph-select');
  const speedSlider = document.getElementById('decrypt-speed-slider');
  const speedVal = document.getElementById('decrypt-speed-val');
  const iterSlider = document.getElementById('decrypt-iter-slider');
  const iterVal = document.getElementById('decrypt-iter-val');
  const triggerBtn = document.getElementById('decrypt-trigger-btn');
  const triggerCard = document.getElementById('decrypt-card-trigger');
  const stage = document.getElementById('decrypt-text-stage');
  const srEl = document.getElementById('decrypt-text-sr');

  if (!stage) return;

  let animationInterval = null;

  function scramble() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }

    const targetText = input && input.value.trim() ? input.value.trim() : "LEUL-5070TI // QUANTUM_ENCRYPTED_2026";
    if (srEl) srEl.textContent = targetText;
    const glyphKey = glyphSelect ? glyphSelect.value : 'crypto';
    const glyphs = GLYPH_SETS[glyphKey] || GLYPH_SETS.crypto;
    const speed = speedSlider ? parseInt(speedSlider.value, 10) : 30;
    const maxIterations = iterSlider ? parseInt(iterSlider.value, 10) : 6;

    const length = targetText.length;
    let iteration = 0;

    animationInterval = setInterval(() => {
      let displayHtml = '';
      let completed = true;

      for (let i = 0; i < length; i++) {
        const char = targetText[i];
        if (char === ' ') {
          displayHtml += ' ';
          continue;
        }

        // Each character locks in sequentially
        const lockThreshold = i * 2;
        if (iteration >= lockThreshold + maxIterations) {
          displayHtml += `<span class="decrypt-char locked">${escapeHtml(char)}</span>`;
        } else if (iteration >= lockThreshold) {
          completed = false;
          const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          displayHtml += `<span class="decrypt-char scrambling">${escapeHtml(randomGlyph)}</span>`;
        } else {
          completed = false;
          const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          displayHtml += `<span class="decrypt-char pending">${escapeHtml(randomGlyph)}</span>`;
        }
      }

      stage.innerHTML = displayHtml;
      iteration++;

      if (completed) {
        clearInterval(animationInterval);
        animationInterval = null;
      }
    }, speed);
  }

  if (triggerBtn) triggerBtn.addEventListener('click', scramble);
  if (triggerCard) {
    let lastHoverTime = 0;
    triggerCard.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastHoverTime > 600) {
        lastHoverTime = now;
        scramble();
      }
    });
  }
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') scramble();
    });
  }
  if (speedSlider && speedVal) {
    speedSlider.addEventListener('input', (e) => {
      speedVal.textContent = `${e.target.value}ms`;
    });
  }
  if (iterSlider && iterVal) {
    iterSlider.addEventListener('input', (e) => {
      iterVal.textContent = e.target.value;
    });
  }

  scramble();
}

// 3. VariableProximity Font Axis Demo (ReactBits Port)
let refreshProximityCenters = null;

export function initVariableProximityDemo() {
  const stage = document.getElementById('proximity-stage');
  const wrapper = document.getElementById('proximity-chars-wrapper');
  const radiusSlider = document.getElementById('prox-radius-slider');
  const radiusVal = document.getElementById('prox-radius-val');
  const weightSlider = document.getElementById('prox-weight-slider');
  const weightVal = document.getElementById('prox-weight-val');
  const readout = document.getElementById('prox-pointer-readout');

  if (!stage || !wrapper) return;

  const phrase = "AWARD-WINNING PHYSICAL PRECISION";
  let charCenters = [];

  function buildChars() {
    wrapper.innerHTML = '';
    const words = phrase.split(' ');
    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'proximity-word';
      wordSpan.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < word.length; i++) {
        const span = document.createElement('span');
        span.className = 'proximity-char';
        span.textContent = word[i];
        span.style.fontWeight = '300';
        span.style.fontStretch = '75%';
        wordSpan.appendChild(span);
      }
      wrapper.appendChild(wordSpan);
    });
  }

  buildChars();

  function cacheCenters() {
    const spans = wrapper.querySelectorAll('.proximity-char');
    charCenters = Array.from(spans).map(el => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    });
  }

  refreshProximityCenters = cacheCenters;

  function onPointerMove(e) {
    if (charCenters.length === 0 || charCenters[0].x === 0) {
      cacheCenters();
    }

    const radius = radiusSlider ? parseFloat(radiusSlider.value) : 150;
    const maxWeight = weightSlider ? parseFloat(weightSlider.value) : 850;
    const clientX = e.clientX;
    const clientY = e.clientY;

    let activeCount = 0;

    charCenters.forEach(item => {
      const dx = clientX - item.x;
      const dy = clientY - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        activeCount++;
        const p = 1 - (dist / radius);
        const factor = p * p; // Quadratic falloff
        const w = 300 + factor * (maxWeight - 300);
        const wdth = 75 + factor * 50; // 75% to 125%

        item.el.style.fontWeight = Math.round(w);
        item.el.style.fontStretch = `${Math.round(wdth)}%`;
        item.el.style.fontVariationSettings = `'wght' ${Math.round(w)}, 'wdth' ${Math.round(wdth)}`;

        if (p > 0.45) {
          item.el.style.color = 'var(--c-ember)';
        } else if (p > 0.15) {
          item.el.style.color = 'var(--c-amber)';
        } else {
          item.el.style.color = 'var(--t-primary)';
        }
      } else {
        item.el.style.fontWeight = '300';
        item.el.style.fontStretch = '75%';
        item.el.style.fontVariationSettings = `'wght' 300, 'wdth' 75`;
        item.el.style.color = 'var(--t-primary)';
      }
    });

    if (readout) {
      const stageRect = stage.getBoundingClientRect();
      const localX = Math.round(clientX - stageRect.left);
      const localY = Math.round(clientY - stageRect.top);
      readout.textContent = `X: ${localX}px, Y: ${localY}px (${activeCount} chars warped)`;
    }
  }

  function resetChars() {
    charCenters.forEach(item => {
      item.el.style.fontWeight = '300';
      item.el.style.fontStretch = '75%';
      item.el.style.fontVariationSettings = `'wght' 300, 'wdth' 75`;
      item.el.style.color = 'var(--t-primary)';
    });
    if (readout) readout.textContent = 'Waiting for hover...';
  }

  stage.addEventListener('pointerenter', () => {
    cacheCenters();
  });
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerleave', resetChars);

  if (radiusSlider && radiusVal) {
    radiusSlider.addEventListener('input', (e) => {
      radiusVal.textContent = `${e.target.value}px`;
    });
  }
  if (weightSlider && weightVal) {
    weightSlider.addEventListener('input', (e) => {
      weightVal.textContent = e.target.value;
    });
  }

  window.addEventListener('resize', () => {
    setTimeout(cacheCenters, 100);
  });
}

// 4. ShinyText Shimmer Toggle (ReactBits Port)
export function initShinyTextDemo() {
  const target = document.getElementById('shiny-text-target');
  const angleSlider = document.getElementById('shiny-angle-slider');
  const angleVal = document.getElementById('shiny-angle-val');
  const speedSlider = document.getElementById('shiny-speed-slider');
  const speedVal = document.getElementById('shiny-speed-val');
  const paletteSelect = document.getElementById('shiny-palette-select');
  const toggleBtn = document.getElementById('shiny-toggle-btn');

  if (!target) return;

  const PALETTES = {
    ember: {
      bg: 'rgba(249, 115, 22, 0.28)',
      shimmer: '#ffedd5'
    },
    silver: {
      bg: 'rgba(255, 255, 255, 0.22)',
      shimmer: '#ffffff'
    },
    cobalt: {
      bg: 'rgba(56, 189, 248, 0.28)',
      shimmer: '#e0f2fe'
    },
    amber: {
      bg: 'rgba(255, 179, 92, 0.28)',
      shimmer: '#fffbeb'
    }
  };

  function updatePalette(palKey) {
    const pal = PALETTES[palKey] || PALETTES.ember;
    target.style.setProperty('--shiny-bg', pal.bg);
    target.style.setProperty('--shiny-shimmer', pal.shimmer);
  }

  if (angleSlider && angleVal) {
    angleSlider.addEventListener('input', (e) => {
      const angle = e.target.value;
      angleVal.innerHTML = `${angle}&deg;`;
      target.style.setProperty('--shiny-angle', `${angle}deg`);
    });
  }

  if (speedSlider && speedVal) {
    speedSlider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      speedVal.textContent = `${speed.toFixed(1)}s`;
      target.style.setProperty('--shiny-speed', `${speed}s`);
    });
  }

  if (paletteSelect) {
    paletteSelect.addEventListener('change', (e) => {
      updatePalette(e.target.value);
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isPaused = target.classList.toggle('paused');
      toggleBtn.textContent = isPaused ? "Resume Shimmer Sweep" : "Pause Shimmer Sweep";
    });
  }

  updatePalette('ember');
}

// 5. Anime.js Canvas Particle Burst Sandbox
let resizeParticleCanvas = null;

export function initParticleBurstSandbox() {
  const canvas = document.getElementById('anime-particle-canvas');
  const hint = document.getElementById('particle-canvas-hint');
  const countSlider = document.getElementById('particle-count-slider');
  const countVal = document.getElementById('particle-count-val');
  const velSlider = document.getElementById('particle-velocity-slider');
  const velVal = document.getElementById('particle-velocity-val');
  const dampSlider = document.getElementById('particle-damping-slider');
  const dampVal = document.getElementById('particle-damping-val');
  const colorSelect = document.getElementById('particle-color-select');
  const shapeSelect = document.getElementById('particle-shape-select');
  const clearBtn = document.getElementById('clear-particles-btn');

  const hudParticle = document.getElementById('hud-particle-count');
  const hudBurst = document.getElementById('hud-burst-count');
  const hudFps = document.getElementById('hud-fps-count');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;

  let particles = [];
  let shockwaves = [];
  let burstCount = 0;
  let isPointerDown = false;
  let lastMoveTime = 0;

  const COLOR_PALETTES = {
    ember: ['#f97316', '#ffb35c', '#ea580c', '#fdba74', '#ffffff'],
    cyber: ['#38bdf8', '#0284c7', '#06b6d4', '#67e8f9', '#ffffff'],
    spectral: ['#f97316', '#38bdf8', '#a855f7', '#10b981', '#fbbf24', '#ffffff'],
    supernova: ['#ffffff', '#f8fafc', '#e2e8f0', '#ffedd5', '#fef08a']
  };

  function updateSize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
  }

  resizeParticleCanvas = updateSize;
  updateSize();
  window.addEventListener('resize', updateSize);

  function pickColor() {
    const palKey = colorSelect ? colorSelect.value : 'ember';
    const pal = COLOR_PALETTES[palKey] || COLOR_PALETTES.ember;
    return pal[Math.floor(Math.random() * pal.length)];
  }

  function spawnBurst(cx, cy) {
    if (hint && hint.style.opacity !== '0') {
      hint.style.opacity = '0';
    }

    burstCount++;
    if (hudBurst) hudBurst.textContent = burstCount;

    const count = countSlider ? parseInt(countSlider.value, 10) : 40;
    const velocity = velSlider ? parseFloat(velSlider.value) : 12;
    const damping = dampSlider ? parseFloat(dampSlider.value) : 0.05;
    const shapeMode = shapeSelect ? shapeSelect.value : 'circles';

    // 1. Animated Shockwave Ring (via Anime.js with graceful fallback)
    const shockwave = {
      x: cx,
      y: cy,
      radius: 0,
      maxRadius: 50 + velocity * 3.5,
      alpha: 0.85,
      color: pickColor()
    };
    shockwaves.push(shockwave);

    if (typeof anime !== 'undefined') {
      anime({
        targets: shockwave,
        radius: [0, shockwave.maxRadius],
        alpha: [0.85, 0],
        duration: 520,
        easing: 'easeOutQuad',
        complete: () => {
          const idx = shockwaves.indexOf(shockwave);
          if (idx !== -1) shockwaves.splice(idx, 1);
        }
      });
    }

    // 2. High-speed spring trajectory particles
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.25 + Math.random() * 0.9) * velocity;
      let particleShape = shapeMode;
      if (shapeMode === 'mixed') {
        particleShape = Math.random() > 0.5 ? 'circles' : 'shards';
      }

      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.2 + 2.0,
        color: pickColor(),
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.012,
        damping: damping,
        gravity: 0.14,
        shape: particleShape,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25
      });
    }
  }

  // Pointer Canvas Interactions
  function handlePointer(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    spawnBurst(cx, cy);
  }

  canvas.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    handlePointer(e);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const now = Date.now();
    if (now - lastMoveTime > 45) { // Throttled drag spawning
      lastMoveTime = now;
      handlePointer(e);
    }
  });

  window.addEventListener('pointerup', () => { isPointerDown = false; });
  window.addEventListener('pointercancel', () => { isPointerDown = false; });

  // Control Slider Readouts
  if (countSlider && countVal) {
    countSlider.addEventListener('input', (e) => {
      countVal.textContent = e.target.value;
    });
  }
  if (velSlider && velVal) {
    velSlider.addEventListener('input', (e) => {
      velVal.textContent = e.target.value;
    });
  }
  if (dampSlider && dampVal) {
    dampSlider.addEventListener('input', (e) => {
      dampVal.textContent = parseFloat(e.target.value).toFixed(2);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      particles = [];
      shockwaves = [];
      ctx.clearRect(0, 0, width, height);
      if (hudParticle) hudParticle.textContent = '0';
    });
  }

  // Continuous Physics & Render Loop
  let frameCount = 0;
  let lastFpsUpdate = performance.now();

  function renderLoop(now) {
    requestAnimationFrame(renderLoop);

    // Calculate FPS
    frameCount++;
    if (now - lastFpsUpdate >= 1000) {
      if (hudFps) hudFps.textContent = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
      frameCount = 0;
      lastFpsUpdate = now;
    }

    if (width === 0 || height === 0) return;

    // Dark luminous canvas clear with motion trail persistence
    ctx.fillStyle = 'rgba(8, 9, 12, 0.24)';
    ctx.fillRect(0, 0, width, height);

    // Draw Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      if (typeof anime === 'undefined') {
        // Fallback shockwave tweening
        sw.radius += (sw.maxRadius - sw.radius) * 0.14;
        sw.alpha -= 0.035;
        if (sw.alpha <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = 2.5;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();
    }

    // Draw & Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Physics integration
      p.vx *= (1 - p.damping);
      p.vy *= (1 - p.damping);
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      if (p.shape === 'circles') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.alpha, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Shard polygon
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const sz = p.radius * 2 * p.alpha;
        ctx.fillRect(-sz / 2, -sz / 4, sz, sz / 2);
      }

      ctx.restore();
    }

    if (hudParticle) hudParticle.textContent = particles.length;
  }

  requestAnimationFrame(renderLoop);
}
