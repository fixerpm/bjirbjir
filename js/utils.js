/**
 * OSON PRAVA — Shared Utilities & Micro-Components
 * Minimalist UI helpers: Toasts, Modals, Empty States, Skeletons & Formatters
 */

window.OSON_UTILS = (function() {
  'use strict';

  // DOM Query Helpers
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  // Time & String Formatters
  function formatSeconds(sec) {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Toast System (Floating subtle notifications)
  function showToast(message, type = 'info', duration = 3200) {
    let container = document.getElementById('oson-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'oson-toast-container';
      container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border shadow-lg text-sm font-medium transition-all duration-300 transform translate-y-3 opacity-0 backdrop-blur-md';

    let iconHtml = '';
    let styleClass = '';

    switch (type) {
      case 'success':
        styleClass = 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
        iconHtml = '<i class="fa-solid fa-circle-check text-emerald-500 text-base shrink-0"></i>';
        break;
      case 'error':
        styleClass = 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 border-rose-500/20';
        iconHtml = '<i class="fa-solid fa-circle-exclamation text-rose-500 text-base shrink-0"></i>';
        break;
      case 'warning':
        styleClass = 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-amber-500/20';
        iconHtml = '<i class="fa-solid fa-triangle-exclamation text-amber-500 text-base shrink-0"></i>';
        break;
      default:
        styleClass = 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800';
        iconHtml = '<i class="fa-solid fa-circle-info text-blue-500 text-base shrink-0"></i>';
        break;
    }

    toast.className += ' ' + styleClass;
    toast.innerHTML = `
      ${iconHtml}
      <div class="flex-1 leading-snug">${message}</div>
      <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    }, duration);
  }

  // Centralized Safe Scroll Lock Controller
  function lockBodyScroll() {
    document.documentElement.classList.add('scroll-locked');
    document.body.classList.add('scroll-locked');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function hasActiveModalOrDrawer() {
    // 1. Check all standard modal containers via their backdrop
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    for (const mb of modalBackdrops) {
      const modal = mb.parentElement;
      if (modal && !modal.classList.contains('hidden') && modal.style.display !== 'none') {
        return true;
      }
    }
    // 2. Check confirmation dialog
    const confirmModal = document.getElementById('oson-confirm-modal');
    if (confirmModal && !confirmModal.classList.contains('hidden') && confirmModal.style.display !== 'none') {
      return true;
    }
    // 3. Check AI tutor drawer
    const aiDrawer = document.getElementById('ai-tutor-drawer');
    if (aiDrawer && !aiDrawer.classList.contains('translate-x-full') && !aiDrawer.classList.contains('hidden')) {
      return true;
    }
    // 4. Check AI tutor overlay
    const aiOverlay = document.getElementById('ai-tutor-overlay');
    if (aiOverlay && !aiOverlay.classList.contains('hidden') && aiOverlay.style.display !== 'none') {
      return true;
    }
    return false;
  }

  function unlockBodyScroll(force = false) {
    if (force || !hasActiveModalOrDrawer()) {
      document.documentElement.classList.remove('scroll-locked', 'overflow-hidden');
      document.body.classList.remove('scroll-locked', 'overflow-hidden');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  // Expose helpers globally immediately
  window.lockBodyScroll = lockBodyScroll;
  window.unlockBodyScroll = unlockBodyScroll;

  // Generic Reusable Modal Controller
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lockBodyScroll();
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    unlockBodyScroll();
  }

  // Confirmation Dialog Modal Helper
  function confirmDialog({ title, message, confirmText = 'Ha, tasdiqlayman', cancelText = 'Bekor qilish', onConfirm }) {
    let modal = document.getElementById('oson-confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'oson-confirm-modal';
      modal.className = 'fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm hidden';
      modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
          <h3 id="oson-confirm-title" class="text-lg font-bold text-slate-900 dark:text-white mb-2"></h3>
          <p id="oson-confirm-msg" class="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed"></p>
          <div class="flex items-center justify-end gap-3">
            <button id="oson-confirm-cancel" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
              ${cancelText}
            </button>
            <button id="oson-confirm-ok" class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition">
              ${confirmText}
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const titleEl = document.getElementById('oson-confirm-title');
    const msgEl = document.getElementById('oson-confirm-msg');
    const okBtn = document.getElementById('oson-confirm-ok');
    const cancelBtn = document.getElementById('oson-confirm-cancel');

    titleEl.textContent = title;
    msgEl.textContent = message;

    const cleanup = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      unlockBodyScroll();
      okBtn.onclick = null;
      cancelBtn.onclick = null;
    };

    okBtn.onclick = () => {
      cleanup();
      if (typeof onConfirm === 'function') onConfirm();
    };

    cancelBtn.onclick = cleanup;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lockBodyScroll();
  }

  // Minimalist Empty State Component Generator
  function renderEmptyState({
    icon = 'fa-folder-open',
    title = 'Ma’lumot topilmadi',
    description = 'Hozircha ushbu bo‘limda hech qanday ma’lumot mavjud emas.',
    actionText = null,
    actionHash = null,
    actionOnClick = null
  }) {
    const actionBtn = actionText
      ? `<button ${actionHash ? `onclick="window.location.hash='${actionHash}'"` : ''} 
                ${actionOnClick ? `onclick="${actionOnClick}"` : ''} 
                class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm">
           <span>${actionText}</span>
           <i class="fa-solid fa-arrow-right text-[11px]"></i>
         </button>`
      : '';

    return `
      <div class="py-14 px-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 text-2xl">
          <i class="fa-solid ${icon}"></i>
        </div>
        <h4 class="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">${title}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">${description}</p>
        ${actionBtn}
      </div>
    `;
  }

  // Skeleton Card Generator
  function renderSkeleton(type = 'card', count = 3) {
    let items = '';
    for (let i = 0; i < count; i++) {
      if (type === 'card') {
        items += `
          <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
            <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
            <div class="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-full pt-2"></div>
          </div>
        `;
      } else if (type === 'row') {
        items += `
          <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 animate-pulse flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
              <div class="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
              <div class="space-y-1.5 flex-1">
                <div class="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                <div class="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              </div>
            </div>
            <div class="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        `;
      }
    }
    return items;
  }

  // Find a road sign referenced inside a test/exam question's text
  // (matches codes like "2.5", "3.1" that appear in the question or explanation)
  function findRelatedSign(question) {
    if (!question || !window.OSON_DATA || !window.OSON_DATA.signs) return null;
    const haystack = `${question.question || ''} ${question.explanation || ''}`;
    let best = null;
    window.OSON_DATA.signs.forEach(sign => {
      if (!sign.code) return;
      const escaped = sign.code.replace(/\./g, '\\.');
      const re = new RegExp(`(^|[^0-9.])${escaped}([^0-9.]|$)`);
      if (re.test(haystack)) {
        // Prefer the longest/most specific code match (e.g. "5.16.1" over "5.16")
        if (!best || sign.code.length > best.code.length) best = sign;
      }
    });
    return best;
  }

  // Render a compact sign-visual card HTML for a given sign (or '' if none)
  function renderSignVisualCard(sign) {
    if (!sign || !window.OSON_SIGNS) return '';
    return `
      <div class="q-sign-visual">
        <div class="q-sign-thumb">${window.OSON_SIGNS.getSignSvg(sign)}</div>
        <div class="q-sign-meta">
          <div class="q-sign-code">${sign.code}-belgi</div>
          <div class="q-sign-name">${sign.name}</div>
        </div>
      </div>
    `;
  }

  return {
    $,
    $$,
    formatSeconds,
    formatDate,
    showToast,
    lockBodyScroll,
    unlockBodyScroll,
    openModal,
    closeModal,
    confirmDialog,
    renderEmptyState,
    renderSkeleton,
    findRelatedSign,
    renderSignVisualCard
  };
})();
