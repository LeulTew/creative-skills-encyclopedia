/**
 * Skills Catalog & Interactive Directory Engine (2026 Edition)
 * Creative Engineering Encyclopedia · Leul Tewelde
 */

import { SKILLS_DATA } from '../skills-data.js';

function categorizeSkill(skill) {
  const id = (skill.id || '').toLowerCase();
  const cat = (skill.category || '').toLowerCase();

  if (
    id.includes('3d') ||
    id.includes('blender') ||
    id.includes('threejs') ||
    id.includes('particle') ||
    id.includes('webgpu') ||
    id.includes('shader') ||
    cat.includes('3d')
  ) {
    return '3D & WebGL';
  }

  if (
    id.includes('motion') ||
    id.includes('gsap') ||
    id.includes('lenis') ||
    id.includes('spring') ||
    id.includes('liquid') ||
    id.includes('touch') ||
    id.includes('reactbits') ||
    cat.includes('motion')
  ) {
    return 'Motion & Physics';
  }

  if (
    id.includes('design') ||
    id.includes('award') ||
    id.includes('theme') ||
    id.includes('brand') ||
    id.includes('taste') ||
    id.includes('brutalist') ||
    id.includes('minimalist') ||
    id.includes('frontier') ||
    cat.includes('design')
  ) {
    return 'Design Systems';
  }

  return 'Creative Automation';
}

export function initSkillsCatalog() {
  const grid = document.getElementById('skills-grid');
  const searchInput = document.getElementById('skill-search-input') || document.getElementById('catalog-search');
  const countEl = document.getElementById('skill-counter') || document.getElementById('catalog-count');
  const filterTabs = document.querySelectorAll('.tab-btn, .filter-tab');

  if (!grid) return;

  let currentCategory = 'all';
  let currentQuery = '';

  const enrichedSkills = (SKILLS_DATA || []).map((s, idx) => ({
    ...s,
    domain: categorizeSkill(s),
    indexStr: String(idx + 1).padStart(2, '0')
  }));

  function render() {
    const q = currentQuery.trim().toLowerCase();
    const filtered = enrichedSkills.filter((s) => {
      const matchCat = currentCategory === 'all' || s.domain === currentCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.badge && s.badge.toLowerCase().includes(q)) ||
        (s.domain && s.domain.toLowerCase().includes(q))
      );
    });

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${enrichedSkills.length} skills`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-state" style="grid-column: 1 / -1; padding: 3rem; text-align: center; color: var(--t-muted);">
          <p style="font-family: var(--font-display); font-size: 1.2rem; color: var(--t-primary); margin-bottom: 0.5rem;">No matching skills located</p>
          <p style="font-size: 0.88rem;">Try searching for "blender", "threejs", "gsap", or "shaders".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((skill) => {
      const rawCode = skill.codeSnippet || `# Skill execution pattern: ${skill.id}\nnode tools/run.mjs --skill ${skill.id}`;
      const code = rawCode.replace(/\s\/\/\s/g, ' # ');
      const escapedCode = escapeHtml(code);

      return `
        <article class="skill-card" data-skill-id="${escapeHtml(skill.id)}">
          <div>
            <div class="skill-card-header">
              <span class="skill-badge">${escapeHtml(skill.badge || 'PRODUCTION')}</span>
              <span class="skill-category">${escapeHtml(skill.domain)} &bull; #${skill.indexStr}</span>
            </div>
            <h3 class="skill-name">${escapeHtml(skill.name)}</h3>
            <p class="skill-desc">${escapeHtml(skill.description || 'Production creative engineering specification.')}</p>
            
            <div class="skill-code-box">
              <pre><code>${escapedCode}</code></pre>
            </div>
          </div>

          <div class="skill-footer">
            <a href="https://github.com/LeulTew/skills/blob/main/${encodeURIComponent(skill.id)}/SKILL.md" target="_blank" rel="noopener noreferrer" class="skill-link" aria-label="Open ${escapeHtml(skill.name)} in repository">
              <span>View in Repository</span>
              <span class="arrow" aria-hidden="true">&nearr;</span>
            </a>
            <button class="copy-cmd-btn" data-copy="${encodeURIComponent(code)}" aria-label="Copy snippet for ${escapeHtml(skill.name)}">Copy Snippet</button>
          </div>
        </article>
      `;
    }).join('');

    // Wire up copy snippet buttons
    grid.querySelectorAll('.copy-cmd-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const rawCode = decodeURIComponent(btn.getAttribute('data-copy'));
        try {
          await navigator.clipboard.writeText(rawCode);
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy Snippet'; }, 2000);
        } catch (e) {
          btn.textContent = 'Copied';
        }
      });
    });
  }

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value;
      render();
    });
  }

  // Category filter tabs
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      currentCategory = cat || 'all';

      filterTabs.forEach((t) => {
        const isMatch = (t.getAttribute('data-category') === cat);
        t.classList.toggle('active', isMatch);
        t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      render();
    });
  });

  // Initial render
  render();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
