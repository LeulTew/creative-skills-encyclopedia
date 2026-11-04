# Master Codebase Archaeology Report

## Overview
This archaeological report conducts a deep forensic analysis of six milestone projects across UI engineering, 3D WebGL/Three.js rendering, headless Blender pipelines, motion design, design token architecture, and anti-slop quality gates.

---

## 1. SunChips Ethiopia (`C:\Users\USER-PC\.gemini\antigravity\scratch\SunChips`)

### 1.1 Architecture & Core Purpose
- **Stack**: Astro (static output), Three.js (WebGL 2.0 lazy-loaded stage), GSAP + ScrollTrigger (scrubbed storytelling), Bricolage Grotesque + Noto Ethiopic display typography.
- **Goal**: Bilingual (English `/` and Amharic `/am/`) award-winning promotional site for SUN Chips Ethiopia (Senselet Food Processing PLC, PepsiCo Lay's maker), designed as an immersive "open the bag" scroll film.

### 1.2 Flavour World Theming & WCAG AA Contrast Tokens
Whole-canvas theming is driven via CSS attributes `[data-flavour]`. Every flavour world defines dedicated background, light, deep, and text tokens:
```css
/* src/styles/global.css */
[data-flavour="habesha-spice"] {
  --fl: var(--habesha);        /* #d92d1c */
  --fl-deep: var(--habesha-deep); /* #8f130c */
  --fl-light: var(--habesha-light); /* #ff7a52 */
  --fl-on: var(--white);       /* High contrast white text */
  --fl-on-soft: rgb(255 255 255 / 0.9);
  --fl-ray: #ffb35c;
}
[data-flavour="natural"] {
  --fl: var(--natural);        /* #f7b81a - Golden Yellow */
  --fl-deep: var(--natural-deep);
  --fl-light: var(--natural-light);
  --fl-on: var(--ink);         /* Crucial: Swapped to #0a1547 ink for WCAG AA contrast! */
  --fl-on-soft: var(--ink-soft);
  --fl-ray: #fff0a8;
}
[data-flavour="tomato"] {
  --fl: var(--tomato);         /* #15a24c - Crisp Green */
  --fl-deep: var(--tomato-deep);
  --fl-light: var(--tomato-light);
  --fl-on: var(--ink);         /* Swapped to dark ink for AA contrast */
  --fl-on-soft: var(--ink);
  --fl-ray: #c9f56b;
}
```
Flavour transitions feature a 950ms circular radial world wipe, with pack texture swap synchronized exactly when the 3D pack rotates edge-on to the viewer.

### 1.3 Khronos PBR Neutral Tone Mapping & Studio Lighting
To prevent colour blowing on yellow/saturated packaging prints while maintaining real-time parity with Blender Cycles stills:
- **Renderer Settings** (`src/scripts/stage.ts`):
  ```typescript
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping; // Khronos PBR Neutral
  renderer.toneMappingExposure = STAGE_EXPOSURE; // 0.5 (-1.0 EV linear multiplier)
  ```
- **Grazing Lobe GGX Correction**: Three.js's isotropic IBL split-sum creates artificial bright rims on grazing silhouettes. The stage modifies the Three.js shader chunk:
  ```typescript
  const IBL_LOOKUP = "vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );";
  const narrowed = chunk.replace(
    IBL_LOOKUP,
    "vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, "
    + "roughness * max( sqrt( saturate( dot( normal, viewDir ) ) ), 0.25 ) );"
  );
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace("#include <envmap_physical_pars_fragment>", narrowed);
  };
  ```

### 1.4 Still-to-Live Registration & Zero-FOUC Intro
- **Alpha Registration**: `src/data/pack-still-bounds.json` contains measured bounding boxes from offline Cycles renders. Live 3D pack is matched to within $\le 1$ CSS pixel of the static Blender fallback image across 820px to 1920px viewports.
- **Render-Blocking Intro**:
  `<link rel="expect" href="#first-frame" blocking="render" />`
  Halts Chromium first paint until `<Intro />` and `<Header />` are fully parsed, guaranteeing zero flash of unstyled paper.
- **Parametric 16-point Sun SVG**:
  ```typescript
  const TIPS = 16;
  const sun = `${Array.from({ length: TIPS * 2 }, (_, i) => {
    const r = i % 2 ? 44 : 50;
    const a = -Math.PI / 2 + (i * Math.PI) / TIPS;
    return `${i ? "L" : "M"}${+(Math.cos(a) * r).toFixed(1)} ${+(Math.sin(a) * r).toFixed(1)}`;
  }).join("")}Z`;
  ```

### 1.5 Headless Blender GLB & QA Pipeline
- Script: `tools/blender/build_bag.py` executes headless: `blender -b --factory-startup -P tools/blender/build_bag.py`
- Generates parametric pillow bag geometry (`W=0.20m`, `H=0.25m`, `T=0.062m`, 72 teeth, 13.7mm rear fin seal) and procedural `"open"` shape key morph target.
- Verification Gate (`tools/blender/gates.py`):
  - Limits single-channel clipping to $\le 5\%$, two-channel clipping to $\le 2\%$.
  - Enforces boundary margins $\ge 0.01$ so packs never bleed out of frame.
  - Automatically exports `.glb.gz` pre-compressed binary payload decoded via native browser `DecompressionStream("gzip")`.

---

## 2. MMCY Concept Redesign (`C:\Users\USER-PC\Projects\mmcy-landing-page`)

### 2.1 The MMCY Architecture & 150-Word Thesis Contract
- **Contract Driven**: `src/data/home-contract.json` (31,115 lines) enforces claim traceability. Every single word on the page links to source IDs (`HOME-HERO-02`, etc.) and verified client claims.
- **Strict Word Budgets** (`scripts/lint-words.mjs`):
  ```javascript
  const LIMIT = {
    hero: 6,       // Hero headline <= 6 words
    head: 5,       // Section headline <= 5 words
    line: 8,       // Supporting paragraph <= 8 words
    screen: 20,    // Screenful viewport <= 20 words
    button: 3,     // Action buttons <= 3 words
    nav: 2,        // Nav items <= 2 words
    cardTitle: 3,  // Card title <= 3 words
    cardLine: 6,   // Card line <= 6 words
    layer2: 60,    // Drawer/dialog panel <= 60 words
    layer3: 60,    // Deep detail <= 60 words
  };
  ```

### 2.2 Anti-Slop Gates & Shadow Ban
- **Strict Zero-Shadow Rule** (`scripts/lint-no-shadows.mjs`):
  Fails CI build on any `box-shadow`, `text-shadow`, `drop-shadow()`, Three.js shadow maps (`castShadow`, `receiveShadow`), or SVG filters (`<feDropShadow>`, `<feGaussianBlur>`). Depth must be established solely through calibrated tone steps, concentric radii, and 1px hairlines.
- **Copy Cleanliness** (`scripts/lint-copy.mjs`):
  Guarantees that no raw copy strings exist in templates; 100% of human-facing text lives in YAML/JSON content files.

### 2.3 Tone Steps & Concentric Radius Hierarchy
```css
/* src/system/css/tokens.css */
:root {
  /* Ground & Tone steps */
  --c-ground: #ffffff;    /* 80% canvas */
  --c-paper: #f4f0ee;     /* Neutral hover plates */
  --c-cream: #fbf6f0;     /* Warm section plane */
  --c-tint-1: #fff3ee;    /* Soft coral pod tint */
  --c-coral: #ff694b;     /* Graphic accents only (NEVER text) */
  --c-coral-deep: #d2452a;/* Text-carrying buttons (4.55:1 AA) */
  --c-ink: #192030;       /* Primary text */
  --c-navy: #242c3f;      /* Brand navy plate */

  /* Concentric Radius: inner = outer - padding */
  --r-pane: 56px;
  --r-frame: 40px;
  --r-card: 32px;
  --r-inner: 24px;
  --r-ctl: 16px;
  --r-round: 999px;

  /* The One Angle */
  --angle: -8deg;
  --field-coral: linear-gradient(172deg, #ffffff 0%, #fff3ee 46%, #ffe4da 100%);
}
```

### 2.4 Zero-Height Wayfinding Rails
- Files: `src/styles/wayfinding.css`, `src/templates/partials/wayfinding.njk`
- Takes 0px vertical layout space; resides inside the header's top margin (`--nav-top + --nav-h`).
- Only reveals (`data-wf-on`) when header retreats during downward scroll.
- Incorporates dynamic background gradient sampling via CSS Scroll Timelines:
  ```css
  @supports (animation-timeline: scroll()) {
    html.js .wf {
      background-image: var(--wf-paint, none);
      background-size: 100% var(--wf-size, 100vh);
      animation: wf-follow linear both;
      animation-timeline: scroll(root block);
    }
  }
  ```

---

## 3. Play-100 (`C:\Users\USER-PC\Projects\play-100`)

### 3.1 3D Collection Canvas & SVD Resting Projection
- **Cover Texture Rendering**: Generates dynamic 2D canvas textures (`512x352`) featuring vector glyphs, typography, and SVG paths on 3D sleeve meshes (`CollectionScene.tsx`).
- **Mathematical SVD Orthographic Fitting**:
  ```typescript
  function restingProjection() {
    const x = new THREE.Vector2((0.92 * 220) / WIDTH, (0.28 * 220) / WIDTH);
    const z = new THREE.Vector2((0.68 * 150) / DEPTH, (-0.54 * 150) / DEPTH);
    const horizontal = x.x ** 2 + z.x ** 2;
    const vertical = x.y ** 2 + z.y ** 2;
    const cross = x.x * x.y + z.x * z.y;
    const squaredScale = (horizontal + vertical + Math.hypot(horizontal - vertical, 2 * cross)) / 2;
    const scale = Math.sqrt(squaredScale);
    const right = new THREE.Vector3(x.x / scale, Math.sqrt(1 - horizontal / squaredScale), z.x / scale);
    const up = new THREE.Vector3(x.y / scale, Math.sqrt(1 - vertical / squaredScale), z.y / scale);
    const normal = right.clone().cross(up).normalize();
    return {
      rotation: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, normal)).invert(),
      scale: scale / STILL_PIXELS_PER_UNIT,
    };
  }
  ```

### 3.2 Dynamic FrameBudget Watchdog
- `src/components/scene/frameBudget.ts`:
  - 12 warmup frames.
  - Monitors `frameMs` and `renderMs`. If `frameMs > 38ms` (~26 FPS), throttles WebGL DPR down from `1.5` to `0.75`.
  - If slow performance persists for $\ge 2$ sampling windows at `0.75` DPR, signals `'fallback'`, gracefully unmounting WebGL and swapping in high-resolution vector/2D illustrations.

### 3.3 Physics & Micro-Interactions
- **Closed-Form Overdamped Spring** (`src/components/bits/count-up.ts`):
  Animates numbers using exact analytic solutions of second-order differential equations without external physics libraries:
  ```typescript
  const damping = 45;
  const stiffness = 240;
  const separation = Math.sqrt(damping * damping - 4 * stiffness);
  const slow = (-damping + separation) / 2;
  const fast = (-damping - separation) / 2;
  // Closed-form calculation evaluated at elapsedMs
  const a = (from.velocity - fast * offset) / separation;
  const b = offset - a;
  const value = to + a * Math.exp(slow * elapsed) + b * Math.exp(fast * elapsed);
  ```
- **Magnetic Buttons** (`Magnet.tsx`): Clamped pointer interaction (`Math.max(-4, Math.min(4, dx/12))`) with `180ms cubic-bezier(.16,1,.3,1)` spring dampening.

---

## 4. The Mechanics of Belief (`the-mechanics-of-belief`)

### 4.1 Hybrid Raymarched SDF Sanctuary Engine
- **Engine**: `src/engine/SanctuaryEngine.ts` & `src/engine/shaders.ts`
- **Analytical Distance Functions**: Renders an Aksumite rock-hewn sanctuary via pure WebGL raymarching (`sdAltar`, `gyroidRelief`, `sampleTriplanar`, `canyonMeander`, `dCaveTunnel`), synced to CSS 3D transformed elements (`relic-*.webp`).
- **Dynamic Scale Governor**: Measures frame intervals against monitor refresh rates and dynamically scales shader framebuffer resolution from `1.0` down to `0.5` on low-power GPUs.

### 4.2 Particle Cloud System (820 Gold Incense Embers)
- **Vertex Shader** (`PART_VS`):
  Cyclic vertical ascension: `p.y -= mod(uTime * aSpeed + aPhase * 80.0, 640.0)`
  Sinusoidal lateral drift: `p.x += sin(uTime * 1.2 + aPhase) * 24.0`
  Euler camera rotation transformed directly in GLSL vertex stage.
- **Fragment Shader** (`PART_FS`):
  Gaussian point falloff: `float soft = exp(-r2 * 14.0);`
  Coloring based on type: golden incense (`1.0, 0.88, 0.62`), warm ember (`1.0, 0.68, 0.30`), and vellum dust (`0.86, 0.78, 0.68`).

### 4.3 Kinetic Typography & Sentence-by-Sentence Text Motion
- **WAAPI Blur-In** (`src/components/StorySuper.tsx` & `SplitReveal.tsx`):
  ```typescript
  w.animate([
    { opacity: 0, transform: 'translate3d(0, 10px, 0) scale(0.97)', filter: 'blur(2.5px)' },
    { opacity: 1, transform: 'none', filter: 'blur(0)' }
  ], {
    duration: 420,
    delay: i * 22,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    fill: 'backwards'
  });
  ```
- **Ethiopic Display Pairing**: Ge'ez numeral counter (`geez-num`) paired alongside English headline, with screen-reader friendly `p.sr-only[aria-live="polite"]`.

---

## 5. UI Skills Repository (`ui-skills`)

### Apple Tahoe Liquid Glass Component Specification
- **Zero-Frostiness Normal Displacement**:
  Uses `<feDisplacementMap in="SourceGraphic" in2="map" scale="0.32" xChannelSelector="R" yChannelSelector="G" />` on base64 WebP normal maps to bend background pixels with optical sharpness.
- **3-Channel Chromatic Aberration Rainbow Split**:
  During active drag/glide gestures, Red is displaced at scale `0.80`, Green at `0.38`, Blue at `-0.04`. Channel isolation is handled via `<feColorMatrix>` and recomposed via `<feBlend mode="screen">`.
- **10-Layer Specular Reflection Shadow Stack**:
  ```css
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 1.8px 3px 0px -2px rgba(255, 255, 255, 0.9),
    inset -2px -2px 0px -2px rgba(255, 255, 255, 0.8),
    inset -3px -8px 1px -6px rgba(255, 255, 255, 0.6),
    inset -0.3px -1px 4px 0px rgba(0, 0, 0, 0.12),
    inset -1.5px 2.5px 0px -2px rgba(0, 0, 0, 0.20),
    inset 0px 3px 4px -2px rgba(0, 0, 0, 0.20),
    inset 2px -6.5px 1px -4px rgba(0, 0, 0, 0.10),
    0px 1px 5px 0px rgba(0, 0, 0, 0.10),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08);
  ```
- **Isolated Lens Layer**: Places glass refraction on absolute `-z-10` layer to completely prevent text distortion/ghosting.

---

## 6. Blick Directory (`C:\Users\USER-PC\Documents\blick`)
- **Inspection Findings**: Contains `exports/2026-08-24/untitled_output.mp4.chunks` (empty chunk folders).
- **Function**: Staging/temp cache directory from an offline headless video render job.

---

## Summary of Reusable Assets & Code Recipes
1. **Khronos PBR Neutral & Grazing GGX Fix**: Three.js shader modifier to eliminate edge whitening on physical packaging.
2. **Parametric Headless Blender Scripts**: Exact code to model pillow packaging, teeth seals, and export `.glb.gz` with Cycles verification gates.
3. **MMCY Linter Suite**: Automated scripts checking zero shadows (`lint-no-shadows.mjs`), word budgets (`lint-words.mjs`), and copy isolation (`lint-copy.mjs`).
4. **Adaptive WebGL Watchdogs**: Real-time FPS & DPR scaling with automated vector fallback (`frameBudget.ts`).
5. **Closed-Form Overdamped Spring**: Deterministic physics without runtime dependencies (`count-up.ts`).
6. **Kinetic WAAPI Word Stagger**: Clean CSS/JS word blur-in animation (`StorySuper.tsx`).
7. **Apple Liquid Glass & Chromatic Aberration Filter**: SVG displacement pipeline with rainbow edge splitting.
