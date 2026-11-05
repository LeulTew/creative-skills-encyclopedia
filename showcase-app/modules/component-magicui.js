/**
 * Magic UI & Aceternity Stage Architect Module (2026 Frontier Edition)
 * File: showcase-app/modules/component-magicui.js
 * 
 * Signature Primitives:
 * 1. AnimatedBeam (Magic UI):
 *    Dynamic SVG cubic bezier curve connecting distributed architecture nodes
 *    (Client Edge Worker -> Cloud Council Auditor) with dynamic packet pulse dispatch
 *    and real-time mathematical bezier recalculation on viewport resize.
 * 2. SpotlightBento (Aceternity / Magic UI):
 *    Asymmetric Bento grid cards featuring cursor-following radial spotlight highlight
 *    illuminating the 1px card border (radial-gradient(circle at X Y, rgba(56,189,248,0.25), transparent 80%)).
 * 3. PinContainer3D (Aceternity UI):
 *    Interactive 3D perspective card pin hovering in 3D coordinate space with cursor-following
 *    perspective tilt, laser stem, and glowing concentric radar ripple anchor.
 * 4. RippleEffect (Magic UI):
 *    Concentric circular ripple rings pulsing outward with staggered delays,
 *    exponential opacity decay, and click-to-trigger shockwave burst physics.
 */

// Global State Ledger
const state = {
  beam: {
    speed: 2.2, // seconds
    packetsSent: 0,
    isDispatching: false,
    color: '#f97316',
    flow: 'forward'
  },
  pin: {
    perspective: 1000,
    maxTilt: 20,
    currentRotateX: 0,
    currentRotateY: 0
  },
  ripple: {
    rings: 5,
    speed: 3.2,
    color: 'ember',
    burstCount: 0
  },
  spotlight: {
    color: 'rgba(56, 189, 248, 0.35)',
    activeCards: 0
  }
};

/**
 * Injects required scoped CSS for Magic UI & Aceternity primitives
 * Ensures zero dependency on external style sheets while matching the luxury obsidian design system.
 */
function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('magicui-aceternity-styles')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'magicui-aceternity-styles';
  styleEl.textContent = `
    /* ==========================================================================
       Magic UI & Aceternity Stage Scoped Styles
       ========================================================================== */
    .magic-stage-section {
      margin-top: 2.5rem;
      margin-bottom: 2.5rem;
      position: relative;
    }

    .magic-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.75rem;
    }

    @media (max-width: 992px) {
      .magic-grid-2col {
        grid-template-columns: 1fr;
      }
    }

    /* --------------------------------------------------------------------------
       1. AnimatedBeam (Magic UI)
       -------------------------------------------------------------------------- */
    .beam-stage-container {
      position: relative;
      width: 100%;
      height: 260px;
      background: radial-gradient(circle at 50% 50%, #0d111a 0%, #06080c 100%);
      border: 1px solid var(--c-cobalt-rim, rgba(255, 255, 255, 0.08));
      border-radius: var(--r-inner, 14px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2.5rem;
      overflow: hidden;
      margin-bottom: 1.25rem;
    }

    .beam-node-card {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.25rem;
      background: var(--c-elevated-zinc, #121520);
      border: 1px solid var(--c-cobalt-rim, rgba(255, 255, 255, 0.12));
      border-radius: var(--r-card, 16px);
      color: var(--t-primary, #ffffff);
      min-width: 130px;
      text-align: center;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
    }

    .beam-node-card.node-active {
      border-color: var(--c-ember, #f97316);
      box-shadow: 0 0 24px rgba(249, 115, 22, 0.35);
      transform: scale(1.03);
    }

    .beam-node-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
    }

    .beam-node-label {
      font-family: var(--font-display, sans-serif);
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--t-primary, #fff);
    }

    .beam-node-sub {
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      color: var(--t-muted, #64748b);
    }

    .beam-svg-layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 4;
    }

    .beam-path-bg {
      stroke: rgba(255, 255, 255, 0.07);
      stroke-width: 2;
      fill: none;
    }

    .beam-path-pulse {
      stroke: url(#magic-beam-grad);
      stroke-width: 3.5;
      stroke-linecap: round;
      fill: none;
      stroke-dasharray: 90 440;
      animation: magicBeamTravel var(--beam-anim-speed, 2.4s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes magicBeamTravel {
      0% { stroke-dashoffset: 530; }
      100% { stroke-dashoffset: -90; }
    }

    .beam-packet-dot {
      fill: #38bdf8;
      filter: drop-shadow(0 0 8px #38bdf8);
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .beam-packet-dot.in-transit {
      opacity: 1;
    }

    /* --------------------------------------------------------------------------
       2. RippleEffect (Magic UI)
       -------------------------------------------------------------------------- */
    .ripple-stage-box {
      position: relative;
      width: 100%;
      height: 260px;
      background: radial-gradient(circle at 50% 50%, #0d111a 0%, #06080c 100%);
      border: 1px solid var(--c-cobalt-rim, rgba(255, 255, 255, 0.08));
      border-radius: var(--r-inner, 14px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: 1.25rem;
      cursor: crosshair;
    }

    .ripple-center-node {
      position: relative;
      z-index: 10;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--c-elevated-zinc, #121520);
      border: 2px solid var(--c-ember, #f97316);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      user-select: none;
    }

    .ripple-center-node:hover {
      transform: scale(1.1);
      box-shadow: 0 0 30px rgba(249, 115, 22, 0.6);
    }

    .ripple-center-node:active {
      transform: scale(0.95);
    }

    .ripple-center-core {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--c-ember, #f97316);
      box-shadow: 0 0 10px var(--c-ember, #f97316);
    }

    .ripple-center-txt {
      font-family: var(--font-mono, monospace);
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--t-primary, #fff);
      margin-top: 2px;
    }

    .ripple-rings-layer {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .magic-ripple-ring {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid var(--ripple-color, #f97316);
      opacity: 0;
      pointer-events: none;
      animation: magicRipplePulse var(--ripple-duration, 3.2s) cubic-bezier(0, 0.2, 0.8, 1) infinite;
      animation-delay: calc(var(--ring-idx, 0) * (var(--ripple-duration, 3.2s) / var(--ring-total, 5)));
    }

    @keyframes magicRipplePulse {
      0% {
        width: 40px;
        height: 40px;
        opacity: 0.9;
        transform: scale(0.5);
      }
      50% {
        opacity: 0.45;
      }
      100% {
        width: 420px;
        height: 420px;
        opacity: 0;
        transform: scale(1);
      }
    }

    /* Dynamic Burst Ripple */
    .magic-burst-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid #38bdf8;
      pointer-events: none;
      transform: translate(-50%, -50%);
      animation: magicBurstExpand 0.85s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
    }

    @keyframes magicBurstExpand {
      0% {
        width: 10px;
        height: 10px;
        opacity: 1;
        border-color: #38bdf8;
      }
      100% {
        width: 380px;
        height: 380px;
        opacity: 0;
        border-color: #f97316;
      }
    }

    /* --------------------------------------------------------------------------
       3. SpotlightBento (Aceternity UI / Magic UI)
       -------------------------------------------------------------------------- */
    .spotlight-bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 900px) {
      .spotlight-bento-grid {
        grid-template-columns: 1fr;
      }
    }

    .spotlight-bento-card {
      position: relative;
      background: var(--c-deep-zinc, #0b0d13);
      border: 1px solid var(--c-cobalt-rim, rgba(255, 255, 255, 0.08));
      border-radius: var(--r-card, 18px);
      padding: 1.6rem;
      overflow: hidden;
      cursor: default;
      transition: border-color 0.25s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .spotlight-bento-card.span-2 {
      grid-column: span 2;
    }

    @media (max-width: 900px) {
      .spotlight-bento-card.span-2 {
        grid-column: span 1;
      }
    }

    /* 1px Illuminated Border via Cursor-Tracking Spotlight */
    .spotlight-bento-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: radial-gradient(
        360px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px),
        rgba(56, 189, 248, 0.35) 0%,
        rgba(249, 115, 22, 0.15) 45%,
        transparent 80%
      );
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      opacity: var(--spotlight-opacity, 0);
      transition: opacity 0.35s ease;
      z-index: 2;
    }

    /* Interior Ambient Glow */
    .spotlight-bento-card .bento-ambient-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        420px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px),
        rgba(56, 189, 248, 0.08) 0%,
        transparent 70%
      );
      pointer-events: none;
      opacity: var(--spotlight-opacity, 0);
      transition: opacity 0.35s ease;
      z-index: 1;
    }

    .bento-card-content {
      position: relative;
      z-index: 3;
    }

    .bento-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .bento-tag {
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      color: var(--c-amber, #f59e0b);
      text-transform: uppercase;
    }

    .bento-coord-readout {
      font-family: var(--font-mono, monospace);
      font-size: 0.7rem;
      color: var(--t-muted, #64748b);
      background: rgba(0, 0, 0, 0.35);
      padding: 0.2rem 0.5rem;
      border-radius: var(--r-ctl, 6px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .bento-card-title {
      font-family: var(--font-display, sans-serif);
      font-size: 1.25rem;
      color: var(--t-primary, #ffffff);
      margin-bottom: 0.45rem;
    }

    .bento-card-desc {
      font-size: 0.86rem;
      color: var(--t-secondary, #94a3b8);
      line-height: 1.55;
      margin-bottom: 0.9rem;
    }

    .bento-stat-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* --------------------------------------------------------------------------
       4. PinContainer3D (Aceternity UI)
       -------------------------------------------------------------------------- */
    .pin-stage-wrapper {
      position: relative;
      width: 100%;
      min-height: 380px;
      background: radial-gradient(circle at 50% 40%, #0d111a 0%, #06080c 100%);
      border: 1px solid var(--c-cobalt-rim, rgba(255, 255, 255, 0.08));
      border-radius: var(--r-inner, 14px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      perspective: var(--pin-perspective, 1000px);
      padding: 2.5rem 1rem;
    }

    .pin-3d-card {
      position: relative;
      width: 340px;
      padding: 1.8rem;
      background: var(--c-elevated-zinc, #121520);
      border: 1px solid var(--c-hairline-bright, rgba(255, 255, 255, 0.14));
      border-radius: var(--r-card, 18px);
      color: #ffffff;
      transform-style: preserve-3d;
      transform: rotateX(var(--pin-rot-x, 0deg)) rotateY(var(--pin-rot-y, 0deg)) translateZ(var(--pin-trans-z, 0px));
      transition: transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
      cursor: grab;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(249, 115, 22, 0.15);
      user-select: none;
    }

    .pin-3d-card:active {
      cursor: grabbing;
    }

    .pin-3d-content {
      transform: translateZ(32px);
      transform-style: preserve-3d;
    }

    .pin-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .pin-laser-stem {
      position: absolute;
      bottom: -46px;
      left: 50%;
      transform: translateX(-50%) translateZ(24px);
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    }

    .pin-laser-beam {
      width: 2px;
      height: 46px;
      background: linear-gradient(to bottom, var(--c-ember, #f97316), rgba(249, 115, 22, 0.1));
      box-shadow: 0 0 8px var(--c-ember, #f97316);
    }

    .pin-radar-anchor {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pin-radar-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--c-ember, #f97316);
      box-shadow: 0 0 12px var(--c-ember, #f97316);
      z-index: 2;
    }

    .pin-radar-ring {
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid var(--c-ember, #f97316);
      animation: pinRadarPulse 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }

    .pin-radar-ring.ring-delay {
      animation-delay: 1.1s;
    }

    @keyframes pinRadarPulse {
      0% {
        transform: scale(0.3);
        opacity: 0.95;
      }
      100% {
        transform: scale(3.2);
        opacity: 0;
      }
    }

    /* Reduced Motion Fallbacks */
    @media (prefers-reduced-motion: reduce) {
      .beam-path-pulse,
      .magic-ripple-ring,
      .pin-radar-ring {
        animation: none !important;
        opacity: 0.5 !important;
      }
      .pin-3d-card {
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(styleEl);
}

/**
 * Builds and injects the interactive HTML stage if not present inside #section-motion-lab
 */
function ensureStageDOM() {
  const parentSection = document.getElementById('section-motion-lab');
  if (!parentSection) {
    console.warn('[MagicUI] Target container #section-motion-lab not found in document.');
    return null;
  }

  let stageContainer = document.getElementById('magicui-aceternity-stage');
  if (stageContainer) {
    return stageContainer;
  }

  // Create clean, production-grade markup
  stageContainer = document.createElement('div');
  stageContainer.id = 'magicui-aceternity-stage';
  stageContainer.className = 'magic-stage-section';
  stageContainer.innerHTML = `
    <!-- Magic UI & Aceternity Section Header -->
    <div class="liquid-glass-card" style="margin-bottom: 2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
        <div>
          <span class="meta-tag" style="margin-bottom:0.5rem; border-color:rgba(56,189,248,0.3); color:var(--c-sapphire);">
            Frontier Registries · Magic UI &amp; Aceternity UI
          </span>
          <h2 class="section-title" style="font-size:1.8rem;">Spatial &amp; Kinetic Primitives Stage</h2>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem; font-family:var(--font-mono); font-size:0.8rem;">
          <span class="meta-tag" style="background:var(--c-obsidian);">SVG BEZIER</span>
          <span class="meta-tag" style="background:var(--c-obsidian);">3D PERSPECTIVE</span>
          <span class="meta-tag" style="background:var(--c-obsidian);">RADIAL SPOTLIGHT</span>
        </div>
      </div>
      <p style="color:var(--t-secondary); max-width:920px; font-size:1rem; line-height:1.6;">
        Live, interactive implementations of signature motion primitives synthesized from Magic UI and Aceternity UI.
        Featuring SVG cubic bezier animated beam packet dispatch, 3D perspective card pin hovering with laser anchors,
        cursor-tracking radial spotlight border highlights on bento cards, and concentric exponential ripple pulses.
      </p>
    </div>

    <!-- Row 1: AnimatedBeam & RippleEffect -->
    <div class="magic-grid-2col">
      
      <!-- 1. AnimatedBeam (Magic UI) -->
      <div class="liquid-glass-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
            <span class="meta-tag">Magic UI · AnimatedBeam</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-ember);">CUBIC BEZIER PACKETS</span>
          </div>
          <h3 style="font-family:var(--font-display); font-size:1.35rem; color:var(--t-primary); margin-bottom:0.4rem;">
            Animated Beam &amp; Packet Dispatch
          </h3>
          <p style="font-size:0.88rem; color:var(--t-secondary); margin-bottom:1.2rem;">
            Dynamic SVG cubic bezier curve connecting two nodes transmitting glowing data packets with gradient animations. Click dispatch to launch high-speed packet.
          </p>

          <!-- Beam Stage -->
          <div class="beam-stage-container" id="magic-beam-container" aria-label="Animated Beam Transmission Stage">
            <!-- Origin Node -->
            <div class="beam-node-card" id="beam-node-origin">
              <div class="beam-node-icon" aria-hidden="true" style="font-family:var(--font-mono); font-size:0.75rem; font-weight:800; color:var(--c-ember);">TX</div>
              <span class="beam-node-label">Edge Worker</span>
              <span class="beam-node-sub">127.0.0.1:3000</span>
            </div>

            <!-- SVG Bezier Path Layer -->
            <svg class="beam-svg-layer" id="magic-beam-svg" aria-hidden="true">
              <defs>
                <linearGradient id="magic-beam-grad" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#f97316" stop-opacity="0"></stop>
                  <stop offset="50%" stop-color="#ffedd5" stop-opacity="1"></stop>
                  <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
              <!-- Background static guide track -->
              <path id="magic-beam-bg" class="beam-path-bg" d=""></path>
              <!-- Ambient pulsating beam -->
              <path id="magic-beam-pulse" class="beam-path-pulse" d=""></path>
              <!-- Dynamic flying packet circle -->
              <circle id="magic-beam-packet" class="beam-packet-dot" cx="-20" cy="-20" r="5"></circle>
            </svg>

            <!-- Target Node -->
            <div class="beam-node-card" id="beam-node-target">
              <div class="beam-node-icon" aria-hidden="true" style="font-family:var(--font-mono); font-size:0.75rem; font-weight:800; color:var(--c-sapphire);">RX</div>
              <span class="beam-node-label">Council Auditor</span>
              <span class="beam-node-sub">MicroVM Chromium</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1rem; display:flex; flex-direction:column; gap:0.9rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:0.78rem; color:var(--t-secondary);">
            <span>Packets Dispatched: <strong id="beam-packets-count" style="color:var(--c-ember);">0</strong></span>
            <span>Telemetry: <strong id="beam-telemetry-status" style="color:var(--c-sapphire);">LINK SYNCHRONIZED</strong></span>
          </div>

          <div class="grid-2col" style="gap:0.8rem;">
            <div class="control-slider-group">
              <label for="beam-speed-slider"><span>Beam Travel Speed</span><span id="beam-speed-val">2.2s</span></label>
              <input type="range" id="beam-speed-slider" min="0.8" max="4.0" step="0.2" value="2.2" aria-label="Animated beam travel speed in seconds">
            </div>
            <div class="control-slider-group">
              <label for="beam-color-select"><span>Packet Chromatic Glow</span></label>
              <select id="beam-color-select" class="custom-select" aria-label="Beam pulse color scheme">
                <option value="ember">Ember &amp; Sapphire</option>
                <option value="sapphire">Pure Cobalt Blue</option>
                <option value="emerald">Phosphor Emerald</option>
              </select>
            </div>
          </div>

          <button id="dispatch-beam-packet-btn" class="nav-tab-btn" aria-label="Dispatch high-speed data pulse packet" style="background:var(--c-ember); color:#fff; width:100%; min-height:44px; padding:0.65rem; font-size:0.85rem; border:none; border-radius:var(--r-ctl); font-weight:600; cursor:pointer;">
            Dispatch Pulse Packet
          </button>
        </div>
      </div>

      <!-- 2. RippleEffect (Magic UI) -->
      <div class="liquid-glass-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
            <span class="meta-tag">Magic UI · RippleEffect</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber);">EXPONENTIAL RADIAL DECAY</span>
          </div>
          <h3 style="font-family:var(--font-display); font-size:1.35rem; color:var(--t-primary); margin-bottom:0.4rem;">
            Concentric Ripple Pulsar
          </h3>
          <p style="font-size:0.88rem; color:var(--t-secondary); margin-bottom:1.2rem;">
            Concentric circular ripple rings pulsing outward with staggered delays and exponential opacity decay. Click stage or trigger button to fire an instant radial shockwave.
          </p>

          <!-- Ripple Stage -->
          <div class="ripple-stage-box" id="magic-ripple-stage" aria-label="Concentric Ripple Pulsar Stage" title="Click anywhere to ignite ripple shockwave">
            <div class="ripple-rings-layer" id="magic-ripple-rings-wrap" aria-hidden="true">
              <div class="magic-ripple-ring" style="--ring-idx: 0;"></div>
              <div class="magic-ripple-ring" style="--ring-idx: 1;"></div>
              <div class="magic-ripple-ring" style="--ring-idx: 2;"></div>
              <div class="magic-ripple-ring" style="--ring-idx: 3;"></div>
              <div class="magic-ripple-ring" style="--ring-idx: 4;"></div>
            </div>

            <!-- Central Core Pulse Button -->
            <button class="ripple-center-node" id="magic-ripple-trigger-btn" aria-label="Trigger center pulse burst">
              <div class="ripple-center-core"></div>
              <span class="ripple-center-txt">PULSE</span>
            </button>
          </div>
        </div>

        <!-- Controls -->
        <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1rem; display:flex; flex-direction:column; gap:0.9rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-family:var(--font-mono); font-size:0.78rem; color:var(--t-secondary);">
            <span>Shockwave Bursts: <strong id="ripple-burst-count" style="color:var(--c-amber);">0</strong></span>
            <span>Decay Function: <strong style="color:var(--c-ember);">Exponential (Cubic)</strong></span>
          </div>

          <div class="grid-2col" style="gap:0.8rem;">
            <div class="control-slider-group">
              <label for="ripple-rings-slider"><span>Concentric Rings</span><span id="ripple-rings-val">5 Rings</span></label>
              <input type="range" id="ripple-rings-slider" min="3" max="8" step="1" value="5" aria-label="Number of concentric ripple rings">
            </div>
            <div class="control-slider-group">
              <label for="ripple-speed-slider"><span>Cycle Duration</span><span id="ripple-speed-val">3.2s</span></label>
              <input type="range" id="ripple-speed-slider" min="1.6" max="6.0" step="0.2" value="3.2" aria-label="Ripple cycle duration in seconds">
            </div>
          </div>

          <button id="trigger-ripple-shockwave-btn" class="nav-tab-btn" aria-label="Trigger instant ripple shockwave" style="background:var(--c-elevated-zinc); border:1px solid var(--c-cobalt-rim); color:var(--c-amber); width:100%; min-height:44px; padding:0.65rem; font-size:0.85rem; border-radius:var(--r-ctl); font-weight:600; cursor:pointer;">
            Ignite Shockwave Burst
          </button>
        </div>
      </div>

    </div>

    <!-- Row 2: SpotlightBento & PinContainer3D -->
    <div style="margin-bottom: 2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span class="meta-tag">Aceternity UI · Spotlight Bento Grid</span>
          <h3 style="font-family:var(--font-display); font-size:1.45rem; color:var(--t-primary); margin-top:0.35rem;">
            Radial Spotlight Bento Card Illumination
          </h3>
        </div>
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--t-muted);">
          1PX BORDER ILLUMINATION · POINTERMOVE TRACKER
        </span>
      </div>

      <!-- Spotlight Bento Grid -->
      <div class="spotlight-bento-grid" id="magic-spotlight-bento">
        
        <!-- Bento Card 1 (Span 2) -->
        <div class="spotlight-bento-card span-2" tabindex="0">
          <div class="bento-ambient-glow" aria-hidden="true"></div>
          <div class="bento-card-content">
            <div class="bento-header-row">
              <span class="bento-tag">01 · DISTRIBUTED ARCHITECTURE</span>
              <span class="bento-coord-readout">hover card</span>
            </div>
            <h4 class="bento-card-title">Vercel MicroVM Chromium Feedback Loop</h4>
            <p class="bento-card-desc">
              Closed-loop visual hill-climbing evaluated inside cloud Chromium microVMs. Perceptual diffing extracts bounded sub-crops with sub-800ms latency to eliminate AI slop before human QA.
            </p>
            <div class="bento-stat-chips">
              <span class="meta-tag">&lt; 800ms Capture</span>
              <span class="meta-tag">390px / 1440px Parity</span>
              <span class="meta-tag" style="color:var(--c-phosphor);">SSIM Diff Bounding</span>
            </div>
          </div>
        </div>

        <!-- Bento Card 2 (Span 1) -->
        <div class="spotlight-bento-card" tabindex="0">
          <div class="bento-ambient-glow" aria-hidden="true"></div>
          <div class="bento-card-content">
            <div class="bento-header-row">
              <span class="bento-tag">02 · SHADERS</span>
              <span class="bento-coord-readout">hover card</span>
            </div>
            <h4 class="bento-card-title">Khronos PBR Neutral</h4>
            <p class="bento-card-desc">
              Deterministic colorimetry preserving saturated brand packaging prints without highlight burnout or desaturation.
            </p>
            <div class="bento-stat-chips">
              <span class="meta-tag">Three.js r170+</span>
              <span class="meta-tag" style="color:var(--c-sapphire);">Zero Burnout</span>
            </div>
          </div>
        </div>

        <!-- Bento Card 3 (Span 1) -->
        <div class="spotlight-bento-card" tabindex="0">
          <div class="bento-ambient-glow" aria-hidden="true"></div>
          <div class="bento-card-content">
            <div class="bento-header-row">
              <span class="bento-tag">03 · CODEX</span>
              <span class="bento-coord-readout">hover card</span>
            </div>
            <h4 class="bento-card-title">Adversarial Jester</h4>
            <p class="bento-card-desc">
              Contrarian quality gatekeeper hunting visual overflow, fake drop shadows, and cooperative model inflation.
            </p>
            <div class="bento-stat-chips">
              <span class="meta-tag" style="color:var(--c-amber);">Hard Veto Active</span>
            </div>
          </div>
        </div>

        <!-- Bento Card 4 (Span 2) -->
        <div class="spotlight-bento-card span-2" tabindex="0">
          <div class="bento-ambient-glow" aria-hidden="true"></div>
          <div class="bento-card-content">
            <div class="bento-header-row">
              <span class="bento-tag">04 · TACTILE PHYSICS</span>
              <span class="bento-coord-readout">hover card</span>
            </div>
            <h4 class="bento-card-title">Optical Acrylic Refraction &amp; Concentric Radii</h4>
            <p class="bento-card-desc">
              Mathematical material depth constructed with concentric radii (radius_inner = radius_outer - padding) and 1px specular hairlines, completely replacing muddy blurred drop shadows.
            </p>
            <div class="bento-stat-chips">
              <span class="meta-tag">r_in = r_out - p</span>
              <span class="meta-tag">18.9:1 WCAG AAA</span>
              <span class="meta-tag" style="color:var(--c-ember);">Specular Refraction</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Row 3: PinContainer3D Interactive Stage -->
    <div class="liquid-glass-card" style="margin-bottom: 2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span class="meta-tag">Aceternity UI · PinContainer3D</span>
          <h3 style="font-family:var(--font-display); font-size:1.45rem; color:var(--t-primary); margin-top:0.35rem;">
            Interactive 3D Perspective Card Pin
          </h3>
        </div>
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-sapphire);">
          PERSPECTIVE: 1000PX · PARALLAX Z-SPACE
        </span>
      </div>
      <p style="font-size:0.88rem; color:var(--t-secondary); margin-bottom:1.5rem; max-width:860px;">
        Hover or drag across the stage below. The card floats in 3D coordinate space with real-time perspective tilt, linked to the floor by a laser stem and pulsating concentric radar beacon.
      </p>

      <!-- 3D Pin Stage Wrapper -->
      <div class="pin-stage-wrapper" id="magic-pin-stage" aria-label="3D Perspective Pin Stage">
        
        <div class="pin-3d-card" id="magic-pin-card" tabindex="0" role="region" aria-label="3D Perspective Pin Card">
          <div class="pin-3d-content">
            <div class="pin-badge-row">
              <span class="meta-tag" style="color:var(--c-ember); border-color:rgba(249,115,22,0.3);">3D PIN HOVER</span>
              <span id="pin-tilt-readout" style="font-family:var(--font-mono); font-size:0.72rem; color:var(--t-muted);">0.0°, 0.0°</span>
            </div>
            <h4 style="font-family:var(--font-display); font-size:1.35rem; color:#fff; margin-bottom:0.5rem;">
              Autonomous Creative Engine
            </h4>
            <p style="font-size:0.84rem; color:var(--t-secondary); line-height:1.55; margin-bottom:1rem;">
              Physical precision over generative slop. Precision registered WebGPU canvas with Khronos PBR Neutral tone mapping and headless Blender 5.2 MCP socket automation.
            </p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <span class="meta-tag">60 FPS Locked</span>
              <span class="meta-tag">Parallax Z: 32px</span>
            </div>
          </div>

          <!-- Laser Stem & Radar Pin Anchor -->
          <div class="pin-laser-stem" aria-hidden="true">
            <div class="pin-laser-beam"></div>
            <div class="pin-radar-anchor">
              <div class="pin-radar-dot"></div>
              <div class="pin-radar-ring"></div>
              <div class="pin-radar-ring ring-delay"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- Pin Controls -->
      <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1rem; margin-top:1.25rem;">
        <div class="grid-3col" style="gap:0.8rem;">
          <div class="control-slider-group">
            <label for="pin-persp-slider"><span>Perspective Depth</span><span id="pin-persp-val">1000px</span></label>
            <input type="range" id="pin-persp-slider" min="500" max="1800" step="50" value="1000" aria-label="3D perspective depth in pixels">
          </div>
          <div class="control-slider-group">
            <label for="pin-tilt-slider"><span>Max Tilt Angle</span><span id="pin-tilt-val">20&deg;</span></label>
            <input type="range" id="pin-tilt-slider" min="8" max="36" step="2" value="20" aria-label="Maximum tilt angle in degrees">
          </div>
          <div style="display:flex; align-items:flex-end;">
            <button id="pin-reset-btn" class="nav-tab-btn" aria-label="Reset 3D card tilt orientation" style="background:var(--c-elevated-zinc); border:1px solid var(--c-cobalt-rim); color:var(--t-secondary); width:100%; min-height:44px; padding:0.65rem; font-size:0.85rem; border-radius:var(--r-ctl); cursor:pointer;">
              Reset 3D Tilt
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  parentSection.appendChild(stageContainer);
  return stageContainer;
}

/**
 * 1. AnimatedBeam (Magic UI)
 * Dynamic SVG cubic bezier curve connecting two nodes + packet dispatch animation
 */
function initAnimatedBeam() {
  const container = document.getElementById('magic-beam-container');
  const origin = document.getElementById('beam-node-origin');
  const target = document.getElementById('beam-node-target');
  const pathBg = document.getElementById('magic-beam-bg');
  const pathPulse = document.getElementById('magic-beam-pulse');
  const packetDot = document.getElementById('magic-beam-packet');
  const dispatchBtn = document.getElementById('dispatch-beam-packet-btn');
  const speedSlider = document.getElementById('beam-speed-slider');
  const speedVal = document.getElementById('beam-speed-val');
  const colorSelect = document.getElementById('beam-color-select');
  const packetsCountEl = document.getElementById('beam-packets-count');
  const telemetryStatusEl = document.getElementById('beam-telemetry-status');
  const grad = document.getElementById('magic-beam-grad');

  if (!container || !origin || !target || !pathBg || !pathPulse) return;

  function updateCurve() {
    const cRect = container.getBoundingClientRect();
    const oRect = origin.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();

    if (cRect.width === 0 || cRect.height === 0) return;

    const startX = oRect.right - cRect.left;
    const startY = oRect.top + oRect.height / 2 - cRect.top;
    const endX = tRect.left - cRect.left;
    const endY = tRect.top + tRect.height / 2 - cRect.top;

    const dx = endX - startX;
    const controlX1 = startX + dx * 0.42;
    const controlY1 = startY - 48;
    const controlX2 = startX + dx * 0.58;
    const controlY2 = endY + 48;

    const d = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
    pathBg.setAttribute('d', d);
    pathPulse.setAttribute('d', d);

    if (grad) {
      grad.setAttribute('x1', `${startX}`);
      grad.setAttribute('y1', `${startY}`);
      grad.setAttribute('x2', `${endX}`);
      grad.setAttribute('y2', `${endY}`);
    }
  }

  // Initial calculation + resize listener
  updateCurve();
  window.addEventListener('resize', updateCurve);

  // Re-calculate curve when section is shown (e.g. tab switches)
  const motionTabBtn = document.getElementById('tab-motion-lab');
  if (motionTabBtn) {
    motionTabBtn.addEventListener('click', () => {
      setTimeout(updateCurve, 60);
      setTimeout(updateCurve, 200);
    });
  }

  // Beam Speed Slider
  if (speedSlider) {
    speedSlider.addEventListener('input', () => {
      const spd = parseFloat(speedSlider.value);
      state.beam.speed = spd;
      if (speedVal) speedVal.textContent = `${spd.toFixed(1)}s`;
      pathPulse.style.setProperty('--beam-anim-speed', `${spd}s`);
    });
  }

  // Chromatic Color Selector
  if (colorSelect && grad) {
    colorSelect.addEventListener('change', () => {
      const mode = colorSelect.value;
      const stops = grad.querySelectorAll('stop');
      if (stops.length >= 3) {
        if (mode === 'sapphire') {
          stops[0].setAttribute('stop-color', '#0284c7');
          stops[1].setAttribute('stop-color', '#38bdf8');
          stops[2].setAttribute('stop-color', '#bae6fd');
          if (packetDot) packetDot.setAttribute('fill', '#38bdf8');
        } else if (mode === 'emerald') {
          stops[0].setAttribute('stop-color', '#059669');
          stops[1].setAttribute('stop-color', '#34d399');
          stops[2].setAttribute('stop-color', '#a7f3d0');
          if (packetDot) packetDot.setAttribute('fill', '#10b981');
        } else {
          // Ember
          stops[0].setAttribute('stop-color', '#f97316');
          stops[1].setAttribute('stop-color', '#ffedd5');
          stops[2].setAttribute('stop-color', '#38bdf8');
          if (packetDot) packetDot.setAttribute('fill', '#ffedd5');
        }
      }
    });
  }

  // Packet Dispatch Animation
  function dispatchPacket() {
    if (state.beam.isDispatching) return;
    state.beam.isDispatching = true;
    state.beam.packetsSent++;

    if (packetsCountEl) packetsCountEl.textContent = state.beam.packetsSent;
    if (telemetryStatusEl) {
      telemetryStatusEl.textContent = 'PACKET IN FLIGHT...';
      telemetryStatusEl.style.color = 'var(--c-amber)';
    }

    origin.classList.add('node-active');
    setTimeout(() => origin.classList.remove('node-active'), 250);

    const totalLen = pathPulse.getTotalLength();
    if (!totalLen || totalLen === 0) {
      state.beam.isDispatching = false;
      return;
    }

    const duration = 750; // ms transit time
    const startTime = performance.now();
    packetDot.classList.add('in-transit');

    function animatePacket(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      
      // Easing: cubic-bezier-like smooth progression
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const pt = pathPulse.getPointAtLength(ease * totalLen);
      packetDot.setAttribute('cx', `${pt.x}`);
      packetDot.setAttribute('cy', `${pt.y}`);

      if (progress < 1.0) {
        requestAnimationFrame(animatePacket);
      } else {
        // Target Arrival
        packetDot.classList.remove('in-transit');
        packetDot.setAttribute('cx', '-20');
        packetDot.setAttribute('cy', '-20');
        state.beam.isDispatching = false;

        target.classList.add('node-active');
        setTimeout(() => target.classList.remove('node-active'), 350);

        if (telemetryStatusEl) {
          const latency = (Math.random() * 6 + 12).toFixed(1);
          telemetryStatusEl.textContent = `ACK RECEIVED (${latency}ms)`;
          telemetryStatusEl.style.color = 'var(--c-phosphor)';
          setTimeout(() => {
            if (telemetryStatusEl && !state.beam.isDispatching) {
              telemetryStatusEl.textContent = 'LINK SYNCHRONIZED';
              telemetryStatusEl.style.color = 'var(--c-sapphire)';
            }
          }, 2400);
        }

        if (typeof window.logToTerminal === 'function') {
          window.logToTerminal(`[MagicUI AnimatedBeam] Packet #${state.beam.packetsSent} delivered to Council Auditor`, 'info');
        }
      }
    }

    requestAnimationFrame(animatePacket);
  }

  if (dispatchBtn) {
    dispatchBtn.addEventListener('click', dispatchPacket);
  }
}

/**
 * 2. RippleEffect (Magic UI)
 * Concentric circular ripple rings pulsing outward with staggered delays + burst shockwaves
 */
function initRippleEffect() {
  const stage = document.getElementById('magic-ripple-stage');
  const ringsWrap = document.getElementById('magic-ripple-rings-wrap');
  const centerBtn = document.getElementById('magic-ripple-trigger-btn');
  const shockwaveBtn = document.getElementById('trigger-ripple-shockwave-btn');
  const burstCountEl = document.getElementById('ripple-burst-count');
  const ringsSlider = document.getElementById('ripple-rings-slider');
  const ringsVal = document.getElementById('ripple-rings-val');
  const speedSlider = document.getElementById('ripple-speed-slider');
  const speedVal = document.getElementById('ripple-speed-val');

  if (!stage || !ringsWrap) return;

  function renderRings() {
    ringsWrap.innerHTML = '';
    const count = state.ripple.rings;
    for (let i = 0; i < count; i++) {
      const ring = document.createElement('div');
      ring.className = 'magic-ripple-ring';
      ring.style.setProperty('--ring-idx', `${i}`);
      ring.style.setProperty('--ring-total', `${count}`);
      ring.style.setProperty('--ripple-duration', `${state.ripple.speed}s`);
      ringsWrap.appendChild(ring);
    }
  }

  // Slider Listeners
  if (ringsSlider) {
    ringsSlider.addEventListener('input', () => {
      state.ripple.rings = parseInt(ringsSlider.value, 10);
      if (ringsVal) ringsVal.textContent = `${state.ripple.rings} Rings`;
      renderRings();
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', () => {
      state.ripple.speed = parseFloat(speedSlider.value);
      if (speedVal) speedVal.textContent = `${state.ripple.speed.toFixed(1)}s`;
      const allRings = ringsWrap.querySelectorAll('.magic-ripple-ring');
      allRings.forEach(ring => {
        ring.style.setProperty('--ripple-duration', `${state.ripple.speed}s`);
      });
    });
  }

  // Interactive Shockwave Burst Function
  function igniteShockwave(clientX, clientY) {
    state.ripple.burstCount++;
    if (burstCountEl) burstCountEl.textContent = state.ripple.burstCount;

    const rect = stage.getBoundingClientRect();
    let posX = rect.width / 2;
    let posY = rect.height / 2;

    if (typeof clientX === 'number' && typeof clientY === 'number') {
      posX = clientX - rect.left;
      posY = clientY - rect.top;
    }

    const burstRing = document.createElement('div');
    burstRing.className = 'magic-burst-ring';
    burstRing.style.left = `${posX}px`;
    burstRing.style.top = `${posY}px`;

    stage.appendChild(burstRing);

    burstRing.addEventListener('animationend', () => {
      if (burstRing.parentNode) burstRing.parentNode.removeChild(burstRing);
    });

    if (typeof window.logToTerminal === 'function') {
      window.logToTerminal(`[MagicUI Ripple] Shockwave burst ignited at (${Math.round(posX)}px, ${Math.round(posY)}px)`, 'info');
    }
  }

  // Stage Click Listener (Any coordinate triggers localized burst)
  stage.addEventListener('click', (e) => {
    igniteShockwave(e.clientX, e.clientY);
  });

  if (centerBtn) {
    centerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = stage.getBoundingClientRect();
      igniteShockwave(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  if (shockwaveBtn) {
    shockwaveBtn.addEventListener('click', () => {
      const rect = stage.getBoundingClientRect();
      igniteShockwave(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  renderRings();
}

/**
 * 3. SpotlightBento (Aceternity UI / Magic UI)
 * Cursor-following radial spotlight highlight illuminating 1px card borders
 */
function initSpotlightBento() {
  const container = document.getElementById('magic-spotlight-bento');
  if (!container) return;

  const cards = container.querySelectorAll('.spotlight-bento-card');

  cards.forEach(card => {
    const readout = card.querySelector('.bento-coord-readout');

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
      card.style.setProperty('--spotlight-opacity', '1');

      if (readout) {
        readout.textContent = `X: ${Math.round(x)}px, Y: ${Math.round(y)}px`;
        readout.style.color = 'var(--c-sapphire)';
      }
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--spotlight-opacity', '0');
      if (readout) {
        readout.textContent = 'hover card';
        readout.style.color = 'var(--t-muted)';
      }
    });

    // Keyboard Focus Support for Accessibility
    card.addEventListener('focus', () => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spotlight-x', `${rect.width / 2}px`);
      card.style.setProperty('--spotlight-y', `${rect.height / 2}px`);
      card.style.setProperty('--spotlight-opacity', '1');
    });

    card.addEventListener('blur', () => {
      card.style.setProperty('--spotlight-opacity', '0');
    });
  });
}

/**
 * 4. PinContainer3D (Aceternity UI)
 * Interactive 3D perspective card pin hovering in 3D coordinate space with tilt & laser anchor
 */
function initPinContainer3D() {
  const stage = document.getElementById('magic-pin-stage');
  const card = document.getElementById('magic-pin-card');
  const tiltReadout = document.getElementById('pin-tilt-readout');
  const perspSlider = document.getElementById('pin-persp-slider');
  const perspVal = document.getElementById('pin-persp-val');
  const tiltSlider = document.getElementById('pin-tilt-slider');
  const tiltVal = document.getElementById('pin-tilt-val');
  const resetBtn = document.getElementById('pin-reset-btn');

  if (!stage || !card) return;

  // Pointer Move Tilt Physics
  function handlePointerMove(e) {
    const rect = stage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = (e.clientX - centerX) / (rect.width / 2); // -1.0 to 1.0
    const normY = (e.clientY - centerY) / (rect.height / 2); // -1.0 to 1.0

    const clampedX = Math.max(-1, Math.min(1, normX));
    const clampedY = Math.max(-1, Math.min(1, normY));

    // Inverted Y produces natural perspective tilt
    const rotX = -clampedY * state.pin.maxTilt;
    const rotY = clampedX * state.pin.maxTilt;

    state.pin.currentRotateX = rotX;
    state.pin.currentRotateY = rotY;

    card.style.setProperty('--pin-rot-x', `${rotX.toFixed(2)}deg`);
    card.style.setProperty('--pin-rot-y', `${rotY.toFixed(2)}deg`);
    card.style.setProperty('--pin-trans-z', '24px');

    // Dynamic 3D Box Shadow with Light Source Angle
    const shadowX = (-rotY * 1.5).toFixed(1);
    const shadowY = (rotX * 1.5 + 20).toFixed(1);
    card.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.65), 0 0 24px rgba(249, 115, 22, 0.22)`;

    if (tiltReadout) {
      tiltReadout.textContent = `${rotX.toFixed(1)}°, ${rotY.toFixed(1)}°`;
      tiltReadout.style.color = 'var(--c-ember)';
    }
  }

  function handlePointerLeave() {
    state.pin.currentRotateX = 0;
    state.pin.currentRotateY = 0;

    card.style.setProperty('--pin-rot-x', '0deg');
    card.style.setProperty('--pin-rot-y', '0deg');
    card.style.setProperty('--pin-trans-z', '0px');
    card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(249, 115, 22, 0.15)';

    if (tiltReadout) {
      tiltReadout.textContent = '0.0°, 0.0°';
      tiltReadout.style.color = 'var(--t-muted)';
    }
  }

  stage.addEventListener('pointermove', handlePointerMove);
  stage.addEventListener('pointerleave', handlePointerLeave);

  // Sliders
  if (perspSlider) {
    perspSlider.addEventListener('input', () => {
      const p = parseInt(perspSlider.value, 10);
      state.pin.perspective = p;
      if (perspVal) perspVal.textContent = `${p}px`;
      stage.style.setProperty('--pin-perspective', `${p}px`);
    });
  }

  if (tiltSlider) {
    tiltSlider.addEventListener('input', () => {
      const t = parseInt(tiltSlider.value, 10);
      state.pin.maxTilt = t;
      if (tiltVal) tiltVal.textContent = `${t}°`;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', handlePointerLeave);
  }
}

/**
 * Master initialization function for Magic UI & Aceternity Playground
 */
export function initMagicUIPlayground() {
  if (typeof document === 'undefined') return;

  try {
    injectStyles();
    const stage = ensureStageDOM();
    if (!stage) return;

    initAnimatedBeam();
    initRippleEffect();
    initSpotlightBento();
    initPinContainer3D();

    if (typeof window !== 'undefined') {
      window._magicUIInitialized = true;
    }
  } catch (err) {
    console.error('[MagicUI] Initialization failed:', err);
  }
}

// Global hook if running in browser script context
if (typeof window !== 'undefined') {
  window.initMagicUIPlayground = initMagicUIPlayground;
}
