/**
 * Scroll Choreographer Engine (2026 Edition)
 * Architecture: LeulTew · Awwwards Site of the Year / SunChips Physical Precision
 *
 * Implements:
 * 1. Unified RAF Loop: Lenis Smooth Scroll 1.1+ and GSAP ScrollTrigger 3.12+ synchronized on single requestAnimationFrame.
 * 2. Chapter 1 (Hero): Dynamic camera dolly and asymmetric stage balance.
 * 3. Chapter 2 (Manifesto): Pinned chapter with sentence-by-sentence kinetic text reveals (0.22 -> 1.0 illumination).
 * 4. Chapter 3 (Syllabus): Curriculum progression highlighting active modules and synchronizing 3D stage specimens.
 * 5. Chapter 4 (Catalog): Smooth entrance of skills directory and category tabs.
 * 6. Chapter 5 (3D Studio): Interactive 3D parameter controls and material adjustments.
 * 7. Chapter 6 (Teaching Deck): Socratic slide navigation synchronized with live 3D specimen stage.
 * 8. Wayfinding & Accessibility: 2px hairline progress bar, active chapter nav indicator, reduced-motion compliance.
 * 9. ZERO console errors, ZERO emojis, ZERO double-slash dividers.
 */

export class ScrollChoreographer {
  constructor() {
    this.lenis = null;
    this.gsap = typeof window !== 'undefined' ? window.gsap : null;
    this.ScrollTrigger = typeof window !== 'undefined' ? window.ScrollTrigger : null;
    this.prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    this.progressLine = null;
    this.sentences = [];
    this.curriculumCards = [];
    this.navLinks = [];
    this.specimenButtons = [];
    this.activeModuleIndex = -1;
    this.activeSpecimenTopic = '';

    // Core topic to 3D specimen mapping for Chapter 3
    this.topicSpecimenMap = [
      'kinetic_core',     // Module 01: Headless Blender & 3D Pipelines
      'kinetic_core',     // Module 02: Studio Lighting & PBR Colorimetry
      'dna_helix',        // Module 03: Unified RAF Motion Orchestration
      'dna_helix',        // Module 04: Kinetic Typography & Variable Fonts
      'kinetic_core',     // Module 05: Whole-Canvas Chromatic Theming
      'neural_sphere',    // Module 06: Frontier Micro-UI & Spatial Interfaces
      'neural_sphere',    // Module 07: Procedural Raymarching & SDF Shaders
      'cyber_monolith',   // Module 08: Deterministic Video Automation
      'kinetic_core',     // Module 09: 1-Pixel Registration & Still Handoff
      'cyber_monolith'    // Module 10: Responsive Mobile Frustums
    ];

    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    // Cache DOM Elements
    this.progressLine = document.getElementById('scroll-progress-line');
    this.sentences = Array.from(document.querySelectorAll('.kinetic-sentence'));
    this.curriculumCards = Array.from(document.querySelectorAll('.curriculum-card'));
    this.navLinks = Array.from(document.querySelectorAll('.nav-link'));
    this.specimenButtons = Array.from(document.querySelectorAll('.specimen-btn, .quick-pill'));

    // Step 1: Initialize Lenis + GSAP Unified RAF Loop
    this.initUnifiedRAF();

    // Step 2: Global Document Wayfinding & Nav Tracking
    this.setupWayfindingAndNav();

    // Step 3: Chapter Choreography Pipelines
    if (!this.prefersReducedMotion && this.ScrollTrigger && this.gsap) {
      this.setupChapter1Hero();
      this.setupChapter2Manifesto();
      this.setupChapter3Syllabus();
      this.setupChapter4Catalog();
      this.setupChapter5SpecimenGallery();
      this.setupChapter6TeachingDeck();
    } else {
      this.setupAccessibleStaticFallback();
    }

    // Step 4: Interactive Blender & Shader Controls
    this.setupInteractiveControls();

    // Step 5: Flavour World Theme Buttons
    this.setupFlavourSwitcher();
  }

  /**
   * 1. LENIS + GSAP UNIFIED RAF SYNCHRONIZATION
   */
  initUnifiedRAF() {
    const LenisClass = typeof window !== 'undefined' ? window.Lenis : null;
    const gsapInstance = this.gsap || (typeof window !== 'undefined' ? window.gsap : null);
    const scrollTriggerInstance = this.ScrollTrigger || (typeof window !== 'undefined' ? window.ScrollTrigger : null);

    if (LenisClass && !this.prefersReducedMotion) {
      this.lenis = new LenisClass({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
      });
      window.lenis = this.lenis;

      if (scrollTriggerInstance) {
        this.lenis.on('scroll', (e) => {
          scrollTriggerInstance.update();
          const docEl = document.documentElement;
          const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
          const progress = Math.min(1.0, Math.max(0, e.scroll / maxScroll));
          this.updateWayfindingProgress(progress, e.scroll);
        });
      }

      if (gsapInstance && gsapInstance.ticker) {
        gsapInstance.ticker.add((time) => {
          this.lenis.raf(time * 1000);
        });
        gsapInstance.ticker.lagSmoothing(0);
      }
    } else {
      // Native scroll fallback
      window.addEventListener('scroll', () => {
        const docEl = document.documentElement;
        const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
        const progress = Math.min(1.0, Math.max(0, window.scrollY / maxScroll));
        this.updateWayfindingProgress(progress, window.scrollY);
      }, { passive: true });
    }
  }

  /**
   * Wayfinding 2px Hairline Progress Bar & Nav Links
   */
  updateWayfindingProgress(progress, scrollY) {
    if (this.progressLine) {
      this.progressLine.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
    }

    if (window.stage3D && typeof window.stage3D.setScrollProgress === 'function') {
      window.stage3D.setScrollProgress(progress);
    }
  }

  setupWayfindingAndNav() {
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            this.scrollToTarget(target);
          }
        }
      });
    });

    if (this.ScrollTrigger) {
      const chapters = document.querySelectorAll('.chapter');
      chapters.forEach((chapter) => {
        this.ScrollTrigger.create({
          trigger: chapter,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => {
            this.highlightNavLink(chapter.id);
            if (window.stage3D && typeof window.stage3D.setChapter === 'function') {
              window.stage3D.setChapter(chapter.id);
            }
          },
          onEnterBack: () => {
            this.highlightNavLink(chapter.id);
            if (window.stage3D && typeof window.stage3D.setChapter === 'function') {
              window.stage3D.setChapter(chapter.id);
            }
          }
        });
      });
    }
  }

  highlightNavLink(chapterId) {
    if (!chapterId) return;
    this.navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${chapterId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  scrollToTarget(targetEl) {
    if (!targetEl) return;
    if (this.lenis) {
      this.lenis.scrollTo(targetEl, { offset: -64, duration: 1.2 });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * 2. CHAPTER 1 (HERO): 3D CAMERA DOLLY & ROTATION SCRUBBING
   */
  setupChapter1Hero() {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;

    this.ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.0,
      onUpdate: (self) => {
        const p = self.progress;
        if (window.stage3D && typeof window.stage3D.setScrollProgress === 'function') {
          window.stage3D.setScrollProgress(p * 0.25);
        }
      }
    });
  }

  /**
   * 3. CHAPTER 2 (MANIFESTO): PINNED SECTION WITH KINETIC SENTENCE REVEALS
   */
  setupChapter2Manifesto() {
    const manifestoEl = document.getElementById('manifesto');
    if (!manifestoEl || !this.sentences.length) return;

    const sentenceCount = this.sentences.length;

    this.ScrollTrigger.create({
      trigger: manifestoEl,
      start: 'top top',
      end: '+=1400',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        const rawIndex = p * sentenceCount;
        const currentActiveIdx = Math.min(sentenceCount - 1, Math.floor(rawIndex));

        this.sentences.forEach((sentence, idx) => {
          if (idx < currentActiveIdx) {
            sentence.classList.remove('active');
            sentence.classList.add('passed');
          } else if (idx === currentActiveIdx) {
            sentence.classList.remove('passed');
            sentence.classList.add('active');
          } else {
            sentence.classList.remove('active');
            sentence.classList.remove('passed');
          }
        });
      }
    });
  }

  /**
   * 4. CHAPTER 3 (CURRICULUM SYLLABUS): INTERACTIVE SPECIMEN SWAPPING
   */
  setupChapter3Syllabus() {
    const syllabusEl = document.getElementById('syllabus');
    if (!syllabusEl || !this.curriculumCards.length) return;

    // Hover or click on curriculum card spotlights specimen
    this.curriculumCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        this.curriculumCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const targetSpecimen = card.dataset.specimen || this.topicSpecimenMap[idx] || 'bag';
        if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
          window.stage3D.setSpecimen(targetSpecimen);
        }
      });

      card.addEventListener('click', () => {
        const targetSpecimen = card.dataset.specimen || this.topicSpecimenMap[idx] || 'bag';
        if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
          window.stage3D.setSpecimen(targetSpecimen);
        }
      });
    });
  }

  /**
   * 5. CHAPTER 4 (CATALOG): SKILLS DIRECTORY REVEAL
   */
  setupChapter4Catalog() {
    const catalogEl = document.getElementById('skills-catalog');
    if (!catalogEl || !this.gsap) return;

    this.gsap.fromTo(catalogEl,
      { opacity: 0.8 },
      {
        opacity: 1,
        duration: 0.6,
        scrollTrigger: {
          trigger: catalogEl,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  /**
   * 6. CHAPTER 5 (3D STUDIO BENCH): STUDIO CONTROLS ENTRANCE
   */
  setupChapter5SpecimenGallery() {
    const galleryEl = document.getElementById('specimen-gallery');
    if (!galleryEl || !this.gsap) return;

    const dock = galleryEl.querySelector('.studio-floating-dock');
    if (dock) {
      this.gsap.fromTo(dock,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galleryEl,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  /**
   * 7. CHAPTER 6 (TEACHING DECK): PRESENTATION DECK ENTRANCE
   */
  setupChapter6TeachingDeck() {
    const deckEl = document.getElementById('teaching-deck');
    if (!deckEl || !this.gsap) return;

    const slideCard = deckEl.querySelector('.deck-slide-card');
    if (slideCard) {
      this.gsap.fromTo(slideCard,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: deckEl,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  /**
   * Interactive 3D Lab Controls & Specimen Buttons
   */
  setupInteractiveControls() {
    // 1. Specimen Buttons (Hero Quick Pills and Studio Buttons)
    const allSpecimenButtons = document.querySelectorAll('.specimen-btn, .quick-pill');
    allSpecimenButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const specimen = btn.dataset.specimen;
        allSpecimenButtons.forEach((b) => {
          if (b.dataset.specimen === specimen) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });

        if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
          window.stage3D.setSpecimen(specimen);
        }
      });
    });

    // 2. Wireframe Toggle
    const wireframeToggle = document.getElementById('wireframe-toggle');
    if (wireframeToggle) {
      wireframeToggle.addEventListener('change', (e) => {
        if (window.stage3D && typeof window.stage3D.setWireframe === 'function') {
          window.stage3D.setWireframe(e.target.checked);
        }
      });
    }

    // 3. Roughness Slider
    const roughnessSlider = document.getElementById('roughness-slider');
    const roughnessVal = document.getElementById('roughness-val');
    if (roughnessSlider && roughnessVal) {
      roughnessSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        roughnessVal.textContent = val.toFixed(2);
        if (window.stage3D && typeof window.stage3D.setRoughness === 'function') {
          window.stage3D.setRoughness(val);
        }
      });
    }

    // 4. Metalness Slider
    const metalnessSlider = document.getElementById('metalness-slider');
    const metalnessVal = document.getElementById('metalness-val');
    if (metalnessSlider && metalnessVal) {
      metalnessSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        metalnessVal.textContent = val.toFixed(2);
        if (window.stage3D && typeof window.stage3D.setMetalness === 'function') {
          window.stage3D.setMetalness(val);
        }
      });
    }

    // 5. Key Light Yaw Slider
    const lightSlider = document.getElementById('light-yaw-slider') || document.getElementById('light-slider');
    const lightVal = document.getElementById('light-yaw-val') || document.getElementById('light-val');
    if (lightSlider && lightVal) {
      lightSlider.addEventListener('input', (e) => {
        const deg = parseInt(e.target.value, 10);
        lightVal.innerHTML = `${deg}&deg;`;
        if (window.stage3D && typeof window.stage3D.setLightYaw === 'function') {
          window.stage3D.setLightYaw(deg);
        }
      });
    }
  }

  /**
   * Whole-Canvas Flavour Theme Switcher
   */
  setupFlavourSwitcher() {
    const pills = document.querySelectorAll('.flavour-pill[data-set-flavour]');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const flavour = pill.dataset.setFlavour;
        pills.forEach((p) => {
          p.classList.remove('active');
          p.setAttribute('aria-checked', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-checked', 'true');

        document.body.setAttribute('data-flavour', flavour);

        if (window.stage3D && typeof window.stage3D.setFlavour === 'function') {
          window.stage3D.setFlavour(flavour);
        }
      });
    });
  }

  /**
   * ACCESSIBILITY & REDUCED MOTION STATIC FALLBACK
   */
  setupAccessibleStaticFallback() {
    this.sentences.forEach((sentence) => {
      sentence.classList.add('active');
    });

    if (this.progressLine) {
      this.progressLine.style.transform = 'scaleX(1)';
    }
  }
}

export function initScrollChoreography() {
  if (typeof window === 'undefined') return null;

  if (!window.scrollChoreography) {
    window.scrollChoreography = new ScrollChoreographer();
  }
  return window.scrollChoreography;
}

export const initScrollChoreographer = initScrollChoreography;
export default initScrollChoreography;
