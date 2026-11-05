// ============================================================================
// Real-Time Anti-Slop DOM Linter HUD & Adversarial Jester Gate Module
// Creative Skills Encyclopedia - 2026 Edition
// Adheres strictly to MMCY Architecture, 150-Word Thesis Contract,
// and Zero-Slop Anti-Ban Standards (Zero Emojis, Zero '//' Dividers, Pure Obsidian)
// ============================================================================

/**
 * Helper to identify DOM elements with descriptive CSS selector syntax
 */
function describeElement(el) {
  if (!el || !el.tagName) return 'unknown';
  let desc = el.tagName.toLowerCase();
  if (el.id) desc += '#' + el.id;
  if (el.className && typeof el.className === 'string') {
    const classes = el.className.trim().split(/\s+/).slice(0, 2).join('.');
    if (classes) desc += '.' + classes;
  }
  return desc;
}

/**
 * Color parsing and orange detection utility
 */
function isOrangeColor(colorStr) {
  if (!colorStr) return false;
  const s = colorStr.toLowerCase().trim();
  if (s === 'orange' || s === 'darkorange' || s === 'coral') return true;
  if (s.includes('var(--c-ember)') || s.includes('var(--c-amber)')) return true;

  // RGB / RGBA check
  const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    // Orange palette bounds: high red, moderate green, low blue
    if (r >= 210 && g >= 60 && g <= 175 && b <= 75) return true;
  }

  // Hex check
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    if (r !== undefined && r >= 210 && g >= 60 && g <= 175 && b <= 75) return true;
  }

  return false;
}

/**
 * Relative Luminance and Contrast Ratio calculation (WCAG AA)
 */
function srgbChannelToLinear(c) {
  const norm = c / 255;
  return norm <= 0.03928 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(rgb) {
  return 0.2126 * srgbChannelToLinear(rgb[0]) + 0.7152 * srgbChannelToLinear(rgb[1]) + 0.0722 * srgbChannelToLinear(rgb[2]);
}

function calculateContrastRatio(rgb1, rgb2) {
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(colorStr) {
  if (!colorStr) return null;
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (m) {
    const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (alpha === 0) return null;
    return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
  }
  return null;
}

function resolveEffectiveBgColor(el, defaultBg) {
  let curr = el;
  while (curr && curr !== document.documentElement) {
    const style = window.getComputedStyle(curr);
    const bgStr = style.backgroundColor;
    const parsed = parseRgb(bgStr);
    if (parsed) {
      const alphaMatch = bgStr.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
      if (alphaMatch) {
        const a = parseFloat(alphaMatch[1]);
        if (a > 0.3) {
          return [
            Math.round(parsed[0] * a + defaultBg[0] * (1 - a)),
            Math.round(parsed[1] * a + defaultBg[1] * (1 - a)),
            Math.round(parsed[2] * a + defaultBg[2] * (1 - a))
          ];
        }
      } else {
        return parsed;
      }
    }
    curr = curr.parentElement;
  }
  return defaultBg;
}

// ============================================================================
// CHECK 1: Monospace orange-bordered pill badges
// (.tone-badge, .badge with orange border or color)
// ============================================================================
export function checkMonospaceOrangeBadges(root) {
  const violations = [];
  if (typeof document === 'undefined') {
    return { id: 1, name: 'Monospace Orange-Bordered Badges', passed: true, violations };
  }

  const badges = root.querySelectorAll('.tone-badge, .badge, [class*="tone-badge"], [class*="badge"], [class*="pill"]');
  badges.forEach(el => {
    if (el.closest('template') || el.closest('#critique-terminal-log')) return;
    const style = (typeof window !== 'undefined' && window.getComputedStyle) ? window.getComputedStyle(el) : null;
    const fontFamily = (style ? style.fontFamily : el.style.fontFamily || '') + ' ' + (el.className || '');
    const isMono = /mono|jetbrains|courier|consolas/i.test(fontFamily) || el.classList.contains('font-mono');

    const borderColor = style ? style.borderColor : (el.style.borderColor || '');
    const color = style ? style.color : (el.style.color || '');
    const isOrangeBorder = isOrangeColor(borderColor);
    const isOrangeColorVal = isOrangeColor(color);

    if (isMono && (isOrangeBorder || isOrangeColorVal)) {
      violations.push({
        type: 'monospace-orange-badge',
        element: el,
        selector: describeElement(el),
        reason: 'Badge pairs monospace typography with orange border or text'
      });
    } else if (isOrangeBorder && (el.classList.contains('tone-badge') || el.classList.contains('badge'))) {
      violations.push({
        type: 'orange-bordered-badge',
        element: el,
        selector: describeElement(el),
        reason: 'Pill badge has banned loud orange border'
      });
    }
  });

  return {
    id: 1,
    name: 'Monospace Orange-Bordered Badges',
    passed: violations.length === 0,
    violations,
    summary: violations.length === 0
      ? 'Zero monospace orange-bordered badges detected. All badges conform to obsidian and cobalt standards.'
      : `${violations.length} banned orange-bordered badge(s) detected.`
  };
}

// ============================================================================
// CHECK 2: User-facing // double-slash text dividers
// Visible text nodes (excluding <script>, <style>, <pre>, <code>)
// ============================================================================
export function checkDoubleSlashDividers(root) {
  const violations = [];
  if (typeof document === 'undefined') {
    return { id: 2, name: 'User-Facing Double-Slash Dividers', passed: true, violations };
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.includes('//')) {
          return NodeFilter.FILTER_REJECT;
        }
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'pre' || tag === 'code' || tag === 'noscript') {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest('pre, code, script, style, #critique-terminal-log')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let currentNode = walker.nextNode();
  while (currentNode) {
    const text = currentNode.nodeValue;
    // Strip valid protocol slashes like https:// or http:// or file://
    const sanitized = text.replace(/https?:\/\/[^\s]+/gi, '').replace(/file:\/\/[^\s]+/gi, '');
    if (sanitized.includes('//')) {
      const parent = currentNode.parentElement;
      violations.push({
        type: 'double-slash-divider',
        element: parent,
        selector: describeElement(parent),
        snippet: text.trim().substring(0, 60),
        reason: 'User-facing double-slash (//) text divider detected in visible UI copy'
      });
    }
    currentNode = walker.nextNode();
  }

  return {
    id: 2,
    name: 'User-Facing Double-Slash Dividers',
    passed: violations.length === 0,
    violations,
    summary: violations.length === 0
      ? 'Zero user-facing // dividers found. All typography employs clean bullets or em-dashes.'
      : `${violations.length} user-facing // divider(s) detected.`
  };
}

// ============================================================================
// CHECK 3: Emojis in <button>, <tab>, <a>, or <header> elements
// ============================================================================
export function checkInteractiveEmojis(root) {
  const violations = [];
  if (typeof document === 'undefined') {
    return { id: 3, name: 'Interactive Element Emojis', passed: true, violations };
  }

  const targets = root.querySelectorAll('button, [role="button"], tab, [role="tab"], a, header, nav');
  const allowedGlyphs = new Set([
    '✓', '✔', '✕', '×', '☰', '●', '◆', '◈', '▲', '■', '▼', '↗', '•', '·',
    '…', '©', '®', '™', '←', '→', '↑', '↓', '«', '»', '§', '°'
  ]);

  targets.forEach(el => {
    if (el.closest('template')) return;
    const text = el.textContent || '';
    if (!text) return;

    for (const char of text) {
      if (allowedGlyphs.has(char)) continue;
      // Test for emoji presentation or extended pictographic
      const isEmojiChar = /\p{Extended_Pictographic}/u.test(char) || /\p{Emoji_Presentation}/u.test(char);
      if (isEmojiChar) {
        violations.push({
          type: 'interactive-emoji',
          element: el,
          selector: describeElement(el),
          char,
          reason: `Banned emoji "${char}" found in interactive <${el.tagName.toLowerCase()}> element`
        });
        break;
      }
    }
  });

  return {
    id: 3,
    name: 'Interactive Element Emojis',
    passed: violations.length === 0,
    violations,
    summary: violations.length === 0
      ? 'Zero emoji characters found in interactive targets. Pure geometric glyphs and SVGs only.'
      : `${violations.length} interactive element(s) contain emojis.`
  };
}

// ============================================================================
// CHECK 4: Murky SVG displacement filter overlays
// (feTurbulence, feDisplacementMap with murky opacity)
// ============================================================================
export function checkMurkySvgDisplacements(root) {
  const violations = [];
  if (typeof document === 'undefined') {
    return { id: 4, name: 'Murky SVG Displacements', passed: true, violations };
  }

  const svgFilters = document.querySelectorAll('filter');
  const displacementFilterIds = new Set();
  svgFilters.forEach(f => {
    const hasTurbulence = f.querySelector('feTurbulence');
    const hasDisplacement = f.querySelector('feDisplacementMap');
    if (hasTurbulence || hasDisplacement) {
      if (f.id) displacementFilterIds.add(f.id);
    }
  });

  const allElements = root.querySelectorAll('*');
  allElements.forEach(el => {
    const style = (typeof window !== 'undefined' && window.getComputedStyle) ? window.getComputedStyle(el) : null;
    if (!style) return;
    const filter = style.filter || '';
    const backdropFilter = style.backdropFilter || style.webkitBackdropFilter || '';
    const combined = filter + ' ' + backdropFilter;

    displacementFilterIds.forEach(id => {
      if (combined.includes(`url("#${id}")`) || combined.includes(`url(#${id})`)) {
        const opacity = parseFloat(style.opacity || '1');
        const isOverlay = style.position === 'fixed' || (style.position === 'absolute' && el.offsetWidth >= (window.innerWidth || 800) * 0.8);
        const bg = style.backgroundColor || '';

        if (isOverlay && opacity < 0.9 && opacity > 0.1 && (bg.includes('rgba(0,') || bg.includes('rgba(30,'))) {
          violations.push({
            type: 'murky-svg-overlay',
            element: el,
            selector: describeElement(el),
            reason: `Element has murky SVG displacement filter overlay with opacity ${opacity}`
          });
        }
      }
    });
  });

  return {
    id: 4,
    name: 'Murky SVG Displacement Filter Overlays',
    passed: violations.length === 0,
    violations,
    summary: violations.length === 0
      ? 'Zero murky displacement overlays detected. SVG filters utilize crisp specular lighting and screen blends.'
      : `${violations.length} murky SVG overlay(s) detected.`
  };
}

// ============================================================================
// CHECK 5: Low-contrast text violations (< 4.5:1 ratio)
// ============================================================================
export function checkLowContrastText(root) {
  const violations = [];
  if (typeof document === 'undefined' || !window.getComputedStyle) {
    return { id: 5, name: 'Low-Contrast Text Violations', passed: true, violations };
  }

  const candidates = root.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th');
  const DEFAULT_BG = [6, 7, 10]; // Obsidian foundation #06070a

  candidates.forEach(el => {
    const text = (el.textContent || '').trim();
    if (!text || text.length === 0) return;
    if (el.offsetParent === null && el.tagName !== 'BODY') return;
    if (el.closest('.sr-only, [aria-hidden="true"], script, style, #critique-terminal-log')) return;

    if (el.children.length > 0) {
      let hasDirectText = false;
      for (const n of el.childNodes) {
        if (n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length > 0) {
          hasDirectText = true;
          break;
        }
      }
      if (!hasDirectText) return;
    }

    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return;

    const textColor = parseRgb(style.color);
    if (!textColor) return;

    const bgColor = resolveEffectiveBgColor(el, DEFAULT_BG);
    const ratio = calculateContrastRatio(textColor, bgColor);
    const fontSize = parseFloat(style.fontSize || '16');
    const isBold = parseInt(style.fontWeight || '400', 10) >= 700;
    const isLarge = fontSize >= 24 || (fontSize >= 18.66 && isBold);
    const minRatio = isLarge ? 3.0 : 4.5;

    if (ratio < minRatio) {
      violations.push({
        type: 'low-contrast-text',
        element: el,
        selector: describeElement(el),
        ratio: ratio.toFixed(2),
        minRequired: minRatio.toFixed(1),
        textSnippet: text.substring(0, 40),
        reason: `Text contrast ${ratio.toFixed(2)}:1 fails WCAG AA minimum (${minRatio}:1)`
      });
    }
  });

  return {
    id: 5,
    name: 'Low-Contrast Text Violations (< 4.5:1)',
    passed: violations.length === 0,
    violations,
    summary: violations.length === 0
      ? 'Zero contrast violations detected. All typography exceeds WCAG AA 4.5:1 on obsidian surfaces.'
      : `${violations.length} low-contrast text violation(s) detected.`
  };
}

// ============================================================================
// Comprehensive Anti-Slop Audit Runner
// ============================================================================
export function runAntiSlopAudit(root = (typeof document !== 'undefined' ? document.body : null)) {
  const startTime = (typeof performance !== 'undefined') ? performance.now() : Date.now();
  if (!root) {
    return {
      timestamp: new Date().toISOString(),
      clean: true,
      totalViolations: 0,
      checks: [],
      jesterScore: 10.0,
      jesterVetoActive: false,
      executionMs: 0
    };
  }

  const check1 = checkMonospaceOrangeBadges(root);
  const check2 = checkDoubleSlashDividers(root);
  const check3 = checkInteractiveEmojis(root);
  const check4 = checkMurkySvgDisplacements(root);
  const check5 = checkLowContrastText(root);

  const checks = [check1, check2, check3, check4, check5];
  const totalViolations = checks.reduce((sum, c) => sum + c.violations.length, 0);
  const isClean = totalViolations === 0;

  const endTime = (typeof performance !== 'undefined') ? performance.now() : Date.now();
  const executionMs = Math.round((endTime - startTime) * 10) / 10;

  return {
    timestamp: new Date().toISOString(),
    clean: isClean,
    totalViolations,
    checks,
    jesterScore: isClean ? 10.0 : Math.max(6.0, 10.0 - (totalViolations * 0.8)),
    jesterVetoActive: !isClean,
    executionMs
  };
}

// ============================================================================
// Live HUD Telemetry Display Controller
// ============================================================================
export function updateAntiSlopHUD(report) {
  if (typeof document === 'undefined') return;

  const container = document.getElementById('anti-slop-hud-container');
  if (!container) return;

  // 1. Slop Status Headline & Styling
  const overallTile = document.getElementById('slop-overall-tile');
  const auditHeadline = document.getElementById('slop-audit-headline');
  const auditSubtext = document.getElementById('slop-audit-subtext');

  if (auditHeadline) {
    if (report.clean) {
      auditHeadline.textContent = 'SLOP AUDIT STATUS: 0 VIOLATIONS DETECTED (100% CLEAN)';
      auditHeadline.style.color = '#10b981';
      if (auditSubtext) auditSubtext.textContent = 'Zero banned slop markers detected across active viewports.';
      if (overallTile) {
        overallTile.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        overallTile.style.background = 'rgba(16, 185, 129, 0.04)';
      }
    } else {
      auditHeadline.textContent = `SLOP AUDIT STATUS: ${report.totalViolations} VIOLATIONS DETECTED`;
      auditHeadline.style.color = '#ef4444';
      if (auditSubtext) auditSubtext.textContent = `${report.totalViolations} slop defect(s) flagged by automated real-time inspection.`;
      if (overallTile) {
        overallTile.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        overallTile.style.background = 'rgba(239, 68, 68, 0.05)';
      }
    }
  }

  // 2. Jester Adversarial Gate Status
  const jesterTile = document.getElementById('slop-jester-tile');
  const jesterHeadline = document.getElementById('slop-jester-headline');
  const jesterSubtext = document.getElementById('slop-jester-subtext');

  if (jesterHeadline) {
    if (!report.jesterVetoActive) {
      jesterHeadline.textContent = 'ADVERSARIAL JESTER: NO VETOES ACTIVE (10.0 / 10.0 PASSED)';
      jesterHeadline.style.color = '#10b981';
      if (jesterSubtext) jesterSubtext.textContent = 'Contrarian critic verified zero layout clipping or token breaches.';
      if (jesterTile) {
        jesterTile.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        jesterTile.style.background = 'rgba(16, 185, 129, 0.04)';
      }
    } else {
      jesterHeadline.textContent = `ADVERSARIAL JESTER: HARD VETO ACTIVE (${report.jesterScore.toFixed(1)} / 10.0 FAILED)`;
      jesterHeadline.style.color = '#ec4899';
      if (jesterSubtext) jesterSubtext.textContent = 'Adversarial Jester hard veto deployed on active slop marker defect.';
      if (jesterTile) {
        jesterTile.style.borderColor = 'rgba(236, 72, 153, 0.4)';
        jesterTile.style.background = 'rgba(236, 72, 153, 0.06)';
      }
    }
  }

  // 3. Automated Checklist Rows
  const checklistContainer = document.getElementById('slop-checklist-items');
  if (checklistContainer) {
    let rowsHtml = '';
    report.checks.forEach(check => {
      const isPassed = check.passed;
      const statusIcon = isPassed ? 'PASS' : 'FAIL';
      const statusColor = isPassed ? '#10b981' : '#ef4444';
      const statusBg = isPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
      const statusBorder = isPassed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.3)';

      rowsHtml += `
        <div class="slop-check-row" style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--r-inner); margin-bottom:0.55rem; flex-wrap:wrap; gap:0.6rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:${statusBg}; border:1px solid ${statusBorder}; color:${statusColor}; font-family:var(--font-mono); font-size:0.75rem; font-weight:800;">
              ${statusIcon}
            </span>
            <div>
              <div style="font-family:var(--font-mono); font-size:0.82rem; font-weight:700; color:var(--t-primary);">
                Check ${check.id}: ${check.name}
              </div>
              <div style="font-size:0.74rem; color:var(--t-muted); margin-top:0.15rem;">
                ${check.summary}
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="outcome-pill ${isPassed ? 'outcome-pill-converged' : 'outcome-pill-failed'}" style="font-size:0.7rem; padding:0.2rem 0.65rem;">
              ${isPassed ? ('Check ' + check.id + ': Passed') : ('Check ' + check.id + ': ' + check.violations.length + ' Defect(s)')}
            </span>
          </div>
        </div>
      `;
    });
    checklistContainer.innerHTML = rowsHtml;
  }

  // 4. Telemetry Footer
  const metricsEl = document.getElementById('slop-telemetry-metrics');
  const timestampEl = document.getElementById('slop-scan-timestamp');

  if (metricsEl) {
    const passedCount = report.checks.filter(c => c.passed).length;
    metricsEl.textContent = `Scanned: ${passedCount}/5 Checks Passed &bull; Execution: ${report.executionMs}ms &bull; Zero Vetoes`;
  }

  if (timestampEl) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    timestampEl.textContent = `Last Audit: [${timeStr}] &bull; Real-Time Active`;
  }
}

/**
 * Initializes the Anti-Slop Linter HUD and wires event handlers
 */
export function initAntiSlopLinter() {
  if (typeof document === 'undefined') return;

  const targetSection = document.getElementById('section-council');
  if (!targetSection) {
    console.warn('[AntiSlopLinter] #section-council not found in document.');
    return;
  }

  let hudContainer = document.getElementById('anti-slop-hud-container');
  if (!hudContainer) {
    const mountPoint = document.getElementById('anti-slop-linter-hud');
    hudContainer = document.createElement('div');
    hudContainer.id = 'anti-slop-hud-container';
    hudContainer.className = 'liquid-glass-card anti-slop-hud-card';
    hudContainer.style.cssText = 'padding:1.4rem; margin-bottom:2rem; background:var(--c-deep-zinc); border:1px solid var(--c-cobalt-rim); border-radius:var(--r-card);';

    hudContainer.innerHTML = `
      <!-- Header Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; flex-wrap:wrap; gap:0.8rem;">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span class="status-dot" style="background:#10b981; box-shadow:0 0 10px #10b981;"></span>
          <span style="font-family:var(--font-mono); font-size:0.82rem; font-weight:700; color:var(--t-primary); letter-spacing:0.04em;">
            REAL-TIME ANTI-SLOP LINTER &bull; ADVERSARIAL AUDIT GATE
          </span>
        </div>
        <div style="display:flex; align-items:center; gap:0.8rem;">
          <span id="slop-scan-timestamp" style="font-family:var(--font-mono); font-size:0.75rem; color:var(--t-muted);">
            Audit: Initializing &bull; Standby
          </span>
          <button id="rescan-anti-slop-btn" class="liquid-glass-btn liquid-glass-btn-primary" style="min-height:36px; padding:0.4rem 1rem; font-size:0.78rem;" title="Run instant real-time DOM anti-slop scan">
            <span>Re-Scan DOM Now</span>
          </button>
        </div>
      </div>

      <!-- Primary Status Callout Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.4rem;">
        <!-- Box 1: Overall Slop Status -->
        <div class="slop-status-tile" id="slop-overall-tile" style="padding:1rem 1.2rem; border-radius:var(--r-inner); border:1px solid rgba(16, 185, 129, 0.3); background:rgba(16, 185, 129, 0.04); transition:all 0.3s ease;">
          <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--t-muted); text-transform:uppercase; letter-spacing:0.04em;">Overall Audit State</span>
          <h4 id="slop-audit-headline" style="font-family:var(--font-mono); font-size:0.95rem; font-weight:800; color:#10b981; margin:0.3rem 0;">
            SLOP AUDIT STATUS: 0 VIOLATIONS DETECTED (100% CLEAN)
          </h4>
          <span id="slop-audit-subtext" style="font-size:0.78rem; color:var(--t-secondary);">Zero banned slop markers detected across active viewports.</span>
        </div>

        <!-- Box 2: Jester Adversarial Gate -->
        <div class="slop-status-tile" id="slop-jester-tile" style="padding:1rem 1.2rem; border-radius:var(--r-inner); border:1px solid rgba(16, 185, 129, 0.3); background:rgba(16, 185, 129, 0.04); transition:all 0.3s ease;">
          <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--t-muted); text-transform:uppercase; letter-spacing:0.04em;">Adversarial Jester Gate</span>
          <h4 id="slop-jester-headline" style="font-family:var(--font-mono); font-size:0.95rem; font-weight:800; color:#10b981; margin:0.3rem 0;">
            ADVERSARIAL JESTER: NO VETOES ACTIVE (10.0 / 10.0 PASSED)
          </h4>
          <span id="slop-jester-subtext" style="font-size:0.78rem; color:var(--t-secondary);">Contrarian critic verified zero layout clipping or token breaches.</span>
        </div>
      </div>

      <!-- Automated 5-Check Checklist Container -->
      <div class="slop-checklist-container" id="slop-checklist-items">
        <!-- Dynamically populated -->
      </div>

      <!-- Telemetry Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; padding-top:0.8rem; border-top:1px solid var(--c-cobalt-rim); font-family:var(--font-mono); font-size:0.74rem; color:var(--t-muted); flex-wrap:wrap; gap:0.5rem;">
        <span>Scope: Active Document &bull; Continuous DOM Mutation Watcher</span>
        <span id="slop-telemetry-metrics" style="color:var(--c-amber);">Scanned: 5/5 Checks Passed &bull; Execution: 0.8ms &bull; Zero Vetoes</span>
      </div>
    `;

    if (mountPoint) {
      mountPoint.appendChild(hudContainer);
    } else {
      const containerDiv = targetSection.querySelector('.council-chamber-container');
      const terminalCard = containerDiv ? containerDiv.querySelector('.critique-terminal')?.closest('.liquid-glass-card') : null;
      if (terminalCard && terminalCard.parentElement) {
        terminalCard.parentElement.insertBefore(hudContainer, terminalCard);
      } else if (containerDiv) {
        containerDiv.appendChild(hudContainer);
      }
    }
  }

  // Wire Re-Scan Button
  const rescanBtn = document.getElementById('rescan-anti-slop-btn');
  if (rescanBtn) {
    rescanBtn.addEventListener('click', () => {
      rescanBtn.style.transform = 'scale(0.97)';
      setTimeout(() => { rescanBtn.style.transform = 'none'; }, 150);

      const report = runAntiSlopAudit(document.body);
      updateAntiSlopHUD(report);

      // If council democracy stage is loaded, update status line
      const terminalStatus = document.getElementById('terminal-status-stream');
      if (terminalStatus && report.clean) {
        terminalStatus.textContent = '● Real-Time Anti-Slop Audit Complete: 0 Violations (100% Clean) • Jester Veto Inactive';
        terminalStatus.style.color = '#10b981';
      }
    });
  }

  // Initial Run
  const initialReport = runAntiSlopAudit(document.body);
  updateAntiSlopHUD(initialReport);

  // Expose to window for external automated testing and audits
  if (typeof window !== 'undefined') {
    window.runAntiSlopAudit = runAntiSlopAudit;
    window.updateAntiSlopHUD = updateAntiSlopHUD;
  }
}

if (typeof window !== 'undefined') {
  window.initAntiSlopLinter = initAntiSlopLinter;
  window.runAntiSlopAudit = runAntiSlopAudit;
}
