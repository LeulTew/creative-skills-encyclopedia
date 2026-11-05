// Complete Skill Database for Creative Engineering Encyclopedia (2026 Edition)
// Synced with https://github.com/LeulTew/skills

const SKILLS_DATA = [
  {
    id: "frontier-ui-registry-sync",
    name: "frontier-ui-registry-sync",
    category: "AI & Tooling",
    badge: "2026 Auto-Updater",
    description: "Automated checker and self-updating routine for 2026 frontier UI component, motion, and shader registries (21st.dev, Magic UI, Aceternity, React Bits, Fancy Components, Origin UI, Cult UI, ShaderGradient). Runs on project initialization with two-tier token budgeting (fast parallel HEAD probe vs deep differential sync).",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/frontier-ui-registry-sync/SKILL.md",
    codeSnippet: `// 1. Fast-Fingerprint Parallel Probe (<1000ms, 0 LLM tokens):
//    node tools/sync-frontier-registries.mjs --check
// 2. Differential Deep Sync & Self-Optimization:
//    node tools/sync-frontier-registries.mjs --sync --self-optimize
// 3. Automated Re-indexing & Git Push as LeulTew:
//    node tools/update-index.mjs && git push origin main`
  },
  {
    id: "vercel-browser-council",
    name: "vercel-browser-council",
    category: "AI & Tooling",
    badge: "Grill-Me + Sandbox",
    description: "Orchestrates an isolated Vercel Sandbox browser microVM session for visual regression evaluation and automated QA. Initiates an upfront verification protocol for browser sizing, interaction flows, and bespoke rating parameters beyond standard web benchmarks.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/vercel-browser-council/SKILL.md",
    codeSnippet: `// 1. Sandbox Pre-Flight Setup:
// - Viewport Matrix: Desktop (1440px), Tablet (768px), Mobile (390px)
// - Operating Mode: Automated Visual Regression & DOM Audit
// - Verification Rubrics: Brand truth, physical refraction, edge-case stress
// 2. Vercel Sandbox MicroVM:
const sandbox = await Sandbox.create({ ports: [3000] });
await sandbox.exec('agent-browser', ['--url', url, '--dump-dom', '--record-har']);`
  },
  {
    id: "text-motion-reactbits",
    name: "text-motion-reactbits",
    category: "Motion & Scroll",
    badge: "ReactBits Port",
    description: "Award-level kinetic text animation for scroll sites. Ports React Bits (reactbits.dev) and 21st.dev text effects (BlurText, DecryptedText, VariableProximity, TrueFocus) to vanilla TS + GSAP 3.13+ with reduced-motion safety.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/text-motion-reactbits/SKILL.md",
    codeSnippet: `// Vanilla TS / GSAP Port of ReactBits BlurText
const split = new SplitText(element, { type: 'words,chars' });
gsap.from(split.chars, {
  opacity: 0,
  filter: 'blur(6px)',
  y: 12,
  stagger: 0.04,
  ease: 'power3.out'
});`
  },
  {
    id: "animejs-canvas-springs",
    name: "animejs-canvas-springs",
    category: "Motion & Scroll",
    badge: "Canvas Springs",
    description: "High-performance spring physics, SVG path morphing, and multi-emitter canvas particle systems using Anime.js v4+ without polluting the DOM tree.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/text-motion-reactbits/SKILL.md",
    codeSnippet: `import anime from 'animejs';
anime({
  targets: particles,
  x: (p) => p.x + Math.cos(p.angle) * p.speed * 20,
  y: (p) => p.y + Math.sin(p.angle) * p.speed * 20,
  easing: 'easeOutExpo',
  duration: 900
});`
  },
  {
    id: "threejs-webgpu-pbr",
    name: "threejs-webgpu-pbr",
    category: "3D & WebGPU",
    badge: "2026 Frontier",
    description: "Builds high-performance 3D web experiences using Three.js r170+ WebGPURenderer, TSL (Three.js Shading Language), Khronos PBR Neutral tone mapping, Meshopt asset compression, and robust WebGL2 fallbacks.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/threejs-webgpu-pbr/SKILL.md",
    codeSnippet: `import { WebGPURenderer, NeutralToneMapping } from 'three/webgpu';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { color, float, positionLocal, normalWorld } from 'three/tsl';

export async function createPBRStage(container) {
  const renderer = new WebGPURenderer({ antialias: true, alpha: true });
  renderer.toneMapping = NeutralToneMapping;
  await renderer.init();
  container.appendChild(renderer.domElement);
}`
  },
  {
    id: "blender-mcp-pipeline",
    name: "blender-mcp-pipeline",
    category: "3D & Blender",
    badge: "Local Daemon",
    description: "Controls interactive and headless Blender 5.2 sessions via Blender MCP socket bridge (port 9876) and bpy scripts to generate, texture, light, verify, and export 3D assets to glTF/GLB.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/blender-mcp-pipeline/SKILL.md",
    codeSnippet: `import bpy
def build_scene(output_glb):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0)
    bpy.ops.export_scene.gltf(filepath=output_glb, export_format='GLB')`
  },
  {
    id: "apple-tahoe-liquid-glass",
    name: "apple-tahoe-liquid-glass",
    category: "UI & Shaders",
    badge: "Optical SOTA",
    description: "Implements Apple-style liquid glass refracting buttons and UI components using WebP normal displacement maps, SVG filters, and a 10-layer specular reflection shadow stack.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/apple-tahoe-liquid-glass/SKILL.md",
    codeSnippet: `<filter id="glass-refract">
  <feImage href="data:image/webp;base64,..." result="normalMap" />
  <feDisplacementMap in="SourceGraphic" in2="normalMap" scale="0.32" />
</filter>`
  },
  {
    id: "gsap-lenis-orchestrator",
    name: "gsap-lenis-orchestrator",
    category: "Motion & Scroll",
    badge: "Butter-Smooth",
    description: "Orchestrates butter-smooth scrolling and kinetic typography using Lenis 1.1+ and GSAP 3.13+ (SplitText, ScrollTrigger), with unified RAF loop synchronization and variable font axis control.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/gsap-lenis-orchestrator/SKILL.md",
    codeSnippet: `const lenis = new Lenis({ smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);`
  },
  {
    id: "figma-design-to-code",
    name: "figma-design-to-code",
    category: "UI & Shaders",
    badge: "Universal Bridge",
    description: "Extracts design tokens, auto-layout node hierarchies, and vector assets from Figma via Figma MCP Server or REST API, translating them into pixel-perfect React, Tailwind CSS, or semantic HTML.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/figma-design-to-code/SKILL.md",
    codeSnippet: `// Translates Auto-Layout to Tailwind
layoutMode === "HORIZONTAL" ? "flex flex-row" : "flex flex-col";
itemSpacing ? \`gap-\${Math.round(itemSpacing / 4)}\` : "";`
  },
  {
    id: "creative-tool-mcp-hub",
    name: "creative-tool-mcp-hub",
    category: "AI & Tooling",
    badge: "Cross-App MCP",
    description: "Orchestrates cross-application creative pipelines across Figma, Blender, DaVinci Resolve Studio, Adobe Photoshop, Webflow, and Canva via specialized Model Context Protocol (MCP) servers.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/creative-tool-mcp-hub/SKILL.md",
    codeSnippet: `// Cross-App Pipeline:
// Figma Tokens -> Blender 3D Model -> Photoshop Mockup -> Resolve NLE -> Webflow`
  },
  {
    id: "award-winning-streak-sites",
    name: "award-winning-streak-sites",
    category: "UI & Shaders",
    badge: "Owner Streak",
    description: "Master playbook for award-winning websites matching the owner's streak (SunChips, AGI Readiness, MMCY). Covers signature viewports, 3D still-to-live PBR handoffs, script-safe typography, anti-slop gates, and maximum-effort model workflows.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/award-winning-streak-sites/SKILL.md",
    codeSnippet: `// 150-Word Thesis Contract + Zero-Shadows Rule
const LIMITS = { hero: 6, headline: 5, cta: 3 };
// Concentric Radii: inner = outer - padding`
  },
  {
    id: "particle-specimens",
    name: "particle-specimens",
    category: "3D & WebGPU",
    badge: "Procedural",
    description: "Blender-modelled objects that a single Three.js particle cloud morphs between as you scroll, with per-state colour, vertical point sorting, and a dust 'snap'.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/particle-specimens/SKILL.md",
    codeSnippet: `// Crucial Rule: Sort points top-to-bottom along vertical Y axis
points.sort((a, b) => a.y - b.y);
// Upload to vertex attributes aA and aB for coherent fluid morphing`
  },
  {
    id: "product-site-blender-3d",
    name: "product-site-blender-3d",
    category: "3D & Blender",
    badge: "Production CAD",
    description: "Reconstruct a photographed product with reproducible headless Blender, matching still/live lighting, measured poster registration, web exports, and gated physics films.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/product-site-blender-3d/SKILL.md",
    codeSnippet: `blender -b --factory-startup --python-exit-code 1 -P tools/blender/build_bag.py`
  },
  {
    id: "brag",
    name: "brag",
    category: "Video & Motion",
    badge: "Hyperframes Engine",
    description: "Turn the current project website into a short, polished, shareable launch video using Hyperframes. Reads the project code directly — no live URL or screenshots needed.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/brag/SKILL.md",
    codeSnippet: `hyperframes render --format 16:9 --output brag.mp4
hyperframes render --format 9:16 --output tiktok.mp4`
  },
  {
    id: "site-capture-film",
    name: "site-capture-film",
    category: "Video & Motion",
    badge: "Virtual Clock",
    description: "Turn a live, scroll-animated website into a short, frame-perfect launch video (LinkedIn/X/TikTok) using Playwright virtual clock stepping and lossless FFmpeg piping.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/site-capture-film/SKILL.md",
    codeSnippet: `window.requestAnimationFrame = (cb) => setTimeout(() => cb(currentTime), 0);
// Fixed 33.333ms slices with EBU R128 audio mastering`
  },
  {
    id: "brand-theme-tokenizer",
    name: "brand-theme-tokenizer",
    category: "UI & Shaders",
    badge: "Tokens",
    description: "Configures and enforces the premium chromatic dark theme using Obsidian, Deep Zinc, Cobalt, and Ember Glow tokens.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/brand-theme-tokenizer/SKILL.md",
    codeSnippet: `--c-obsidian: #0a0b0e;
--c-deep-zinc: #12141a;
--c-cobalt-rim: #1e293b;
--c-ember-glow: #f97316;`
  }
];

const TEACHING_MODULES = [
  {
    id: "zero-slop-awwwards-standard",
    number: "01",
    title: "The Zero-Slop Awwwards Standard",
    subtitle: "Why generic AI UI fails, the anti-slop ban list, tone step elevation, and concentric radii geometry.",
    tag: "UI Foundations & Anti-Slop",
    readTime: "14 min",
    language: "CSS",
    previewType: "css-box",
    previewHint: "Tweak CSS properties below and click 'Run / Preview' to see live depth styling and anti-slop audit.",
    coreConcept: "Generic AI designs rely on pastel linear gradients on black, floating cards, and gratuitous blur drop-shadows. Award-winning craft creates depth solely through calibrated tone steps, 1px hairlines, and concentric radii.",
    mentorPrompt: "Look at this UI card. What makes it look like generic AI slop? How would you redesign it to feel like an expensive editorial object?",
    studentTarget: "Strip the 20px black drop-shadow, replace it with a 1px cobalt border (#1e293b), set the surface to deep zinc (#12141a), and align the inner radius to outer minus padding (r_inner = r_outer - p).",
    apprenticeInquiry: "When nesting interactive controls inside curved containers, why does setting matching border radii cause corner pinching, and why do blurred drop-shadows fail on dark surfaces?",
    mentorSynthesis: "Depth is achieved through calibrated tone steps (obsidian #0a0b0e to deep zinc #12141a to control #202532) and 1px hairlines (rgba(255,255,255,0.08)), while corner geometry must obey concentric curvature: r_inner = r_outer - padding.",
    keyTakeaways: [
      "Replace blurred black drop-shadows with calibrated tone steps and specular hairlines.",
      "Enforce concentric corner geometry: inner radius equals outer radius minus container padding.",
      "Eliminate pseudo-depth gimmicks, emojis, and double-slash dividers from interface copy."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "Take a look at this card component generated by a default AI prompt. What is your visceral reaction, and what technically betrays it as AI slop?"
      },
      {
        speaker: "Student",
        text: "The first thing that jumps out is the heavy black drop-shadow (box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6)). It creates a dirty, muddy halo around the card. Then there is an aggressive orange outline, double-slashes in the header text, and an emoji inside the pill button."
      },
      {
        speaker: "Teacher",
        text: "Exactly. The model is hallucinating depth by smearing black pixels across the background canvas. Why is that physically incoherent on a dark-themed interface?"
      },
      {
        speaker: "Student",
        text: "In real lighting, when you have a dark surface against a dark environment, depth isn't represented by darkness—it's represented by slight elevation catches. Surfaces closer to the viewer catch more ambient light, raising their tonal value."
      },
      {
        speaker: "Teacher",
        text: "Precisely. In our design system, we establish tone steps: the background sits at obsidian #0a0b0e, the primary card plate elevates to deep zinc #12141a, and inner interactive controls step up to #181b24. How do we define the edge boundary without a loud neon border?"
      },
      {
        speaker: "Student",
        text: "With a 1px hairline rim using low-opacity white or slate: border: 1px solid rgba(255, 255, 255, 0.08). It mimics the razor-thin specular highlight of a beveled glass or titanium edge."
      },
      {
        speaker: "Teacher",
        text: "Perfect. Now look at the inner button nested inside that card. The card has border-radius: 24px and padding: 16px. If the student sets the inner button's border-radius to 24px as well, what visual error occurs?"
      },
      {
        speaker: "Student",
        text: "The corners look distorted and pinched. The gap between the inner button and the card border varies along the curve because the two arcs don't share the same center point. To maintain concentric curvature, the inner radius must equal outer minus padding: 24px - 16px = 8px."
      }
    ],
    codeSnippet: `/* Depth via Tone Steps & Hairline Rims */
:root {
  --surface-ground: #0a0b0e;
  --surface-elevated: #12141a;
  --surface-control: #202532;
  --rim-subtle: rgba(255, 255, 255, 0.08);
  --r-card: 24px;
  --p-card: 16px;
  --r-inner: calc(var(--r-card) - var(--p-card)); /* 8px Concentric */
}

.zero-slop-card {
  background: var(--surface-elevated);
  border: 1px solid var(--rim-subtle);
  border-radius: var(--r-card);
  padding: var(--p-card);
  box-shadow: none; /* BANNED: No blurry drop-shadows */
}

.zero-slop-card .inner-control {
  background: var(--surface-control);
  border: 1px solid var(--rim-subtle);
  border-radius: var(--r-inner); /* Concentric curvature */
}`,
    codeExample: `/* Depth via Tone Steps & Hairline Rims */
border: 1px solid rgba(255, 255, 255, 0.08);
background: #12141a;
border-radius: var(--r-card, 20px);
box-shadow: none;`,
    interactiveChallenge: "Given an outer card with r_outer = 24px and padding = 16px, refactor an AI-generated template by stripping all box-shadows, applying the concentric radius formula to the inner elements, and replacing drop-shadows with calibrated tone steps and hairlines.",
    antiSlopPitfalls: [
      "Adding box-shadow: 0 10px 30px rgba(0,0,0,0.8) on dark surfaces creating murky halos",
      "Using double slashes (//) in metadata headers or section dividers",
      "Embedding emojis in interactive buttons (e.g. '[Icon] Explore')",
      "Using identical nested border radii that pinch and warp container corners"
    ]
  },
  {
    id: "editorial-display-typography",
    number: "02",
    title: "Editorial Display Typography",
    subtitle: "Syne, Clash Display, mathematical fluid clamp scaling, and optical letter-spacing craft.",
    tag: "Typography Math & Limits",
    readTime: "12 min",
    language: "CSS / Clamp",
    previewType: "clamp-typo",
    previewHint: "Drag the viewport slider to test continuous clamp scaling between 390px and 1440px with zero jumps.",
    coreConcept: "Stepped media queries create sudden layout jumps during window resizing. Continuous linear interpolation clamps typography smoothly between 390px mobile and 1440px desktop with zero layout shift.",
    mentorPrompt: "Calculate the font-size clamp formula for a display heading that needs to be 44px (2.75rem) on a 390px iPhone and 96px (6.0rem) on a 1440px desktop.",
    studentTarget: "Calculate slope m = (6.0 - 2.75)/(1440 - 390) = 0.049524 -> 4.952vw, intercept b = 1.543rem. The CSS rule is clamp(2.75rem, 1.543rem + 4.952vw, 6.0rem).",
    apprenticeInquiry: "Why do stepped CSS media queries cause layout jumps and CLS during browser resizing, and what optical adjustments must accompany extreme display sizes?",
    mentorSynthesis: "Continuous linear interpolation y = mx + b inside CSS clamp(2.75rem, 1.543rem + 4.952vw, 6.0rem) eliminates stepped reflow. At 96px, tighten tracking to -0.03em with line-height 0.95; at 11px uppercase labels, loosen tracking to +0.08em.",
    keyTakeaways: [
      "Derive slope and intercept mathematically: clamp(minRem, interceptRem + slopeVw, maxRem).",
      "Tighten letter-spacing on display scales (-0.03em) to counteract optical glyph spreading.",
      "Enforce strict word budgets (hero <= 6 words, headline <= 5 words) to prevent multi-line wraps."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "Why do stepped CSS media queries fail Awwwards-tier visual standards?"
      },
      {
        speaker: "Student",
        text: "Because stepped breakpoints cause typography to suddenly jump in size at arbitrary pixel thresholds like 768px or 1024px. The line breaks shift instantly, text reflows, and during window resizing or tablet rotation, the page stutters."
      },
      {
        speaker: "Teacher",
        text: "Right. How do we make text scale continuously from 390px (mobile) to 1440px (desktop HiDPI) with zero layout snapping?"
      },
      {
        speaker: "Student",
        text: "We derive a continuous linear equation y = mx + b, where x is the viewport width (vw). We solve for the slope m and y-intercept b between the minimum font size at 390px and the maximum font size at 1440px, then wrap it in CSS clamp(min, preferred, max)."
      },
      {
        speaker: "Teacher",
        text: "And when typography scales up to 96px, what optical adjustments must accompany that size?"
      },
      {
        speaker: "Student",
        text: "Negative tracking. Large display glyphs have excess natural white space between them. We must tighten letter-spacing down to -0.03em or -0.04em and reduce line-height to around 0.95. For tiny 11px uppercase metadata labels, we loosen tracking to +0.08em for legibility."
      }
    ],
    codeSnippet: `/* Linear Clamp Interpolation (390px -> 1440px) */
/* Slope m: (96 - 44) / (1440 - 390) = 52 / 1050 = 0.049524 -> 4.952vw */
/* Intercept b: 44 - (0.049524 * 390) = 24.686px -> 1.543rem */
font-size: clamp(2.75rem, 1.543rem + 4.952vw, 6.0rem);
line-height: clamp(0.95, 1.05 - 0.05vw, 1.0);
letter-spacing: clamp(-0.04em, -0.02em - 0.01vw, -0.01em);

/* Word Budgets Enforcement */
const WORD_LIMITS = { hero: 6, headline: 5, cta: 3 };`,
    codeExample: `/* Linear Clamp Interpolation (390px -> 1440px) */
font-size: clamp(2.75rem, 1.543rem + 4.952vw, 6.0rem);
line-height: clamp(0.95, 1.05 - 0.05vw, 1.0);
letter-spacing: clamp(-0.04em, -0.02em - 0.01vw, -0.01em);`,
    interactiveChallenge: "Derive the linear clamp formula for an editorial subhead scaling from 20px (1.25rem) at 390px to 36px (2.25rem) at 1440px, and implement it with responsive negative tracking.",
    antiSlopPitfalls: [
      "Letting a hero headline wrap to 4 or 5 lines on desktop screens",
      "Applying positive tracking to 64px+ display headings",
      "Using stepped media queries that cause Cumulative Layout Shift (CLS)",
      "Using generic Inter or Roboto for large editorial headers instead of Syne or Clash Display"
    ]
  },
  {
    id: "modern-webgl-pbr-shaders",
    number: "03",
    title: "Modern WebGL and 3D PBR Shaders",
    subtitle: "Three.js r170+, Khronos PBR Neutral tone mapping vs ACES burnout, transmission, and physical materials.",
    tag: "WebGPU & PBR Shaders",
    readTime: "16 min",
    language: "TSL / JavaScript",
    previewType: "tsl-shader",
    previewHint: "Inspect simulated TSL node material graph and observe Khronos PBR Neutral highlight preservation.",
    coreConcept: "Three.js r170+ shifts to WebGPU and TSL node materials. Using Khronos PBR Neutral tone mapping eliminates ACES burnout, preserving true brand hues across highlights.",
    mentorPrompt: "Why does standard ACESFilmicToneMapping fail color-critical brand 3D scenes, and what replaces it?",
    studentTarget: "ACES Filmic was tuned for outdoor film cameras and desaturates/shifts saturated reds and oranges to yellow at high intensities. Khronos PBR Neutral (NeutralToneMapping) preserves linear hue fidelity across the entire reflectance curve.",
    apprenticeInquiry: "In digital product rendering, why do bright studio lights turn vibrant brand reds and oranges into washed-out yellows under ACES Filmic, and how does WebGPU change shader architecture?",
    mentorSynthesis: "ACES Filmic was calibrated for outdoor camera sensors with an S-curve that shifts high-luminance chromaticity. Khronos PBR Neutral (NeutralToneMapping) preserves linear hue fidelity across the full dynamic range, complemented by Three.js r170+ TSL node shaders.",
    keyTakeaways: [
      "Standardize on NeutralToneMapping (Khronos PBR Neutral) for exact commercial hue reproduction.",
      "Migrate shader strings to Three.js TSL nodes for seamless WebGPU and WebGL2 cross-compilation.",
      "Eliminate uncalibrated blown-out specular hotspots by tuning roughness and metalness maps."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "You render a 3D model of a luxury product in Three.js using ACESFilmicToneMapping, and your brand director immediately rejects the render. What went wrong?"
      },
      {
        speaker: "Student",
        text: "ACES Filmic crushes subtle grazing specular highlights and shifts brand colors. If the product has a saturated crimson bezel, ACES turns it into a yellowish-orange glare at high intensities because of its camera S-curve tone curve."
      },
      {
        speaker: "Teacher",
        text: "How does the Khronos PBR Neutral tone mapping curve solve this?"
      },
      {
        speaker: "Student",
        text: "The glTF working group specifically engineered Khronos PBR Neutral for digital product rendering. It preserves 100% hue fidelity and saturation across standard dynamic ranges, and only desaturates smoothly towards white at extreme specular overshoots without altering the underlying brand hue."
      },
      {
        speaker: "Teacher",
        text: "What fundamental architectural shift occurred in Three.js r170+ regarding shader authoring?"
      },
      {
        speaker: "Student",
        text: "Three.js r170+ transitions from raw GLSL string shaders to TSL (Three.js Shading Language) node materials. TSL compiles natively to WGSL for WebGPU and falls back automatically to GLSL for WebGL2 with full type safety."
      }
    ],
    codeSnippet: `import { WebGPURenderer, NeutralToneMapping } from 'three/webgpu';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { color, float, normalWorld, viewDirection, dot, pow, max } from 'three/tsl';

export async function createPBRStage(container) {
  const renderer = new WebGPURenderer({ antialias: true, alpha: true });
  renderer.toneMapping = NeutralToneMapping; // BANS ACES Burnout
  renderer.toneMappingExposure = 1.0;
  await renderer.init();
  container.appendChild(renderer.domElement);

  // Procedural TSL Material with Schlick Fresnel Rim
  const mat = new MeshStandardNodeMaterial();
  mat.colorNode = color(0x12141a);
  mat.roughnessNode = float(0.25);
  mat.metalnessNode = float(0.85);

  const NdotV = max(dot(normalWorld, viewDirection), float(0.0));
  const fresnel = pow(float(1.0).sub(NdotV), float(3.0));
  mat.emissiveNode = color(0xf97316).mul(fresnel).mul(float(2.0));
  return { renderer, mat };
}`,
    codeExample: `// Procedural TSL Node Material with Khronos PBR Neutral
import { WebGPURenderer, NeutralToneMapping } from 'three/webgpu';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { color, float, normalWorld, viewDirection, dot, pow, max } from 'three/tsl';

const renderer = new WebGPURenderer({ antialias: true });
renderer.toneMapping = NeutralToneMapping; // BANS ACES Burnout!
await renderer.init();

const material = new MeshStandardNodeMaterial();
material.colorNode = color(0x12141a);
material.roughnessNode = float(0.25);
material.metalnessNode = float(0.85);

// TSL Fresnel Edge Glow Node Graph
const NdotV = max(dot(normalWorld, viewDirection), float(0.0));
const fresnel = pow(float(1.0).sub(NdotV), float(3.0));
material.emissiveNode = color(0xf97316).mul(fresnel).mul(float(2.0));`,
    interactiveChallenge: "Configure a Three.js scene that loads a glTF asset, applies Khronos PBR Neutral tone mapping, and sets up a physical transmission glass dome with zero color desaturation.",
    antiSlopPitfalls: [
      "Using ACESFilmicToneMapping on color-critical brand assets",
      "Using un-toned standard materials with blown-out white specular highlights",
      "Hardcoding legacy GLSL strings without WebGPU/WGSL compatibility in Three.js r170+"
    ]
  },
  {
    id: "procedural-raymarching-sdfs",
    number: "04",
    title: "Procedural Raymarching and Signed Distance Fields",
    subtitle: "Analytical SDF primitives, polynomial smooth minimum, soft shadows, and adaptive resolution scaling.",
    tag: "Raymarching & Shaders",
    readTime: "18 min",
    language: "GLSL / Shaders",
    previewType: "liquid-glass",
    previewHint: "Simulate optical displacement map and chromatic fringe offset live on the test lens.",
    coreConcept: "Raymarching Signed Distance Fields (SDFs) renders volumetric mathematical surfaces in screen-space fragment shaders with infinite detail, organic smooth unions, and zero polygon overhead.",
    mentorPrompt: "How does raymarching step through a scene without overshooting, and how do we blend two shapes like liquid mercury?",
    studentTarget: "The Signed Distance Function (SDF) returns the shortest distance to any surface, allowing the ray to safely march by that distance d. Polynomial smin(d1, d2, k) blends shapes smoothly without polygon seams.",
    apprenticeInquiry: "How can a screen-space fragment shader march rays into a 3D scene without expensive vertex meshes, and how does polynomial smooth minimum prevent hard intersection seams?",
    mentorSynthesis: "Sphere tracing evaluates the Signed Distance Field (SDF) at the ray tip to determine the safe step distance d without collisions. The polynomial smin(d1, d2, k) function smoothly interpolates distances within radius k, creating seamless liquid blends.",
    keyTakeaways: [
      "SDFs define geometry mathematically via minimum Euclidean distance to boundaries.",
      "Sphere tracing bounds ray progression dynamically, achieving infinite procedural resolution.",
      "Smooth minimum (smin) computes organically fused surfaces without topological stitching."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "What is the fundamental difference between standard rasterized polygon rendering and raymarching?"
      },
      {
        speaker: "Student",
        text: "In rasterization, the GPU projects 3D triangle vertices onto the 2D screen. In raymarching, we draw a full-screen quad and fire a virtual camera ray per pixel, marching forward iteratively until we intersect an implicit mathematical surface."
      },
      {
        speaker: "Teacher",
        text: "How does the ray know how far it can safely step without clipping through objects?"
      },
      {
        speaker: "Student",
        text: "That is the magic of the Signed Distance Function (SDF). At any point p in space, SDF(p) returns the exact Euclidean distance to the nearest surface. Therefore, the ray marches forward by distance d = SDF(p) in a single step without intersecting geometry."
      },
      {
        speaker: "Teacher",
        text: "How do we combine two separate shapes so they meld together like liquid mercury?"
      },
      {
        speaker: "Student",
        text: "We use the polynomial smooth minimum (smin). Instead of min(d1, d2) which creates a hard crease, smin computes a smooth interpolation factor h based on blend radius k: h = max(k - abs(d1 - d2), 0) / k, and smin = min(d1, d2) - h^3 * k * (1/6)."
      }
    ],
    codeSnippet: `// Inigo Quilez Polynomial Smooth Minimum (smin)
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

// Raymarching Map Function with Soft Shadows
float map(vec3 p) {
  float d1 = length(p - vec3(0.0, sin(u_time) * 0.3, 0.0)) - 0.8;
  vec3 q = abs(p - vec3(0.0, -0.6, 0.0)) - vec3(0.9, 0.25, 0.9);
  float d2 = length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - 0.15;
  return smin(d1, d2, 0.45); // Liquid organic blend
}`,
    codeExample: `<feDisplacementMap in="SourceGraphic" in2="normalMap" scale="12" xChannelSelector="R" yChannelSelector="G" />
<!-- Chromatic RGB Fringe Split -->
<feOffset in="displaced" dx="1.5" dy="0" result="redShift" />
<feOffset in="displaced" dx="-1.5" dy="0" result="blueShift" />`,
    interactiveChallenge: "Implement a raymarched organic specimen shader that smoothly blends a pulsating sphere and a rounded box using polynomial smin with dynamic ambient occlusion.",
    antiSlopPitfalls: [
      "Unbounded raymarching step loops causing mobile GPUs to thermal throttle",
      "Using finite difference normals without normalizing the resultant vector",
      "Omitting bounding volume guards, wasting shader cycles in empty space"
    ]
  },
  {
    id: "headless-blender-optix-gpu",
    number: "05",
    title: "Headless Blender 5.2 and OptiX Cycles GPU",
    subtitle: "Automated CLI invocation, parametric bpy scripts, Cycles OptiX hardware acceleration, and Meshopt glTF baking.",
    tag: "Blender 5.2 & OptiX GPU",
    readTime: "15 min",
    language: "Python / bpy",
    previewType: "blender-mcp",
    previewHint: "Simulate headless CLI invocation and OptiX hardware ray-tracing parameters.",
    coreConcept: "Headless Blender 5.2 execution via command line with Cycles OptiX GPU acceleration makes 3D generation completely programmatic, reproducible, and verifiable for web production.",
    mentorPrompt: "How do we execute Blender headlessly on an RTX 5070 Ti, enforce hardware-accelerated OptiX rendering in Python, and guarantee failures halt CI?",
    studentTarget: "Run blender -b --factory-startup --python-exit-code 1 -P script.py. In Python, set cycles_prefs.compute_device_type = 'OPTIX', enable GPU devices, and set scene.cycles.denoiser = 'OPTIX'.",
    apprenticeInquiry: "What prevents headless Blender scripts from silently failing in automated pipelines, and how do we programmatically force Cycles to utilize RTX GPU hardware over CPU fallbacks?",
    mentorSynthesis: "Pass '--python-exit-code 1' to guarantee non-zero exit on unhandled script exceptions. In bpy, query Cycles preferences to activate OPTIX device types, verify CUDA/OptiX device flags, and set scene.cycles.denoiser to OPTIX.",
    keyTakeaways: [
      "Always run Blender headlessly with --factory-startup and --python-exit-code 1.",
      "Explicitly bind GPU compute devices in bpy.context.preferences to prevent silent CPU throttling.",
      "Leverage hardware OptiX temporal denoising for rapid, clean frame production in CI."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "Why do we execute Blender through the command line (blender -b) instead of opening the user interface?"
      },
      {
        speaker: "Student",
        text: "Headless execution makes 3D generation completely programmatic, reproducible, and verifiable. An agent or CI runner can generate parametric meshes, assign PBR materials, render verification stills, and export compressed glTF files without human intervention."
      },
      {
        speaker: "Teacher",
        text: "On our workstation with an NVIDIA GeForce RTX 5070 Ti, how do we guarantee Blender uses OptiX ray-tracing cores rather than falling back to CPU?"
      },
      {
        speaker: "Student",
        text: "In Python bpy, we access Cycles user preferences, query compute devices, set the compute device type to 'OPTIX', enable the RTX 5070 Ti GPU device, and explicitly set scene.cycles.device = 'GPU' and scene.cycles.denoiser = 'OPTIX'."
      },
      {
        speaker: "Teacher",
        text: "What CLI flag ensures that if our Python script throws an exception, the entire CI pipeline halts immediately?"
      },
      {
        speaker: "Student",
        text: "The --python-exit-code 1 flag. If any exception occurs inside our script, Blender terminates with exit code 1 instead of continuing silently."
      }
    ],
    codeSnippet: `# Headless Blender 5.2 OptiX Asset Generator
import bpy

def configure_optix():
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'OPTIX'
    prefs.get_devices()
    for d in prefs.devices:
        if d.type == 'OPTIX':
            d.use = True
    scene.cycles.device = 'GPU'
    scene.cycles.denoiser = 'OPTIX'

configure_optix()
bpy.ops.mesh.primitive_cylinder_add(radius=1.2, depth=0.4, vertices=64)
bpy.ops.export_scene.gltf(filepath="pedestal.glb", export_format='GLB')`,
    codeExample: `import bpy
def build_scene(output_glb):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0)
    bpy.ops.export_scene.gltf(filepath=output_glb, export_format='GLB')`,
    interactiveChallenge: "Write a headless bpy script that instantiates a high-precision rounded chamfered pedestal, applies an Obsidian metallic material, and exports both a 4-view render sheet and a Meshopt glTF.",
    antiSlopPitfalls: [
      "Omitting --factory-startup, letting local add-on conflicts break execution",
      "Forgetting --python-exit-code 1, allowing failed scripts to exit with code 0",
      "Exporting raw 40MB meshes with 1M polygons directly to web projects"
    ]
  },
  {
    id: "generative-3d-rigging-pipelines",
    number: "06",
    title: "Generative 3D Mesh Creation and Rigging Pipelines",
    subtitle: "Tripo, Meshy, Rodin, Mixamo 5-point rig, Reallusion AccuRig, and Blender Rigify retargeting.",
    tag: "3D Rigging & Retopo",
    readTime: "17 min",
    language: "Python / 3D Pipeline",
    previewType: "retopo-3d",
    previewHint: "Examine the 5-stage transformation pipeline from raw AI generation to interactive web character.",
    coreConcept: "Raw generative 3D models are dense triangular soup. Production pipelines take raw meshes through Quadriflow retopology, normal map baking, and auto-rigging with Mixamo, AccuRig, or Rigify.",
    mentorPrompt: "Why can't raw generative AI 3D meshes be used directly in WebGL, and what is the 5-step production pipeline to fix them?",
    studentTarget: "Raw generative meshes have 300k+ non-manifold triangles and baked lighting. The 5 steps: 1. Quadriflow retopology (15k quads) 2. Normal baking 3. Auto-rigging (AccuRig/Mixamo) 4. Mocap retargeting 5. Meshopt GLB export.",
    apprenticeInquiry: "When text-to-3D tools output dense meshes with 300,000 irregular triangles and baked shadows, what automated steps convert them into real-time animatable WebGL assets?",
    mentorSynthesis: "Execute the 5-step pipeline: (1) Quadriflow retopology to ~15,000 quads, (2) High-to-low normal map baking, (3) Automated skeletal rigging via AccuRig/Mixamo, (4) Motion capture retargeting, and (5) Meshopt-compressed GLB export.",
    keyTakeaways: [
      "Never ship raw generative triangular meshes directly to client-side WebGL.",
      "Retopologize to clean quad topology before attempting skinning or bone weighting.",
      "Compress geometry with Meshopt and KTX2 textures to achieve sub-second load times."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "An AI tool gives you a stunning 3D character mesh from a text prompt. Why can't you drop it directly into your Three.js web app?"
      },
      {
        speaker: "Student",
        text: "Because raw generative meshes are dense triangular messes—often 200k to 500k triangles with non-manifold topology, holes, and zero skeletal structure. They have baked shadow textures, and they cannot be animated because they have no bones or skin weights."
      },
      {
        speaker: "Teacher",
        text: "Walk me through the pipeline to take that raw asset to an interactive 60 FPS character on the web."
      },
      {
        speaker: "Student",
        text: "Step 1: Clean the mesh with Quadriflow retopology in Blender down to 15k clean quads. Step 2: Bake high-poly details into a normal map. Step 3: Run the mesh through AccuRig or Mixamo to bind the skeleton. Step 4: Retarget animation clips. Step 5: Export to glTF with compressed skeletal weights."
      },
      {
        speaker: "Teacher",
        text: "When choosing between Mixamo and Rigify, what is the deciding factor?"
      },
      {
        speaker: "Student",
        text: "Mixamo is unbeatable for fast, cloud-based humanoid mocap with zero setup. Rigify is necessary when we need custom control mechanics, non-humanoid appendages, or mechanical IK constraints."
      }
    ],
    codeSnippet: `# Automated Quadriflow Retopology & Metarig Binding
import bpy

bpy.ops.wm.obj_import(filepath="raw_ai_mesh.obj")
mesh_obj = bpy.context.selected_objects[0]

# Quadriflow Retopology to clean 15,000 quads
bpy.ops.mesh.quadriflow_remesh(use_preserve_sharp=True, target_faces=15000)

# Add Basic Humanoid Armature and Bind
bpy.ops.object.armature_basic_human_metarig_add()
metarig = bpy.context.active_object
mesh_obj.select_set(True)
bpy.ops.object.parent_set(type='ARMATURE_AUTO')

bpy.ops.export_scene.gltf(filepath="character_rigged.glb", export_skins=True)`,
    codeExample: `// 5-Stage SOTA Generative 3D Asset Pipeline
const PIPELINE = [
  "1. Raw Generation (Tripo / Rodin / Hunyuan)",
  "2. Blender Quadriflow Retopology (15k quads)",
  "3. Skeletal Auto-Rigging (AccuRig / Mixamo)",
  "4. NLA Action Strip Retargeting (Idle/Walk)",
  "5. Meshopt glTF Compression (<= 2MB)"
];`,
    interactiveChallenge: "Map the complete 5-stage transformation pipeline of a raw AI generation into an interactive Three.js character with walking and idle animation cycles.",
    antiSlopPitfalls: [
      "Shipping raw triangular soup with 400k+ polygons to client web browsers",
      "Rigging meshes with uncleaned internal geometry, causing tearing during bone rotation",
      "Retaining baked directional shadows in diffuse texture maps"
    ]
  },
  {
    id: "kinetic-typography-reactbits",
    number: "07",
    title: "Kinetic Typography and React Bits",
    subtitle: "BlurText, DecryptedText, VariableProximity, spring physics, and accessibility dual-trees.",
    tag: "Kinetic Text & Motion",
    readTime: "13 min",
    language: "JavaScript / GSAP",
    previewType: "gsap-raf",
    previewHint: "Simulate lagSmoothing(0) zero-jump RAF loop with live ticker frame stepping.",
    coreConcept: "Porting React Bits primitives (BlurText, DecryptedText) to vanilla TS/GSAP creates award-level kinetic motion, while an accessibility dual-tree (.sr-only) ensures screen-reader compatibility.",
    mentorPrompt: "When animating text character-by-character with BlurText or DecryptedText, what happens to screen readers, and how do we solve it?",
    studentTarget: "Screen readers read individual letters disjointedly. We solve this by building an accessibility dual-tree: a hidden .sr-only container with the full sentence, and aria-hidden='true' on the animated character spans.",
    apprenticeInquiry: "When splitting headlines into animated span tags, why do screen readers announce each letter as an isolated utterance, and how do we preserve perfect accessibility?",
    mentorSynthesis: "Construct an accessibility dual-tree: render an off-screen container with the full sentence marked .sr-only, and apply aria-hidden='true' to the animated visual container. For BlurText, coordinate opacity, translateY, and filter blur concurrently.",
    keyTakeaways: [
      "Always mirror kinetic text animations with an accessible .sr-only text alternative.",
      "Mark character-split DOM nodes with aria-hidden='true' to prevent voice synthesizer disruption.",
      "Combine spatial translation with optical blur filters to create weightless kinetic motion."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "When you break a headline into individual character span tags to animate with BlurText, what disaster happens to a screen reader?"
      },
      {
        speaker: "Student",
        text: "Apple VoiceOver and other screen readers treat each span as an isolated word or letter. Instead of reading 'Enterprise Solutions', the synthesizer reads: 'E... n... t... e... r... p... r... i... s... e'. It is completely unintelligible."
      },
      {
        speaker: "Teacher",
        text: "How do we achieve award-winning character-by-character animations while maintaining a 100% accessible audit score?"
      },
      {
        speaker: "Student",
        text: "We build an accessibility dual-tree. We place the complete semantic sentence in an element with class .sr-only (visually hidden from sighted users, fully read by screen readers). Then, we wrap our animated character spans in a sibling container marked with aria-hidden='true'."
      },
      {
        speaker: "Teacher",
        text: "What makes BlurText look organic rather than mechanical?"
      },
      {
        speaker: "Student",
        text: "In BlurText, we animate three properties simultaneously: opacity (0 to 1), transform: translateY(16px) to 0, and filter: blur(8px) to 0. By staggering each character by 30-40ms with a power3.out curve, the letters seem to materialize out of ambient light."
      }
    ],
    codeSnippet: `// Accessible BlurText Engine with Dual-Tree
export function renderBlurText(container, text) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    container.textContent = text;
    return;
  }

  // Accessibility Dual-Tree
  container.innerHTML = \`
    <span class="sr-only">\${text}</span>
    <span aria-hidden="true" class="visual-chars"></span>
  \`;

  const visualTree = container.querySelector('.visual-chars');
  for (const char of text) {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    visualTree.appendChild(span);
  }

  gsap.fromTo(visualTree.children, 
    { opacity: 0, y: 14, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.035, ease: 'power3.out' }
  );
}`,
    codeExample: `// Unified RAF Synchronization Loop
const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0); // Prevents catastrophic catch-up jumps`,
    interactiveChallenge: "Implement an accessible DecryptedText header that scrambles for 800ms before snapping to the final brand headline, with automatic immediate reveal if prefers-reduced-motion is active.",
    antiSlopPitfalls: [
      "Omitting aria-hidden='true' on character spans, destroying screen-reader accessibility",
      "Ignoring prefers-reduced-motion media query",
      "Applying blur animations without GPU acceleration (will-change: transform, filter)"
    ]
  },
  {
    id: "frontier-registries-precision-microui",
    number: "08",
    title: "Frontier Registries and Precision Micro-UI",
    subtitle: "Magic UI AnimatedBeam, Spotlight Bento, Hover.dev 3D Tilt, and NumberFlow odometer precision.",
    tag: "Micro-UI & Registries",
    readTime: "15 min",
    language: "JavaScript / Micro-UI",
    previewType: "thesis-contract",
    previewHint: "Test live word count budgets against the strict 6 / 5 / 3 limits in real time.",
    coreConcept: "Modern micro-registries (Magic UI, 21st.dev, Aceternity) offer code-first primitives. Gyroscopic 3D Tilt and Spotlight Bento grids provide tactile, hardware-accelerated micro-interactions.",
    mentorPrompt: "How does an interactive Spotlight Bento Grid track pointer coordinates, and how do we prevent animated numbers from jittering horizontally?",
    studentTarget: "Calculate mouse coordinates relative to the card's bounding box and set CSS custom properties --mouse-x and --mouse-y for a masked radial gradient. Enforce font-variant-numeric: tabular-nums to lock numeral widths.",
    apprenticeInquiry: "Why do proportional font numerals cause layout jittering during number tick animations, and how do we compute spotlight coordinates without causing reflow?",
    mentorSynthesis: "Enforce font-variant-numeric: tabular-nums to lock fixed character widths on numerical readouts. For spotlight cards, calculate pointer offsets relative to getBoundingClientRect() and write --mouse-x and --mouse-y custom properties directly to the card style.",
    keyTakeaways: [
      "Apply tabular-nums to all dynamic metrics, timers, and telemetry counters.",
      "Use CSS custom properties updated via pointermove to isolate lighting calculations from layout.",
      "Adopt micro-registries (Magic UI, 21st.dev) to keep dependencies decoupled and audited."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "Why are top creative engineering studios shifting away from massive component packages toward open component registries like 21st.dev and Magic UI?"
      },
      {
        speaker: "Student",
        text: "Monolithic packages impose opinionated design tokens and heavy bundle overhead. Micro-registries provide isolated, transparent primitives that you paste directly into your codebase. You own the code and tailor the tokens to your anti-slop system."
      },
      {
        speaker: "Teacher",
        text: "How does an interactive Spotlight Bento Grid track the user's cursor across cards?"
      },
      {
        speaker: "Student",
        text: "Each card listens to pointer movement. We calculate the cursor's coordinates relative to the card's bounding box: x = clientX - rect.left, y = clientY - rect.top. We assign these coordinates to CSS custom properties --mouse-x and --mouse-y, illuminating a 1px hairline border via a masked radial gradient."
      },
      {
        speaker: "Teacher",
        text: "What causes live telemetry counters to wobble horizontally, and how do we fix it?"
      },
      {
        speaker: "Student",
        text: "Proportional fonts allocate different widths to different numbers. We enforce font-variant-numeric: tabular-nums and use vertical rolling digit cylinders like NumberFlow so numbers roll vertically without horizontal jitter."
      }
    ],
    codeSnippet: `// 3D Gyroscopic Tilt & Spotlight Controller
cardElement.addEventListener('mousemove', (e) => {
  const rect = cardElement.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  cardElement.style.setProperty('--mouse-x', \`\${x}px\`);
  cardElement.style.setProperty('--mouse-y', \`\${y}px\`);

  const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 12;
  const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

  cardElement.style.transform = \`
    perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) scale3d(1.02, 1.02, 1.02)
  \`;
});`,
    codeExample: `const WORD_LIMITS = {
  hero: 6,       // 'Physical Precision Over Generative Slop'
  head: 5,       // 'The Anti-Slop Mindset'
  cta: 3         // 'Launch Live Audit'
};

function validateBudget(text, limit) {
  const count = text.trim().split(/\\s+/).filter(Boolean).length;
  return { count, valid: count <= limit, limit };
}`,
    interactiveChallenge: "Construct a high-precision telemetry bento card featuring a smooth 3D tilt tracking effect, an ambient mouse spotlight, and an accessible KPI counter with tabular figures.",
    antiSlopPitfalls: [
      "Calling getBoundingClientRect() on every single mousemove instead of caching bounds",
      "Using excessive tilt angles (e.g. 35 degrees) that cause disorientation",
      "Omitting tabular-nums on live telemetry, causing layout wobble"
    ]
  },
  {
    id: "theo-closed-loop-jester-protocol",
    number: "09",
    title: "Closed-Loop Visual Feedback and Adversarial Jester Protocol",
    subtitle: "Theo Browne's visual hill-climbing, Vercel Sandbox microVMs, perceptual diffing, and eliminating cooperative score inflation.",
    tag: "Visual Hill-Climbing & Jester",
    readTime: "16 min",
    language: "Playwright / Vision AI",
    previewType: "gauntlet-audit",
    previewHint: "Live dual-model scorecard evaluator across all 6 production vectors.",
    coreConcept: "Theo Browne's closed-loop visual feedback renders code in headless browser microVMs, scores screenshots with vision models, and employs an adversarial Jester critic with hard veto power to eliminate score inflation.",
    mentorPrompt: "Why do AI coding agents fail at UI when operating open-loop, and how does the Adversarial Jester protocol eliminate cooperative model bias?",
    studentTarget: "Open-loop agents generate text without seeing rendered pixels, missing clipping and layout shifts. The Jester acts as a contrarian critic whose sole measure of success is catching flaws, holding veto power over release.",
    apprenticeInquiry: "When LLMs generate syntactically valid code that produces visual clipping or misaligned elements, why do peer AI reviewers consistently give inflated 10/10 scores?",
    mentorSynthesis: "Visionless agents operate open-loop without sensory verification. Cooperative models suffer from agreeable sycophancy. The Adversarial Jester protocol introduces a contrarian agent incentivized exclusively to discover visual regressions and wields absolute release veto.",
    keyTakeaways: [
      "Close the sensory loop by rendering viewports in headless microVMs and capturing real pixels.",
      "Deploy an adversarial critic with veto authority to counteract cooperative score inflation.",
      "Hold releases to dual-viewport (390px and 1440px) parity before passing production gates."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "Why do AI models consistently write code that compiles and passes unit tests, but looks broken or amateurish in the browser?"
      },
      {
        speaker: "Student",
        text: "Because the LLM operates open-loop. It reads and writes text and AST representations, but it has no ocular feedback. It cannot see that a flex container caused an image to collapse to 0px height or that text is overflowing the card."
      },
      {
        speaker: "Teacher",
        text: "Theo Browne demonstrated that closing the loop with screenshots transforms agent capability. But what happens when you ask another LLM to review the screenshot?"
      },
      {
        speaker: "Student",
        text: "Cooperative score inflation. The reviewer model tends to be agreeable and complimentary, scoring mediocre or broken layouts at 9/10 or 10/10."
      },
      {
        speaker: "Teacher",
        text: "How does the Adversarial Jester protocol shatter that false consensus?"
      },
      {
        speaker: "Student",
        text: "The Jester is explicitly prompted with a skeptical, adversarial persona whose sole objective is finding visual flaws, bad contrast, alignment errors, and generic AI cliches. If the Jester finds a single unhandled edge case or clipping artifact, release is blocked."
      }
    ],
    codeSnippet: `// Playwright Closed-Loop Visual Verifier
import { chromium } from 'playwright';

export async function verifyDualViewportParity(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test 390px Mobile Safari
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'networkidle' });
  const hasMobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  // Test 1440px Desktop HiDPI
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'audit_desktop.png' });
  await browser.close();

  if (hasMobileOverflow) throw new Error("JESTER VETO: 390px mobile viewport has horizontal overflow!");
}`,
    codeExample: `// Gauntlet Verification Protocol
const VECTORS = [
  "150-Word Thesis Contract",
  "Poster Typography & Script Safe",
  "GSAP + Lenis 60 FPS Sync",
  "Zero-Shadows Tone Step Depth",
  "390px / 1440px Parity Pre-Flight",
  "Zero-Console-Error & Memory Clean"
];

// All independent evaluators must verify 10/10 on identical commit SHA`,
    interactiveChallenge: "Write an automated visual hill-climbing verification script that captures mobile (390px) and desktop (1440px) viewports, compares them against a baseline, and triggers a surgical patch if layout shift or clipping is detected.",
    antiSlopPitfalls: [
      "Letting cooperative models self-approve without visual proof",
      "Testing only desktop 1440px while mobile 390px is broken",
      "Transmitting uncompressed 4K full-page screenshots into prompt context instead of localized crops"
    ]
  },
  {
    id: "adobe-nle-video-automation",
    number: "10",
    title: "Adobe Creative Cloud and NLE Video Automation",
    subtitle: "ExtendScript jsx, Photoshop UXP MCP, Premiere Pro Auto-Editor, and DaVinci Resolve fusionscript.",
    tag: "NLE Automation & Virtual Clock",
    readTime: "16 min",
    language: "Python / XML / JSX",
    previewType: "virtual-clock",
    previewHint: "Step exact 33.333ms frame slices and monitor simulated EBU R128 -14 LUFS audio limits.",
    coreConcept: "Deterministic video rendering steps frames programmatically using Virtual Clock, while FCP7 XML sequences, Photoshop ExtendScript/UXP, and DaVinci fusionscript automate non-destructive video assembly.",
    mentorPrompt: "Why does standard browser screen recording stutter on WebGL sites, and how does the Virtual Clock with FCP7 XML interchange solve this?",
    studentTarget: "Screen recorders rely on wall-clock time and drop frames during GPU spikes. The Virtual Clock steps time deterministically by 33.333ms per frame. FCP7 XML allows Python scripts to assemble fully editable timelines in Premiere and Resolve.",
    apprenticeInquiry: "Why do real-time screen recorders stutter during complex WebGL scenes, and how do we bridge browser animations into professional video editors like Premiere or DaVinci Resolve?",
    mentorSynthesis: "Hardware contention drops frames when recording in real time. The Virtual Clock hijacks requestAnimationFrame and advances deterministically by exactly 33.333ms per frame. Exporting FCP7 XML allows automated python scripts to build non-destructive timeline sequences.",
    keyTakeaways: [
      "Render complex canvas animations with a deterministic Virtual Clock to eliminate dropped frames.",
      "Use FCP7 XML interchange for programmatic timeline creation in DaVinci Resolve and Premiere.",
      "Master audio beds to the EBU R128 (-14 to -16 LUFS) broadcast standard for consistent clarity."
],
    dialogueScript: [
      {
        speaker: "Teacher",
        text: "Why do high-end marketing teams refuse to use raw screen captures for promotional launch films?"
      },
      {
        speaker: "Student",
        text: "Standard screen recorders record against the computer's real-time wall clock. When the GPU handles heavy Three.js shaders or 4K textures, it drops frames. The video permanently captures that stutter at 18 or 24 FPS instead of a silky 60 FPS."
      },
      {
        speaker: "Teacher",
        text: "How does a programmatic Virtual Clock solve that problem?"
      },
      {
        speaker: "Student",
        text: "A Virtual Clock intercepts requestAnimationFrame and Date.now(). Instead of running in real time, it steps time forward in fixed, deterministic slices (e.g. exactly 16.666ms for 60 FPS). It renders each frame to a buffer only after the GPU finishes drawing, guaranteeing 100% frame-perfect video."
      },
      {
        speaker: "Teacher",
        text: "What is FCP7 XML (xmeml), and why is it our weapon of choice for timeline automation?"
      },
      {
        speaker: "Student",
        text: "Final Cut Pro 7 XML is the universal open standard for non-linear video editors. Adobe Premiere Pro, DaVinci Resolve, and Final Cut can all import it. A simple Python script can parse footage, generate cut points, layout multi-track audio, and output an XML file that opens instantly as a fully editable timeline."
      },
      {
        speaker: "Teacher",
        text: "What broadcast standard governs our audio mastering?"
      },
      {
        speaker: "Student",
        text: "The EBU R128 / ITU-R BS.1770 loudness standard. We master integrated audio to -14.0 LUFS with a true-peak ceiling of -1.0 dBTP using lookahead peak limiting to prevent distortion across streaming platforms."
      }
    ],
    codeSnippet: `# Automated FCP7 XML Timeline Generator for Premiere & Resolve
import xml.etree.ElementTree as ET

def generate_fcp7_xml(clip_path, duration_frames, output_xml):
    xmeml = ET.Element('xmeml', version="4")
    seq = ET.SubElement(xmeml, 'sequence')
    ET.SubElement(seq, 'name').text = "Automated_Master_Sequence"
    ET.SubElement(seq, 'duration').text = str(duration_frames)
    
    rate = ET.SubElement(seq, 'rate')
    ET.SubElement(rate, 'timebase').text = "60"
    
    media = ET.SubElement(seq, 'media')
    video = ET.SubElement(media, 'video')
    track = ET.SubElement(video, 'track')
    clipitem = ET.SubElement(track, 'clipitem', id="clipitem-1")
    ET.SubElement(clipitem, 'duration').text = str(duration_frames)
    
    tree = ET.ElementTree(xmeml)
    tree.write(output_xml, encoding='utf-8', xml_declaration=True)

generate_fcp7_xml("C:/Media/capture.mp4", 360, "timeline.xml")`,
    codeExample: `// Deterministic Frame-Stepping Interceptor
window.__currentTime = 0;
window.requestAnimationFrame = (cb) => {
  return setTimeout(() => cb(window.__currentTime), 0);
};

// Render Loop (Fixed 30.000 FPS / 33.333ms steps)
for (let frame = 0; frame < 180; frame++) {
  window.__currentTime = frame * (1000 / 30);
  await renderFrame(frame);
}`,
    interactiveChallenge: "Generate an automated video assembly script that processes video clips, cuts silent pauses, exports an FCP7 XML sequence, and normalizes audio to -14 LUFS.",
    antiSlopPitfalls: [
      "Using wall-clock screen recordings that drop frames during GPU spikes",
      "Exporting audio peaking above -1.0 dBTP, causing crackling and platform auto-attenuation",
      "Writing fragile scripts that attempt to patch proprietary binary project files instead of open XML/script interfaces"
    ]
  }
];

// Universal browser & module export
if (typeof window !== 'undefined') {
  window.SKILLS_DATA = SKILLS_DATA;
  window.TEACHING_MODULES = TEACHING_MODULES;
}

// ES Module export for bundlers and import maps
export { SKILLS_DATA, TEACHING_MODULES };

// CommonJS export for Node/testing environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SKILLS_DATA, TEACHING_MODULES };
}
