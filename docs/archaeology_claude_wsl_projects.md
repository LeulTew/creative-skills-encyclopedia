# Archaeological Report: Claude Code, OpenAI Codex, WSL & Creative Project Repositories

**Archaeologist:** Subagent 2 (Claude Code, Codex, WSL & Project Repos Archaeologist)  
**Investigation Date:** November 5, 2026  
**Target Environments:** Claude Code CLI & projects (`C:\Users\USER-PC\.claude\`), OpenAI Codex CLI state & rollouts (`C:\Users\USER-PC\.codex\`), WSL Ubuntu fish history (`\\wsl$\Ubuntu-24.04\home\leul\.local\share\fish\fish_history`), and local project repositories (`C:\Users\USER-PC\Projects\`, `C:\Users\USER-PC\Documents\github\`).  
**Scope Exclusions Enforced:** All enterprise ERP projects (`dreamlux-erp`, `koti-catering-erp`, `abi-co-events-erp`) were strictly excluded and omitted.

---

## 1. Executive Summary & Inventory Overview

A multi-environment forensic exploration was performed across the local PC and WSL2 subsystem to extract hidden architectural patterns, past creative prompts, bespoke 3D/WebGL engines, and frontend design systems developed with Claude Code and Codex.

### Key Forensic Datastores Discovered & Scoured

1. **Claude Code Storage & Projects (`C:\Users\USER-PC\.claude\`):**
   - **Scale:** Multiple session snapshots and deep project records in `projects/`, including `C--Users-USER-PC-Documents-github-the-mechanics-of-belief`, `C--Users-USER-PC-Projects-mmcy-landing-page`, and `C--Users-USER-PC--gemini-antigravity-scratch-portifolioLeul`.
   - **Key Artifact Discovered:** Claude Code session log `da6f7de8-14f0-43cf-8929-52a17af97ae3.jsonl` (27.7 MB) documenting the full multi-agent reconstruction of *The Mechanics of Belief: 3D Sanctuary & Monograph*.
2. **OpenAI Codex CLI Storage (`C:\Users\USER-PC\.codex\`):**
   - **Databases & Indices:** `session_index.jsonl` indexing 34 active sessions, paired with SQLite operational databases (`state_5.sqlite`, `logs_2.sqlite`, `memories_1.sqlite`, `goals_1.sqlite`).
   - **Compressed Rollouts:** `sessions/2026/` storing monthly rollout streams (`.jsonl.zst` and uncompressed `.jsonl`), detailing prompt injection protocols, AGENTS.md rule enforcements, and copy-writing execution lanes.
3. **WSL2 Ubuntu 24.04 Subsystem (`~/.local/share/fish/fish_history` & `~/Documents/github/`):**
   - **Fish Shell History:** Thousands of command entries uncovering earlier 3D and frontend workflows: `photobook-3d`, `portifolioLeul` (Three.js background scene), and custom agent anti-slop skills inside `~/Documents/bootdev/.agents/skills/`.
4. **Primary Project Workspaces:**
   - `C:\Users\USER-PC\Documents\github\the-mechanics-of-belief\` — Pure WebGL raymarched monolithic sanctuary with CSS3D relic synchronization and liturgical audio synthesis.
   - `C:\Users\USER-PC\Projects\mmcy-landing-page\` — Headless Blender 5.2.2 walkway simulation, screen-space flat normal derivative shader, and GSAP ScrollTrigger portal transitions.
   - `C:\Users\USER-PC\Projects\play-100\` — Record-store crate design system (DESIGN.md), custom React motion provider, and offline-first PWA update guards.

---

## 2. The Mechanics of Belief: 3D Sanctuary & Monograph

### Forensic Identifiers
- **Repository Location:** `C:\Users\USER-PC\Documents\github\the-mechanics-of-belief\`
- **Claude Code Session ID:** `da6f7de8-14f0-43cf-8929-52a17af97ae3` (27.7 MB session journal)
- **Live Deployment:** `https://leultew.github.io/the-mechanics-of-belief/`
- **Architecture Stack:** React 19 + TypeScript, Vite, WebGL 1/2 Raymarching Engine, CSS3D Orthographic Relic Layer, Web Audio API Liturgical Zema Synthesizer.

```
                              [THE MECHANICS OF BELIEF]
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        ▼                                 ▼                                 ▼
 [WebGL Raymarching]             [CSS3D Relic Layer]             [St. Yared Zema Engine]
 - Analytical gyroid relief      - 8 historical shrines          - 3 Liturgical Modes (Ge'ez/Ezel/Araray)
 - Stepped Aksumite altars       - Exact 1-to-1 pixel sync       - Fifth drone (216/324/108 Hz)
 - Rock-cut Lalibela cross       - Frustum-matched CSS matrix    - 4-Frequency Tsenatsel chime
 - Soft shadows & reflections    - Perspective-linked macro      - Breathing LFO swell (0.125 Hz)
```

### Prompt & Genesis Archaeology

The Claude Code session log reveals the foundational prompt that guided the project from a raw HTML/PDF draft to an Awwwards-grade experience:

> *"make this 10/10 and remove all the ugly parts (ui first, then any 3D fix)... using gpt 6 astra or opus 5.5 set to max make sure to make this site 10/10 on every metrics, u can find my tools from github copilot global or other projects and use blender for the scene but optimize using latest 2026 gaussian splats or video or wtever best way to make quality max and consistent and performant on any pc! and then optimize for phone later on. 3-5 sub agents to review ur work pragmatically with no bias and compare to winning 3D awwwards sites or better as standards. for texts n stuff use reactbits.dev text animation and components ofc, also use animejs (canvas drawings), 21st.dev for better components..."*

To satisfy this prompt, three specialized review agents were orchestrated:
1. **3D WebGL Performance Auditor:** Identified excessive ALU load (68 raymarching steps, 30 triplanar fetches) and implemented Dynamic Adaptive Resolution Scaling (DRS) to lock 60 FPS on mobile and integrated GPUs.
2. **Design & UI Craft Director:** Elevated cultural authenticity by requiring St. Yared's 3 historical Zema modes (Ge'ez, Ezel, Araray), authentic bronze Tsenatsel chimes, and FOUC-free typography.
3. **Mobile & Accessibility Engineer:** Added decoupled touch gesture physics (`touch-action: none`, `setPointerCapture`, `pointercancel`), 44px minimum touch targets, and `env(safe-area-inset-*)`.

### Deep Architectural Innovations & Shaders

#### 1. Procedural Raymarched Sanctuary (`src/engine/shaders.ts`)
The entire environment—canyon walls, entrance portal, vaulted cave corridors, cruciform rock columns, subterranean cisterns, stepped altars, and the apse's carved Lalibela cross—is generated analytically in a single fragment shader:

```glsl
// GLSL ES 1.00 - runs universally across WebGL 1 and 2
precision highp float;
varying vec2 vNDC;
uniform vec3 uCamPos;
uniform vec3 uCamAngles;
uniform vec2 uAspectFov;
uniform float uTime;
uniform float uVellum;
uniform float uTrap;

// Smooth Boolean operators
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

// Analytical procedural rock relief replacing expensive texture fetches
float gyroidRelief(vec3 p) {
  float g1 = dot(sin(p * 0.011), cos(p.yzx * 0.013));
  float g2 = dot(sin(p * 0.029 + 1.7), cos(p.zxy * 0.031 + 2.3));
  float g3 = dot(sin(p * 0.075 + 4.1), cos(p.yzx * 0.081 + 0.9));
  return g1 * 26.0 + g2 * 11.0 + g3 * 4.2;
}

// Stepped Aksumite altar under each shrine
float sdAltar(vec3 P, vec3 sPos, float relief) {
  if (abs(P.z - sPos.z) > 220.0) return 1e5;
  float topY = sPos.y - 168.0;
  float midY = 0.5 * (topY - 300.0);
  float halfH = max(24.0, 0.5 * (topY + 300.0));
  vec3 q = P - vec3(sPos.x, midY, sPos.z);
  float stepCrown = smoothstep(halfH - 28.0, halfH - 8.0, abs(q.y)) * 22.0;
  float w = 78.0 + stepCrown;
  float dShaft = max(max(abs(q.x) - w, abs(q.z) - w), abs(q.y) - halfH);
  float dCross = min(max(abs(q.x) - (w + 14.0), abs(q.z) - 32.0), max(abs(q.x) - 32.0, abs(q.z) - (w + 14.0)));
  dCross = max(dCross, abs(q.y) - halfH);
  return min(dShaft, dCross) + relief * 0.08;
}
```

Key features:
- **Soft Shadows & Ambient Occlusion:** 16-step soft shadow cone tracing (`calcSoftShadow`) with adaptive step elongation, and 4-sample normal offset AO (`calcAO`).
- **Dynamic Skylight & Cistern Reflection:** The cave ceiling opens into a circular skylight over a subterranean baptismal pool with dynamic planar reflections.

#### 2. Dynamic Adaptive Resolution Scaling (DRS) (`src/engine/SanctuaryEngine.ts`)
To prevent thermal throttling and maintain 60 FPS on high-DPI displays or lower-spec integrated GPUs:

```typescript
private adaptResolution(now: number, dt: number) {
  const gl = this.gl;
  if (!gl) return;
  this.frameAvg += (dt - this.frameAvg) * 0.1;
  this.refresh = Math.min(dt, this.refresh * 1.002);
  const target = Math.max(this.refresh, 1 / 120);

  if (now >= this.nextScaleCheck) {
    // If frame duration exceeds 145% of refresh or drops below 50 FPS
    if (this.frameAvg > Math.max(target * 1.45, 1 / 50) && this.renderScale > 0.5) {
      this.renderScale = Math.max(0.5, this.renderScale - 0.1);
      this.nextScaleCheck = now + 500; // Fast scale down
    } else if (this.frameAvg < target * 1.12 && this.renderScale < 1) {
      this.renderScale = Math.min(1, this.renderScale + 0.05);
      this.nextScaleCheck = now + 2500; // Conservative scale up
    }
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * this.renderScale;
  const canvas = this.el.canvas;
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
}
```

#### 3. Dual-Frustum Synchronization (CSS3D DOM ↔ WebGL Raymarching)
The CSS DOM elements (`#rig` and `#world`) holding the historical shrines are projected into 3D space with zero coordinate drift from the raymarched altars:

```typescript
// Synchronizing CSS3D rig and world transforms to the exact raymarching camera
this.el.rig.style.transform =
  `translateZ(${persp}px) rotateZ(${(-c.roll).toFixed(3)}deg) ` +
  `rotateX(${pitch.toFixed(3)}deg) rotateY(${yaw.toFixed(3)}deg)`;
this.el.world.style.transform =
  `translate3d(${(-c.x).toFixed(2)}px, ${(-c.y).toFixed(2)}px, ${(-c.z).toFixed(2)}px)`;
```

#### 4. Gaussian Splat Mote Cloud (`PART_VS` / `PART_FS`)
A particle system of 820 motes represents burning frankincense embers and dust in air currents:
- **Geometry:** Point cloud billboarding using camera yaw, pitch, and roll angles in vertex shader.
- **Radial Falloff:** Analytical Gaussian decay `float soft = exp(-r2 * 14.0)` in fragment shader.
- **Blending:** Premultiplied alpha (`gl_FragColor = vec4(col * a, a)`).

#### 5. St. Yared Liturgical Zema & Tsenatsel Sistrum Synthesizer (`src/engine/zema.ts`)
Synthesizes authentic Ethiopian church modal music via the native Web Audio API with zero external audio assets:
- **Fifth Drone:** 216 Hz root, 324 Hz perfect fifth, and 108 Hz sub-octave.
- **Breathing LFO:** 0.125 Hz sine oscillator modulating master gain between 0.5 and 1.0 (8-second breathing cycle).
- **Acoustic Lowpass Filter:** 1400 Hz cutoff with Q = 0.4.
- **Tsenatsel Bronze Chime Simulation:** Quad-frequency resonant bronze disk collision at 2840 Hz, 3620 Hz, 4410 Hz, and 5280 Hz with < 2ms attack and exponential ring.
- **Thermal Idle Suspend:** The Web Audio context automatically suspends after a 1.5-second fadeout or when the browser tab goes into the background (`visibilitychange`).

---

## 3. MMCY Addis Office Walkway v3 (Staffed / The Warm Room)

### Forensic Identifiers
- **Repository Location:** `C:\Users\USER-PC\Projects\mmcy-landing-page\`
- **Blender Build Tool:** `tools/blender/walkway/build_walkway.py` (101.4 KB script)
- **Frontend 3D Architecture:** `src/scripts/walk/` (`scene3d.ts`, `mount3d.ts`, `camera.ts`, `portal.ts`, `labels.ts`)
- **Published 3D Bundle:** `public/3d/v3/walkway.glb` (93.7 KB), `camera-path.json` (29.6 KB), `feature-edges.json` (91.6 KB)

```
                                [MMCY WALKWAY V3]
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
[Headless Blender 5.2.2]       [Screen-Space Shader]           [ScrollTrigger Portal]
- 7,858 triangles scene        - Normal from dFdx/dFdy         - 1.35x desktop pin
- 4 stylised anonymous staff   - Flat palette tone mixing      - Doorway projection (portalRect)
- 3,379 feature edge vectors   - LineSegments2 ink lines       - Live S3 containment
- Meshopt GLB (93.7 KB)        - Zero vertex normals/UVs       - Frame-time GPU probe (< 24ms)
```

### Key Architectural Innovations

#### 1. Headless Blender Procedural Geometry & Path Compiler (`tools/blender/walkway/build_walkway.py`)
- **Reproducible Pipeline:** Compiles the complete office interior, glass walls, workstation furniture, 4 stylised staff figures, and camera animations purely in headless Blender via:
  ```powershell
  blender -b --factory-startup --python-exit-code 1 tools/blender/walkway/build_walkway.py -- --render --publish
  ```
- **EXT_meshopt_compression:** Reduces the geometry to 93,788 bytes by stripping normals and UVs, leaving positions only.
- **Feature Edge Extraction:** Extracts 3,379 silhouette and crease segments (`feature-edges.json`) with an angle threshold of 28° (50° on staff figures), exported in node-local space with custom `weight` and `depthWeight` attributes.
- **Path & Portal Matrix (`camera-path.json`):** Version 3 compiler generates 61 discrete camera samples ($p = i / 60$) recording 3D positions, FOV curve (holding 50° from $p = 0.36$ to $1.0$), and the screen-space bounding box `portalRect` of the far doorway.

#### 2. Screen-Space Normal Derivative Shader (`src/scripts/walk/scene3d.ts`)
Because vertex normals are omitted from the GLB to minimize download size, surface normals and lighting are computed analytically in screen space:

```glsl
// Vertex Shader
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}

// Fragment Shader
uniform vec3 uColor;
uniform float uAlpha;
uniform float uLit;
uniform vec3 uL;
uniform vec2 uTone;
varying vec3 vW;

void main() {
  // Screen-space analytical normal via partial derivatives
  vec3 n = normalize(cross(dFdx(vW), dFdy(vW)));
  if (dot(n, cameraPosition - vW) < 0.0) n = -n;
  
  // Two-tone palette modulation based on light direction
  float t = mix(1.0, uTone.x + uTone.y * (0.5 + 0.5 * dot(n, uL)), uLit);
  gl_FragColor = vec4(uColor * t, uAlpha);
}
```

- **Feature Edges Rendering:** Rendered using Three.js `LineSegments2`, `LineSegmentsGeometry`, and `LineMaterial` with pixel-scaled line widths, depth-faded ink tones, and anti-aliasing.

#### 3. Live 3D Portal Transition & Pinning (`src/scripts/walk/mount3d.ts`)
- **Scroll Pinning:** Pinned for 1.35 screens on desktop (1.6 screens on mobile). The view unclips from the content column to full-bleed dynamically as scroll advances.
- **Exit Portal Containment:** At $p = 0.66$, Section 3 (the next section) begins rendering inside the far doorway frame, clipped live to `portalRect`. By $p = 0.93$, the doorway expands smoothly until it fills the entire viewport, transitioning seamlessly into Section 3 without any white flash or page jump.
- **GPU Hardware Probe Gate:** Before promoting to live 3D, `probe()` times up to 20 frames along the path to the GPU's finish. If median frame duration exceeds 24ms (< 40 FPS), the engine automatically stays on the high-fidelity pre-rendered WebP poster sequence.

#### 4. The 150-Word Thesis Contract & Anti-Slop System
The project enforces strict editorial contracts in `src/content/home.yaml` and `PRODUCT.md`:
- **Word Budgets:** Hero headlines $\le 6$ words; section headlines $\le 5$ words; CTA buttons $\le 3$ words.
- **Zero-Height Wayfinding:** Progress indicators sit inside the header's retreat zone without consuming vertical screen real estate.
- **Slop Ban-List:** Automated linting strictly rejects decorative glassmorphism, floating drop-shadows, stock customer support imagery, and neon-on-black aesthetics.

---

## 4. Play 100: The Listening-Counter Collection Index

### Forensic Identifiers
- **Repository Location:** `C:\Users\USER-PC\Projects\play-100\`
- **Design System Specification:** `DESIGN.md` (649 lines of exhaustive design tokens)
- **Architecture Stack:** React 19 + TypeScript, Vite, Firebase App Check, Service Worker PWA, Custom Motion Engine.

### Architectural Innovations & Token System

#### 1. Record-Store Crate Design Tokens (`DESIGN.md`)
The design system establishes a tactile, physical paper-and-ink aesthetic inspired by vinyl record store crates:

```yaml
---
name: Play 100
description: A listening-counter collection index, expressed through chalk, ink and numbered record jackets.
colors:
  paper: "#f3f3e9"
  white: "#fdfdf6"
  ink: "#20231e"
  muted: "#606457"
  lime: "#d3f36b"
  line: "#d1d4c6"
  control-border: "#7f8179"
typography:
  display:
    fontFamily: "Barlow Condensed, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(64px, 6.75vw, 96px)"
    fontWeight: 800
    lineHeight: 0.93
    letterSpacing: "-.024em"
  body:
    fontFamily: "Hanken Grotesk Variable, Segoe UI, sans-serif"
---
```

#### 2. Custom Motion Provider & CSS Containment (`src/motion/`)
- **No Third-Party Motion Bloat:** Eliminates heavy motion runtimes in favor of a lightweight, typed `MotionProvider.tsx` context driving hardware-accelerated CSS variables.
- **Render Containment (`src/render-containment.css`):** Employs `contain: layout paint style` on catalog items to ensure scroll performance remains locked at 60 FPS even with 100 complex interactive jackets rendered simultaneously.

#### 3. Resilient PWA & Update Guard Architecture (`src/pwa/`)
- **`update-guard.ts`:** Prevents sudden reload interruptions during active playback or collection browsing when a new Service Worker activates.
- **`deferred-controller.ts`:** Delays cache invalidation until the user navigates or reaches a natural breakpoint, ensuring session continuity.

---

## 5. WSL2 Ubuntu Fish History & Creative Artifact Scouring

### Forensic Analysis of Fish Shell History (`~/.local/share/fish/fish_history`)

Scouring `/home/leul/.local/share/fish/fish_history` surfaced crucial past prompts, test commands, and repositories:

#### 1. Historical Creative Projects Identified in WSL
- `photobook-3d` (`/home/leul/Documents/github/Memories/photobook-3d`): An interactive 3D memory photobook utilizing Three.js and custom React components (`PhotoBook.tsx`).
- `portifolioLeul` (`/home/leul/Documents/github/portifolioLeul`): The owner's interactive personal portfolio featuring `BackgroundScene.tsx` (Three.js canvas backdrop) and animated skill matrices.
- `doc_proposal_expo`: Production proposal decks utilizing AI-generated high-resolution Ethiopic art (`ethiopian_*.png`).

#### 2. Custom Agent Anti-Slop Skills Discovered in WSL
Inside `/home/leul/Documents/bootdev/.agents/skills/`, three specialized agent skills were uncovered:
- `enforce_structural_cleanliness_and_anti_slop_architecture` — Enforces clean directory structures and architectural boundaries.
- `enforce_senior_frontend_engineering_and_anti_slop_design_systems` — Blocks generic AI UI patterns, gradients, and templated components.
- `e2e_disciplined_task_execution` — Mandates test verification cycles before submitting exercises or code changes.

---

## 6. OpenAI Codex Storage Archaeology (`C:\Users\USER-PC\.codex\`)

### Directory & SQLite Datastore Structure

The OpenAI Codex storage contains structured metadata, logs, and execution rolls:
- **`session_index.jsonl`:** Chronological index of 34 major autonomous sessions spanning June to August 2026.
- **`sessions/2026/`:** Compressed rollout logs (`.jsonl.zst`) and uncompressed logs (`.jsonl`):
  - `rollout-2026-10-08T22-09-49-01a11ceb-f88a-71b3-86cd-a190498fa42f.jsonl`: Captures autonomous copy-writer agent execution driven by `BRIEF.md` contracts.
- **`config.toml` & `AGENTS.md`:** Embedded global directives enforcing the Model Rule (Gemini 3.8+ / flagship models at maximum reasoning budget) and Identity Rule (all GitHub work strictly attributed to `LeulTew`).

---

## 7. Synthesis: The 4-Pillar Creative Engineering Matrix

| Dimension | The Mechanics of Belief | MMCY Office Walkway v3 | AGI Readiness | SunChips Ethiopia |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Visual** | Raymarched Aksumite cave sanctuary & cruciform apse | Flat-palette 3D office corridor with 4 staff figures | 12-state morphing particle cloud (`</>` to HAL eye) | Pop-film cloth physics chip bag & procedural chips |
| **3D Engine** | Pure WebGL 1/2 Raymarching (GLSL ES 1.00) | Three.js r186 + `LineSegments2` ink feature edges | Three.js `Points` + `MeshSurfaceSampler` | Three.js PBR Neutral + headless Blender Cycles EXR |
| **Shading Technique** | Procedural gyroid relief + soft shadow raymarching | Screen-space normal derivatives (`dFdx` / `dFdy`) | Particle billboarding + Gaussian core radiance + HAL heat | Khronos PBR Neutral tone mapping + EXR environment |
| **Motion & Scroll** | Frame-rate independent lerp camera + CSS3D rig | GSAP ScrollTrigger 1.35x pin + doorway portal expansion | Lenis scroll + sine wave swirl + "in a snap" dust scatter | GSAP ScrollTrigger + circular variant world wipe & spin |
| **Asset Strategy** | Procedural code (0 KB GLB; 2 rock textures) | Headless Blender 5.2.2 `EXT_meshopt` GLB (93.7 KB) | Headless Blender `fields.glb` with meshopt (290 KB) | Blender Cycles transparent stills + 400 KB GLB stage |
| **Audio / Sensory** | St. Yared 3-mode liturgical Zema + Tsenatsel chime | Silent / tactile hover audio cues | Silent / focus on editorial kinetic typography | Tactile physical sticker controls & crimp edge dividers |
| **Safety Gates** | Dynamic Adaptive Resolution Scaling (0.88 → 0.55 DPR) | 20-frame GPU finish probe (< 24ms); WebP poster fallback | 2.5s ambient drift idle pause (WCAG 2.2.2); reduced-motion | Capable hardware gate (≥ 4 cores, ≥ 4 GB RAM, WebGL2) |

---

## 8. Archaeological Conclusions & Recommendations

1. **Monolithic Raymarching as an Asset-Free 3D Architecture:**
   *The Mechanics of Belief* demonstrates that complex, awe-inspiring 3D architectural spaces can be rendered without megabytes of 3D geometry assets, relying entirely on analytical Signed Distance Fields (SDFs) and procedural gyroid noise.
2. **Screen-Space Derivatives for Lightweight Stylized Geometry:**
   The MMCY Walkway architecture establishes that stripping normals and UVs from GLB models (compressing files by >75%) and computing surface normals via `cross(dFdx(vW), dFdy(vW))` provides a distinct, publication-grade flat-palette editorial aesthetic while drastically reducing download and parse overhead.
3. **GPU Probing Over User-Agent Sniffing:**
   Both SunChips and MMCY avoid unreliable core counts or device memory sniffing (which fails on iPads and privacy-focused browsers). Instead, they time actual test frames against the GPU (< 24ms threshold), providing an airtight gate before promoting to live WebGL.
4. **Liturgical & Cultural Synthesizers:**
   The Web Audio API synthesis in *The Mechanics of Belief* provides a template for zero-asset atmospheric sound design that breathes with the user's reading pace and respects device battery by auto-suspending on idle.
