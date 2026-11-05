/**
 * Presenter Deck Mode & Global Keyboard Shortcuts Engine (2026 Frontier Edition)
 * 
 * Standardized for Creative Engineering Encyclopedia:
 * - Fullscreen high-impact typographic presentation deck
 * - Global keyboard navigation with robust input focus-trapping
 * - Real-time presentation elapsed timer and slide progress bar (#presenter-progress-bar)
 * - Curated Socratic presenter coaching notes and delivery cues for all 10 modules
 * - Liquid-glass keyboard shortcuts overlay modal ([?] or [H])
 * - Anti-Slop verification: zero emojis in badges/keys, zero "//" dividers
 */

// ============================================================================
// Curated Presenter Notes & Socratic Delivery Cues (10 Modules)
// ============================================================================
export const PRESENTER_NOTES = [
  {
    moduleNumber: "01",
    title: "The Zero-Slop Awwwards Standard",
    timeTarget: "3-4 min",
    coreThesis: "Award-winning craft creates depth solely through calibrated tone steps, 1px hairlines, and concentric radii—never cheap drop-shadows.",
    talkingPoints: [
      "AI slop archetype: 20px black fuzzy drop-shadows on pitch-black surfaces with neon linear gradients.",
      "The 3-tier tone elevation hierarchy: Obsidian (#0a0d14) base canvas, Deep Zinc (#12141a) surface card, Elevated Zinc (#181c24) interactive controls.",
      "Concentric radii rule: r_inner = r_outer - padding. When violated, nested elements clash and feel visually discordant.",
      "Hairlines: 1px cobalt borders (#1e293b) calibrated at 8-12% opacity provide structural definition without visual weight."
    ],
    socraticCue: "Ask the audience: Look at the default card. What makes your brain immediately classify it as low-effort AI output before you even read the text?",
    liveCodingDemo: "In the CSS playground, delete the box-shadow property and add border: 1px solid var(--c-cobalt-rim) with background: var(--c-deep-zinc).",
    keyTakeaway: "Depth is an optical step function of tone and hairline boundaries, not an ink blot shadow."
  },
  {
    moduleNumber: "02",
    title: "Editorial Display Typography",
    timeTarget: "3 min",
    coreThesis: "Poster-scale typography must use mathematical clamp scaling and optical tracking offsets to command editorial authority.",
    talkingPoints: [
      "Variable font pairing: Syne (geometric display) for massive section anchors; Clash Display for structural weight.",
      "Fluid clamp formula: clamp(min, preferred, max) ensuring seamless responsiveness without discontinuous media query jumps.",
      "Optical tracking disparity: giant headlines require negative tracking (-0.03em to -0.05em); small uppercase metadata requires positive tracking (+0.08em to +0.12em).",
      "Zero-FOUC web font strategy: font-display: swap paired with critical inline font preload links."
    ],
    socraticCue: "Notice how standard web typography looks frail at desktop sizes and clipped on mobile. How does mathematical clamp solve both without breakpoint snap?",
    liveCodingDemo: "Adjust the font-size clamp in the editor and resize the viewport frame to demonstrate continuous mathematical scaling.",
    keyTakeaway: "Type is architecture: scale it continuously and track it optically."
  },
  {
    moduleNumber: "03",
    title: "Modern WebGL and 3D PBR Shaders",
    timeTarget: "4 min",
    coreThesis: "Khronos PBR Neutral tone mapping is required to preserve brand colorimetry under high-intensity physical lights.",
    talkingPoints: [
      "Three.js r170+ color management: linear-sRGB rendering pipeline with correct color space transfer functions.",
      "Tone mapping comparison: ACESFilmic crushes high-chroma orange/ember into muddy canary yellow; Khronos Neutral preserves hue fidelity.",
      "Physical material parameters: Roughness (0.18) for sharp specular highlights; Metalness (0.88) for metallic reflection; Transmission for refractive volume.",
      "Studio 3-point lighting: Key light at 45 degrees, Rim light at 135 degrees with cobalt tint, and subtle ambient ground bounce."
    ],
    socraticCue: "Why do commercial brand packaging sites look cheap when rendered with standard ACES tone mapping? Point out the color burnout on the ember gradient.",
    liveCodingDemo: "Toggle between Tone Mapping options in the 3D lab to visibly demonstrate chromatic preservation on the SunChips packaging band.",
    keyTakeaway: "Colorimetry is not aesthetic taste; it is mathematical photon conservation."
  },
  {
    moduleNumber: "04",
    title: "Procedural Raymarching and Signed Distance Fields",
    timeTarget: "3-4 min",
    coreThesis: "Raymarching analytic SDFs produces infinitely smooth geometric blends and organic fluid surfaces without polygon budgets.",
    talkingPoints: [
      "SDF fundamentals: calculating the exact signed Euclidean distance from any sample point in space to the closest geometric surface.",
      "Polynomial smooth minimum (smin): blending primitive shapes (sphere, torus, cylinder) organically without polygonal mesh boolean seams.",
      "Soft shadow marching: sampling occlusion along light rays with a penumbra factor k to create physically plausible atmospheric soft shadows.",
      "Dynamic DPR scaling: clamping viewport resolution to 1.5x on retina displays to guarantee steady 60 FPS frame budgets."
    ],
    socraticCue: "How can a single full-screen quad shader render complex 3D organic geometry faster than a 100,000 polygon glTF mesh?",
    liveCodingDemo: "Alter the smin factor k from 0.1 to 0.6 in the shader editor to watch two geometric solids melt into each other like mercury.",
    keyTakeaway: "When triangles become a bottleneck, procedural math delivers infinite resolution."
  },
  {
    moduleNumber: "05",
    title: "Headless Blender 5.2 and OptiX Cycles GPU",
    timeTarget: "4 min",
    coreThesis: "Headless Python automation transforms Blender into an autonomous 3D build asset engine for web pipelines.",
    talkingPoints: [
      "CLI invocation pattern: blender -b --python script.py -- [args] running in CI/CD without X11 or GUI display dependencies.",
      "Hardware acceleration: configuring Cycles with OptiX on NVIDIA RTX GPUs for 5x faster procedural baking than CPU threads.",
      "Camera registration: exact 1-pixel matching between headless Cycles render stills and live WebGL Three.js viewports.",
      "Meshopt and glTF export: automated Draco vertex compression and normal quantization reducing multi-megabyte scenes to < 500 KB."
    ],
    socraticCue: "Why should developers never manually export 3D assets from a GUI when an autonomous agent can script, texture, light, and verify the asset deterministically?",
    liveCodingDemo: "Inspect the parametric bpy script in the editor showing programmatic camera positioning and PBR node graph construction.",
    keyTakeaway: "Treat 3D scenes as code: compile, test, and bake them through headless CLI scripts."
  },
  {
    moduleNumber: "06",
    title: "Generative 3D Mesh Creation and Rigging",
    timeTarget: "3 min",
    coreThesis: "Neural 2D-to-3D generation must be post-processed through automated decimation and clean skeletal rigging for web deployment.",
    talkingPoints: [
      "Neural mesh generation: converting concept art into raw geometry via Tripo, Meshy, or Rodin neural SDF generators.",
      "Topology remediation: raw generative outputs create non-manifold geometry and inverted normals; automated remeshing to quads is required.",
      "5-point automated rigging: Mixamo auto-rig and Reallusion AccuRig for instantaneous bone placement and skin weighting.",
      "Web delivery budgets: reducing 300,000 polygon raw scans down to 18,000 triangles with normal-mapped high-frequency surface detail."
    ],
    socraticCue: "What happens when you drop a raw generative 3D model directly onto a mobile website? What is the impact on memory and frame rate?",
    liveCodingDemo: "Walk through the LOD reduction pipeline showing texture baking from high-poly sculpt to low-poly runtime cage.",
    keyTakeaway: "Generative AI creates the raw clay; rigorous engineering makes it lightweight and web-ready."
  },
  {
    moduleNumber: "07",
    title: "Kinetic Typography and React Bits",
    timeTarget: "3-4 min",
    coreThesis: "Kinetic text animations must pair high-framerate spring physics with an un-split screen reader accessibility tree.",
    talkingPoints: [
      "The 4 core effects: BlurText (staggered Gaussian unblur), DecryptedText (matrix glyph decrypt), VariableProximity (cursor font-weight modulation), ShinyText (specular gradient sweep).",
      "Dual-tree accessibility: splitting words into animated spans destroys screen reader pronunciation; always provide an un-split .sr-only mirror container.",
      "Unified RAF loop: synchronizing GSAP / anime.js spring animations with Lenis smooth scroll to eliminate stutter and frame jitter.",
      "prefers-reduced-motion: automatically disabling character splits and rendering static typography when reduced motion is requested."
    ],
    socraticCue: "Inspect the DOM of an animated text header. Can a blind user with a screen reader understand the sentence if each character is isolated in an aria-hidden span?",
    liveCodingDemo: "Hover over the VariableProximity interactive demo in the Motion Lab to see font-weight dynamically respond to cursor distance.",
    keyTakeaway: "Never compromise accessibility for visual flair: build the screen-reader tree first, animate the visual layer second."
  },
  {
    moduleNumber: "08",
    title: "Frontier Registries and Precision Micro-UI",
    timeTarget: "3 min",
    coreThesis: "2026 frontier UI moves beyond static cards into interactive micro-components with magnetic physics and tactile feedback.",
    talkingPoints: [
      "Magic UI AnimatedBeam: procedural SVG bezier paths with animated stroke-dashoffset gradients connecting architectural nodes.",
      "Aceternity Spotlight Bento: radial cursor-following light gradients revealing border hairlines dynamically.",
      "Hover.dev 3D perspective tilt: smooth matrix3d transforms with rotational damping and counter-perspective child offsets.",
      "NumberFlow precision: SVG path digit transitions providing silky odometer roll animations for numeric metrics."
    ],
    socraticCue: "What subtle micro-interaction transforms a standard SaaS feature card into an Apple-grade interactive artifact?",
    liveCodingDemo: "Move your mouse across the 3D Tilt Card in the Micro-UI showcase to demonstrate dynamic glare and depth layering.",
    keyTakeaway: "Micro-interactions are the silent signature of engineering pedigree."
  },
  {
    moduleNumber: "09",
    title: "Closed-Loop Visual Feedback and Adversarial Jester",
    timeTarget: "4 min",
    coreThesis: "Multi-agent consensus naturally degrades into polite score inflation; an adversarial critic is required to drive true hill-climbing.",
    talkingPoints: [
      "Theo Browne's visual feedback loop: render code -> capture headless screenshot -> visual model critique -> surgical code patch -> repeat.",
      "The cooperative failure mode: multiple LLM agents reviewing each other tend toward polite 8.5/10 scores regardless of flaws.",
      "The Adversarial Jester: an agent role explicitly prompted to find nitpicks, contrast failures, layout misalignment, and AI slop indicators.",
      "The 9.5/10 release threshold: code only merges when the entire council, including the skeptical Jester, agrees the benchmark is surpassed."
    ],
    socraticCue: "Look at the council deliberation log. When the lead model gave a 9.2, why did the Jester reject it with a 7.4? What defect did it catch?",
    liveCodingDemo: "Run the Council Chamber simulation to watch the adversarial debate unfold and observe the radar polygon shift.",
    keyTakeaway: "Without a ruthless critic, autonomous agent systems plateau at mediocrity."
  },
  {
    moduleNumber: "10",
    title: "Adobe Creative Cloud and NLE Video Automation",
    timeTarget: "3-4 min",
    coreThesis: "Modern UXP plugins and timeline scripts bridge desktop creative suites directly into web deployment pipelines.",
    talkingPoints: [
      "Photoshop UXP architecture: modern V8 JavaScript runtime replacing 20-year-old ExtendScript; native async/await and Web APIs.",
      "Automated texture pipeline: batch normal map generation, heightmap extraction, and ambient occlusion baking from master PSD layers.",
      "NLE timeline automation: Premiere Pro Auto-Editor and DaVinci Resolve fusionscript cutting video based on audio silence detection.",
      "Multi-DCC handoff: Photoshop textures -> Blender 3D scene -> WebGL Three.js canvas -> Hyperframes video rendering."
    ],
    socraticCue: "How does a modern design engineer automate the export of 40 asset variants across 3 color spaces without opening the Photoshop export modal 40 times?",
    liveCodingDemo: "Inspect the Photoshop UXP batch script showing headless document traversal and format conversion.",
    keyTakeaway: "Creative software should be programmable infrastructure, not manual point-and-click drudgery."
  }
];

// ============================================================================
// Presenter Engine State
// ============================================================================
let isPresenterActive = false;
let currentSlideIndex = 0;
let totalSlidesCount = 10;
let timerInterval = null;
let elapsedSeconds = 0;
let isNotesExpanded = false;
let isShortcutsModalOpenState = false;
let isInitialized = false;

// ============================================================================
// Timer Functions
// ============================================================================
export function startPresenterTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimerDisplay();
  }, 1000);
  updateTimerDisplay();
}

export function stopPresenterTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export function resetPresenterTimer() {
  elapsedSeconds = 0;
  updateTimerDisplay();
  if (typeof window !== 'undefined' && typeof window.logToTerminal === 'function') {
    window.logToTerminal('Presentation timer reset to 00:00', 'info');
  }
}

function updateTimerDisplay() {
  if (typeof document === 'undefined') return;
  const timerEl = document.getElementById('presenter-timer');
  if (!timerEl) return;
  const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
  timerEl.textContent = `${mins}:${secs}`;
}

// ============================================================================
// Slide Navigation Handlers
// ============================================================================
export function nextSlide() {
  if (currentSlideIndex < totalSlidesCount - 1) {
    jumpToSlide(currentSlideIndex + 1);
  }
}

export function prevSlide() {
  if (currentSlideIndex > 0) {
    jumpToSlide(currentSlideIndex - 1);
  }
}

export function jumpToSlide(index) {
  if (index < 0 || index >= totalSlidesCount) return;
  currentSlideIndex = index;

  // Delegate to global renderTeachingModule if available
  if (typeof window !== 'undefined' && typeof window.renderTeachingModule === 'function') {
    window.renderTeachingModule(index);
  }

  updatePresenterUI(index);
}

// ============================================================================
// Presenter Deck Viewport & Mode Toggle
// ============================================================================
export function enterPresenterMode() {
  if (typeof document === 'undefined') return;
  isPresenterActive = true;
  document.body.classList.add('presenter-active');

  // Ensure syllabus section is visible
  const syllabusTab = document.querySelector('.nav-tab-bar .nav-tab-btn[data-target="section-syllabus"]');
  if (syllabusTab && !syllabusTab.classList.contains('active')) {
    syllabusTab.click();
  } else {
    const syllabusSection = document.getElementById('section-syllabus');
    if (syllabusSection) syllabusSection.style.display = 'block';
  }

  // Request native fullscreen if permitted
  if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {
      // Graceful fallback if fullscreen is blocked by browser policy
    });
  }

  // Start timer and refresh UI
  startPresenterTimer();
  updatePresenterUI(currentSlideIndex);

  // Update button texts (Anti-slop: zero emojis)
  const toggleBtn = document.getElementById('toggle-presenter-btn');
  if (toggleBtn) toggleBtn.textContent = 'Exit Presenter Deck [Esc]';

  const hudExitBtn = document.getElementById('hud-exit-btn');
  if (hudExitBtn) hudExitBtn.textContent = 'Exit Deck [Esc]';

  if (typeof window !== 'undefined' && typeof window.logToTerminal === 'function') {
    window.logToTerminal('Entered Presenter Deck Mode (Fullscreen)', 'success');
  }
}

export function exitPresenterMode() {
  if (typeof document === 'undefined') return;
  isPresenterActive = false;
  document.body.classList.remove('presenter-active');

  // Exit native fullscreen if active
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }

  // Stop timer and close overlays
  stopPresenterTimer();
  closeShortcutsModal();

  // Reset button texts (Anti-slop: zero emojis)
  const toggleBtn = document.getElementById('toggle-presenter-btn');
  if (toggleBtn) toggleBtn.textContent = 'Presenter Deck [F]';

  if (typeof window !== 'undefined' && typeof window.logToTerminal === 'function') {
    window.logToTerminal('Exited Presenter Deck Mode', 'info');
  }
}

export function togglePresenterMode() {
  if (isPresenterActive) {
    exitPresenterMode();
  } else {
    enterPresenterMode();
  }
}

// ============================================================================
// Presenter Progress Bar & Slide State Updater
// ============================================================================
export function updatePresenterUI(slideIdx) {
  if (typeof document === 'undefined') return;
  currentSlideIndex = slideIdx;

  // 1. Update Dedicated Presenter Progress Bar (#presenter-progress-bar)
  const progressBar = document.getElementById('presenter-progress-bar');
  const progressFill = document.getElementById('presenter-progress-fill');
  const pct = Math.min(100, Math.max(0, ((slideIdx + 1) / totalSlidesCount) * 100));

  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', (slideIdx + 1).toString());
    progressBar.style.setProperty('--presenter-pct', `${pct}%`);
  }
  if (progressFill) {
    progressFill.style.width = `${pct}%`;
  }

  // Also update syllabus progress bar if present
  const syllabusProgress = document.getElementById('syllabus-progress');
  if (syllabusProgress) {
    syllabusProgress.style.width = `${pct}%`;
  }

  // 2. Update HUD slide indicators
  const hudSlideNum = document.getElementById('hud-slide-indicator');
  if (hudSlideNum) {
    hudSlideNum.textContent = `${(slideIdx + 1).toString().padStart(2, '0')} / ${totalSlidesCount.toString().padStart(2, '0')}`;
  }

  // 3. Update Presenter Coaching Notes Content
  updatePresenterNotesContent(slideIdx);
}

// ============================================================================
// Presenter Notes Panel Logic
// ============================================================================
export function togglePresenterNotes() {
  const panel = document.getElementById('presenter-notes-panel');
  if (!panel) return;
  isNotesExpanded = !isNotesExpanded;
  panel.style.display = isNotesExpanded ? 'block' : 'none';

  const notesBtn = document.getElementById('hud-notes-btn');
  if (notesBtn) {
    notesBtn.classList.toggle('active', isNotesExpanded);
  }
}

function updatePresenterNotesContent(slideIdx) {
  if (typeof document === 'undefined') return;
  const notes = PRESENTER_NOTES[slideIdx] || PRESENTER_NOTES[0];
  if (!notes) return;

  const badge = document.getElementById('notes-module-badge');
  const timeEl = document.getElementById('notes-time-target');
  const thesisEl = document.getElementById('notes-thesis');
  const pointsList = document.getElementById('notes-talking-points');
  const socraticEl = document.getElementById('notes-socratic-cue');
  const demoEl = document.getElementById('notes-demo-cue');
  const takeawayEl = document.getElementById('notes-takeaway');

  if (badge) badge.textContent = `Module ${notes.moduleNumber}`;
  if (timeEl) timeEl.textContent = `Target: ${notes.timeTarget}`;
  if (thesisEl) thesisEl.textContent = notes.coreThesis;
  if (socraticEl) socraticEl.textContent = notes.socraticCue;
  if (demoEl) demoEl.textContent = notes.liveCodingDemo;
  if (takeawayEl) takeawayEl.textContent = notes.keyTakeaway;

  if (pointsList) {
    pointsList.innerHTML = notes.talkingPoints
      .map(pt => `<li class="notes-point-item"><span class="notes-bullet">&bull;</span><span>${pt}</span></li>`)
      .join('');
  }
}

// ============================================================================
// Keyboard Shortcuts Overlay Modal ([?] or [H])
// ============================================================================
export function isShortcutsModalOpen() {
  return isShortcutsModalOpenState;
}

export function openShortcutsModal() {
  if (typeof document === 'undefined') return;
  const modalBackdrop = document.getElementById('shortcuts-modal-backdrop');
  if (!modalBackdrop) return;
  modalBackdrop.style.display = 'flex';
  isShortcutsModalOpenState = true;
  document.body.classList.add('shortcuts-modal-open');

  // Focus close button for keyboard accessibility
  const closeBtn = document.getElementById('close-shortcuts-modal-btn');
  if (closeBtn) closeBtn.focus();
}

export function closeShortcutsModal() {
  if (typeof document === 'undefined') return;
  const modalBackdrop = document.getElementById('shortcuts-modal-backdrop');
  if (!modalBackdrop) return;
  modalBackdrop.style.display = 'none';
  isShortcutsModalOpenState = false;
  document.body.classList.remove('shortcuts-modal-open');
}

export function toggleShortcutsModal() {
  if (isShortcutsModalOpenState) {
    closeShortcutsModal();
  } else {
    openShortcutsModal();
  }
}

// ============================================================================
// Global Keyboard Navigation & Focus Trapping
// ============================================================================
export function setupPresenterKeyboardNavigation() {
  if (typeof window === 'undefined') return;

  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;

    // Strict Focus Trapping: verify if user is typing in code editor or text input
    const isInputFocused = activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.tagName === 'SELECT' ||
      activeEl.isContentEditable ||
      (activeEl.getAttribute && activeEl.getAttribute('contenteditable') === 'true') ||
      Boolean(activeEl.closest && activeEl.closest('.code-editor-wrapper'))
    );

    // If focused inside an input/textarea/editable
    if (isInputFocused) {
      // Escape blurs the active text field and safely returns
      if (e.key === 'Escape') {
        activeEl.blur();
        e.preventDefault();
      }
      return; // Do NOT trigger any presenter shortcuts while user is typing
    }

    // Modal dismiss check: Escape closes shortcuts modal if open
    if (isShortcutsModalOpenState) {
      if (e.key === 'Escape' || e.key === '?' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        closeShortcutsModal();
        return;
      }
    }

    // [F] or [P]: Toggle Fullscreen Presenter Mode
    if (e.key === 'f' || e.key === 'F' || e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      togglePresenterMode();
      return;
    }

    // [?] or [H]: Toggle keyboard shortcuts overlay modal
    if (e.key === '?' || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      toggleShortcutsModal();
      return;
    }

    // Space / ArrowRight / PageDown: Next module / slide
    if (e.key === ' ' || e.code === 'Space' || e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      nextSlide();
      return;
    }

    // ArrowLeft / PageUp: Previous module / slide
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
      return;
    }

    // [Escape]: Exit presenter mode / close modal / close drawer
    if (e.key === 'Escape') {
      if (isShortcutsModalOpenState) {
        closeShortcutsModal();
        return;
      }
      const drawer = document.getElementById('module-drawer');
      const backdrop = document.getElementById('module-drawer-backdrop');
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        return;
      }
      if (isPresenterActive) {
        e.preventDefault();
        exitPresenterMode();
        return;
      }
    }

    // [1] through [9]: Instant jump to Modules 1 through 9
    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const targetIdx = parseInt(e.key, 10) - 1;
      jumpToSlide(targetIdx);
      return;
    }

    // [0]: Instant jump to Module 10
    if (e.key === '0') {
      e.preventDefault();
      jumpToSlide(9);
      return;
    }

    // [N] or [n]: Toggle presenter coaching notes
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      togglePresenterNotes();
      return;
    }

    // [T] or [t]: Reset elapsed presentation timer
    if (e.key === 't' || e.key === 'T') {
      if (isPresenterActive) {
        e.preventDefault();
        resetPresenterTimer();
        return;
      }
    }

    // [R] or [r]: Toggle quiz solution reveal
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      if (typeof window.toggleSolution === 'function') {
        window.toggleSolution();
      }
      return;
    }

    // [M] or [m]: Toggle module selector drawer
    if (e.key === 'm' || e.key === 'M') {
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
  });

  // Native fullscreen change handler
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isPresenterActive) {
      exitPresenterMode();
    }
  });
}

// ============================================================================
// DOM Scaffolding & Component Mounting
// ============================================================================
export function mountPresenterDOM() {
  if (typeof document === 'undefined') return;

  // 1. Mount Dedicated #presenter-progress-bar at top of viewport
  if (!document.getElementById('presenter-progress-bar')) {
    const bar = document.createElement('div');
    bar.id = 'presenter-progress-bar';
    bar.className = 'presenter-progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuenow', '1');
    bar.setAttribute('aria-valuemin', '1');
    bar.setAttribute('aria-valuemax', '10');
    bar.setAttribute('aria-label', 'Slide Presentation Progress');
    bar.innerHTML = '<div id="presenter-progress-fill" class="presenter-progress-fill" style="width:10%;"></div>';
    document.body.prepend(bar);
  }

  // 2. Enhance Presenter HUD with Timer & Action Buttons if not already present
  const hud = document.querySelector('.presenter-hud');
  if (hud) {
    if (!document.getElementById('presenter-timer-wrap')) {
      const timerWrap = document.createElement('div');
      timerWrap.id = 'presenter-timer-wrap';
      timerWrap.className = 'presenter-timer-wrap';
      timerWrap.innerHTML = `
        <span class="timer-tag" style="color:var(--t-muted); font-size:0.75rem; font-family:var(--font-mono);">TIME</span>
        <span id="presenter-timer" class="presenter-timer-clock">00:00</span>
        <button id="presenter-timer-reset" class="timer-reset-btn deck-btn" title="Reset Presentation Timer [T]" aria-label="Reset Timer">Reset [T]</button>
      `;
      hud.appendChild(timerWrap);
    }

    if (!document.getElementById('hud-notes-btn')) {
      const notesBtn = document.createElement('button');
      notesBtn.id = 'hud-notes-btn';
      notesBtn.className = 'deck-btn liquid-glass-btn';
      notesBtn.title = 'Toggle Presenter Notes [N]';
      notesBtn.textContent = 'Notes [N]';
      hud.appendChild(notesBtn);
    }

    if (!document.getElementById('hud-shortcuts-btn')) {
      const shortcutsBtn = document.createElement('button');
      shortcutsBtn.id = 'hud-shortcuts-btn';
      shortcutsBtn.className = 'deck-btn liquid-glass-btn';
      shortcutsBtn.title = 'Keyboard Shortcuts Reference [?]';
      shortcutsBtn.textContent = 'Help [?]';
      hud.appendChild(shortcutsBtn);
    }

    // Ensure slide indicator span exists
    if (!document.getElementById('hud-slide-indicator')) {
      const indicator = document.createElement('span');
      indicator.id = 'hud-slide-indicator';
      indicator.className = 'tone-badge';
      indicator.style.borderColor = 'var(--c-cobalt-rim)';
      indicator.style.color = 'var(--c-amber)';
      indicator.textContent = '01 / 10';
      hud.querySelector('div:first-child')?.appendChild(indicator);
    }
  }

  // 3. Mount Presenter Coaching Notes Panel
  if (!document.getElementById('presenter-notes-panel')) {
    const stageContainer = document.getElementById('slide-stage-container') || document.getElementById('section-syllabus');
    if (stageContainer) {
      const notesPanel = document.createElement('div');
      notesPanel.id = 'presenter-notes-panel';
      notesPanel.className = 'presenter-notes-card liquid-glass-card';
      notesPanel.style.display = 'none';
      notesPanel.innerHTML = `
        <div class="presenter-notes-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.6rem;">
          <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
            <span class="tone-badge" style="border-color:var(--c-amber); color:var(--c-amber);">PRESENTER COACHING NOTES</span>
            <span id="notes-module-badge" class="tone-badge">Module 01</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span id="notes-time-target" class="notes-time-pill" style="font-family:var(--font-mono); font-size:0.8rem; color:var(--t-muted);">Target: 3-4 min</span>
            <button id="close-notes-btn" class="deck-btn" title="Close Presenter Notes [N]" style="padding:0.2rem 0.6rem;">Close [N]</button>
          </div>
        </div>
        <div class="presenter-notes-body">
          <div style="margin-bottom:1rem;">
            <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber); font-weight:700; margin-bottom:0.3rem;">[CORE THESIS]</div>
            <p id="notes-thesis" style="font-size:0.95rem; color:var(--t-primary); margin:0; line-height:1.6;"></p>
          </div>
          <div style="margin-bottom:1rem;">
            <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber); font-weight:700; margin-bottom:0.4rem;">[KEY TALKING POINTS]</div>
            <ul id="notes-talking-points" class="notes-points-list" style="margin:0; padding-left:1.2rem; line-height:1.6; font-size:0.9rem; color:var(--t-secondary);"></ul>
          </div>
          <div class="grid-2col" style="margin-bottom:1rem; gap:1rem;">
            <div style="background:var(--c-obsidian); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1rem;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber); font-weight:700; display:block; margin-bottom:0.3rem;">[SOCRATIC PROMPT]</span>
              <p id="notes-socratic-cue" style="font-size:0.88rem; color:var(--t-primary); margin:0; line-height:1.5; font-style:italic;"></p>
            </div>
            <div style="background:var(--c-obsidian); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1rem;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-ember); font-weight:700; display:block; margin-bottom:0.3rem;">[LIVE CODING DEMO]</span>
              <p id="notes-demo-cue" style="font-size:0.88rem; color:var(--t-primary); margin:0; line-height:1.5;"></p>
            </div>
          </div>
          <div style="background:rgba(249, 115, 22, 0.08); border-left:3px solid var(--c-ember); padding:0.8rem 1rem; border-radius:0 var(--r-inner) var(--r-inner) 0;">
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber); font-weight:700;">KEY TAKEAWAY: </span>
            <span id="notes-takeaway" style="font-size:0.9rem; color:var(--t-primary);"></span>
          </div>
        </div>
      `;
      stageContainer.insertBefore(notesPanel, stageContainer.firstChild);
    }
  }

  // 4. Mount Keyboard Shortcuts Overlay Modal
  if (!document.getElementById('shortcuts-modal-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.id = 'shortcuts-modal-backdrop';
    backdrop.className = 'shortcuts-backdrop';
    backdrop.style.display = 'none';
    backdrop.innerHTML = `
      <div id="keyboard-shortcuts-modal" class="shortcuts-modal liquid-glass-card" role="dialog" aria-modal="true" aria-labelledby="shortcuts-modal-title">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.6rem;">
          <div>
            <span class="tone-badge" style="border-color:var(--c-amber); color:var(--c-amber); margin-bottom:0.3rem;">KEYBOARD NAVIGATION</span>
            <h3 id="shortcuts-modal-title" style="font-size:1.35rem; color:var(--t-primary); margin:0;">Global Keyboard Shortcuts Reference</h3>
          </div>
          <button id="close-shortcuts-modal-btn" class="deck-btn liquid-glass-btn" title="Close Shortcuts [Esc]">Close [Esc]</button>
        </div>
        
        <div class="shortcuts-content-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.2rem; margin-bottom:1.5rem;">
          <div style="background:var(--c-obsidian); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem;">
            <h4 style="font-family:var(--font-mono); font-size:0.85rem; color:var(--c-amber); text-transform:uppercase; margin:0 0 0.8rem 0; letter-spacing:0.05em;">Presentation Deck</h4>
            <div class="shortcut-item"><span class="shortcut-action">Toggle Fullscreen Presenter Mode</span><span class="shortcut-keycap"><kbd>F</kbd> or <kbd>P</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Exit Presenter Mode / Close Modal</span><span class="shortcut-keycap"><kbd>Esc</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Toggle Presenter Coaching Notes</span><span class="shortcut-keycap"><kbd>N</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Reset Presentation Timer</span><span class="shortcut-keycap"><kbd>T</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Toggle Solution Reveal (Quiz Mode)</span><span class="shortcut-keycap"><kbd>R</kbd></span></div>
          </div>
          
          <div style="background:var(--c-obsidian); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem;">
            <h4 style="font-family:var(--font-mono); font-size:0.85rem; color:var(--c-amber); text-transform:uppercase; margin:0 0 0.8rem 0; letter-spacing:0.05em;">Slide Navigation</h4>
            <div class="shortcut-item"><span class="shortcut-action">Next Module / Slide</span><span class="shortcut-keycap"><kbd>Space</kbd> <kbd>→</kbd> <kbd>PageDown</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Previous Module / Slide</span><span class="shortcut-keycap"><kbd>←</kbd> <kbd>PageUp</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Instant Jump to Modules 1–9</span><span class="shortcut-keycap"><kbd>1</kbd> – <kbd>9</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Instant Jump to Module 10</span><span class="shortcut-keycap"><kbd>0</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Toggle Module Selector Drawer</span><span class="shortcut-keycap"><kbd>M</kbd></span></div>
          </div>
          
          <div style="background:var(--c-obsidian); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem;">
            <h4 style="font-family:var(--font-mono); font-size:0.85rem; color:var(--c-amber); text-transform:uppercase; margin:0 0 0.8rem 0; letter-spacing:0.05em;">System &amp; Safety</h4>
            <div class="shortcut-item"><span class="shortcut-action">Toggle Keyboard Shortcuts Reference</span><span class="shortcut-keycap"><kbd>?</kbd> or <kbd>H</kbd></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Focus Safe Mode (Typing Protection)</span><span class="shortcut-keycap"><span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber);">Active in Editor</span></span></div>
            <div class="shortcut-item"><span class="shortcut-action">Leave Code Editor / Blur Input</span><span class="shortcut-keycap"><kbd>Esc</kbd></span></div>
          </div>
        </div>
        
        <div style="border-top:1px solid var(--c-hairline); padding-top:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--t-muted);">Press <kbd style="color:var(--c-amber);">?</kbd> or <kbd style="color:var(--c-amber);">H</kbd> anytime outside editors to toggle this reference.</span>
          <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--c-amber);">Creative Skills Encyclopedia 2026</span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeShortcutsModal();
      }
    });

    const closeBtn = document.getElementById('close-shortcuts-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeShortcutsModal);
    }
  }

  // Bind HUD buttons
  const hudNotesBtn = document.getElementById('hud-notes-btn');
  if (hudNotesBtn) {
    hudNotesBtn.addEventListener('click', togglePresenterNotes);
  }

  const hudShortcutsBtn = document.getElementById('hud-shortcuts-btn');
  if (hudShortcutsBtn) {
    hudShortcutsBtn.addEventListener('click', toggleShortcutsModal);
  }

  const timerResetBtn = document.getElementById('presenter-timer-reset');
  if (timerResetBtn) {
    timerResetBtn.addEventListener('click', resetPresenterTimer);
  }

  const closeNotesBtn = document.getElementById('close-notes-btn');
  if (closeNotesBtn) {
    closeNotesBtn.addEventListener('click', togglePresenterNotes);
  }
}

// ============================================================================
// Initialization Entry Point
// ============================================================================
export function initPresenterDeck() {
  if (isInitialized) return;
  isInitialized = true;

  if (typeof document !== 'undefined') {
    mountPresenterDOM();
    setupPresenterKeyboardNavigation();
    updatePresenterUI(currentSlideIndex);
  }

  // Expose global methods on window for tests and peer interop
  if (typeof window !== 'undefined') {
    window.togglePresenterMode = togglePresenterMode;
    window.enterPresenterMode = enterPresenterMode;
    window.exitPresenterMode = exitPresenterMode;
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.jumpToSlide = jumpToSlide;
    window.togglePresenterNotes = togglePresenterNotes;
    window.toggleShortcutsModal = toggleShortcutsModal;
    window.resetPresenterTimer = resetPresenterTimer;
    window.initPresenterDeck = initPresenterDeck;
    window.PRESENTER_NOTES = PRESENTER_NOTES;
  }
}
