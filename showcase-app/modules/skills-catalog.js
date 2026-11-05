/**
 * Skills Catalog & Interactive Directory Engine (2026 Edition)
 * Creative Engineering Encyclopedia · Leul Tewelde
 */

import { SKILLS_DATA } from '../skills-data.js';

// Map skill IDs to primary engineering domain
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
    return 'spatial';
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
    return 'motion';
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
    return 'design';
  }

  return 'automation';
}

const DOMAIN_LABELS = {
  spatial: '3D & WebGL',
  motion: 'Motion & Physics',
  design: 'Design Systems',
  automation: 'Creative Automation'
};

export function initSkillsCatalog() {
  const grid = document.getElementById('skills-grid');
  const searchInput = document.getElementById('catalog-search');
  const countEl = document.getElementById('catalog-count');
  const filterTabs = document.querySelectorAll('.filter-tab');

  const modal = document.getElementById('skill-modal');
  const modalTitle = document.getElementById('modal-skill-title');
  const modalCat = document.getElementById('modal-skill-category');
  const modalDesc = document.getElementById('modal-skill-desc');
  const modalCode = document.getElementById('modal-skill-code');
  const modalGithub = document.getElementById('modal-github-link');
  const modalClose = document.getElementById('modal-close');
  const modalCopyBtn = document.getElementById('modal-copy-btn');

  if (!grid) return;

  let currentCategory = 'all';
  let currentQuery = '';

  // Enrich skill data with domain tags
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
        (DOMAIN_LABELS[s.domain] && DOMAIN_LABELS[s.domain].toLowerCase().includes(q))
      );
    });

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${enrichedSkills.length} skills`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-state">
          <p class="empty-title">No matching skills located</p>
          <p class="empty-sub">Try searching for terms like "blender", "threejs", "gsap", or "typography".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((skill) => `
      <article class="skill-catalog-card" data-skill-id="${escapeHtml(skill.id)}">
        <div class="card-head">
          <span class="card-domain-tag">${escapeHtml(DOMAIN_LABELS[skill.domain] || 'ENGINEERING')}</span>
          <span class="card-idx">#${skill.indexStr}</span>
        </div>
        <h3 class="skill-card-title">${escapeHtml(skill.name)}</h3>
        <p class="skill-card-desc">${escapeHtml(skill.description || 'Production creative engineering specification.')}</p>
        
        <div class="skill-card-actions">
          <button class="action-inspect-btn" data-inspect-id="${escapeHtml(skill.id)}" aria-label="Inspect execution pattern for ${escapeHtml(skill.name)}">Inspect</button>
          <a href="https://github.com/LeulTew/skills/blob/main/${encodeURIComponent(skill.id)}/SKILL.md" target="_blank" rel="noopener noreferrer" class="action-github-link" aria-label="Open ${escapeHtml(skill.name)} in repository">
            <span>Repo</span>
            <span class="arrow" aria-hidden="true">&nearr;</span>
          </a>
        </div>
      </article>
    `).join('');

    // Wire up inspect buttons
    grid.querySelectorAll('.action-inspect-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-inspect-id');
        const found = enrichedSkills.find((s) => s.id === id);
        if (found) openModal(found);
      });
    });
  }

  function openModal(skill) {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = skill.name;
    if (modalCat) modalCat.textContent = DOMAIN_LABELS[skill.domain] || 'ENGINEERING';
    if (modalDesc) modalDesc.textContent = skill.description || '';
    if (modalCode) modalCode.textContent = skill.codeSnippet || `# Execution pattern for ${skill.id}\nnode tools/run.mjs --skill ${skill.id}`;
    if (modalGithub) {
      modalGithub.href = `https://github.com/LeulTew/skills/blob/main/${encodeURIComponent(skill.id)}/SKILL.md`;
    }
    if (modalCopyBtn) {
      modalCopyBtn.textContent = 'Copy';
      modalCopyBtn.classList.remove('copied');
    }

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value;
      render();
    });
  }

  // Category Filter Tabs
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      currentCategory = cat || 'all';

      filterTabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      render();
    });
  });

  // Modal Close Listeners
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.open) {
      closeModal();
    }
  });

  // Copy Code to Clipboard
  if (modalCopyBtn && modalCode) {
    modalCopyBtn.addEventListener('click', async () => {
      try {
        const text = modalCode.textContent;
        await navigator.clipboard.writeText(text);
        modalCopyBtn.textContent = 'Copied!';
        modalCopyBtn.classList.add('copied');
        setTimeout(() => {
          modalCopyBtn.textContent = 'Copy';
          modalCopyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        modalCopyBtn.textContent = 'Failed';
      }
    });
  }

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
