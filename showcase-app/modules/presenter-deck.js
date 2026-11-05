/**
 * Socratic Teaching Deck & Presentation Engine (2026 Edition)
 * Creative Engineering Encyclopedia · Leul Tewelde
 */

export const PRESENTATION_SLIDES = [
  {
    num: "01",
    total: "10",
    specimen: "monolith",
    badge: "FOUNDATION 01",
    title: "The Zero-Slop Standard",
    thesis: "True craft rejects synthetic templates, emojis, and generic patterns in favor of bespoke architectural intentionality.",
    bullets: [
      "Signature bespoke centerpiece in the first viewport with physical PBR materials.",
      "Strict word budgets: hero <= 6 words, headline <= 5 words, CTA <= 3 words.",
      "Automated anti-slop ban-list linting: zero emojis, zero double-slash dividers, zero nested cards."
    ],
    code: `# Automated anti-slop verification gate
node tools/anti-slop-lint.mjs --strict --zero-tolerance`
  },
  {
    num: "02",
    total: "10",
    specimen: "monolith",
    badge: "FOUNDATION 02",
    title: "Editorial Display Typography",
    thesis: "Typography scaled with mathematical precision, variable font axes, and wide tracking creates authoritative digital presence.",
    bullets: [
      "Mathematical clamp scaling: clamp(3.6rem, 9.5vw, 9.2rem) for responsive poster display.",
      "Variable font axes: font-variation-settings for dynamic optical weight and slant adjustments.",
      "Treat non-latin scripts and international glyph sets with dignity and exact font-feature-settings."
    ],
    code: `/* Fluid poster clamp typography */
.hero-display {
  font-family: var(--font-display);
  font-size: clamp(3.6rem, 9.5vw, 9.2rem);
  line-height: 0.92;
  letter-spacing: -0.035em;
}`
  },
  {
    num: "03",
    total: "10",
    specimen: "dna",
    badge: "FOUNDATION 03",
    title: "WebGL & PBR Shaders",
    thesis: "Khronos PBR Neutral tone mapping paired with physical roughness and metallic reflections delivers studio-grade rendering in browser.",
    bullets: [
      "Enforce THREE.NeutralToneMapping with exposure 1.05 to avoid blown-out specular highlights.",
      "Meshopt asset compression decompressing complex geometry under 16ms per frame.",
      "Studio 3-point lighting synchronized dynamically with whole-canvas theme tokens."
    ],
    code: `# Three.js PBR Neutral Tone Mapping Setup
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;`
  },
  {
    num: "04",
    total: "10",
    specimen: "dna",
    badge: "FOUNDATION 04",
    title: "Procedural Raymarching & SDFs",
    thesis: "Pure mathematical signed distance fields (SDFs) generate infinitely smooth procedural geometries and volumetric fields.",
    bullets: [
      "Raymarching inside fragment shaders with bounded bounding-box step limits.",
      "Smooth minimum blending smin(d1, d2, k) for organic, artifact-free mesh unions.",
      "Volumetric light absorption and subsurface scattering without geometry rasterization."
    ],
    code: `# GLSL Smooth Minimum SDF Blending
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}`
  },
  {
    num: "05",
    total: "10",
    specimen: "sphere",
    badge: "FOUNDATION 05",
    title: "Headless Blender 5.2 Automation",
    thesis: "Running headless Blender with OptiX Cycles GPU acceleration automates complex 3D asset generation directly in build pipelines.",
    bullets: [
      "Automated bpy Python scripting via Blender MCP bridge or background CLI calls.",
      "Hardware-accelerated Cycles baking on NVIDIA RTX OptiX device backend.",
      "Deterministic glTF / GLB export with embedded PBR roughness and normal maps."
    ],
    code: `# Headless Blender 5.2 Python execution
blender.exe -b --python tools/generate_blender_assets.py
# Exports: monolith.glb, dna_helix.glb, neural_sphere.glb`
  },
  {
    num: "06",
    total: "10",
    specimen: "pack",
    badge: "FOUNDATION 06",
    title: "Mesh Generation & Pack Modeling",
    thesis: "Physical packaging reconstruction matching real-world packaging folds, fin seals, and texture maps for authentic product sites.",
    bullets: [
      "Authentic pillow pack geometry with top and bottom crimp seals and teeth cuts.",
      "High-resolution 2048x2048 WebP normal and roughness map atlas registration.",
      "1-pixel registration handoff between static photographic still and live WebGL canvas."
    ],
    code: `# GLTFLoader loading authentic pack geometry
loader.load('assets/models/bag.glb', (gltf) => {
  const mesh = gltf.scene;
  mesh.traverse((node) => {
    if (node.isMesh) node.material.roughness = 0.25;
  });
});`
  },
  {
    num: "07",
    total: "10",
    specimen: "temple",
    badge: "FOUNDATION 07",
    title: "Kinetic Motion & Lenis Orchestration",
    thesis: "Unifying smooth scrolling with kinetic typography on a single requestAnimationFrame loop completely eliminates scroll jank.",
    bullets: [
      "Lenis 1.1+ scroll event routed into GSAP ScrollTrigger via single ticker loop.",
      "lagSmoothing(0) ensures deterministic frame pacing during fast wheel scrubbing.",
      "Sentence-by-sentence text reveals: scrubbed opacity transition from 0.18 to 1.0."
    ],
    code: `# Lenis & GSAP Single-RAF Synchronization
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);`
  },
  {
    num: "08",
    total: "10",
    specimen: "temple",
    badge: "FOUNDATION 08",
    title: "Frontier UI Registries",
    thesis: "Leveraging 2026 frontier registries (React Bits, Magic UI, 21st.dev) with strict layout preservation and zero dependency bloat.",
    bullets: [
      "NumberFlow for layout-preserving spring animated numerals and metrics.",
      "React Bits kinetic text patterns ported cleanly to lightweight vanilla TypeScript.",
      "Tactile glass reflection stack using SVG displacement maps instead of heavy CSS blurs."
    ],
    code: `# Automated Frontier Registry Synchronization
node tools/sync-frontier-registries.mjs --check`
  },
  {
    num: "09",
    total: "10",
    specimen: "sphere",
    badge: "FOUNDATION 09",
    title: "Whole-Canvas Flavour Worlds",
    thesis: "Flavour worlds define calibrated thematic environments that transform typography, background tints, and 3D lighting simultaneously.",
    bullets: [
      "Tokens defined in CSS custom properties: [data-flavour='ember|cobalt|harvest|cosmic'].",
      "Rigorous contrast ratios: WCAG AA compliant across every single active state.",
      "Dynamic 3D light color synchronization: stage3D.setFlavour() smooth lerp."
    ],
    code: `/* Whole-Canvas Flavour Tokens */
body[data-flavour="ember"] {
  --c-accent: #f97316;
  --bg-primary: #090a0f;
  --t-primary: #f8fafc;
}`
  },
  {
    num: "10",
    total: "10",
    specimen: "pack",
    badge: "FOUNDATION 10",
    title: "Deterministic Video Pipelines",
    thesis: "HyperFrames deterministic render engine allows turning HTML compositions into 60fps MP4 video without browser lag.",
    bullets: [
      "Single paused timeline seek-safe mechanics for exact frame-by-frame rendering.",
      "ExtendScript bridges controlling Adobe Premiere Pro and DaVinci Resolve Studio.",
      "Automated site capture film recording buttery-smooth video for marketing launches."
    ],
    code: `# HyperFrames CLI verification and rendering
hyperframes check && hyperframes render --fps 60`
  }
];

export function initPresenterDeck() {
  const viewport = document.getElementById('slide-viewport');
  const prevBtn = document.getElementById('deck-prev');
  const nextBtn = document.getElementById('deck-next');
  const counter = document.getElementById('slide-counter');
  const indicatorsBox = document.getElementById('deck-indicators');

  if (!viewport) return;

  let currentSlideIndex = 0;

  // Build Indicator Dots
  if (indicatorsBox) {
    indicatorsBox.innerHTML = PRESENTATION_SLIDES.map((_, i) => `
      <button class="slide-indicator-dot ${i === 0 ? 'active' : ''}" data-slide-dot="${i}" aria-label="Go to slide ${i + 1}"></button>
    `).join('');

    indicatorsBox.querySelectorAll('[data-slide-dot]').forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-slide-dot'), 10);
        if (!isNaN(idx)) goToSlide(idx);
      });
    });
  }

  function renderSlide(index) {
    const slide = PRESENTATION_SLIDES[index];
    if (!slide) return;

    if (counter) {
      counter.textContent = `Slide ${slide.num} / ${slide.total}`;
    }

    // Update indicator dots
    if (indicatorsBox) {
      indicatorsBox.querySelectorAll('[data-slide-dot]').forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    viewport.innerHTML = `
      <div class="active-slide-card" data-slide-num="${slide.num}">
        <div class="slide-header">
          <span class="slide-badge">${escapeHtml(slide.badge)}</span>
          <span class="slide-specimen-tag">3D Specimen: ${escapeHtml(slide.specimen.toUpperCase())}</span>
        </div>

        <h3 class="slide-title">${escapeHtml(slide.title)}</h3>
        <p class="slide-thesis">${escapeHtml(slide.thesis)}</p>

        <div class="slide-body">
          <div class="slide-bullets-wrap">
            <h4 class="slide-section-heading">Key Engineering Principles</h4>
            <ul class="slide-bullets">
              ${slide.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          </div>

          <div class="slide-code-wrap">
            <h4 class="slide-section-heading">Production Recipe</h4>
            <pre class="slide-code"><code>${escapeHtml(slide.code)}</code></pre>
          </div>
        </div>
      </div>
    `;

    // Synchronize 3D Stage Specimen
    if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
      try {
        window.stage3D.setSpecimen(slide.specimen);
      } catch (err) {}
    }
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= PRESENTATION_SLIDES.length) index = PRESENTATION_SLIDES.length - 1;
    currentSlideIndex = index;
    renderSlide(currentSlideIndex);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlideIndex + 1);
    });
  }

  // Keyboard navigation for presentation
  window.addEventListener('keydown', (e) => {
    // Only intercept if not focused in an input field
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'Space') {
      if (currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
        e.preventDefault();
        goToSlide(currentSlideIndex + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlideIndex > 0) {
        e.preventDefault();
        goToSlide(currentSlideIndex - 1);
      }
    }
  });

  // Initial render
  renderSlide(0);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
