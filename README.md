# Creative Engineering & 3D/UI Skills Encyclopedia (2026 Edition)

Welcome to the centralized knowledge hub and master repository of advanced creative engineering, 3D pipelines, Blender agent integrations, award-winning UI/UX design architectures, and programmatic video systems.

## Repository Architecture

```
creative-skills-encyclopedia/
├── README.md                                  # Hub overview and roadmap
├── MASTER_CREATIVE_ENGINEERING_PLAYBOOK_2026.md # The single-file exhaustive master reference
├── 3d-and-blender/                            # Blender 5.2 headless scripts, MCP configs, rigging pipelines
│   ├── blender-mcp-architecture.md
│   ├── generative-3d-and-autorigging-guide.md
│   ├── khronos-pbr-neutral-pipeline.md
│   └── scripts/
├── ui-and-shaders/                            # Advanced frontend, shaders, kinetic typography
│   ├── award-winning-ui-patterns.md
│   ├── apple-liquid-glass-shaders.md
│   ├── gsap-kinetic-typography.md
│   └── tokens/
├── video-and-motion/                          # Hyperframes, Brag, Adobe Premiere Pro integrations
│   ├── adobe-premiere-pro-agent-scripting.md
│   ├── hyperframes-programmatic-video.md
│   └── workflows/
├── curated-skills/                            # Synced and novelty-checked agent skills for LeulTew/skills
│   ├── blender-mcp/
│   ├── premiere-pro-agent/
│   └── 3d-asset-synthesis/
├── showcase-app/                              # Award-winning interactive presentation & showcase web application
└── docs/                                      # Research transcripts, session archaeology, and comparative analyses
    ├── 2026-ecosystem-skills-marketplace-report.md
    ├── copilot_sessions_deep_dive_report.md
    └── theo_visual_hill_climbing_vs_10x_creative_engineering.md
```

## Interactive Showcase & Presenter Deck

The repository includes a production-grade, zero-dependency interactive showcase web app located in `./showcase-app`.

### Launching the Local Preview

Run the multi-engine preview script in PowerShell:

```powershell
# Auto-detects Bun, Python, npx, or uses built-in PowerShell HttpListener
.\preview.ps1

# Specify engine or port
.\preview.ps1 -Port 4173 -Engine auto

# Headless mode (without auto-launching browser)
.\preview.ps1 -NoBrowser
```

### Key Interactive Features

1. **Presenter & Teaching Deck (`[F]` / Theater Mode)**:
   - Fullscreen presentation engine with hotkey navigation (`←` / `→` or `Spacebar` for slides, `1`-`9`, `0` for direct jump).
   - Two-person interactive peer quizzing with masked target answers and tactile `[R]` reveal.
   - Live editable code playground with real-time compilation, anti-slop linters, word-budget checkers, and RAF ticker spike simulators.
   - Module thumbnail drawer (`[M]` or menu button).
2. **Motion & Kinetic Playground**:
   - **BlurText** (ReactBits): Character-by-character unblur with custom spring easing and `.sr-only` accessibility mirroring.
   - **DecryptedText** (ReactBits): Terminal glyph scramble (Matrix, Katakana, Hex, Binary) sequentially locking into target text.
   - **VariableProximity** (ReactBits): Euclidean pointer tracking warping font weight (`wght` 200→900) and width (`wdth` 75%→125%) using `Roboto Flex` and `Bricolage Grotesque`.
   - **ShinyText** (ReactBits): Specular gradient sweep with angle and velocity controls.
   - **Anime.js Canvas Sandbox**: High-DPI physics particle burst generator with elastic shockwaves and 60 FPS counter.
3. **Colorimetric 3D Viewport**:
   - **Three Render Modes**: Solid PBR micro-facet packaging stress test, Wireframe Hologram, and Point Cloud (implementing descending vertical Y-axis sorting).
   - **Tone Mapping Selector**: Real-time comparison between Khronos PBR Neutral, ACES Filmic, AgX, and Unclamped None with live colorimetric theory callouts.
   - **Studio Lighting**: Directional Ember Rim Light, Cobalt Key Light, and Ambient Fill toggles.
4. **Mobile Parity & Accessibility**:
   - 10/10 verified score across 390px mobile viewports (iPhone 14/15/16 Pro) and 1440px desktop.
   - Apple HIG touch targets ($\ge 44 \times 44$px).
   - Safe-area insets (`env(safe-area-inset-bottom)`).
   - WCAG AA compliant contrast ratios ($\ge 5.67:1$ to $18.8:1$).

---

## GitHub Pages Deployment

A GitHub Actions workflow is provided at `.github/workflows/deploy-showcase.yml`:

1. Push this project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete creative skills encyclopedia and showcase"
   git branch -M main
   git remote add origin https://github.com/LeulTew/<repo-name>.git
   git push -u origin main
   ```
2. In GitHub repository settings: **Settings** > **Pages** > select **GitHub Actions**.
3. The site will deploy automatically to `https://<username>.github.io/<repo-name>/`.

1. **Award-Winning UI/UX Architecture**:
   - SunChips Flavor Worlds & tactile canvas theming
   - MMCY Thesis Contract, 150-word budgets, anti-slop gates
   - Apple Tahoe Liquid Glass displacement shaders & WebP normal maps
   - 390px mobile to 1440px desktop strict parity

2. **3D Pipelines & Blender Automation**:
   - Headless Blender GLB point sampling & packaging reconstruction
   - Blender MCP Server: agentic Python execution inside Blender 5.2
   - State-of-the-art free generative 3D & auto-rigging toolchains (TripoSR, AccuRIG, Mixamo, Cascadeur)
   - Three.js r170+, Khronos PBR Neutral tone mapping, WebGPU readiness

3. **Programmatic Video & Motion Systems**:
   - Hyperframes deterministic DOM render pipelines (Brag, Site Capture Film)
   - Adobe Premiere Pro CEP/UXP, ExtendScript / JSX automation, and FCPXML/EDL bridges
   - Audio ducking, kinetic text overlays, and dual-format (16:9 & 9:16) rendering

4. **Multi-Model Orchestration & Visual Hill-Climbing**:
   - Closed-loop Visual Hill-Climbing with dual-viewport screenshot convergence ($\ge 9.5/10$)
   - Adversarial Jester critic role to eradicate cooperative model bias and AI slop
   - Vercel Sandbox microVM browser councils with context-optimized bounding-box cropping
