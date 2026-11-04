/**
 * Apple Tahoe Liquid Glass Optical Refraction Module
 * 
 * Standardized for 2026 Frontier UI:
 * - Procedural SVG normal displacement with feTurbulence & feDisplacementMap (scale 16)
 * - Dynamic tactile specular reflection via feSpecularLighting (surfaceScale 2, specularConstant 1.8) and fePointLight
 * - Dynamic fluid shear: feDisplacementMap scale modulated by cursor velocity
 * - Chromatic RGB split on hover: red and blue channel offset shift
 * - Strict isolated foreground typography (isolation: isolate; z-index: 2) to eliminate text distortion
 * - Accessible fallback for prefers-reduced-motion and non-supporting environments
 */

export function initLiquidGlass() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Query SVG Filter primitives
  const filterLens = document.getElementById('liquid-glass-lens');
  const pointLight = document.getElementById('liquid-glass-point-light') || 
                     document.querySelector('#liquid-glass-lens fePointLight');
  const displacementNode = document.getElementById('liquid-glass-displacement') || 
                           document.querySelector('#liquid-glass-lens feDisplacementMap');
  const redOffsetNode = document.getElementById('liquid-glass-red-offset');
  const blueOffsetNode = document.getElementById('liquid-glass-blue-offset');
  const specularLighting = document.querySelector('#liquid-glass-lens feSpecularLighting');

  // Configure baseline filter parameters
  const BASE_SCALE = 16.0;
  const BASE_LIGHT_X = -50;
  const BASE_LIGHT_Y = -100;
  const BASE_LIGHT_Z = 200;

  if (specularLighting) {
    specularLighting.setAttribute('surfaceScale', '2');
    specularLighting.setAttribute('specularConstant', '1.8');
  }

  if (displacementNode && !displacementNode.getAttribute('scale')) {
    displacementNode.setAttribute('scale', BASE_SCALE.toString());
  }

  // Accessibility Check: prefers-reduced-motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = motionQuery.matches;

  function updateMotionPreference(e) {
    isReducedMotion = e.matches;
    if (isReducedMotion) {
      if (displacementNode) displacementNode.setAttribute('scale', '0');
      if (redOffsetNode) redOffsetNode.setAttribute('dx', '0');
      if (blueOffsetNode) blueOffsetNode.setAttribute('dx', '0');
      document.body.classList.add('glass-reduced-motion');
    } else {
      if (displacementNode) displacementNode.setAttribute('scale', BASE_SCALE.toString());
      document.body.classList.remove('glass-reduced-motion');
    }
  }

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', updateMotionPreference);
  } else if (motionQuery.addListener) {
    motionQuery.addListener(updateMotionPreference);
  }
  updateMotionPreference(motionQuery);

  // Velocity & Spring Dynamics State
  let lastClientX = 0;
  let lastClientY = 0;
  let lastTimestamp = performance.now();
  let currentVelocity = 0;
  let targetScale = BASE_SCALE;
  let currentScale = BASE_SCALE;
  let targetRedDx = 0;
  let currentRedDx = 0;
  let targetBlueDx = 0;
  let currentBlueDx = 0;
  let isHoveringAny = false;
  let animFrameId = null;

  // Spring animation loop for fluid shear & chromatic recovery
  function springTick() {
    if (isReducedMotion) return;

    // Decay velocity
    currentVelocity *= 0.88;
    if (currentVelocity < 0.001) currentVelocity = 0;

    // Smooth lerp for displacement scale (fluid shear effect)
    currentScale += (targetScale - currentScale) * 0.15;
    if (displacementNode) {
      displacementNode.setAttribute('scale', currentScale.toFixed(2));
    }

    // Smooth lerp for chromatic RGB split offsets
    currentRedDx += (targetRedDx - currentRedDx) * 0.2;
    currentBlueDx += (targetBlueDx - currentBlueDx) * 0.2;

    if (redOffsetNode) {
      redOffsetNode.setAttribute('dx', currentRedDx.toFixed(2));
    }
    if (blueOffsetNode) {
      blueOffsetNode.setAttribute('dx', currentBlueDx.toFixed(2));
    }

    // Continue loop if active or values are still decaying
    if (isHoveringAny || Math.abs(currentScale - BASE_SCALE) > 0.05 || Math.abs(currentRedDx) > 0.05) {
      animFrameId = requestAnimationFrame(springTick);
    } else {
      if (displacementNode) displacementNode.setAttribute('scale', BASE_SCALE.toString());
      if (redOffsetNode) redOffsetNode.setAttribute('dx', '0');
      if (blueOffsetNode) blueOffsetNode.setAttribute('dx', '0');
      animFrameId = null;
    }
  }

  function startSpringLoop() {
    if (!animFrameId && !isReducedMotion) {
      animFrameId = requestAnimationFrame(springTick);
    }
  }

  // Handle pointer tracking on interactive liquid glass elements
  function attachElementInteractions(element) {
    if (!element || element.__liquidGlassBound) return;
    element.__liquidGlassBound = true;

    // Ensure accessible layer isolation for children
    element.style.isolation = 'isolate';

    element.addEventListener('mouseenter', () => {
      if (isReducedMotion) return;
      isHoveringAny = true;
      // Trigger chromatic RGB split on hover
      targetRedDx = 2.2;
      targetBlueDx = -2.2;
      startSpringLoop();
    });

    element.addEventListener('mousemove', (e) => {
      if (isReducedMotion) return;
      isHoveringAny = true;

      const rect = element.getBoundingClientRect();
      const now = performance.now();
      const dt = Math.max(1, now - lastTimestamp);
      const dx = e.clientX - lastClientX;
      const dy = e.clientY - lastClientY;
      const dist = Math.hypot(dx, dy);
      
      // Calculate instantaneous cursor velocity (px/ms)
      const instantaneousVelocity = dist / dt;
      currentVelocity = Math.max(currentVelocity, instantaneousVelocity);

      lastClientX = e.clientX;
      lastClientY = e.clientY;
      lastTimestamp = now;

      // Track local normalized coordinates (x, y) from -1 to 1
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Dynamic Specular Highlight: Update fePointLight coordinates
      if (pointLight) {
        const lightX = (normX * 160).toFixed(1);
        const lightY = (normY * 160).toFixed(1);
        const lightZ = (BASE_LIGHT_Z + (1 - Math.hypot(normX, normY)) * 40).toFixed(1);
        pointLight.setAttribute('x', lightX);
        pointLight.setAttribute('y', lightY);
        pointLight.setAttribute('z', lightZ);
      }

      // Fluid shear: dynamically shift displacement scale based on cursor velocity
      const velocityShear = Math.min(12, currentVelocity * 8);
      targetScale = BASE_SCALE + velocityShear;

      // Chromatic separation amplifies during rapid cursor motions
      targetRedDx = 2.2 + Math.min(2.5, currentVelocity * 1.5);
      targetBlueDx = -2.2 - Math.min(2.5, currentVelocity * 1.5);

      startSpringLoop();
    });

    element.addEventListener('mouseleave', () => {
      isHoveringAny = false;
      targetScale = BASE_SCALE;
      targetRedDx = 0;
      targetBlueDx = 0;

      // Smoothly return specular light to neutral position
      if (pointLight && !isReducedMotion) {
        pointLight.setAttribute('x', BASE_LIGHT_X.toString());
        pointLight.setAttribute('y', BASE_LIGHT_Y.toString());
        pointLight.setAttribute('z', BASE_LIGHT_Z.toString());
      }

      startSpringLoop();
    });
  }

  // Bind to all current buttons and cards
  function scanAndBind() {
    const targets = document.querySelectorAll(`
      .liquid-glass-btn, 
      .liquid-glass-card, 
      .flavour-pill, 
      .deck-btn,
      #demo-glass-card
    `);
    targets.forEach(attachElementInteractions);
  }

  scanAndBind();

  // MutationObserver to automatically bind dynamically rendered elements
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      scanAndBind();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  console.log('[LiquidGlass] Optical refraction engine active: 10-layer specular stack, SVG displacement scale 16, chromatic RGB split.');
}

if (typeof window !== 'undefined') {
  window.initLiquidGlass = initLiquidGlass;
}
