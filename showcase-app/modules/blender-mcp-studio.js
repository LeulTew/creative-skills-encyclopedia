// ============================================================================
// Interactive Blender 5.2 MCP Parametric Studio Module
// Local Socket Bridge: 127.0.0.1:9876 | NVIDIA RTX 5070 Ti OptiX Acceleration
// Real-Time 3D Parametric Mesh Workbench, Headless bpy Python Code Generator,
// Procedural Physics Film Engine, and Multi-Phase OptiX Render Simulator
// ============================================================================

import { initAdobeCCAutomationHub } from './component-adobe-cc.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export function initBlenderStudio() {
  if (typeof document === 'undefined') return;

  // DOM Elements - Workbench & Sliders
  const meshButtons = document.querySelectorAll('.blender-mesh-btn[data-mesh]');
  const physicsButtons = document.querySelectorAll('.blender-physics-btn[data-physics]');
  const physicsModeLabel = document.getElementById('physics-mode-label');

  const sliderSegments = document.getElementById('bpy-slider-segments');
  const valSegments = document.getElementById('bpy-val-segments');
  const sliderRadius = document.getElementById('bpy-slider-radius');
  const valRadius = document.getElementById('bpy-val-radius');
  const sliderNoise = document.getElementById('bpy-slider-noise');
  const valNoise = document.getElementById('bpy-val-noise');
  const sliderSamples = document.getElementById('bpy-slider-samples');
  const valSamples = document.getElementById('bpy-val-samples');

  const renderBtn = document.getElementById('simulate-bpy-render-btn');
  const downloadGlbBtn = document.getElementById('download-glb-btn');
  const statusBox = document.getElementById('bpy-render-status-box');
  const copyBtn = document.getElementById('copy-bpy-script-btn');
  const scriptContent = document.getElementById('bpy-script-content');
  const heroBlenderCta = document.getElementById('hero-blender-cta');
  const viewportContainer = document.getElementById('blender-3d-viewport');
  const workbenchMeshLabel = document.getElementById('workbench-mesh-label');
  const wireframeBtn = document.getElementById('toggle-wireframe-btn');

  // Telemetry HUD Elements
  const elVerts = document.getElementById('telemetry-verts');
  const elTris = document.getElementById('telemetry-tris');
  const elVram = document.getElementById('telemetry-vram') || document.getElementById('telemetry-mem');
  const elDrawCalls = document.getElementById('telemetry-drawcalls') || document.getElementById('telemetry-calls');

  if (!scriptContent) {
    console.warn('[BlenderStudio] Target element #bpy-script-content not found.');
    return;
  }

  // Idempotency Guard: prevent duplicate initialization and event listeners
  const studioRoot = document.getElementById('section-blender') || viewportContainer || scriptContent;
  if (studioRoot && studioRoot.dataset.blenderStudioInitialized === 'true') {
    return;
  }
  if (studioRoot) {
    studioRoot.dataset.blenderStudioInitialized = 'true';
  }

  // Parametric State
  let currentMesh = 'torus'; // 'torus' | 'canister' | 'pack'
  let currentPhysicsMode = 'none'; // 'none' | 'ripple' | 'cloth-pop' | 'flythrough'
  let physicsStartTime = 0;
  let basePositions = null;

  let segments = sliderSegments ? parseInt(sliderSegments.value, 10) || 64 : 64;
  let radius = sliderRadius ? parseFloat(sliderRadius.value) || 0.35 : 0.35;
  let noise = sliderNoise ? parseFloat(sliderNoise.value) || 2.5 : 2.5;
  let samples = sliderSamples ? parseInt(sliderSamples.value, 10) || 128 : 128;
  let isRendering = false;
  let isWireframe = false;

  // --------------------------------------------------------------------------
  // 1. THREE.JS 3D INTERACTIVE WORKBENCH
  // --------------------------------------------------------------------------
  let wbScene, wbCamera, wbRenderer, wbMesh;
  let wbAnimFrameId = null;
  let isWbPaused = false;
  let wbObserver = null;
  let isMeshDeformed = false;
  let lastDrawCalls = -1;

  function pauseWorkbench() {
    if (isWbPaused) return;
    isWbPaused = true;
    if (wbAnimFrameId) {
      cancelAnimationFrame(wbAnimFrameId);
      wbAnimFrameId = null;
    }
  }

  function resumeWorkbench() {
    if (!isWbPaused && wbAnimFrameId) return;
    isWbPaused = false;
    if (wbAnimFrameId) cancelAnimationFrame(wbAnimFrameId);
    wbAnimFrameId = requestAnimationFrame(animate);
  }

  // Animation Loop with Procedural Physics Engine & RAF Visibility Throttling
  function animate() {
    if (isWbPaused) return;
    wbAnimFrameId = requestAnimationFrame(animate);
    const now = performance.now();

    if (currentPhysicsMode === 'ripple') {
      isMeshDeformed = true;
      // Mode 1: Packaging Ripple (Sinusoidal flex wave with cloth damping)
      if (wbMesh && wbMesh.geometry && basePositions) {
        const pos = wbMesh.geometry.attributes.position;
        const count = pos.count;
        const elapsed = (now - physicsStartTime) * 0.001;
        const waveFreq = noise * 1.6;
        const waveSpeed = 4.2;
        const amp = radius * 0.32;
        const cycle = elapsed % 4.0;
        const damping = Math.max(0.25, Math.exp(-cycle * 0.45));

        for (let i = 0; i < count; i++) {
          const bx = basePositions[i * 3];
          const by = basePositions[i * 3 + 1];
          const bz = basePositions[i * 3 + 2];

          // Pinned Seam simulation: outer perimeter boundary is pinned
          let pinWeight = 1.0;
          if (currentMesh === 'pack') {
            const edgeDist = Math.max(Math.abs(bx), Math.abs(by)) / 0.9;
            pinWeight = Math.max(0, 1.0 - Math.pow(edgeDist, 3));
          } else if (currentMesh === 'canister') {
            const edgeDist = Math.abs(by) / 0.9;
            pinWeight = Math.max(0, 1.0 - Math.pow(edgeDist, 2));
          } else {
            pinWeight = 0.85;
          }

          const flex = Math.sin(bx * waveFreq + elapsed * waveSpeed) *
                       Math.cos(by * waveFreq + elapsed * waveSpeed * 0.85) *
                       amp * damping * pinWeight;

          pos.setXYZ(i, bx, by, bz + flex);
        }
        pos.needsUpdate = true;
        wbMesh.geometry.computeVertexNormals();

        // Micro kinetic elevation oscillation
        wbMesh.position.y = Math.sin(elapsed * 4.0) * 0.03 * damping;
        wbMesh.rotation.y += 0.008;
        if (currentMesh === 'pack') {
          wbMesh.rotation.x = -Math.PI / 6;
        }
      }
    } else {
      // Restore base pristine positions ONCE if transitioning away from active ripple
      if (isMeshDeformed && wbMesh && wbMesh.geometry && wbMesh.geometry.attributes.position && basePositions) {
        const pos = wbMesh.geometry.attributes.position;
        pos.array.set(basePositions);
        pos.needsUpdate = true;
        wbMesh.geometry.computeVertexNormals();
        isMeshDeformed = false;
      }

      if (currentPhysicsMode === 'cloth-pop') {
        // Mode 2: Cloth Pop (Pressure burst expanding pouch with collision bounce)
        if (wbMesh) {
          const elapsed = (now - physicsStartTime) * 0.001;
          const cycle = elapsed % 3.6; // 3.6s physical cycle
          let pressureScale = 1.0;
          let posY = 0.0;

          if (cycle < 0.75) {
            // Rapid pressure expansion burst
            const t = cycle / 0.75;
            pressureScale = 1.0 + Math.sin(t * Math.PI * 0.5) * 0.42;
            posY = Math.sin(t * Math.PI) * 0.38;
          } else if (cycle < 1.7) {
            // Elastic pop release and deceleration
            const t = (cycle - 0.75) / 0.95;
            pressureScale = 1.42 - t * 0.26 + Math.sin(t * 14.0) * 0.035;
            posY = 0.38 - t * 0.38;
          } else {
            // Settle against collision plane
            const t = (cycle - 1.7) / 1.9;
            pressureScale = 1.16 - t * 0.16 + Math.sin(t * 8.0) * 0.02 * (1.0 - t);
            posY = Math.sin(t * Math.PI * 2.0) * 0.03 * (1.0 - t);
          }

          wbMesh.scale.set(pressureScale, pressureScale * 0.92, pressureScale);
          wbMesh.position.y = posY;
          wbMesh.rotation.y += 0.012;
        }
      } else if (currentPhysicsMode === 'flythrough') {
        // Mode 3: Camera Fly-Through 360 (Bezier curve orbit with focal depth tracking)
        const elapsed = (now - physicsStartTime) * 0.001;
        if (wbCamera) {
          const orbitSpeed = 0.7;
          const orbitRadius = 3.6;
          const angle = elapsed * orbitSpeed;

          wbCamera.position.x = Math.sin(angle) * orbitRadius;
          wbCamera.position.z = Math.cos(angle) * orbitRadius;
          wbCamera.position.y = 0.65 + Math.sin(angle * 2.0) * 0.5;

          const targetY = wbMesh ? wbMesh.position.y : 0;
          wbCamera.lookAt(0, targetY, 0);
        }
        if (wbMesh) {
          wbMesh.rotation.y += 0.005; // Turntable presentation
          wbMesh.scale.set(1.0, 1.0, 1.0);
          wbMesh.position.set(0, 0, 0);
        }
      } else {
        // Default Static / Idle Rotation Mode
        if (wbMesh) {
          wbMesh.rotation.y += 0.012;
          if (currentMesh === 'pack') {
            wbMesh.rotation.x = -Math.PI / 6 + Math.sin(now * 0.001) * 0.08;
          } else {
            wbMesh.rotation.x = Math.sin(now * 0.0008) * 0.15;
          }
          wbMesh.scale.set(1.0, 1.0, 1.0);
          wbMesh.position.set(0, 0, 0);
        }
        if (wbCamera) {
          wbCamera.position.lerp(new THREE.Vector3(0, 0.5, 3.8), 0.06);
          wbCamera.lookAt(0, 0, 0);
        }
      }
    }

    if (wbRenderer && wbScene && wbCamera) {
      wbRenderer.render(wbScene, wbCamera);
      if (elDrawCalls && wbRenderer.info && wbRenderer.info.render) {
        const calls = wbRenderer.info.render.calls || 1;
        if (calls !== lastDrawCalls) {
          lastDrawCalls = calls;
          elDrawCalls.textContent = calls;
        }
      }
    }
  }

  function init3DWorkbench() {
    if (!viewportContainer) return;
    const THREE = window.THREE;
    if (!THREE) {
      console.warn('[BlenderStudio] Three.js not found on window.THREE; skipping 3D workbench canvas.');
      return;
    }

    const width = viewportContainer.clientWidth || 400;
    const height = viewportContainer.clientHeight || 220;

    wbScene = new THREE.Scene();
    wbCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    wbCamera.position.set(0, 0.5, 3.8);

    try {
      wbRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      wbRenderer.setSize(width, height);
      wbRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      wbRenderer.toneMapping = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping;
      wbRenderer.toneMappingExposure = 1.0;
      viewportContainer.appendChild(wbRenderer.domElement);
      wbRenderer.domElement.style.display = 'block';
      wbRenderer.domElement.style.width = '100%';
      wbRenderer.domElement.style.height = '100%';
    } catch (e) {
      console.warn('[BlenderStudio] WebGL initialization failed for workbench:', e);
      return;
    }

    // Studio Lighting Rig for Workbench
    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(-3, 3, 3);
    wbScene.add(keyLight);

    const rimLight = new THREE.PointLight(0xf97316, 4.0, 10);
    rimLight.position.set(3, 2, -2);
    wbScene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    wbScene.add(ambientLight);

    // Initial Mesh Creation
    updateWorkbenchMesh();

    // Start RAF animation loop
    resumeWorkbench();

    // IntersectionObserver to pause rendering when off-screen or tab hidden
    if (typeof IntersectionObserver !== 'undefined' && viewportContainer) {
      if (wbObserver) wbObserver.disconnect();
      wbObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !(typeof document !== 'undefined' && document.hidden) && viewportContainer.offsetParent !== null) {
            resumeWorkbench();
          } else {
            pauseWorkbench();
          }
        });
      }, { threshold: 0.05 });
      wbObserver.observe(viewportContainer);
    }

    // Visibility Listener to pause when browser tab is inactive
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          pauseWorkbench();
        } else if (viewportContainer && viewportContainer.offsetParent !== null) {
          const rect = viewportContainer.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            resumeWorkbench();
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // Real-Time Geometric Telemetry HUD Updates
  // --------------------------------------------------------------------------
  function updateTelemetry(geom) {
    if (!geom) return;

    const vertCount = (geom.attributes && geom.attributes.position)
      ? geom.attributes.position.count
      : 0;
    if (elVerts) {
      elVerts.textContent = vertCount.toLocaleString();
    }

    const triCount = geom.index
      ? Math.round(geom.index.count / 3)
      : Math.round(vertCount / 3);
    if (elTris) {
      elTris.textContent = triCount.toLocaleString();
    }

    let totalBytes = 0;
    if (geom.attributes) {
      for (const attrName in geom.attributes) {
        if (Object.prototype.hasOwnProperty.call(geom.attributes, attrName)) {
          const attr = geom.attributes[attrName];
          if (attr && attr.array) {
            totalBytes += attr.array.byteLength || (attr.count * (attr.itemSize || 3) * 4);
          }
        }
      }
    }
    if (geom.index && geom.index.array) {
      totalBytes += geom.index.array.byteLength || (geom.index.count * 2);
    }
    if (elVram) {
      if (totalBytes < 1024 * 1024) {
        elVram.textContent = `${(totalBytes / 1024).toFixed(1)} KB`;
      } else {
        elVram.textContent = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
      }
    }

    if (elDrawCalls) {
      const calls = (wbRenderer && wbRenderer.info && wbRenderer.info.render && wbRenderer.info.render.calls > 0)
        ? wbRenderer.info.render.calls
        : 1;
      elDrawCalls.textContent = calls;
    }
  }

  function updateWorkbenchMesh() {
    const THREE = window.THREE;
    if (!THREE || !wbScene) return;

    if (wbMesh) {
      wbScene.remove(wbMesh);
      if (wbMesh.geometry) wbMesh.geometry.dispose();
      if (wbMesh.material) {
        if (Array.isArray(wbMesh.material)) wbMesh.material.forEach(m => m.dispose());
        else wbMesh.material.dispose();
      }
      wbMesh = null;
    }

    let geom;
    let color = 0xf97316; // Ember glow default

    if (currentMesh === 'torus') {
      const minor = Math.max(0.1, radius * 0.7);
      const majorSeg = Math.max(16, segments);
      const minorSeg = Math.max(8, Math.round(segments / 2));
      geom = new THREE.TorusKnotGeometry(0.85, minor, majorSeg, minorSeg);
      if (workbenchMeshLabel) workbenchMeshLabel.textContent = 'TORUS KNOT SUPERQUADRIC';
    } else if (currentMesh === 'canister') {
      const canRadius = Math.max(0.2, radius * 1.1);
      const radialSeg = Math.max(16, segments);
      geom = new THREE.CylinderGeometry(canRadius, canRadius, 1.8, radialSeg, 8, false);
      color = 0x0284c7; // Cobalt base
      if (workbenchMeshLabel) workbenchMeshLabel.textContent = 'PACKAGING CANISTER';
    } else {
      // 'pack' -> SunChips Ripple Surface
      const planeSeg = Math.max(16, Math.min(segments, 64));
      geom = new THREE.PlaneGeometry(1.8, 1.8, planeSeg, planeSeg);

      // Sinusoidal Ripple Wave Vertex Displacement
      const pos = geom.attributes.position;
      const freq = noise * 1.8;
      const amp = radius * 0.35;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * freq) * Math.cos(v * freq) * amp;
        pos.setZ(i, z);
      }
      geom.computeVertexNormals();
      color = 0xf59e0b; // Golden SunChips
      if (workbenchMeshLabel) workbenchMeshLabel.textContent = 'SUNCHIPS RIPPLE PACK';
    }

    // Cache pristine base vertex positions for procedural physics computation
    if (geom && geom.attributes && geom.attributes.position) {
      basePositions = new Float32Array(geom.attributes.position.array);
    }

    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.22,
      metalness: 0.85,
      wireframe: isWireframe,
    });

    wbMesh = new THREE.Mesh(geom, mat);
    wbScene.add(wbMesh);
    isMeshDeformed = false;

    // Update real-time geometric telemetry HUD
    updateTelemetry(geom);
  }

  function resizeWorkbench() {
    if (!viewportContainer || !wbRenderer || !wbCamera) return;
    const width = viewportContainer.clientWidth || 400;
    const height = viewportContainer.clientHeight || 220;
    if (width > 0 && height > 0) {
      wbCamera.aspect = width / height;
      wbCamera.updateProjectionMatrix();
      wbRenderer.setSize(width, height);
      if (viewportContainer.offsetParent !== null && !(typeof document !== 'undefined' && document.hidden)) {
        resumeWorkbench();
      }
    }
  }

  window.resizeBlenderStudio = resizeWorkbench;

  // --------------------------------------------------------------------------
  // 2. REAL-TIME PYTHON CODE GENERATOR (HEADLESS BPY WITH PROCEDURAL PHYSICS)
  // --------------------------------------------------------------------------
  function generateBpyScript() {
    let meshCode = '';
    let meshName = '';

    if (currentMesh === 'torus') {
      meshName = 'Torus_Superquadric_Cosmic';
      meshCode = `
# ----------------------------------------------------------------------------
# 1. PARAMETRIC SUPERQUADRIC TORUS KNOT MESH (COSMIC MATRIX)
# ----------------------------------------------------------------------------
bpy.ops.mesh.primitive_torus_add(
    major_radius=1.20,
    minor_radius=${radius.toFixed(2)},
    major_segments=${segments},
    minor_segments=${Math.max(16, Math.round(segments / 2))},
    location=(0.0, 0.0, 0.0)
)
obj = bpy.context.active_object
obj.name = "${meshName}"
bpy.ops.object.shade_smooth()`;
    } else if (currentMesh === 'canister') {
      meshName = 'Cylindrical_Packaging_Canister';
      const canisterRadius = (radius * 1.5).toFixed(2);
      meshCode = `
# ----------------------------------------------------------------------------
# 1. CYLINDRICAL PACKAGING CANISTER GEOMETRY
# ----------------------------------------------------------------------------
bpy.ops.mesh.primitive_cylinder_add(
    radius=${canisterRadius},
    depth=2.40,
    vertices=${segments},
    location=(0.0, 0.0, 0.0)
)
obj = bpy.context.active_object
obj.name = "${meshName}"
bpy.ops.object.shade_smooth()

# Physical Bevel Modifier for Specular Highlight Grazing
bev = obj.modifiers.new(name="Rim_Bevel", type='BEVEL')
bev.width = 0.035
bev.segments = 4
bev.limit_method = 'ANGLE'
bev.angle_limit = math.radians(35.0)`;
    } else {
      meshName = 'SunChips_Ripple_Surface_Pack';
      const strength = (radius * 0.45).toFixed(3);
      meshCode = `
# ----------------------------------------------------------------------------
# 1. SUNCHIPS RIPPLE SURFACE PACKAGING GEOMETRY
# ----------------------------------------------------------------------------
bpy.ops.mesh.primitive_grid_add(
    x_subdivisions=${segments},
    y_subdivisions=${segments},
    size=2.20,
    location=(0.0, 0.0, 0.0)
)
obj = bpy.context.active_object
obj.name = "${meshName}"
bpy.ops.object.shade_smooth()

# Procedural Sinusoidal Ripple Displacement Modifier
displace = obj.modifiers.new(name="Packaging_Ripples", type='DISPLACE')
tex = bpy.data.textures.new("RippleWaveTexture", type='WOOD')
tex.noise_scale = ${noise.toFixed(1)}
tex.wood_type = 'RINGNOISE'
displace.texture = tex
displace.strength = ${strength}`;
    }

    // Procedural Physics Engine Script Generation
    let physicsSection = '';
    let cameraSection = '';
    let timelineSetup = '';
    let renderExecution = '';

    if (currentPhysicsMode === 'ripple') {
      timelineSetup = `
# Animation Timeline Configuration (120 Frames @ 30 FPS = 4.0s Flex Film)
scene.frame_start = 1
scene.frame_end = 120
scene.render.fps = 30`;

      physicsSection = `
# ----------------------------------------------------------------------------
# 2. PHYSICS FILM ENGINE: PACKAGING RIPPLE & CLOTH DAMPING
# ----------------------------------------------------------------------------
# Vertex Group: Pinned Packaging Seams (Anchors perimeter against tear)
vg_seam = obj.vertex_groups.new(name="Pinned_Packaging_Seam")
boundary_indices = [
    v.index for v in obj.data.vertices
    if abs(v.co.x) > 0.82 or abs(v.co.y) > 0.82
]
if boundary_indices:
    vg_seam.add(boundary_indices, 1.0, 'REPLACE')

# Cloth Modifier with High Flexural Damping (Aluminized Packaging Foil)
cloth_mod = obj.modifiers.new(name="Cloth_Membrane_Ripple", type='CLOTH')
cloth_mod.settings.quality = 6
cloth_mod.settings.mass = 0.16
cloth_mod.settings.tension_stiffness = 28.0
cloth_mod.settings.compression_stiffness = 28.0
cloth_mod.settings.shear_stiffness = 6.5
cloth_mod.settings.bending_stiffness = 1.4
cloth_mod.settings.tension_damping = 7.5
cloth_mod.settings.compression_damping = 7.5
cloth_mod.settings.shear_damping = 7.5
cloth_mod.settings.bending_damping = 2.0
if boundary_indices:
    cloth_mod.settings.vertex_group_mass = "Pinned_Packaging_Seam"

# Sinusoidal Harmonic Wave Modifier for Traveling Membrane Ripples
wave_mod = obj.modifiers.new(name="Sinusoidal_Harmonic_Flex", type='WAVE')
wave_mod.use_x = True
wave_mod.use_y = True
wave_mod.speed = 0.38
wave_mod.height = 0.16
wave_mod.width = 0.72
wave_mod.narrowness = 1.4
wave_mod.damp = 14.0

# Keyframe Wave Amplitude Envelope & Kinetic Elevation
wave_mod.height = 0.02
wave_mod.keyframe_insert(data_path="height", frame=1)
wave_mod.height = 0.18
wave_mod.keyframe_insert(data_path="height", frame=28)
wave_mod.height = 0.09
wave_mod.keyframe_insert(data_path="height", frame=70)
wave_mod.height = 0.02
wave_mod.keyframe_insert(data_path="height", frame=120)

obj.location = (0.0, 0.0, 0.0)
obj.keyframe_insert(data_path="location", frame=1)
obj.location = (0.0, 0.0, 0.05)
obj.keyframe_insert(data_path="location", frame=45)
obj.location = (0.0, 0.0, 0.0)
obj.keyframe_insert(data_path="location", frame=120)`;

      cameraSection = `
# ----------------------------------------------------------------------------
# 4. MATHEMATICAL SENSOR-FIT CAMERA RIG
# ----------------------------------------------------------------------------
cam_data = bpy.data.cameras.new(name="Sensor_Fit_Camera")
cam_data.lens = 85.0
cam_data.sensor_width = 36.0
cam_data.clip_start = 0.1
cam_data.clip_end = 100.0
cam_obj = bpy.data.objects.new(name="Camera_Main", object_data=cam_data)
scene.collection.objects.link(cam_obj)
cam_obj.location = (0.0, -4.5, 1.6)
cam_obj.rotation_euler = (math.radians(72.0), 0.0, 0.0)
scene.camera = cam_obj`;

      renderExecution = `
# ----------------------------------------------------------------------------
# 5. DETERMINISTIC HEADLESS ANIMATION RENDER EXECUTION
# ----------------------------------------------------------------------------
scene.render.filepath = "dist/renders/packaging_ripple_film.mp4"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.view_settings.view_transform = 'Khronos PBR Neutral'

bpy.ops.render.render(animation=True)
print("SUCCESS: Packaging Ripple simulation rendered (120 frames) -> packaging_ripple_film.mp4")`;

    } else if (currentPhysicsMode === 'cloth-pop') {
      timelineSetup = `
# Animation Timeline Configuration (150 Frames @ 30 FPS = 5.0s Burst Film)
scene.frame_start = 1
scene.frame_end = 150
scene.render.fps = 30`;

      physicsSection = `
# ----------------------------------------------------------------------------
# 2. PHYSICS FILM ENGINE: CLOTH POP & INTERNAL PRESSURE BURST
# ----------------------------------------------------------------------------
# Rigid Studio Collector Floor for Impact Collision
bpy.ops.mesh.primitive_plane_add(size=7.5, location=(0.0, 0.0, -1.1))
floor_obj = bpy.context.active_object
floor_obj.name = "Studio_Collision_Floor"
floor_col = floor_obj.modifiers.new(name="Floor_Collision", type='COLLISION')
floor_col.settings.thickness_outer = 0.02
floor_col.settings.damping = 0.82

# Reselect Active Packaging Specimen
bpy.context.view_layer.objects.active = obj

# Vertex Group: Heat-Sealed Edge Perimeter (Resists outward pressure blowout)
vg_seal = obj.vertex_groups.new(name="Sealed_Perimeter_Edges")
seal_indices = [
    v.index for v in obj.data.vertices
    if abs(v.co.x) > 0.86 or abs(v.co.y) > 0.86
]
if seal_indices:
    vg_seal.add(seal_indices, 0.9, 'REPLACE')

# Cloth Modifier with Internal Gas Pressure Expansion
cloth_mod = obj.modifiers.new(name="Cloth_Pressure_Burst", type='CLOTH')
cloth_mod.settings.quality = 8
cloth_mod.settings.mass = 0.24
cloth_mod.settings.tension_stiffness = 38.0
cloth_mod.settings.compression_stiffness = 38.0
cloth_mod.settings.bending_stiffness = 2.4
cloth_mod.settings.use_pressure = True
cloth_mod.settings.uniform_pressure_force = 0.0
cloth_mod.settings.pressure_factor = 2.2
cloth_mod.settings.fluid_density = 1.25
if seal_indices:
    cloth_mod.settings.vertex_group_mass = "Sealed_Perimeter_Edges"
cloth_mod.collision_settings.use_collision = True
cloth_mod.collision_settings.distance_min = 0.015

# Keyframe Pressure Pop Spike & Kinetic Launch/Rebound
cloth_mod.settings.uniform_pressure_force = 0.5
cloth_mod.settings.keyframe_insert(data_path="uniform_pressure_force", frame=1)
cloth_mod.settings.uniform_pressure_force = 6.2 # Rapid pressure surge
cloth_mod.settings.keyframe_insert(data_path="uniform_pressure_force", frame=32)
cloth_mod.settings.uniform_pressure_force = 9.8 # Peak elastic pop
cloth_mod.settings.keyframe_insert(data_path="uniform_pressure_force", frame=58)
cloth_mod.settings.uniform_pressure_force = 3.2 # Residual equilibrium
cloth_mod.settings.keyframe_insert(data_path="uniform_pressure_force", frame=110)

obj.location = (0.0, 0.0, 0.1)
obj.keyframe_insert(data_path="location", frame=1)
obj.location = (0.0, 0.0, 0.78) # Pouch lifts into air from pressure pop
obj.keyframe_insert(data_path="location", frame=42)
obj.location = (0.0, 0.0, 0.0)  # Impacts collision floor
obj.keyframe_insert(data_path="location", frame=95)`;

      cameraSection = `
# ----------------------------------------------------------------------------
# 4. MATHEMATICAL SENSOR-FIT CAMERA RIG
# ----------------------------------------------------------------------------
cam_data = bpy.data.cameras.new(name="Sensor_Fit_Camera")
cam_data.lens = 85.0
cam_data.sensor_width = 36.0
cam_data.clip_start = 0.1
cam_data.clip_end = 100.0
cam_obj = bpy.data.objects.new(name="Camera_Main", object_data=cam_data)
scene.collection.objects.link(cam_obj)
cam_obj.location = (0.0, -4.5, 1.6)
cam_obj.rotation_euler = (math.radians(72.0), 0.0, 0.0)
scene.camera = cam_obj`;

      renderExecution = `
# ----------------------------------------------------------------------------
# 5. DETERMINISTIC HEADLESS ANIMATION RENDER EXECUTION
# ----------------------------------------------------------------------------
scene.render.filepath = "dist/renders/cloth_pop_burst.mp4"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.view_settings.view_transform = 'Khronos PBR Neutral'

bpy.ops.render.render(animation=True)
print("SUCCESS: Cloth Pop burst simulation rendered (150 frames) -> cloth_pop_burst.mp4")`;

    } else if (currentPhysicsMode === 'flythrough') {
      timelineSetup = `
# Animation Timeline Configuration (240 Frames @ 24 FPS = 10.0s Beauty Film)
scene.frame_start = 1
scene.frame_end = 240
scene.render.fps = 24`;

      physicsSection = `
# ----------------------------------------------------------------------------
# 2. SPECIMEN TURNTABLE KEYFRAME DYNAMICS
# ----------------------------------------------------------------------------
# Keyframe Turntable Rotation on Specimen
obj.rotation_euler = (0.0, 0.0, 0.0)
obj.keyframe_insert(data_path="rotation_euler", frame=1)
obj.rotation_euler = (0.0, 0.0, math.radians(360.0))
obj.keyframe_insert(data_path="rotation_euler", frame=240)`;

      cameraSection = `
# ----------------------------------------------------------------------------
# 4. BEZIER CAMERA ORBIT & SHALLOW DEPTH-OF-FIELD FOCAL RIG
# ----------------------------------------------------------------------------
# Central Focal Tracking Target Empty
target_empty = bpy.data.objects.new("Camera_Focus_Target", None)
target_empty.empty_display_type = 'SPHERE'
target_empty.location = (0.0, 0.0, 0.15)
scene.collection.objects.link(target_empty)

# 360-Degree Circular Bezier Orbit Camera Curve
bpy.ops.curve.primitive_bezier_circle_add(radius=4.2, location=(0.0, 0.0, 0.8))
orbit_path = bpy.context.active_object
orbit_path.name = "Camera_Orbit_Path"
orbit_path.data.path_duration = 240

# 85mm Telephoto Full-Frame Cinema Camera with OptiX Bokeh
cam_data = bpy.data.cameras.new(name="Cinematic_FlyThrough_Camera")
cam_data.lens = 85.0
cam_data.sensor_width = 36.0
cam_data.dof.use_dof = True
cam_data.dof.focus_target = target_empty
cam_data.dof.aperture_fstop = 1.4 # Shallow cinematic depth of field
cam_data.dof.aperture_blades = 9   # 9-blade circular diaphragm

cam_obj = bpy.data.objects.new(name="Camera_FlyThrough", object_data=cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

# Follow Path Constraint
constraint_fp = cam_obj.constraints.new(type='FOLLOW_PATH')
constraint_fp.target = orbit_path
constraint_fp.use_fixed_location = True
constraint_fp.use_curve_follow = True
constraint_fp.forward_axis = 'TRACK_NEGATIVE_Z'
constraint_fp.up_axis = 'UP_Y'

# Track To Constraint (Locks optical axis on target empty)
constraint_tt = cam_obj.constraints.new(type='TRACK_TO')
constraint_tt.target = target_empty
constraint_tt.track_axis = 'TRACK_NEGATIVE_Z'
constraint_tt.up_axis = 'UP_Y'

# Keyframe Camera Orbit Path Offset & Elevation Wave
constraint_fp.offset_factor = 0.0
constraint_fp.keyframe_insert(data_path="offset_factor", frame=1)
constraint_fp.offset_factor = 1.0
constraint_fp.keyframe_insert(data_path="offset_factor", frame=240)

cam_obj.location = (0.0, 0.0, 0.8)
cam_obj.keyframe_insert(data_path="location", frame=1)
cam_obj.location = (0.0, 0.0, 1.8)
cam_obj.keyframe_insert(data_path="location", frame=120)
cam_obj.location = (0.0, 0.0, 0.8)
cam_obj.keyframe_insert(data_path="location", frame=240)`;

      renderExecution = `
# ----------------------------------------------------------------------------
# 5. DETERMINISTIC HEADLESS ANIMATION RENDER EXECUTION
# ----------------------------------------------------------------------------
scene.render.filepath = "dist/renders/camera_orbit_360.mp4"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.view_settings.view_transform = 'Khronos PBR Neutral'

bpy.ops.render.render(animation=True)
print("SUCCESS: Camera 360 fly-through film rendered (240 frames) -> camera_orbit_360.mp4")`;

    } else {
      // Default Static Single-Frame Setup
      physicsSection = '';
      cameraSection = `
# ----------------------------------------------------------------------------
# 4. MATHEMATICAL SENSOR-FIT CAMERA RIG
# ----------------------------------------------------------------------------
cam_data = bpy.data.cameras.new(name="Sensor_Fit_Camera")
cam_data.lens = 85.0              # 85mm Telephoto Portrait compression
cam_data.sensor_width = 36.0      # 35mm Full-Frame Sensor Standard
cam_data.clip_start = 0.1
cam_data.clip_end = 100.0
cam_obj = bpy.data.objects.new(name="Camera_Main", object_data=cam_data)
scene.collection.objects.link(cam_obj)
cam_obj.location = (0.0, -4.5, 1.6)
cam_obj.rotation_euler = (math.radians(72.0), 0.0, 0.0)
scene.camera = cam_obj`;

      renderExecution = `
# ----------------------------------------------------------------------------
# 5. DETERMINISTIC HEADLESS RENDER EXECUTION
# ----------------------------------------------------------------------------
scene.render.filepath = "dist/renders/render_output.png"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.view_settings.view_transform = 'Khronos PBR Neutral'

bpy.ops.render.render(write_still=True)
print(f"SUCCESS: Render completed with OptiX ({samples} samples) -> render_output.png")`;
    }

    const script = `# ============================================================================
# Blender 5.2.2 LTS Parametric Studio Automation (Headless OptiX Engine)
# Hardware: NVIDIA GeForce RTX 5070 Ti (16GB GDDR7) | Cycles OptiX Backend
# Model: ${meshName} | Resolution: ${segments} Segments | Samples: ${samples}
# Physics Mode: ${currentPhysicsMode.toUpperCase()}
# Generated dynamically via Blender MCP Socket Bridge (127.0.0.1:9876)
# ============================================================================

import bpy
import math

# Reset scene to clean factory slate
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ----------------------------------------------------------------------------
# HARDWARE ACCELERATION & CYCLES OPTIX SETUP
# ----------------------------------------------------------------------------
scene.render.engine = 'CYCLES'
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'OPTIX'
prefs.get_devices()

for device in prefs.devices:
    device.use = (device.type == 'OPTIX') # Pin RTX 5070 Ti Tensor Cores

scene.cycles.device = 'GPU'
scene.cycles.samples = ${samples}
scene.cycles.preview_samples = 32
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPTIX'
scene.cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'${timelineSetup}
${meshCode}
${physicsSection}

# ----------------------------------------------------------------------------
# 3. PROCEDURAL PBR NEUTRAL SHADER NODE TREE
# ----------------------------------------------------------------------------
mat = bpy.data.materials.new(name="PBR_Neutral_Procedural")
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
nodes.clear()

# Output Surface Node
node_output = nodes.new(type='ShaderNodeOutputMaterial')
node_output.location = (640, 0)

# Principled BSDF Standard Micro-facet Shader
node_bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
node_bsdf.location = (320, 0)
node_bsdf.inputs['Roughness'].default_value = 0.18
node_bsdf.inputs['Metallic'].default_value = 0.88

# Procedural 3D Noise Texture
node_noise = nodes.new(type='ShaderNodeTexNoise')
node_noise.location = (-240, 80)
node_noise.inputs['Scale'].default_value = ${noise.toFixed(1)}
node_noise.inputs['Detail'].default_value = 4.0
node_noise.inputs['Roughness'].default_value = 0.58

# High-Chroma ColorRamp (Khronos Tone-Mapping Stress Testbed)
node_ramp = nodes.new(type='ShaderNodeValToRGB')
node_ramp.location = (30, 80)
node_ramp.color_ramp.elements[0].position = 0.25
node_ramp.color_ramp.elements[0].color = (0.976, 0.451, 0.086, 1.0) # Ember Glow
node_ramp.color_ramp.elements[1].position = 0.80
node_ramp.color_ramp.elements[1].color = (0.02, 0.52, 0.78, 1.0)    # Cobalt Rim

# Surface Bump Micro-Geometry
node_bump = nodes.new(type='ShaderNodeBump')
node_bump.location = (30, -180)
node_bump.inputs['Strength'].default_value = 0.12
node_bump.inputs['Distance'].default_value = 0.08

# Link Shader Sockets
links.new(node_noise.outputs['Fac'], node_ramp.inputs['Fac'])
links.new(node_noise.outputs['Fac'], node_bump.inputs['Height'])
links.new(node_ramp.outputs['Color'], node_bsdf.inputs['Base Color'])
links.new(node_bump.outputs['Normal'], node_bsdf.inputs['Normal'])
links.new(node_bsdf.outputs['BSDF'], node_output.inputs['Surface'])

obj.data.materials.append(mat)

# ----------------------------------------------------------------------------
# 3b. KHRONOS 3-POINT STUDIO LIGHTING RIG
# ----------------------------------------------------------------------------
def spawn_light(name, light_type, power, color, location):
    data = bpy.data.lights.new(name=name, type=light_type)
    data.energy = power
    data.color = color
    light_obj = bpy.data.objects.new(name=name, object_data=data)
    scene.collection.objects.link(light_obj)
    light_obj.location = location
    return light_obj

# Key Light: Focused Cobalt Area Light
spawn_light("Light_Key_Cobalt", 'AREA', 450.0, (0.22, 0.74, 0.97), (-3.5, -2.0, 3.2))

# Rim Light: Grazing Ember Point Light
spawn_light("Light_Rim_Ember", 'POINT', 680.0, (0.98, 0.45, 0.09), (3.8, 3.5, 2.8))

# Fill Light: Soft Ambient Hemispheric Sun
spawn_light("Light_Fill_Cold", 'SUN', 1.85, (0.85, 0.92, 1.0), (0.0, 0.0, 5.0))
${cameraSection}
${renderExecution}`;

    if (scriptContent) {
      scriptContent.textContent = script;
    }
  }

  // --------------------------------------------------------------------------
  // 3. WIRE SLIDER CONTROLS & VALUE LABELS (RAF THROTTLED TO PREVENT LAYOUT THRASHING)
  // --------------------------------------------------------------------------
  let workbenchUpdateScheduled = false;
  function scheduleWorkbenchUpdate() {
    if (workbenchUpdateScheduled) return;
    workbenchUpdateScheduled = true;
    requestAnimationFrame(() => {
      workbenchUpdateScheduled = false;
      updateWorkbenchMesh();
      generateBpyScript();
    });
  }

  if (sliderSegments && valSegments) {
    sliderSegments.addEventListener('input', (e) => {
      segments = parseInt(e.target.value, 10);
      valSegments.textContent = segments;
      scheduleWorkbenchUpdate();
    });
  }

  if (sliderRadius && valRadius) {
    sliderRadius.addEventListener('input', (e) => {
      radius = parseFloat(e.target.value);
      valRadius.textContent = `${radius.toFixed(2)}m`;
      scheduleWorkbenchUpdate();
    });
  }

  if (sliderNoise && valNoise) {
    sliderNoise.addEventListener('input', (e) => {
      noise = parseFloat(e.target.value);
      valNoise.textContent = `${noise.toFixed(1)}x`;
      scheduleWorkbenchUpdate();
    });
  }

  if (sliderSamples && valSamples) {
    sliderSamples.addEventListener('input', (e) => {
      samples = parseInt(e.target.value, 10);
      valSamples.textContent = samples;
      scheduleWorkbenchUpdate();
    });
  }

  // --------------------------------------------------------------------------
  // 4. WIRE MESH TYPE SWITCHER
  // --------------------------------------------------------------------------
  meshButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetMesh = btn.getAttribute('data-mesh');
      if (!targetMesh) return;

      meshButtons.forEach((b) => {
        b.classList.remove('active');
        b.style.background = '';
        b.style.borderColor = '';
        b.style.color = '';
      });

      btn.classList.add('active');
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';

      currentMesh = targetMesh;

      // Adjust label semantics based on mesh type
      const radiusLabelSpan = document.querySelector('#bpy-slider-radius')
        ?.parentElement?.querySelector('span');
      if (radiusLabelSpan) {
        if (currentMesh === 'canister') {
          radiusLabelSpan.textContent = 'Canister Cylinder Radius:';
        } else if (currentMesh === 'pack') {
          radiusLabelSpan.textContent = 'Ripple Wave Amplitude:';
        } else {
          radiusLabelSpan.textContent = 'Minor Radius / Bevel:';
        }
      }

      updateWorkbenchMesh();
      generateBpyScript();

      if (statusBox) {
        statusBox.innerHTML = `MESH SWITCHED: <strong>${targetMesh.toUpperCase()}</strong> selected. Parametric bpy script recalculated for Blender 5.2.`;
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4b. PROCEDURAL PHYSICS FILM PRESET CONTROLS
  // --------------------------------------------------------------------------
  function setPhysicsMode(mode) {
    if (currentPhysicsMode === mode) {
      currentPhysicsMode = 'none';
    } else {
      currentPhysicsMode = mode;
      physicsStartTime = performance.now();
    }

    physicsButtons.forEach((btn) => {
      const pMode = btn.getAttribute('data-physics');
      if (pMode === currentPhysicsMode) {
        btn.classList.add('active');
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      } else {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }
    });

    if (physicsModeLabel) {
      if (currentPhysicsMode === 'ripple') {
        physicsModeLabel.textContent = 'PACKAGING RIPPLE';
        physicsModeLabel.style.color = 'var(--c-amber)';
      } else if (currentPhysicsMode === 'cloth-pop') {
        physicsModeLabel.textContent = 'CLOTH POP BURST';
        physicsModeLabel.style.color = 'var(--c-amber)';
      } else if (currentPhysicsMode === 'flythrough') {
        physicsModeLabel.textContent = 'FLY-THROUGH 360';
        physicsModeLabel.style.color = 'var(--c-amber)';
      } else {
        physicsModeLabel.textContent = 'IDLE / STATIC';
        physicsModeLabel.style.color = 'var(--t-muted)';
      }
    }

    // Auto-select chip pack for optimal ripple presentation if in ripple mode
    if (currentPhysicsMode === 'ripple' && currentMesh !== 'pack') {
      const packBtn = document.querySelector('.blender-mesh-btn[data-mesh="pack"]');
      if (packBtn) {
        packBtn.click();
        return; // click handler will call updateWorkbenchMesh and generateBpyScript
      }
    }

    generateBpyScript();
    resumeWorkbench();

    if (statusBox) {
      if (currentPhysicsMode === 'ripple') {
        statusBox.innerHTML = `PHYSICS PRESET: <strong>PACKAGING RIPPLE</strong> active. Pinned seam vertex group, sinusoidal flex wave, and cloth damping curve inserted into bpy script (120 frames).`;
      } else if (currentPhysicsMode === 'cloth-pop') {
        statusBox.innerHTML = `PHYSICS PRESET: <strong>CLOTH POP BURST</strong> active. Internal pouch pressure keyframes, collision obstacle floor, and rebound physics generated for Blender 5.2 OptiX (150 frames).`;
      } else if (currentPhysicsMode === 'flythrough') {
        statusBox.innerHTML = `PHYSICS PRESET: <strong>CAMERA FLY-THROUGH 360</strong> active. Bezier circular orbit path, 85mm f/1.4 shallow depth of field, and Follow Path constraints keyframed (240 frames).`;
      } else {
        statusBox.innerHTML = `PHYSICS RESET: Returned to static parametric workbench. Standard Khronos PBR Neutral single-frame OptiX script active.`;
      }
    }
  }

  physicsButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-physics');
      if (mode) setPhysicsMode(mode);
    });
  });

  // --------------------------------------------------------------------------
  // 4c. WIREFRAME MODE TOGGLE
  // --------------------------------------------------------------------------
  function updateWireframeBtnVisual() {
    if (!wireframeBtn) return;
    if (isWireframe) {
      wireframeBtn.classList.add('active');
      wireframeBtn.setAttribute('aria-pressed', 'true');
      wireframeBtn.style.background = 'rgba(56, 189, 248, 0.16)';
      wireframeBtn.style.borderColor = '#38bdf8';
      wireframeBtn.style.color = '#38bdf8';
      wireframeBtn.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.25)';
    } else {
      wireframeBtn.classList.remove('active');
      wireframeBtn.setAttribute('aria-pressed', 'false');
      wireframeBtn.style.background = 'rgba(255, 255, 255, 0.03)';
      wireframeBtn.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      wireframeBtn.style.color = 'var(--t-secondary)';
      wireframeBtn.style.boxShadow = 'none';
    }
  }

  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      isWireframe = !isWireframe;
      if (wbMesh && wbMesh.material) {
        if (Array.isArray(wbMesh.material)) {
          wbMesh.material.forEach((m) => {
            m.wireframe = isWireframe;
            m.needsUpdate = true;
          });
        } else {
          wbMesh.material.wireframe = isWireframe;
          wbMesh.material.needsUpdate = true;
        }
      }
      updateWireframeBtnVisual();
    });
  }

  // --------------------------------------------------------------------------
  // 5. COPY SCRIPT BUTTON
  // --------------------------------------------------------------------------
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const code = scriptContent.textContent;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          const ta = document.createElement('textarea');
          ta.value = code;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied to Clipboard';
        copyBtn.style.borderColor = 'var(--c-amber)';
        copyBtn.style.color = 'var(--c-amber)';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. MULTI-PHASE HEADLESS RENDER SIMULATOR
  // --------------------------------------------------------------------------
  if (renderBtn) {
    renderBtn.addEventListener('click', () => {
      if (isRendering) return;
      isRendering = true;
      renderBtn.disabled = true;
      renderBtn.style.opacity = '0.65';
      renderBtn.style.cursor = 'not-allowed';

      const originalBtnHtml = renderBtn.innerHTML;
      renderBtn.innerHTML = '<span>Rendering Cycles Pass...</span>';

      const startTimestamp = performance.now();
      function getTimestamp() {
        const elapsed = ((performance.now() - startTimestamp) / 1000).toFixed(3);
        return `[+${elapsed}s]`;
      }

      const isPhysicsFilm = currentPhysicsMode !== 'none';
      const frameCount = currentPhysicsMode === 'ripple' ? 120 : (currentPhysicsMode === 'cloth-pop' ? 150 : (currentPhysicsMode === 'flythrough' ? 240 : 1));
      const outputFilename = currentPhysicsMode === 'ripple' ? 'packaging_ripple_film.mp4' : (currentPhysicsMode === 'cloth-pop' ? 'cloth_pop_burst.mp4' : (currentPhysicsMode === 'flythrough' ? 'camera_orbit_360.mp4' : 'render_output.png'));

      // Step 1: Dispatching
      if (statusBox) {
        statusBox.innerHTML = `<span style="color:#38bdf8;">${getTimestamp()} DISPATCH:</span> Sending JSON-RPC payload to Blender MCP Socket 127.0.0.1:9876 (mode: ${isPhysicsFilm ? 'physics_animation_film' : 'still_image'}, frames: ${frameCount})...`;
      }

      // Step 2: Compiling BVH & Physics Cache
      setTimeout(() => {
        const physicsNote = isPhysicsFilm
          ? `OptiX cloth & point cache baked [${frameCount}/${frameCount}] frames.`
          : 'Geometry build on RTX 5070 Ti (16GB GDDR7, OptiX backend).';
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} Socket payload delivered (${isPhysicsFilm ? '3,480' : '1,842'} bytes).</div>
            <div><span style="color:#fbbf24;">${getTimestamp()} BVH & CACHE COMPILING:</span> ${physicsNote}</div>
          `;
        }
      }, 420);

      // Step 3: Progressive Sampling
      setTimeout(() => {
        const halfSamples = Math.round(samples * 0.5);
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} BVH built in 14.2ms (${segments * 2} tris).</div>
            <div><span style="color:#f97316;">${getTimestamp()} SAMPLING:</span> Cycles OptiX tile passes [1/${samples}] ... [${halfSamples}/${samples}]</div>
          `;
        }
      }, 950);

      // Step 4: Denoising
      setTimeout(() => {
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} Cycles OptiX passes converged at ${samples}/${samples} spp.</div>
            <div><span style="color:#a855f7;">${getTimestamp()} DENOISING:</span> OptiX temporal neural denoiser applied across RGB_ALBEDO_NORMAL guide passes...</div>
          `;
        }
      }, 1550);

      // Step 5: Completed
      setTimeout(() => {
        if (statusBox) {
          statusBox.innerHTML = `
            <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} Neural denoiser completed in 18.5ms.</div>
            <div style="color:#10b981; font-weight:700;">${getTimestamp()} COMPLETE: Output written to ${outputFilename} (100% matched Khronos PBR Neutral)</div>
          `;
        }

        renderBtn.innerHTML = '<span>Render Complete</span>';
        renderBtn.style.borderColor = '#10b981';

        setTimeout(() => {
          renderBtn.innerHTML = originalBtnHtml;
          renderBtn.disabled = false;
          renderBtn.style.opacity = '1.0';
          renderBtn.style.cursor = 'pointer';
          renderBtn.style.borderColor = '';
          isRendering = false;
        }, 2500);
      }, 2150);
    });
  }

  // --------------------------------------------------------------------------
  // 7. QUICK NAVIGATION: Wire #hero-blender-cta to #section-blender tab
  // --------------------------------------------------------------------------
  if (heroBlenderCta) {
    heroBlenderCta.addEventListener('click', (e) => {
      e.preventDefault();
      const blenderTabBtn = document.getElementById('tab-blender') 
        || document.querySelector('.nav-tab-btn[data-target="section-blender"]');
      if (blenderTabBtn) {
        blenderTabBtn.click();
        const targetSection = document.getElementById('section-blender');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. CLIENT-SIDE 3D MODEL EXPORTER (GLB BINARY CONTAINER & WAVEFRONT OBJ FALLBACK)
  // --------------------------------------------------------------------------
  let isExporting = false;

  function triggerFileDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 1200);
  }

  function showExportToast(message, isSuccess = true) {
    let toast = document.getElementById('bpy-export-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bpy-export-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '2rem';
      toast.style.right = '2rem';
      toast.style.zIndex = '9999';
      toast.style.maxWidth = '420px';
      toast.style.padding = '0.85rem 1.35rem';
      toast.style.background = 'rgba(11, 13, 19, 0.94)';
      toast.style.backdropFilter = 'blur(20px)';
      toast.style.webkitBackdropFilter = 'blur(20px)';
      toast.style.border = '1px solid var(--c-hairline-bright, rgba(255, 255, 255, 0.16))';
      toast.style.borderRadius = 'var(--r-inner, 8px)';
      toast.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)';
      toast.style.fontFamily = 'var(--font-mono, monospace)';
      toast.style.fontSize = '0.82rem';
      toast.style.color = 'var(--t-primary, #ffffff)';
      toast.style.pointerEvents = 'none';
      toast.style.transition = 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      document.body.appendChild(toast);
    }
    const statusColor = isSuccess ? '#10b981' : '#38bdf8';
    const symbol = isSuccess ? '[OK]' : '●';
    toast.innerHTML = `<span style="color:${statusColor}; font-weight:700;">${symbol}</span> <span style="margin-left:0.4rem; line-height:1.4;">${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 3200);
  }

  function exportWavefrontObj(mesh, meshType, timestamp) {
    if (!mesh || !mesh.geometry) {
      throw new Error('No active mesh geometry available for Wavefront OBJ export.');
    }

    const geom = mesh.geometry.clone();
    if (!geom.attributes.normal) {
      geom.computeVertexNormals();
    }

    const posAttr = geom.attributes.position;
    if (!posAttr) {
      throw new Error('Mesh geometry lacks position attribute.');
    }

    // Ensure UV attribute is present for complete face descriptors
    if (!geom.attributes.uv) {
      const uvArray = new Float32Array(posAttr.count * 2);
      geom.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
    }

    const normAttr = geom.attributes.normal;
    const uvAttr = geom.attributes.uv;
    const indexAttr = geom.index;

    const headerMeshName = meshType === 'torus'
      ? 'Torus_Superquadric_Cosmic'
      : (meshType === 'canister' ? 'Cylindrical_Packaging_Canister' : 'SunChips_Ripple_Surface_Pack');

    const objLines = [];
    objLines.push('# Wavefront OBJ File');
    objLines.push('# Generated by Creative Engineering Showcase: Blender 5.2 MCP Parametric Studio');
    objLines.push(`# Specimen: ${headerMeshName}`);
    objLines.push(`# Vertices: ${posAttr.count} | Normals: ${normAttr ? normAttr.count : 0}`);
    objLines.push(`o ${headerMeshName}`);
    objLines.push('');

    // 1. Geometric Vertices (v x y z)
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i).toFixed(6);
      const y = posAttr.getY(i).toFixed(6);
      const z = posAttr.getZ(i).toFixed(6);
      objLines.push(`v ${x} ${y} ${z}`);
    }
    objLines.push('');

    // 2. Texture coordinates (vt u v)
    for (let i = 0; i < uvAttr.count; i++) {
      const u = uvAttr.getX(i).toFixed(6);
      const v = uvAttr.getY(i).toFixed(6);
      objLines.push(`vt ${u} ${v}`);
    }
    objLines.push('');

    // 3. Vertex Normals (vn nx ny nz)
    for (let i = 0; i < normAttr.count; i++) {
      const nx = normAttr.getX(i).toFixed(6);
      const ny = normAttr.getY(i).toFixed(6);
      const nz = normAttr.getZ(i).toFixed(6);
      objLines.push(`vn ${nx} ${ny} ${nz}`);
    }
    objLines.push('');

    objLines.push('s 1');

    // 4. Polygonal Face Elements (f v/vt/vn) (1-based indices, no // delimiters)
    if (indexAttr) {
      for (let i = 0; i < indexAttr.count; i += 3) {
        const a = indexAttr.getX(i) + 1;
        const b = indexAttr.getX(i + 1) + 1;
        const c = indexAttr.getX(i + 2) + 1;
        objLines.push(`f ${a}/${a}/${a} ${b}/${b}/${b} ${c}/${c}/${c}`);
      }
    } else {
      for (let i = 0; i < posAttr.count; i += 3) {
        const a = i + 1;
        const b = i + 2;
        const c = i + 3;
        objLines.push(`f ${a}/${a}/${a} ${b}/${b}/${b} ${c}/${c}/${c}`);
      }
    }

    const objText = objLines.join('\n');
    geom.dispose(); // Prevent WebGL buffer/RAM leak on cloned export geometry
    const blob = new Blob([objText], { type: 'text/plain;charset=utf-8' });
    const filename = `specimen-${meshType}-${timestamp}.obj`;
    triggerFileDownload(blob, filename);

    const sizeKb = (blob.size / 1024).toFixed(1);
    return { filename, format: 'OBJ (Fallback)', sizeKb };
  }

  function exportActive3DAsset() {
    if (isExporting) return;
    if (!wbMesh) {
      showExportToast('No active 3D specimen mesh to export.', false);
      return;
    }

    const THREE = window.THREE;
    if (!THREE) {
      showExportToast('Three.js runtime not initialized.', false);
      return;
    }

    isExporting = true;
    const originalBtnHtml = downloadGlbBtn ? downloadGlbBtn.innerHTML : '<span>Export 3D Asset (.GLB)</span>';
    if (downloadGlbBtn) {
      downloadGlbBtn.disabled = true;
      downloadGlbBtn.style.opacity = '0.75';
      downloadGlbBtn.style.cursor = 'wait';
      downloadGlbBtn.innerHTML = '<span>Exporting...</span>';
    }

    const timestamp = Date.now();

    showExportToast(`Packing active ${currentMesh.toUpperCase()} mesh and PBR materials...`, false);
    if (statusBox) {
      statusBox.innerHTML = `<span style="color:#38bdf8;">EXPORTING:</span> Serializing active ${currentMesh.toUpperCase()} mesh into binary GLB container...`;
    }

    // Create an unrotated clone for immaculate rest-pose export
    const exportMesh = wbMesh.clone();
    exportMesh.rotation.set(0, 0, 0);
    exportMesh.position.set(0, 0, 0);
    exportMesh.scale.set(1, 1, 1);

    const meshNameMap = {
      torus: 'Torus_Superquadric_Cosmic',
      canister: 'Cylindrical_Packaging_Canister',
      pack: 'SunChips_Ripple_Surface_Pack'
    };
    exportMesh.name = meshNameMap[currentMesh] || `Specimen_${currentMesh}`;

    if (exportMesh.geometry && !exportMesh.geometry.attributes.normal) {
      exportMesh.geometry.computeVertexNormals();
    }

    function handleSuccess(filename, sizeKb, format) {
      if (downloadGlbBtn) {
        downloadGlbBtn.innerHTML = '<span>Asset Downloaded</span>';
        downloadGlbBtn.style.borderColor = '#10b981';
        downloadGlbBtn.style.color = '#10b981';
      }

      showExportToast(`Downloaded ${filename} (${sizeKb} KB) &bull; ${format}`, true);

      if (statusBox) {
        statusBox.innerHTML = `
          <div style="color:var(--t-muted); margin-bottom:0.25rem;">3D Specimen Export Successful (${format}).</div>
          <div style="color:#10b981; font-weight:700;">COMPLETE: Downloaded ${filename} (${sizeKb} KB) with PBR materials and vertex normals.</div>
        `;
      }

      setTimeout(() => {
        if (downloadGlbBtn) {
          downloadGlbBtn.innerHTML = originalBtnHtml;
          downloadGlbBtn.disabled = false;
          downloadGlbBtn.style.opacity = '1.0';
          downloadGlbBtn.style.cursor = 'pointer';
          downloadGlbBtn.style.borderColor = '';
          downloadGlbBtn.style.color = '';
        }
        isExporting = false;
      }, 2400);
    }

    function handleFailure(err) {
      console.error('[BlenderStudio] 3D export failed:', err);
      if (downloadGlbBtn) {
        downloadGlbBtn.innerHTML = '<span>Export Failed</span>';
        downloadGlbBtn.style.borderColor = '#ef4444';
        downloadGlbBtn.style.color = '#ef4444';
      }
      showExportToast('Export failed. Check browser console.', false);

      setTimeout(() => {
        if (downloadGlbBtn) {
          downloadGlbBtn.innerHTML = originalBtnHtml;
          downloadGlbBtn.disabled = false;
          downloadGlbBtn.style.opacity = '1.0';
          downloadGlbBtn.style.cursor = 'pointer';
          downloadGlbBtn.style.borderColor = '';
          downloadGlbBtn.style.color = '';
        }
        isExporting = false;
      }, 2400);
    }

    const exportOptions = {
      binary: true,
      embedImages: true,
      truncateDrawRange: false,
      maxTextureSize: 2048
    };

    try {
      if (typeof GLTFExporter === 'function') {
        const exporter = new GLTFExporter();
        exporter.parse(
          exportMesh,
          (result) => {
            try {
              const blob = new Blob([result], { type: 'model/gltf-binary' });
              const filename = `specimen-${currentMesh}-${timestamp}.glb`;
              triggerFileDownload(blob, filename);
              const sizeKb = (blob.size / 1024).toFixed(1);
              handleSuccess(filename, sizeKb, 'GLB');
            } catch (blobErr) {
              console.warn('[BlenderStudio] Blob generation failed, engaging Wavefront OBJ fallback:', blobErr);
              try {
                const fb = exportWavefrontObj(exportMesh, currentMesh, timestamp);
                handleSuccess(fb.filename, fb.sizeKb, fb.format);
              } catch (fbErr) {
                handleFailure(fbErr);
              }
            }
          },
          (error) => {
            console.warn('[BlenderStudio] GLTFExporter failed, engaging Wavefront OBJ fallback:', error);
            try {
              const fb = exportWavefrontObj(exportMesh, currentMesh, timestamp);
              handleSuccess(fb.filename, fb.sizeKb, fb.format);
            } catch (fbErr) {
              handleFailure(fbErr);
            }
          },
          exportOptions
        );
      } else {
        throw new Error('GLTFExporter is not available');
      }
    } catch (err) {
      console.warn('[BlenderStudio] GLTF export exception, engaging Wavefront OBJ fallback:', err);
      try {
        const fb = exportWavefrontObj(exportMesh, currentMesh, timestamp);
        handleSuccess(fb.filename, fb.sizeKb, fb.format);
      } catch (fbErr) {
        handleFailure(fbErr);
      }
    }
  }

  if (downloadGlbBtn) {
    downloadGlbBtn.addEventListener('click', exportActive3DAsset);
  }

  window.exportBlenderMesh = exportActive3DAsset;

  // Teardown / Cleanup Hook for pristine lifecycle management
  function disposeStudio() {
    pauseWorkbench();
    if (wbObserver) {
      wbObserver.disconnect();
      wbObserver = null;
    }
    if (wbMesh && wbScene) {
      wbScene.remove(wbMesh);
      if (wbMesh.geometry) wbMesh.geometry.dispose();
      if (wbMesh.material) {
        if (Array.isArray(wbMesh.material)) wbMesh.material.forEach((m) => m.dispose());
        else wbMesh.material.dispose();
      }
      wbMesh = null;
    }
    if (wbRenderer) {
      wbRenderer.dispose();
      if (wbRenderer.domElement && wbRenderer.domElement.parentElement) {
        wbRenderer.domElement.parentElement.removeChild(wbRenderer.domElement);
      }
      wbRenderer = null;
    }
    wbScene = null;
    wbCamera = null;
    if (studioRoot) {
      delete studioRoot.dataset.blenderStudioInitialized;
    }
  }

  window.disposeBlenderStudio = disposeStudio;

  // Initialize 3D Workbench and Python Script
  init3DWorkbench();
  generateBpyScript();

  // Initialize Adobe Creative Cloud Automation Hub
  try {
    if (typeof initAdobeCCAutomationHub === 'function') {
      initAdobeCCAutomationHub();
    }
  } catch (err) {
    console.warn('[BlenderStudio] Failed to initialize Adobe Creative Cloud Automation Hub:', err);
  }

  // Initialize Free 3D Character Rigging & Animation Pipeline Matrix
  try {
    initBlenderRiggingPipeline();
  } catch (err) {
    console.warn('[BlenderStudio] Failed to initialize Rigging Pipeline Matrix:', err);
  }

  console.log('[BlenderStudio] Initialized successfully with Blender 5.2 OptiX pipeline.');
}

export function disposeBlenderStudio() {
  if (typeof window !== 'undefined' && typeof window.disposeBlenderStudio === 'function') {
    window.disposeBlenderStudio();
  }
}

// ============================================================================
// Free 3D Character Rigging & Animation Pipeline Matrix
// Interactive selection for Mixamo, AccuRig, Rigify, and Rokoko workflows
// Interactive Bone Mapping Visualizer & BPY Batch Retargeting Script
// ============================================================================

export function initBlenderRiggingPipeline() {
  if (typeof document === 'undefined') return;

  const detailPanel = document.getElementById('rigging-detail-panel');
  const boneTbody = document.getElementById('bone-matrix-tbody');
  const boneDiagnostics = document.getElementById('bone-zone-diagnostics');
  const copyRiggingBtn = document.getElementById('copy-rigging-script-btn');
  const riggingScriptCode = document.getElementById('bpy-rigging-script');

  if (!detailPanel || !boneTbody) {
    return;
  }

  // 1. Pipeline Knowledge Database
  const PIPELINES = {
    mixamo: {
      id: 'mixamo',
      name: 'Mixamo',
      title: 'Mixamo Cloud Auto-Rig & Mocap Suite',
      badge: 'Adobe Free Cloud · Zero Cost',
      tag: 'Humanoid Auto-Rig',
      spec: 'FBX 7.4 Binary · 65/67 Bones · 2,000+ Mocap Clips',
      summary: 'Adobe web-based auto-rigging service and motion capture library. Upload any clean humanoid mesh in T-pose or A-pose, place 5 anatomical markers, and download fully weighted characters with embedded animation tracks.',
      markerGuide: [
        { joint: 'Chin', desc: 'Bottom of the mandible / lowest chin point' },
        { joint: 'Wrists', desc: 'Center of carpal wrist flexion hinge' },
        { joint: 'Elbows', desc: 'Outer elbow hinge point (olecranon process)' },
        { joint: 'Knees', desc: 'Center of knee patella joint' },
        { joint: 'Groin', desc: 'Lowest crotch boundary / pelvic root' }
      ],
      features: [
        'Automated voxel skin weighting computed in seconds in the cloud',
        'Library of 2,000+ high-fidelity mocap animation clips across combat, locomotion, and performance',
        'Parametric sliders for Overdrive (tempo), Character Arm-Space offset, and In-Place root locking',
        'Direct download in FBX (with or without skin) for Unity, Unreal Engine, and Blender'
      ],
      blenderWorkflow: [
        'Upload base character mesh (OBJ/FBX) with clean manifold topology to Mixamo.com.',
        'Align the 5 anatomical markers according to the guide and verify the automated rig solve.',
        'Select motion clips, customize the Arm-Space slider to eliminate mesh penetration, and toggle In-Place if required.',
        'Download as FBX Binary (30/60 fps) and import into Blender with "Ignore Leaf Bones" enabled.',
        'Run the Batch Bone Renamer utility below to normalize the "mixamorig:" namespace to Rigify or Humanoid standards.'
      ],
      exportSettings: [
        { label: 'Format', val: 'FBX Binary 7.4' },
        { label: 'Skin', val: 'With Skin (Character) / Without Skin (Clips)' },
        { label: 'Frame Rate', val: '30 or 60 FPS' },
        { label: 'Keyframe Reduction', val: 'None (Uniform)' }
      ],
      pros: 'Fastest turnaround (under 60s); huge library of mocap clips; zero software installation.',
      cons: 'Bipedal humanoids only; no manual vertex weight paint adjustments in-browser.',
      bestFor: 'Rapid character prototyping, crowd NPCs, WebGL Three.js characters, and background game assets.'
    },

    accurig: {
      id: 'accurig',
      name: 'AccuRig',
      title: 'AccuRig Standalone 5-Finger Precise Auto-Rigger',
      badge: 'ActorCore Free Tool · Desktop Standalone',
      tag: '5-Finger Knuckle Detection',
      spec: 'OBJ / FBX / USD · ARKit 52 Blendshapes · Root Motion',
      summary: 'Free desktop auto-rigging application by Reallusion. Delivers state-of-the-art 5-finger knuckle detection, sagittal spine curvature adjustment, and direct export with root motion preservation and ARKit facial blendshapes.',
      markerGuide: [
        { joint: 'Hand / Knuckles', desc: 'Automatic 5-finger knuckle detector (MCP, PIP, DIP joints)' },
        { joint: 'Spine Curve', desc: 'Sagittal (side) and coronal (front) spine alignment' },
        { joint: 'Symmetry Lock', desc: 'Auto-symmetry detection with manual asymmetric overrides' },
        { joint: 'Root Anchor', desc: 'Preserves true root motion translation at pelvic center' }
      ],
      features: [
        'Surgical 5-finger rigging with options for 1-finger (thumb), 3-finger, or full 5-finger articulation',
        'Precise spine curvature editing to match natural anatomical posture and slouch',
        'Built-in motion previewer to test walk, jump, combat, and run cycles before export',
        'Generates ARKit 52 facial blendshapes for VTuber, iOS, and live facial mocap tracking'
      ],
      blenderWorkflow: [
        'Export your character mesh from Blender as OBJ or FBX with all transforms applied (Ctrl+A).',
        'Import mesh into AccuRig desktop application; the automated solver places joint pins.',
        'Review knuckle joint placement in the 3D viewport and adjust fingers 1 through 5.',
        'Adjust the spine curvature line in the side profile view to fit the mesh volume.',
        'Export using the dedicated "Blender" preset with calibrated bone rolls and embedded textures.'
      ],
      exportSettings: [
        { label: 'Export Preset', val: 'Blender Target' },
        { label: 'Finger Rig', val: '5 Fingers (Full Articulation)' },
        { label: 'Facial Rig', val: 'ARKit 52 Expression Blendshapes' },
        { label: 'Root Motion', val: 'Enabled (Root Bone at Z=0)' }
      ],
      pros: 'Exceptional hand/finger skinning; spine curvature control; free desktop offline workflow.',
      cons: 'Desktop Windows application required; restricted to bipedal characters.',
      bestFor: 'Hero game protagonists, VR avatars with detailed hand gestures, and high-fidelity real-time models.'
    },

    rigify: {
      id: 'rigify',
      name: 'Rigify',
      title: 'Blender 5.2 Native Rigify Procedural Meta-Rig',
      badge: 'Blender Core Built-In · 100% Free & Open Source',
      tag: 'Procedural Rig Generation',
      spec: 'bpy.ops.pose.rigify_generate() · FK/IK Snapping · Squash & Stretch',
      summary: "Blender's built-in procedural armature generation framework. Automatically generates production-grade animation rigs with seamless FK/IK snapping, squash and stretch, custom bone picker shapes (WGT-), and modular limb types.",
      markerGuide: [
        { joint: 'Meta-Rig Human', desc: 'Includes spine (4 bones), clavicles, arms, legs, 10 fingers, and face' },
        { joint: 'IK Planar Angle', desc: 'Ensure elbow and knee joints possess a slight natural bend in Edit Mode' },
        { joint: 'Bone Collections', desc: 'Controls, deformers, and mechanism bones organized in distinct layers' },
        { joint: 'Custom Shapes', desc: 'Generates procedural wireframe widgets (WGT-*) for viewport selection' }
      ],
      features: [
        'Procedural control rig synthesized with one click via bpy.ops.pose.rigify_generate()',
        'Seamless bidirectional FK/IK snapping and switching from the generated N-panel UI',
        'Modular bone architecture: spines.basic_spine, limbs.arm, limbs.leg, limbs.super_finger',
        'Automated weight distribution with heat-map diffusion (Ctrl+P > With Automatic Weights)'
      ],
      blenderWorkflow: [
        'Enable Rigify in Edit > Preferences > Add-ons > Rigging: Rigify.',
        'Add Human Meta-Rig (Add > Armature > Human (Meta-Rig)) and align edit bones with X-Axis Mirror.',
        'Verify that elbow and knee joints bend slightly along their respective planar axes.',
        'In Armature Object Data Properties, click "Generate Rig" to compile the full control rig.',
        'Select mesh cage, Shift-select generated rig, press Ctrl+P, and choose "With Automatic Weights".'
      ],
      exportSettings: [
        { label: 'Generation Method', val: 'Procedural Python Compilation' },
        { label: 'Control Layer', val: 'Custom Widget Collection (WGT)' },
        { label: 'Deformation Layer', val: 'DEF-* Bone Hierarchy' },
        { label: 'glTF Export', val: 'Export DEF bones only (Bake Animations)' }
      ],
      pros: 'Deepest feature set; native FK/IK snapping; squash & stretch; zero external dependencies.',
      cons: 'Requires careful joint placement in Edit Mode; full rig contains 160+ bones.',
      bestFor: 'Cinematic animated shorts, keyframe animators in Blender, and complex deformation rigs.'
    },

    rokoko: {
      id: 'rokoko',
      name: 'Rokoko',
      title: 'Rokoko AI Video Mocap & Retargeting Studio',
      badge: 'Single-Camera AI Vision · Free Tier & Addon',
      tag: 'Single-Camera AI Mocap',
      spec: 'Smartphone / Webcam MP4 · Foot-Locking · Euler Filter Smoothing',
      summary: 'AI-driven computer vision motion capture system that extracts full-body 3D performance from a single smartphone or webcam video, paired with a free Blender addon for one-click armature retargeting and foot slide prevention.',
      markerGuide: [
        { joint: 'Video Input', desc: 'Standard 1080p 30/60fps video recorded from smartphone or webcam' },
        { joint: 'Camera Framing', desc: 'Actor fully in frame with high contrast against the background' },
        { joint: 'Joint Tracking', desc: 'Neural vision tracks 24 major skeletal joints without physical markers' },
        { joint: 'Ground Plane', desc: 'Foot contact threshold solver locks foot bones to prevent sliding' }
      ],
      features: [
        'Single-camera vision AI converts 2D performance into 3D rotational joint animation',
        'Free Rokoko Blender Addon provides 1-click retargeting from mocap armatures to Rigify/Mixamo',
        'Advanced foot-locking algorithm eliminates ground skate during walk and run cycles',
        'Built-in Euler Filter cleans gimbal lock flipping on rapid rotational transitions'
      ],
      blenderWorkflow: [
        'Record 5-20 seconds of physical action using any phone camera in good lighting.',
        'Process the clip in Rokoko Studio Free to extract a 3D skeleton animation (BVH / FBX).',
        'In Blender 5.2, open the Rokoko Addon panel in the 3D Viewport N-panel.',
        'Assign the mocap skeleton as "Source" and your character armature as "Target".',
        'Click "Auto Detect Mapping", verify the Rest Pose calibration, enable "Use Foot Lock", and click "Retarget Animation".'
      ],
      exportSettings: [
        { label: 'Input Source', val: 'Single-Camera 1080p Video (MP4)' },
        { label: 'Addon Target', val: 'Mixamo, Rigify, or Custom Armatures' },
        { label: 'Filtering', val: 'Euler Angle Gimbal Smoothing' },
        { label: 'Constraints', val: 'Foot Lock & Floor Plane Snapping' }
      ],
      pros: 'Democratizes motion capture; turn home video into 3D animations; solves foot skate automatically.',
      cons: 'Single camera tracking can struggle with extreme self-occlusion (back turned to camera).',
      bestFor: 'Natural human acting, action stunts, expressive locomotion, and indie virtual production.'
    }
  };

  // 2. Bone Mapping Data
  const BONE_DATA = {
    spine: {
      name: 'Spine & Torso',
      tree: 'Hips (Root) -> Spine -> Spine1 (Chest) -> Spine2 (Upper Chest) -> Neck -> Head',
      axis: 'Mixamo bones point along local Y with Z pointing back/up. Rigify uses Spline IK curvature with bend-axis alignment.',
      tip: 'Ensure Hips translation is preserved for root motion locomotion, but zeroed out on X/Z axes for in-place loop cycles. Calibrate rest pose height to ground level (Z=0).',
      bones: [
        { part: 'Pelvis / Root', mixamo: 'mixamorig:Hips', rigify: 'spine', humanoid: 'Hips', note: 'Root motion driver & center of gravity' },
        { part: 'Lumbar Vertebrae', mixamo: 'mixamorig:Spine', rigify: 'spine.001', humanoid: 'Spine', note: 'Torso pitch/yaw flexion' },
        { part: 'Lower Thoracic', mixamo: 'mixamorig:Spine1', rigify: 'spine.002', humanoid: 'Chest', note: 'Rib cage articulation & twist' },
        { part: 'Upper Thoracic', mixamo: 'mixamorig:Spine2', rigify: 'spine.003', humanoid: 'UpperChest', note: 'Pectoral & scapular foundation' },
        { part: 'Cervical Spine', mixamo: 'mixamorig:Neck', rigify: 'neck', humanoid: 'Neck', note: 'Head rotation dampening' },
        { part: 'Cranium / Head', mixamo: 'mixamorig:Head', rigify: 'head', humanoid: 'Head', note: 'Look-at tracking parent' }
      ]
    },

    arm: {
      name: 'Arms & Shoulders',
      tree: 'UpperChest -> Clavicle / Shoulder -> Upper Arm -> Forearm -> Hand',
      axis: 'Rigify solves elbow IK along local X with Pole Target aligned to -Y. Mixamo arms use Y-axial alignment with Z pointing up.',
      tip: 'Mixamo rest poses default to an 80° slope (A-Pose hybrid). For pure 90° T-Pose targets, apply a +10° Z-rotation offset to UpperArm bones during rest pose calibration.',
      bones: [
        { part: 'Left Clavicle', mixamo: 'mixamorig:LeftShoulder', rigify: 'shoulder.L', humanoid: 'LeftShoulder', note: 'Scapula shrug & reach' },
        { part: 'Left Upper Arm', mixamo: 'mixamorig:LeftArm', rigify: 'upper_arm.L', humanoid: 'LeftUpperArm', note: 'Glenohumeral ball joint' },
        { part: 'Left Forearm', mixamo: 'mixamorig:LeftForeArm', rigify: 'forearm.L', humanoid: 'LeftLowerArm', note: 'Elbow hinge & twist' },
        { part: 'Left Hand', mixamo: 'mixamorig:LeftHand', rigify: 'hand.L', humanoid: 'LeftHand', note: 'Carpal wrist articulation' },
        { part: 'Right Clavicle', mixamo: 'mixamorig:RightShoulder', rigify: 'shoulder.R', humanoid: 'RightShoulder', note: 'Scapula shrug & reach' },
        { part: 'Right Upper Arm', mixamo: 'mixamorig:RightArm', rigify: 'upper_arm.R', humanoid: 'RightUpperArm', note: 'Glenohumeral ball joint' },
        { part: 'Right Forearm', mixamo: 'mixamorig:RightForeArm', rigify: 'forearm.R', humanoid: 'RightLowerArm', note: 'Elbow hinge & twist' },
        { part: 'Right Hand', mixamo: 'mixamorig:RightHand', rigify: 'hand.R', humanoid: 'RightHand', note: 'Carpal wrist articulation' }
      ]
    },

    hand: {
      name: 'Hands & Fingers',
      tree: 'Hand -> Metacarpals -> Proximal Phalanges -> Intermediate Phalanges -> Distal Phalanges',
      axis: 'Individual fingers rotate curling along local X axis. AccuRig generates 5-finger precise phalanges; Mixamo 65-bone rigs omit metacarpal cups.',
      tip: 'In Blender, enable "X-Axis Mirror" when configuring finger rolls. In Three.js / WebGL, normalize finger quaternions to prevent joint twisting on WebGL skeletal meshes.',
      bones: [
        { part: 'Thumb Proximal', mixamo: 'mixamorig:LeftHandThumb1', rigify: 'thumb.01.L', humanoid: 'LeftThumbProximal', note: 'Metacarpal opposition base' },
        { part: 'Thumb Intermed.', mixamo: 'mixamorig:LeftHandThumb2', rigify: 'thumb.02.L', humanoid: 'LeftThumbIntermediate', note: 'Thumb mid-phalange flexion' },
        { part: 'Thumb Distal', mixamo: 'mixamorig:LeftHandThumb3', rigify: 'thumb.03.L', humanoid: 'LeftThumbDistal', note: 'Thumb tip pinch articulation' },
        { part: 'Index Proximal', mixamo: 'mixamorig:LeftHandIndex1', rigify: 'f_index.01.L', humanoid: 'LeftIndexProximal', note: 'Index knuckle curl driver' },
        { part: 'Index Inter/Dist', mixamo: 'mixamorig:LeftHandIndex2/3', rigify: 'f_index.02/03.L', humanoid: 'LeftIndexIntermediate/Distal', note: 'Trigger pull & pointing' },
        { part: 'Middle Phalanges', mixamo: 'mixamorig:LeftHandMiddle1/2/3', rigify: 'f_middle.01/02/03.L', humanoid: 'LeftMiddleProximal/Int/Dist', note: 'Central grasp stabilization' },
        { part: 'Ring Phalanges', mixamo: 'mixamorig:LeftHandRing1/2/3', rigify: 'f_ring.01/02/03.L', humanoid: 'LeftRingProximal/Int/Dist', note: 'Secondary power grasp' },
        { part: 'Pinky Phalanges', mixamo: 'mixamorig:LeftHandPinky1/2/3', rigify: 'f_pinky.01/02/03.L', humanoid: 'LeftLittleProximal/Int/Dist', note: 'Hand blade support & cup' }
      ]
    },

    legs: {
      name: 'Legs & Feet',
      tree: 'Hips -> Thigh -> Shin (Knee) -> Foot (Ankle) -> Toe Base',
      axis: 'Rigify knee IK solves on local X axis with Pole Target placed at -Y (front of knee). Mixamo knees are pre-baked with Euler rotation.',
      tip: 'Use Foot Locking constraints during mocap retargeting to eliminate foot sliding. Lock ToeBase roll at 0° on ground contact frames.',
      bones: [
        { part: 'Left Thigh', mixamo: 'mixamorig:LeftUpLeg', rigify: 'thigh.L', humanoid: 'LeftUpperLeg', note: 'Femur hip socket ball joint' },
        { part: 'Left Shin', mixamo: 'mixamorig:LeftLeg', rigify: 'shin.L', humanoid: 'LeftLowerLeg', note: 'Tibia knee hinge & IK pole' },
        { part: 'Left Foot', mixamo: 'mixamorig:LeftFoot', rigify: 'foot.L', humanoid: 'LeftFoot', note: 'Talus ankle articulation' },
        { part: 'Left Toe Base', mixamo: 'mixamorig:LeftToeBase', rigify: 'toe.L', humanoid: 'LeftToes', note: 'Metatarsal push-off & roll' },
        { part: 'Right Thigh', mixamo: 'mixamorig:RightUpLeg', rigify: 'thigh.R', humanoid: 'RightUpperLeg', note: 'Right femur hip socket joint' },
        { part: 'Right Shin', mixamo: 'mixamorig:RightLeg', rigify: 'shin.R', humanoid: 'RightLowerLeg', note: 'Right tibia knee hinge & IK pole' },
        { part: 'Right Foot', mixamo: 'mixamorig:RightFoot', rigify: 'foot.R', humanoid: 'RightFoot', note: 'Right talus ankle plant' },
        { part: 'Right Toe Base', mixamo: 'mixamorig:RightToeBase', rigify: 'toe.R', humanoid: 'RightToes', note: 'Right metatarsal push-off' }
      ]
    }
  };

  // State
  let activePipeline = 'mixamo';
  let activeZone = 'spine';

  // 3. Render Pipeline Detail Function
  function renderPipelineDetail(pipelineId) {
    const data = PIPELINES[pipelineId];
    if (!data) return;

    activePipeline = pipelineId;

    // Update Tab UI
    document.querySelectorAll('.rigging-nav-tab').forEach((tab) => {
      const match = tab.getAttribute('data-pipeline') === pipelineId;
      tab.classList.toggle('active', match);
      tab.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    // Update Card UI
    document.querySelectorAll('.rigging-card').forEach((card) => {
      const match = card.getAttribute('data-pipeline') === pipelineId;
      card.classList.toggle('active', match);
      card.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    // Generate HTML for Detail Panel
    detailPanel.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.2rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; flex-wrap:wrap;">
            <span class="tone-badge" style="border-color:rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); color:var(--t-primary);">
              ${data.badge}
            </span>
            <span class="tone-badge" style="border-color:var(--c-cobalt-rim); color:var(--t-muted);">
              ${data.spec}
            </span>
          </div>
          <h4 style="font-family:var(--font-display); font-size:1.35rem; font-weight:700; color:var(--t-primary); margin-bottom:0.3rem;">
            ${data.title}
          </h4>
          <p style="color:var(--t-secondary); font-size:0.92rem; max-width:840px; line-height:1.55;">
            ${data.summary}
          </p>
        </div>
      </div>

      <!-- Feature Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.2rem; margin-bottom:1.5rem;">
        <!-- Marker Placement & Anatomical Guide -->
        <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1rem;">
          <h5 style="font-family:var(--font-mono); font-size:0.8rem; color:var(--c-amber); margin-bottom:0.6rem; text-transform:uppercase; letter-spacing:0.04em;">
            Marker Placement &amp; Anatomical Guide
          </h5>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.45rem;">
            ${data.markerGuide.map(item => `
              <li style="font-size:0.82rem; color:var(--t-secondary); display:flex; gap:0.5rem; align-items:baseline;">
                <span style="font-family:var(--font-mono); color:var(--c-sapphire); font-weight:600; min-width:80px;">${item.joint}:</span>
                <span>${item.desc}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Key Engineering Features -->
        <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1rem;">
          <h5 style="font-family:var(--font-mono); font-size:0.8rem; color:var(--c-phosphor); margin-bottom:0.6rem; text-transform:uppercase; letter-spacing:0.04em;">
            Core Pipeline Capabilities
          </h5>
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.45rem;">
            ${data.features.map(f => `
              <li style="font-size:0.82rem; color:var(--t-secondary); display:flex; gap:0.5rem; align-items:baseline;">
                <span style="color:var(--c-phosphor);">&bull;</span>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Step-by-Step Blender 5.2 Workflow -->
      <div style="background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-inner); padding:1.2rem; margin-bottom:1.2rem;">
        <h5 style="font-family:var(--font-mono); font-size:0.82rem; color:var(--t-primary); margin-bottom:0.8rem; text-transform:uppercase; letter-spacing:0.04em;">
          Step-by-Step Blender 5.2 Integration Workflow
        </h5>
        <div style="display:flex; flex-direction:column; gap:0.55rem;">
          ${data.blenderWorkflow.map((step, idx) => `
            <div style="display:flex; gap:0.75rem; align-items:baseline; font-size:0.85rem; color:var(--t-secondary); line-height:1.5;">
              <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--t-primary); background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:var(--r-round); min-width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">${idx + 1}</span>
              <span>${step}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Specs & Engineering Trade-Offs -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-ctl); padding:0.85rem;">
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--t-muted); margin-bottom:0.25rem;">OPTIMIZED FOR</div>
          <div style="font-size:0.83rem; color:var(--t-primary); line-height:1.45;">${data.bestFor}</div>
        </div>
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-ctl); padding:0.85rem;">
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:#10b981; margin-bottom:0.25rem;">ENGINEERING ADVANTAGES</div>
          <div style="font-size:0.83rem; color:var(--t-secondary); line-height:1.45;">${data.pros}</div>
        </div>
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-ctl); padding:0.85rem;">
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber); margin-bottom:0.25rem;">KNOWN CONSTRAINTS</div>
          <div style="font-size:0.83rem; color:var(--t-secondary); line-height:1.45;">${data.cons}</div>
        </div>
      </div>
    `;
  }

  // 4. Render Bone Matrix Table & Diagnostics
  function renderBoneMatrix(zoneId) {
    const data = BONE_DATA[zoneId];
    if (!data) return;

    activeZone = zoneId;

    // Update Zone Button UI
    document.querySelectorAll('.zone-btn').forEach((btn) => {
      const match = btn.getAttribute('data-zone') === zoneId;
      btn.classList.toggle('active', match);
    });

    // Populate Table
    boneTbody.innerHTML = data.bones.map(b => `
      <tr>
        <td style="font-weight:600; color:var(--t-primary); white-space:nowrap;">${b.part}</td>
        <td><code class="bone-hierarchy-badge" style="color:var(--c-amber);">${b.mixamo}</code></td>
        <td><code class="bone-hierarchy-badge" style="color:var(--c-sapphire);">${b.rigify}</code></td>
        <td><code class="bone-hierarchy-badge" style="color:var(--c-phosphor);">${b.humanoid}</code></td>
      </tr>
    `).join('');

    // Populate Diagnostics Card
    boneDiagnostics.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
          <span style="font-family:var(--font-mono); font-size:0.78rem; color:var(--c-amber); font-weight:700;">
            ${data.name.toUpperCase()} HIERARCHY GRAPH
          </span>
          <span class="bone-hierarchy-badge" style="color:var(--c-sapphire);">Blender 5.2</span>
        </div>
        <div style="background:#050609; border:1px solid rgba(255,255,255,0.06); border-radius:var(--r-ctl); padding:0.75rem; font-family:var(--font-mono); font-size:0.78rem; color:var(--t-secondary); line-height:1.6; margin-bottom:0.9rem;">
          ${data.tree}
        </div>
      </div>

      <div>
        <h6 style="font-family:var(--font-mono); font-size:0.75rem; color:var(--t-muted); margin-bottom:0.3rem; text-transform:uppercase;">
          Axis &amp; Roll Convention
        </h6>
        <p style="font-size:0.8rem; color:var(--t-secondary); line-height:1.45; margin-bottom:0.8rem;">
          ${data.axis}
        </p>

        <h6 style="font-family:var(--font-mono); font-size:0.75rem; color:var(--c-amber); margin-bottom:0.3rem; text-transform:uppercase;">
          Retargeting &amp; Gimbal Pro-Tip
        </h6>
        <p style="font-size:0.8rem; color:var(--t-secondary); line-height:1.45; margin:0;">
          ${data.tip}
        </p>
      </div>
    `;
  }

  // 5. Wire Pipeline Tab & Card Click Handlers
  document.querySelectorAll('.rigging-nav-tab').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const pipelineId = tab.getAttribute('data-pipeline');
      if (pipelineId) renderPipelineDetail(pipelineId);
    });
  });

  document.querySelectorAll('.rigging-card').forEach((card) => {
    card.addEventListener('click', () => {
      const pipelineId = card.getAttribute('data-pipeline');
      if (pipelineId) renderPipelineDetail(pipelineId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const pipelineId = card.getAttribute('data-pipeline');
        if (pipelineId) renderPipelineDetail(pipelineId);
      }
    });
  });

  // 6. Wire Body Zone Buttons
  document.querySelectorAll('.zone-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const zoneId = btn.getAttribute('data-zone');
      if (zoneId) renderBoneMatrix(zoneId);
    });
  });

  // 7. Wire Copy BPY Script Button
  if (copyRiggingBtn && riggingScriptCode) {
    copyRiggingBtn.addEventListener('click', async () => {
      const code = riggingScriptCode.textContent;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(code);
        } else {
          const ta = document.createElement('textarea');
          ta.value = code;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const origText = copyRiggingBtn.textContent;
        copyRiggingBtn.textContent = 'Copied to Clipboard';
        copyRiggingBtn.style.borderColor = 'var(--c-amber)';
        copyRiggingBtn.style.color = 'var(--c-amber)';
        setTimeout(() => {
          copyRiggingBtn.textContent = origText;
          copyRiggingBtn.style.borderColor = '';
          copyRiggingBtn.style.color = '';
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy failed for rigging script:', err);
      }
    });
  }

  // Initial State Rendering
  renderPipelineDetail(activePipeline);
  renderBoneMatrix(activeZone);
}


// Auto-run if loaded directly in browser context
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBlenderStudio();
      initBlenderRiggingPipeline();
    });
  } else {
    initBlenderStudio();
    initBlenderRiggingPipeline();
  }
}
