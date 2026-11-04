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
    description: "Orchestrates an isolated Vercel Sandbox browser microVM session evaluated by a 3-6 agent council (builders or pragmatic reviewers). Initiates an upfront Grilling protocol asking the user for council sizing, role assignment, and bespoke rating parameters beyond standard web benchmarks.",
    githubUrl: "https://github.com/LeulTew/skills/blob/main/vercel-browser-council/SKILL.md",
    codeSnippet: `// 1. Grill-Me Pre-Flight Interview:
// - Council Size: 3 to 6 agents (Gemini 3.8 Flash High, Claude Opus 5.5, GPT-6 Astra)
// - Operating Mode: [Active Builders] vs [Pragmatic Reviewers]
// - Bespoke Rating Rubrics: Brand truth, physical refraction, edge-case stress
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
    number: "01",
    title: "The Anti-Slop Mindset & Zero-Shadows",
    tag: "UI Foundations & Tone Steps",
    language: "CSS",
    previewType: "css-box",
    previewHint: "Tweak CSS properties below and click 'Run / Preview' to see live depth styling and anti-slop audit.",
    coreConcept: "Generic AI designs rely on pastel linear gradients on black, floating cards, and gratuitous blur drop-shadows. Award-winning craft creates depth solely through calibrated tone steps, 1px hairlines, and concentric radii.",
    mentorPrompt: "Look at this UI card. What makes it look like generic AI slop? How would you redesign it to feel like an expensive editorial object?",
    studentTarget: "Strip the 20px black drop-shadow, replace it with a 1px cobalt border (#1e293b), set the surface to deep zinc (#12141a), and align the inner radius to outer minus padding.",
    codeExample: `/* Depth via Tone Steps & Hairline Rims */
border: 1px solid rgba(255, 255, 255, 0.08);
background: #12141a;
border-radius: var(--r-card, 20px);
box-shadow: none;`
  },
  {
    number: "02",
    title: "The 150-Word Thesis Contract",
    tag: "IA & Thesis Contract",
    language: "JavaScript / Rules",
    previewType: "thesis-contract",
    previewHint: "Test live word count budgets against the strict 6 / 5 / 3 limits in real time.",
    coreConcept: "Before writing any HTML or CSS, the agent and engineer must agree on a 150-word contract establishing the THESIS, WORLD, STORY, FIRST VIEWPORT, and SIGNATURE 3D MOMENT, paired with strict word limits (Hero <= 6 words, CTA <= 3 words).",
    mentorPrompt: "Why do we enforce strict word budgets on the hero section? What happens to the visual hierarchy if a headline wraps to 4 lines?",
    studentTarget: "Long headlines destroy poster-scale typography. Limiting hero headlines to 6 words forces clarity and preserves viewport balance across mobile and desktop.",
    codeExample: `const WORD_LIMITS = {
  hero: 6,       // 'Physical Precision Over Generative Slop'
  head: 5,       // 'The Anti-Slop Mindset'
  cta: 3         // 'Launch Live Audit'
};

function validateBudget(text, limit) {
  const count = text.trim().split(/\\s+/).filter(Boolean).length;
  return { count, valid: count <= limit, limit };
}`
  },
  {
    number: "03",
    title: "Mathematical Fluid Clamp Typography",
    tag: "Typography Math",
    language: "CSS / Clamp",
    previewType: "clamp-typo",
    previewHint: "Drag the viewport slider to test continuous clamp scaling between 390px and 1440px with zero jumps.",
    coreConcept: "Stepped media queries create sudden layout jumps during window resizing. Continuous linear interpolation clamps typography smoothly between 390px mobile and 1440px desktop with zero layout shift.",
    mentorPrompt: "Calculate the font-size clamp formula for a display heading that needs to be 44px (2.75rem) on a 390px iPhone and 96px (6.0rem) on a 1440px desktop.",
    studentTarget: "Calculate slope m = (6.0 - 2.75)/(1440 - 390) = 0.003095, intercept b = 1.543rem. The CSS rule is clamp(2.75rem, 1.543rem + 4.952vw, 6.0rem).",
    codeExample: `/* Linear Clamp Interpolation (390px -> 1440px) */
font-size: clamp(2.75rem, 1.543rem + 4.952vw, 6.0rem);
line-height: clamp(0.95, 1.05 - 0.05vw, 1.0);
letter-spacing: clamp(-0.04em, -0.02em - 0.01vw, -0.01em);`
  },
  {
    number: "04",
    title: "Optical Liquid Glass (Apple Tahoe Shaders)",
    tag: "Optical Shaders",
    language: "SVG / XML Shaders",
    previewType: "liquid-glass",
    previewHint: "Simulate optical displacement map and chromatic fringe offset live on the test lens.",
    coreConcept: "CSS backdrop blur only diffuses pixels. True liquid glass simulates physical optical refraction using an SVG normal displacement map, chromatic dispersion RGB splitting, and an isolated lens backing.",
    mentorPrompt: "Why must the glass lens be placed on an isolated layer behind the text rather than applying the SVG filter directly to the button element?",
    studentTarget: "Applying the displacement filter to the container distorts the text glyphs, causing severe subpixel blur and eye strain. The lens must sit at z-index: -10 while text stays unrefracted.",
    codeExample: `<feDisplacementMap in="SourceGraphic" in2="normalMap" scale="12" xChannelSelector="R" yChannelSelector="G" />
<!-- Chromatic RGB Fringe Split -->
<feOffset in="displaced" dx="1.5" dy="0" result="redShift" />
<feOffset in="displaced" dx="-1.5" dy="0" result="blueShift" />`
  },
  {
    number: "05",
    title: "GSAP 3.13+ & Lenis RAF Synchronization",
    tag: "Motion & Scroll Physics",
    language: "JavaScript (GSAP + Lenis)",
    previewType: "gsap-raf",
    previewHint: "Simulate lagSmoothing(0) zero-jump RAF loop with live ticker frame stepping.",
    coreConcept: "ScrollTrigger and Lenis smooth scrolling tear when running on separate animation frames. Tying Lenis to GSAP's ticker with lagSmoothing(0) creates buttery 60 FPS motion with zero frame jumps.",
    mentorPrompt: "What is the critical parameter needed in gsap.ticker to prevent animation jumpiness during rapid direction changes or frame drops?",
    studentTarget: "gsap.ticker.lagSmoothing(0) ensures frame drops do not cause sudden catch-up velocity spikes.",
    codeExample: `// Unified RAF Synchronization Loop
const lenis = new Lenis({ smoothWheel: true, duration: 1.2 });
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0); // Prevents catastrophic catch-up jumps`
  },
  {
    number: "06",
    title: "Three.js r170+ WebGPU & TSL Node Materials",
    tag: "WebGPU & Three.js",
    language: "TSL / JavaScript",
    previewType: "tsl-shader",
    previewHint: "Evaluate procedural Fresnel rim calculations and node graph outputs live.",
    coreConcept: "Raw string-based GLSL shaders fail in native WebGPU pipelines. The Three.js Shading Language (TSL) compiles node graphs directly to WGSL for WebGPU with automatic WebGL2 fallback.",
    mentorPrompt: "Write a procedural Fresnel rim highlight in TSL without writing any raw GLSL strings.",
    studentTarget: "Use positionLocal.normalize().negate() for viewDir, normalWorld.dot(viewDir).abs().oneMinus().pow(float(3.0)) for fresnel, and multiply by emissive color.",
    codeExample: `import { color, float, positionLocal, normalWorld } from 'three/tsl';

// Procedural Rim Glow Graph compiled to WGSL / GLSL
const viewDir = positionLocal.normalize().negate();
const fresnel = normalWorld.dot(viewDir).abs().oneMinus().pow(float(3.0));
material.emissiveNode = color(0xf97316).mul(fresnel);`
  },
  {
    number: "07",
    title: "Blender MCP & Headless Asset Automation",
    tag: "Blender MCP Socket",
    language: "Python (bpy / MCP)",
    previewType: "blender-mcp",
    previewHint: "Simulate local MCP socket dispatch (port 9876) with execution timeline and recorder verification.",
    coreConcept: "AI agents connect to Blender 5.2 via local TCP sockets on port 9876, executing bpy scripts, extracting viewport screenshots for visual verification, and compiling Meshopt GLBs headless.",
    mentorPrompt: "How does the Blender MCP server avoid crashing Blender when executing Python commands from background worker threads?",
    studentTarget: "Incoming commands are placed into a thread-safe Queue and executed in the main loop via bpy.app.timers.register to maintain proper thread context.",
    codeExample: `import bpy, socket, json

def execute_mcp_command(payload):
    # Safe main-thread execution via bpy.app.timers
    with get_edit_recorder().agent_command():
        bpy.ops.mesh.primitive_cylinder_add(radius=1.0, depth=2.0)
        bpy.ops.export_scene.gltf(filepath="specimen.glb", export_format='GLB')
    return {"status": "SUCCESS", "tris": 1420}`
  },
  {
    number: "08",
    title: "Free SOTA Generative 3D & Auto-Rigging",
    tag: "Generative 3D CAD",
    language: "CLI / Toolchain",
    previewType: "retopo-3d",
    previewHint: "Interactive 5-stage pipeline stepper from 2D image to rigged WebGPU mesh.",
    coreConcept: "Modern 3D pipelines combine AI shape synthesis (TRELLIS.2 / Hunyuan3D) with automated retopology in Blender, 5-point auto-rigging in AccuRIG / Mixamo, and Meshopt compression.",
    mentorPrompt: "Trace the exact steps to go from a 2D image turnaround to a rigged, animated character in a web browser without spending money on software.",
    studentTarget: "Run TRELLIS.2 for PBR mesh -> Blender Voxel + Quadriflow Remesh -> ActorCore AccuRIG for bone skinning -> Mixamo for mocap FBX -> gltf-transform meshopt -> Three.js GLTFLoader.",
    codeExample: `// Zero-Dollar 3D Pipeline
// Stage 1: TRELLIS.2 PBR Generation (Single Image -> Dense Mesh)
// Stage 2: Blender Quadriflow Remesh (15k Clean Quad Topology)
// Stage 3: ActorCore AccuRIG (5-Point Semantic Bone Skinning)
// Stage 4: Mixamo Mocap FBX Binding (Walk / Idle Cycle)
// Stage 5: gltf-transform meshopt input.glb output.glb`
  },
  {
    number: "09",
    title: "Programmatic Video & EBU R128 Audio",
    tag: "Deterministic Video",
    language: "TypeScript / Virtual Clock",
    previewType: "virtual-clock",
    previewHint: "Step exact 33.333ms frame slices and monitor simulated EBU R128 -14 LUFS audio limits.",
    coreConcept: "Hyperframes and Virtual Clock frame-stepping render live WebGL and CSS animations deterministically into broadcast-grade video, mastered to -14 LUFS with lookahead peak limiting.",
    mentorPrompt: "Why does standard browser screen recording stutter on WebGL sites, and how does the Virtual Clock solve this?",
    studentTarget: "Screen recorders rely on real wall-clock time and drop frames during GPU spikes. The Virtual Clock intercepts requestAnimationFrame and Date.now, stepping time by 33.333ms only when WebGL finishes rendering.",
    codeExample: `// Deterministic Frame-Stepping Interceptor
window.__currentTime = 0;
window.requestAnimationFrame = (cb) => {
  return setTimeout(() => cb(window.__currentTime), 0);
};

// Render Loop (Fixed 30.000 FPS / 33.333ms steps)
for (let frame = 0; frame < 180; frame++) {
  window.__currentTime = frame * (1000 / 30);
  await renderFrame(frame);
}`
  },
  {
    number: "10",
    title: "The 10/10 Dual-Model Gauntlet Review",
    tag: "Production Audit Gauntlet",
    language: "Audit Contract",
    previewType: "gauntlet-audit",
    previewHint: "Live dual-model scorecard evaluator across all 6 production vectors.",
    coreConcept: "No code merges to production until both GPT-6 Astra and Claude Opus 5.5 independently score the identical commit at 10/10 across concept, typography, motion, anti-slop, and 390px/1440px parity.",
    mentorPrompt: "What are the six evaluation vectors required in the production gauntlet before committing as LeulTew?",
    studentTarget: "1. Thesis Contract 2. Typographic & Cultural Parity 3. Motion Craft (60 FPS) 4. Zero-Slop Visuals 5. Mobile 390px/1440px Parity 6. Memory & Lint Hygiene.",
    codeExample: `// Gauntlet Verification Protocol
const VECTORS = [
  "150-Word Thesis Contract",
  "Poster Typography & Script Safe",
  "GSAP + Lenis 60 FPS Sync",
  "Zero-Shadows Tone Step Depth",
  "390px / 1440px Parity Pre-Flight",
  "Zero-Console-Error & Memory Clean"
];

// Both Astra & Opus must score 10/10 on identical SHA`
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

