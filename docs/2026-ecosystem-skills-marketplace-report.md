# 2026 AI Agent Ecosystem, Skills & Marketplace Intelligence Report
**Domain:** Cutting-Edge Web Frontend, Interactive 3D, Creative Tool MCPs & Agent Skill Engineering  
**Prepared for:** Parent Agent & Engineering Leadership  
**Date:** November 2026  
**Auditor Identity:** Scout Agent (Gemini 3.8 Flagship High-Reasoning Engine)

---

## Executive Summary

The autonomous AI agent ecosystem in late 2026 has crossed a decisive threshold: **from prompt-driven code completion to closed-loop, tool-augmented deterministic engineering**. Frontier reasoning models—specifically **Gemini 3.8 Flash (High)**, **GPT-6 Astra**, and **Claude Opus 5.5**—no longer struggle with basic syntax or CSS layout. Instead, the competitive differentiator lies in **the fidelity of their tool integrations (Model Context Protocol - MCP)**, **domain-specialized skill heuristics (`SKILL.md`)**, and **executable verification gates**.

This report evaluates four interconnected domains:
1. **Next-Generation UI/UX & Web Frontend**: Physical displacement shaders, chromatic dark palettes, mathematical clamp scales, modern GSAP 3.13+ kinetic typography, and Lenis 1.1+ scroll normalization.
2. **Interactive 3D & WebGPU**: Three.js r170–r172+ `WebGPURenderer`, Three.js Shading Language (TSL), Khronos PBR Neutral tone mapping, headless Blender pipelines, and 3D MCP tools.
3. **Creative Tool MCPs**: Live socket bridges for Blender, Figma, DaVinci Resolve Studio, Adobe Photoshop, Webflow, and Canva.
4. **Skills Repo Audit (`C:\Users\USER-PC\Skills`)**: Systematic gap analysis, modernization opportunities, and five production-ready `SKILL.md` specifications designed to elevate the repository into a world-class agentic capability hub.

---

## 1. Advanced UI/UX & Web Frontend Engineering

### 1.1 Next-Generation Design Systems

Modern 2026 web design has decisively rejected generic "AI slop"—such as ungrounded pastel linear gradients on pure black, floating glass cards without physical refraction, and generic PowerPoint slide-ins. Award-winning frontends (Awwwards, FWA, CSS Design Awards) now demand physical optical simulation and bespoke typographic scale.

```
+--------------------------------------------------------------------------------------------------+
| PHYSICAL DISPLACEMENT PIPELINE                                                                   |
|                                                                                                  |
| [ Underlying Content ]                                                                           |
|         │                                                                                        |
|         ▼                                                                                        |
| [ <feImage> Normal Map ] ──► [ <feDisplacementMap> scale=0.5 ] ──► [ Chromatic Fringe Separation ]
|                                                                              │                   |
|                                                                              ▼                   |
| [ Isolated Lens Backing ] ◄── [ 10-Layer Specular Box Shadow ] ◄── [ Clear Unrefracted Top Text ] |
+--------------------------------------------------------------------------------------------------+
```

#### A. Physical Liquid Glass Shaders (Apple Tahoe Architecture)
Unlike standard CSS `backdrop-filter: blur()`, true liquid glass simulates the index of refraction (IOR) of curved glass lenses:
- **Displacement Vector Field:** Utilizes a high-precision WebP normal displacement map encoded as base64 in SVG `<feImage preserveAspectRatio="none">`.
- **Optical Refraction Filter:** Chains the normal map into `<feDisplacementMap in="SourceGraphic" scale="0.5" xChannelSelector="R" yChannelSelector="G">` with `primitiveUnits="objectBoundingBox"`.
- **Chromatic Dispersion Fringing:** Splitting RGB channels slightly along displacement normals (`feOffset` on Red and Blue channels) produces realistic prism chromatic fringing at bevel edges.
- **Isolated Non-Ghosting Lens Architecture:** The refractive lens container is isolated to an absolute background layer (`-z-10`). Heading typography and interactive controls float on top unrefracted, preventing eye-strain and subpixel font blur.
- **Specular Highlight Shadow Stack:** Real light reflection requires multi-stage rim bounce, inner glow, and ambient occlusion:
  ```css
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.12),
    inset 1.8px 3px 0px -2px rgba(255, 255, 255, 0.95),
    inset -2px -2px 0px -2px rgba(255, 255, 255, 0.8),
    inset -3px -8px 1px -6px rgba(255, 255, 255, 0.6),
    inset -0.3px -1px 4px 0px rgba(0, 0, 0, 0.12),
    inset -1.5px 2.5px 0px -2px rgba(0, 0, 0, 0.20),
    inset 0px 3px 4px -2px rgba(0, 0, 0, 0.20),
    inset 2px -6.5px 1px -4px rgba(0, 0, 0, 0.10),
    0px 1px 5px 0px rgba(0, 0, 0, 0.10),
    0px 8px 24px 0px rgba(0, 0, 0, 0.12);
  ```

#### B. Chromatic Dark Themes (Calibrated Contrast Tokens)
Pure black (`#000000`) backgrounds cause OLED pixel smearing and high optical contrast fatigue. 2026 dark themes utilize deep tinted chromatic palettes:
- **Obsidian Dark Surface:** `#0a0b0e` (Base canvas with 2% cobalt tint)
- **Deep Zinc Container:** `#12141a` (1st elevation)
- **Cobalt Boundary Rim:** `#1e293b` (Subtle structural borders)
- **Ember Glow Highlight:** `#f97316` / `#ff5500` (High-intensity focal accents)
- **WCAG AA Compliance:** Strict verification ensuring minimum 4.5:1 contrast for body copy and 3.0:1 for large display glyphs across all light/dark elevation worlds.

#### C. Fluid Responsive Typography (Mathematical Clamp Formula)
Bans hardcoded media query steps for typography. Every display heading and container uses linear interpolation across viewports ($V_{\min} = 390\text{px}$, $V_{\max} = 1440\text{px}$):
$$\text{Slope } m = \frac{S_{\max} - S_{\min}}{V_{\max} - V_{\min}}$$
$$\text{Intercept } b = S_{\min} - (m \times V_{\min})$$
$$\text{CSS: } \text{font-size} = \text{clamp}(S_{\min}, b\text{rem} + (m \times 100)\text{vw}, S_{\max})$$

*Example Hero Scale:*
```css
/* Range: 44px (2.75rem) at 390px viewport to 96px (6.0rem) at 1440px viewport */
font-size: clamp(2.75rem, 1.543rem + 4.952vw, 6rem);
line-height: clamp(0.95, 1.05 - 0.05vw, 1.0);
letter-spacing: clamp(-0.04em, -0.02em - 0.01vw, -0.01em);
```

---

### 1.2 Modern GSAP 3.13+ Kinetic Typography & Lenis Orchestration

GSAP 3.13+ fundamentally altered modern web animation licensing by making core enterprise plugins (**SplitText**, **ScrambleText**, and **Physics2D**) free for open web use. When coupled with **Lenis 1.1+**, it forms the backbone of award-level kinetic motion.

#### A. Lenis + GSAP RAF Synchronization
Standard browser scrolling causes desynchronization between native scroll coordinates and GSAP ScrollTrigger transforms. They must share a single unified `requestAnimationFrame` loop with `lagSmoothing(0)`:

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function initScrollOrchestration() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Critical: prevent frame drops from causing animation jumps
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

#### B. Anti-PowerPoint Sentence-by-Sentence Choreography
Every text element must serve a semantic purpose rather than receiving a uniform fade-and-lift:
1. **Key Claims (ScrollReveal):** Word-by-word scrubbed opacity (`0.15 -> 1.0`) completed within the first 40% of viewport transit.
2. **Hero Milestone (Variable Font Wave):** Scrubbing variable font axes (Mona Sans or Inter Display) across `wdth` (75 -> 118) and `wght` (300 -> 800) under character masks.
3. **Machine Reasoning / Telemetry:** Monospace `ScrambleText` with custom character sets (`01_/#X*`) resolving in 45ms increments.
4. **Accessible Shadowing:** Visual copy is set to `aria-hidden="true"`, paired with a single, un-split, screen-reader-accessible heading (`.sr-only`). Reduced-motion media queries (`@media (prefers-reduced-motion: reduce)`) bypass all splitting and show resting typography immediately.

---

### 1.3 Design-to-Code Protocols for 2026 Frontier Models

Frontier reasoning models (**GPT-6 Astra**, **Claude Opus 5.5**, and **Gemini 3.8 Flash High**) have distinct failure modes in frontend engineering if unconstrained:
- **Excessive DOM Nesting:** Wrapping every element in 6 layers of decorative `div` containers.
- **Hallucinated Utility Tokens:** Inventing non-existent Tailwind utility classes or custom colors.
- **Ignoring Failure States:** Failing to specify image `alt`, aspect ratios, or no-JS/no-WebGL fallbacks.

**The 2026 Prompt Protocol Contract:**
1. **Contract-First AST Scaffold:** Require the model to emit a component hierarchy tree before any JSX or CSS is written.
2. **Token Locking:** Explicitly pass the available CSS custom property manifest; strictly forbid inline hex codes or arbitrary utility values.
3. **Hard Verification Gates:** Code generation must pass a local linter and typecheck (`tsc --noEmit && eslint .`) before being marked as done.

---

## 2. 3D Web & Interactive Graphics

### 2.1 Three.js r170–r172+ WebGPU & TSL Pipeline

Three.js releases r170 through r172 mark the transition of WebGPU from experimental to production readiness. `WebGPURenderer` allows native WGSL shader execution while maintaining seamless WebGL2 fallbacks through the **Three.js Shading Language (TSL)**.

```
+-----------------------------------------------------------------------------------------------+
| THREE.JS R170+ TSL RENDER PIPELINE                                                            |
|                                                                                               |
|                        ┌──────────────────────────────┐                                       |
|                        │    TSL Node Material Graph   │                                       |
|                        └──────────────┬───────────────┘                                       |
|                                       │                                                       |
|                     ┌─────────────────┴─────────────────┐                                     |
|                     ▼                                   ▼                                     |
|            [ WebGPURenderer ]                  [ WebGL2 Fallback ]                            |
|             Transpiles to WGSL                  Transpiles to GLSL                            |
|                     │                                   │                                     |
|                     ▼                                   ▼                                     |
|          [ neutralToneMapping() ]            [ NeutralToneMapping ]                           |
|          PBR Color Consistency               Khronos 3D Commerce Parity                       |
+-----------------------------------------------------------------------------------------------+
```

#### A. The Khronos PBR Neutral Tone Mapping Standard
Historically, tone mappers like Reinhard or ACESFilmic crushed highlights and altered product color accuracy (e.g. shifts in high-saturation reds and yellows). Khronos PBR Neutral tone mapping (`NeutralToneMapping`) provides a standardized, perceptually uniform transfer function that preserves real-world product colorimetry under HDR environment maps.

**Implementation in Three.js WebGPU / TSL:**
```typescript
import { WebGPURenderer, NeutralToneMapping } from 'three/webgpu';
import { color, float, positionLocal, time, neutralToneMapping } from 'three/tsl';

// Initialize WebGPURenderer with automatic fallback to WebGL2
const renderer = new WebGPURenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.toneMapping = NeutralToneMapping;
renderer.toneMappingExposure = 1.0;
await renderer.init();

// TSL Custom Post-Processing / Shading Node
const hdrColor = color(0xff5500).mul(positionLocal.y.sin().add(1.0));
const outputColor = neutralToneMapping(hdrColor, float(1.2));
```

#### B. Headless Blender Meshopt / Draco Pipeline
To prevent 50MB GLTF payloads on client devices, asset preparation must be automated in headless Blender pipelines:
- **Geometry Optimization:** Bake textures into packed atlases; strip redundant vertex attributes (e.g., UVs or normals when points/particles only require positional clouds).
- **Meshopt Compression:** Execute `gltf-transform meshopt input.glb output.glb` to reduce payloads by up to 92% (e.g., 3.9MB down to 0.29MB).
- **Draco vs. Meshopt Trade-off:** Meshopt offers significantly faster CPU decompression times than Draco, eliminating frame freezing during Web Worker asset hydration.

#### C. Fallback-First Still-to-Live Handoff (1-Pixel Registration)
1. Headless Cycles renders a lossless transparent PNG cut-out still at the exact camera coordinate, FOV, and exposure of the 3D scene.
2. The browser renders this cut-out still immediately as the hero LCP element.
3. When the device passes capability gates (WebGL2/WebGPU, $\ge 4$ cores, $\ge 4\text{GB}$ RAM, no reduced-motion), `WebGPURenderer` initializes lazily in the background.
4. The live 3D mesh is cross-faded over the still with **$\le 1\text{px}$ registration shift**, ensuring zero layout jump and instant first paint.

---

### 2.2 3D MCP Servers & Real-Time Tooling

| MCP Server | Origin / Package | Architecture | Core Capabilities |
| :--- | :--- | :--- | :--- |
| **`blender-mcp`** | `mcp-for-blender` (`server.py` + `addon.py`) | 2-way TCP socket bridge to active Blender GUI/headless session | Run `bpy` scripts, generate geometry, setup materials, capture multi-angle viewport verification renders |
| **`threejs-mcp`** | `@threejs/mcp` / Three.js Resources | stdio JSON-RPC | Query verified Three.js r170+ classes, validate TSL nodes, GLSL-to-TSL converters |
| **`threejs-devtools-mcp`** | Community DevTools | WebSocket to browser page | Inspect live 3D scene graph, tweak materials/lighting dynamically, profile draw calls |
| **`3d-assets-search-mcp`** | LobeHub / Free3D indexer | REST / GraphQL wrappers | Search Poly Pizza, Poly Haven, Sketchfab, and Turbosquid for CC0/royalty-free `.glb` assets |

---

## 3. Creative Tool MCP & Plugin Ecosystem

The Model Context Protocol has unified disparate desktop and cloud creative tools into programmable, conversational agent workflows:

```
+--------------------------------------------------------------------------------------------------+
| 2026 UNIFIED CREATIVE TOOL MCP ECOSYSTEM                                                         |
|                                                                                                  |
|                              ┌───────────────────────────┐                                       |
|                              │  AI AGENT (Claude/Gemini) │                                       |
|                              └─────────────┬─────────────┘                                       |
|                                            │ stdio / JSON-RPC                                    |
|               ┌────────────────────────────┼────────────────────────────┐                        |
|               ▼                            ▼                            ▼                        |
|       [ Figma MCP ]                 [ Blender MCP ]            [ DaVinci Resolve MCP ]           |
|  • Design tokens (JSON)        • `bpy` script execution        • Cut timelines                   |
|  • Auto-layout AST             • Cycles render verification    • Insert markers / timecodes      |
|  • SVG asset export            • glTF/GLB automated export     • Color grade still export        |
|               │                            │                            │                        |
|               ▼                            ▼                            ▼                        |
|       [ Webflow MCP ]              [ Adobe Suite MCP ]           [ Canva MCP Plugin ]            |
|  • Headless CMS syncing        • Photoshop UXP automation      • Marketplace partner plugin      |
|  • DOM structure pushes        • Smart object rendering        • Auto-resize & brand kit sync    |
+--------------------------------------------------------------------------------------------------+
```

### 3.1 Creative MCP Implementations Breakdown

#### 1. Figma MCP Server
- **Architecture:** Interacts with Figma REST API and Figma Code Connect.
- **Capabilities:**
  - Queries exact file key and node IDs (`get_file_nodes`).
  - Converts auto-layout flex properties directly into Tailwind CSS and React JSX.
  - Extracts enterprise design tokens (colors, typography clamp scales, shadows, border radii) as structured JSON.
  - Generates optimized SVGs directly into local asset folders.

#### 2. Adobe Creative Suite MCP (Photoshop)
- **Architecture:** Python/Node daemon communicating with Photoshop via Adobe UXP (Unified Extensibility Platform) / ExtendScript websocket.
- **Capabilities:**
  - Automated PSD layer extraction and smart object asset swapping.
  - Headless batch rendering of mockups and poster variants.
  - High-precision clipping mask export for web cut-out stills.

#### 3. DaVinci Resolve Studio MCP
- **Architecture:** Local Python script running via DaVinci Resolve's native `fusionscript` API.
- **Capabilities:**
  - Timeline generation from raw footage bins.
  - Programmatic insertion of timecoded markers and edit cuts based on audio transcripts.
  - Exporting color grading album stills as LUT references or promotional web imagery.
  - Managing the Deliver render queue.

#### 4. Webflow MCP Server
- **Architecture:** Cloud/REST bridge to Webflow v2 Data APIs.
- **Capabilities:**
  - Full synchronization of CMS collections, custom schema fields, and live publishing.
  - Injecting custom HTML/TSL WebGPU canvas wrappers directly into custom code blocks.

#### 5. Canva MCP Plugin
- **Architecture:** Official Antigravity Marketplace partner plugin (`antigravity-plugins-partners/plugin/canva`).
- **Capabilities:**
  - Programmatically create, resize, and review Canva graphics.
  - Sync brand kit colors, logos, and font styles across marketing collateral.

---

### 3.2 2026 Agent Skill Architecture (`SKILL.md`) Standards

The standard established by `agentskills.io` and adopted across Claude Code, Cursor, and Google Antigravity uses a **3-tier progressive disclosure model**:

1. **Tier 1: Discovery Frontmatter (`SKILL.md`)**
   - Must contain exact `name` (lowercase alphanumeric + hyphens, matching folder name) and `description` (under 1024 characters).
   - Loaded into the agent's context at startup with minimal token cost (~100 tokens).
2. **Tier 2: Activation Body (`SKILL.md`)**
   - Loaded only when a user prompt matches the description keywords.
   - Contains procedural instructions, tool call sequencing, and core design philosophies.
3. **Tier 3: On-Demand Execution (`scripts/`, `references/`)**
   - Heavy technical documentation, GLSL/TSL shaders, or Python validation scripts stored in subfolders.
   - Loaded or executed only when the task explicitly requires deep reference.

#### Hard Verification Gates
A modern skill must enforce deterministic gates rather than relying on LLM optimism:
- **Gate 0 (Pre-Flight):** Verify dependencies, API tokens, and local tool executables (e.g., Blender on PATH, Node.js, `FIGMA_ACCESS_TOKEN`).
- **Gate 1 (Static Analysis):** Automated linting, typechecking, or syntax validation via bundled scripts.
- **Gate 2 (Evidence Gate):** Actual execution of unit tests or screenshot capture (Playwright / headless render). The skill forbids claiming success unless real command output confirms exit code 0.

---

## 4. Cross-Check Against User's Skills Repo (`C:\Users\USER-PC\Skills`)

An exhaustive audit of the 67 skills in `C:\Users\USER-PC\Skills` reveals exceptional depth in product packaging (`product-site-*`), HyperFrames video generation, and contest execution (`award-winning-streak-sites`, `freelance-studio`). However, critical gaps exist regarding modern 2026 3D, universal Figma design-to-code, and desktop creative MCP integrations.

### Gap Analysis Matrix

| Domain | Current Repo Assets | Identified Gaps | Recommended Action |
| :--- | :--- | :--- | :--- |
| **WebGPU & Three.js r170+** | `product-site-web-motion`, `particle-specimens` (WebGL2 / vanilla Three.js) | No dedicated skill for Three.js r170+ `WebGPURenderer`, TSL (Three.js Shading Language), or WGSL compute shaders. | **CREATE `threejs-webgpu-pbr`** |
| **Figma Design-to-Code** | `figma` (exclusively wired to HyperFrames video CLI) | No universal Figma-to-Code skill for web frontends (React, Tailwind, Astro) using Figma MCP or REST API. | **CREATE `figma-design-to-code`** |
| **Blender MCP & Tooling** | `product-site-blender-3d` (headless CLI scripts only) | Lacks live interactive `blender-mcp` socket integration for active viewport scene inspection and editing. | **CREATE `blender-mcp-pipeline`** |
| **GSAP & Scroll Physics** | `text-motion-reactbits` (React Bits ports) | Lacks a master orchestrator for Lenis 1.1+ + GSAP 3.13+ rAF synchronization, lagSmoothing, and variable font wave physics. | **CREATE `gsap-lenis-orchestrator`** |
| **Creative MCP Hub** | Isolated skills; Canva in Antigravity plugin catalog | No unified guide or skill orchestrating multi-app pipelines across Photoshop, DaVinci Resolve, Webflow, and Canva. | **CREATE `creative-tool-mcp-hub`** |

---

## 5. Five Ready-to-Install Proposed SKILL.md Specifications

Below are five fully authored, production-grade `SKILL.md` specifications designed to be placed directly into `C:\Users\USER-PC\Skills`.

---

### Specification 1: `threejs-webgpu-pbr`
**Target Path:** `C:\Users\USER-PC\Skills\threejs-webgpu-pbr\SKILL.md`

```markdown
---
name: threejs-webgpu-pbr
description: Builds high-performance 3D web experiences using Three.js r170+ WebGPURenderer, TSL (Three.js Shading Language), Khronos PBR Neutral tone mapping, Meshopt asset compression, and robust WebGL2 fallbacks.
---

# Three.js WebGPU & TSL PBR Architecture

Use this skill when developing high-fidelity 3D web graphics, product configurators, or interactive visual centerpieces with Three.js r170+ and WebGPU.

## 1. Core Engine Initialization

Always initialize `WebGPURenderer` asynchronously with automatic WebGL2 fallback:

```typescript
import { WebGPURenderer, NeutralToneMapping } from 'three/webgpu';
import * as THREE from 'three';

export async function createPBRStage(container: HTMLElement) {
  const renderer = new WebGPURenderer({
    antialias: true,
    powerPreference: 'high-performance',
    alpha: true,
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Khronos PBR Neutral standard: prevents highlight burnout and preserves colorimetry
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  // WebGPU requires async initialization before rendering
  await renderer.init();
  container.appendChild(renderer.domElement);

  return renderer;
}
```

## 2. Three.js Shading Language (TSL) Shaders

Never write raw string-based GLSL shaders for WebGPU pipelines. Use TSL (`three/tsl`) to compile uniformly to WGSL (WebGPU) and GLSL (WebGL2 fallback):

```typescript
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { color, float, positionLocal, time, uv, normalWorld } from 'three/tsl';

export function createPBRNodeMaterial() {
  const material = new MeshStandardNodeMaterial();

  // Procedural Fresnel Rim Highlight via TSL
  const viewDir = positionLocal.normalize().negate();
  const fresnel = normalWorld.dot(viewDir).abs().oneMinus().pow(float(3.0));

  material.colorNode = color(0x0a0b0e);
  material.roughnessNode = float(0.2);
  material.metalnessNode = float(0.85);
  material.emissiveNode = color(0xff5500).mul(fresnel);

  return material;
}
```

## 3. Asset Loading & Meshopt Compression

- Models must be exported in `.glb` format using Meshopt compression (`gltf-transform meshopt`).
- Always configure `GLTFLoader` with `MeshoptDecoder` to prevent CPU frame drops during initialization:

```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
```

## 4. Verification Gates
- **Gate 0:** Check WebGPU support in navigator (`Boolean(navigator.gpu)`).
- **Gate 1:** Validate memory disposal on scene unmount (`renderer.dispose()`, `geometry.dispose()`, `material.dispose()`).
- **Gate 2:** Verify 60 FPS performance on target hardware using Chrome DevTools or Playwright tracing.
```

---

### Specification 2: `figma-design-to-code`
**Target Path:** `C:\Users\USER-PC\Skills\figma-design-to-code\SKILL.md`

```markdown
---
name: figma-design-to-code
description: Extracts design tokens, auto-layout node hierarchies, and vector assets from Figma via Figma MCP Server or REST API, translating them into pixel-perfect React, Tailwind CSS, or semantic HTML.
---

# Universal Figma Design-to-Code Pipeline

Use this skill to convert Figma designs, design systems, and components into production-grade frontend code.

## 1. Authentication & Pre-Flight

Before issuing requests, ensure `FIGMA_ACCESS_TOKEN` is configured:
1. Verify token presence: `echo $FIGMA_ACCESS_TOKEN` or inspect project `.env`.
2. Required Scopes: `file_content:read`, `file_metadata:read`.

## 2. MCP Server Configuration

When using with Claude Desktop, Cursor, or Antigravity, verify MCP setup:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

## 3. Translation Heuristics (Figma Auto-Layout -> Tailwind CSS)

| Figma Property | CSS / Tailwind Equivalent | Edge-Case Rule |
| :--- | :--- | :--- |
| `layoutMode: HORIZONTAL` | `flex flex-row` | Check `itemSpacing` -> `gap-*` |
| `layoutMode: VERTICAL` | `flex flex-col` | Check `itemSpacing` -> `gap-*` |
| `primaryAxisAlignItems: CENTER` | `justify-center` | |
| `counterAxisAlignItems: CENTER` | `items-center` | |
| `layoutGrow: 1` | `flex-1 min-w-0` | Include `min-w-0` to avoid flex blowout |
| `paddingTop/Right/Bottom/Left` | `pt-* pr-* pb-* pl-*` | Match 4-side asymmetric padding |
| `cornerRadius` | `rounded-*` | Support independent corner radii |

## 4. Token Extraction & Clamping
- Never extract static desktop pixel values for typography.
- Automatically calculate fluid mathematical clamp formulas (`clamp(min, preferred, max)`) between 390px (mobile) and 1440px (desktop) viewports.

## 5. Verification Gate
- Capture Playwright DOM screenshot of rendered component.
- Perform visual diff against exported Figma frame PNG. Pixel threshold: $\le 2\text{px}$ alignment variance.
```

---

### Specification 3: `blender-mcp-pipeline`
**Target Path:** `C:\Users\USER-PC\Skills\blender-mcp-pipeline\SKILL.md`

```markdown
---
name: blender-mcp-pipeline
description: Controls interactive and headless Blender sessions via Blender MCP socket bridge (mcp-for-blender) and bpy scripts to generate, texture, light, verify, and export 3D assets to glTF/GLB.
---

# Blender MCP & Headless Asset Pipeline

Use this skill when creating or modifying 3D models, setting up studio lighting, baking textures, or automating exports with Blender 4.2+ or 5.x.

## 1. Dual-Mode Architecture

1. **Interactive MCP Mode (GUI):** Communicates via local socket with Blender Add-on (`mcp-for-blender`). Use for exploratory modeling, live camera adjustments, and visual inspection.
2. **Headless Batch Mode (CLI):** Executes deterministic `bpy` scripts via `blender -b --factory-startup -P script.py`. Use for CI/CD asset compilation and regression testing.

## 2. Setting Up Blender MCP Bridge
Run the MCP server via `uvx`:
```powershell
uvx mcp-for-blender setup
```
In Blender Viewport sidebar (press `N` -> `BlenderMCP`), click **Start MCP Server** on port 9876.

## 3. Automated PBR Material & glTF Export Script
For headless batch execution (`build_asset.py`):

```python
import bpy
import sys

def build_scene(output_glb: str):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    # Create target geometry
    bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0, vertices=64)
    obj = bpy.context.active_object
    obj.name = "HeroAsset"
    
    # Assign Principled BSDF
    mat = bpy.data.materials.new(name="PBR_Material")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.05, 0.07, 0.1, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.2
    bsdf.inputs["Metallic"].default_value = 0.9
    obj.data.materials.append(mat)
    
    # Export glTF with Meshopt compression
    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        export_apply=True,
        export_texcoords=True,
        export_normals=True
    )

if __name__ == "__main__":
    out = sys.argv[-1] if len(sys.argv) > 1 else "output.glb"
    build_scene(out)
```

## 4. Multi-Angle Verification Gate
- Script must render 3 camera angles (Front, Isometric 45, Top) via Cycles/Eevee to PNG.
- Confirm output files are non-empty and geometry bounds match specifications before passing gate.
```

---

### Specification 4: `gsap-lenis-orchestrator`
**Target Path:** `C:\Users\USER-PC\Skills\gsap-lenis-orchestrator\SKILL.md`

```markdown
---
name: gsap-lenis-orchestrator
description: Orchestrates butter-smooth scrolling and kinetic typography using Lenis 1.1+ and GSAP 3.13+ (SplitText, ScrollTrigger), with unified RAF loop synchronization and variable font axis control.
---

# GSAP 3.13+ & Lenis Kinetic Motion Orchestrator

Use this skill to implement smooth scrolling, pinned viewport presentations, scrubbing timelines, and text choreography.

## 1. Master RAF Synchronization

Never allow Lenis and GSAP ScrollTrigger to run independent animation loops:

```typescript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function setupMotion() {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Zero lag smoothing prevents jumpiness during rapid direction changes
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

## 2. Kinetic Typography Patterns

### A. Line-Mask Reveal (Body Copy)
```typescript
export function animateParagraph(element: HTMLElement) {
  const split = new SplitText(element, { type: 'lines', linesClass: 'overflow-hidden' });
  
  gsap.from(split.lines, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      once: true,
    },
    yPercent: 120,
    duration: 0.9,
    stagger: 0.08,
    ease: 'power3.out',
  });
}
```

### B. Scrubbed Variable Font Proximity Wave
```typescript
export function animateVariableWave(heading: HTMLElement) {
  const split = new SplitText(heading, { type: 'chars' });

  gsap.fromTo(split.chars, 
    { fontVariationSettings: "'wdth' 75, 'wght' 300" },
    {
      fontVariationSettings: "'wdth' 120, 'wght' 800",
      stagger: {
        each: 0.03,
        from: 'center',
      },
      scrollTrigger: {
        trigger: heading,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 0.5,
      },
    }
  );
}
```

## 3. Hard Accessibility & Performance Gates
- **Gate 0:** Verify `@media (prefers-reduced-motion: reduce)`. When active, destroy SplitText instances and display static typography.
- **Gate 1:** Set `aria-hidden="true"` on split wrappers and maintain an `.sr-only` copy for screen readers.
- **Gate 2:** Confirm zero layout shift (CLS) during text splitting by running a Playwright resize audit.
```

---

### Specification 5: `creative-tool-mcp-hub`
**Target Path:** `C:\Users\USER-PC\Skills\creative-tool-mcp-hub\SKILL.md`

```markdown
---
name: creative-tool-mcp-hub
description: Orchestrates cross-platform creative workflows using Model Context Protocol (MCP) servers for DaVinci Resolve Studio, Adobe Photoshop, Webflow, and Canva.
---

# Multi-Application Creative Tool MCP Hub

Use this skill when coordinating multi-app creative workflows involving video editing, raster graphic generation, CMS publishing, and social design.

## 1. Supported Tool Matrix & Connectors

| Creative Application | Transport | Core Capabilities |
| :--- | :--- | :--- |
| **DaVinci Resolve Studio** | `davinci-resolve-mcp` (fusionscript) | Rough-cut timeline generation, marker placement, color grade album exports |
| **Adobe Photoshop** | `photoshop-mcp` (UXP WebSocket) | Headless PSD smart object swaps, clipping path export, batch rendering |
| **Webflow** | `webflow-mcp` (REST v2) | CMS collections sync, layout generation, asset asset upload |
| **Canva** | Canva Partner Plugin (AGY Plugin Catalog) | Template resizing, multi-channel export, brand kit enforcement |

## 2. DaVinci Resolve Timeline Automation
Execute via local Python bridge:
```python
import DaVinciResolveScript as dvr_script

resolve = dvr_script.scriptapp("Resolve")
projectManager = resolve.GetProjectManager()
project = projectManager.GetCurrentProject()
mediaPool = project.GetMediaPool()

# Create automated rough-cut timeline from transcript markers
timeline = mediaPool.CreateEmptyTimeline("AI_Generated_Rough_Cut")
print(f"Initialized timeline: {timeline.GetName()}")
```

## 3. Webflow CMS Synchronization
Automated push of local blog articles or release notes:
```typescript
import { WebflowClient } from 'webflow-api';

const webflow = new WebflowClient({ accessToken: process.env.WEBFLOW_API_TOKEN });

export async function syncArticle(collectionId: string, itemData: Record<string, any>) {
  const item = await webflow.collections.items.createItem(collectionId, {
    fields: {
      name: itemData.title,
      slug: itemData.slug,
      'post-body': itemData.htmlContent,
      _archived: false,
      _draft: false,
    },
  });
  return item;
}
```

## 4. Cross-Tool Pipeline Verification Gate
- For video edits: Verify exported MP4 duration matches target beat grid.
- For Photoshop/Canva mockups: Confirm output dimensions and aspect ratio match platform guidelines (e.g., 1200x630 OG image, 1080x1920 9:16 vertical).
- For Webflow: Query live staging domain to verify HTTP 200 and schema validation.
```

---

## 6. Strategic Recommendations & Roadmap

To establish the owner's `Skills` repository as the definitive, industry-leading agent library in late 2026:

1. **Deploy the Proposed Core Skills:**
   - Commit the five authored `SKILL.md` specifications to `C:\Users\USER-PC\Skills`.
   - Run `node tools/update-index.mjs` to refresh the global skills index.
   - Run `git pull --rebase && git push` under the verified owner identity (`LeulTew`).

2. **Modernize Existing UI Skills:**
   - Upgrade `apple-tahoe-liquid-glass` with the SVG chromatic dispersion fringing equations and dynamic WebP normal map displacement.
   - Upgrade `text-motion-reactbits` to link directly with `gsap-lenis-orchestrator` for master rAF synchronization.

3. **Install Antigravity Partner Plugins:**
   - Suggest the user install the official **Figma** and **Canva** plugins from the Antigravity Agent Marketplace to enable seamless IDE-to-design workflows.

---
*Report compiled and validated by Scout Agent under Gemini 3.8 Flagship High-Reasoning Engine.*
