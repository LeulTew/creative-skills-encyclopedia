/**
 * SunChips Whole-Canvas Flavour World Theming & Cultural Typography Module
 * 2026 Frontier Edition // LeulTew Architecture
 * 
 * Implements SunChips Ethiopia product site architecture:
 * 1. Whole-canvas Flavour World token management across 4 distinct worlds:
 *    - "ember": High-Chroma Ember Glow & Sunburst Amber (Default)
 *    - "cobalt": Midnight Navy & Electric Cobalt Blue
 *    - "harvest-gold": Dark Umber & Roasted Harvest Gold
 *    - "cosmic-violet": Abyssal Black & Cosmic Violet
 * 2. Certified WCAG AA contrast (>= 4.5:1 minimum text, target >= 14:1 primary text).
 * 3. Smooth CSS theme variable cross-fading via requestAnimationFrame.
 * 4. 3D particle cloud color cross-fade orchestration (window.updateParticlePalette).
 * 5. Keyboard-accessible radiogroup controls with localStorage persistence.
 */

// ============================================================================
// FLAVOUR WORLD TOKEN DEFINITIONS & CONTRAST MATRICES
// ============================================================================

export const FLAVOUR_WORLDS = {
  'ember': {
    id: 'ember',
    name: 'Ember',
    tagline: 'High-Chroma Ember Glow & Sunburst Amber',
    emoji: '🔥',
    obsidian: '#0a0b0e',      // Canvas Background (L: 0.0051)
    deepZinc: '#12141a',      // Primary Surface / Elevated Card
    elevatedZinc: '#181b24',  // Controls / Inputs
    cobaltRim: '#1e293b',     // Hairline Structural Borders
    ember: '#f97316',         // Primary Accent (High-Chroma Ember)
    amber: '#ffb35c',         // Secondary Highlight (Sunburst Amber)
    textPrimary: '#f8fafc',   // Contrast on #0a0b0e: 18.81:1 (Target >= 14:1)
    textSecondary: '#94a3b8', // Contrast on #0a0b0e: 7.68:1 (WCAG AA >= 4.5:1)
    textMuted: '#8090a7',     // Contrast on #0a0b0e: 6.06:1 (WCAG AA >= 4.5:1)
    textAccent: '#f97316',    // Contrast on #0a0b0e: 7.02:1 (WCAG AA >= 4.5:1)
    accentGlow: 'rgba(249, 115, 22, 0.28)',
    emberSoft: 'rgba(249, 115, 22, 0.14)',
    cardBg: 'rgba(18, 20, 26, 0.82)',
    particlePalette: ['#f97316', '#ffb35c', '#ea580c', '#fdba74', '#fed7aa', '#ffffff']
  },
  'cobalt': {
    id: 'cobalt',
    name: 'Cobalt',
    tagline: 'Midnight Navy & Electric Cobalt Blue',
    emoji: '⚡',
    obsidian: '#050b14',      // Canvas Background: Midnight Navy (L: 0.0053)
    deepZinc: '#0c192c',      // Surface: Cobalt Deep
    elevatedZinc: '#13243f',  // Controls: Elevated Navy
    cobaltRim: '#1e3a5f',     // Structural Rim
    ember: '#0284c7',         // Primary Accent: Electric Cobalt
    amber: '#38bdf8',         // Secondary Highlight: Sky Blue
    textPrimary: '#f0f9ff',   // Contrast on #050b14: 18.51:1 (Target >= 14:1)
    textSecondary: '#93c5fd', // Contrast on #050b14: 10.94:1 (WCAG AA >= 4.5:1)
    textMuted: '#7ea5cc',     // Contrast on #050b14: 7.65:1 (WCAG AA >= 4.5:1)
    textAccent: '#38bdf8',    // Contrast on #050b14: 9.21:1 (WCAG AA >= 4.5:1)
    accentGlow: 'rgba(56, 189, 248, 0.32)',
    emberSoft: 'rgba(2, 132, 199, 0.16)',
    cardBg: 'rgba(12, 25, 44, 0.82)',
    particlePalette: ['#0284c7', '#38bdf8', '#0369a1', '#7dd3fc', '#bae6fd', '#ffffff']
  },
  'harvest-gold': {
    id: 'harvest-gold',
    name: 'Harvest Gold',
    tagline: 'Dark Umber & Roasted Harvest Gold',
    emoji: '🌾',
    obsidian: '#0f0d08',      // Canvas Background: Dark Umber (L: 0.0051)
    deepZinc: '#1c1810',      // Surface: Golden Earth
    elevatedZinc: '#2a2418',  // Controls: Warm Umber
    cobaltRim: '#3d3420',     // Structural Rim
    ember: '#eab308',         // Primary Accent: Roasted Harvest Gold
    amber: '#fef08a',         // Secondary Highlight: Warm Sand
    textPrimary: '#fefce8',   // Contrast on #0f0d08: 18.78:1 (Target >= 14:1)
    textSecondary: '#fef08a', // Contrast on #0f0d08: 16.69:1 (Target >= 14:1)
    textMuted: '#c2b89d',     // Contrast on #0f0d08: 9.84:1 (WCAG AA >= 4.5:1)
    textAccent: '#eab308',    // Contrast on #0f0d08: 10.13:1 (WCAG AA >= 4.5:1)
    accentGlow: 'rgba(234, 179, 8, 0.30)',
    emberSoft: 'rgba(234, 179, 8, 0.15)',
    cardBg: 'rgba(28, 24, 16, 0.82)',
    particlePalette: ['#eab308', '#fef08a', '#ca8a04', '#fde047', '#fef9c3', '#ffffff']
  },
  'cosmic-violet': {
    id: 'cosmic-violet',
    name: 'Cosmic Violet',
    tagline: 'Abyssal Black & Cosmic Violet',
    emoji: '✨',
    obsidian: '#090611',      // Canvas Background: Abyssal Black (L: 0.0052)
    deepZinc: '#150f26',      // Surface: Deep Violet
    elevatedZinc: '#201738',  // Controls: Electric Violet Step
    cobaltRim: '#35255c',     // Structural Rim
    ember: '#8b5cf6',         // Primary Accent: Electric Violet
    amber: '#ec4899',         // Secondary Highlight: Neon Fuchsia
    textPrimary: '#faf5ff',   // Contrast on #090611: 18.71:1 (Target >= 14:1)
    textSecondary: '#d8b4fe', // Contrast on #090611: 11.36:1 (WCAG AA >= 4.5:1)
    textMuted: '#a799c7',     // Contrast on #090611: 7.67:1 (WCAG AA >= 4.5:1)
    textAccent: '#c084fc',    // Contrast on #090611: 7.60:1 (WCAG AA >= 4.5:1)
    accentGlow: 'rgba(139, 92, 246, 0.32)',
    emberSoft: 'rgba(139, 92, 246, 0.16)',
    cardBg: 'rgba(21, 15, 38, 0.82)',
    particlePalette: ['#8b5cf6', '#ec4899', '#7c3aed', '#c084fc', '#f472b6', '#ffffff']
  }
};

const STORAGE_KEY = 'streak_flavour';
let activeFlavourKey = 'ember';
let currentAnimationId = null;

// ============================================================================
// COLOR MATH & WCAG RELATIVE LUMINANCE HELPERS
// ============================================================================

export function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(ch => ch + ch).join('');
  }
  const intVal = parseInt(clean, 16);
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255
  };
}

export function rgbToHex(r, g, b) {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val) => clamp(val).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const sRGB = [r / 255, g / 255, b / 255];
  const linear = sRGB.map(val => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function calculateContrast(fgHex, bgHex) {
  const lum1 = getRelativeLuminance(fgHex);
  const lum2 = getRelativeLuminance(bgHex);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function interpolateHex(hex1, hex2, factor) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const r = c1.r + (c2.r - c1.r) * factor;
  const g = c1.g + (c2.g - c1.g) * factor;
  const b = c1.b + (c2.b - c1.b) * factor;
  return rgbToHex(r, g, b);
}

export function interpolateRgba(rgba1, rgba2, factor) {
  const parse = (str) => {
    const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return { r: 0, g: 0, b: 0, a: 1 };
    return {
      r: parseFloat(match[1]),
      g: parseFloat(match[2]),
      b: parseFloat(match[3]),
      a: match[4] !== undefined ? parseFloat(match[4]) : 1
    };
  };
  const c1 = parse(rgba1);
  const c2 = parse(rgba2);
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  const a = (c1.a + (c2.a - c1.a) * factor).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ============================================================================
// THEME VARIABLE ANIMATION PIPELINE
// ============================================================================

/**
 * Smoothly interpolates theme CSS variables on the root element.
 * Ensures whole-canvas transitions feel physical, fluid, and artifact-free.
 */
function animateThemeTransition(fromTokens, toTokens, duration = 360, onComplete) {
  if (typeof window === 'undefined') return;

  if (currentAnimationId && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(currentAnimationId);
    currentAnimationId = null;
  }

  const startTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  const root = document.documentElement;

  const animProps = [
    { prop: '--c-obsidian', from: fromTokens.obsidian, to: toTokens.obsidian },
    { prop: '--c-bg-canvas', from: fromTokens.obsidian, to: toTokens.obsidian },
    { prop: '--c-deep-zinc', from: fromTokens.deepZinc, to: toTokens.deepZinc },
    { prop: '--c-elevated-zinc', from: fromTokens.elevatedZinc, to: toTokens.elevatedZinc },
    { prop: '--c-cobalt-rim', from: fromTokens.cobaltRim, to: toTokens.cobaltRim },
    { prop: '--c-ember', from: fromTokens.ember, to: toTokens.ember },
    { prop: '--c-amber', from: fromTokens.amber, to: toTokens.amber },
    { prop: '--t-accent', from: fromTokens.textAccent, to: toTokens.textAccent },
    { prop: '--c-accent-glow', from: fromTokens.accentGlow, to: toTokens.accentGlow, isRgba: true },
    { prop: '--c-ember-soft', from: fromTokens.emberSoft, to: toTokens.emberSoft, isRgba: true }
  ];

  function step(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    // Smooth cubic ease-out
    const progress = 1 - Math.pow(1 - rawProgress, 3);

    for (const item of animProps) {
      if (item.isRgba) {
        root.style.setProperty(item.prop, interpolateRgba(item.from, item.to, progress));
      } else {
        root.style.setProperty(item.prop, interpolateHex(item.from, item.to, progress));
      }
    }

    if (rawProgress < 1) {
      currentAnimationId = requestAnimationFrame(step);
    } else {
      currentAnimationId = null;
      // Clean up inline styles so canonical body[data-flavour] rules take over cleanly
      for (const item of animProps) {
        root.style.removeProperty(item.prop);
      }
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }

  currentAnimationId = requestAnimationFrame(step);
}

// ============================================================================
// CORE FLAVOUR WORLD SWITCHER API
// ============================================================================

export function getCurrentFlavour() {
  return activeFlavourKey;
}

export function getFlavourTokens(key = activeFlavourKey) {
  return FLAVOUR_WORLDS[key] || FLAVOUR_WORLDS['ember'];
}

/**
 * Sets the active Flavour World:
 * 1. Updates data-flavour on document.body.
 * 2. Updates active state and ARIA attributes on .flavour-pill.
 * 3. Cross-fades CSS theme variables via requestAnimationFrame.
 * 4. Calls window.updateParticlePalette(flavourKey) for live Three.js 3D stage sync.
 * 5. Persists selection in localStorage.
 */
export function setFlavourWorld(flavourKey, options = {}) {
  const { immediate = false } = options;

  if (!FLAVOUR_WORLDS[flavourKey]) {
    console.warn(`[FlavourWorlds] Unknown flavour key: "${flavourKey}". Falling back to "ember".`);
    flavourKey = 'ember';
  }

  const previousKey = activeFlavourKey;
  const fromTokens = FLAVOUR_WORLDS[previousKey] || FLAVOUR_WORLDS['ember'];
  const toTokens = FLAVOUR_WORLDS[flavourKey];

  activeFlavourKey = flavourKey;

  // 1. Update data-flavour on document.body
  if (typeof document !== 'undefined' && document.body) {
    document.body.setAttribute('data-flavour', flavourKey);
  }

  // 2. Update active pill state & ARIA attributes
  updatePillUI(flavourKey);

  // 3. Smoothly animate theme variables
  if (immediate) {
    const root = document.documentElement;
    root.style.setProperty('--c-obsidian', toTokens.obsidian);
    root.style.setProperty('--c-bg-canvas', toTokens.obsidian);
    root.style.setProperty('--c-deep-zinc', toTokens.deepZinc);
    root.style.setProperty('--c-elevated-zinc', toTokens.elevatedZinc);
    root.style.setProperty('--c-cobalt-rim', toTokens.cobaltRim);
    root.style.setProperty('--c-ember', toTokens.ember);
    root.style.setProperty('--c-amber', toTokens.amber);
    root.style.setProperty('--t-accent', toTokens.textAccent);
    root.style.setProperty('--c-accent-glow', toTokens.accentGlow);
    root.style.setProperty('--c-ember-soft', toTokens.emberSoft);
  } else {
    animateThemeTransition(fromTokens, toTokens, 360);
  }

  // 4. Call window.updateParticlePalette if registered by 3D stage
  if (typeof window !== 'undefined' && typeof window.updateParticlePalette === 'function') {
    try {
      window.updateParticlePalette(flavourKey);
    } catch (err) {
      console.warn('[FlavourWorlds] Error in window.updateParticlePalette:', err);
    }
  }

  // 5. Persist selection to localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, flavourKey);
    }
  } catch (err) {
    // Non-fatal if localStorage is restricted
  }

  // Dispatch custom event for telemetry or external subscribers
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('flavour-world-changed', {
      detail: {
        flavour: flavourKey,
        tokens: toTokens
      }
    }));
  }

  return toTokens;
}

/**
 * Updates UI classes and accessibility attributes on pill buttons.
 */
function updatePillUI(activeKey) {
  if (typeof document === 'undefined') return;

  const pills = document.querySelectorAll('.flavour-pill[data-set-flavour]');
  pills.forEach((pill) => {
    const key = pill.getAttribute('data-set-flavour');
    const isActive = key === activeKey;
    if (isActive) {
      pill.classList.add('active');
      pill.setAttribute('aria-checked', 'true');
      pill.tabIndex = 0;
    } else {
      pill.classList.remove('active');
      pill.setAttribute('aria-checked', 'false');
      pill.tabIndex = -1;
    }
  });
}

// ============================================================================
// INITIALIZATION & KEYBOARD RADIOGROUP NAVIGATION
// ============================================================================

/**
 * Initializes the SunChips Flavour World theming system.
 * Connects buttons, sets up ARIA radiogroup keyboard navigation,
 * and restores stored preference.
 */
export function initFlavourWorlds() {
  if (typeof document === 'undefined') return;

  const switcher = document.querySelector('.flavour-switcher');
  const pills = Array.from(document.querySelectorAll('.flavour-pill[data-set-flavour]'));

  if (!pills.length) {
    console.info('[FlavourWorlds] No .flavour-pill elements found in DOM.');
    return;
  }

  // Ensure switcher has proper radiogroup accessibility
  if (switcher) {
    switcher.setAttribute('role', 'radiogroup');
    if (!switcher.getAttribute('aria-label')) {
      switcher.setAttribute('aria-label', 'Select Flavour World');
    }
  }

  // Determine initial flavour: localStorage -> body[data-flavour] -> 'ember'
  let initialFlavour = 'ember';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && FLAVOUR_WORLDS[stored]) {
      initialFlavour = stored;
    } else if (document.body.getAttribute('data-flavour')) {
      const bodyAttr = document.body.getAttribute('data-flavour');
      if (FLAVOUR_WORLDS[bodyAttr]) {
        initialFlavour = bodyAttr;
      }
    }
  } catch (err) {
    initialFlavour = 'ember';
  }

  // Connect click events and radio roles
  pills.forEach((pill) => {
    pill.setAttribute('role', 'radio');
    const key = pill.getAttribute('data-set-flavour');

    pill.addEventListener('click', (e) => {
      e.preventDefault();
      setFlavourWorld(key);
      pill.focus();
    });
  });

  // Setup Arrow Key navigation for WCAG 2.1 Radiogroup pattern
  if (switcher) {
    switcher.addEventListener('keydown', (e) => {
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(e.key)) return;

      const currentIdx = pills.findIndex(p => p.getAttribute('data-set-flavour') === activeFlavourKey);
      let nextIdx = currentIdx;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIdx = (currentIdx + 1) % pills.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIdx = (currentIdx - 1 + pills.length) % pills.length;
        e.preventDefault();
      } else if (e.key === 'Home') {
        nextIdx = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        nextIdx = pills.length - 1;
        e.preventDefault();
      }

      if (nextIdx !== currentIdx && pills[nextIdx]) {
        const nextKey = pills[nextIdx].getAttribute('data-set-flavour');
        setFlavourWorld(nextKey);
        pills[nextIdx].focus();
      }
    });
  }

  // Apply initial flavour without motion delay
  setFlavourWorld(initialFlavour, { immediate: true });

  console.info(`[FlavourWorlds] Initialized with flavour: "${initialFlavour}". Certified WCAG AA across 4 worlds.`);
}

// Expose globally on window for cross-module integration
if (typeof window !== 'undefined') {
  window.FLAVOUR_WORLDS = FLAVOUR_WORLDS;
  window.initFlavourWorlds = initFlavourWorlds;
  window.setFlavourWorld = setFlavourWorld;
  window.getCurrentFlavour = getCurrentFlavour;
  window.getFlavourTokens = getFlavourTokens;
  window.calculateContrast = calculateContrast;
}
