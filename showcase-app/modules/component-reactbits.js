/**
 * React Bits Kinetic Typography Specialist Module
 * 2026 Frontier Edition // LeulTew Architecture
 * 
 * Standardized for the Creative Engineering Living Laboratory & Skills Encyclopedia.
 * Implements production-grade vanilla JavaScript & CSS ports of the 4 signature
 * React Bits kinetic typography primitives based on docs/frontier_registries_interactive_specs.md:
 * 
 * 1. BlurText:
 *    Sequential character/word unblur with spring translation physics:
 *    - filter: blur(12px) -> blur(0px)
 *    - opacity: 0 -> 1
 *    - translateY: 20px -> 0px (with spring cubic-bezier)
 *    - Screen reader accessibility: un-split text preserved in .sr-only container
 * 
 * 2. DecryptedText:
 *    Cyberpunk / matrix cryptographic character scramble:
 *    - Custom glyph set: ABCDEF0123456789!@#$%^&* (plus matrix, hex, binary presets)
 *    - Sequential left-to-right unmasking and lock-in
 *    - Instant hover and click re-triggering with visual state classes (.locked, .scrambling, .pending)
 * 
 * 3. VariableProximity:
 *    Real-time Euclidean pointer proximity tracking:
 *    - d = sqrt(dx^2 + dy^2) with quadratic falloff within customizable radius
 *    - Dynamically morphs variable font axes: font-variation-settings: 'wght' W, 'wdth' WD
 *    - Cross-browser fallbacks (font-weight, font-stretch) & real-time telemetry readout
 * 
 * 4. ShinyText:
 *    Hardware-accelerated specular gradient sweep across typography:
 *    - Dynamic linear gradient at customizable vector angle and sweep speed
 *    - Specular palettes (Ember, Liquid Silver, Cobalt Electric, Amber Gold)
 *    - Pause/resume toggle and zero layout jitter
 */

// ============================================================================
// CONSTANTS & GLYPH CONFIGURATIONS
// ============================================================================

export const REACTBITS_GLYPH_SETS = {
  // Required signature cryptographic glyph set
  crypto: 'ABCDEF0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/',
  // Authentic Matrix falling rain Katakana + numerals
  matrix: '0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
  // Low-level hardware memory hexadecimal dump
  hex: '0123456789ABCDEFabcdef',
  // Raw binary state stream
  binary: '01'
};

export const REACTBITS_SHINY_PALETTES = {
  ember: {
    bg: 'rgba(249, 115, 22, 0.32)',
    shimmer: '#ffedd5',
    glow: 'rgba(249, 115, 22, 0.45)'
  },
  silver: {
    bg: 'rgba(255, 255, 255, 0.25)',
    shimmer: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.50)'
  },
  cobalt: {
    bg: 'rgba(56, 189, 248, 0.32)',
    shimmer: '#e0f2fe',
    glow: 'rgba(56, 189, 248, 0.45)'
  },
  amber: {
    bg: 'rgba(255, 179, 92, 0.32)',
    shimmer: '#fffbeb',
    glow: 'rgba(255, 179, 92, 0.45)'
  }
};

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * Escapes characters for safe DOM string insertion.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Injects scoped CSS rules ensuring spring physics and hardware acceleration
 * across all 4 React Bits primitives without external styling dependencies.
 */
export function injectReactBitsStyles() {
  if (typeof document === 'undefined') return;
  const STYLE_ID = 'reactbits-kinetic-styles';
  if (document.getElementById(STYLE_ID)) return;

  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = `
    /* React Bits: BlurText Spring Physics */
    .blur-text-display {
      font-family: var(--font-display, 'Syne', sans-serif);
      font-size: clamp(1.3rem, 1rem + 2vw, 2.2rem);
      font-weight: 800;
      color: var(--t-primary, #f8fafc);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.45rem;
      line-height: 1.25;
      user-select: text;
    }
    .blur-text-word {
      display: inline-flex;
      white-space: pre;
    }
    .blur-text-char {
      display: inline-block;
      will-change: transform, filter, opacity;
      transform-origin: 50% 80%;
      transition: filter 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
                  transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1),
                  opacity 0.45s ease;
    }
    .blur-text-char.blurred {
      filter: blur(var(--blur-amount, 12px));
      transform: translateY(20px) scale(0.94);
      opacity: 0;
      pointer-events: none;
    }
    .blur-text-char.revealed {
      filter: blur(0px);
      transform: translateY(0px) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    /* React Bits: DecryptedText Cyberpunk Scramble */
    .decrypt-text-display {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: clamp(0.95rem, 0.85rem + 1vw, 1.35rem);
      font-weight: 700;
      color: var(--c-amber, #ffb35c);
      letter-spacing: 0.06em;
      word-break: break-all;
      user-select: none;
    }
    .decrypt-char {
      display: inline-block;
      transition: color 0.12s ease;
    }
    .decrypt-char.locked {
      color: var(--c-ember, #f97316);
      text-shadow: 0 0 10px rgba(249, 115, 22, 0.45);
    }
    .decrypt-char.scrambling {
      color: #38bdf8;
      text-shadow: 0 0 8px rgba(56, 189, 248, 0.55);
    }
    .decrypt-char.pending {
      color: var(--t-muted, #8090a7);
      opacity: 0.55;
    }

    /* React Bits: VariableProximity Font Axis Morphing */
    .proximity-container {
      font-family: var(--font-display, 'Syne', 'Plus Jakarta Sans', sans-serif);
      font-size: clamp(1.15rem, 0.95rem + 1.8vw, 2rem);
      cursor: default;
      user-select: none;
      line-height: 1.3;
      text-align: center;
      width: 100%;
    }
    .proximity-word {
      display: inline-flex;
      margin-right: 0.45rem;
    }
    .proximity-char {
      display: inline-block;
      font-variation-settings: 'wght' 200, 'wdth' 60;
      font-weight: 200;
      font-stretch: 60%;
      color: var(--t-primary, #f8fafc);
      transition: font-variation-settings 0.12s ease-out,
                  font-weight 0.12s ease-out,
                  font-stretch 0.12s ease-out,
                  color 0.15s ease;
      will-change: font-variation-settings, font-weight, font-stretch, color;
    }

    /* React Bits: ShinyText Specular Gradient Sweep */
    .shiny-text-target {
      font-family: var(--font-display, 'Syne', sans-serif);
      font-size: clamp(1.25rem, 1.05rem + 1.6vw, 2.2rem);
      font-weight: 800;
      letter-spacing: 0.04em;
      display: inline-block;
      background: linear-gradient(
        var(--shiny-angle, 120deg),
        var(--shiny-bg, rgba(249, 115, 22, 0.32)) 0%,
        var(--shiny-bg, rgba(249, 115, 22, 0.32)) 35%,
        var(--shiny-shimmer, #ffedd5) 50%,
        var(--shiny-bg, rgba(249, 115, 22, 0.32)) 65%,
        var(--shiny-bg, rgba(249, 115, 22, 0.32)) 100%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: reactbits-shiny-sweep var(--shiny-speed, 2.2s) infinite linear;
      will-change: background-position;
    }
    .shiny-text-target.paused {
      animation-play-state: paused !important;
    }
    @keyframes reactbits-shiny-sweep {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Accessibility: prefers-reduced-motion fallback */
    @media (prefers-reduced-motion: reduce) {
      .blur-text-char {
        transition: none !important;
        animation: none !important;
        filter: none !important;
        transform: none !important;
        opacity: 1 !important;
      }
      .shiny-text-target {
        animation: none !important;
        background-position: 0 0 !important;
      }
      .proximity-char {
        transition: none !important;
        font-variation-settings: 'wght' 600, 'wdth' 100 !important;
        font-weight: 600 !important;
        font-stretch: 100% !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

// ============================================================================
// 1. BLUR TEXT ENGINE (Sequential Unblur + Spring Translation Physics)
// ============================================================================

/**
 * Initializes the React Bits BlurText engine.
 * Sequentially unblurs characters/words with spring translation physics:
 * filter: blur(12px) -> blur(0px), opacity: 0 -> 1, translateY: 20px -> 0px.
 * Preserves un-split text in screen reader container (.sr-only).
 * 
 * @param {Object} [options]
 * @param {string} [options.stageId='blur-text-stage']
 * @param {string} [options.srId='blur-text-sr']
 * @param {string} [options.inputId='blur-input']
 * @param {string} [options.playBtnId='blur-play-btn']
 * @param {string} [options.staggerSliderId='blur-stagger-slider']
 * @param {string} [options.staggerValId='blur-stagger-val']
 * @param {string} [options.blurSliderId='blur-amount-slider']
 * @param {string} [options.blurValId='blur-amount-val']
 * @returns {Object} BlurText controller with trigger() and cleanup()
 */
export function initBlurText(options = {}) {
  if (typeof document === 'undefined') return { trigger: () => {}, cleanup: () => {} };

  const {
    stageId = 'blur-text-stage',
    srId = 'blur-text-sr',
    inputId = 'blur-input',
    playBtnId = 'blur-play-btn',
    staggerSliderId = 'blur-stagger-slider',
    staggerValId = 'blur-stagger-val',
    blurSliderId = 'blur-amount-slider',
    blurValId = 'blur-amount-val'
  } = options;

  const stage = document.getElementById(stageId);
  const srEl = document.getElementById(srId);
  const input = document.getElementById(inputId);
  const playBtn = document.getElementById(playBtnId);
  const staggerSlider = document.getElementById(staggerSliderId);
  const staggerVal = document.getElementById(staggerValId);
  const blurSlider = document.getElementById(blurSliderId);
  const blurVal = document.getElementById(blurValId);

  if (!stage) return { trigger: () => {}, cleanup: () => {} };

  let activeTimeouts = [];

  function clearPending() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
  }

  function triggerReveal() {
    clearPending();

    const rawText = input && input.value.trim() 
      ? input.value.trim() 
      : 'Physical Precision Over Generative Slop';

    // Accessibility: preserve authentic un-split phrase in .sr-only
    if (srEl) {
      srEl.textContent = rawText;
      srEl.setAttribute('aria-live', 'polite');
    }

    // Prepare visual display
    stage.innerHTML = '';
    stage.setAttribute('aria-hidden', 'true');

    const staggerMs = staggerSlider ? parseInt(staggerSlider.value, 10) : 45;
    const blurRadius = blurSlider ? parseInt(blurSlider.value, 10) : 12;
    stage.style.setProperty('--blur-amount', `${blurRadius}px`);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = rawText.split(' ');
    let globalCharIndex = 0;

    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'blur-text-word';
      wordSpan.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const charSpan = document.createElement('span');
        charSpan.className = 'blur-text-char' + (isReducedMotion ? ' revealed' : ' blurred');
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);

        if (!isReducedMotion) {
          const delay = globalCharIndex * staggerMs;
          const timeout = setTimeout(() => {
            charSpan.classList.remove('blurred');
            charSpan.classList.add('revealed');
          }, delay);
          activeTimeouts.push(timeout);
        }

        globalCharIndex++;
      }

      stage.appendChild(wordSpan);

      // Append space word separator if not last word
      if (wordIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'blur-text-word';
        spaceSpan.innerHTML = '&nbsp;';
        stage.appendChild(spaceSpan);
      }
    });
  }

  // Event Listeners
  if (playBtn) {
    playBtn.addEventListener('click', triggerReveal);
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerReveal();
      }
    });
  }

  if (staggerSlider && staggerVal) {
    staggerSlider.addEventListener('input', (e) => {
      staggerVal.textContent = `${e.target.value}ms`;
    });
  }

  if (blurSlider && blurVal) {
    blurSlider.addEventListener('input', (e) => {
      blurVal.textContent = `${e.target.value}px`;
      stage.style.setProperty('--blur-amount', `${e.target.value}px`);
    });
  }

  // Initial trigger
  triggerReveal();

  return {
    trigger: triggerReveal,
    cleanup: () => {
      clearPending();
    }
  };
}

// ============================================================================
// 2. DECRYPTED TEXT ENGINE (Cyberpunk / Monospace Cryptographic Scramble)
// ============================================================================

/**
 * Initializes the React Bits DecryptedText engine.
 * Cyberpunk / matrix cryptographic character scramble with custom glyph set
 * (ABCDEF0123456789!@#$%^&*), sequential unmasking, and instant hover/click scrambling.
 * 
 * @param {Object} [options]
 * @param {string} [options.stageId='decrypt-text-stage']
 * @param {string} [options.srId='decrypt-text-sr']
 * @param {string} [options.inputId='decrypt-input']
 * @param {string} [options.triggerBtnId='decrypt-trigger-btn']
 * @param {string} [options.triggerCardId='decrypt-card-trigger']
 * @param {string} [options.glyphSelectId='decrypt-glyph-select']
 * @param {string} [options.speedSliderId='decrypt-speed-slider']
 * @param {string} [options.speedValId='decrypt-speed-val']
 * @param {string} [options.iterSliderId='decrypt-iter-slider']
 * @param {string} [options.iterValId='decrypt-iter-val']
 * @returns {Object} DecryptedText controller with scramble() and cleanup()
 */
export function initDecryptedText(options = {}) {
  if (typeof document === 'undefined') return { scramble: () => {}, cleanup: () => {} };

  const {
    stageId = 'decrypt-text-stage',
    srId = 'decrypt-text-sr',
    inputId = 'decrypt-input',
    triggerBtnId = 'decrypt-trigger-btn',
    triggerCardId = 'decrypt-card-trigger',
    glyphSelectId = 'decrypt-glyph-select',
    speedSliderId = 'decrypt-speed-slider',
    speedValId = 'decrypt-speed-val',
    iterSliderId = 'decrypt-iter-slider',
    iterValId = 'decrypt-iter-val'
  } = options;

  const stage = document.getElementById(stageId);
  const srEl = document.getElementById(srId);
  const input = document.getElementById(inputId);
  const triggerBtn = document.getElementById(triggerBtnId);
  const triggerCard = document.getElementById(triggerCardId);
  const glyphSelect = document.getElementById(glyphSelectId);
  const speedSlider = document.getElementById(speedSliderId);
  const speedVal = document.getElementById(speedValId);
  const iterSlider = document.getElementById(iterSliderId);
  const iterVal = document.getElementById(iterValId);

  if (!stage) return { scramble: () => {}, cleanup: () => {} };

  let animationInterval = null;

  function cancelScramble() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  }

  function scramble() {
    cancelScramble();

    const targetText = input && input.value.trim() 
      ? input.value.trim() 
      : 'LEUL-5070TI · QUANTUM_ENCRYPTED_2026';

    // Accessibility: preserve target string in .sr-only
    if (srEl) {
      srEl.textContent = targetText;
      srEl.setAttribute('aria-live', 'polite');
    }

    stage.setAttribute('aria-hidden', 'true');

    // Accessibility reduced motion check
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
      stage.innerHTML = targetText
        .split('')
        .map(c => `<span class="decrypt-char locked">${escapeHtml(c)}</span>`)
        .join('');
      return;
    }

    const glyphKey = glyphSelect ? glyphSelect.value : 'crypto';
    const glyphs = REACTBITS_GLYPH_SETS[glyphKey] || REACTBITS_GLYPH_SETS.crypto;
    const speedMs = speedSlider ? parseInt(speedSlider.value, 10) : 30;
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

        // Sequential left-to-right unmasking threshold
        const lockThreshold = i * 2;

        if (iteration >= lockThreshold + maxIterations) {
          // Locked authentic glyph
          displayHtml += `<span class="decrypt-char locked">${escapeHtml(char)}</span>`;
        } else if (iteration >= lockThreshold) {
          // Active high-speed scramble mutation
          completed = false;
          const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          displayHtml += `<span class="decrypt-char scrambling">${escapeHtml(randomGlyph)}</span>`;
        } else {
          // Pending character state
          completed = false;
          const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          displayHtml += `<span class="decrypt-char pending">${escapeHtml(randomGlyph)}</span>`;
        }
      }

      stage.innerHTML = displayHtml;
      iteration++;

      if (completed) {
        cancelScramble();
      }
    }, speedMs);
  }

  // Interactive controls
  if (triggerBtn) {
    triggerBtn.addEventListener('click', scramble);
  }

  if (triggerCard) {
    let lastHoverTime = 0;
    triggerCard.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastHoverTime > 350) {
        lastHoverTime = now;
        scramble();
      }
    });
    triggerCard.addEventListener('click', scramble);
  }

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        scramble();
      }
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

  // Initial scramble
  scramble();

  return {
    scramble,
    cleanup: cancelScramble
  };
}

// ============================================================================
// 3. VARIABLE PROXIMITY ENGINE (Euclidean Cursor Tracking & Variable Font Axes)
// ============================================================================

/**
 * Initializes the React Bits VariableProximity engine.
 * Real-time Euclidean pointer proximity tracking (d = sqrt(dx^2 + dy^2)) that
 * dynamically morphs variable font axes ('wght' W, 'wdth' WD) on nearby characters.
 * 
 * @param {Object} [options]
 * @param {string} [options.stageId='proximity-stage']
 * @param {string} [options.wrapperId='proximity-chars-wrapper']
 * @param {string} [options.srId='proximity-text-sr']
 * @param {string} [options.radiusSliderId='prox-radius-slider']
 * @param {string} [options.radiusValId='prox-radius-val']
 * @param {string} [options.weightSliderId='prox-weight-slider']
 * @param {string} [options.weightValId='prox-weight-val']
 * @param {string} [options.readoutId='prox-pointer-readout']
 * @param {string} [options.phrase='AWARD-WINNING PHYSICAL PRECISION']
 * @returns {Object} VariableProximity controller with refreshCenters() and cleanup()
 */
export function initVariableProximity(options = {}) {
  if (typeof document === 'undefined') return { refreshCenters: () => {}, cleanup: () => {} };

  const {
    stageId = 'proximity-stage',
    wrapperId = 'proximity-chars-wrapper',
    srId = 'proximity-text-sr',
    radiusSliderId = 'prox-radius-slider',
    radiusValId = 'prox-radius-val',
    weightSliderId = 'prox-weight-slider',
    weightValId = 'prox-weight-val',
    readoutId = 'prox-pointer-readout',
    phrase = 'AWARD-WINNING PHYSICAL PRECISION'
  } = options;

  const stage = document.getElementById(stageId);
  const wrapper = document.getElementById(wrapperId);
  const srEl = document.getElementById(srId);
  const radiusSlider = document.getElementById(radiusSliderId);
  const radiusVal = document.getElementById(radiusValId);
  const weightSlider = document.getElementById(weightSliderId);
  const weightVal = document.getElementById(weightValId);
  const readout = document.getElementById(readoutId);

  if (!stage || !wrapper) return { refreshCenters: () => {}, cleanup: () => {} };

  let charCenters = [];

  // Build character spans inside wrapper
  function buildSpans() {
    wrapper.innerHTML = '';
    wrapper.setAttribute('aria-hidden', 'true');

    if (srEl) {
      srEl.textContent = phrase;
      srEl.setAttribute('aria-live', 'polite');
    }

    const words = phrase.split(' ');
    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'proximity-word';
      wordSpan.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const span = document.createElement('span');
        span.className = 'proximity-char';
        span.textContent = char;
        span.style.fontVariationSettings = "'wght' 200, 'wdth' 60";
        span.style.fontWeight = '200';
        span.style.fontStretch = '60%';
        wordSpan.appendChild(span);
      }

      wrapper.appendChild(wordSpan);
    });
  }

  buildSpans();

  // Cache bounding centers
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

  // Pointer move handler with Euclidean distance calculation
  function onPointerMove(e) {
    if (charCenters.length === 0 || charCenters[0].x === 0) {
      cacheCenters();
    }

    const radius = radiusSlider ? parseFloat(radiusSlider.value) : 150;
    const maxWeight = weightSlider ? parseFloat(weightSlider.value) : 850;
    const pointerX = e.clientX;
    const pointerY = e.clientY;

    let activeCount = 0;

    charCenters.forEach(item => {
      // Euclidean distance: d = sqrt(dx^2 + dy^2)
      const dx = pointerX - item.x;
      const dy = pointerY - item.y;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        activeCount++;
        const factor = 1 - (dist / radius);
        const p = factor * factor; // Quadratic falloff

        // Weight axis (200 -> maxWeight)
        const w = Math.round(200 + p * (maxWeight - 200));
        // Width axis (60 -> 125)
        const wdth = Math.round(60 + p * 65);

        item.el.style.fontVariationSettings = `'wght' ${w}, 'wdth' ${wdth}`;
        item.el.style.fontWeight = w.toString();
        item.el.style.fontStretch = `${wdth}%`;

        // Luminous chromatic glow threshold
        if (p > 0.45) {
          item.el.style.color = 'var(--c-ember, #f97316)';
        } else if (p > 0.15) {
          item.el.style.color = 'var(--c-amber, #ffb35c)';
        } else {
          item.el.style.color = 'var(--t-primary, #f8fafc)';
        }
      } else {
        item.el.style.fontVariationSettings = "'wght' 200, 'wdth' 60";
        item.el.style.fontWeight = '200';
        item.el.style.fontStretch = '60%';
        item.el.style.color = 'var(--t-primary, #f8fafc)';
      }
    });

    if (readout) {
      const stageRect = stage.getBoundingClientRect();
      const localX = Math.round(pointerX - stageRect.left);
      const localY = Math.round(pointerY - stageRect.top);
      readout.textContent = `X: ${localX}px, Y: ${localY}px (${activeCount} chars warped)`;
    }
  }

  function resetChars() {
    charCenters.forEach(item => {
      item.el.style.fontVariationSettings = "'wght' 200, 'wdth' 60";
      item.el.style.fontWeight = '200';
      item.el.style.fontStretch = '60%';
      item.el.style.color = 'var(--t-primary, #f8fafc)';
    });
    if (readout) {
      readout.textContent = 'Waiting for hover...';
    }
  }

  // Register listeners
  stage.addEventListener('pointerenter', cacheCenters);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerleave', resetChars);

  // Touch device fallback
  stage.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      onPointerMove(e.touches[0]);
    }
  }, { passive: true });
  stage.addEventListener('touchend', resetChars);

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

  const resizeHandler = () => {
    setTimeout(cacheCenters, 80);
  };
  window.addEventListener('resize', resizeHandler);

  // Initial center caching
  setTimeout(cacheCenters, 120);

  // Global window hook for tab switching synchronization
  if (typeof window !== 'undefined') {
    window.refreshProximityCenters = cacheCenters;
  }

  return {
    refreshCenters: cacheCenters,
    cleanup: () => {
      stage.removeEventListener('pointerenter', cacheCenters);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', resetChars);
      window.removeEventListener('resize', resizeHandler);
    }
  };
}

// ============================================================================
// 4. SHINY TEXT ENGINE (Hardware-Accelerated Specular Shimmer Sweep)
// ============================================================================

/**
 * Initializes the React Bits ShinyText engine.
 * Specular gradient sweep animation across typography with adjustable sweep speed,
 * gradient vector angle, and chromatic palette presets.
 * 
 * @param {Object} [options]
 * @param {string} [options.targetId='shiny-text-target']
 * @param {string} [options.angleSliderId='shiny-angle-slider']
 * @param {string} [options.angleValId='shiny-angle-val']
 * @param {string} [options.speedSliderId='shiny-speed-slider']
 * @param {string} [options.speedValId='shiny-speed-val']
 * @param {string} [options.paletteSelectId='shiny-palette-select']
 * @param {string} [options.toggleBtnId='shiny-toggle-btn']
 * @returns {Object} ShinyText controller with updatePalette(), toggle(), and cleanup()
 */
export function initShinyText(options = {}) {
  if (typeof document === 'undefined') return { updatePalette: () => {}, toggle: () => {}, cleanup: () => {} };

  const {
    targetId = 'shiny-text-target',
    angleSliderId = 'shiny-angle-slider',
    angleValId = 'shiny-angle-val',
    speedSliderId = 'speedValId', // fallback
    speedSliderActualId = 'shiny-speed-slider',
    speedValId = 'shiny-speed-val',
    paletteSelectId = 'shiny-palette-select',
    toggleBtnId = 'shiny-toggle-btn'
  } = options;

  const target = document.getElementById(targetId);
  const angleSlider = document.getElementById(angleSliderId);
  const angleVal = document.getElementById(angleValId);
  const speedSlider = document.getElementById(speedSliderActualId);
  const speedVal = document.getElementById(speedValId);
  const paletteSelect = document.getElementById(paletteSelectId);
  const toggleBtn = document.getElementById(toggleBtnId);

  if (!target) return { updatePalette: () => {}, toggle: () => {}, cleanup: () => {} };

  function applyPalette(key) {
    const pal = REACTBITS_SHINY_PALETTES[key] || REACTBITS_SHINY_PALETTES.ember;
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
      applyPalette(e.target.value);
    });
  }

  function togglePlayState() {
    const isPaused = target.classList.toggle('paused');
    if (toggleBtn) {
      toggleBtn.textContent = isPaused ? 'Resume Shimmer Sweep' : 'Pause Shimmer Sweep';
    }
    return isPaused;
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', togglePlayState);
  }

  // Set initial palette
  applyPalette('ember');

  return {
    updatePalette: applyPalette,
    toggle: togglePlayState,
    cleanup: () => {}
  };
}

// ============================================================================
// ROOT MASTER BOOTSTRAPPER: initReactBitsPlayground()
// ============================================================================

/**
 * Master bootstrapper for the React Bits Kinetic Typography playground
 * inside #section-motion-lab.
 * Initializes all 4 signature primitives:
 * - BlurText (Gaussian unblur + spring translation physics)
 * - DecryptedText (Cyberpunk scramble lock)
 * - VariableProximity (Euclidean pointer axis morphing)
 * - ShinyText (Hardware-accelerated specular gradient sweep)
 * 
 * @returns {Object} ReactBits playground controllers
 */
export function initReactBitsPlayground() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  // Ensure scoped spring CSS is present
  injectReactBitsStyles();

  // Initialize the 4 signature primitives
  const blurController = initBlurText();
  const decryptController = initDecryptedText();
  const proximityController = initVariableProximity();
  const shinyController = initShinyText();

  const playground = {
    blur: blurController,
    decrypt: decryptController,
    proximity: proximityController,
    shiny: shinyController,
    refreshProximityCenters: proximityController.refreshCenters
  };

  // Expose on global window object for console inspection & tab synchronization
  if (typeof window !== 'undefined') {
    window.initReactBitsPlayground = initReactBitsPlayground;
    window.reactBitsPlayground = playground;
  }

  return playground;
}

// Expose aliases matching existing app method naming conventions
export {
  initBlurText as initBlurTextDemo,
  initDecryptedText as initDecryptedTextDemo,
  initVariableProximity as initVariableProximityDemo,
  initShinyText as initShinyTextDemo
};

export default initReactBitsPlayground;

