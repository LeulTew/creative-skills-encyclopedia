// ============================================================================
// Interactive Blender 5.2 MCP Parametric Studio Module
// Local Socket Bridge: 127.0.0.1:9876 // NVIDIA RTX 5070 Ti OptiX Acceleration
// Real-Time 3D Parametric Mesh Workbench, Headless bpy Python Code Generator,
// and Multi-Phase OptiX Render Simulator
// ============================================================================

export function initBlenderStudio() {
  if (typeof document === 'undefined') return;

  // DOM Elements
  const meshButtons = document.querySelectorAll('.blender-mesh-btn[data-mesh]');
  const sliderSegments = document.getElementById('bpy-slider-segments');
  const valSegments = document.getElementById('bpy-val-segments');
  const sliderRadius = document.getElementById('bpy-slider-radius');
  const valRadius = document.getElementById('bpy-val-radius');
  const sliderNoise = document.getElementById('bpy-slider-noise');
  const valNoise = document.getElementById('bpy-val-noise');
  const sliderSamples = document.getElementById('bpy-slider-samples');
  const valSamples = document.getElementById('bpy-val-samples');

  const renderBtn = document.getElementById('simulate-bpy-render-btn');
  const statusBox = document.getElementById('bpy-render-status-box');
  const copyBtn = document.getElementById('copy-bpy-script-btn');
  const scriptContent = document.getElementById('bpy-script-content');
  const heroBlenderCta = document.getElementById('hero-blender-cta');
  const viewportContainer = document.getElementById('blender-3d-viewport');
  const workbenchMeshLabel = document.getElementById('workbench-mesh-label');

  if (!scriptContent) {
    console.warn('[BlenderStudio] Target element #bpy-script-content not found.');
    return;
  }

  // Parametric State
  let currentMesh = 'torus'; // 'torus' | 'canister' | 'pack'
  let segments = sliderSegments ? parseInt(sliderSegments.value, 10) || 64 : 64;
  let radius = sliderRadius ? parseFloat(sliderRadius.value) || 0.35 : 0.35;
  let noise = sliderNoise ? parseFloat(sliderNoise.value) || 2.5 : 2.5;
  let samples = sliderSamples ? parseInt(sliderSamples.value, 10) || 128 : 128;
  let isRendering = false;

  // --------------------------------------------------------------------------
  // 1. THREE.JS 3D INTERACTIVE WORKBENCH
  // --------------------------------------------------------------------------
  let wbScene, wbCamera, wbRenderer, wbMesh;
  let wbAnimFrameId = null;

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

    // Animation Loop
    function animate() {
      wbAnimFrameId = requestAnimationFrame(animate);
      if (wbMesh) {
        wbMesh.rotation.y += 0.012;
        if (currentMesh === 'pack') {
          wbMesh.rotation.x = -Math.PI / 6 + Math.sin(Date.now() * 0.001) * 0.08;
        } else {
          wbMesh.rotation.x = Math.sin(Date.now() * 0.0008) * 0.15;
        }
      }
      if (wbRenderer && wbScene && wbCamera) {
        wbRenderer.render(wbScene, wbCamera);
      }
    }
    animate();
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

    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.22,
      metalness: 0.85,
      wireframe: false,
    });

    wbMesh = new THREE.Mesh(geom, mat);
    wbScene.add(wbMesh);
  }

  function resizeWorkbench() {
    if (!viewportContainer || !wbRenderer || !wbCamera) return;
    const width = viewportContainer.clientWidth || 400;
    const height = viewportContainer.clientHeight || 220;
    if (width > 0 && height > 0) {
      wbCamera.aspect = width / height;
      wbCamera.updateProjectionMatrix();
      wbRenderer.setSize(width, height);
    }
  }

  window.resizeBlenderStudio = resizeWorkbench;

  // --------------------------------------------------------------------------
  // 2. REAL-TIME PYTHON CODE GENERATOR
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
      // 'pack' -> SunChips Ripple Surface
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
tex.wood_type = 'RINGS'
displace.texture = tex
displace.strength = ${strength}`;
    }

    const script = `# ============================================================================
# Blender 5.2.2 LTS Parametric Studio Automation (Headless OptiX Engine)
# Hardware: NVIDIA GeForce RTX 5070 Ti (16GB GDDR7) // Cycles OptiX Backend
# Model: ${meshName} // Resolution: ${segments} Segments // Samples: ${samples}
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
scene.cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
${meshCode}

# ----------------------------------------------------------------------------
# 2. PROCEDURAL PBR NEUTRAL SHADER NODE TREE
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
node_ramp.color_ramp.elements[0].color = (0.976, 0.451, 0.086, 1.0) # Ember Glow (#f97316)
node_ramp.color_ramp.elements[1].position = 0.80
node_ramp.color_ramp.elements[1].color = (0.02, 0.52, 0.78, 1.0)    # Cobalt Rim (#0284c7)

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
# 3. KHRONOS 3-POINT STUDIO LIGHTING RIG
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
scene.camera = cam_obj

# ----------------------------------------------------------------------------
# 5. DETERMINISTIC HEADLESS RENDER EXECUTION
# ----------------------------------------------------------------------------
scene.render.filepath = "//render_output.png"
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.view_settings.view_transform = 'Khronos PBR Neutral' # 2026 PBR Standard

bpy.ops.render.render(write_still=True)
print(f"SUCCESS: Render completed with OptiX ({samples} samples) -> render_output.png")`;

    scriptContent.textContent = script;
  }

  // --------------------------------------------------------------------------
  // 3. WIRE SLIDER CONTROLS & VALUE LABELS
  // --------------------------------------------------------------------------
  if (sliderSegments && valSegments) {
    sliderSegments.addEventListener('input', (e) => {
      segments = parseInt(e.target.value, 10);
      valSegments.textContent = segments;
      updateWorkbenchMesh();
      generateBpyScript();
    });
  }

  if (sliderRadius && valRadius) {
    sliderRadius.addEventListener('input', (e) => {
      radius = parseFloat(e.target.value);
      valRadius.textContent = `${radius.toFixed(2)}m`;
      updateWorkbenchMesh();
      generateBpyScript();
    });
  }

  if (sliderNoise && valNoise) {
    sliderNoise.addEventListener('input', (e) => {
      noise = parseFloat(e.target.value);
      valNoise.textContent = `${noise.toFixed(1)}x`;
      updateWorkbenchMesh();
      generateBpyScript();
    });
  }

  if (sliderSamples && valSamples) {
    sliderSamples.addEventListener('input', (e) => {
      samples = parseInt(e.target.value, 10);
      valSamples.textContent = samples;
      generateBpyScript();
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
        b.style.background = 'transparent';
        b.style.borderColor = 'var(--c-cobalt-rim)';
        b.style.color = 'var(--t-secondary)';
      });

      btn.classList.add('active');
      btn.style.background = 'var(--c-ember)';
      btn.style.borderColor = 'var(--c-ember)';
      btn.style.color = '#ffffff';

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
        copyBtn.textContent = '✓ Copied to Clipboard!';
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
  if (renderBtn && statusBox) {
    renderBtn.addEventListener('click', () => {
      if (isRendering) return;
      isRendering = true;
      renderBtn.disabled = true;
      renderBtn.style.opacity = '0.65';
      renderBtn.style.cursor = 'not-allowed';

      const originalBtnHtml = renderBtn.innerHTML;
      renderBtn.innerHTML = '<span>⏳ Rendering Cycles Pass...</span>';

      const startTimestamp = performance.now();
      function getTimestamp() {
        const elapsed = ((performance.now() - startTimestamp) / 1000).toFixed(3);
        return `[+${elapsed}s]`;
      }

      // Step 1: Dispatching
      statusBox.innerHTML = `<span style="color:#38bdf8;">${getTimestamp()} ⚡ DISPATCHING:</span> Sending JSON-RPC payload to Blender MCP Socket 127.0.0.1:9876 (tool: execute_blender_code)...`;

      // Step 2: Compiling BVH
      setTimeout(() => {
        statusBox.innerHTML = `
          <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} ⚡ Socket payload delivered (1,842 bytes).</div>
          <div><span style="color:#fbbf24;">${getTimestamp()} ⚙️ COMPILING:</span> BVH geometry build on RTX 5070 Ti (16GB GDDR7, OptiX backend)...</div>
        `;
      }, 420);

      // Step 3: Progressive Sampling
      setTimeout(() => {
        const halfSamples = Math.round(samples * 0.5);
        statusBox.innerHTML = `
          <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} ⚙️ BVH built in 14.2ms (${segments * 2} tris).</div>
          <div><span style="color:#f97316;">${getTimestamp()} 🎯 SAMPLING:</span> Cycles OptiX tile passes [1/${samples}] ... [${halfSamples}/${samples}]</div>
        `;
      }, 950);

      // Step 4: Denoising
      setTimeout(() => {
        statusBox.innerHTML = `
          <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} 🎯 Cycles OptiX passes converged at ${samples}/${samples} spp.</div>
          <div><span style="color:#a855f7;">${getTimestamp()} 🔬 DENOISING:</span> OptiX temporal neural denoiser applied across RGB_ALBEDO_NORMAL guide passes...</div>
        `;
      }, 1550);

      // Step 5: Completed
      setTimeout(() => {
        statusBox.innerHTML = `
          <div style="color:var(--t-muted); margin-bottom:0.25rem;">${getTimestamp()} 🔬 Neural denoiser completed in 18.5ms.</div>
          <div style="color:#10b981; font-weight:700;">${getTimestamp()} ✅ COMPLETED: Output written to render_output.png (100% matched Khronos PBR Neutral)</div>
        `;

        renderBtn.innerHTML = '<span>✓ Render Complete</span>';
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

  // Initialize 3D Workbench and Python Script
  init3DWorkbench();
  generateBpyScript();
  console.log('[BlenderStudio] Initialized successfully with Blender 5.2 OptiX pipeline.');
}

// Auto-run if loaded directly in browser context
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlenderStudio);
  } else {
    initBlenderStudio();
  }
}
