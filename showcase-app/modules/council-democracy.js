// ============================================================================
// AI Council Chamber & Democracy Console Module
// Synthesized from vercel-browser-council & Theo Browne's Visual Hill-Climbing
// Features: 3-to-6 Agent Frontier Council, Adversarial Jester Hard Veto,
// Live Animated Target Threshold Bar (>= 9.5 / 10.0), Democratic Voting Outcome Pill,
// Interactive SVG Radar Chart, 5 Live Metric Bars, and Real-Time Streaming Critique Terminal
// ============================================================================

export function initCouncilDemocracy() {
  if (typeof document === 'undefined') return;

  // DOM Elements
  const councilSelect = document.getElementById('council-size-select');
  const sizePills = document.querySelectorAll('.council-size-pill[data-size]');
  const modeButtons = document.querySelectorAll('.mode-toggle-btn[data-mode]');
  const auditBtn = document.getElementById('trigger-council-audit-btn');
  const consensusPill = document.getElementById('council-consensus-pill');
  const compositeScoreEl = document.getElementById('council-composite-score');
  const progressBar = document.getElementById('council-progress-bar');
  const cycleBadge = document.getElementById('council-cycle-badge');
  const radarSvg = document.getElementById('council-radar-svg');
  const terminalLog = document.getElementById('critique-terminal-log');
  const terminalStatus = document.getElementById('terminal-status-stream');
  const clearTerminalBtn = document.getElementById('clear-critique-log-btn');
  const fastForwardBtn = document.getElementById('terminal-fast-forward-btn');

  // Terminal Filter Buttons
  const filterAllBtn = document.getElementById('terminal-filter-all');
  const filterJesterBtn = document.getElementById('terminal-filter-jester');
  const filterSystemBtn = document.getElementById('terminal-filter-system');

  // Council Member Cards & Scores
  const cardGemini = document.getElementById('card-gemini');
  const scoreGemini = document.getElementById('score-gemini');
  const statusGemini = document.getElementById('status-gemini');
  const verdictGemini = document.getElementById('verdict-gemini');

  const cardOpus = document.getElementById('card-opus');
  const scoreOpus = document.getElementById('score-opus');
  const statusOpus = document.getElementById('status-opus');
  const verdictOpus = document.getElementById('verdict-opus');

  const cardAstra = document.getElementById('card-astra');
  const scoreAstra = document.getElementById('score-astra');
  const statusAstra = document.getElementById('status-astra');
  const verdictAstra = document.getElementById('verdict-astra');

  const cardJester = document.getElementById('card-jester');
  const scoreJester = document.getElementById('score-jester');
  const statusJester = document.getElementById('status-jester');
  const verdictJester = document.getElementById('verdict-jester');
  const jesterVetoBadge = document.getElementById('jester-veto-badge');

  const cardA11y = document.getElementById('card-a11y');
  const scoreA11y = document.getElementById('score-a11y');
  const statusA11y = document.getElementById('status-a11y');

  const cardPerf = document.getElementById('card-perf');
  const scorePerf = document.getElementById('score-perf');
  const statusPerf = document.getElementById('status-perf');

  // Metric Bars
  const fillViewport = document.getElementById('metric-fill-viewport');
  const scoreViewport = document.getElementById('score-val-viewport');
  const fillContrast = document.getElementById('metric-fill-contrast');
  const scoreContrast = document.getElementById('score-val-contrast');
  const fillMotion = document.getElementById('metric-fill-motion');
  const scoreMotion = document.getElementById('score-val-motion');
  const fillAntislop = document.getElementById('metric-fill-antislop');
  const scoreAntislop = document.getElementById('score-val-antislop');
  const fillOptics = document.getElementById('metric-fill-optics');
  const scoreOptics = document.getElementById('score-val-optics');
  const metricsCompositeDisplay = document.getElementById('metrics-composite-display');
  const metricsVetoDisplay = document.getElementById('metrics-veto-display');

  if (!radarSvg || !auditBtn) {
    console.warn('[CouncilDemocracy] Essential DOM elements missing.');
    return;
  }

  // State Management
  let councilSize = 4;
  let operatingMode = 'builder'; // 'builder' | 'reviewer'
  let isAuditing = false;
  let activeTimers = [];
  let currentFilter = 'all'; // 'all' | 'jester' | 'system'
  let logHistory = [];

  // Metric Baselines & Converged Targets
  const METRIC_DEFINITIONS = [
    { id: 'viewport', label: 'First-Viewport Impact', baseline: 8.2, target: 9.8, max: 10.0 },
    { id: 'contrast', label: 'Contrast & A11y', baseline: 8.5, target: 10.0, max: 10.0 },
    { id: 'motion', label: 'Motion Physics & 60 FPS', baseline: 7.8, target: 9.9, max: 10.0 },
    { id: 'antislop', label: 'Anti-Slop Ban Compliance', baseline: 8.4, target: 10.0, max: 10.0 },
    { id: 'optics', label: 'Optical Refraction Quality', baseline: 7.5, target: 9.6, max: 10.0 }
  ];

  let currentScores = [9.8, 10.0, 9.9, 10.0, 9.6];
  const baselineScores = [8.2, 8.5, 7.8, 8.4, 7.5];

  // Helper to get formatted ISO time
  function getLogTimestamp() {
    const now = new Date();
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `[${mm}:${ss}.${ms}]`;
  }

  // ==========================================================================
  // SVG Radar Chart Engine
  // ==========================================================================
  function renderRadarChart(scores, baseline, animateProgress = 1.0) {
    const width = 440;
    const height = 380;
    const cx = 220;
    const cy = 190;
    const r = 120;
    const numAxes = 5;

    // Angles for 5-vertex polygon starting from top (-pi/2)
    const angles = [];
    for (let i = 0; i < numAxes; i++) {
      angles.push(-Math.PI / 2 + (i * 2 * Math.PI / numAxes));
    }

    let svgHtml = `
      <defs>
        <radialGradient id="radarAmberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.45" />
          <stop offset="70%" stop-color="#ffb35c" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.04" />
        </radialGradient>
        <filter id="radarGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" mode="over" />
        </filter>
      </defs>
    `;

    // 1. Concentric Pentagonal Reference Rings (20%, 40%, 60%, 80%, 100%)
    const ringLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    ringLevels.forEach((level, idx) => {
      const ringRadius = r * level;
      const pts = angles.map(a => `${(cx + ringRadius * Math.cos(a)).toFixed(1)},${(cy + ringRadius * Math.sin(a)).toFixed(1)}`).join(' ');
      const strokeColor = idx === 4 ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.06)';
      const isTargetRing = idx === 4;
      svgHtml += `<polygon points="${pts}" fill="none" stroke="${strokeColor}" stroke-width="${isTargetRing ? '1.5' : '1'}" />`;
      
      // Scale label on top vertical axis
      if (idx > 0) {
        const valText = (level * 10).toFixed(0);
        svgHtml += `<text x="${cx + 6}" y="${cy - ringRadius + 4}" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="9">${valText}</text>`;
      }
    });

    // 2. Radial Axis Spokes
    angles.forEach((a, i) => {
      const x2 = cx + r * Math.cos(a);
      const y2 = cy + r * Math.sin(a);
      svgHtml += `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(255, 255, 255, 0.10)" stroke-width="1" />`;
    });

    // 3. Theo's Baseline Polygon (Dashed Slate)
    const basePts = angles.map((a, i) => {
      const val = baseline[i] / 10.0;
      const x = cx + r * val * Math.cos(a);
      const y = cy + r * val * Math.sin(a);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    svgHtml += `<polygon points="${basePts}" fill="rgba(148, 163, 184, 0.08)" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />`;

    // 4. Current / 10x Standard Polygon (Glowing Amber / Ember Gradient)
    const currentPts = angles.map((a, i) => {
      // Interpolate between baseline and target if animating
      const bVal = baseline[i] / 10.0;
      const tVal = scores[i] / 10.0;
      const val = bVal + (tVal - bVal) * animateProgress;
      const x = cx + r * val * Math.cos(a);
      const y = cy + r * val * Math.sin(a);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    svgHtml += `<polygon points="${currentPts}" fill="url(#radarAmberGlow)" stroke="#f97316" stroke-width="2.5" filter="url(#radarGlowFilter)" />`;

    // 5. Vertices and Data Points
    angles.forEach((a, i) => {
      const bVal = baseline[i] / 10.0;
      const tVal = scores[i] / 10.0;
      const val = bVal + (tVal - bVal) * animateProgress;
      const vx = cx + r * val * Math.cos(a);
      const vy = cy + r * val * Math.sin(a);
      const scoreNum = (baseline[i] + (scores[i] - baseline[i]) * animateProgress).toFixed(1);

      // Vertex circle
      svgHtml += `<circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="4.5" fill="#f97316" stroke="#ffffff" stroke-width="1.5" />`;

      // Axis Labels positioned outside radius
      const labelDist = r + 36;
      let lx = cx + labelDist * Math.cos(a);
      let ly = cy + labelDist * Math.sin(a);
      let textAnchor = 'middle';
      if (Math.abs(Math.cos(a)) > 0.3) {
        textAnchor = Math.cos(a) > 0 ? 'start' : 'end';
      }

      // Vertical offset adjustments for visual balance
      if (i === 0) ly -= 10;
      if (i === 2 || i === 3) ly += 14;

      const def = METRIC_DEFINITIONS[i];
      svgHtml += `
        <g class="radar-axis-label" style="cursor:default;">
          <text x="${lx.toFixed(1)}" y="${(ly - 6).toFixed(1)}" text-anchor="${textAnchor}" fill="#f8fafc" font-family="Inter, sans-serif" font-size="11" font-weight="600">${def.label}</text>
          <text x="${lx.toFixed(1)}" y="${(ly + 8).toFixed(1)}" text-anchor="${textAnchor}" fill="#ffb35c" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700">${scoreNum} / 10</text>
        </g>
      `;
    });

    radarSvg.innerHTML = svgHtml;
  }

  // Animate Radar Chart Morphing
  function animateRadarMorph(targetScores, duration = 800) {
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // Cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      renderRadarChart(targetScores, baselineScores, ease);
      if (progress < 1.0) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Update Metric Progress Bars and Text
  function updateMetricBars(scores) {
    if (fillViewport && scoreViewport) {
      fillViewport.style.width = `${(scores[0] * 10).toFixed(0)}%`;
      scoreViewport.textContent = `${scores[0].toFixed(1)} / 10`;
    }
    if (fillContrast && scoreContrast) {
      fillContrast.style.width = `${(scores[1] * 10).toFixed(0)}%`;
      scoreContrast.textContent = `${scores[1].toFixed(1)} / 10`;
    }
    if (fillMotion && scoreMotion) {
      fillMotion.style.width = `${(scores[2] * 10).toFixed(0)}%`;
      scoreMotion.textContent = `${scores[2].toFixed(1)} / 10`;
    }
    if (fillAntislop && scoreAntislop) {
      fillAntislop.style.width = `${(scores[3] * 10).toFixed(0)}%`;
      scoreAntislop.textContent = `${scores[3].toFixed(1)} / 10`;
    }
    if (fillOptics && scoreOptics) {
      fillOptics.style.width = `${(scores[4] * 10).toFixed(0)}%`;
      scoreOptics.textContent = `${scores[4].toFixed(1)} / 10`;
    }

    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    if (metricsCompositeDisplay) metricsCompositeDisplay.textContent = `${avg} / 10.0`;
  }

  // ==========================================================================
  // Terminal Deliberation Log Engine
  // ==========================================================================
  function appendTerminalLine(lineObj) {
    logHistory.push(lineObj);

    // Filter check
    const matchesFilter = 
      currentFilter === 'all' ||
      (currentFilter === 'jester' && lineObj.agent === 'jester') ||
      (currentFilter === 'system' && (lineObj.agent === 'system' || lineObj.type === 'diff'));

    if (matchesFilter && terminalLog) {
      const lineEl = document.createElement('div');
      lineEl.className = `terminal-line line-${lineObj.agent}`;
      lineEl.innerHTML = lineObj.html;
      terminalLog.appendChild(lineEl);
      terminalLog.scrollTop = terminalLog.scrollHeight;
    }
  }

  function refilterTerminal() {
    if (!terminalLog) return;
    terminalLog.innerHTML = '';
    logHistory.forEach(lineObj => {
      const matchesFilter = 
        currentFilter === 'all' ||
        (currentFilter === 'jester' && lineObj.agent === 'jester') ||
        (currentFilter === 'system' && (lineObj.agent === 'system' || lineObj.type === 'diff'));

      if (matchesFilter) {
        const lineEl = document.createElement('div');
        lineEl.className = `terminal-line line-${lineObj.agent}`;
        lineEl.innerHTML = lineObj.html;
        terminalLog.appendChild(lineEl);
      }
    });
    terminalLog.scrollTop = terminalLog.scrollHeight;
  }

  // Set filter listeners
  if (filterAllBtn) {
    filterAllBtn.addEventListener('click', () => {
      [filterAllBtn, filterJesterBtn, filterSystemBtn].forEach(b => b.classList.remove('active'));
      filterAllBtn.classList.add('active');
      currentFilter = 'all';
      refilterTerminal();
    });
  }
  if (filterJesterBtn) {
    filterJesterBtn.addEventListener('click', () => {
      [filterAllBtn, filterJesterBtn, filterSystemBtn].forEach(b => b.classList.remove('active'));
      filterJesterBtn.classList.add('active');
      currentFilter = 'jester';
      refilterTerminal();
    });
  }
  if (filterSystemBtn) {
    filterSystemBtn.addEventListener('click', () => {
      [filterAllBtn, filterJesterBtn, filterSystemBtn].forEach(b => b.classList.remove('active'));
      filterSystemBtn.classList.add('active');
      currentFilter = 'system';
      refilterTerminal();
    });
  }
  if (clearTerminalBtn) {
    clearTerminalBtn.addEventListener('click', () => {
      logHistory = [];
      if (terminalLog) terminalLog.innerHTML = '';
      if (terminalStatus) terminalStatus.textContent = '● Deliberation console cleared.';
    });
  }

  // ==========================================================================
  // Council Size & Operating Mode Handlers
  // ==========================================================================
  function setCouncilSize(size) {
    councilSize = parseInt(size, 10);
    
    // Sync Select Dropdown
    if (councilSelect) councilSelect.value = String(councilSize);

    // Sync Pills
    sizePills.forEach(pill => {
      const pSize = parseInt(pill.getAttribute('data-size'), 10);
      if (pSize === councilSize) {
        pill.classList.add('active');
        pill.setAttribute('aria-checked', 'true');
      } else {
        pill.classList.remove('active');
        pill.setAttribute('aria-checked', 'false');
      }
    });

    // Adjust Cards Visibility & Dormancy
    if (councilSize === 3) {
      // 3 Models: Gemini, Opus, Astra active; Jester dormant!
      if (cardJester) {
        cardJester.classList.add('dormant');
        if (statusJester) {
          statusJester.textContent = 'DORMANT';
          statusJester.className = 'council-status-chip';
        }
        if (scoreJester) scoreJester.textContent = '-.-';
        if (verdictJester) verdictJester.textContent = '⚠️ Jester Dormant: Polite score inflation risk active. No adversarial contrarian checking.';
      }
      if (cardA11y) cardA11y.style.display = 'none';
      if (cardPerf) cardPerf.style.display = 'none';
    } else if (councilSize === 4) {
      // 4 Models: Standard Core + Jester
      if (cardJester) {
        cardJester.classList.remove('dormant');
        if (statusJester) {
          statusJester.textContent = 'CONCEDED';
          statusJester.className = 'council-status-chip jester-chip';
        }
        if (scoreJester) scoreJester.textContent = '9.6';
        if (verdictJester) verdictJester.textContent = '✓ Cycle 2: Mobile badge padding asymmetry resolved. Contrast certified 7.2:1. Veto retracted.';
      }
      if (cardA11y) cardA11y.style.display = 'none';
      if (cardPerf) cardPerf.style.display = 'none';
    } else if (councilSize === 5) {
      // 5 Models: Specialist + A11y
      if (cardJester) cardJester.classList.remove('dormant');
      if (cardA11y) cardA11y.style.display = 'flex';
      if (cardPerf) cardPerf.style.display = 'none';
    } else if (councilSize === 6) {
      // 6 Models: Full Gauntlet
      if (cardJester) cardJester.classList.remove('dormant');
      if (cardA11y) cardA11y.style.display = 'flex';
      if (cardPerf) cardPerf.style.display = 'flex';
    }

    appendTerminalLine({
      agent: 'system',
      type: 'info',
      html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[COUNCIL_CONFIG]</span> Council roster reconfigured: <strong style="color:var(--c-amber);">${councilSize} Models Active</strong>.`
    });
  }

  // Size pill click events
  sizePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const size = pill.getAttribute('data-size');
      setCouncilSize(size);
    });
  });

  if (councilSelect) {
    councilSelect.addEventListener('change', (e) => {
      setCouncilSize(e.target.value);
    });
  }

  // Mode Toggle click events
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      operatingMode = btn.getAttribute('data-mode');

      appendTerminalLine({
        agent: 'system',
        type: 'info',
        html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[MODE_SWITCH]</span> Operating mode set to: <strong>${operatingMode === 'builder' ? '[A] Active Co-Builders (Closed-Loop Hill-Climbing)' : '[B] Pragmatic Reviewers (Strict Read-Only Audit)'}</strong>.`
      });
    });
  });

  // ==========================================================================
  // Visual Hill-Climbing Multi-Phase Audit Simulation
  // ==========================================================================
  function clearAllTimers() {
    activeTimers.forEach(id => clearTimeout(id));
    activeTimers = [];
  }

  function runVisualHillClimbingAudit() {
    if (isAuditing) return;
    isAuditing = true;
    clearAllTimers();

    // UI State: In Progress
    if (auditBtn) {
      auditBtn.classList.add('auditing');
      const textSpan = auditBtn.querySelector('.audit-btn-text');
      if (textSpan) textSpan.textContent = 'Auditing Cloud Headless...';
    }

    if (consensusPill) {
      consensusPill.className = 'outcome-pill outcome-pill-auditing';
      consensusPill.textContent = 'AUDITING CYCLE 1 (SANDBOX CHROMIUM 390px + 1440px)...';
    }

    if (cycleBadge) {
      cycleBadge.textContent = 'Cycle 1 / 5 — Executing Dual-Viewport Perception...';
      cycleBadge.style.color = 'var(--c-ember)';
    }

    // Reset Deliberation Cards to Active/Deliberating
    [statusGemini, statusOpus, statusAstra].forEach(s => {
      if (s) {
        s.textContent = 'DELIBERATING';
        s.className = 'council-status-chip deliberating';
      }
    });

    if (statusJester && councilSize >= 4) {
      statusJester.textContent = 'HUNTING SLOP';
      statusJester.className = 'council-status-chip deliberating';
      if (cardJester) cardJester.classList.remove('veto-active');
    }

    // Reset scores to baseline during perception
    if (compositeScoreEl) compositeScoreEl.textContent = '8.20';
    if (progressBar) progressBar.style.width = '82%';
    renderRadarChart(baselineScores, baselineScores);
    updateMetricBars(baselineScores);

    if (terminalStatus) terminalStatus.textContent = '● Streaming live multi-agent deliberations...';

    // Timeline Sequence
    // T0: Sandbox microVM initialization
    appendTerminalLine({
      agent: 'system',
      type: 'info',
      html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[VERCEL_SANDBOX]</span> Provisioning microVM: Headless Chromium instance @ 1440x900 HiDPI & 390x844 Mobile Safari.`
    });

    // T + 800ms: Perceptual Diffing
    const t1 = setTimeout(() => {
      appendTerminalLine({
        agent: 'system',
        type: 'diff',
        html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[PERCEPTUAL_DIFF]</span> pixelmatch SSIM: 0.982. Extracted high-resolution bounding crop [x:42, y:180, w:120, h:36]. Payload &lt; 450 tokens.`
      });
    }, 800);
    activeTimers.push(t1);

    // T + 1600ms: Gemini 3.8 Flash High
    const t2 = setTimeout(() => {
      if (scoreGemini) scoreGemini.textContent = '9.9';
      if (statusGemini) {
        statusGemini.textContent = 'APPROVED';
        statusGemini.className = 'council-status-chip pass';
      }
      appendTerminalLine({
        agent: 'gemini',
        type: 'critique',
        html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-gemini">[GEMINI 3.8 FLASH // STRUCTURAL ARCHITECT]</span> AST verification passed: zero layout shifts; Three.js canvas mounts with &le; 0.4px registration delta against Cycles EXR poster. Score: <strong>9.9 / 10</strong>.`
      });
    }, 1600);
    activeTimers.push(t2);

    // T + 2400ms: Claude Opus 5.5
    const t3 = setTimeout(() => {
      if (scoreOpus) scoreOpus.textContent = '9.8';
      if (statusOpus) {
        statusOpus.textContent = 'APPROVED';
        statusOpus.className = 'council-status-chip pass';
      }
      appendTerminalLine({
        agent: 'opus',
        type: 'critique',
        html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-opus">[CLAUDE OPUS 5.5 // SPACING JUDGE]</span> Outer card bounding geometry verified: concentric rule r_inner = r_card - p holds true (20px - 6px = 14px). Tone steps calibrated. Score: <strong>9.8 / 10</strong>.`
      });
    }, 2400);
    activeTimers.push(t3);

    // T + 3200ms: GPT-6 Astra
    const t4 = setTimeout(() => {
      if (scoreAstra) scoreAstra.textContent = '10.0';
      if (statusAstra) {
        statusAstra.textContent = 'APPROVED';
        statusAstra.className = 'council-status-chip pass';
      }
      appendTerminalLine({
        agent: 'astra',
        type: 'critique',
        html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-astra">[GPT-6 ASTRA // COPY TRUTH]</span> Audited 150-word contract: hero headline is 5 words (&le;6 budget). Zero generic AI marketing buzzwords or empty filler detected. Score: <strong>10.0 / 10</strong>.`
      });
    }, 3200);
    activeTimers.push(t4);

    // T + 4000ms: The Adversarial Jester Stinging Critique & HARD VETO!
    const t5 = setTimeout(() => {
      if (councilSize >= 4) {
        if (scoreJester) scoreJester.textContent = '8.4';
        if (statusJester) {
          statusJester.textContent = 'VETO ACTIVE';
          statusJester.className = 'council-status-chip veto';
        }
        if (cardJester) cardJester.classList.add('veto-active');
        if (verdictJester) verdictJester.textContent = '⚠️ VETO ACTIVE: Mobile badge padding asymmetric on 390px (8px left vs 14px right). Subtext contrast dips to 4.2:1 in ambient mode.';

        if (consensusPill) {
          consensusPill.className = 'outcome-pill outcome-pill-failed';
          consensusPill.textContent = 'CYCLE 1: FAILED (8.4/10) - 1 JESTER VETO (Mobile Badge Asymmetry)';
        }

        if (compositeScoreEl) compositeScoreEl.textContent = '8.40';
        if (progressBar) progressBar.style.width = '84%';
        if (metricsVetoDisplay) {
          metricsVetoDisplay.textContent = '⚠️ 1 Active Jester Veto';
          metricsVetoDisplay.style.color = '#ef4444';
        }

        appendTerminalLine({
          agent: 'jester',
          type: 'critique',
          html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-jester">[THE JESTER // ADVERSARIAL CRITIC]</span> <span class="t-veto">HARD VETO FIRED</span> STOP CELEBRATING! You all succumbed to polite consensus bias! Look at the 390px mobile capture: the status badge has 8px left padding vs 14px right padding (6px asymmetry!). In high-ambient viewport mode, subtext contrast dips to 4.2:1 (&lt; 4.5:1 AA limit). VETO ACTIVE. Score: <strong>8.4 / 10</strong>.`
        });
      } else {
        // 3 Models (No Jester) -> Premature inflated consensus warning
        appendTerminalLine({
          agent: 'system',
          type: 'info',
          html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[COUNCIL_WARNING]</span> 3-Agent Council completed with cooperative consensus. Jester absent; subtle visual clipping was not hunted.`
        });
      }
    }, 4000);
    activeTimers.push(t5);

    // T + 5000ms: Visual Hill-Climbing Loop & Atomic Patch
    const t6 = setTimeout(() => {
      if (operatingMode === 'builder' && councilSize >= 4) {
        if (cycleBadge) {
          cycleBadge.textContent = 'Cycle 2 / 5 — Synthesizing Atomic Diff...';
          cycleBadge.style.color = 'var(--c-amber)';
        }

        appendTerminalLine({
          agent: 'system',
          type: 'diff',
          html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[HILL_CLIMBING_LOOP]</span> Jester veto active (8.4 &lt; 9.5 threshold). Synthesizing atomic surgical CSS patch: '.tone-badge { padding: 0.4rem 0.85rem; }' + '--t-secondary: #94a3b8 (7.18:1 contrast)'.`
        });

        // T + 5800ms: Jester Re-evaluation & Concession
        const t7 = setTimeout(() => {
          if (scoreJester) scoreJester.textContent = '9.6';
          if (statusJester) {
            statusJester.textContent = 'CONCEDED';
            statusJester.className = 'council-status-chip jester-chip';
          }
          if (cardJester) cardJester.classList.remove('veto-active');
          if (verdictJester) verdictJester.textContent = '✓ Cycle 2: Mobile badge padding normalized to 12px symmetric. Contrast certified 7.18:1. Veto retracted.';

          appendTerminalLine({
            agent: 'jester',
            type: 'critique',
            html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-jester">[THE JESTER // ADVERSARIAL CRITIC]</span> Re-inspecting 400x300 bounded crop... Padding is now precisely 12px symmetric. Contrast measured at 7.18:1 on #0a0b0e (exceeds WCAG AA). Unbelievable, you actually fixed it. Hard veto retracted with extreme reluctance. Score: <strong class="t-pass">9.6 / 10</strong>.`
          });

          // T + 6500ms: Convergence & Democratic Consensus
          const t8 = setTimeout(() => {
            finishConvergence();
          }, 700);
          activeTimers.push(t8);

        }, 900);
        activeTimers.push(t7);

      } else {
        // Read-only mode: stops at Veto or passes
        const t7 = setTimeout(() => {
          if (councilSize >= 4) {
            if (consensusPill) {
              consensusPill.className = 'outcome-pill outcome-pill-failed';
              consensusPill.textContent = 'AUDIT REJECTED (1 ACTIVE JESTER VETO - READ ONLY)';
            }
            appendTerminalLine({
              agent: 'system',
              type: 'info',
              html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[READ_ONLY_AUDIT]</span> Completed in Read-Only Mode. Production release BLOCKED due to active Jester veto.`
            });
            finalizeAuditUI();
          } else {
            finishConvergence();
          }
        }, 800);
        activeTimers.push(t7);
      }
    }, 5000);
    activeTimers.push(t6);
  }

  // Convergence Finale
  function finishConvergence() {
    const finalScores = [9.8, 10.0, 9.9, 10.0, 9.6];
    currentScores = finalScores;

    if (consensusPill) {
      consensusPill.className = 'outcome-pill outcome-pill-converged';
      if (councilSize === 3) {
        consensusPill.textContent = 'CONVERGED (3/3 CONSENSUS - JESTER DORMANT)';
      } else if (councilSize === 4) {
        consensusPill.textContent = 'CONVERGED (3/4 CONSENSUS + 1 JESTER DISSENT)';
      } else if (councilSize === 5) {
        consensusPill.textContent = 'CONVERGED (4/5 CONSENSUS + 1 JESTER DISSENT)';
      } else {
        consensusPill.textContent = 'CONVERGED (5/6 CONSENSUS + 1 JESTER DISSENT)';
      }
    }

    if (compositeScoreEl) compositeScoreEl.textContent = '9.86';
    if (progressBar) progressBar.style.width = '98.6%';
    if (cycleBadge) {
      cycleBadge.textContent = 'Cycle 2 / 5 — Converged in 2 Iterations';
      cycleBadge.style.color = 'var(--c-amber)';
    }

    if (metricsVetoDisplay) {
      metricsVetoDisplay.textContent = '✓ Zero Active Vetoes';
      metricsVetoDisplay.style.color = '#10b981';
    }

    // Animate Radar Chart & Metric Bars
    animateRadarMorph(finalScores, 700);
    updateMetricBars(finalScores);

    appendTerminalLine({
      agent: 'system',
      type: 'info',
      html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[DEMOCRACY_BUS]</span> Composite Score: <strong class="t-pass">9.86 / 10.0</strong> (Threshold &ge; 9.5 exceeded). JESTER VETOES: 0. DEMOCRATIC OUTCOME: <strong style="color:#10b981;">CONVERGED (3/4 CONSENSUS + 1 JESTER DISSENT)</strong>. Production release approved!`
    });

    finalizeAuditUI();
  }

  function finalizeAuditUI() {
    isAuditing = false;
    if (auditBtn) {
      auditBtn.classList.remove('auditing');
      const textSpan = auditBtn.querySelector('.audit-btn-text');
      if (textSpan) textSpan.textContent = 'Initiate Visual Hill-Climbing Audit';
    }
    if (terminalStatus) {
      terminalStatus.textContent = '● Audit run finished. Threshold converged >= 9.5 / 10.0.';
    }
  }

  // Fast-Forward to Converged State
  function fastForwardAudit() {
    clearAllTimers();
    if (auditBtn) auditBtn.classList.remove('auditing');
    
    // Jump straight to converged state
    if (scoreGemini) scoreGemini.textContent = '9.9';
    if (statusGemini) { statusGemini.textContent = 'APPROVED'; statusGemini.className = 'council-status-chip pass'; }

    if (scoreOpus) scoreOpus.textContent = '9.8';
    if (statusOpus) { statusOpus.textContent = 'APPROVED'; statusOpus.className = 'council-status-chip pass'; }

    if (scoreAstra) scoreAstra.textContent = '10.0';
    if (statusAstra) { statusAstra.textContent = 'APPROVED'; statusAstra.className = 'council-status-chip pass'; }

    if (councilSize >= 4) {
      if (scoreJester) scoreJester.textContent = '9.6';
      if (statusJester) { statusJester.textContent = 'CONCEDED'; statusJester.className = 'council-status-chip jester-chip'; }
      if (cardJester) cardJester.classList.remove('veto-active');
      if (verdictJester) verdictJester.textContent = '✓ Cycle 2: Mobile badge padding normalized to 12px symmetric. Contrast certified 7.18:1. Veto retracted.';
    }

    if (cardA11y && scoreA11y) scoreA11y.textContent = '10.0';
    if (cardPerf && scorePerf) scorePerf.textContent = '9.9';

    finishConvergence();

    appendTerminalLine({
      agent: 'system',
      type: 'info',
      html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-system">[FAST_FORWARD]</span> Simulation fast-forwarded to final converged state (&ge; 9.5 / 10.0).`
    });
  }

  // Audit Button Click Listener
  auditBtn.addEventListener('click', () => {
    runVisualHillClimbingAudit();
  });

  if (fastForwardBtn) {
    fastForwardBtn.addEventListener('click', () => {
      fastForwardAudit();
    });
  }

  // Initialize initial radar chart & metric bars
  renderRadarChart(currentScores, baselineScores);
  updateMetricBars(currentScores);
  setCouncilSize(4);

  // Initial log entries
  appendTerminalLine({
    agent: 'gemini',
    type: 'critique',
    html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-gemini">[GEMINI 3.8 FLASH]</span> Probing 12,000 particles at 60 FPS. Top-to-bottom descending Y-axis sorting verified.`
  });
  appendTerminalLine({
    agent: 'opus',
    type: 'critique',
    html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-opus">[CLAUDE OPUS 5.5]</span> Ethiopic typography clamp scaling verified at 5.8rem on desktop and 2.4rem on mobile.`
  });
  appendTerminalLine({
    agent: 'astra',
    type: 'critique',
    html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-astra">[GPT-6 ASTRA]</span> SunChips flavour world tokens applied: [data-flavour="ember"] loaded with 18.8:1 contrast.`
  });
  appendTerminalLine({
    agent: 'jester',
    type: 'critique',
    html: `<span class="t-time">${getLogTimestamp()}</span> <span class="t-jester">[THE JESTER]</span> Inspected Apple Tahoe liquid glass: SVG feDisplacementMap active with text on isolated layer. Pass!`
  });

  // Expose global methods
  window.refreshCouncilStage = () => {
    renderRadarChart(currentScores, baselineScores);
  };
  window.runCouncilAudit = runVisualHillClimbingAudit;
}

export { initCouncilDemocracy as initCouncilChamber };

