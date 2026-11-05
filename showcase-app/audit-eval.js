export async function runAudit() {
  // 1. Activate Blender Tab first
  const tabBlender = document.getElementById('tab-blender');
  if (tabBlender) {
    tabBlender.click();
  } else {
    const s = document.getElementById('section-blender');
    if (s) s.style.display = 'block';
  }

  // Small delay to let rendering & reflow settle
  await new Promise(r => setTimeout(r, 600));

  const docEl = document.documentElement;
  const docWidth = docEl.clientWidth;
  const docScrollWidth = docEl.scrollWidth;

  const report = {
    viewport: {
      clientWidth: docWidth,
      scrollWidth: docScrollWidth,
      zeroOverflow: docScrollWidth === docWidth
    },
    overflowingElements: [],
    phase5TouchTargets: [],
    phase5Grids: [],
    tableWrapper: null,
    adobeHub: null,
    riggingPipeline: null
  };

  // Check all elements in DOM for horizontal overflow (excluding safe overflow-x: auto containers)
  const allElements = document.querySelectorAll('#section-blender, #section-blender *');
  allElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > docWidth + 0.5) {
      let parent = el.parentElement;
      let isInsideScrollable = false;
      while (parent && parent !== document.body) {
        const pStyle = window.getComputedStyle(parent);
        if (pStyle.overflowX === 'auto' || pStyle.overflowX === 'scroll') {
          isInsideScrollable = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (!isInsideScrollable) {
        report.overflowingElements.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          rectRight: Math.round(rect.right),
          rectWidth: Math.round(rect.width),
          docWidth: docWidth,
          overflowPx: Math.round(rect.right - docWidth)
        });
      }
    }
  });

  // Touch targets in Section Blender
  const targetSelectors = [
    { sel: '#download-glb-btn', name: 'Export GLB Button' },
    { sel: '#toggle-wireframe-btn', name: 'Wireframe Toggle Button' },
    { sel: '#simulate-bpy-render-btn', name: 'Simulate Cycles Render Button' },
    { sel: '#copy-bpy-script-btn', name: 'Copy bpy Script Button' },
    { sel: '#copy-rigging-script-btn', name: 'Copy Rigging Script Button' },
    { sel: '#adobe-sim-btn', name: 'Adobe Simulate Run Button' },
    { sel: '#adobe-copy-code-btn', name: 'Adobe Copy Code Button' }
  ];

  targetSelectors.forEach(({ sel, name }) => {
    const el = document.querySelector(sel);
    if (el) {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      report.phase5TouchTargets.push({
        selector: sel,
        name,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        minHeight: style.minHeight,
        minWidth: style.minWidth,
        pass44: rect.width >= 44 && rect.height >= 44
      });
    } else {
      report.phase5TouchTargets.push({
        selector: sel,
        name,
        missing: true
      });
    }
  });

  // Mesh buttons
  document.querySelectorAll('.blender-mesh-btn').forEach((btn, idx) => {
    const rect = btn.getBoundingClientRect();
    const style = window.getComputedStyle(btn);
    report.phase5TouchTargets.push({
      selector: `.blender-mesh-btn[${idx}]`,
      name: `Mesh Preset: ${btn.textContent.trim()}`,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      minHeight: style.minHeight,
      pass44: rect.width >= 44 && rect.height >= 44
    });
  });

  // Physics preset buttons
  document.querySelectorAll('.blender-physics-btn').forEach((btn, idx) => {
    const rect = btn.getBoundingClientRect();
    const style = window.getComputedStyle(btn);
    report.phase5TouchTargets.push({
      selector: `.blender-physics-btn[${idx}]`,
      name: `Physics Preset: ${btn.textContent.trim()}`,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      minHeight: style.minHeight,
      pass44: rect.width >= 44 && rect.height >= 44
    });
  });

  // Rigging pipeline tabs
  document.querySelectorAll('.rigging-nav-tab').forEach((tab, idx) => {
    const rect = tab.getBoundingClientRect();
    const style = window.getComputedStyle(tab);
    report.phase5TouchTargets.push({
      selector: `.rigging-nav-tab[${idx}]`,
      name: `Rigging Tab: ${tab.textContent.trim()}`,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      minHeight: style.minHeight,
      pass44: rect.width >= 44 && rect.height >= 44
    });
  });

  // Zone buttons
  document.querySelectorAll('.zone-btn').forEach((btn, idx) => {
    const rect = btn.getBoundingClientRect();
    const style = window.getComputedStyle(btn);
    report.phase5TouchTargets.push({
      selector: `.zone-btn[${idx}]`,
      name: `Zone Btn: ${btn.textContent.trim()}`,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      minHeight: style.minHeight,
      pass44: rect.width >= 44 && rect.height >= 44
    });
  });

  // Adobe tab buttons
  document.querySelectorAll('.adobe-tab-btn').forEach((tab, idx) => {
    const rect = tab.getBoundingClientRect();
    const style = window.getComputedStyle(tab);
    report.phase5TouchTargets.push({
      selector: `.adobe-tab-btn[${idx}]`,
      name: `Adobe Tab: ${tab.textContent.trim()}`,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      minHeight: style.minHeight,
      pass44: rect.width >= 44 && rect.height >= 44
    });
  });

  // Grid checks
  const gridSelectors = [
    { sel: '.blender-workbench-grid', name: 'Blender Workbench Grid' },
    { sel: '.rigging-cards-grid', name: 'Rigging Cards Grid' },
    { sel: '.bone-visualizer-grid', name: 'Bone Visualizer Grid' },
    { sel: '.adobe-workbench-grid', name: 'Adobe Workbench Grid' }
  ];

  gridSelectors.forEach(({ sel, name }) => {
    const el = document.querySelector(sel);
    if (el) {
      const style = window.getComputedStyle(el);
      const cols = style.gridTemplateColumns;
      // Count column tracks
      const trackCount = cols.split(' ').filter(Boolean).length;
      report.phase5Grids.push({
        selector: sel,
        name,
        display: style.display,
        gridTemplateColumns: cols,
        trackCount,
        isSingleColumn: trackCount === 1
      });
    }
  });

  // Table wrapper check
  const boneTable = document.querySelector('.bone-matrix-table');
  if (boneTable) {
    const wrapper = boneTable.parentElement;
    const wrapStyle = window.getComputedStyle(wrapper);
    report.tableWrapper = {
      overflowX: wrapStyle.overflowX,
      wrapperWidth: Math.round(wrapper.getBoundingClientRect().width),
      tableWidth: Math.round(boneTable.getBoundingClientRect().width),
      hasTouchScrolling: wrapStyle.webkitOverflowScrolling || 'auto',
      isWrappedSafely: wrapStyle.overflowX === 'auto' || wrapStyle.overflowX === 'scroll'
    };
  }

  return report;
}
window.runAudit = runAudit;
