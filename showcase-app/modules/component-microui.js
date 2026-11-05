/**
 * Precision Micro-UI & Tactile Physics Module (2026 Edition)
 * Standardized for Frontier UI Registries: Hover.dev & Emil Kowalski NumberFlow
 * 
 * Implemented Primitives:
 * 1. Hover.dev 3D Tilt Card:
 *    - Dual-axis perspective matrix transforms (rotateX, rotateY)
 *    - Normalized pointer offset tracking (-1 to +1) with RAF spring damping
 *    - Dynamic specular glare reflection layer with radial-gradient overlay
 *    - Preserved 3D layering with translateZ depth stratification
 * 
 * 2. NumberFlow Layout-Preserving Odometer Counter:
 *    - Tabular numeric alignment with fixed column dimensions
 *    - Individual digit cylinders (0-9) sliding vertically via spring physics
 *    - Zero horizontal layout shift or sibling reflow during counting
 *    - Numeric formatting (separators, currency, decimals, percentages)
 * 
 * 3. Hover.dev Magnetic Button:
 *    - Spring-damper physics cursor pull (F = -k * x)
 *    - Sub-pixel pointer tracking within radial attraction zone
 *    - Inner typography parallax displacement
 *    - Elastic damped snap-back on cursor departure
 */

export function initMicroUIPlayground() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // --------------------------------------------------------------------------
  // 0. ENSURE DOM STAGE & STYLESHEET MOUNTED
  // --------------------------------------------------------------------------
  injectMicroUIStyles();
  mountMicroUIStageIfNeeded();

  // --------------------------------------------------------------------------
  // 1. HOVER.DEV 3D TILT CARD WITH SPECULAR GLARE REFLECTION
  // --------------------------------------------------------------------------
  init3DTiltCard();

  // --------------------------------------------------------------------------
  // 2. NUMBERFLOW LAYOUT-PRESERVING ODOMETER COUNTER
  // --------------------------------------------------------------------------
  initNumberFlowOdometer();

  // --------------------------------------------------------------------------
  // 3. HOVER.DEV MAGNETIC CURSOR BUTTON
  // --------------------------------------------------------------------------
  initMagneticButton();
}

/**
 * Injects dedicated scoped styles for Micro-UI components
 */
function injectMicroUIStyles() {
  if (document.getElementById('microui-injected-styles')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'microui-injected-styles';
  styleEl.textContent = `
    /* Micro-UI Sub-Card Container */
    .microui-subcard {
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .microui-subcard:hover {
      border-color: rgba(59, 130, 246, 0.45) !important;
      box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
    }

    /* 1. 3D Tilt Card */
    #tilt-card-wrapper {
      perspective: 1000px;
      transform-style: preserve-3d;
      user-select: none;
    }
    .hover-tilt-card {
      position: relative;
      width: 100%;
      max-width: 280px;
      min-height: 220px;
      background: linear-gradient(135deg, rgba(24, 27, 38, 0.95) 0%, rgba(14, 16, 23, 0.98) 100%);
      border: 1px solid rgba(59, 130, 246, 0.35);
      border-radius: 16px;
      box-shadow: 0 18px 36px -10px rgba(0, 0, 0, 0.7);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transform-style: preserve-3d;
      will-change: transform;
      cursor: crosshair;
      overflow: hidden;
    }
    .tilt-glare-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      mix-blend-mode: overlay;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 8;
    }
    .tilt-layer {
      transform-style: preserve-3d;
      pointer-events: none;
    }
    .tilt-layer-badge {
      transform: translateZ(26px);
    }
    .tilt-layer-icon {
      transform: translateZ(46px);
      margin: 0.8rem 0;
      display: flex;
      align-items: center;
    }
    .tilt-hologram-glyph {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.28) 0%, rgba(18, 20, 28, 0.8) 100%);
      border: 1px solid rgba(249, 115, 22, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(249, 115, 22, 0.25);
    }
    .tilt-layer-title {
      transform: translateZ(36px);
    }
    .tilt-layer-footer {
      transform: translateZ(20px);
    }

    /* 2. NumberFlow Odometer */
    .numberflow-wrapper {
      display: inline-flex;
      align-items: baseline;
      justify-content: center;
      font-variant-numeric: tabular-nums;
      user-select: none;
    }
    .numberflow-counter {
      display: inline-flex;
      align-items: center;
      height: 3.8rem;
      overflow: hidden;
      font-family: var(--font-display, sans-serif);
      font-size: 2.8rem;
      font-weight: 800;
      line-height: 3.8rem;
      color: #ffffff;
      letter-spacing: -0.02em;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    .numberflow-col {
      display: inline-flex;
      flex-direction: column;
      width: 1.95rem;
      height: 38rem;
      transition: transform 750ms cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
      text-align: center;
    }
    .numberflow-col span {
      height: 3.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 3.8rem;
      text-align: center;
      width: 100%;
    }
    .numberflow-sep {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 3.8rem;
      padding: 0 0.15rem;
      color: var(--c-ember, #f97316);
      font-weight: 700;
      font-size: 2.4rem;
      line-height: 3.8rem;
    }

    /* 3. Magnetic Button */
    .magnetic-arena-box {
      user-select: none;
      position: relative;
    }
    .magnetic-field-ring {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      border: 1px dashed rgba(59, 130, 246, 0.25);
      pointer-events: none;
      opacity: 0.6;
      transition: border-color 0.3s ease, opacity 0.3s ease, transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
      transform: scale(1);
    }
    .magnetic-btn-cta {
      position: relative;
      padding: 0.85rem 2.2rem;
      min-height: 52px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: #ffffff;
      font-family: var(--font-display, sans-serif);
      font-size: 0.96rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.45);
      cursor: pointer;
      will-change: transform;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: box-shadow 0.2s ease, transform 0.1s linear;
      outline: none;
    }
    .magnetic-btn-cta:active {
      transform: scale(0.94) !important;
    }
    .magnetic-btn-text {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      will-change: transform;
      pointer-events: none;
      transition: transform 0.1s linear;
    }
  `;
  document.head.appendChild(styleEl);
}

/**
 * Ensures the precision Micro-UI stage HTML exists inside #section-motion-lab
 */
function mountMicroUIStageIfNeeded() {
  if (document.getElementById('precision-microui-stage')) return;

  const motionLab = document.getElementById('section-motion-lab');
  if (!motionLab) return;

  const stageWrapper = document.createElement('div');
  stageWrapper.id = 'precision-microui-stage';
  stageWrapper.className = 'liquid-glass-card';
  stageWrapper.style.marginBottom = '2rem';
  stageWrapper.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.2rem;">
      <div>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
          <span class="meta-tag">Frontier Registries · Precision Micro-UI</span>
          <span class="meta-tag" style="border-color:rgba(59,130,246,0.3); color:var(--c-sapphire);">Hover.dev &bull; Emil Kowalski</span>
        </div>
        <h3 style="font-family:var(--font-display); font-size:1.6rem; color:var(--t-primary);">
          Precision Micro-UI &amp; Tactile Physics Lab
        </h3>
      </div>
      <div style="display:flex; align-items:center; gap:0.8rem; font-family:var(--font-mono); font-size:0.82rem; flex-wrap:wrap;">
        <span class="meta-tag" style="background:var(--c-obsidian);">Tilt Euler: <strong id="hud-tilt-readout" style="color:var(--c-ember);">0.0&deg;, 0.0&deg;</strong></span>
        <span class="meta-tag" style="background:var(--c-obsidian);">Magnetic Pull: <strong id="hud-magnetic-pull" style="color:var(--c-amber);">0.45</strong></span>
        <span class="meta-tag" style="background:var(--c-obsidian);">Odometer: <strong id="hud-odometer-status" style="color:var(--c-sapphire);">$4,892.50</strong></span>
      </div>
    </div>

    <p style="font-size:0.95rem; color:var(--t-secondary); margin-bottom:1.6rem; max-width:920px;">
      Deterministic tactile micro-interactions engineered with sub-pixel layout stability and physical cursor feedback. Explore dual-axis perspective matrix transforms with dynamic specular glare, layout-preserving odometer counters with sliding digit cylinders, and magnetic spring pointer attractors ($F = -k \cdot x$).
    </p>

    <div class="microui-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-bottom:1.2rem;">
      
      <!-- 1. Hover.dev 3D Tilt Card -->
      <div class="liquid-glass-card microui-subcard" style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
            <span class="meta-tag">Hover.dev · 3D Tilt</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-ember);">DUAL-AXIS PBR</span>
          </div>
          <h4 style="font-family:var(--font-display); font-size:1.25rem; color:var(--t-primary); margin-bottom:0.4rem;">
            3D Tilt &amp; Specular Glare Card
          </h4>
          <p style="font-size:0.85rem; color:var(--t-secondary); margin-bottom:1.2rem;">
            Dual-axis perspective matrix (<code>rotateX</code>, <code>rotateY</code>) tracking pointer offset with spring damping, dynamic radial specular reflection, and multi-layer parallax depth.
          </p>

          <div id="tilt-card-wrapper" class="motion-stage-box" style="margin-bottom:1.2rem; min-height:220px; display:flex; align-items:center; justify-content:center; perspective:1000px; padding:1.5rem; overflow:visible;">
            <div id="hover-tilt-card" class="hover-tilt-card" role="region" aria-label="Interactive 3D Tilt Card" tabindex="0">
              <div id="tilt-specular-glare" class="tilt-glare-overlay"></div>
              
              <div class="tilt-layer tilt-layer-badge">
                <span class="meta-tag" style="background:rgba(255,255,255,0.04); border-color:var(--c-hairline); color:var(--t-primary); font-size:0.7rem;">RTX 5070 Ti &bull; OptiX</span>
              </div>
              <div class="tilt-layer tilt-layer-icon">
                <div class="tilt-hologram-glyph">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:var(--c-ember);"><circle cx="12" cy="12" r="9"></circle><path d="m10 15 5-3-5-3v6Z"></path></svg>
                </div>
              </div>
              <div class="tilt-layer tilt-layer-title">
                <h5 style="font-family:var(--font-display); font-size:1.15rem; color:var(--t-primary); margin:0 0 0.3rem 0; letter-spacing:-0.01em;">Neural OptiX Tensor</h5>
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-sapphire);">16 TFLOPS &bull; FP16 MATRIX</span>
              </div>
              <div class="tilt-layer tilt-layer-footer" style="display:flex; justify-content:space-between; align-items:center; width:100%; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.6rem; margin-top:0.8rem; font-family:var(--font-mono); font-size:0.72rem; color:var(--t-muted);">
                <span>Depth: <strong style="color:var(--t-primary);">46px Z</strong></span>
                <span id="tilt-live-status" style="color:var(--c-amber);">Spring Damped</span>
              </div>
            </div>
          </div>
        </div>

        <div style="background:var(--c-elevated-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-ctl); padding:0.9rem; display:flex; flex-direction:column; gap:0.8rem;">
          <div class="control-slider-group">
            <label for="tilt-sensitivity-slider"><span>Tilt Sensitivity</span><span id="tilt-sensitivity-val">24&deg;</span></label>
            <input type="range" id="tilt-sensitivity-slider" aria-label="3D Tilt Card rotation sensitivity in degrees" min="8" max="45" step="1" value="24">
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
            <button id="tilt-reset-btn" class="nav-tab-btn" aria-label="Reset Tilt Card Orientation" style="flex:1; min-height:38px; padding:0.4rem 0.8rem; font-size:0.8rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-secondary); border-radius:var(--r-ctl); cursor:pointer;">
              Reset Orientation
            </button>
            <button id="tilt-glare-toggle-btn" class="nav-tab-btn" aria-label="Toggle Specular Glare Layer" style="flex:1; min-height:38px; padding:0.4rem 0.8rem; font-size:0.8rem; background:rgba(249,115,22,0.1); border:1px solid rgba(249,115,22,0.3); color:var(--c-ember); border-radius:var(--r-ctl); cursor:pointer;">
              Glare: ON
            </button>
          </div>
        </div>
      </div>

      <!-- 2. NumberFlow Odometer Counter -->
      <div class="liquid-glass-card microui-subcard" style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
            <span class="meta-tag">NumberFlow · Emil Kowalski</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber);">TABULAR-NUMS</span>
          </div>
          <h4 style="font-family:var(--font-display); font-size:1.25rem; color:var(--t-primary); margin-bottom:0.4rem;">
            Layout-Preserving Odometer
          </h4>
          <p style="font-size:0.85rem; color:var(--t-secondary); margin-bottom:1.2rem;">
            Individual digit cylinders slide vertically with spring physics without triggering horizontal layout shifts or sibling reflows.
          </p>

          <div class="motion-stage-box" style="margin-bottom:1.2rem; min-height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.2rem;">
            <span id="numberflow-sr" class="sr-only">Current metric value: $4,892.50</span>
            
            <div class="numberflow-wrapper">
              <span class="numberflow-prefix" style="color:var(--c-ember); font-family:var(--font-mono); font-size:1.8rem; margin-right:0.2rem; font-weight:700;">$</span>
              <div id="numberflow-counter" class="numberflow-counter" role="status" aria-live="polite"></div>
            </div>

            <div style="display:flex; align-items:center; gap:0.6rem; margin-top:1rem; font-family:var(--font-mono); font-size:0.74rem; color:var(--t-muted); flex-wrap:wrap; justify-content:center;">
              <span class="meta-tag" style="background:var(--c-obsidian); font-size:0.7rem;">Fixed Width: <strong style="color:var(--c-sapphire);">Zero Reflow</strong></span>
              <span class="meta-tag" style="background:var(--c-obsidian); font-size:0.7rem;">Physics: <strong style="color:var(--c-amber);">Spring-Cubic</strong></span>
            </div>
          </div>
        </div>

        <div style="background:var(--c-elevated-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-ctl); padding:0.9rem; display:flex; flex-direction:column; gap:0.8rem;">
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:0.4rem;">
            <button id="numberflow-dec-btn" class="nav-tab-btn" aria-label="Decrement value by 10" style="min-height:38px; padding:0.4rem; font-size:0.82rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-primary); border-radius:var(--r-ctl); cursor:pointer;">
              -10
            </button>
            <button id="numberflow-dec1-btn" class="nav-tab-btn" aria-label="Decrement value by 1" style="min-height:38px; padding:0.4rem; font-size:0.82rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-primary); border-radius:var(--r-ctl); cursor:pointer;">
              -1
            </button>
            <button id="numberflow-inc1-btn" class="nav-tab-btn" aria-label="Increment value by 1" style="min-height:38px; padding:0.4rem; font-size:0.82rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-primary); border-radius:var(--r-ctl); cursor:pointer;">
              +1
            </button>
            <button id="numberflow-inc-btn" class="nav-tab-btn" aria-label="Increment value by 10" style="min-height:38px; padding:0.4rem; font-size:0.82rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-primary); border-radius:var(--r-ctl); cursor:pointer;">
              +10
            </button>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button id="numberflow-rand-btn" class="nav-tab-btn" aria-label="Randomize Odometer Metric Value" style="flex:1; min-height:38px; padding:0.4rem 0.8rem; font-size:0.82rem; background:var(--c-ember); color:#fff; border:none; border-radius:var(--r-ctl); font-weight:600; cursor:pointer;">
              Randomize Metric
            </button>
            <button id="numberflow-preset-btn" class="nav-tab-btn" aria-label="Cycle Preset Metrics" style="flex:1; min-height:38px; padding:0.4rem 0.8rem; font-size:0.82rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-secondary); border-radius:var(--r-ctl); cursor:pointer;">
              Cycle Presets
            </button>
          </div>
        </div>
      </div>

      <!-- 3. MagneticButton -->
      <div class="liquid-glass-card microui-subcard" style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
            <span class="meta-tag">Hover.dev · Magnetic Physics</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-sapphire);">F = -k &middot; x</span>
          </div>
          <h4 style="font-family:var(--font-display); font-size:1.25rem; color:var(--t-primary); margin-bottom:0.4rem;">
            Magnetic Cursor Button
          </h4>
          <p style="font-size:0.85rem; color:var(--t-secondary); margin-bottom:1.2rem;">
            Physics cursor attractor tracking pointer proximity within magnetic radius, with inner text parallax and spring snap-back.
          </p>

          <div id="magnetic-arena" class="motion-stage-box magnetic-arena-box" style="margin-bottom:1.2rem; min-height:220px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; padding:2rem; cursor:pointer;">
            <div id="magnetic-field-ring" class="magnetic-field-ring"></div>
            
            <button id="magnetic-cta-btn" class="magnetic-btn-cta" aria-label="Interactive Magnetic CTA Button">
              <span class="magnetic-btn-text" id="magnetic-btn-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color:#fff;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                <span>Deploy Cluster</span>
              </span>
            </button>

            <div style="margin-top:1.2rem; font-family:var(--font-mono); font-size:0.74rem; color:var(--t-muted); display:flex; align-items:center; gap:0.6rem;">
              <span>Offset: <strong id="magnetic-coords-readout" style="color:var(--c-ember);">&Delta; 0px, 0px</strong></span>
              <span>&bull;</span>
              <span id="magnetic-click-count" style="color:var(--c-amber);">Clicks: 0</span>
            </div>
          </div>
        </div>

        <div style="background:var(--c-elevated-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-ctl); padding:0.9rem; display:flex; flex-direction:column; gap:0.8rem;">
          <div>
            <label style="display:block; font-size:0.75rem; font-family:var(--font-mono); color:var(--t-secondary); margin-bottom:0.4rem;">
              MAGNETIC PULL STRENGTH
            </label>
            <div role="group" aria-label="Magnetic pull strength presets" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.4rem;">
              <button id="mag-strength-subtle" class="nav-tab-btn mag-strength-btn" data-strength="0.22" style="min-height:36px; padding:0.3rem 0.6rem; font-size:0.78rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-secondary); border-radius:var(--r-ctl); cursor:pointer;">
                Subtle (0.22)
              </button>
              <button id="mag-strength-std" class="nav-tab-btn mag-strength-btn active" data-strength="0.45" style="min-height:36px; padding:0.3rem 0.6rem; font-size:0.78rem; background:var(--c-ember); border:none; color:#fff; border-radius:var(--r-ctl); font-weight:600; cursor:pointer;">
                Std (0.45)
              </button>
              <button id="mag-strength-hyper" class="nav-tab-btn mag-strength-btn" data-strength="0.82" style="min-height:36px; padding:0.3rem 0.6rem; font-size:0.78rem; background:rgba(255,255,255,0.05); border:1px solid var(--c-cobalt-rim); color:var(--t-secondary); border-radius:var(--r-ctl); cursor:pointer;">
                Hyper (0.82)
              </button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:0.72rem; color:var(--t-muted);">
            <span>Field Radius: <strong style="color:var(--c-sapphire);">140px</strong></span>
            <span>Restitution: <strong style="color:var(--c-amber);">Elastic Snap</strong></span>
          </div>
        </div>
      </div>

    </div>
  `;

  motionLab.appendChild(stageWrapper);
}

/**
 * 1. Hover.dev 3D Tilt Card Implementation
 * Dual-axis perspective transforms with normalized mouse tracking & specular glare
 */
function init3DTiltCard() {
  const card = document.getElementById('hover-tilt-card');
  const glareEl = document.getElementById('tilt-specular-glare');
  const sensitivitySlider = document.getElementById('tilt-sensitivity-slider');
  const sensitivityVal = document.getElementById('tilt-sensitivity-val');
  const resetBtn = document.getElementById('tilt-reset-btn');
  const glareToggleBtn = document.getElementById('tilt-glare-toggle-btn');
  const hudTilt = document.getElementById('hud-tilt-readout');
  const statusReadout = document.getElementById('tilt-live-status');

  if (!card) return;

  // Configuration State
  let maxTiltDeg = sensitivitySlider ? parseFloat(sensitivitySlider.value) || 24 : 24;
  let glareEnabled = true;

  // Spring Interpolation Physics State
  let currentRotX = 0;
  let currentRotY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let currentScale = 1.0;
  let targetScale = 1.0;
  let glareX = 50;
  let glareY = 50;
  let targetGlareOpacity = 0;
  let currentGlareOpacity = 0;
  let isHovered = false;
  let rafId = null;

  // Damping loop
  function tiltTick() {
    // Smooth lerp / spring interpolation
    const lerpFactor = 0.14;
    currentRotX += (targetRotX - currentRotX) * lerpFactor;
    currentRotY += (targetRotY - currentRotY) * lerpFactor;
    currentScale += (targetScale - currentScale) * 0.12;
    currentGlareOpacity += (targetGlareOpacity - currentGlareOpacity) * 0.16;

    // Apply 3D Perspective Matrix
    card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;

    // Apply Specular Glare
    if (glareEl && glareEnabled) {
      glareEl.style.opacity = currentGlareOpacity.toFixed(2);
      glareEl.style.background = `radial-gradient(circle 240px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.42) 0%, rgba(249, 115, 22, 0.22) 32%, transparent 75%)`;
    } else if (glareEl) {
      glareEl.style.opacity = '0';
    }

    // Update HUD
    if (hudTilt) {
      const signX = currentRotX >= 0 ? '+' : '';
      const signY = currentRotY >= 0 ? '+' : '';
      hudTilt.textContent = `${signX}${currentRotX.toFixed(1)}°, ${signY}${currentRotY.toFixed(1)}°`;
    }

    // Keep RAF alive if moving or non-zero
    const isStationary = Math.abs(targetRotX - currentRotX) < 0.01 && 
                         Math.abs(targetRotY - currentRotY) < 0.01 && 
                         Math.abs(targetScale - currentScale) < 0.001 &&
                         Math.abs(targetGlareOpacity - currentGlareOpacity) < 0.01;

    if (!isStationary || isHovered) {
      rafId = requestAnimationFrame(tiltTick);
    } else {
      rafId = null;
    }
  }

  function startRafIfNeeded() {
    if (!rafId) {
      rafId = requestAnimationFrame(tiltTick);
    }
  }

  // Pointer Movement Handlers
  function onPointerMove(e) {
    isHovered = true;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized coordinates (-1 to +1)
    const normX = ((x / rect.width) - 0.5) * 2;
    const normY = ((y / rect.height) - 0.5) * 2;

    // Rotate matrix: rotateX is pitch (-ny * maxTilt), rotateY is yaw (nx * maxTilt)
    targetRotX = -normY * maxTiltDeg;
    targetRotY = normX * maxTiltDeg;
    targetScale = 1.05;

    // Glare coordinates
    glareX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    glareY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    const distFromCenter = Math.sqrt(normX * normX + normY * normY);
    targetGlareOpacity = glareEnabled ? Math.min(1.0, distFromCenter * 0.75 + 0.2) : 0;

    if (statusReadout) {
      statusReadout.textContent = 'Active Tracking';
      statusReadout.style.color = 'var(--c-ember)';
    }

    startRafIfNeeded();
  }

  function onPointerLeave() {
    isHovered = false;
    targetRotX = 0;
    targetRotY = 0;
    targetScale = 1.0;
    targetGlareOpacity = 0;

    if (statusReadout) {
      statusReadout.textContent = 'Spring Damped';
      statusReadout.style.color = 'var(--c-amber)';
    }

    startRafIfNeeded();
  }

  card.addEventListener('pointermove', onPointerMove);
  card.addEventListener('pointerleave', onPointerLeave);

  // Controls Wiring
  if (sensitivitySlider) {
    sensitivitySlider.addEventListener('input', (e) => {
      maxTiltDeg = parseFloat(e.target.value) || 24;
      if (sensitivityVal) sensitivityVal.innerHTML = `${maxTiltDeg}&deg;`;
      if (isHovered) {
        startRafIfNeeded();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      targetRotX = 0;
      targetRotY = 0;
      targetScale = 1.0;
      targetGlareOpacity = 0;
      startRafIfNeeded();
    });
  }

  if (glareToggleBtn) {
    glareToggleBtn.addEventListener('click', () => {
      glareEnabled = !glareEnabled;
      glareToggleBtn.textContent = `Glare: ${glareEnabled ? 'ON' : 'OFF'}`;
      glareToggleBtn.style.color = glareEnabled ? 'var(--c-ember)' : 'var(--t-muted)';
      glareToggleBtn.style.background = glareEnabled ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.05)';
      if (!glareEnabled) {
        targetGlareOpacity = 0;
        if (glareEl) glareEl.style.opacity = '0';
      } else if (isHovered) {
        targetGlareOpacity = 0.5;
        startRafIfNeeded();
      }
    });
  }
}

/**
 * 2. NumberFlow Layout-Preserving Odometer Counter Implementation
 * Emil Kowalski design specification: tabular numbers & vertical sliding digit columns
 */
function initNumberFlowOdometer() {
  const counterEl = document.getElementById('numberflow-counter');
  const srEl = document.getElementById('numberflow-sr');
  const hudOdometer = document.getElementById('hud-odometer-status');
  const incBtn = document.getElementById('numberflow-inc-btn');
  const inc1Btn = document.getElementById('numberflow-inc1-btn');
  const decBtn = document.getElementById('numberflow-dec-btn');
  const dec1Btn = document.getElementById('numberflow-dec1-btn');
  const randBtn = document.getElementById('numberflow-rand-btn');
  const presetBtn = document.getElementById('numberflow-preset-btn');
  const prefixEl = document.querySelector('.numberflow-prefix');

  if (!counterEl) return;

  // Preset metric series for cycling
  const PRESETS = [
    { value: 4892.50, prefix: '$', suffix: '', label: 'ARR Run-Rate ($)' },
    { value: 99.98, prefix: '', suffix: '%', label: 'Cluster Uptime (%)' },
    { value: 1440.0, prefix: '', suffix: ' FPS', label: 'Frame Pacing (FPS)' },
    { value: 18.4, prefix: '', suffix: ' ms', label: 'Kernel Latency (ms)' },
    { value: 12500, prefix: '#', suffix: '', label: 'Telemetry Ops/s' }
  ];
  let presetIndex = 0;
  let currentValue = 4892.50;
  let currentPrefix = '$';

  /**
   * Formats a numeric value with standard commas and fixed decimals
   */
  function formatNumberString(val) {
    if (Number.isInteger(val)) {
      return val.toLocaleString('en-US');
    }
    const hasTwoDecimals = (val * 100) % 1 === 0;
    return val.toLocaleString('en-US', {
      minimumFractionDigits: hasTwoDecimals ? 2 : 1,
      maximumFractionDigits: 2
    });
  }

  /**
   * Reconciles or renders the digit columns and separator spans
   */
  function updateOdometerDisplay(val, prefix = currentPrefix) {
    currentValue = Math.max(0, val);
    currentPrefix = prefix;

    if (prefixEl) {
      prefixEl.textContent = currentPrefix;
    }

    const valStr = formatNumberString(currentValue);
    const chars = valStr.split('');

    // Update Screen Reader & HUD readouts
    if (srEl) {
      srEl.textContent = `Current metric value: ${currentPrefix}${valStr}`;
    }
    if (hudOdometer) {
      hudOdometer.textContent = `${currentPrefix}${valStr}`;
    }

    // Build/Reconcile Columns
    counterEl.innerHTML = '';

    chars.forEach((char) => {
      if (char >= '0' && char <= '9') {
        const digit = parseInt(char, 10);
        const col = document.createElement('div');
        col.className = 'numberflow-col';
        col.setAttribute('data-target-digit', digit.toString());

        // Create 0-9 spans
        for (let i = 0; i <= 9; i++) {
          const span = document.createElement('span');
          span.textContent = i.toString();
          col.appendChild(span);
        }

        counterEl.appendChild(col);

        // Trigger vertical slide animation on next tick
        requestAnimationFrame(() => {
          col.style.transform = `translateY(-${digit * 3.8}rem)`;
        });
      } else {
        // Separator character (, or . or % etc.)
        const sep = document.createElement('span');
        sep.className = 'numberflow-sep';
        sep.textContent = char;
        counterEl.appendChild(sep);
      }
    });
  }

  // Initial render
  updateOdometerDisplay(currentValue, currentPrefix);

  // Controls Wiring
  if (incBtn) {
    incBtn.addEventListener('click', () => {
      updateOdometerDisplay(currentValue + 10);
    });
  }
  if (inc1Btn) {
    inc1Btn.addEventListener('click', () => {
      updateOdometerDisplay(currentValue + 1);
    });
  }
  if (decBtn) {
    decBtn.addEventListener('click', () => {
      updateOdometerDisplay(Math.max(0, currentValue - 10));
    });
  }
  if (dec1Btn) {
    dec1Btn.addEventListener('click', () => {
      updateOdometerDisplay(Math.max(0, currentValue - 1));
    });
  }
  if (randBtn) {
    randBtn.addEventListener('click', () => {
      const randomVal = parseFloat((Math.random() * 8500 + 100).toFixed(2));
      updateOdometerDisplay(randomVal);
    });
  }
  if (presetBtn) {
    presetBtn.addEventListener('click', () => {
      presetIndex = (presetIndex + 1) % PRESETS.length;
      const preset = PRESETS[presetIndex];
      updateOdometerDisplay(preset.value, preset.prefix);
    });
  }

  // Export helper on window for external triggers
  window.setNumberFlowValue = (val, prefix = '') => {
    updateOdometerDisplay(val, prefix);
  };
}

/**
 * 3. Hover.dev Magnetic Button Implementation
 * Spring-damper physics cursor pull (F = -k * x) with typography parallax
 */
function initMagneticButton() {
  const arena = document.getElementById('magnetic-arena');
  const btn = document.getElementById('magnetic-cta-btn');
  const text = document.getElementById('magnetic-btn-label');
  const fieldRing = document.getElementById('magnetic-field-ring');
  const readout = document.getElementById('magnetic-coords-readout');
  const clickCountEl = document.getElementById('magnetic-click-count');
  const hudMagneticPull = document.getElementById('hud-magnetic-pull');

  const strengthBtns = document.querySelectorAll('.mag-strength-btn');

  if (!btn || !arena) return;

  // Magnetic Physics Parameters
  let strength = 0.45;
  const influenceRadius = 140; // pixel distance around button center
  let clickCount = 0;

  // Spring Simulation State
  let posX = 0;
  let posY = 0;
  let velX = 0;
  let velY = 0;
  let targetX = 0;
  let targetY = 0;

  let textX = 0;
  let textY = 0;
  let targetTextX = 0;
  let targetTextY = 0;

  let isCursorInside = false;
  let magneticRafId = null;

  // Spring Physics Tick Loop (F = -k*x - c*v)
  function magneticTick() {
    const springK = isCursorInside ? 0.18 : 0.24;
    const dampingC = isCursorInside ? 0.72 : 0.82;

    // Button body physics
    const forceX = -springK * (posX - targetX);
    const forceY = -springK * (posY - targetY);
    velX = (velX + forceX) * dampingC;
    velY = (velY + forceY) * dampingC;
    posX += velX;
    posY += velY;

    // Text inner parallax physics
    textX += (targetTextX - textX) * 0.22;
    textY += (targetTextY - textY) * 0.22;

    // Apply transforms
    btn.style.transform = `translate3d(${posX.toFixed(2)}px, ${posY.toFixed(2)}px, 0)`;
    if (text) {
      text.style.transform = `translate3d(${textX.toFixed(2)}px, ${textY.toFixed(2)}px, 0)`;
    }

    // Check if system has come to rest
    const isAtRest = !isCursorInside && 
                     Math.abs(posX) < 0.05 && 
                     Math.abs(posY) < 0.05 && 
                     Math.abs(velX) < 0.01 && 
                     Math.abs(velY) < 0.01;

    if (!isAtRest || isCursorInside) {
      magneticRafId = requestAnimationFrame(magneticTick);
    } else {
      posX = 0;
      posY = 0;
      velX = 0;
      velY = 0;
      textX = 0;
      textY = 0;
      btn.style.transform = 'translate3d(0px, 0px, 0)';
      if (text) text.style.transform = 'translate3d(0px, 0px, 0)';
      magneticRafId = null;
    }
  }

  function startMagneticRaf() {
    if (!magneticRafId) {
      magneticRafId = requestAnimationFrame(magneticTick);
    }
  }

  // Pointer Proximity Event Listeners
  function onPointerMove(e) {
    const btnRect = btn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const deltaX = e.clientX - btnCenterX;
    const deltaY = e.clientY - btnCenterY;
    const dist = Math.hypot(deltaX, deltaY);

    if (dist <= influenceRadius) {
      isCursorInside = true;
      const proximityFactor = Math.max(0, 1 - dist / (influenceRadius * 1.2));
      const pullMultiplier = strength * (1 + proximityFactor * 0.5);

      targetX = deltaX * pullMultiplier;
      targetY = deltaY * pullMultiplier;
      targetTextX = targetX * 0.45;
      targetTextY = targetY * 0.45;

      if (fieldRing) {
        fieldRing.style.transform = `translate(${targetX * 0.28}px, ${targetY * 0.28}px) scale(1.05)`;
        fieldRing.style.borderColor = 'rgba(249, 115, 22, 0.48)';
        fieldRing.style.opacity = '0.9';
      }

      if (readout) {
        readout.textContent = `Δ ${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px`;
      }
    } else {
      isCursorInside = false;
      targetX = 0;
      targetY = 0;
      targetTextX = 0;
      targetTextY = 0;

      if (fieldRing) {
        fieldRing.style.transform = 'translate(0px, 0px) scale(1)';
        fieldRing.style.borderColor = 'rgba(59, 130, 246, 0.25)';
        fieldRing.style.opacity = '0.6';
      }
      if (readout) {
        readout.textContent = 'Δ 0px, 0px';
      }
    }

    startMagneticRaf();
  }

  function onPointerLeave() {
    isCursorInside = false;
    targetX = 0;
    targetY = 0;
    targetTextX = 0;
    targetTextY = 0;

    if (fieldRing) {
      fieldRing.style.transform = 'translate(0px, 0px) scale(1)';
      fieldRing.style.borderColor = 'rgba(59, 130, 246, 0.25)';
      fieldRing.style.opacity = '0.6';
    }
    if (readout) {
      readout.textContent = 'Δ 0px, 0px';
    }

    startMagneticRaf();
  }

  arena.addEventListener('pointermove', onPointerMove);
  arena.addEventListener('pointerleave', onPointerLeave);

  // Button Click Feedback
  btn.addEventListener('click', () => {
    clickCount++;
    if (clickCountEl) {
      clickCountEl.textContent = `Clicks: ${clickCount}`;
    }

    // Tactile kickback impulse
    velX *= -0.5;
    velY *= -0.5;
    startMagneticRaf();

    // Trigger visual field ring pulse
    if (fieldRing) {
      fieldRing.style.transform = 'scale(1.18)';
      fieldRing.style.borderColor = 'var(--c-amber)';
      setTimeout(() => {
        if (!isCursorInside && fieldRing) {
          fieldRing.style.transform = 'scale(1)';
          fieldRing.style.borderColor = 'rgba(59, 130, 246, 0.25)';
        }
      }, 250);
    }
  });

  // Strength Preset Switchers
  strengthBtns.forEach((btnEl) => {
    btnEl.addEventListener('click', () => {
      strengthBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'rgba(255,255,255,0.05)';
        b.style.color = 'var(--t-secondary)';
        b.style.border = '1px solid var(--c-cobalt-rim)';
        b.style.fontWeight = 'normal';
      });
      btnEl.classList.add('active');
      btnEl.style.background = 'var(--c-ember)';
      btnEl.style.color = '#fff';
      btnEl.style.border = 'none';
      btnEl.style.fontWeight = '600';

      strength = parseFloat(btnEl.getAttribute('data-strength')) || 0.45;
      if (hudMagneticPull) {
        hudMagneticPull.textContent = strength.toFixed(2);
      }
    });
  });

  // Window refresh hook
  window.refreshMicroUI = () => {
    onPointerLeave();
  };
}
