/**
 * Master Application Orchestration Engine (2026 Edition)
 * Creative Skills & Engineering Encyclopedia
 *
 * Unifies:
 * 1. Fixed WebGL 3D stage with Three.js r170+ PBR Neutral tone mapping
 * 2. Lenis 1.1+ and GSAP ScrollTrigger single-RAF choreography
 * 3. Whole-canvas chromatic flavour worlds (WCAG AA calibrated)
 * 4. Headless Blender 5.2 interactive inspection workbench
 * 5. Adversarial Council Chamber & Visual Hill-Climbing evaluations
 */

import {
  initStage3D,
  setSpecimen,
  setFlavour,
  setScrollProgress,
  setWireframe,
  setRoughness,
  setMetalness,
  setLightYaw,
  getStageState,
  disposeStage3D
} from './modules/stage-3d.js';

import {
  initScrollChoreography,
  initScrollChoreographer,
  ScrollChoreographer
} from './modules/scroll-choreographer.js';

import {
  SKILLS_DATA,
  TEACHING_MODULES
} from './skills-data.js';

// Syllabus to 3D Specimen Mapping
const SYLLABUS_SPECIMENS = {
  '0': 'monolith',
  '1': 'monolith',
  '2': 'dna',
  '3': 'dna',
  '4': 'sphere',
  '5': 'sphere',
  '6': 'temple',
  '7': 'temple',
  '8': 'pack',
  '9': 'pack'
};

// Global WebGL capability detection
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// User Reduced Motion Preference
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 1. Initialize Fixed Fullscreen 3D WebGL Stage
 */
function setup3DStage() {
  try {
    const canvas = document.getElementById('webgl-stage');
    if (!canvas) return null;

    if (!isWebGLSupported()) {
      return null;
    }

    const stageInstance = initStage3D();
    return stageInstance || window.stage3D;
  } catch (err) {
    return null;
  }
}

/**
 * 2. Initialize Lenis & GSAP Scroll Choreographer
 */
function setupScrollEngine() {
  try {
    const choreography = initScrollChoreography();
    return choreography || window.scrollChoreography;
  } catch (err) {
    return null;
  }
}

/**
 * 3. Wire Whole-Canvas SunChips Flavour World Switcher
 */
function setupFlavourWorlds() {
  const flavourPills = document.querySelectorAll('[data-set-flavour]');
  if (!flavourPills.length) return;

  flavourPills.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const flavourId = btn.getAttribute('data-set-flavour');
      if (!flavourId) return;

      // Update whole-canvas theme tokens
      if (document.body) {
        document.body.dataset.flavour = flavourId;
        document.body.setAttribute('data-flavour', flavourId);
      }

      // Update active button state
      flavourPills.forEach((p) => {
        const isActive = (p === btn);
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });

      // Synchronize 3D stage lighting and accent inlays
      if (window.stage3D && typeof window.stage3D.setFlavour === 'function') {
        try {
          window.stage3D.setFlavour(flavourId);
        } catch (err) {}
      }
    });
  });
}

/**
 * 4. Wire Blender Lab Interactive Inspection Controls
 */
function setupBlenderLabControls() {
  // Specimen Selector Buttons
  const specimenButtons = document.querySelectorAll('[data-specimen]');
  specimenButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const specId = btn.getAttribute('data-specimen');
      if (!specId) return;

      // Update active button class
      specimenButtons.forEach((b) => {
        const isMatch = (b === btn || b.getAttribute('data-specimen') === specId);
        b.classList.toggle('active', isMatch);
        b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      // Update 3D Stage Model
      if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
        try {
          window.stage3D.setSpecimen(specId);
        } catch (err) {}
      }
    });
  });

  // Wireframe Toggle
  const wireframeToggle = document.getElementById('wireframe-toggle');
  if (wireframeToggle) {
    wireframeToggle.addEventListener('change', (e) => {
      const isWire = e.target.checked;
      if (window.stage3D && typeof window.stage3D.setWireframe === 'function') {
        try {
          window.stage3D.setWireframe(isWire);
        } catch (err) {}
      }
    });
  }

  // Roughness Slider
  const roughnessSlider = document.getElementById('roughness-slider');
  const roughnessVal = document.getElementById('roughness-val');
  if (roughnessSlider) {
    roughnessSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      if (roughnessVal) roughnessVal.textContent = val.toFixed(2);
      if (window.stage3D && typeof window.stage3D.setRoughness === 'function') {
        try {
          window.stage3D.setRoughness(val);
        } catch (err) {}
      }
    });
  }

  // Metalness Slider
  const metalnessSlider = document.getElementById('metalness-slider');
  const metalnessVal = document.getElementById('metalness-val');
  if (metalnessSlider) {
    metalnessSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      if (metalnessVal) metalnessVal.textContent = val.toFixed(2);
      if (window.stage3D && typeof window.stage3D.setMetalness === 'function') {
        try {
          window.stage3D.setMetalness(val);
        } catch (err) {}
      }
    });
  }

  // Key Light Yaw Slider
  const lightSlider = document.getElementById('light-slider');
  const lightVal = document.getElementById('light-val');
  if (lightSlider) {
    lightSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      if (lightVal) lightVal.innerHTML = `${Math.round(val)}&deg;`;
      if (window.stage3D && typeof window.stage3D.setLightYaw === 'function') {
        try {
          window.stage3D.setLightYaw(val);
        } catch (err) {}
      }
    });
  }
}

/**
 * 5. Wire Teachable Syllabus Curriculum Modules
 */
function setupSyllabusInteractivity() {
  const curriculumCards = document.querySelectorAll('.curriculum-card[data-module-index]');
  if (!curriculumCards.length) return;

  curriculumCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = card.getAttribute('data-module-index');
      const targetSpecimen = SYLLABUS_SPECIMENS[idx] || 'monolith';

      // 1. Highlight clicked card
      curriculumCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');

      // 2. Set 3D specimen
      if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
        try {
          window.stage3D.setSpecimen(targetSpecimen);
        } catch (err) {}
      }

      // 3. Update Blender lab active button state to match
      const labButtons = document.querySelectorAll('.specimen-btn[data-specimen]');
      labButtons.forEach((b) => {
        const isMatch = b.getAttribute('data-specimen') === targetSpecimen;
        b.classList.toggle('active', isMatch);
        b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      // 4. Smooth scroll to chapter using Lenis if available
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(card, { offset: -90, duration: 1.0 });
      } else {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/**
 * 6. Wire Council Chamber Radar Chart & Evaluation Metrics
 */
function setupCouncilChamber() {
  const memberCards = document.querySelectorAll('.member-card');
  const radarRows = document.querySelectorAll('.radar-row');

  // Interactive Member Cards
  memberCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('highlighted');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('highlighted');
    });
  });

  // Animated Radar Bars on Viewport Intersection
  if ('IntersectionObserver' in window && radarRows.length) {
    const radarObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.radar-bar-fill');
          fills.forEach((fill) => {
            fill.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
            fill.style.width = '100%';
          });
          radarObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const councilSection = document.getElementById('council');
    if (councilSection) {
      radarObserver.observe(councilSection);
    }
  }
}

/**
 * 7. Header Navigation Smooth Scroll Anchor Interception
 */
function setupHeaderNavigation() {
  const navLinks = document.querySelectorAll('.site-header a[href^="#"], .footer-links a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Master Application Bootstrap Routine
 */
export function bootstrapApp() {
  try {
    // 1. Initialize Stage3D WebGL PBR Engine
    setup3DStage();

    // 2. Initialize Lenis / GSAP Scroll Choreography
    setupScrollEngine();

    // 3. Wire Whole-Canvas Flavour Worlds
    setupFlavourWorlds();

    // 4. Wire Blender Lab Controls
    setupBlenderLabControls();

    // 5. Wire Teachable Syllabus Cards
    setupSyllabusInteractivity();

    // 6. Wire Council Chamber Evaluations
    setupCouncilChamber();

    // 7. Wire Site Header Navigation
    setupHeaderNavigation();
  } catch (err) {
    // Defensive error boundary
  }
}

// Global window exposure for tests and console inspections
if (typeof window !== 'undefined') {
  window.bootstrapApp = bootstrapApp;
  window.isWebGLSupported = isWebGLSupported;
  window.SKILLS_DATA = SKILLS_DATA;
  window.TEACHING_MODULES = TEACHING_MODULES;
}

// Auto-boot on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapApp);
  } else {
    bootstrapApp();
  }
}
