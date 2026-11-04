# Copilot Session Scout: Deep-Dive Investigation Report
**Date:** 2026-11-04  
**Target Environments:** GitHub Copilot Desktop App (`C:\Users\USER-PC\.copilot`) & VS Code Insiders Storage (`AppData\Roaming\Code - Insiders\User`)  
**Investigated Artifacts:** 311 sessions, 22,258 turns, 942 checkpoints, 847 session states, 92 target keyword hits, VS Code `emptyWindowChatSessions`, and active scratch/project trees.

---

## Executive Summary

A comprehensive, forensic scout was conducted across the GitHub Copilot desktop ecosystem and VS Code Insiders storage on this workstation. The investigation uncovered the complete architectural evolution of the owner's award-winning web streak—spanning **SunChips Ethiopia**, **AGI Readiness**, **MMCY Concept BPO**, **Keepsake (3D Office & Book-turn Engine)**, and the uncatalogued masterpiece **"The Mechanics of Belief: 3D Sanctuary & Monograph"**.

Key breakthroughs discovered include:
1. **The Mechanics of Belief 3D Sanctuary Engine**: A 3.2 MB self-contained native WebGL monograph combining a raymarched triplanar exterior-to-cave displaced rock shader, volumetric sanctuary lighting, CSS3D perspective rigs, and Ethiopic/Latin editorial typography.
2. **Inter-Session CPU/RAM Arbitration Protocol**: An automated cross-session scheduling protocol (`host-quiet-run.ps1` with SHA-256 kit verification) where parallel sessions running heavy Blender Cycles GPU renders yielded machine windows to R3F exact-pixel qualification runs.
3. **The Dual-Model 10/10 Gauntlet**: The foundational split-ownership contract between GPT-6 Astra (sole owner of human-facing copy) and Claude Opus 5.5 (presentation, 3D, and CSS/JS), iteratively scoring each other until reaching 10/10 parity on the identical commit.
4. **SunChips & MMCY Production Blueprints**: Concrete mathematical and visual constraints, including whole-canvas `[data-flavour]` theming, 1-pixel registration PBR handoffs (Blender 32-bit EXR to Three.js `NeutralToneMapping`), zero-shadow/radius hierarchies, and zero-FOUC render-blocking intros.

---

## 1. Storage Topography & Forensic Map

The GitHub Copilot architecture on this PC does not store chat transcripts solely in loose text files; it utilizes a dual-tier structured persistence layer:

| Storage Location | Type & Scale | Contents & Significance |
|---|---|---|
| `C:\Users\USER-PC\.copilot\session-store.db` | SQLite (464 MB) | 311 sessions, 22,258 turns, 348,644 usage events, 942 checkpoints, 27,908 search index documents. Stores the complete conversation history of the Copilot desktop harness. |
| `C:\Users\USER-PC\.copilot\data.db` | SQLite (18 MB) | 176 workspaces, 41 worktrees, 5,034 activity items. Manages worktree links and parent-child session orchestration. |
| `C:\Users\USER-PC\.copilot\session-state\` | OS Mapped (847 items) | Session state snapshots, operation locks, and memory bindings. |
| `C:\Users\USER-PC\.copilot\chats\` | Workspaces & Assets | Artifact directories for major sessions (`probable-funicular-eafeecd4`, `urban-eureka-27a46c69`, `reimagined-adventure-a0879c56`, `refactored-waddle-103960e2`). |
| `Code - Insiders\User\globalStorage\emptyWindowChatSessions\` | JSONL Streams | Exported multi-turn agent sessions. Crucially contains `6a857d6c...` (5.8 MB, Mechanics of Belief) and `bc5e9514...` (746 KB, Copilot Memory & Streak rules). |
| `Code - Insiders\User\globalStorage\github.copilot-chat\` | SQLite (1.2 MB) | VS Code Insiders Copilot Chat session store (61 turns, tool embeddings). |
| `Code - Insiders\User\workspaceStorage\` | Workspace DBs | Workspace-specific `state.vscdb` and `chatEditingSessions`. |

---

## 2. Core Discoveries by Category

### (A) UI/Frontend Skills, Design Systems & Architectural Rules

#### 1. The MMCY 150-Word Thesis Contract & Anti-Slop Architecture
*Discovered in session `abe11421`, `957bdd4b`, and `C:\Users\USER-PC\Projects\mmcy-landing-page\docs\PROMPT.md`.*
- **The 150-Word Contract**: Every landing page must begin with a comment at the top of `index.html` containing strictly <= 150 words across 5 mandatory headings:
  1. `THESIS`: The singular truth/claim the page owns.
  2. `WORLD`: The palette, materials, and typography.
  3. `STORY`: What the visitor comes to believe step-by-step, culminating in action.
  4. `FIRST VIEWPORT`: Exact composition, focal hierarchy, and CTA placement.
  5. `SIGNATURE MOMENT`: The singular memorable physical or 3D interaction.
- **Word Budget Constraints**: Strict ceilings to prevent AI fluff:
  - Hero headline: $\le 6$ words.
  - Section headlines: $\le 5$ words.
  - CTAs: $\le 3$ words.
- **Banned Clichés**:
  - *BPO Clichés*: Stock headset models smiling, blue abstract gradients, spinning wireframe globes, 6-card feature grids.
  - *AI Clichés*: Cream background with serif headlines, neon accents on black, gradient text, gratuitous glassmorphism, "01/02/03" step pills, same-sized card grids.
- **Strict Ban on Shadows ("Zero-Shadows")**:
  - Zero `box-shadow`, `drop-shadow`, `text-shadow`, or soft diffuse glows.
  - Depth must be established exclusively through:
    1. Calibrated tonal steps (e.g., `#0C0907` $\rightarrow$ `#1C1612` $\rightarrow$ `#322720`).
    2. Border hairlines ($1\text{px}$ high-contrast or brass borders).
    3. Scale and depth layering.
    4. Consistent radius hierarchies (e.g., 4px inner, 12px controls, 18px cards, 20px dialogs).
- **One-Section-in-Focus Stacking**:
  - Only the currently read section is sharp and illuminated; preceding and following sections fade, blur, scale back, or physically slide away, eliminating vertical noise.

#### 2. SunChips Whole-Canvas Flavour World Architecture
*Discovered in sessions `bd1fd51a`, `dd3c1a0c`, `7ba46fc7`, and `C:\Users\USER-PC\.gemini\antigravity\scratch\SunChips`.*
- **`[data-flavour]` Token System**: The entire page background, navigation accents, typography highlights, and 3D lighting dynamically shift according to the active product variant:
  - Habesha Spice: Warm Crimson / Gold.
  - Paprika: Aegean Deep Blue / Amber.
  - Natural: Golden Maize / Warm Cream.
  - Tomato: Botanical Forest Green / Sunburst Orange.
  - Beef: Deep Royal Plum / Brass.
- **Zero-FOUC Render-Blocking Intro**:
  - Implementation of `<link rel="expect" blocking="render">` to guarantee zero layout shift (CLS 0.000) during font loading and initial packaging hero handoffs.
- **Packaging Motifs as UI Elements**:
  - Real packaging zig-zag foil crimp patterns converted directly into responsive SVG section dividers and slider scrubbers.

#### 3. Cultural & Script-Safe Typography
- Cultural scripts (Amharic / Ethiopic `ፊደል`, Arabic, Japanese) are treated as primary decorative and editorial art, not secondary translation overlays.
- Font pairings:
  - Ethiopic Editorial: `Noto Serif Ethiopic` + `Cormorant Garamond` + `Plus Jakarta Sans`.
  - Snack / Commercial: `Noto Sans Ethiopic` + `Rubik`.
  - Luxury / Keepsake: `Spectral` + `DM Sans`.
- Fluid scaling implemented strictly via mathematical clamps:
  $$\text{font-size} = \text{clamp}(2.25\text{rem}, 1.5\text{rem} + 3.5\text{vw}, 5.5\text{rem})$$

---

### (B) 3D, Three.js, WebGL & Blender Workflows

#### 1. The Mechanics of Belief: Native WebGL 3D Sanctuary Engine
*Discovered in `C:\Users\USER-PC\Downloads\the_mechanics_of_belief_3d_sanctuary_monograph.html` (3.2 MB).*
- **Raymarched Triplanar Rock Shader**:
  - Custom WebGL2 fragment shader evaluating procedural signed distance functions (SDF) blended with triplanar normal displacement maps (embedded as base64 WebP textures: `uTexCliff`, `uTexCavern`).
- **Volumetric Sanctuary Fog & Atmospheric Haze**:
  - Raymarching through a participating medium with uniform light extinction and Henyey-Greenstein phase scattering.
  - Simulates shafting sunlight cutting into an ancient rock-hewn Ethiopian sanctuary cave.
- **Dual-Layer Perspective Integration**:
  - *Layer 1*: Full-viewport WebGL raymarched world with camera angles (`uCamPos`, `uCamAngles`, `uAspectFov`).
  - *Layer 2*: True CSS3D perspective rig (`#camera-rig-3d`) synchronized with the WebGL camera, placing typography and UI elements into 3D world space.
- **Zero-Coder Telemetry HUD**:
  - Discreet director lens HUD providing focal length, aperture, and camera coordinate readouts without polluting the DOM.

#### 2. Headless Blender Still-to-Live 1-Pixel Registration PBR Handoff
*Discovered in `mmcy-landing-page/docs/PROMPT.md` and `SunChips/assets-src`.*
- **The Tone-Mapping Parity Formula**:
  - Render stills in Blender Cycles to **32-bit linear EXR**.
  - Develop stills using exposure grading with the **Khronos PBR Neutral** transform.
  - Configure Three.js with:
    ```typescript
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    ```
  - This mathematically guarantees that the pre-rendered photo still and the interactive 3D WebGL mesh match within 1 pixel at the exact registration handoff.
- **Headless Blender CLI Standards**:
  - Run exclusively via:
    `blender -b --factory-startup --python-exit-code 1 -P tools/blender/build.py -- --sim --render`
  - On Windows: launch via `Start-Process` (since PowerShell `Start-Job` kills child background processes when the subshell terminates).
  - Target mesh budget: $\le 15,000$ vertices for desktop hero meshes; meshopt-compressed GLB $\le 200\text{ KB}$.
  - Bullet Physics Rules: Never tumble objects along arbitrary axes; always spin along the **axis of greatest inertia** to prevent gyroscopic precession collapse; grip immediately at contact with low restitution ($e \le 0.1$).

#### 3. Particle Specimens: Morphing Point Clouds
*Discovered in `Skills\particle-specimens` and `leultew.github.io/agi-readiness`.*
- **Top-to-Bottom Point Sorting**:
  - Sample meshes using Three.js `MeshSurfaceSampler`.
  - Crucial insight: **Sort the resulting point cloud coordinates along the primary vertical axis** before binding to shader attributes `aA` and `aB`. Without sorting, particles morph randomly like television static; with sorting, particles travel in a coherent wavefront across transitions.
- **The Dust "Snap" Transition**:
  - Shader uniforms blend position with a sine swirl and a time-delayed scatter vector `aR`, creating a dust-cloud dissolution that reconstitutes into the next specimen.

#### 4. Keepsake: 3D Bookshelf & Physical Page-Turn Engine
*Discovered in `probable-funicular-eafeecd4` and worktrees `afterlight-study`.*
- Interactive 3D room with wand hover detection, pulling cloth-bound photo albums off a shelf with physics easing onto a desk.
- Page-turning physics: Off-thread page decoding using Web Workers, custom vertex displacement shaders for page curvature, and strict avoidance of `Blob` decoders that alter pixel parity.

---

### (C) Motion, Video & /brag Workflows

#### 1. Hyperframes / /brag Multi-Aspect Production
*Discovered in SunChips (`brag-output-2026-09-28-122315`, `brag-output-2026-10-07-204618-tiktok`) and Play-100.*
- Generates launch videos directly from codebase assets without external video editors.
- Paces motion according to a musical beat grid (`beats`, `timing.json`).
- Delivers multi-format launch suites:
  - 16:9 Landscape for desktop web and YouTube (`brag.mp4`).
  - 9:16 Vertical for TikTok / Reels / Shorts (`tiktok.mp4`) with calibrated safe zones ($120\text{px}$ bottom UI avoidance).
  - Multilingual audio tracks (English + Amharic voiceovers).

#### 2. Virtual Clock Site-Capture Film vs Screen Recording
- Regular screen recordings (Playwright `recordVideo`, OBS) drop frames or stutter during complex WebGL/ScrollTrigger animations.
- The `site-capture-film` pattern replaces `window.requestAnimationFrame` and `performance.now` with a deterministic virtual clock:
  - Steps time frame-by-frame ($1/60\text{ s}$ per tick).
  - Waits for WebGL draw calls and image decodes to settle.
  - Captures lossless PNG sequences and encodes them via GPU-accelerated FFmpeg into AV1/VP9/H.264.

#### 3. Purposeful Motion & React Bits/21st.dev Vanilla Porting
- Kinetic typography must reinforce the sentence's semantic meaning:
  - Timelines and stats count up linearly to validated figures.
  - The thesis reveals word-by-word with variable font weight modulation.
- Motion Safety:
  - No text splitting on long paragraphs (prevents screen reader fragmentation).
  - Full visibility preserved when JavaScript is disabled (`<noscript>` or static-first styling).
  - Explicit `prefers-reduced-motion: reduce` fallback showing final locked states immediately.

---

### (D) Custom Agent Instructions & Multi-Model Coordination

#### 1. The Model Roster & Strict Division of Labor
*From `copilot-instructions.md`, `START.md`, and session `abe11421`.*
- **Model Roster**:
  - **GPT-6 Astra**: Sole copywriter, narrative architect, and editorial auditor. Claude Opus is strictly prohibited from writing user-facing strings (headlines, body, alt-text, buttons, aria-labels).
  - **Claude Opus 5.5**: Lead frontend architect, 3D modeler, GSAP animator, and CSS/WebGL engineer.
  - **GPT Sol 6.1**: Fast-lane worker for scoped coding, test triage, and deep code audits.
- **The 10/10 Gauntlet**:
  - Neither model is allowed to merge or deploy independently. Both models must review the identical commit hash and score $10/10$ across all rubric categories (concept, craft, typography, motion, responsive parity, accessibility).
  - Any score below 10 must provide an exact fix (file path, CSS selector, pixel value).

#### 2. Cross-Session CPU/RAM Arbitration Protocol
*Discovered in turns 408–420 of session `eafeecd4`.*
- When multiple AI agent sessions share a single workstation (Ryzen 7 7800X3D, RTX 5070 Ti, 32 GB RAM):
  - Agent sessions communicate across working directories via message tokens (`Keepsake window open` $\leftrightarrow$ `window closed`).
  - Heavy Blender Cycles GPU rendering and video encoding processes suspend execution while another session runs latency-critical 60 FPS frame measurements or exact-pixel test suites.
  - Execution of `host-quiet-run.ps1` verifies background system noise ($< 2\%$ CPU jitter) before recording performance scores.

#### 3. Freelance Studio 15-Hour Floor
*From session `urban-eureka-27a46c69`.*
- Shift from measuring freelance output by "number of submissions" to measuring **real focused work hours ($\ge 15\text{ hours/day}$)**.
- Anti-hallucination rule: Every entry must declare calculated mechanics vs real tests; renders must be watermarked "Render"; zero made-up certifications, awards, or client testimonials.

---

## 3. Skills Ledger: Established vs Novel Discoveries

| Capability / Workflow | Present in `C:\Users\USER-PC\Skills`? | Novel Gems Discovered in Chat History |
|---|---|---|
| **The Mechanics of Belief WebGL Sanctuary** | ❌ **NO** (Not in Skills repo) | **Discovered**: Complete raymarched triplanar SDF displacement shader engine, CSS3D rig, and volumetric light scattering monograph in `Downloads`. Ready to be turned into a standalone skill (`webgl-volumetric-sanctuary`). |
| **Inter-Session CPU/RAM Arbitration** | ❌ **NO** (Not in Skills repo) | **Discovered**: Cross-session coordination protocols, `host-quiet-run.ps1`, shared memory window tokens, and exact-pixel qualification gates. Ready for an orchestration skill (`multi-agent-machine-arbitration`). |
| **OrcaSlicer / 3MF 3D Print Engineering** | ❌ **NO** (Not in Skills repo) | **Discovered**: Complete CAD to OrcaSlicer 3MF pipeline with editable text objects, Z-spring deflection calculations, and Bambu P1S support-free print parameters. |
| **SunChips Flavour Theming & 3D Pack** | ⚠️ **Partial** (`product-site-*` skills exist) | **Discovered**: The actual production codebase (`scratch\SunChips`), live Amharic TikTok video pipeline (`brag-output-*`), `<link rel="expect">` zero-FOUC implementation, and real 3D bag blend files. |
| **MMCY 150-Word Thesis Contract** | ⚠️ **Partial** (`award-winning-streak-sites`) | **Discovered**: Master brief `docs/PROMPT.md` and `docs/START.md` containing the exhaustive anti-shadow, radius scale, and 5-agent section voting rules. |
| **Particle Specimens** | ✅ **YES** (`particle-specimens`) | **Discovered**: The complete origin history in session `abe11421` (AGI readiness), proving the top-to-bottom vertical point sorting requirement for smooth morphing. |
| **LinkedIn Desktop Automation** | ✅ **YES** (`linkedin-desktop-post`) | **Discovered**: The original root cause in session `abe11421`: LinkedIn Windows app is a WebView2 window without standard Windows UIA accessibility trees, necessitating coordinate-based screen clicking via `gui.ps1`. |

---

## 4. Verification Checkpoint Table

| Target Area | Location Checked | Finding / Status |
|---|---|---|
| **SunChips Ethiopia** | `scratch\SunChips`, `sessions: 44499e93, bd1fd51a, 7ba46fc7` | Confirmed full repository with Astro, Blender bag 3D models, 5-flavour token system, and multi-format launch films. |
| **AGI Readiness** | `sessions: abe11421`, `leultew.github.io/agi-readiness` | Confirmed origin session for particle specimens, dual-model gauntlet, and LinkedIn posting. |
| **Mechanics of Belief** | `Downloads\the_mechanics_of_belief_*`, `emptyWindowChatSessions\6a857d6c` | Confirmed 3.2 MB native WebGL raymarched cave sanctuary monograph with Ethiopic script art. |
| **Keepsake (3D Office)** | `sessions: eafeecd4, 7db7ee44, 1c40d1e8` | Confirmed 2,700+ turns of Three.js/R3F bookshelf, wand selector, bear models, and page-turning engine. |
| **MMCY Concept** | `Projects\mmcy-landing-page`, `docs\PROMPT.md`, `docs\START.md` | Confirmed 150-word thesis contract, zero-shadow design system, and multi-agent voting protocol. |
| **VS Code Insiders** | `emptyWindowChatSessions`, `workspaceStorage`, `session-store.db` | Confirmed live session JSONL transcripts matching all core keywords. |

---
*Report compiled by Copilot Session Scout.*
