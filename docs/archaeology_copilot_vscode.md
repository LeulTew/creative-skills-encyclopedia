# Archaeological Report: GitHub Copilot Desktop App & VS Code Insiders Storage

**Archaeologist:** Subagent 1 (GitHub Copilot & VS Code Insiders Archaeologist)  
**Investigation Date:** November 5, 2026  
**Target Environments:** GitHub Copilot Desktop App (`C:\Users\USER-PC\.copilot\`), VS Code Insiders (`C:\Users\USER-PC\AppData\Roaming\Code - Insiders\`), and VS Code (`C:\Users\USER-PC\AppData\Roaming\Code\`)  
**Scope Exclusions Enforced:** All enterprise ERP projects (`dreamlux-erp`, `koti-catering-erp`, `abi-co-events-erp`) were strictly filtered out and omitted.

---

## 1. Executive Summary & Inventory Overview

A comprehensive archaeological extraction was conducted across PC local storage, targeting GitHub Copilot Desktop App state, SQLite databases, session checkpoints, event streams, instruction prompt files, and VS Code Insiders workspace and global storages. 

### Key Forensic Datastores Discovered & Audited

1. **GitHub Copilot Desktop App Core Database (`C:\Users\USER-PC\.copilot\session-store.db`)**:
   - **Scale:** 311 registered sessions, 22,258 conversational turns, 942 structured checkpoints, 23,565 tracked session files, and 348,644 telemetry usage events.
   - **Search Index:** 27,908 indexed full-text records across projects.
2. **GitHub Copilot App Configuration & State (`C:\Users\USER-PC\.copilot\data.db`)**:
   - **Scale:** 18.2 MB SQLite database containing 99 tables, including project checkout mappings, factory scopes, remote control authorizations, and workspace snapshots.
3. **Session State Worktrees (`C:\Users\USER-PC\.copilot\session-state\`)**:
   - **Scale:** 847 session-state directories containing `workspace.yaml`, `events.jsonl` (gigabyte-scale audit streams), `checkpoints/`, `files/`, and `session.db`.
4. **VS Code Insiders Global Storage (`C:\Users\USER-PC\AppData\Roaming\Code - Insiders\User\globalStorage\`)**:
   - **Chat Sessions:** `emptyWindowChatSessions\` holding over 30 `.jsonl` and `.json` interactive chat sessions (e.g. `6a857d6c-a877-4332-8e00-122a05a48577.jsonl`, 5.8 MB).
   - **Custom Agent Blueprints (`github.copilot-chat\`):** Official agent manifests including `Ask.agent.md`, `Explore.agent.md`, and `Plan.agent.md`.
5. **VS Code Insiders Workspace Storage (`C:\Users\USER-PC\AppData\Roaming\Code - Insiders\User\workspaceStorage\`)**:
   - Workspace directories `-38a2c100`, `1792097598496`, and `3c011d8bcb1fc284a24332c6042eb890`, housing multi-file chatEditingSessions (`chatEditingSessions\6a857d6c-a877-4332-8e00-122a05a48577\`).

---

## 2. SunChips Product Site Architecture

### Forensic Identifiers
- **Session ID:** `7ba46fc7-0378-4547-9cdc-d1f18687791d` ("Desktop story fixes"), `44499e93-7f02-4574-bf08-e0394af6f496` ("leultew-silver-journey"), `bd1fd51a-8c3e-46a4-bd3b-c33173213427`
- **Repository / Working Directory:** `LeulTew/SunChips` (`C:\Users\USER-PC\.gemini\antigravity\scratch\SunChips`), branch `main`
- **Session Event Log:** `C:\Users\USER-PC\.copilot\session-state\7ba46fc7-0378-4547-9cdc-d1f18687791d\events.jsonl` (1.46 GB)
- **Checkpoints Audited:** 23 detailed checkpoints documenting complete build, physics bakes, and dual-model review cycles.

### Architectural Innovations & Code Patterns

```
                                 [SUN CHIPS ETHIOPIA]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
 [Whole-Canvas Flavour]        [3D Still-to-Live Handoff]        [Headless Blender Sim]
 - [data-flavour] tokens        - 1-px registration               - Pop film cloth physics
 - Calibrated WCAG AA           - Khronos PBR Neutral             - Inset outline chip generator
 - SVG packaging motif          - Render-blocking intro link      - Transparent RGBA Cycles bake
```

#### 1. Whole-Canvas Flavour World Theming
- Driven via `[data-flavour]` tokens attached to root containers.
- Each variant (e.g. Beef, Paprika, Nature) has dedicated color worlds with mathematically calibrated WCAG AA contrast.
- Packaging motifs are vectorized and utilized as SVG dividers and tactile UI controls rather than generic rectangular dividers.

#### 2. 3D Still-to-Live 1-Pixel Registration Handoff
- **Zero-FOUC Delivery:** Implemented via `<link rel="expect" blocking="render">` in the document head to eliminate flash of unstyled content during heavy WebGL initialization.
- **Stage Loader Contract (`src/scripts/stage-loader.ts`):** 
  - Lifecycle: `intent-start` → `preload` → `stage-settled` → `resize-handback` with explicit `context-lost` WebGL guard.
- **Tone Mapping Consistency (`src/scripts/stage.ts`):**
  - Baked environment maps loaded via RGBE → `HalfFloat` `DataTexture` with `CubeUV` mapping.
  - Three.js configured with `Khronos PBR Neutral` tone mapping (`THREE.NeutralToneMapping`), ensuring 100% color and exposure equivalence between 32-bit EXR pre-rendered stills and real-time interactive 3D WebGL meshes.

#### 3. Headless Blender Procedural & Physics Simulation Pipeline
- **Procedural Chip Mesh Generator (`tools/blender/chips.py`):**
  - Traces product silhouette outlines marching inward with a precise 6 px inset.
  - Generates organic chips using parameter modulations (`squash`, `bite`, `nick` restricted to inward-only deformation, paired with cup and saddle curling).
- **Pop Film Bag Physics Simulation (`tools/blender/build_pop.py`):**
  - Cloth solver configured with verified parameters:
    ```python
    CLOTH = {
        "mass": 0.0004,
        "air_damping": 2.5,
        "quality": 12,
        "tension": 120,
        "compression": 120,
        "shear": 12,
        "bending": 16,
        "pressure": 0.08,
        "swell": 1.25,
        "deflate_frames": 25,
        "gust": 40.0 # m/s^2 * mass (radial outward force)
    }
    ```
  - Bakes rendered in Cycles GPU with 160 samples, adaptive threshold 0.015, and OpenImageDenoise (OIDN) with albedo and normal passes.

#### 4. Internationalization & Static Performance
- Astro 7 Static framework delivering bilingual routes: English (`/`) and Amharic (`/am/`).
- `prebuild` hook execution: Automatic font subsetting for Ethiopic/Amharic glyphs to keep font payloads minimal.
- CSP SHA-256 script/style hashing with `'wasm-unsafe-eval'` authorization.

---

## 3. AGI Readiness Editorial Architecture

### Forensic Identifiers
- **Session ID:** `abe11421-452b-4bb3-94cf-55797458aec4` ("AGI vision platform", `cuddly-chainsaw-abe11421`)
- **Live Deployment:** `https://leultew.github.io/agi-readiness/`
- **Session State:** `C:\Users\USER-PC\.copilot\session-state\abe11421-452b-4bb3-94cf-55797458aec4\`
- **Original User Trigger Prompt:**
  > *"make and host on netlify or any free site a modern award wining site, I even have blender open so u can use it... prompt caption: 'https://leultew.github.io/agi-readiness/ Thoughts on AGI, and how AI 2027...'"*

### Architectural Innovations & Code Patterns

#### 1. Persistent Visual Agent Motif
- Replaced decorative illustrations with a living conceptual centerpiece: a continuous particle cloud that persists throughout the user's reading experience.
- Headless Blender GLB point sampling extracts vertex point clouds from symbolic geometric models, dynamically morphed via Three.js vertex shaders.

#### 2. Sentence-by-Sentence Kinetic Text Typography
- Narrative rhythm driven by kinetic text animation paired with ultra-quiet body copy.
- Key thesis statements reveal word-by-word tied to scroll progress, ensuring the reader absorbs the conceptual thesis before reaching data visualizations.

#### 3. Dual-Model Review Loop Pre-Flight
- Autonomous execution waiting for Round 1 review consensus between GPT-6 Astra and Claude Opus 5.5 before public git commit and automated GitHub Pages deployment.
- Automated creation of high-impact teaser video clips using `/brag` for social distribution.

---

## 4. MMCY Architecture & Particle Specimens

### Forensic Identifiers
- **Session ID:** `957bdd4b-56cd-4953-8b56-619bb3ddb83c` (`mmcy-landing-page`, branch `redesign`)
- **Session Event Log:** `C:\Users\USER-PC\.copilot\session-state\957bdd4b-56cd-4953-8b56-619bb3ddb83c\events.jsonl` (5.91 GB)
- **Master Specification Document:** `C:\Users\USER-PC\Projects\mmcy-landing-page\docs\PROMPT.md`
- **Resource Lock Configuration:** `C:\Users\USER-PC\.copilot\mmcy-host-hold.json`

### Architectural Innovations & Code Patterns

#### 1. The 150-Word Thesis Contract
Every page authoring must declare at the top of `index.html` a strict contractual comment <= 150 words:
- **THESIS:** The single singular idea the page owns.
- **WORLD:** The palette, typography, and material definitions.
- **STORY:** What the visitor comes to believe and their subsequent action.
- **FIRST VIEWPORT:** Exact composition layout and primary CTA coordinate.
- **SIGNATURE MOMENT:** The unforgettable interaction.

#### 2. Strict Word Budgets & Anti-Slop Ban List
- **Word Budgets:** Hero headline $\le$ 6 words; section headlines $\le$ 5 words; CTAs $\le$ 3 words.
- **Anti-Slop Banned List:**
  - Zero stock BPO headset smiles.
  - Zero neon gradients on black.
  - Zero decorative glassmorphism or floating frosted glass cards.
  - **Zero drop shadows:** Explicitly bans `box-shadow`, `drop-shadow`, `text-shadow`, and ambient glows. Depth must be achieved strictly through subtle tone steps, high-contrast layering, scale differentials, and 1px borders.
  - Zero-height wayfinding rails replacing bulky sidebars.

#### 3. Particle Specimens Pipeline
- Three.js particle morphing system transitioning smoothly across Blender-modeled specimens based on scroll progress:
  $$\text{Code Symbol } (</>) \longrightarrow \text{Classical Temple} \longrightarrow \text{Mechanical Gears} \longrightarrow \text{DNA Helix} \longrightarrow \text{HAL Eye}$$
- Per-state chromatic tuning with an intentional particle "dust snap" transition at scroll thresholds.

#### 4. Hardware Scheduling & GPU Isolation (`mmcy-host-hold.json`)
- System discovered holding lock configuration:
  ```json
  {
    "until": "2026-10-02T08:00:00+03:00",
    "reason": "Owner 2 Oct 20:00: MMCY has the PC; Mizan paused, other lanes idle. One heavy job at a time (Wi-Fi is fragile).",
    "limits": [{ "from": "2026-10-02T20:01:21+03:00", "until": "2026-10-06T20:01:21+03:00", "slots": 1 }]
  }
  ```
- Ensures intensive Cycles 3D baking and rendering jobs operate in dedicated GPU time-slots without competing with background tasks or network spikes.

---

## 5. Play 100 / 100 Games Gaming Collection Architecture

### Forensic Identifiers
- **Coordinator Session:** `a0879c56-839e-45cd-9af6-df2b513e53e8` (300+ turns, coordinating Release 6 through Release 19)
- **Integration Sessions:** `d346abe6-aa1a-4428-b0e1-626314e03937` (R18 Integration), `c95e0c5d-210a-4755-877a-358aabe8c9ea` (R19 App Lane)
- **Target Repository:** `LeulTew/play-100` (`https://play-100-collection.vercel.app`)
- **Technology Stack:** Vite 8 + React 19.3 + TypeScript Progressive Web App (PWA)

### Architectural Innovations & Code Patterns

```
                                [PARENT COORDINATOR]
                            (Session: a0879c56-839e-45cd)
                                         │
     ┌───────────────┬───────────────────┼───────────────────┬───────────────┐
     ▼               ▼                   ▼                   ▼               ▼
 [App Lane]      [Perf Lane]       [Security Lane]     [Cloud-UI Lane]   [Review Lane]
 (c95e0c5d)      (d64dd8bc)          (8d614daf)          (3fb1eed4)       (fa41252e)
```

#### 1. Release Train Coordination Framework
- Architecture utilizes a central coordinator agent dispatching isolated child worktrees for parallel domain fixing:
  - **App Lane:** React 19 hooks and UI lifecycle repair.
  - **Perf Lane (`PERF-01`):** Startup latency, bundle splitting, memory leak remediation.
  - **Security Hardening Lane:** Privacy protections, token isolation, sanitized inputs.
  - **Cloud-UI Triage Lane:** Responsive cross-device UI parity.
  - **Review Council Lanes:** Independent reviewer sessions (`QA`, `tech-b`, `UX`, `sec-audit`, `UI`).
- Integration candidate branch merged only when every review lane independently scores 10/10.

#### 2. Advanced Feature Implementations
- **Data Mobility & Persistence:** IndexedDB local persistence engine with automated backup recovery, paired with direct Excel (.xlsx) bi-directional import/export.
- **Interaction Layer:** Draggable play queue, switchable table ranking mode, bulk action processing.
- **Simulated Latency Testing:** Measuring user invite and joining flows under synthetic high-latency conditions to ensure sub-second UI responsiveness.

---

## 6. 3D Blender MCP Pipeline & Multi-Agent Concurrency

### Forensic Identifiers
- **Session ID:** `098ff266-fdce-4710-8014-ced4e779a917` (`Kiri-Innovation/3dgs-render-blender-addon`)
- **Tools & Infrastructure:** `C:\Users\USER-PC\Projects\Leuel-Space-Redesign\.cad-tools\blender-live\`
- **Files Discovered:** `bootstrap_live.py`, `leuel_blender_mcp.py`, `coordination.json`, `Invoke-BlenderBootstrap.ps1`

### Architectural Innovations & Protocols

#### 1. Multi-Agent Port & Security Isolation
- Standard `blender-mcp` operates unauthenticated on TCP port 9876.
- The owner's environment implements an isolated, token-authenticated safe-mode bridge:
  - **Production Port:** 19877 (with token `_leuel_token` injection).
  - Explicit port demarcation prevents collision between concurrent agent sessions.

#### 2. Mutual Exclusion GPU Window Protocol
- Turn transcripts reveal structured inter-agent negotiation for shared GPU access:
  > *"Agreed SESSION-ONLY enable, distinct windows/ports... room work uses Blender port 19877; other agent uses 9876. Neither touches other's scene, and heavy GPU renders run one at a time... Taking released GPU window NOW for Keepsake v4: 2x 1440x1000/64 OptiX material previews + 1x 1024x512 static reflection probe... will release on exit."*
- Eliminates GPU driver out-of-memory crashes and CUDA contention during parallel model evaluation.

---

## 7. VS Code Insiders Custom Agents & Chat Ecosystem

### Forensic Identifiers
- **Storage Path:** `C:\Users\USER-PC\AppData\Roaming\Code - Insiders\User\globalStorage\github.copilot-chat\`
- **Chat Editing Session:** `6a857d6c-a877-4332-8e00-122a05a48577` (Workspace `1792097598496`)

### Architectural Innovations & Agent Manifests

#### 1. Discovered VS Code Agent Manifests

##### A. `Ask.agent.md` (Read-Only Code Explainer)
- **Role:** Strictly read-only codebase explorer and concept teacher.
- **Constraints:** Write tools and terminal modification commands disabled; code examples supplied in response text only.

##### B. `Explore.agent.md` (Fast Read-Only Explorer)
- **Model Pinning:** Explicitly pins `Claude Haiku 4.5 (copilot)` or `Gemini 3 Flash (copilot)`.
- **Search Strategy:** Broad-to-narrow execution (glob patterns $\to$ regex/AST $\to$ line-bounded reading).
- **Parallelism:** Designed to be spawned in parallel 2-3 instances across decoupled codebase modules.

##### C. `Plan.agent.md` (Iterative Multi-Phase Planner)
- **Workflow:** 4-stage cycle:
  1. *Discovery* (subagent research)
  2. *Alignment* (clarifying ambiguities via `#tool:vscode/askQuestions`)
  3. *Design* (persisted into `/memories/session/plan.md`)
  4. *Refinement* (review and revision)
- **Strict Output Rule:** Zero code blocks in the plan; explicit dependencies and verification criteria required.

#### 2. Interactive Session Implementation Blueprint (`6a857d6c-a877-4332-8e00-122a05a48577`)
- **User Prompt Specification:**
  > *"using gpt 6 astra or opus 5.5 set to max make sure to make this site 10/10 on every metrics... use blender for the scene but optimize using latest 2026 gaussian splats or video... 3-5 sub agents to review ur work pragmatically with no bias and compare to winning 3D awwards sites... for texts n stuff use reactbits.dev text animation, animejs (canvas drawings), 21st.dev for better components..."*
- **Discovered Code Implementation (`App.tsx`):**
  - **Centerpiece Mesh:** Three.js `TorusKnotGeometry(10, 3, 100, 16)` with `MeshStandardMaterial` (color `#aa3bff`, metalness `0.7`, roughness `0.2`, emissive `#330066`, emissiveIntensity `0.5`).
  - **Kinetic Text Animations:** 
    - GSAP `power4.out` translation.
    - Anime.js staggered character reveal:
      ```typescript
      anime.timeline().add({
        targets: '.char',
        translateY: [100, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 1400,
        delay: (el: HTMLElement, i: number) => i * 80,
      });
      ```
  - **Design System Tokens:** Pure semantic CSS variables without soft elevation shadows, using `#aa3bff` brand accents, `#08060d` headings, and `#6b6375` body copy.

---

## 8. Archaeological Matrix: Patterns, Tools & Provenance

| Architectural Dimension | Discovered Implementation / Pattern | Primary Source Artifact | Provenance / Context |
| :--- | :--- | :--- | :--- |
| **Model Pinning** | Flagship models set to max reasoning budget; no low-tier defaults | `.copilot\copilot-instructions.md` | Owner Global Directive |
| **Flavour World Theming** | `[data-flavour]` tokens with calibrated WCAG AA contrast | `SunChips\src\scripts\stage.ts` | SunChips Product Site |
| **3D Still-to-Live Handoff** | 1-px registration, Khronos PBR Neutral, render-blocking expect | `SunChips\src\scripts\stage-loader.ts` | SunChips Product Site |
| **Cloth Physics Solver** | Procedural pressure/swell parameters; Cycles 160-sample bakes | `SunChips\tools\blender\build_pop.py` | SunChips Product Site |
| **Thesis Contract** | 150-word top-of-file specification comment | `mmcy-landing-page\docs\PROMPT.md` | MMCY Architecture |
| **Anti-Slop Linting** | Strict ban on drop-shadows, neon on black, headset smiles | `mmcy-landing-page\docs\PROMPT.md` | MMCY Architecture |
| **Particle Specimens** | Morphing Three.js point clouds from Blender GLB vertices | `mmcy-landing-page\src\particles.ts` | AGI & MMCY Sites |
| **Hardware Mutex Lock** | `mmcy-host-hold.json` single-heavy-job GPU window allocation | `.copilot\mmcy-host-hold.json` | PC Resource Governor |
| **Release Train Coordinator** | Parent agent managing parallel child worktree fix lanes | `session-store.db` (session `a0879c56`) | Play 100 Gaming Collection |
| **Dual-Model Review Loop** | Split ownership: GPT-6 Astra (copy) & Opus 5.5 (3D/presentation) | `PROMPT.md` & `session-store.db` | Streak Quality Standard |
| **Live 3D MCP Bridge** | Token-authenticated Blender socket bridge on port 19877 | `Leuel-Space-Redesign\blender-live` | 3D Blender Pipeline |
| **Agent Personas** | `Ask.agent.md`, `Explore.agent.md`, `Plan.agent.md` | VS Code `github.copilot-chat\` | VS Code Insiders Custom Tooling |
| **Modern Motion Stack** | GSAP 3.13+ ScrollTrigger, Anime.js character cascades, Three.js | VS Code session `6a857d6c` (`App.tsx`) | Awwwards-tier Frontend |

---

## 9. Conclusion & Recommendations

The local storage archaeology reveals a highly sophisticated, industrial-grade creative engineering methodology. The owner's workflows across GitHub Copilot Desktop and VS Code Insiders are characterized by:
1. **Mathematical rigor over decorative fluff:** Zero drop-shadows, strict word budgets, and tone mapping alignment between Blender and Three.js.
2. **Systematic multi-agent orchestration:** Parallel fix lanes, dual-model consensus gates, and explicit hardware mutexes preventing GPU saturation.
3. **Reproducible pipelines:** Headless CLI script generation over manual GUI edits, ensuring 3D assets, cloth physics, and font subsets are deterministically buildable.

All documented patterns, prompt templates, and code blocks have been preserved in this report for direct reference and incorporation into the Creative Skills Encyclopedia.
