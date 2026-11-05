/**
 * Frontier Component Canvas: ShaderGradient Fluid Mesh & Cobe 3D Globe
 * 
 * Production-Grade 2026 Frontier UI Primitive:
 * 1. ShaderGradientFluidCanvas:
 *    - Pure WebGL fragment shader executing domain-warped fractional Brownian motion (fBm)
 *    - Real-time uniforms: u_time, u_resolution, u_mouse, u_color1, u_color2, u_color3, u_speed, u_noise_scale
 *    - Interactive speed slider, noise distortion scale, and 3 chromatic palettes:
 *      * Sapphire Twilight, Sunset Amber, Hyper Violet (+ Emerald Aurora)
 *    - Smooth uniform color lerping during preset switches
 * 
 * 2. CobeGlobe3D:
 *    - Lightweight 3D dot-matrix rotating globe with continental landmass clustering
 *    - Directional diffuse lighting with Lambertian spherical shading
 *    - Pulsing glowing marker telemetry pins (SF, NYC, London, Addis Ababa, Tokyo, Sydney)
 *    - Inertial mouse drag momentum with elastic damping and auto-spin recovery
 * 
 * 3. Performance & Memory:
 *    - IntersectionObserver automatic pause/resume on scroll / off-screen
 *    - Bounded devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2)
 *    - ResizeObserver integration and graceful WebGL context destruction
 */

// ============================================================================
// CONSTANTS & PRESETS
// ============================================================================

export const SHADER_PRESETS = {
  sapphire: {
    name: 'Sapphire Twilight',
    color1: [0.024, 0.043, 0.098], // Deep Obsidian #060b19
    color2: [0.114, 0.306, 0.847], // Electric Cobalt #1d4ed8
    color3: [0.220, 0.741, 0.973], // Luminous Sapphire #38bdf8
    hex1: '#060b19',
    hex2: '#1d4ed8',
    hex3: '#38bdf8'
  },
  amber: {
    name: 'Sunset Amber',
    color1: [0.059, 0.020, 0.008], // Warm Obsidian #0f0502
    color2: [0.851, 0.282, 0.059], // Ember Flare #d9480f
    color3: [0.961, 0.620, 0.043], // Sunset Gold #f59e0b
    hex1: '#0f0502',
    hex2: '#d9480f',
    hex3: '#f59e0b'
  },
  violet: {
    name: 'Hyper Violet',
    color1: [0.039, 0.016, 0.078], // Cosmic Dark #0a0414
    color2: [0.486, 0.227, 0.929], // Deep Violet #7c3aed
    color3: [0.910, 0.475, 0.976], // Neon Fuchsia #e879f9
    hex1: '#0a0414',
    hex2: '#7c3aed',
    hex3: '#e879f9'
  },
  aurora: {
    name: 'Emerald Aurora',
    color1: [0.008, 0.071, 0.039], // Forest Void #02120a
    color2: [0.020, 0.588, 0.412], // Deep Emerald #059669
    color3: [0.204, 0.827, 0.600], // Phosphor Jade #34d399
    hex1: '#02120a',
    hex2: '#059669',
    hex3: '#34d399'
  }
};

export const GLOBE_MARKERS = [
  { id: 'sf', name: 'San Francisco', region: 'US-WEST', lat: 37.7749, lon: -122.4194, color: '#38bdf8' },
  { id: 'nyc', name: 'New York City', region: 'US-EAST', lat: 40.7128, lon: -74.0060, color: '#f59e0b' },
  { id: 'london', name: 'London', region: 'EU-WEST', lat: 51.5074, lon: -0.1278, color: '#a855f7' },
  { id: 'addis', name: 'Addis Ababa', region: 'AF-EAST', lat: 9.0320, lon: 38.7469, color: '#f97316' },
  { id: 'tokyo', name: 'Tokyo', region: 'AP-NORTHEAST', lat: 35.6762, lon: 139.6503, color: '#38bdf8' },
  { id: 'sydney', name: 'Sydney', region: 'AP-SOUTHEAST', lat: -33.8688, lon: 151.2093, color: '#10b981' }
];

// Utility: clamp and lerp
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ============================================================================
// 1. SHADERGRADIENT FLUID CANVAS (PURE WEBGL)
// ============================================================================

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_noise_scale;

  // 2D Simplex Noise & Hash
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float snoise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2
    const float K2 = 0.211324865; // (3-sqrt(3))/6
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  // 4-Octave Fractional Brownian Motion (fBm)
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p = rot * p * 2.0 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    float scale = (u_noise_scale > 0.1) ? u_noise_scale : 3.5;
    vec2 p = (st - 0.5) * vec2(aspect, 1.0) * scale;

    float t = u_time * (u_speed > 0.0 ? u_speed : 1.0) * 0.25;

    // Interactive mouse distortion vector
    vec2 m = (u_mouse / u_resolution - 0.5) * vec2(aspect, 1.0) * scale;
    float dMouse = length(p - m);
    float mouseWave = smoothstep(2.2, 0.0, dMouse) * 0.75;

    // Domain Warping: q = fbm(p), r = fbm(p + q), f = fbm(p + r)
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + vec2(cos(t * 0.75), sin(t * 0.65))),
      fbm(p + vec2(5.2, 1.3) + vec2(-sin(t * 0.55), cos(t * 0.85)))
    );

    vec2 r = vec2(
      fbm(p + 2.5 * q + vec2(1.7, 9.2) + mouseWave * vec2(cos(t), sin(t))),
      fbm(p + 2.5 * q + vec2(8.3, 2.8) - mouseWave * vec2(sin(t), cos(t)))
    );

    float f = fbm(p + 3.2 * r + t * 0.35);

    // Multi-color chromatic mixing using domain-warped coordinates
    float w1 = smoothstep(-0.4, 0.6, f);
    float w2 = smoothstep(-0.2, 0.75, length(q));
    float w3 = smoothstep(0.0, 0.85, length(r.x));

    vec3 col = mix(u_color1, u_color2, w1);
    col = mix(col, u_color3, w2 * 0.88);
    col = mix(col, u_color2 * 1.15, w3 * 0.32);

    // Dynamic fluid specular sheen
    float sheen = pow(max(0.0, f + 0.32), 3.2) * 0.22;
    col += vec3(sheen);

    // Edge vignette for dark-tech presentation depth
    float vig = 1.0 - smoothstep(0.65, 1.45, length(st - 0.5) * 1.3);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export class ShaderGradientFluidCanvas {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = Object.assign({
      preset: 'sapphire',
      speed: 1.0,
      noiseScale: 3.8,
      onFpsUpdate: null
    }, options);

    this.gl = null;
    this.program = null;
    this.buffer = null;
    this.animationFrameId = null;
    this.isRunning = false;
    this.startTime = performance.now();
    this.lastFrameTime = performance.now();
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTimer = performance.now();

    // Uniform values
    this.speed = this.options.speed;
    this.noiseScale = this.options.noiseScale;
    this.targetSpeed = this.speed;
    this.targetNoiseScale = this.noiseScale;

    // Palette states with smooth interpolation
    const initPreset = SHADER_PRESETS[this.options.preset] || SHADER_PRESETS.sapphire;
    this.currentColor1 = [...initPreset.color1];
    this.currentColor2 = [...initPreset.color2];
    this.currentColor3 = [...initPreset.color3];
    this.targetColor1 = [...initPreset.color1];
    this.targetColor2 = [...initPreset.color2];
    this.targetColor3 = [...initPreset.color3];

    // Mouse coordinates (with lerp damping)
    this.mouseTarget = [0, 0];
    this.mouseCurrent = [0, 0];
    this.isHovered = false;

    // Uniform locations cache
    this.uniformLocations = {};

    this.initWebGL();
    this.bindEvents();
  }

  initWebGL() {
    if (!this.canvas) return;

    try {
      this.gl = this.canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        depth: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false
      }) || this.canvas.getContext('experimental-webgl');
    } catch (e) {
      console.warn('[ShaderGradient] WebGL init error:', e);
      return;
    }

    if (!this.gl) {
      console.warn('[ShaderGradient] WebGL is not supported in this environment.');
      return;
    }

    const gl = this.gl;

    // Compile Shaders
    this.vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    this.fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!this.vs || !this.fs) return;

    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('[ShaderGradient] Program link error:', gl.getProgramInfoLog(this.program));
      return;
    }

    gl.useProgram(this.program);

    // Setup full-screen quad geometry
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0
    ]);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform Locations
    this.uniformLocations = {
      u_time: gl.getUniformLocation(this.program, 'u_time'),
      u_resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      u_mouse: gl.getUniformLocation(this.program, 'u_mouse'),
      u_color1: gl.getUniformLocation(this.program, 'u_color1'),
      u_color2: gl.getUniformLocation(this.program, 'u_color2'),
      u_color3: gl.getUniformLocation(this.program, 'u_color3'),
      u_speed: gl.getUniformLocation(this.program, 'u_speed'),
      u_noise_scale: gl.getUniformLocation(this.program, 'u_noise_scale')
    };

    this.resize();
  }

  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[ShaderGradient] Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  bindEvents() {
    if (!this.canvas) return;

    this.onMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const x = (e.clientX - rect.left) * dpr;
      const y = (rect.height - (e.clientY - rect.top)) * dpr; // Invert Y for GL coordinates
      this.mouseTarget = [x, y];
      this.isHovered = true;
    };

    this.onMouseLeave = () => {
      this.isHovered = false;
      // Drift back toward center
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.mouseTarget = [this.canvas.width * 0.5, this.canvas.height * 0.5];
    };

    this.onTouchMove = (e) => {
      if (!e.touches || !e.touches[0]) return;
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const x = (touch.clientX - rect.left) * dpr;
      const y = (rect.height - (touch.clientY - rect.top)) * dpr;
      this.mouseTarget = [x, y];
    };

    this.canvas.addEventListener('mousemove', this.onMouseMove, { passive: true });
    this.canvas.addEventListener('mouseleave', this.onMouseLeave, { passive: true });
    this.canvas.addEventListener('touchmove', this.onTouchMove, { passive: true });
  }

  setPalette(presetKey, immediate = false) {
    const preset = SHADER_PRESETS[presetKey];
    if (!preset) return;

    this.targetColor1 = [...preset.color1];
    this.targetColor2 = [...preset.color2];
    this.targetColor3 = [...preset.color3];

    if (immediate) {
      this.currentColor1 = [...preset.color1];
      this.currentColor2 = [...preset.color2];
      this.currentColor3 = [...preset.color3];
    }
  }

  setSpeed(val) {
    this.targetSpeed = clamp(parseFloat(val) || 1.0, 0.1, 4.0);
  }

  setNoiseScale(val) {
    this.targetNoiseScale = clamp(parseFloat(val) || 3.8, 1.0, 8.0);
  }

  resize() {
    if (!this.canvas || !this.gl) return;

    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || this.canvas.clientWidth || 600;
    const height = rect.height || this.canvas.clientHeight || 380;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2);

    const pixelWidth = Math.max(1, Math.floor(width * dpr));
    const pixelHeight = Math.max(1, Math.floor(height * dpr));

    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
      this.gl.viewport(0, 0, pixelWidth, pixelHeight);
      this.mouseTarget = [pixelWidth * 0.5, pixelHeight * 0.5];
      this.mouseCurrent = [pixelWidth * 0.5, pixelHeight * 0.5];
    }
  }

  render(timestamp = performance.now()) {
    if (!this.gl || !this.program || !this.isRunning) return;

    const gl = this.gl;
    const elapsedSeconds = (timestamp - this.startTime) * 0.001;

    // Smooth uniform lerping
    this.speed = lerp(this.speed, this.targetSpeed, 0.1);
    this.noiseScale = lerp(this.noiseScale, this.targetNoiseScale, 0.1);

    // Smooth color palette transitions (liquid crossfade)
    for (let i = 0; i < 3; i++) {
      this.currentColor1[i] = lerp(this.currentColor1[i], this.targetColor1[i], 0.08);
      this.currentColor2[i] = lerp(this.currentColor2[i], this.targetColor2[i], 0.08);
      this.currentColor3[i] = lerp(this.currentColor3[i], this.targetColor3[i], 0.08);
    }

    // Smooth mouse coordinates interpolation
    this.mouseCurrent[0] = lerp(this.mouseCurrent[0], this.mouseTarget[0], 0.06);
    this.mouseCurrent[1] = lerp(this.mouseCurrent[1], this.mouseTarget[1], 0.06);

    gl.useProgram(this.program);

    // Pass Uniforms
    gl.uniform1f(this.uniformLocations.u_time, elapsedSeconds);
    gl.uniform2f(this.uniformLocations.u_resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniformLocations.u_mouse, this.mouseCurrent[0], this.mouseCurrent[1]);
    gl.uniform3fv(this.uniformLocations.u_color1, this.currentColor1);
    gl.uniform3fv(this.uniformLocations.u_color2, this.currentColor2);
    gl.uniform3fv(this.uniformLocations.u_color3, this.currentColor3);
    gl.uniform1f(this.uniformLocations.u_speed, this.speed);
    gl.uniform1f(this.uniformLocations.u_noise_scale, this.noiseScale);

    // Draw full-screen quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // FPS Meter calculation
    this.frameCount++;
    if (timestamp - this.fpsTimer >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = timestamp;
      if (typeof this.options.onFpsUpdate === 'function') {
        this.options.onFpsUpdate(this.fps);
      }
    }

    this.animationFrameId = requestAnimationFrame((ts) => this.render(ts));
  }

  resume() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.fpsTimer = performance.now();
    this.animationFrameId = requestAnimationFrame((ts) => this.render(ts));
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    this.pause();
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.onMouseMove);
      this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
      this.canvas.removeEventListener('touchmove', this.onTouchMove);
    }
    if (this.gl) {
      if (this.vs) {
        this.gl.deleteShader(this.vs);
        this.vs = null;
      }
      if (this.fs) {
        this.gl.deleteShader(this.fs);
        this.fs = null;
      }
      if (this.program) {
        this.gl.deleteProgram(this.program);
        this.program = null;
      }
      if (this.buffer) {
        this.gl.deleteBuffer(this.buffer);
        this.buffer = null;
      }
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) {
        ext.loseContext();
      }
    }
    this.gl = null;
    this.program = null;
  }
}

// ============================================================================
// 2. COBE GLOBE 3D (3D DOT-MATRIX GLOBE WITH DIFFUSE LIGHTING & DRAG MOMENTUM)
// ============================================================================

export class CobeGlobe3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = Object.assign({
      autoSpin: true,
      spinSpeed: 1.0,
      lightAngleDeg: 45,
      markers: GLOBE_MARKERS,
      onMarkerChange: null,
      onFpsUpdate: null
    }, options);

    this.ctx = null;
    this.dots = [];
    this.markers = this.options.markers;
    this.activeMarkerIndex = 0;

    // 3D Rotation angles and momentum
    this.phi = 0.5; // Horizontal rotation (longitude)
    this.theta = 0.28; // Vertical tilt (latitude ~16 deg)
    this.targetTheta = 0.28;
    this.autoSpin = this.options.autoSpin;
    this.spinSpeed = this.options.spinSpeed;
    this.lightAngle = (this.options.lightAngleDeg * Math.PI) / 180;

    // Pointer Drag & Momentum State
    this.isDragging = false;
    this.pointerDown = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.friction = 0.94;
    this.lastInteractionTime = performance.now();

    this.animationFrameId = null;
    this.isRunning = false;
    this.startTime = performance.now();
    this.frameCount = 0;
    this.fpsTimer = performance.now();
    this.fps = 60;

    this.initCanvas();
    this.generateGlobeDots();
    this.bindEvents();
  }

  initCanvas() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.resize();
  }

  // Real-time landmass classifier simulating Earth continental clusters
  isLandmass(latDeg, lonDeg) {
    // Standardize lon to [-180, 180]
    let lon = ((lonDeg + 180) % 360) - 180;
    let lat = latDeg;

    // Major continental centroid approximations with elliptical radiuses
    const landCenters = [
      // North America
      { lat: 48, lon: -100, rx: 32, ry: 18 },
      { lat: 36, lon: -92, rx: 20, ry: 14 },
      { lat: 60, lon: -125, rx: 28, ry: 15 },
      { lat: 24, lon: -102, rx: 12, ry: 10 },
      // South America
      { lat: -5, lon: -60, rx: 20, ry: 16 },
      { lat: -22, lon: -55, rx: 16, ry: 14 },
      { lat: -42, lon: -68, rx: 8, ry: 16 },
      // Europe
      { lat: 50, lon: 15, rx: 18, ry: 12 },
      { lat: 42, lon: 2, rx: 14, ry: 8 },
      { lat: 62, lon: 22, rx: 16, ry: 10 },
      // Africa
      { lat: 24, lon: 18, rx: 25, ry: 12 },
      { lat: 4, lon: 22, rx: 18, ry: 14 },
      { lat: -18, lon: 24, rx: 14, ry: 14 },
      // Asia
      { lat: 55, lon: 85, rx: 35, ry: 16 },
      { lat: 35, lon: 100, rx: 25, ry: 15 },
      { lat: 22, lon: 78, rx: 15, ry: 12 }, // India
      { lat: 62, lon: 130, rx: 28, ry: 12 }, // Siberia
      { lat: 36, lon: 138, rx: 6, ry: 10 },  // Japan
      // Australia
      { lat: -25, lon: 134, rx: 18, ry: 12 },
      // Antarctica
      { lat: -80, lon: 0, rx: 180, ry: 15 }
    ];

    for (let i = 0; i < landCenters.length; i++) {
      const c = landCenters[i];
      const dLat = (lat - c.lat) / c.ry;
      const dLon = (lon - c.lon) / c.rx;
      if (dLat * dLat + dLon * dLon <= 1.0) {
        return true;
      }
    }
    return false;
  }

  // Pre-calculate dot positions across Fibonacci / Lat-Long sphere
  generateGlobeDots() {
    this.dots = [];
    const numLatBands = 58;

    for (let b = 1; b < numLatBands; b++) {
      const latFraction = b / numLatBands;
      const lat = (latFraction - 0.5) * Math.PI; // [-PI/2, PI/2]
      const latDeg = (lat * 180) / Math.PI;
      const cosLat = Math.cos(lat);

      // Number of dots along this latitude circle scales with circumference
      const dotsInBand = Math.max(8, Math.floor(115 * cosLat));

      for (let j = 0; j < dotsInBand; j++) {
        const lon = (j / dotsInBand) * (Math.PI * 2) - Math.PI;
        const lonDeg = (lon * 180) / Math.PI;

        const isLand = this.isLandmass(latDeg, lonDeg);

        // Dot base positions on unit sphere
        this.dots.push({
          lat,
          lon,
          isLand,
          baseRadius: isLand ? 1.9 : 0.95
        });
      }
    }
  }

  bindEvents() {
    if (!this.canvas) return;

    this.onPointerDown = (e) => {
      this.lastInteractionTime = performance.now();
      this.isDragging = true;
      this.pointerDown = true;
      this.lastPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      this.lastPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      this.velocityX = 0;
      this.velocityY = 0;
    };

    this.onPointerMove = (e) => {
      if (!this.pointerDown) return;
      this.lastInteractionTime = performance.now();
      const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const curY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = curX - this.lastPointerX;
      const deltaY = curY - this.lastPointerY;

      this.lastPointerX = curX;
      this.lastPointerY = curY;

      // Adjust angles directly
      this.phi += deltaX * 0.006;
      this.theta += deltaY * 0.005;

      // Keep vertical tilt bounded to prevent camera inversion
      this.theta = clamp(this.theta, -0.75, 0.75);

      // Store velocity for momentum
      this.velocityX = deltaX * 0.006;
      this.velocityY = deltaY * 0.005;
    };

    this.onPointerUp = () => {
      this.pointerDown = false;
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', this.onPointerDown);
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);

    this.canvas.addEventListener('touchstart', this.onPointerDown, { passive: true });
    window.addEventListener('touchmove', this.onPointerMove, { passive: true });
    window.addEventListener('touchend', this.onPointerUp, { passive: true });
  }

  setSpinSpeed(val) {
    this.spinSpeed = clamp(parseFloat(val) || 1.0, 0.1, 4.0);
  }

  toggleAutoSpin() {
    this.lastInteractionTime = performance.now();
    this.autoSpin = !this.autoSpin;
    return this.autoSpin;
  }

  setLightAngle(deg) {
    this.lightAngle = (deg * Math.PI) / 180;
  }

  focusMarker(indexOrId) {
    this.lastInteractionTime = performance.now();
    let targetIndex = 0;
    if (typeof indexOrId === 'number') {
      targetIndex = (indexOrId + this.markers.length) % this.markers.length;
    } else {
      const idx = this.markers.findIndex(m => m.id === indexOrId);
      if (idx !== -1) targetIndex = idx;
    }

    this.activeMarkerIndex = targetIndex;
    const marker = this.markers[targetIndex];

    if (marker) {
      // Calculate target phi to bring marker to center viewport facing camera
      const targetPhi = -((marker.lon * Math.PI) / 180) - Math.PI * 0.5;
      // Smoothly animate toward target phi
      this.phi = targetPhi;
      this.theta = clamp(((marker.lat * Math.PI) / 180) * 0.45, -0.4, 0.4);
      this.velocityX = 0;
      this.velocityY = 0;

      if (typeof this.options.onMarkerChange === 'function') {
        this.options.onMarkerChange(marker, targetIndex);
      }
    }
  }

  cycleMarker() {
    const nextIdx = (this.activeMarkerIndex + 1) % this.markers.length;
    this.focusMarker(nextIdx);
  }

  resize() {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || this.canvas.clientWidth || 500;
    const height = rect.height || this.canvas.clientHeight || 380;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2);

    const pixelWidth = Math.max(1, Math.floor(width * dpr));
    const pixelHeight = Math.max(1, Math.floor(height * dpr));

    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
    }
  }

  render(timestamp = performance.now()) {
    if (!this.ctx || !this.canvas || !this.isRunning) return;

    const ctx = this.ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.width / dpr;
    const height = this.canvas.height / dpr;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.42;

    // Reset transform & clear
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Apply Momentum & Auto-Spin physics
    if (!this.pointerDown) {
      // Momentum decay
      this.phi += this.velocityX;
      this.theta += this.velocityY;
      this.velocityX *= this.friction;
      this.velocityY *= this.friction;

      // Elastic vertical tilt recentering
      this.theta += (this.targetTheta - this.theta) * 0.02;

      // WCAG 2.2.2: Idle rest after 2,500ms of inactivity
      const isIdle = (timestamp - this.lastInteractionTime > 2500) && !this.pointerDown;
      const autoSpinFactor = isIdle ? Math.max(0, 1.0 - (timestamp - this.lastInteractionTime - 2500) / 1000) : 1.0;

      // Auto-spin when velocity drops (modulated by WCAG 2.2.2 idle rest factor)
      if (this.autoSpin && Math.abs(this.velocityX) < 0.003) {
        this.phi += 0.004 * this.spinSpeed * autoSpinFactor;
      }
    }

    // Directional light vector with user-controlled angle
    const lightX = Math.cos(this.lightAngle);
    const lightY = -0.4;
    const lightZ = Math.sin(this.lightAngle) + 0.8;
    const lightLen = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);
    const lx = lightX / lightLen;
    const ly = lightY / lightLen;
    const lz = lightZ / lightLen;

    // Precalculate trigonometry for rotation
    const cosPhi = Math.cos(this.phi);
    const sinPhi = Math.sin(this.phi);
    const cosTheta = Math.cos(this.theta);
    const sinTheta = Math.sin(this.theta);

    // Subtle dark sphere ambient shadow backdrop
    const bgGlow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 1.15);
    bgGlow.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    bgGlow.addColorStop(0.85, 'rgba(8, 9, 13, 0.9)');
    bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bgGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // Render Dot-Matrix Grid
    const numDots = this.dots.length;
    for (let i = 0; i < numDots; i++) {
      const dot = this.dots[i];

      // 3D Spherical Coordinate mapping
      const cosLat = Math.cos(dot.lat);
      const sinLat = Math.sin(dot.lat);

      // Longitude rotation (phi)
      const x0 = cosLat * Math.sin(dot.lon + this.phi);
      const y0 = -sinLat;
      const z0 = cosLat * Math.cos(dot.lon + this.phi);

      // Vertical tilt rotation (theta around X-axis)
      const x = x0;
      const y = y0 * cosTheta - z0 * sinTheta;
      const z = y0 * sinTheta + z0 * cosTheta;

      // Depth Culling: fade out dots toward the back hemisphere
      if (z < -0.18) continue;

      // Lambertian Diffuse Lighting Factor
      // Normal vector of unit sphere is simply (x, y, z)
      const diffuse = Math.max(0.0, x * lx + y * ly + z * lz);
      const lightFactor = 0.28 + 0.72 * diffuse;

      // Back-to-front alpha falloff near the rim
      const rimAlpha = clamp((z + 0.18) / 0.35, 0.0, 1.0);
      const depthScale = 0.65 + 0.35 * (z + 1.0) * 0.5;

      const px = cx + x * radius;
      const py = cy + y * radius;
      const r = dot.baseRadius * lightFactor * depthScale;

      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.6, r), 0, Math.PI * 2);

      if (dot.isLand) {
        // Continental landmass dot: Bright, high-contrast luminous tint
        const alpha = clamp(0.92 * lightFactor * rimAlpha, 0.15, 1.0);
        ctx.fillStyle = `rgba(248, 250, 252, ${alpha.toFixed(3)})`;
      } else {
        // Ocean matrix dot: Subtle deep cobalt lattice
        const alpha = clamp(0.18 * lightFactor * rimAlpha, 0.05, 0.35);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
      }
      ctx.fill();
    }

    // Render Glowing Marker Telemetry Pins
    const time = (timestamp - this.startTime) * 0.001;
    for (let m = 0; m < this.markers.length; m++) {
      const marker = this.markers[m];
      const mLat = (marker.lat * Math.PI) / 180;
      const mLon = (marker.lon * Math.PI) / 180;

      const cosLat = Math.cos(mLat);
      const sinLat = Math.sin(mLat);

      const mx0 = cosLat * Math.sin(mLon + this.phi);
      const my0 = -sinLat;
      const mz0 = cosLat * Math.cos(mLon + this.phi);

      const mx = mx0;
      const my = my0 * cosTheta - mz0 * sinTheta;
      const mz = my0 * sinTheta + mz0 * cosTheta;

      // Only draw marker if facing camera
      if (mz > 0.05) {
        const px = cx + mx * radius;
        const py = cy + my * radius;
        const isCurrent = (m === this.activeMarkerIndex);

        // Vertical glowing beacon ray
        const stemHeight = (isCurrent ? 28 : 16) * (0.6 + 0.4 * mz);
        const topPx = cx + mx * (radius + stemHeight);
        const topPy = cy + my * (radius + stemHeight);

        ctx.strokeStyle = marker.color || '#38bdf8';
        ctx.lineWidth = isCurrent ? 2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(topPx, topPy);
        ctx.stroke();

        // Pulsing glowing concentric wave
        const pulseCycle = (time * 1.8 + m * 0.4) % 1.0;
        const pulseRadius = 3 + pulseCycle * (isCurrent ? 22 : 14);
        const pulseAlpha = (1.0 - pulseCycle) * (isCurrent ? 0.9 : 0.5) * mz;

        ctx.beginPath();
        ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = marker.color || '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = pulseAlpha;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Core Glowing Node
        ctx.beginPath();
        ctx.arc(topPx, topPy, isCurrent ? 4.5 : 3.0, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? '#f97316' : (marker.color || '#38bdf8');
        ctx.fill();

        ctx.beginPath();
        ctx.arc(topPx, topPy, isCurrent ? 2.2 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Floating Telemetry Label for active pin
        if (isCurrent) {
          ctx.font = '600 11px var(--font-mono, monospace)';
          const text = `${marker.name.toUpperCase()} [${marker.region}]`;
          const textWidth = ctx.measureText(text).width;
          const boxPadding = 6;
          const boxX = topPx - textWidth * 0.5 - boxPadding;
          const boxY = topPy - 22;

          // Glassmorphic pill backing
          ctx.fillStyle = 'rgba(11, 13, 19, 0.88)';
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, textWidth + boxPadding * 2, 18, 4);
          ctx.fill();
          ctx.stroke();

          // Label text
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(text, boxX + boxPadding, boxY + 13);
        }
      }
    }

    // Outer Atmospheric Rim Glow
    const rimGrad = ctx.createRadialGradient(cx, cy, radius * 0.97, cx, cy, radius * 1.02);
    rimGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    rimGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.22)');
    rimGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
    ctx.fill();

    // FPS Meter
    this.frameCount++;
    if (timestamp - this.fpsTimer >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.fpsTimer));
      this.frameCount = 0;
      this.fpsTimer = timestamp;
      if (typeof this.options.onFpsUpdate === 'function') {
        this.options.onFpsUpdate(this.fps);
      }
    }

    this.animationFrameId = requestAnimationFrame((ts) => this.render(ts));
  }

  resume() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.fpsTimer = performance.now();
    this.animationFrameId = requestAnimationFrame((ts) => this.render(ts));
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    this.pause();
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.onPointerDown);
      this.canvas.removeEventListener('touchstart', this.onPointerDown);
    }
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchmove', this.onPointerMove);
    window.removeEventListener('touchend', this.onPointerUp);
    this.ctx = null;
  }
}

// ============================================================================
// 3. MAIN INITIALIZER: initShaderCanvasPlayground()
// ============================================================================

export function initShaderCanvasPlayground() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }

  // Find or inject stage containers
  let shaderCanvas = document.getElementById('shader-gradient-canvas');
  let globeCanvas = document.getElementById('cobe-globe-canvas');

  // If DOM stage not yet present, inject production stage markup into #section-motion-lab
  if (!shaderCanvas || !globeCanvas) {
    const targetSection = document.getElementById('section-motion-lab') || 
                          document.getElementById('section-3d-lab') || 
                          document.body;

    if (targetSection) {
      // Check if wrapper already injected
      let playgroundRoot = document.getElementById('canvas-shaders-playground');
      if (!playgroundRoot) {
        playgroundRoot = document.createElement('div');
        playgroundRoot.id = 'canvas-shaders-playground';
        playgroundRoot.className = 'canvas-shaders-playground';
        playgroundRoot.style.marginTop = '2.5rem';
        playgroundRoot.innerHTML = generatePlaygroundMarkup();
        targetSection.appendChild(playgroundRoot);
      }

      shaderCanvas = document.getElementById('shader-gradient-canvas');
      globeCanvas = document.getElementById('cobe-globe-canvas');
    }
  }

  if (!shaderCanvas || !globeCanvas) {
    console.warn('[ComponentCanvas] Target canvases could not be located or injected.');
    return null;
  }

  // 1. Initialize ShaderGradient Fluid Canvas
  const hudShaderFps = document.getElementById('hud-shader-fps');
  const shaderSpeedSlider = document.getElementById('shader-speed-slider');
  const shaderSpeedVal = document.getElementById('shader-speed-val');
  const shaderNoiseSlider = document.getElementById('shader-noise-slider');
  const shaderNoiseVal = document.getElementById('shader-noise-val');
  const palettePills = document.querySelectorAll('.shader-palette-pill[data-preset]');

  const shaderFluidStage = new ShaderGradientFluidCanvas(shaderCanvas, {
    preset: 'sapphire',
    speed: shaderSpeedSlider ? parseFloat(shaderSpeedSlider.value) || 1.0 : 1.0,
    noiseScale: shaderNoiseSlider ? parseFloat(shaderNoiseSlider.value) || 3.8 : 3.8,
    onFpsUpdate: (fps) => {
      if (hudShaderFps) hudShaderFps.textContent = fps.toString();
    }
  });

  // Wire Shader Controls
  if (shaderSpeedSlider) {
    shaderSpeedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 1.0;
      if (shaderSpeedVal) shaderSpeedVal.textContent = `${val.toFixed(1)}x`;
      shaderFluidStage.setSpeed(val);
    });
  }

  if (shaderNoiseSlider) {
    shaderNoiseSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 3.8;
      if (shaderNoiseVal) shaderNoiseVal.textContent = val.toFixed(1);
      shaderFluidStage.setNoiseScale(val);
    });
  }

  palettePills.forEach(pill => {
    pill.addEventListener('click', () => {
      palettePills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-checked', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-checked', 'true');

      const preset = pill.getAttribute('data-preset');
      shaderFluidStage.setPalette(preset);
    });
  });

  // 2. Initialize Cobe Globe 3D Canvas
  const hudGlobeFps = document.getElementById('hud-globe-fps');
  const cobeSpinBtn = document.getElementById('cobe-spin-btn');
  const cobeSpinIcon = document.getElementById('cobe-spin-icon');
  const cobeSpinText = document.getElementById('cobe-spin-text');
  const cobeSpeedSlider = document.getElementById('cobe-speed-slider');
  const cobeSpeedVal = document.getElementById('cobe-speed-val');
  const cobeLightSlider = document.getElementById('cobe-light-slider');
  const cobeLightVal = document.getElementById('cobe-light-val');
  const cobeCycleBtn = document.getElementById('cobe-marker-cycle-btn');
  const cobeMarkerLabel = document.getElementById('cobe-active-marker-label');

  const cobeGlobeStage = new CobeGlobe3D(globeCanvas, {
    autoSpin: true,
    spinSpeed: cobeSpeedSlider ? parseFloat(cobeSpeedSlider.value) || 1.0 : 1.0,
    lightAngleDeg: cobeLightSlider ? parseFloat(cobeLightSlider.value) || 45 : 45,
    onMarkerChange: (marker) => {
      if (cobeMarkerLabel) {
        cobeMarkerLabel.textContent = `${marker.name} [${marker.region}]`;
      }
    },
    onFpsUpdate: (fps) => {
      if (hudGlobeFps) hudGlobeFps.textContent = fps.toString();
    }
  });

  // Wire Globe Controls
  if (cobeSpinBtn) {
    cobeSpinBtn.addEventListener('click', () => {
      const isSpinning = cobeGlobeStage.toggleAutoSpin();
      if (cobeSpinIcon) cobeSpinIcon.textContent = isSpinning ? 'Pause' : 'Play';
      if (cobeSpinText) cobeSpinText.textContent = isSpinning ? 'Pause Spin' : 'Resume Spin';
    });
  }

  if (cobeSpeedSlider) {
    cobeSpeedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 1.0;
      if (cobeSpeedVal) cobeSpeedVal.textContent = `${val.toFixed(1)}x`;
      cobeGlobeStage.setSpinSpeed(val);
    });
  }

  if (cobeLightSlider) {
    cobeLightSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 45;
      if (cobeLightVal) cobeLightVal.textContent = `${val}°`;
      cobeGlobeStage.setLightAngle(val);
    });
  }

  if (cobeCycleBtn) {
    cobeCycleBtn.addEventListener('click', () => {
      cobeGlobeStage.cycleMarker();
    });
  }

  // 3. Performance & Visibility Management (IntersectionObserver)
  const shaderWrapper = document.getElementById('shader-gradient-canvas-wrapper') || shaderCanvas;
  const globeWrapper = document.getElementById('cobe-globe-canvas-wrapper') || globeCanvas;

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === shaderWrapper || entry.target === shaderCanvas) {
          if (entry.isIntersecting && !document.hidden) {
            shaderFluidStage.resume();
          } else {
            shaderFluidStage.pause();
          }
        }
        if (entry.target === globeWrapper || entry.target === globeCanvas) {
          if (entry.isIntersecting && !document.hidden) {
            cobeGlobeStage.resume();
          } else {
            cobeGlobeStage.pause();
          }
        }
      });
    }, { threshold: 0.05 });

    observer.observe(shaderWrapper);
    observer.observe(globeWrapper);
  } else {
    // Fallback if IntersectionObserver is unavailable
    shaderFluidStage.resume();
    cobeGlobeStage.resume();
  }

  // Page Visibility State listener
  const handleCanvasVisibility = () => {
    if (document.hidden) {
      shaderFluidStage.pause();
      cobeGlobeStage.pause();
    } else {
      shaderFluidStage.resume();
      cobeGlobeStage.resume();
    }
  };
  document.addEventListener('visibilitychange', handleCanvasVisibility);

  // Handle Window & Container Resizing
  const handleAllResizes = () => {
    shaderFluidStage.resize();
    cobeGlobeStage.resize();
  };

  window.addEventListener('resize', handleAllResizes);

  // Tab activation listener to trigger immediate resize when switching to tab
  const tabs = document.querySelectorAll('.nav-tab-btn[data-target]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        handleAllResizes();
        shaderFluidStage.resume();
        cobeGlobeStage.resume();
      }, 50);
    });
  });

  // Initial resume
  shaderFluidStage.resume();
  cobeGlobeStage.resume();

  // Expose to window for external console diagnostics & curriculum exercises
  if (typeof window !== 'undefined') {
    window.shaderGradientStage = shaderFluidStage;
    }
  window.cobeGlobeStage = cobeGlobeStage;

  return {
    shaderGradient: shaderFluidStage,
    cobeGlobe: cobeGlobeStage,
    destroy: () => {
      document.removeEventListener('visibilitychange', handleCanvasVisibility);
      window.removeEventListener('resize', handleAllResizes);
      shaderFluidStage.destroy();
      cobeGlobeStage.destroy();
    }
  };
}

// Helper: HTML Markup Generator for Canvas & 3D Shaders Stage
function generatePlaygroundMarkup() {
  return `
    <div class="liquid-glass-card" style="margin-bottom:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.2rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
            <span class="meta-tag">Frontier Registries · ShaderGradient &amp; Cobe</span>
            <span class="meta-tag" style="border-color:rgba(56,189,248,0.3); color:var(--c-sapphire);">WebGL &amp; 3D Canvas</span>
          </div>
          <h3 style="font-family:var(--font-display); font-size:1.6rem; color:var(--t-primary); margin:0;">
            Canvas &amp; 3D Shaders Playground
          </h3>
        </div>
        <p style="font-size:0.88rem; color:var(--t-secondary); max-width:650px; margin:0; line-height:1.5;">
          Direct WebGL domain-warping fragment shaders paired with mathematical 3D dot-matrix globe simulation. Lightweight, zero-FOUC, and hardware-accelerated.
        </p>
      </div>

      <!-- 2-Column Responsive Grid -->
      <div class="grid-2col" style="gap:1.5rem;">

        <!-- 1. ShaderGradient Fluid Mesh Card -->
        <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
              <span class="meta-tag" style="font-size:0.72rem;">ShaderGradient · WebGL fBm</span>
              <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--t-muted);">
                FPS: <strong id="hud-shader-fps" style="color:var(--c-sapphire);">60</strong>
              </div>
            </div>
            <h4 style="font-family:var(--font-display); font-size:1.25rem; color:var(--t-primary); margin-bottom:0.4rem;">
              Fluid Mesh Gradient Shader
            </h4>
            <p style="font-size:0.85rem; color:var(--t-secondary); margin-bottom:1rem; line-height:1.45;">
              Procedural fragment domain-warping with fractional Brownian motion (fBm) and interactive cursor swirl vectors.
            </p>

            <!-- Shader Canvas Stage -->
            <div id="shader-gradient-canvas-wrapper" role="region" aria-label="ShaderGradient Fluid Mesh Canvas" style="position:relative; width:100%; height:280px; border-radius:var(--r-ctl); overflow:hidden; border:1px solid var(--c-hairline); margin-bottom:1.2rem; background:#060b19; cursor:crosshair;">
              <p class="sr-only">Interactive WebGL canvas rendering a real-time domain-warped fluid gradient mesh.</p>
              <canvas id="shader-gradient-canvas" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>
            </div>
          </div>

          <!-- Shader Controls -->
          <div style="display:flex; flex-direction:column; gap:0.9rem;">
            <!-- Palette Pills -->
            <div>
              <label style="display:block; font-size:0.75rem; font-family:var(--font-mono); color:var(--t-muted); margin-bottom:0.4rem;">CHROMATIC PALETTE PRESETS</label>
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <button type="button" class="shader-palette-pill active" data-preset="sapphire" aria-label="Sapphire Twilight Palette" style="background:#060b19; border:1px solid #38bdf8; color:#38bdf8; padding:0.35rem 0.75rem; font-size:0.78rem; font-family:var(--font-mono); border-radius:var(--r-round); cursor:pointer;">Sapphire</button>
                <button type="button" class="shader-palette-pill" data-preset="amber" aria-label="Sunset Amber Palette" style="background:#0f0502; border:1px solid rgba(245,158,11,0.4); color:#f59e0b; padding:0.35rem 0.75rem; font-size:0.78rem; font-family:var(--font-mono); border-radius:var(--r-round); cursor:pointer;">Sunset Amber</button>
                <button type="button" class="shader-palette-pill" data-preset="violet" aria-label="Hyper Violet Palette" style="background:#0a0414; border:1px solid rgba(168,85,247,0.4); color:#a855f7; padding:0.35rem 0.75rem; font-size:0.78rem; font-family:var(--font-mono); border-radius:var(--r-round); cursor:pointer;">Hyper Violet</button>
                <button type="button" class="shader-palette-pill" data-preset="aurora" aria-label="Emerald Aurora Palette" style="background:#02120a; border:1px solid rgba(16,185,129,0.4); color:#10b981; padding:0.35rem 0.75rem; font-size:0.78rem; font-family:var(--font-mono); border-radius:var(--r-round); cursor:pointer;">Emerald</button>
              </div>
            </div>

            <!-- Sliders -->
            <div class="grid-2col" style="gap:0.8rem;">
              <div class="control-slider-group">
                <label for="shader-speed-slider"><span>Flow Speed</span><span id="shader-speed-val">1.0x</span></label>
                <input type="range" id="shader-speed-slider" min="0.2" max="3.0" step="0.1" value="1.0" aria-label="Shader fluid animation speed">
              </div>
              <div class="control-slider-group">
                <label for="shader-noise-slider"><span>Noise Scale</span><span id="shader-noise-val">3.8</span></label>
                <input type="range" id="shader-noise-slider" min="1.5" max="7.0" step="0.1" value="3.8" aria-label="Shader distortion noise scale">
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Cobe Globe 3D Card -->
        <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
              <span class="meta-tag" style="font-size:0.72rem; border-color:var(--c-hairline); color:var(--t-secondary);">Cobe Globe · 3D Canvas</span>
              <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--t-muted);">
                FPS: <strong id="hud-globe-fps" style="color:var(--c-ember);">60</strong>
              </div>
            </div>
            <h4 style="font-family:var(--font-display); font-size:1.25rem; color:var(--t-primary); margin-bottom:0.4rem;">
              Cobe 3D Dot-Matrix Globe
            </h4>
            <p style="font-size:0.85rem; color:var(--t-secondary); margin-bottom:1rem; line-height:1.45;">
              Lightweight 3D dot-matrix sphere with continental landmass clustering, diffuse Lambertian shading, and drag momentum.
            </p>

            <!-- Globe Canvas Stage -->
            <div id="cobe-globe-canvas-wrapper" role="region" aria-label="Cobe 3D Dot-Matrix Rotating Globe Canvas" style="position:relative; width:100%; height:280px; border-radius:var(--r-ctl); overflow:hidden; border:1px solid var(--c-hairline); margin-bottom:1.2rem; background:radial-gradient(circle at 50% 50%, #0d1220 0%, #050608 100%); cursor:grab;">
              <p class="sr-only">Interactive 3D dot-matrix rotating globe with diffuse lighting and glowing telemetry pins.</p>
              <canvas id="cobe-globe-canvas" style="width:100%; height:100%; display:block; touch-action:none;"></canvas>
              <div style="position:absolute; bottom:8px; left:12px; pointer-events:none;">
                <span id="cobe-active-marker-label" style="font-family:var(--font-mono); font-size:0.74rem; color:var(--c-ember); background:rgba(11,13,19,0.75); padding:2px 6px; border-radius:4px; border:1px solid var(--c-hairline);">
                  SAN FRANCISCO [US-WEST]
                </span>
              </div>
            </div>
          </div>

          <!-- Globe Controls -->
          <div style="display:flex; flex-direction:column; gap:0.9rem;">
            <!-- Action Toolbar -->
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
              <button type="button" id="cobe-spin-btn" class="nav-tab-btn" aria-label="Pause or resume auto-rotation" style="flex:1; min-height:36px; padding:0.4rem 0.8rem; font-size:0.8rem; background:var(--c-elevated-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-ctl); cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;">
                <span id="cobe-spin-icon" aria-hidden="true" style="font-size:0.75rem;">||</span>
                <span id="cobe-spin-text">Pause Spin</span>
              </button>
              <button type="button" id="cobe-marker-cycle-btn" class="nav-tab-btn" aria-label="Cycle to next global hub marker" style="flex:1; min-height:36px; padding:0.4rem 0.8rem; font-size:0.8rem; background:var(--c-elevated-zinc); border:1px solid var(--c-hairline); color:var(--t-primary); border-radius:var(--r-ctl); cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;">
                <span>◎ Cycle Hub Pin</span>
              </button>
            </div>

            <!-- Sliders -->
            <div class="grid-2col" style="gap:0.8rem;">
              <div class="control-slider-group">
                <label for="cobe-speed-slider"><span>Spin Rate</span><span id="cobe-speed-val">1.0x</span></label>
                <input type="range" id="cobe-speed-slider" min="0.2" max="3.0" step="0.1" value="1.0" aria-label="Globe auto-rotation speed">
              </div>
              <div class="control-slider-group">
                <label for="cobe-light-slider"><span>Diffuse Light</span><span id="cobe-light-val">45°</span></label>
                <input type="range" id="cobe-light-slider" min="0" max="360" step="15" value="45" aria-label="Globe diffuse light azimuth angle">
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
