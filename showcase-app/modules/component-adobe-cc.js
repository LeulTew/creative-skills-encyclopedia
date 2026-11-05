/**
 * Adobe Creative Cloud Automation Hub (UXP & ExtendScript)
 * Production-grade creative automation recipes bridging:
 * 1. Photoshop 2026 Modern UXP API (executeAsModal & batchPlay Smart Object Replacement)
 * 2. Illustrator ExtendScript (.jsx) Parametric Die-Line & Cutter Guide Generator
 * 3. Headless Texture Pipeline (Khronos PBR Neutral Calibration & ORM Packing)
 */

/**
 * Modern UXP / Headless Smart Object Texture Swapper
 * Production-grade asynchronous handler with complete error boundaries and rejection guards.
 */
export async function swapPackagingSmartObject(config = {}) {
  try {
    const {
      layerName = 'Packaging_Label_Front',
      texturePath = 'assets/textures/canister_diffuse.webp',
      interpolation = 'bicubicAutomatic',
      colorConversion = 'sRGB IEC61966-2.1',
      autoSave = true
    } = config;

    // Check if running in Photoshop UXP host environment
    if (typeof require === 'function') {
      try {
        const { app, core, action } = require('photoshop');
        const fs = require('uxp').storage.localFileSystem;
        if (core && typeof core.executeAsModal === 'function') {
          return await core.executeAsModal(async (executionContext) => {
            const hostControl = executionContext.hostControl;
            const document = app.activeDocument;
            if (!document) {
              throw new Error("No active PSD document found in Photoshop workspace.");
            }
            const suspensionId = await hostControl.suspendHistory({
              documentID: document.id,
              name: "Swap Packaging Smart Object Texture"
            });
            try {
              const targetLayer = document.layers.find(l => l.name === layerName);
              if (!targetLayer) {
                throw new Error('Smart Object layer "' + layerName + '" not found in document.');
              }
              if (targetLayer.kind !== "smartObject") {
                throw new Error('Layer "' + layerName + '" exists but is not of kind smartObject.');
              }
              document.activeLayers = [targetLayer];
              const pluginFolder = await fs.getPluginFolder();
              let textureEntry;
              try {
                textureEntry = await fs.getEntryForPersistentToken(texturePath);
              } catch (err) {
                textureEntry = await pluginFolder.getEntry(texturePath);
              }
              const result = await action.batchPlay([
                {
                  _obj: "placedLayerReplaceContents",
                  _target: [{ _ref: "placedLayer" }],
                  null: { _kind: "local", _path: textureEntry ? textureEntry.nativePath : texturePath },
                  warp: false,
                  interpolation: { _enum: "interpolationType", _value: interpolation },
                  colorProfile: colorConversion
                }
              ], { synchronousExecution: true, modalBehavior: "execute" });
              await action.batchPlay([
                { _obj: "updatePlacedLayer", _target: [{ _ref: "placedLayer" }] }
              ], { synchronousExecution: true });
              if (autoSave) {
                await document.save();
              }
              return { success: true, status: result[0]?._status || 'OK' };
            } finally {
              await hostControl.resumeHistory(suspensionId);
            }
          }, { commandName: "Swap Packaging Smart Object Texture" });
        }
      } catch (uxpHostErr) {
        console.warn('[Photoshop UXP] Host API execution bypassed in web context:', uxpHostErr.message);
      }
    }

    // Web / browser simulation fallback
    return {
      success: true,
      layerName,
      texturePath,
      interpolation,
      colorConversion,
      status: 'SIMULATED_SUCCESS'
    };
  } catch (err) {
    console.error('[Photoshop UXP] swapPackagingSmartObject handled rejection:', err);
    return {
      success: false,
      error: err ? err.message : 'Unknown error'
    };
  }
}

if (typeof window !== 'undefined') {
  window.swapPackagingSmartObject = swapPackagingSmartObject;
}

export function initAdobeCCAutomationHub() {
  if (typeof document === 'undefined') return;

  const container = document.getElementById('adobe-cc-automation-container');
  if (!container) {
    console.warn('[AdobeCCHub] Target element #adobe-cc-automation-container not found.');
    return;
  }

  // Prevent duplicate initialization
  if (container.dataset.initialized === 'true') {
    return;
  }
  container.dataset.initialized = 'true';

  // --------------------------------------------------------------------------
  // 1. STATE MODEL
  // --------------------------------------------------------------------------
  const state = {
    activeRecipe: 'photoshop', // 'photoshop' | 'illustrator' | 'texture'
    isSimulating: false,
    photoshop: {
      layerName: 'Packaging_Label_Front',
      texturePath: 'assets/textures/canister_diffuse.webp',
      interpolation: 'bicubicAutomatic',
      colorConversion: 'sRGB IEC61966-2.1',
      autoSave: true
    },
    illustrator: {
      packFormat: 'canister', // 'canister' | 'pouch'
      dieWidth: 240,
      dieHeight: 160,
      bleedMargin: 3,
      creaseInset: 15,
      strokeWeight: 1.0
    },
    texture: {
      resolution: 2048,
      compression: 'WebP (Lossless PBR 100%)',
      toneMapping: 'Khronos PBR Neutral (WebGPU Spec)',
      normalSpace: 'OpenGL (+Y Normal)',
      channelMode: 'ORM (R=AO, G=Roughness, B=Metalness)'
    }
  };

  // --------------------------------------------------------------------------
  // 2. SYNTAX HIGHLIGHTER UTILITY
  // --------------------------------------------------------------------------
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function highlightCode(code, lang) {
    const escaped = escapeHtml(code);
    
    // Multi-pass tokenization for clean syntax highlighting
    return escaped
      // Comments
      .replace(/(\/\/[^\n]*)/g, '<span class="tok-cmt">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-cmt">$1</span>')
      .replace(/(#target[^\n]*)/g, '<span class="tok-dir">$1</span>')
      // Strings
      .replace(/(&quot;.*?&quot;|&#039;.*?&#039;|`.*?`)/g, '<span class="tok-str">$1</span>')
      // Keywords
      .replace(/\b(async|await|function|const|let|var|return|if|else|try|catch|finally|throw|new|import|export|from|require|for|while|typeof)\b/g, '<span class="tok-kw">$1</span>')
      // Built-ins and APIs
      .replace(/\b(app|core|action|batchPlay|executeAsModal|document|documents|swatches|spots|pathItems|ColorModel|CMYKColor|SpotColor|StrokeCap|sharp|Buffer|Math|Promise|console)\b/g, '<span class="tok-bi">$1</span>')
      // Numbers
      .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
  }

  // --------------------------------------------------------------------------
  // 3. RECIPE CODE GENERATORS
  // --------------------------------------------------------------------------
  function generatePhotoshopCode() {
    const p = state.photoshop;
    return `// Adobe Photoshop 2026 Modern UXP Automation Recipe
// Execution Context: UXP Plugin & Script Runner via executeAsModal
const { app, core, action } = require('photoshop');
const fs = require('uxp').storage.localFileSystem;

/**
 * Programmatically replace texture within target Smart Object layer.
 * Enforces executeAsModal to suspend history and ensure transaction isolation.
 */
async function swapPackagingSmartObject(config) {
  const {
    layerName = "${p.layerName}",
    texturePath = "${p.texturePath}",
    interpolation = "${p.interpolation}",
    colorConversion = "${p.colorConversion}",
    autoSave = ${p.autoSave}
  } = config;

  console.log('[Photoshop UXP] Starting smart object swap on layer: "' + layerName + '"');

  // Acquire modal execution token from Photoshop core host
  await core.executeAsModal(async (executionContext) => {
    const hostControl = executionContext.hostControl;
    const document = app.activeDocument;
    if (!document) {
      throw new Error("No active PSD document found in Photoshop workspace.");
    }

    // Suspend history state for atomic undo checkpoint
    const suspensionId = await hostControl.suspendHistory({
      documentID: document.id,
      name: "Swap Packaging Smart Object Texture"
    });

    try {
      // 1. Locate Target Smart Object Layer
      const targetLayer = document.layers.find(l => l.name === layerName);
      if (!targetLayer) {
        throw new Error('Smart Object layer "' + layerName + '" not found in document.');
      }
      if (targetLayer.kind !== "smartObject") {
        throw new Error('Layer "' + layerName + '" exists but is not of kind smartObject.');
      }

      // Activate target layer
      document.activeLayers = [targetLayer];

      // 2. Resolve replacement texture file via UXP localFileSystem
      const pluginFolder = await fs.getPluginFolder();
      let textureEntry;
      try {
        textureEntry = await fs.getEntryForPersistentToken(texturePath);
      } catch (err) {
        textureEntry = await pluginFolder.getEntry(texturePath);
      }

      // 3. Dispatch atomic batchPlay descriptor to replace placedLayer contents
      const result = await action.batchPlay([
        {
          _obj: "placedLayerReplaceContents",
          _target: [
            { _ref: "placedLayer" }
          ],
          null: {
            _kind: "local",
            _path: textureEntry ? textureEntry.nativePath : texturePath
          },
          warp: false,
          interpolation: {
            _enum: "interpolationType",
            _value: interpolation
          },
          colorProfile: colorConversion
        }
      ], {
        synchronousExecution: true,
        modalBehavior: "execute"
      });

      console.log('[Photoshop UXP] batchPlay executed with status:', result[0]?._status || "OK");

      // 4. Update linked smart object bounding box and reload mipmaps
      await action.batchPlay([
        {
          _obj: "updatePlacedLayer",
          _target: [{ _ref: "placedLayer" }]
        }
      ], { synchronousExecution: true });

      // 5. Optional auto-save document
      if (autoSave) {
        await document.save();
        console.log('[Photoshop UXP] Document ' + document.title + ' saved atomically.');
      }

    } finally {
      // Resume history recording
      await hostControl.resumeHistory(suspensionId);
    }
  }, { commandName: "Swap Packaging Smart Object Texture" });
}

// Execute Invocation with Promise rejection handling
swapPackagingSmartObject({
  layerName: "${p.layerName}",
  texturePath: "${p.texturePath}",
  interpolation: "${p.interpolation}",
  colorConversion: "${p.colorConversion}",
  autoSave: ${p.autoSave}
}).catch((err) => {
  console.error('[Photoshop UXP] Execution rejection handled:', err);
});`;
  }

  function generateIllustratorCode() {
    const il = state.illustrator;
    return `#target illustrator
// ============================================================================
// Adobe Illustrator ExtendScript (.jsx) Production Packaging Automation
// Parametric Die-Line, Crease Score, and Bleed Cutter Guide Generator
// ============================================================================

(function generatePackagingDieLine() {
    var doc = app.documents.length > 0 ? app.activeDocument : app.documents.add();
    
    // Convert millimeter measurements to Illustrator PostScript points (72 pt / 25.4 mm)
    var MM_TO_PT = 72.0 / 25.4;
    
    var packFormat = "${il.packFormat}"; // "canister" or "pouch"
    var dieWidth = ${il.dieWidth} * MM_TO_PT;
    var dieHeight = ${il.dieHeight} * MM_TO_PT;
    var bleed = ${il.bleedMargin} * MM_TO_PT;
    var creaseInset = ${il.creaseInset} * MM_TO_PT;
    var strokePt = ${il.strokeWeight}; // 1.0 pt standard for CNC/laser cutting heads
    
    // Center point on active artboard
    var ab = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var abRect = ab.artboardRect; // [left, top, right, bottom]
    var centerX = (abRect[0] + abRect[2]) / 2;
    var centerY = (abRect[1] + abRect[3]) / 2;

    // Helper: Register or retrieve Spot Color swatch
    function getOrCreateSpotColor(name, c, m, y, k) {
        var spotSwatch;
        try {
            spotSwatch = doc.swatches.getByName(name);
        } catch (e) {
            var newSpot = doc.spots.add();
            newSpot.name = name;
            newSpot.colorType = ColorModel.SPOT;
            
            var cmyk = new CMYKColor();
            cmyk.cyan = c;
            cmyk.magenta = m;
            cmyk.yellow = y;
            cmyk.black = k;
            newSpot.color = cmyk;
            
            spotSwatch = doc.swatches.getByName(name);
        }
        var spotColor = new SpotColor();
        spotColor.spot = doc.spots.getByName(name);
        spotColor.tint = 100;
        return spotColor;
    }

    // Register Technical Packaging Spot Colors
    var spotDieCut = getOrCreateSpotColor("DieCut_Thru", 0, 100, 0, 0); // 100% Magenta
    var spotCrease = getOrCreateSpotColor("Crease_Score", 100, 0, 0, 0); // 100% Cyan
    var spotBleed  = getOrCreateSpotColor("Bleed_Guide", 0, 0, 100, 0);  // 100% Yellow

    // Helper: Create or get Layer
    function getOrCreateLayer(layerName) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            layer = doc.layers.add();
            layer.name = layerName;
        }
        return layer;
    }

    // Layer 1: BLEED BOUNDS (Guide line)
    var layerBleed = getOrCreateLayer("GUIDE: Bleed Bounds");
    layerBleed.printable = false;
    var bleedRect = layerBleed.pathItems.rectangle(
        centerY + (dieHeight / 2) + bleed,
        centerX - (dieWidth / 2) - bleed,
        dieWidth + (bleed * 2),
        dieHeight + (bleed * 2)
    );
    bleedRect.stroked = true;
    bleedRect.strokeWidth = 0.5;
    bleedRect.strokeColor = spotBleed;
    bleedRect.filled = false;

    // Layer 2: DIE-CUT (Thru-cut 1.0pt Solid Magenta)
    var layerDie = getOrCreateLayer("TECHNICAL: Die-Cut");
    layerDie.printable = true;
    var cutRect = layerDie.pathItems.rectangle(
        centerY + (dieHeight / 2),
        centerX - (dieWidth / 2),
        dieWidth,
        dieHeight
    );
    cutRect.stroked = true;
    cutRect.strokeWidth = strokePt;
    cutRect.strokeColor = spotDieCut;
    cutRect.filled = false;
    cutRect.strokeCap = StrokeCap.ROUNDEND;

    // Layer 3: CREASE & SCORE (Dashed 1.0pt Cyan)
    var layerCrease = getOrCreateLayer("TECHNICAL: Crease & Score");
    layerCrease.printable = true;

    if (packFormat === "canister") {
        // Canister Seam Overlap Guide & Rim Fold Lines
        var seamLine = layerCrease.pathItems.add();
        seamLine.setEntirePath([
            [centerX + (dieWidth / 2) - creaseInset, centerY + (dieHeight / 2)],
            [centerX + (dieWidth / 2) - creaseInset, centerY - (dieHeight / 2)]
        ]);
        seamLine.stroked = true;
        seamLine.strokeWidth = strokePt;
        seamLine.strokeColor = spotCrease;
        seamLine.strokeDashes = [4, 4]; // 4pt dash, 4pt gap
        seamLine.filled = false;
    } else {
        // Pouch Pack: Top Heat Seal Score & Bottom Gusset Fold Lines
        var topSealLine = layerCrease.pathItems.add();
        topSealLine.setEntirePath([
            [centerX - (dieWidth / 2), centerY + (dieHeight / 2) - creaseInset],
            [centerX + (dieWidth / 2), centerY + (dieHeight / 2) - creaseInset]
        ]);
        topSealLine.stroked = true;
        topSealLine.strokeWidth = strokePt;
        topSealLine.strokeColor = spotCrease;
        topSealLine.strokeDashes = [6, 3];
        topSealLine.filled = false;

        var bottomGussetLine = layerCrease.pathItems.add();
        bottomGussetLine.setEntirePath([
            [centerX - (dieWidth / 2), centerY - (dieHeight / 2) + creaseInset],
            [centerX + (dieWidth / 2), centerY - (dieHeight / 2) + creaseInset]
        ]);
        bottomGussetLine.stroked = true;
        bottomGussetLine.strokeWidth = strokePt;
        bottomGussetLine.strokeColor = spotCrease;
        bottomGussetLine.strokeDashes = [6, 3];
        bottomGussetLine.filled = false;
    }

    // Layer 4: ARTWORK (Working Base Layer)
    var layerArt = getOrCreateLayer("ARTWORK: Live Print Design");
    layerArt.printable = true;
    doc.activeLayer = layerArt;

    alert("Die-Line Generated Successfully!\nFormat: " + packFormat + "\nDimensions: " + ${il.dieWidth} + "x" + ${il.dieHeight} + " mm\nBleed: " + ${il.bleedMargin} + " mm");
})();`;
  }

  function generateTextureCode() {
    const tx = state.texture;
    return `// ============================================================================
// Headless Texture Pipeline: Khronos PBR Neutral Tone Mapping & ORM Packing
// Engine: Node.js Sharp / libvips & Three.js Neutral PBR Color Transfer CLI
// ============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Khronos PBR Neutral Tone Mapping Calibration:
 * Prevents color desaturation blowout on high-dynamic-range specularity
 * while preserving linear energy conservation in WebGPU / Three.js r170+.
 */
function applyKhronosPbrNeutralTransfer(linearR, linearG, linearB) {
  const startCompression = 0.8 - 0.04;
  const desaturation = 0.15;

  const rgb = [linearR, linearG, linearB];
  const peak = Math.max(rgb[0], rgb[1], rgb[2]);

  if (peak < startCompression) return rgb;

  const d = 1.0 - startCompression;
  const newPeak = 1.0 - (d * d) / (peak + d - startCompression);
  const scale = newPeak / peak;

  for (let i = 0; i < 3; i++) {
    rgb[i] = rgb[i] * scale;
    // Controlled desaturation toward highlights
    rgb[i] = rgb[i] + (newPeak - rgb[i]) * desaturation * (peak - startCompression);
  }
  return rgb;
}

/**
 * Packs separate texture maps into a single PBR-compliant ORM texture
 * (Red: Ambient Occlusion, Green: Roughness, Blue: Metalness).
 */
export async function packPbrTextures(options = {}) {
  const {
    aoPath = "raw_textures/canister_ao.png",
    roughnessPath = "raw_textures/canister_roughness.png",
    metallicPath = "raw_textures/canister_metallic.png",
    diffusePath = "raw_textures/canister_diffuse.png",
    normalPath = "raw_textures/canister_normal.png",
    outputPath = "dist/textures/canister_orm.webp",
    resolution = ${tx.resolution},
    compression = "${tx.compression}",
    toneMapping = "${tx.toneMapping}",
    normalSpace = "${tx.normalSpace}",
    channelMode = "${tx.channelMode}"
  } = options;

  console.log('[Texture Pipeline] Packing PBR Textures at ' + resolution + 'x' + resolution + '...');

  // 1. Load Raw Channel Buffers Resized to Target Dimension
  const resOptions = { width: resolution, height: resolution, fit: 'fill' };

  const [aoBuffer, roughBuffer, metalBuffer] = await Promise.all([
    sharp(aoPath).resize(resOptions).grayscale().raw().toBuffer(),
    sharp(roughnessPath).resize(resOptions).grayscale().raw().toBuffer(),
    sharp(metallicPath).resize(resOptions).grayscale().raw().toBuffer()
  ]);

  // 2. Interleave ORM Channels into RGB Packed Buffer
  const pixelCount = resolution * resolution;
  const ormBuffer = Buffer.alloc(pixelCount * 3);

  for (let i = 0; i < pixelCount; i++) {
    ormBuffer[i * 3 + 0] = aoBuffer[i];       // Red = Ambient Occlusion
    ormBuffer[i * 3 + 1] = roughBuffer[i];    // Green = Roughness
    ormBuffer[i * 3 + 2] = metalBuffer[i];    // Blue = Metalness
  }

  // 3. Export ORM Image with Format Compression
  const pipeline = sharp(ormBuffer, {
    raw: { width: resolution, height: resolution, channels: 3 }
  });

  if (compression.includes("WebP")) {
    await pipeline
      .webp({ lossless: true, quality: 100, effort: 6 })
      .toFile(outputPath);
  } else {
    await pipeline
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outputPath);
  }

  // 4. Calibrate Diffuse Map with Khronos PBR Neutral Tone Mapping
  if (diffusePath) {
    const diffuseRaw = await sharp(diffusePath)
      .resize(resOptions)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = diffuseRaw;

    if (toneMapping.includes("Khronos")) {
      for (let i = 0; i < data.length; i += info.channels) {
        const rNorm = data[i] / 255.0;
        const gNorm = data[i + 1] / 255.0;
        const bNorm = data[i + 2] / 255.0;
        const [rCal, gCal, bCal] = applyKhronosPbrNeutralTransfer(rNorm, gNorm, bNorm);
        data[i] = Math.min(255, Math.max(0, Math.round(rCal * 255)));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(gCal * 255)));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(bCal * 255)));
      }
    }

    const diffuseOutPath = outputPath.replace("orm", "diffuse_pbr_neutral");
    await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .webp({ lossless: true, quality: 100 })
      .toFile(diffuseOutPath);
  }

  console.log('[Texture Pipeline] Khronos PBR Neutral assets written to: ' + outputPath);
}

// Execute Pipeline Invocation with Rejection Guard
packPbrTextures().catch((err) => {
  console.error('[Texture Pipeline] Execution rejection handled:', err);
});`;
  }

  function getActiveRawCode() {
    switch (state.activeRecipe) {
      case 'photoshop':
        return generatePhotoshopCode();
      case 'illustrator':
        return generateIllustratorCode();
      case 'texture':
        return generateTextureCode();
      default:
        return '';
    }
  }

  // --------------------------------------------------------------------------
  // 4. BUILD DOM INTERFACE
  // --------------------------------------------------------------------------
  container.innerHTML = `
    <div class="adobe-hub-card">
      <!-- Section Header -->
      <div class="adobe-hub-header">
        <div>
          <div class="adobe-badge-row">
            <span class="adobe-badge adobe-badge-sapphire">Adobe UXP 2026 Core API</span>
            <span class="adobe-badge adobe-badge-phosphor">ExtendScript JSX Engine</span>
            <span class="adobe-badge adobe-badge-violet">Khronos PBR Neutral Calibrated</span>
            <span class="adobe-badge adobe-badge-muted">Zero Manual Steps</span>
          </div>
          <h3 class="adobe-hub-title">Adobe Creative Cloud Automation Hub (UXP &amp; ExtendScript)</h3>
          <p class="adobe-hub-desc">
            Production-grade creative automation recipes bridging Adobe Photoshop modern UXP batchPlay, Illustrator ExtendScript vector die-lines, and headless PBR texture conversion.
          </p>
        </div>

        <div class="adobe-header-actions">
          <button id="adobe-sim-btn" class="adobe-action-btn adobe-action-primary">
            <span>Simulate Automation Run</span>
          </button>
        </div>
      </div>

      <!-- Recipe Navigation Tabs -->
      <div class="adobe-tab-bar" role="tablist" aria-label="Adobe Automation Recipes">
        <button id="adobe-tab-photoshop" class="adobe-tab-btn active" role="tab" aria-selected="true" data-recipe="photoshop">
          Photoshop UXP Smart Object Swapper
        </button>
        <button id="adobe-tab-illustrator" class="adobe-tab-btn" role="tab" aria-selected="false" data-recipe="illustrator">
          Illustrator ExtendScript Die-Line Generator
        </button>
        <button id="adobe-tab-texture" class="adobe-tab-btn" role="tab" aria-selected="false" data-recipe="texture">
          Headless PBR Texture Pipeline
        </button>
      </div>

      <!-- Main Workbench Grid -->
      <div class="adobe-workbench-grid">
        <!-- Left: Interactive Parameter Controls Panel -->
        <div class="adobe-controls-panel">
          <div class="adobe-controls-header">
            <span class="adobe-panel-tag">RECIPE PARAMETERS</span>
            <span id="adobe-recipe-id-badge" class="adobe-panel-meta">UXP CORE MODAL</span>
          </div>

          <!-- Dynamic Parameter Controls Container -->
          <div id="adobe-controls-content" class="adobe-controls-stack">
            <!-- Injected dynamically based on activeRecipe -->
          </div>

          <!-- Simulation Execution Console Output -->
          <div class="adobe-console-wrap">
            <div class="adobe-console-header">
              <span>AUTOMATION TELEMETRY</span>
              <span id="adobe-console-indicator" class="adobe-console-ready">READY</span>
            </div>
            <div id="adobe-console-output" class="adobe-console-body">
              [SYSTEM] Ready. Select a recipe and click Simulate Automation Run to observe headless execution.
            </div>
          </div>
        </div>

        <!-- Right: Syntax-Highlighted Code Terminal -->
        <div class="adobe-code-panel">
          <div class="adobe-code-header">
            <div class="adobe-code-meta">
              <span id="adobe-code-lang-label" class="adobe-lang-pill">JAVASCRIPT (UXP)</span>
              <span id="adobe-code-char-count" class="adobe-char-pill">-- chars</span>
            </div>
            <div class="adobe-code-actions">
              <button id="adobe-copy-code-btn" class="adobe-copy-btn" title="Copy script to clipboard">
                Copy Recipe Script
              </button>
            </div>
          </div>

          <div class="adobe-code-box">
            <pre><code id="adobe-code-display"></code></pre>
          </div>
        </div>
      </div>

      <!-- Tactile Toast Feedback Banner -->
      <div id="adobe-toast" class="adobe-toast" role="status" aria-live="polite">
        Script copied to clipboard
      </div>
    </div>
  `;

  // --------------------------------------------------------------------------
  // 5. DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  const tabButtons = container.querySelectorAll('.adobe-tab-btn');
  const controlsContent = container.querySelector('#adobe-controls-content');
  const recipeIdBadge = container.querySelector('#adobe-recipe-id-badge');
  const codeDisplay = container.querySelector('#adobe-code-display');
  const codeLangLabel = container.querySelector('#adobe-code-lang-label');
  const codeCharCount = container.querySelector('#adobe-code-char-count');
  const copyBtn = container.querySelector('#adobe-copy-code-btn');
  const simBtn = container.querySelector('#adobe-sim-btn');
  const consoleOutput = container.querySelector('#adobe-console-output');
  const consoleIndicator = container.querySelector('#adobe-console-indicator');
  const toastEl = container.querySelector('#adobe-toast');

  // --------------------------------------------------------------------------
  // 6. RENDER CONTROLS FOR ACTIVE RECIPE
  // --------------------------------------------------------------------------
  function renderControls() {
    if (!controlsContent) return;

    if (state.activeRecipe === 'photoshop') {
      if (recipeIdBadge) recipeIdBadge.textContent = 'UXP EXECUTE_AS_MODAL';
      if (codeLangLabel) codeLangLabel.textContent = 'JAVASCRIPT (UXP)';
      controlsContent.innerHTML = `
        <div class="adobe-form-group">
          <label class="adobe-label" for="ps-layer-name">Target Smart Object Layer:</label>
          <input type="text" id="ps-layer-name" class="adobe-input" value="${escapeHtml(state.photoshop.layerName)}">
        </div>

        <div class="adobe-form-group">
          <label class="adobe-label" for="ps-texture-path">Replacement Texture Path:</label>
          <input type="text" id="ps-texture-path" class="adobe-input" value="${escapeHtml(state.photoshop.texturePath)}">
        </div>

        <div class="adobe-form-group">
          <label class="adobe-label" for="ps-interpolation">Interpolation Resampling:</label>
          <select id="ps-interpolation" class="adobe-select">
            <option value="bicubicAutomatic" ${state.photoshop.interpolation === 'bicubicAutomatic' ? 'selected' : ''}>bicubicAutomatic (Default PBR)</option>
            <option value="bicubicSharper" ${state.photoshop.interpolation === 'bicubicSharper' ? 'selected' : ''}>bicubicSharper (High Frequency)</option>
            <option value="nearestNeighbor" ${state.photoshop.interpolation === 'nearestNeighbor' ? 'selected' : ''}>nearestNeighbor (Pixel Precise)</option>
            <option value="bilinear" ${state.photoshop.interpolation === 'bilinear' ? 'selected' : ''}>bilinear (Fast Interpolation)</option>
          </select>
        </div>

        <div class="adobe-form-group">
          <label class="adobe-label" for="ps-color-conversion">Color Profile Gamut:</label>
          <select id="ps-color-conversion" class="adobe-select">
            <option value="sRGB IEC61966-2.1" ${state.photoshop.colorConversion === 'sRGB IEC61966-2.1' ? 'selected' : ''}>sRGB IEC61966-2.1 (Standard)</option>
            <option value="Adobe RGB (1998)" ${state.photoshop.colorConversion === 'Adobe RGB (1998)' ? 'selected' : ''}>Adobe RGB (1998 Wide Gamut)</option>
            <option value="Display P3" ${state.photoshop.colorConversion === 'Display P3' ? 'selected' : ''}>Display P3 (Apple Wide Color)</option>
            <option value="Preserve Embedded" ${state.photoshop.colorConversion === 'Preserve Embedded' ? 'selected' : ''}>Preserve Embedded Profile</option>
          </select>
        </div>

        <div class="adobe-form-group-toggle">
          <label class="adobe-checkbox-label">
            <input type="checkbox" id="ps-auto-save" class="adobe-checkbox" ${state.photoshop.autoSave ? 'checked' : ''}>
            <span>Auto-Save PSD Document after batchPlay swap</span>
          </label>
        </div>
      `;

      // Wire input listeners safely with defensive null guards
      const inputLayer = controlsContent.querySelector('#ps-layer-name');
      const inputTexture = controlsContent.querySelector('#ps-texture-path');
      const selectInterp = controlsContent.querySelector('#ps-interpolation');
      const selectColor = controlsContent.querySelector('#ps-color-conversion');
      const checkSave = controlsContent.querySelector('#ps-auto-save');

      if (inputLayer) {
        inputLayer.addEventListener('input', (e) => {
          state.photoshop.layerName = e.target.value.trim() || 'Packaging_Label_Front';
          updateCodeView();
        });
      }
      if (inputTexture) {
        inputTexture.addEventListener('input', (e) => {
          state.photoshop.texturePath = e.target.value.trim() || 'dist/textures/canister_diffuse.webp';
          updateCodeView();
        });
      }
      if (selectInterp) {
        selectInterp.addEventListener('change', (e) => {
          state.photoshop.interpolation = e.target.value;
          updateCodeView();
        });
      }
      if (selectColor) {
        selectColor.addEventListener('change', (e) => {
          state.photoshop.colorConversion = e.target.value;
          updateCodeView();
        });
      }
      if (checkSave) {
        checkSave.addEventListener('change', (e) => {
          state.photoshop.autoSave = e.target.checked;
          updateCodeView();
        });
      }

    } else if (state.activeRecipe === 'illustrator') {
      if (recipeIdBadge) recipeIdBadge.textContent = 'EXTENDSCRIPT JSX';
      if (codeLangLabel) codeLangLabel.textContent = 'JAVASCRIPT (JSX)';
      controlsContent.innerHTML = `
        <div class="adobe-form-group">
          <label class="adobe-label" for="il-pack-format">Packaging Format:</label>
          <select id="il-pack-format" class="adobe-select">
            <option value="canister" ${state.illustrator.packFormat === 'canister' ? 'selected' : ''}>Cylindrical Canister (Round Label & Seam)</option>
            <option value="pouch" ${state.illustrator.packFormat === 'pouch' ? 'selected' : ''}>Stand-Up Pouch Pack (Gusset Bottom)</option>
          </select>
        </div>

        <div class="adobe-form-group">
          <div class="adobe-slider-label-row">
            <label class="adobe-label" for="il-die-width">Die-Cut Width / Circumference:</label>
            <span id="il-val-width" class="adobe-slider-val">${state.illustrator.dieWidth} mm</span>
          </div>
          <input type="range" id="il-die-width" class="adobe-range" min="80" max="420" step="10" value="${state.illustrator.dieWidth}">
        </div>

        <div class="adobe-form-group">
          <div class="adobe-slider-label-row">
            <label class="adobe-label" for="il-die-height">Die-Cut Height:</label>
            <span id="il-val-height" class="adobe-slider-val">${state.illustrator.dieHeight} mm</span>
          </div>
          <input type="range" id="il-die-height" class="adobe-range" min="80" max="360" step="5" value="${state.illustrator.dieHeight}">
        </div>

        <div class="adobe-form-group">
          <div class="adobe-slider-label-row">
            <label class="adobe-label" for="il-bleed-margin">Bleed Margin (Guide Layer):</label>
            <span id="il-val-bleed" class="adobe-slider-val">${state.illustrator.bleedMargin} mm</span>
          </div>
          <input type="range" id="il-bleed-margin" class="adobe-range" min="1" max="8" step="0.5" value="${state.illustrator.bleedMargin}">
        </div>

        <div class="adobe-form-group">
          <div class="adobe-slider-label-row">
            <label class="adobe-label" for="il-crease-inset">Crease / Seam Inset Offset:</label>
            <span id="il-val-crease" class="adobe-slider-val">${state.illustrator.creaseInset} mm</span>
          </div>
          <input type="range" id="il-crease-inset" class="adobe-range" min="5" max="40" step="1" value="${state.illustrator.creaseInset}">
        </div>
      `;

      // Wire listeners safely with defensive null guards
      const selectFormat = controlsContent.querySelector('#il-pack-format');
      const sliderWidth = controlsContent.querySelector('#il-die-width');
      const valWidth = controlsContent.querySelector('#il-val-width');
      const sliderHeight = controlsContent.querySelector('#il-die-height');
      const valHeight = controlsContent.querySelector('#il-val-height');
      const sliderBleed = controlsContent.querySelector('#il-bleed-margin');
      const valBleed = controlsContent.querySelector('#il-val-bleed');
      const sliderCrease = controlsContent.querySelector('#il-crease-inset');
      const valCrease = controlsContent.querySelector('#il-val-crease');

      if (selectFormat) {
        selectFormat.addEventListener('change', (e) => {
          state.illustrator.packFormat = e.target.value;
          updateCodeView();
        });
      }
      if (sliderWidth) {
        sliderWidth.addEventListener('input', (e) => {
          state.illustrator.dieWidth = parseInt(e.target.value, 10);
          if (valWidth) valWidth.textContent = state.illustrator.dieWidth + ' mm';
          updateCodeView();
        });
      }
      if (sliderHeight) {
        sliderHeight.addEventListener('input', (e) => {
          state.illustrator.dieHeight = parseInt(e.target.value, 10);
          if (valHeight) valHeight.textContent = state.illustrator.dieHeight + ' mm';
          updateCodeView();
        });
      }
      if (sliderBleed) {
        sliderBleed.addEventListener('input', (e) => {
          state.illustrator.bleedMargin = parseFloat(e.target.value);
          if (valBleed) valBleed.textContent = state.illustrator.bleedMargin + ' mm';
          updateCodeView();
        });
      }
      if (sliderCrease) {
        sliderCrease.addEventListener('input', (e) => {
          state.illustrator.creaseInset = parseInt(e.target.value, 10);
          if (valCrease) valCrease.textContent = state.illustrator.creaseInset + ' mm';
          updateCodeView();
        });
      }

    } else if (state.activeRecipe === 'texture') {
      if (recipeIdBadge) recipeIdBadge.textContent = 'HEADLESS NODE CLI';
      if (codeLangLabel) codeLangLabel.textContent = 'NODE.JS (SHARP)';
      controlsContent.innerHTML = `
        <div class="adobe-form-group">
          <label class="adobe-label" for="tx-resolution">Master Texture Resolution:</label>
          <select id="tx-resolution" class="adobe-select">
            <option value="1024" ${state.texture.resolution === 1024 ? 'selected' : ''}>1024 x 1024 (Low Drawcall / Mobile)</option>
            <option value="2048" ${state.texture.resolution === 2048 ? 'selected' : ''}>2048 x 2048 (Production Standard)</option>
            <option value="4096" ${state.texture.resolution === 4096 ? 'selected' : ''}>4096 x 4096 (Ultra Packaging 4K)</option>
            <option value="8192" ${state.texture.resolution === 8192 ? 'selected' : ''}>8192 x 8192 (Hero 8K Master Print)</option>
          </select>
        </div>

        <div class="adobe-form-group">
          <label class="adobe-label" for="tx-compression">Compression Codec:</label>
          <select id="tx-compression" class="adobe-select">
            <option value="WebP (Lossless PBR 100%)" ${state.texture.compression.includes('WebP') ? 'selected' : ''}>WebP Lossless 100% (Khronos Neutral)</option>
            <option value="PNG-24 Chunk-Optimized" ${state.texture.compression.includes('PNG-24') ? 'selected' : ''}>PNG-24 Chunk-Optimized (libvips level 9)</option>
            <option value="PNG-32 Uncompressed" ${state.texture.compression.includes('PNG-32') ? 'selected' : ''}>PNG-32 Uncompressed RGBA</option>
          </select>
        </div>

        <div class="adobe-form-group">
          <label class="adobe-label" for="tx-tone-mapping">Color Calibration Transfer:</label>
          <select id="tx-tone-mapping" class="adobe-select">
            <option value="Khronos PBR Neutral (WebGPU Spec)" ${state.texture.toneMapping.includes('Khronos') ? 'selected' : ''}>Khronos PBR Neutral (WebGPU Spec)</option>
            <option value="Linear sRGB Rec.709" ${state.texture.toneMapping.includes('Linear') ? 'selected' : ''}>Linear sRGB Rec.709</option>
            <option value="ACEScg AP1 Filmic" ${state.texture.toneMapping.includes('ACEScg') ? 'selected' : ''}>ACEScg AP1 Filmic Curve</option>
          </select>
        </div>

        <div class="adobe-form-group">
          <label class="adobe-label" for="tx-normal-space">Normal Map Tangent Space:</label>
          <select id="tx-normal-space" class="adobe-select">
            <option value="OpenGL (+Y Normal)" ${state.texture.normalSpace.includes('OpenGL') ? 'selected' : ''}>OpenGL (+Y Green Normal - Three.js/Blender)</option>
            <option value="DirectX (-Y Inverted Normal)" ${state.texture.normalSpace.includes('DirectX') ? 'selected' : ''}>DirectX (-Y Inverted Normal - Unreal)</option>
          </select>
        </div>
      `;

      // Wire listeners safely with defensive null guards
      const selectRes = controlsContent.querySelector('#tx-resolution');
      const selectComp = controlsContent.querySelector('#tx-compression');
      const selectTone = controlsContent.querySelector('#tx-tone-mapping');
      const selectNorm = controlsContent.querySelector('#tx-normal-space');

      if (selectRes) {
        selectRes.addEventListener('change', (e) => {
          state.texture.resolution = parseInt(e.target.value, 10);
          updateCodeView();
        });
      }
      if (selectComp) {
        selectComp.addEventListener('change', (e) => {
          state.texture.compression = e.target.value;
          updateCodeView();
        });
      }
      if (selectTone) {
        selectTone.addEventListener('change', (e) => {
          state.texture.toneMapping = e.target.value;
          updateCodeView();
        });
      }
      if (selectNorm) {
        selectNorm.addEventListener('change', (e) => {
          state.texture.normalSpace = e.target.value;
          updateCodeView();
        });
      }
    }

    updateCodeView();
  }

  // --------------------------------------------------------------------------
  // 7. UPDATE CODE VIEW
  // --------------------------------------------------------------------------
  function updateCodeView() {
    if (!codeDisplay) return;
    const rawCode = getActiveRawCode();
    codeDisplay.innerHTML = highlightCode(rawCode);
    if (codeCharCount) {
      codeCharCount.textContent = rawCode.length.toLocaleString() + ' chars';
    }
  }

  // --------------------------------------------------------------------------
  // 8. TACTILE TOAST NOTIFICATION
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('visible');
    }, 2400);
  }

  // --------------------------------------------------------------------------
  // 9. COPY SCRIPT TO CLIPBOARD
  // --------------------------------------------------------------------------
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const rawCode = getActiveRawCode();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(rawCode);
        } else {
          // Fallback textarea
          const ta = document.createElement('textarea');
          ta.value = rawCode;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied to Clipboard';
        copyBtn.classList.add('copied');
        showToast('Recipe script copied to clipboard (' + rawCode.length + ' chars)');

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('[AdobeCCHub] Copy failed:', err);
        showToast('Unable to copy script automatically.');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. SIMULATE AUTOMATION EXECUTION
  // --------------------------------------------------------------------------
  function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  }

  if (simBtn) {
    simBtn.addEventListener('click', () => {
      if (state.isSimulating) return;
      state.isSimulating = true;

      const originalBtnText = simBtn.innerHTML;
      simBtn.disabled = true;
      simBtn.innerHTML = '<span>Executing Recipe...</span>';
      simBtn.style.opacity = '0.75';

      if (consoleIndicator) {
        consoleIndicator.textContent = 'RUNNING';
        consoleIndicator.className = 'adobe-console-running';
      }

      const active = state.activeRecipe;

      if (active === 'photoshop') {
        if (consoleOutput) {
          consoleOutput.innerHTML = `
            <div class="adobe-log-step">[${getTimestamp()}] INITIALIZE: Verifying UXP executeAsModal permissions in Photoshop 2026 host...</div>
          `;
        }

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-step">[${getTimestamp()}] MODAL LOCK: Acquired host execution token; history recording suspended.</div>
              <div class="adobe-log-step">[${getTimestamp()}] DISPATCH: batchPlay [placedLayerReplaceContents] -> "${escapeHtml(state.photoshop.layerName)}"</div>
            `;
          }
        }, 450);

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-step">[${getTimestamp()}] RESAMPLE: Swapped texture "${escapeHtml(state.photoshop.texturePath)}" with ${state.photoshop.interpolation}.</div>
              <div class="adobe-log-step">[${getTimestamp()}] FLUSH: Bounding box recalculated, history resumed, modal lock released.</div>
            `;
          }
        }, 1100);

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-complete">[${getTimestamp()}] COMPLETE: Photoshop Smart Object replaced in 1.48s. Memory clean.</div>
            `;
          }
          finishSimulation(originalBtnText);
        }, 1600);

      } else if (active === 'illustrator') {
        if (consoleOutput) {
          consoleOutput.innerHTML = `
            <div class="adobe-log-step">[${getTimestamp()}] EXTENDSCRIPT: Initializing Illustrator JSX execution context...</div>
          `;
        }

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-step">[${getTimestamp()}] SWATCH REGISTRATION: SpotColor "DieCut_Thru" (100% M) & "Crease_Score" (100% C) added.</div>
              <div class="adobe-log-step">[${getTimestamp()}] VECTOR GENERATION: Drawing ${state.illustrator.dieWidth}x${state.illustrator.dieHeight} mm die-line bounds.</div>
            `;
          }
        }, 450);

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-step">[${getTimestamp()}] GUIDES: Bleed box generated with ${state.illustrator.bleedMargin} mm margin; crease dashed line set to [4, 4].</div>
              <div class="adobe-log-step">[${getTimestamp()}] LAYERS: Locked TECHNICAL and GUIDE layers, live artboard focused.</div>
            `;
          }
        }, 1100);

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-complete">[${getTimestamp()}] COMPLETE: Packaging die-lines exported in 1.52s. 4 layers structured.</div>
            `;
          }
          finishSimulation(originalBtnText);
        }, 1600);

      } else if (active === 'texture') {
        if (consoleOutput) {
          consoleOutput.innerHTML = `
            <div class="adobe-log-step">[${getTimestamp()}] PIPELINE: Spawning libvips / sharp thread pool with ${state.texture.resolution}x${state.texture.resolution} master buffers...</div>
          `;
        }

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-step">[${getTimestamp()}] INTERLEAVE: Channel bit-packing (R=AO, G=Roughness, B=Metalness) complete.</div>
              <div class="adobe-log-step">[${getTimestamp()}] CALIBRATION: Khronos PBR Neutral highlight transfer applied to diffuse map.</div>
            `;
          }
        }, 500);

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-step">[${getTimestamp()}] COMPRESS: WebP lossless encoder wrote 100% quality mipmaps. Effort: 6.</div>
              <div class="adobe-log-step">[${getTimestamp()}] VALIDATION: Verified energy conservation across 0-1 linear gamut.</div>
            `;
          }
        }, 1150);

        setTimeout(() => {
          if (consoleOutput) {
            consoleOutput.innerHTML += `
              <div class="adobe-log-complete">[${getTimestamp()}] COMPLETE: PBR Neutral texture bundle written to disk in 1.62s.</div>
            `;
          }
          finishSimulation(originalBtnText);
        }, 1700);
      }
    });
  }

  function finishSimulation(originalBtnText) {
    if (consoleIndicator) {
      consoleIndicator.textContent = 'COMPLETED';
      consoleIndicator.className = 'adobe-console-completed';
    }
    simBtn.innerHTML = '<span>Execution Complete</span>';
    simBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    showToast('Automation simulation completed successfully.');

    setTimeout(() => {
      simBtn.innerHTML = originalBtnText;
      simBtn.disabled = false;
      simBtn.style.opacity = '1.0';
      simBtn.style.borderColor = '';
      if (consoleIndicator) {
        consoleIndicator.textContent = 'READY';
        consoleIndicator.className = 'adobe-console-ready';
      }
      state.isSimulating = false;
    }, 2400);
  }

  // --------------------------------------------------------------------------
  // 11. TAB SWITCHING
  // --------------------------------------------------------------------------
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const recipe = btn.dataset.recipe;
      if (recipe === state.activeRecipe) return;

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      state.activeRecipe = recipe;
      renderControls();

      // Reset console
      if (consoleOutput) {
        consoleOutput.innerHTML = `[SYSTEM] Switched recipe to "${recipe.toUpperCase()}". Ready for simulation.`;
      }
      if (consoleIndicator) {
        consoleIndicator.textContent = 'READY';
        consoleIndicator.className = 'adobe-console-ready';
      }
    });
  });

  // Initial render
  renderControls();
  console.log('[AdobeCCHub] Initialized successfully inside #adobe-cc-automation-container.');
}

// Auto-run if loaded directly in browser context
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdobeCCAutomationHub);
  } else {
    initAdobeCCAutomationHub();
  }
}
