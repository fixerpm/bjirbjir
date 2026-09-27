/**
 * OSON PRAVA — Road Signs Interactive System
 * Dynamic SVG visual generation, category filtering, search, and detail modal
 */

window.OSON_SIGNS = (function() {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';

  // Generate crisp, standardized SVG vector graphic for each sign
  function getSignSvg(sign) {
    const s = sign.shape;

    if (s === 'triangle-red') {
      return `
        <svg viewBox="0 0 100 90" class="w-full h-full drop-shadow-sm">
          <polygon points="50,6 94,84 6,84" fill="#FFFFFF" stroke="#DC2626" stroke-width="10" stroke-linejoin="round"/>
          <g transform="translate(50, 56) scale(0.9)">
            <text text-anchor="middle" dominant-baseline="central" font-family="Arial" font-size="28" font-weight="900" fill="#1E293B">!</text>
          </g>
        </svg>
      `;
    }

    if (s === 'diamond-yellow') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <rect x="15" y="15" width="60" height="60" transform="rotate(45 45 45)" fill="#FACC15" stroke="#FFFFFF" stroke-width="6" rx="4"/>
          <rect x="22" y="22" width="46" height="46" transform="rotate(45 45 45)" fill="#FACC15" stroke="#1E293B" stroke-width="2" rx="2"/>
        </svg>
      `;
    }

    if (s === 'triangle-inverted') {
      return `
        <svg viewBox="0 0 100 90" class="w-full h-full drop-shadow-sm">
          <polygon points="6,10 94,10 50,84" fill="#FFFFFF" stroke="#DC2626" stroke-width="10" stroke-linejoin="round"/>
        </svg>
      `;
    }

    if (s === 'octagon-red') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <polygon points="26,4 64,4 86,26 86,64 64,86 26,86 4,64 4,26" fill="#DC2626" stroke="#FFFFFF" stroke-width="3"/>
          <text x="45" y="53" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF">STOP</text>
        </svg>
      `;
    }

    if (s === 'circle-rose-brick') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="41" fill="#DC2626" stroke="#FFFFFF" stroke-width="3"/>
          <rect x="18" y="38" width="54" height="14" rx="2" fill="#FFFFFF"/>
        </svg>
      `;
    }

    if (s === 'circle-rose-empty') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="40" fill="#FFFFFF" stroke="#DC2626" stroke-width="10"/>
        </svg>
      `;
    }

    if (s === 'circle-rose-speed') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="40" fill="#FFFFFF" stroke="#DC2626" stroke-width="10"/>
          <text x="45" y="54" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="28" font-weight="800" fill="#0F172A">60</text>
        </svg>
      `;
    }

    if (s === 'circle-rose-cross') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="40" fill="#2563EB" stroke="#DC2626" stroke-width="10"/>
          <line x1="16" y1="16" x2="74" y2="74" stroke="#DC2626" stroke-width="8"/>
          <line x1="74" y1="16" x2="16" y2="74" stroke="#DC2626" stroke-width="8"/>
        </svg>
      `;
    }

    if (s === 'circle-rose-slash') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="40" fill="#2563EB" stroke="#DC2626" stroke-width="10"/>
          <line x1="74" y1="16" x2="16" y2="74" stroke="#DC2626" stroke-width="8"/>
        </svg>
      `;
    }

    if (s === 'circle-rose-doublecar') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="40" fill="#FFFFFF" stroke="#DC2626" stroke-width="10"/>
          <rect x="22" y="38" width="22" height="14" rx="3" fill="#DC2626"/>
          <rect x="46" y="38" width="22" height="14" rx="3" fill="#0F172A"/>
        </svg>
      `;
    }

    if (s === 'circle-blue-arrow-up') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="41" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
          <path d="M45,18 L62,38 L50,38 L50,70 L40,70 L40,38 L28,38 Z" fill="#FFFFFF"/>
        </svg>
      `;
    }

    if (s === 'circle-blue-arrow-right') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="41" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
          <path d="M72,45 L52,28 L52,40 L20,40 L20,50 L52,50 L52,62 Z" fill="#FFFFFF"/>
        </svg>
      `;
    }

    if (s === 'circle-blue-roundabout') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <circle cx="45" cy="45" r="41" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
          <circle cx="45" cy="45" r="22" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="25 10"/>
          <polygon points="45,16 52,24 40,24" fill="#FFFFFF"/>
          <polygon points="68,52 64,62 56,52" fill="#FFFFFF"/>
          <polygon points="26,58 22,48 32,50" fill="#FFFFFF"/>
        </svg>
      `;
    }

    if (s === 'square-green-highway') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <rect x="4" y="4" width="82" height="82" rx="10" fill="#15803D" stroke="#FFFFFF" stroke-width="3"/>
          <line x1="28" y1="20" x2="28" y2="70" stroke="#FFFFFF" stroke-width="6"/>
          <line x1="62" y1="20" x2="62" y2="70" stroke="#FFFFFF" stroke-width="6"/>
          <path d="M18,46 C32,38 58,38 72,46" stroke="#FFFFFF" stroke-width="5" fill="none"/>
        </svg>
      `;
    }

    if (s === 'square-blue-oneway') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <rect x="4" y="4" width="82" height="82" rx="8" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
          <path d="M45,18 L60,38 L50,38 L50,72 L40,72 L40,38 L30,38 Z" fill="#FFFFFF"/>
        </svg>
      `;
    }

    if (s === 'square-blue-parking') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <rect x="4" y="4" width="82" height="82" rx="8" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
          <text x="45" y="62" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF">P</text>
        </svg>
      `;
    }

    if (s === 'square-blue-pedestrian') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <rect x="4" y="4" width="82" height="82" rx="8" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
          <polygon points="45,16 80,74 10,74" fill="#FFFFFF"/>
          <circle cx="45" cy="36" r="4" fill="#0F172A"/>
          <line x1="45" y1="40" x2="45" y2="58" stroke="#0F172A" stroke-width="4"/>
          <line x1="45" y1="46" x2="36" y2="52" stroke="#0F172A" stroke-width="3"/>
          <line x1="45" y1="46" x2="54" y2="50" stroke="#0F172A" stroke-width="3"/>
          <line x1="45" y1="58" x2="38" y2="70" stroke="#0F172A" stroke-width="4"/>
          <line x1="45" y1="58" x2="52" y2="70" stroke="#0F172A" stroke-width="4"/>
        </svg>
      `;
    }

    if (s === 'rect-blue-medical') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <rect x="6" y="6" width="78" height="78" rx="6" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
          <rect x="16" y="16" width="58" height="58" rx="4" fill="#FFFFFF"/>
          <rect x="39" y="26" width="12" height="38" rx="2" fill="#DC2626"/>
          <rect x="26" y="39" width="38" height="12" rx="2" fill="#DC2626"/>
        </svg>
      `;
    }

    if (s === 'rect-blue-gas' || s === 'rect-blue-wrench') {
      return `
        <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
          <rect x="6" y="6" width="78" height="78" rx="6" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
          <rect x="16" y="16" width="58" height="58" rx="4" fill="#FFFFFF"/>
          <circle cx="45" cy="45" r="16" fill="#E0F2FE"/>
          <text x="45" y="52" text-anchor="middle" font-family="Arial" font-size="20" fill="#0284C7">🛠</text>
        </svg>
      `;
    }

    // Default Fallback
    return `
      <svg viewBox="0 0 90 90" class="w-full h-full drop-shadow-sm">
        <rect x="6" y="6" width="78" height="78" rx="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="3"/>
        <text x="45" y="52" text-anchor="middle" font-size="18" font-weight="700" fill="#475569">${sign.code}</text>
      </svg>
    `;
  }

  // Render Signs Grid
  function renderSigns() {
    const container = document.getElementById('signs-grid');
    const emptyState = document.getElementById('signs-empty-state');
    const countBadge = document.getElementById('signs-count-badge');
    if (!container) return;

    const allSigns = window.OSON_DATA.signs;
    const query = searchQuery.trim().toLowerCase();

    const filtered = allSigns.filter(sign => {
      const matchCategory = currentCategory === 'all' || sign.category === currentCategory;
      const matchSearch =
        !query ||
        sign.name.toLowerCase().includes(query) ||
        sign.code.toLowerCase().includes(query) ||
        sign.desc.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ta belgi`;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = filtered.map(sign => {
      const isFav = window.OSON_STORAGE.isFavorite(sign.id);
      return `
        <div class="sign-card bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm card-hover flex flex-col justify-between relative group cursor-pointer transition-all"
             onclick="window.OSON_SIGNS.openSignModal('${sign.id}')">
          
          <div class="flex items-start justify-between gap-3 mb-4">
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              ${sign.code}
            </span>
            <button type="button" 
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
                    onclick="event.stopPropagation(); window.OSON_SIGNS.toggleFav('${sign.id}', this)"
                    title="Sevimlilarga qo‘shish">
              <i class="${isFav ? 'fa-solid text-amber-500' : 'fa-regular'} fa-star"></i>
            </button>
          </div>

          <div class="flex flex-col items-center text-center my-2">
            <div class="sign-box mb-4">
              ${getSignSvg(sign)}
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              ${sign.name}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              ${sign.desc}
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>${sign.categoryName.split(' ')[0]}</span>
            <span class="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Batafsil <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open Sign Detail Modal
  function openSignModal(signId) {
    const sign = window.OSON_DATA.signs.find(s => s.id === signId);
    if (!sign) return;

    const modal = document.getElementById('sign-detail-modal');
    const modalContent = document.getElementById('sign-modal-body');
    if (!modal || !modalContent) return;

    const isFav = window.OSON_STORAGE.isFavorite(sign.id);

    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div class="w-32 h-32 flex-shrink-0 flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          ${getSignSvg(sign)}
        </div>
        <div class="flex-1 text-left">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
              Belgi ${sign.code}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              ${sign.categoryName}
            </span>
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
            ${sign.name}
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            ${sign.desc}
          </p>
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <div class="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
          <h4 class="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
            <i class="fa-solid fa-circle-info"></i> Qoidadagi ma’nosi va talabi
          </h4>
          <p class="text-sm text-slate-700 dark:text-slate-300">
            ${sign.meaning}
          </p>
        </div>

        <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
          <h4 class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
            <i class="fa-solid fa-lightbulb"></i> Amaliy hayotdagi misol
          </h4>
          <p class="text-sm text-slate-700 dark:text-slate-300">
            ${sign.example}
          </p>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <button type="button" 
                class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                onclick="window.OSON_SIGNS.toggleFav('${sign.id}', this)">
          <i class="${isFav ? 'fa-solid text-amber-500' : 'fa-regular'} fa-star"></i>
          <span>${isFav ? 'Sevimlilardan o‘chirish' : 'Sevimlilarga saqlash'}</span>
        </button>
        <button type="button" 
                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors btn-press"
                onclick="window.OSON_UI.closeModal('sign-detail-modal')">
          Tushunarli
        </button>
      </div>
    `;

    window.OSON_UI.openModal('sign-detail-modal');
  }

  // Toggle Favorite
  function toggleFav(signId, btnElement) {
    const isNowFav = window.OSON_STORAGE.toggleFavorite(signId);
    if (btnElement) {
      const icon = btnElement.querySelector('i');
      if (icon) {
        if (isNowFav) {
          icon.className = 'fa-solid fa-star text-amber-500';
        } else {
          icon.className = 'fa-regular fa-star';
        }
      }
      const label = btnElement.querySelector('span');
      if (label) {
        label.textContent = isNowFav ? 'Sevimlilardan o‘chirish' : 'Sevimlilarga saqlash';
      }
    }
    window.OSON_UI.showToast(
      isNowFav ? 'Belgi sevimlilarga qo‘shildi' : 'Belgi sevimlilardan olib tashlandi',
      'info'
    );
    // Refresh list if needed
    renderSigns();
  }

  // Filter Categories
  function setCategory(cat, btnElement) {
    currentCategory = cat;
    document.querySelectorAll('.sign-filter-btn').forEach(btn => {
      btn.classList.remove('bg-blue-600', 'text-white');
      btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    });
    if (btnElement) {
      btnElement.classList.add('bg-blue-600', 'text-white');
      btnElement.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    }
    renderSigns();
  }

  // Search input handler
  function onSearch(query) {
    searchQuery = query;
    renderSigns();
  }

  return {
    getSignSvg,
    renderSigns,
    openSignModal,
    toggleFav,
    setCategory,
    onSearch
  };
})();
