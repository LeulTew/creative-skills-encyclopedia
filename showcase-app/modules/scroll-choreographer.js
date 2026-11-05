/**
 * Scroll Choreographer Engine (2026 Edition)
 * Architecture: LeulTew · Awwwards Site of the Year / SunChips / AGI Readiness Standard
 *
 * Implements:
 * 1. Unified RAF Loop: Lenis Smooth Scroll 1.1+ and GSAP ScrollTrigger 3.12+ synchronized on single requestAnimationFrame.
 * 2. Chapter 1 (Hero): 3D camera dolly and rotation scrubbing.
 * 3. Chapter 2 (Manifesto): Pinned chapter with sentence-by-sentence kinetic text reveals (0.18 -> 1.0 illumination).
 * 4. Chapter 3 (Syllabus): Pinned 10-module curriculum, scrubbing active module, curriculum highlights, and stage3D specimen swapping.
 * 5. Chapter 4 (Blender & Shader Lab): Interactive 3D parameter controls and material adjustments.
 * 6. Chapter 5 (Council Chamber): Visual radar and evaluation metrics reveal with subtle spring physics (back.out).
 * 7. Wayfinding & Accessibility: 2px hairline progress bar, active chapter nav indicator, reduced-motion compliance, zero overflow.
 * 8. Zero console errors, zero emojis, zero double-slash dividers.
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
      'monolith', // Module 01: Zero-Slop Awwwards Standard
      'monolith', // Module 02: Editorial Display Typography
      'temple',   // Module 03: Modern WebGL & 3D PBR Shaders
      'temple',   // Module 04: Procedural Raymarching & SDFs
      'sphere',   // Module 05: Headless Blender 5.2 & OptiX
      'sphere',   // Module 06: Generative 3D Mesh & Rigging
      'dna',      // Module 07: Kinetic Typography & React Bits
      'dna',      // Module 08: Frontier Registries & Precision Micro-UI
      'pack',     // Module 09: Visual Hill-Climbing & Jester Protocol
      'pack'      // Module 10: Adobe Suite & Video Automation
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
    this.specimenButtons = Array.from(document.querySelectorAll('.specimen-btn'));

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

      if (gsapInstance && scrollTriggerInstance) {
        gsapInstance.registerPlugin(scrollTriggerInstance);
        this.lenis.on('scroll', scrollTriggerInstance.update);

        gsapInstance.ticker.add((time) => {
          this.lenis.raf(time * 1000);
        });
        gsapInstance.ticker.lagSmoothing(0);
      } else {
        const standaloneTick = (time) => {
          this.lenis.raf(time);
          requestAnimationFrame(standaloneTick);
        };
        requestAnimationFrame(standaloneTick);
      }

      this.lenis.on('scroll', (e) => {
        this.updateWayfindingProgress(e.progress, e.scroll);
      });
    } else {
      // Native window scroll fallback for reduced motion or standalone
      window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
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

    // Synchronize overall document scroll with stage3D if no active pinned chapter overrides it
    if (window.stage3D && typeof window.stage3D.setScrollProgress === 'function') {
      window.stage3D.setScrollProgress(progress);
    }
  }

  setupWayfindingAndNav() {
    // Intercept navigation links for smooth Lenis gliding
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

    // Update active nav link on scroll
    if (this.ScrollTrigger) {
      const chapters = document.querySelectorAll('.chapter');
      chapters.forEach((chapter) => {
        this.ScrollTrigger.create({
          trigger: chapter,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => this.highlightNavLink(chapter.id),
          onEnterBack: () => this.highlightNavLink(chapter.id)
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
      this.lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
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
          // Camera dolly and rotation scrub on hero exit
          window.stage3D.setScrollProgress(p * 0.35);
        }
      }
    });
  }

  /**
   * 3. CHAPTER 2 (STATEMENT / MANIFESTO): PINNED SECTION WITH KINETIC SENTENCE REVEALS
   * - Each sentence starts at opacity: 0.18; transform: translateY(8px);
   * - Illuminates to opacity: 1.0; transform: translateY(0); color: var(--t-primary);
   * - Preceding sentences dim slightly to 0.58
   */
  setupChapter2Manifesto() {
    const manifestoEl = document.getElementById('manifesto');
    if (!manifestoEl || !this.sentences.length) return;

    const sentenceCount = this.sentences.length;

    // Pin manifesto section during kinetic sentence reading
    this.ScrollTrigger.create({
      trigger: manifestoEl,
      start: 'top top',
      end: '+=1600',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        // Map 0 -> 1 progress into active sentence index
        const rawIndex = p * sentenceCount;
        const currentActiveIdx = Math.min(sentenceCount - 1, Math.floor(rawIndex));

        this.sentences.forEach((sentence, idx) => {
          if (idx < currentActiveIdx) {
            // Preceding sentence: dimmed slightly
            sentence.classList.remove('active');
            sentence.classList.add('passed');
          } else if (idx === currentActiveIdx) {
            // Active highlighted sentence: fully illuminated
            sentence.classList.remove('passed');
            sentence.classList.add('active');
          } else {
            // Upcoming unrevealed sentence: initial resting state (0.18)
            sentence.classList.remove('active');
            sentence.classList.remove('passed');
          }
        });
      }
    });
  }

  /**
   * 4. CHAPTER 3 (SOCRATIC SYLLABUS): PINNED 10 MODULES WITH SPECIMEN SWAPPING
   * - Pinned curriculum module progression
   * - Active module index updates and highlights card details
   * - Triggers window.stage3D.setSpecimen(...) when switching core topics
   */
  setupChapter3Syllabus() {
    const syllabusEl = document.getElementById('syllabus');
    if (!syllabusEl || !this.curriculumCards.length) return;

    const cardCount = this.curriculumCards.length;

    this.ScrollTrigger.create({
      trigger: syllabusEl,
      start: 'top top+=60',
      end: '+=2600',
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        const activeIdx = Math.min(cardCount - 1, Math.floor(p * cardCount));

        if (activeIdx !== this.activeModuleIndex) {
          this.activeModuleIndex = activeIdx;
          this.updateSyllabusActiveModule(activeIdx);
        }
      }
    });
  }

  updateSyllabusActiveModule(idx) {
    // 1. Highlight curriculum card
    this.curriculumCards.forEach((card, cardIdx) => {
      if (cardIdx === idx) {
        card.classList.add('active');
        // Ensure card is visible in viewport flow
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        card.classList.remove('active');
      }
    });

    // 2. Trigger stage3D specimen change when core topic shifts
    const targetSpecimen = this.topicSpecimenMap[idx] || 'monolith';
    if (targetSpecimen !== this.activeSpecimenTopic) {
      this.activeSpecimenTopic = targetSpecimen;
      if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
        window.stage3D.setSpecimen(targetSpecimen);
      }
    }

    // 3. Keep application slide module in sync if interactive syllabus exists
    if (typeof window.renderTeachingModule === 'function') {
      window.renderTeachingModule(idx);
    }
  }

  /**
   * 5. CHAPTER 4 (CATALOG): SKILLS DIRECTORY REVEAL
   */
  setupChapter4Catalog() {
    const catalogEl = document.getElementById('skills-catalog');
    if (!catalogEl || !this.gsap) return;

    this.gsap.fromTo(catalogEl.querySelector('.catalog-controls') || catalogEl,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: catalogEl,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  /**
   * 6. CHAPTER 5 (3D SPECIMEN BENCH): STUDIO CONTROLS ENTRANCE
   */
  setupChapter5SpecimenGallery() {
    const galleryEl = document.getElementById('specimen-gallery');
    if (!galleryEl || !this.gsap) return;

    const panel = galleryEl.querySelector('.lab-controls-panel');
    if (panel) {
      this.gsap.fromTo(panel,
        { opacity: 0, y: 32, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
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

    const deckBox = deckEl.querySelector('.presentation-deck-box');
    if (deckBox) {
      this.gsap.fromTo(deckBox,
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
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
   * Interactive Blender Lab Controls & Specimen Buttons
   */
  setupInteractiveControls() {
    // 1. Specimen Buttons
    this.specimenButtons.forEach((btn) => {
      if (btn.dataset.scrollBound) return;
      btn.dataset.scrollBound = 'true';
      btn.addEventListener('click', () => {
        const specimen = btn.dataset.specimen;
        this.specimenButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        if (window.stage3D && typeof window.stage3D.setSpecimen === 'function') {
          window.stage3D.setSpecimen(specimen);
        }
      });
    });

    // 2. Wireframe Toggle
    const wireframeToggle = document.getElementById('wireframe-toggle');
    if (wireframeToggle && !wireframeToggle.dataset.scrollBound) {
      wireframeToggle.dataset.scrollBound = 'true';
      wireframeToggle.addEventListener('change', (e) => {
        if (window.stage3D && typeof window.stage3D.setWireframe === 'function') {
          window.stage3D.setWireframe(e.target.checked);
        }
      });
    }

    // 3. Roughness Slider
    const roughnessSlider = document.getElementById('roughness-slider');
    const roughnessVal = document.getElementById('roughness-val');
    if (roughnessSlider && roughnessVal && !roughnessSlider.dataset.scrollBound) {
      roughnessSlider.dataset.scrollBound = 'true';
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
    if (metalnessSlider && metalnessVal && !metalnessSlider.dataset.scrollBound) {
      metalnessSlider.dataset.scrollBound = 'true';
      metalnessSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        metalnessVal.textContent = val.toFixed(2);
        if (window.stage3D && typeof window.stage3D.setMetalness === 'function') {
          window.stage3D.setMetalness(val);
        }
      });
    }

    // 5. Key Light Yaw Slider
    const lightSlider = document.getElementById('light-slider');
    const lightVal = document.getElementById('light-val');
    if (lightSlider && lightVal && !lightSlider.dataset.scrollBound) {
      lightSlider.dataset.scrollBound = 'true';
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
   * Whole-Canvas SunChips Flavour Theme Switcher
   */
  setupFlavourSwitcher() {
    const pills = document.querySelectorAll('.flavour-pill[data-set-flavour]');
    pills.forEach((pill) => {
      if (pill.dataset.scrollBound) return;
      pill.dataset.scrollBound = 'true';
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
   * Gracefully disables scrub transforms and presents clear, accessible static layout
   */
  setupAccessibleStaticFallback() {
    // Reveal all kinetic sentences immediately
    this.sentences.forEach((sentence) => {
      sentence.classList.add('active');
    });

    // Reset progress bar transform
    if (this.progressLine) {
      this.progressLine.style.transform = 'scaleX(1)';
    }

    // Unpin and reveal all radar bars
    const radarFills = document.querySelectorAll('.radar-bar-fill');
    radarFills.forEach((fill) => {
      fill.style.transform = 'scaleX(1)';
    });

    // Reveal council cards statically
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
  }
}

/**
 * Clean Public Initializer Export
 */
export function initScrollChoreography() {
  if (typeof window === 'undefined') return null;

  if (!window.scrollChoreography) {
    window.scrollChoreography = new ScrollChoreographer();
  }
  return window.scrollChoreography;
}

export const initScrollChoreographer = initScrollChoreography;
export default initScrollChoreography;
