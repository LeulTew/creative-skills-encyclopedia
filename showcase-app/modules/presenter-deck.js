/**
 * Socratic Teaching Deck & Presentation Engine (2026 Edition)
 * Creative Engineering Encyclopedia · Leul Tewelde
 */

export const PRESENTATION_SLIDES = [
  {
    num: "01",
    total: "10",
    specimen: "kinetic_core",
    badge: "FOUNDATION 01",
    title: "Headless Blender 5.2 Automation",
    thesis: "Running headless Blender with OptiX Cycles GPU acceleration compiles complex 3D assets directly within continuous integration pipelines.",
    bullets: [
      "Automated bpy Python scripting via Blender MCP bridge or background CLI execution.",
      "Hardware-accelerated Cycles baking on NVIDIA RTX OptiX device backend.",
      "Deterministic glTF / GLB export with embedded PBR roughness and normal maps."
    ],
    code: `# Headless Blender 5.2 Python execution
blender.exe -b --python tools/build_blender_assets.py
# Exports: kinetic_core.glb with PBR metallic nodes and optimized normals`
  },
  {
    num: "02",
    total: "10",
    specimen: "kinetic_core",
    badge: "FOUNDATION 02",
    title: "Studio Lighting & PBR Tone Mapping",
    thesis: "Khronos PBR Neutral tone mapping paired with physical roughness and metallic reflections delivers studio-grade photorealism in browser.",
    bullets: [
      "Enforce THREE.NeutralToneMapping with exposure 1.05 to preserve specular highlights without clipping.",
      "Meshopt asset compression decompressing complex geometry under 16ms per frame.",
      "Studio 3-point lighting synchronized dynamically with whole-canvas theme tokens."
    ],
    code: `# Three.js PBR Neutral Tone Mapping Setup
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;`
  },
  {
    num: "03",
    total: "10",
    specimen: "dna_helix",
    badge: "FOUNDATION 03",
    title: "Unified RAF Motion Orchestration",
    thesis: "Locking smooth-scroll physics and scroll triggers to a single requestAnimationFrame loop guarantees butter-smooth 60fps rendering.",
    bullets: [
      "Lock Lenis 1.1+ smooth scroll and GSAP 3.12+ onto a single shared requestAnimationFrame ticker.",
      "Suppress browser lag smoothing via gsap.ticker.lagSmoothing(0) to prevent scrub stutter.",
      "Scrub 3D camera matrices and Euler rotations in direct mathematical sync with scroll distance."
    ],
    code: `# Unified Lenis + GSAP Ticker Synchronization
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);`
  },
  {
    num: "04",
    total: "10",
    specimen: "dna_helix",
    badge: "FOUNDATION 04",
    title: "Kinetic Display Typography",
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
  text-wrap: balance;
}`
  },
  {
    num: "05",
    total: "10",
    specimen: "kinetic_core",
    badge: "FOUNDATION 05",
    title: "Whole-Canvas Chromatic Theming",
    thesis: "Variant world architectures where lighting, ambient depth, tokens, and materials dynamically transform with verified WCAG AA contrast.",
    bullets: [
      "Dynamic data-flavour attributes orchestrating whole-canvas lighting and surface depth.",
      "Simultaneous interpolation of Three.js key, fill, and rim light colors during theme transitions.",
      "Independently calibrated contrast ratios for all foreground and background tokens."
    ],
    code: `/* Whole-Canvas Flavour World tokens */
body[data-flavour="ember"] {
  --c-accent: #f97316;
  --c-accent-glow: rgba(249, 115, 22, 0.45);
  --bg-canvas: #08090d;
}`
  },
  {
    num: "06",
    total: "10",
    specimen: "neural_sphere",
    badge: "FOUNDATION 06",
    title: "Frontier Micro-UI & Registries",
    thesis: "Porting cutting-edge 2026 registry primitives (React Bits, Magic UI, 21st.dev) to clean, zero-dependency vanilla architectures.",
    bullets: [
      "Bridge React Bits text physics (BlurText, DecryptedText) to vanilla GSAP SplitText.",
      "Spring-driven micro-interactions responding to cursor velocity without DOM bloat.",
      "Strict CSS containment and will-change optimization for hardware compositing."
    ],
    code: `# Vanilla GSAP Port of ReactBits BlurText
const split = new SplitText(element, { type: 'words,chars' });
gsap.from(split.chars, {
  opacity: 0,
  filter: 'blur(8px)',
  y: 16,
  stagger: 0.03,
  ease: 'power3.out'
});`
  },
  {
    num: "07",
    total: "10",
    specimen: "neural_sphere",
    badge: "FOUNDATION 07",
    title: "Procedural Shaders & Raymarching",
    thesis: "Pure mathematical signed distance fields (SDFs) generate infinitely smooth procedural geometries and volumetric fields.",
    bullets: [
      "Raymarching inside fragment shaders with bounded bounding-box step limits.",
      "Smooth minimum blending smin(d1, d2, k) for organic, artifact-free mesh unions.",
      "Volumetric light absorption and subsurface scattering without geometry rasterization."
    ],
    code: `/* GLSL Smooth Minimum SDF Blending */
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}`
  },
  {
    num: "08",
    total: "10",
    specimen: "cyber_monolith",
    badge: "FOUNDATION 08",
    title: "Deterministic Video Automation",
    thesis: "Seek-safe HTML composition pipelines rendering frame-accurate 60fps MP4s via HyperFrames and headless browser capture.",
    bullets: [
      "Single paused timeline driving seek-safe, deterministic animations.",
      "Headless Chrome frame-by-frame capture with zero dropped frames.",
      "Automated audio stems and subtitles synchronized directly to visual timelines."
    ],
    code: `# Render deterministic 60fps video
hyperframes render src/composition.html -o dist/showcase.mp4 --fps 60`
  },
  {
    num: "09",
    total: "10",
    specimen: "kinetic_core",
    badge: "FOUNDATION 09",
    title: "1-Pixel Registration & Still Handoff",
    thesis: "Zero-FOUC web delivery bridging static pre-rendered packaging stills to live 60fps WebGL viewports without layout shifts.",
    bullets: [
      "Lossless WebP still served immediately on first paint matching 3D camera matrix.",
      "link rel expect blocking render prevents unstyled layout flashes.",
      "Live Three.js initializes in background and smoothly cross-fades over the still."
    ],
    code: `<!-- Zero-FOUC Render-Blocking Hint -->
<link rel="expect" href="#stage-container" blocking="render">`
  },
  {
    num: "10",
    total: "10",
    specimen: "cyber_monolith",
    badge: "FOUNDATION 10",
    title: "Responsive Mobile Frustums",
    thesis: "Dynamic vertical FOV and camera frustum adaptation ensuring complex 3D viewports never clip on 390px mobile screens.",
    bullets: [
      "Dynamic FOV scaling based on aspect ratio: fov = f(aspect).",
      "Dynamic camera distance: push camera back on narrow viewports to preserve margins.",
      "Touch-safe orbit damping preventing unintended page scroll locks on iOS Safari."
    ],
    code: `/* Dynamic Frustum Calibration */
const aspect = width / height;
if (width <= 768) {
  camera.fov = Math.max(48, Math.min(58, 45 + (1.0 - aspect) * 14));
  camera.position.z = 7.8;
} else {
  camera.fov = 45;
  camera.position.z = 5.8;
}`
  }
];

export class PresenterDeck {
  constructor() {
    this.currentIndex = 0;
    this.totalSlides = PRESENTATION_SLIDES.length;
    this.container = null;
    this.dotsContainer = null;
    this.counterEl = null;
    this.prevBtn = null;
    this.nextBtn = null;

    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    this.container = document.getElementById('deck-slide-container');
    this.dotsContainer = document.getElementById('deck-dots');
    this.counterEl = document.getElementById('deck-slide-counter');
    this.prevBtn = document.getElementById('deck-prev-btn');
    this.nextBtn = document.getElementById('deck-next-btn');

    if (!this.container) return;

    this.renderDots();
    this.renderSlide(0);
    this.setupListeners();
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    PRESENTATION_SLIDES.forEach((slide, idx) => {
      const dot = document.createElement('button');
      dot.className = `deck-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}: ${slide.title}`);
      dot.addEventListener('click', () => this.goToSlide(idx));
      this.dotsContainer.appendChild(dot);
    });
  }

  renderSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    this.currentIndex = index;
    const slide = PRESENTATION_SLIDES[index];

    // Escape HTML for code preview
    const escapedCode = slide.code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const bulletsHtml = slide.bullets
      .map(b => `<li class="bullet-item"><span class="bullet-marker">&rsaquo;</span><span class="bullet-text">${b}</span></li>`)
      .join('');

    this.container.innerHTML = `
      <div class="slide-header">
        <span class="slide-badge">${slide.badge}</span>
        <span class="slide-specimen-tag">3D Specimen: ${slide.specimen.toUpperCase()}</span>
      </div>
      <h3 class="slide-title">${slide.title}</h3>
      <p class="slide-thesis">${slide.thesis}</p>
      
      <div class="slide-body">
        <div class="slide-principles">
          <h4 class="slide-subhead">Key Engineering Insights</h4>
          <ul class="bullet-list">
            ${bulletsHtml}
          </ul>
        </div>

        <div class="slide-recipe">
          <h4 class="slide-subhead">Production Recipe</h4>
          <div class="code-box">
            <pre><code>${escapedCode}</code></pre>
            <button class="copy-code-btn" data-copy="${encodeURIComponent(slide.code)}" aria-label="Copy code">Copy</button>
          </div>
        </div>
      </div>
    `;

    // Wire copy button
    const copyBtn = this.container.querySelector('.copy-code-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = decodeURIComponent(copyBtn.getAttribute('data-copy'));
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
          });
        }
      });
    }

    // Update Counter & Dots
    if (this.counterEl) {
      this.counterEl.textContent = `Slide ${String(index + 1).padStart(2, '0')} / ${String(this.totalSlides).padStart(2, '0')}`;
    }

    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.deck-dot');
      dots.forEach((dot, idx) => {
        if (idx === index) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    // Update 3D Stage Specimen smoothly
    if (window.stage3D && typeof window.stage3D.setSpecimen === 'function' && slide.specimen) {
      window.stage3D.setSpecimen(slide.specimen);
    }
  }

  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.renderSlide(this.currentIndex + 1);
    } else {
      this.renderSlide(0); // Loop
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.renderSlide(this.currentIndex - 1);
    } else {
      this.renderSlide(this.totalSlides - 1);
    }
  }

  goToSlide(index) {
    this.renderSlide(index);
  }

  setupListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      }
    });
  }
}

export function initPresenterDeck() {
  if (typeof window === 'undefined') return null;
  if (!window.presenterDeck) {
    window.presenterDeck = new PresenterDeck();
  }
  return window.presenterDeck;
}

