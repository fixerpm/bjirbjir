/**
 * OSON PRAVA — Global UI Engine
 * Modals, Toast Notifications, Global Search, Theme (Dark Mode),
 * Notifications Dropdown, FAQ Accordion, Mobile Menu & Confetti
 */

window.OSON_UI = (function() {
  'use strict';

  // 1. SAFE CENTRALIZED SCROLL LOCK & MODAL SYSTEM
  function lockBodyScroll() {
    if (typeof window.lockBodyScroll === 'function') {
      window.lockBodyScroll();
    } else {
      document.documentElement.classList.add('scroll-locked');
      document.body.classList.add('scroll-locked');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  function unlockBodyScroll(force = false) {
    if (typeof window.unlockBodyScroll === 'function') {
      window.unlockBodyScroll(force);
    } else {
      document.documentElement.classList.remove('scroll-locked', 'overflow-hidden');
      document.body.classList.remove('scroll-locked', 'overflow-hidden');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lockBodyScroll();

    // Auto-focus first input if exists
    const input = modal.querySelector('input:not([type="hidden"]), button:not(.modal-backdrop)');
    if (input && typeof input.focus === 'function') {
      setTimeout(() => input.focus(), 50);
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    unlockBodyScroll();
  }

  // 1b. MOBILE HEADER DRAWER MENU (smooth open/close + hamburger<->close morph)
  function openMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-toggle-btn');
    if (menu) menu.classList.add('mobile-menu-open');
    if (btn) {
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-toggle-btn');
    if (menu) menu.classList.remove('mobile-menu-open');
    if (btn) {
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    if (menu.classList.contains('mobile-menu-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
    if (window.OSON_SOUND) window.OSON_SOUND.playClick();
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(mb => {
      const modal = mb.parentElement;
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
    const confirmModal = document.getElementById('oson-confirm-modal');
    if (confirmModal && !confirmModal.classList.contains('hidden')) {
      confirmModal.classList.add('hidden');
      confirmModal.classList.remove('flex');
    }
    if (window.OSON_AI && typeof window.OSON_AI.closeDrawer === 'function') {
      window.OSON_AI.closeDrawer();
    }
    closeMobileMenu();
    document.getElementById('notif-dropdown')?.classList.add('hidden');
    document.getElementById('account-dropdown')?.classList.add('hidden');
    unlockBodyScroll(true);
  }

  // 2. TOAST SYSTEM
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'fa-circle-info text-blue-500';
    let borderCls = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100';

    if (type === 'success') {
      icon = 'fa-circle-check text-emerald-500';
      borderCls = 'border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100';
    } else if (type === 'error') {
      icon = 'fa-circle-exclamation text-rose-500';
      borderCls = 'border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100';
    }

    toast.className = `toast border ${borderCls}`;
    toast.innerHTML = `
      <i class="fa-solid ${icon} text-lg flex-shrink-0"></i>
      <span class="flex-1">${message}</span>
      <button type="button" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // 3. DARK MODE TOGGLE & SYNC
  function initTheme() {
    const settings = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.SETTINGS, { darkMode: false });
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateThemeIcons(settings.darkMode);
  }

  function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    const settings = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.SETTINGS, {});
    settings.darkMode = isDark;
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.SETTINGS, settings);
    updateThemeIcons(isDark);
    showToast(isDark ? 'Tungi rejim yoqildi' : 'Kunduzgi rejim yoqildi', 'info');
  }

  function updateThemeIcons(isDark) {
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(ic => {
      ic.className = `theme-toggle-icon fa-solid ${isDark ? 'fa-sun text-amber-400' : 'fa-moon text-slate-600'}`;
    });
  }

  // 4. GLOBAL SEARCH MODAL (Instant Live Search across all categories)
  function openGlobalSearch() {
    openModal('global-search-modal');
    const input = document.getElementById('global-search-input');
    if (input) {
      input.value = '';
      input.focus();
      runGlobalSearch('');
    }
  }

  function runGlobalSearch(query) {
    const resultsContainer = document.getElementById('global-search-results');
    const emptyNotice = document.getElementById('global-search-empty');
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `
        <div class="py-10 text-center text-slate-400 text-sm">
          <i class="fa-solid fa-magnifying-glass text-3xl mb-3 opacity-40"></i>
          <p>Yo‘l belgilari, qoidalar, darslar yoki test savollarini qidirish uchun so‘z kiriting.</p>
          <div class="flex flex-wrap justify-center gap-2 mt-4">
            <button class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300" onclick="window.OSON_UI.setSearchKeyword('Chorraha')">Chorraha</button>
            <button class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300" onclick="window.OSON_UI.setSearchKeyword('Tezlik')">Tezlik</button>
            <button class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300" onclick="window.OSON_UI.setSearchKeyword('STOP')">STOP</button>
            <button class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300" onclick="window.OSON_UI.setSearchKeyword('Svetofor')">Svetofor</button>
          </div>
        </div>
      `;
      if (emptyNotice) emptyNotice.classList.add('hidden');
      return;
    }

    const matches = [];

    // Search Signs
    window.OSON_DATA.signs.forEach(s => {
      if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)) {
        matches.push({
          type: 'Belgi',
          typeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
          title: `${s.code} — ${s.name}`,
          snippet: s.desc,
          action: () => {
            closeModal('global-search-modal');
            window.location.hash = '#belgilar';
            setTimeout(() => window.OSON_SIGNS.openSignModal(s.id), 200);
          }
        });
      }
    });

    // Search Rules
    window.OSON_DATA.rules.forEach(r => {
      if (r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.content.toLowerCase().includes(q)) {
        matches.push({
          type: 'Qoida',
          typeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
          title: r.title,
          snippet: r.summary,
          action: () => {
            closeModal('global-search-modal');
            window.location.hash = '#qoidalar';
            setTimeout(() => window.OSON_LESSONS.openRuleModal(r.id), 200);
          }
        });
      }
    });

    // Search Lessons
    window.OSON_DATA.lessons.forEach(l => {
      if (l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q)) {
        matches.push({
          type: 'Dars',
          typeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
          title: `${l.number}-Dars: ${l.title}`,
          snippet: l.summary,
          action: () => {
            closeModal('global-search-modal');
            window.location.hash = '#darslar';
            setTimeout(() => window.OSON_LESSONS.openLesson(l.id), 200);
          }
        });
      }
    });

    // Search Questions
    window.OSON_DATA.questions.forEach((qu, i) => {
      if (qu.question.toLowerCase().includes(q) || qu.topic.toLowerCase().includes(q)) {
        matches.push({
          type: 'Test savoli',
          typeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
          title: `${qu.topic}: Savol #${i + 1}`,
          snippet: qu.question,
          action: () => {
            closeModal('global-search-modal');
            window.location.hash = '#testlar';
            setTimeout(() => window.OSON_TESTS.startTest({ topic: qu.topic }), 200);
          }
        });
      }
    });

    // Search FAQ
    window.OSON_DATA.faqs.forEach(f => {
      if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
        matches.push({
          type: 'FAQ',
          typeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
          title: f.question,
          snippet: f.answer,
          action: () => {
            closeModal('global-search-modal');
            window.location.hash = '#faq';
          }
        });
      }
    });

    // Search 2026 Fines & Points
    if (window.OSON_FINES && window.OSON_FINES.getFinesData) {
      window.OSON_FINES.getFinesData().forEach(fn => {
        if (fn.title.toLowerCase().includes(q) || fn.description.toLowerCase().includes(q) || fn.article.toLowerCase().includes(q)) {
          matches.push({
            type: 'Jarima',
            typeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
            title: `${fn.title} (${fn.bhm} BHM)`,
            snippet: `${fn.article} • ${fn.points} ball • ${fn.description}`,
            action: () => {
              closeModal('global-search-modal');
              window.location.hash = '#jarimalar';
              setTimeout(() => {
                if (window.OSON_FINES) window.OSON_FINES.toggleFine(fn.id);
              }, 200);
            }
          });
        }
      });
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = '';
      if (emptyNotice) emptyNotice.classList.remove('hidden');
      return;
    }

    if (emptyNotice) emptyNotice.classList.add('hidden');

    resultsContainer.innerHTML = matches.slice(0, 15).map((m, idx) => `
      <div class="p-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600 flex items-start gap-3"
           onclick="window.OSON_UI.dispatchSearchResult(${idx})">
        <span class="px-2 py-0.5 rounded text-[11px] font-bold ${m.typeClass} flex-shrink-0 mt-0.5">
          ${m.type}
        </span>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white truncate">${m.title}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">${m.snippet}</p>
        </div>
        <i class="fa-solid fa-chevron-right text-slate-300 text-xs mt-1"></i>
      </div>
    `).join('');

    // Cache current matches for click dispatch
    window.OSON_UI._currentSearchResults = matches;
  }

  function setSearchKeyword(kw) {
    const input = document.getElementById('global-search-input');
    if (input) {
      input.value = kw;
      runGlobalSearch(kw);
    }
  }

  function dispatchSearchResult(idx) {
    if (window.OSON_UI._currentSearchResults && window.OSON_UI._currentSearchResults[idx]) {
      window.OSON_UI._currentSearchResults[idx].action();
    }
  }

  // 5. NOTIFICATIONS DROPDOWN
  function toggleNotifications() {
    const dropdown = document.getElementById('notif-dropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('hidden');
    renderNotifications();
  }

  function renderNotifications() {
    const listEl = document.getElementById('notif-list');
    const badge = document.getElementById('notif-badge');
    if (!listEl) return;

    const notifs = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.NOTIFICATIONS, []);
    const unreadCount = notifs.filter(n => n.unread).length;

    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    if (notifs.length === 0) {
      listEl.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">Bildirishnomalar mavjud emas</div>`;
      return;
    }

    listEl.innerHTML = notifs.map(n => `
      <div class="p-3.5 border-b border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors flex items-start gap-3 ${n.unread ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''}">
        <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
          <i class="fa-solid fa-${n.icon || 'bell'}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h5 class="text-xs font-bold text-slate-900 dark:text-white truncate">${n.title}</h5>
            <span class="text-[10px] text-slate-400">${n.time}</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">${n.message}</p>
        </div>
      </div>
    `).join('');
  }

  function markAllNotificationsRead() {
    const notifs = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.NOTIFICATIONS, []);
    notifs.forEach(n => n.unread = false);
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.NOTIFICATIONS, notifs);
    renderNotifications();
    showToast('Barcha bildirishnomalar o‘qildi deb belgilandi', 'info');
  }

  // 6. FAQ ACCORDION
  function renderFAQ() {
    const containers = [
      document.getElementById('faq-accordion-container'),
      document.getElementById('faq-page-accordion-container')
    ].filter(Boolean);
    if (containers.length === 0) return;

    const faqs = window.OSON_DATA.faqs || [];
    const html = faqs.map((f, idx) => `
      <div class="faq-item border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 overflow-hidden shadow-sm transition-all">
        <button type="button" 
                class="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onclick="window.OSON_UI.toggleFaq(this)">
          <span>${f.question}</span>
          <i class="faq-icon fa-solid fa-chevron-down text-sm text-slate-400 transition-transform duration-200 flex-shrink-0"></i>
        </button>
        <div class="faq-content px-5 pb-5 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            ${f.answer}
          </div>
        </div>
      </div>
    `).join('');

    containers.forEach(c => {
      c.innerHTML = html;
    });
  }

  function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const wasActive = item.classList.contains('active');

    // Close others
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

    if (!wasActive) {
      item.classList.add('active');
    }
  }

  // 7. CONTACT FORM SUBMISSION SIMULATION
  function submitContactForm(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const subject = document.getElementById('contact-subject')?.value;
    const message = document.getElementById('contact-message')?.value;

    if (!name || !email || !message) {
      showToast('Iltimos, barcha majburiy maydonlarni to‘ldiring!', 'error');
      return;
    }

    // Simulate sending
    const submitBtn = document.getElementById('contact-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Yuborilmoqda...`;
    }

    setTimeout(() => {
      showToast('Xabaringiz muvaffaqiyatli qabul qilindi! Tez orada bog‘lanamiz.', 'success');
      document.getElementById('contact-form')?.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Xabarni yuborish</span> <i class="fa-solid fa-paper-plane ml-2"></i>`;
      }
    }, 1000);
  }

  // 8. CELEBRATION CONFETTI (Lightweight Canvas Particle Explosion)
  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
    const particles = [];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.7) * 20,
        rotation: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationFrame;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rotation += p.vrot;
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    }

    animate();
  }

  // 8.5 ACCOUNT DROPDOWN SYSTEM
  function toggleAccountDropdown() {
    const dropdown = document.getElementById('account-dropdown');
    if (!dropdown) return;
    const isHidden = dropdown.classList.contains('hidden');
    
    // Close other dropdowns
    document.getElementById('notif-dropdown')?.classList.add('hidden');

    if (isHidden) {
      dropdown.classList.remove('hidden');
    } else {
      dropdown.classList.add('hidden');
    }
  }

  function closeAccountDropdown() {
    const dropdown = document.getElementById('account-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }

  // 8.6 SUPPORT BOT CONFIGURATION & LAUNCHER
  const SUPPORT_BOT_URL = "https://t.me/osonpravaabot";

  function openSupportBot() {
    try {
      const url = (typeof window !== 'undefined' && window.SUPPORT_BOT_URL && window.SUPPORT_BOT_URL !== "BOT_LINK") 
        ? window.SUPPORT_BOT_URL 
        : SUPPORT_BOT_URL;
      if (url && url !== "BOT_LINK" && typeof url === 'string' && url.trim().length > 0) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        // Fallback: Agar bot linki hali kiritilmagan bo'lsa xavfsiz Telegram ochiladi
        window.open("https://t.me", "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      // Telegram link ochilmasa console error bo'lmasin
    }
  }

  // 9. EVENT LISTENERS SETUP
  function initEvents() {
    // ESC key closes modals, drawers & dropdowns and restores scrolling safely
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }

      // Ctrl+K / Cmd+K opens global search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openGlobalSearch();
      }
    });

    // Close notifications and account dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      // Notifications outside click
      const notifBtn = document.getElementById('notif-trigger-btn');
      const notifDropdown = document.getElementById('notif-dropdown');
      if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
        if (!notifDropdown.contains(e.target) && (!notifBtn || !notifBtn.contains(e.target))) {
          notifDropdown.classList.add('hidden');
        }
      }

      // Account dropdown outside click
      const accountBtn = document.getElementById('account-trigger-btn');
      const accountDropdown = document.getElementById('account-dropdown');
      if (accountDropdown && !accountDropdown.classList.contains('hidden')) {
        if (!accountDropdown.contains(e.target) && (!accountBtn || !accountBtn.contains(e.target))) {
          accountDropdown.classList.add('hidden');
        }
      }

      // Mobile drawer menu outside click
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuBtn = document.getElementById('mobile-menu-toggle-btn');
      if (mobileMenu && mobileMenu.classList.contains('mobile-menu-open')) {
        if (!mobileMenu.contains(e.target) && (!mobileMenuBtn || !mobileMenuBtn.contains(e.target))) {
          closeMobileMenu();
        }
      }
    });
  }

  // 10. SETTINGS ENHANCEMENTS
  function updateSettingsUI() {
    const settings = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.SETTINGS, {});
    const daily = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.DAILY_PRACTICE, { target: 10 });
    
    // Sound switch
    const soundStatus = document.getElementById('settings-sound-status');
    if (soundStatus && window.OSON_SOUND) {
      soundStatus.textContent = window.OSON_SOUND.isEnabled() ? 'Yoqilgan' : 'O‘chirilgan';
      soundStatus.className = window.OSON_SOUND.isEnabled() 
        ? 'px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs'
        : 'px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold text-xs';
    }

    // Daily target pills
    document.querySelectorAll('.settings-daily-pill').forEach(btn => {
      const val = parseInt(btn.getAttribute('data-target'), 10);
      if (val === daily.target) {
        btn.className = 'settings-daily-pill px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm';
      } else {
        btn.className = 'settings-daily-pill px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-200';
      }
    });
  }

  function setDailyTarget(targetNum) {
    const daily = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.DAILY_PRACTICE, {
      date: window.OSON_STORAGE.getTodayString(),
      target: 10,
      solvedCount: 0,
      completed: false
    });
    daily.target = targetNum;
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.DAILY_PRACTICE, daily);
    updateSettingsUI();
    showToast(`Kunlik maqsad ${targetNum} ta savolga o‘zgartirildi`, 'success');
    if (window.OSON_PROFILE && typeof window.OSON_PROFILE.renderDashboard === 'function') {
      window.OSON_PROFILE.renderDashboard();
    }
  }

  // Reset Progress action from settings
  function handleResetProgress() {
    window.OSON_STORAGE.resetAllProgress();
    closeModal('reset-confirm-modal');
    closeModal('settings-modal');
    showToast('Barcha o‘quv progressi va test natijalari tozalandi', 'info');
    if (window.OSON_PROFILE) {
      window.OSON_PROFILE.renderDashboard();
      window.OSON_PROFILE.renderProfile();
      window.OSON_PROFILE.renderResultsAnalytics();
    }
    if (window.OSON_LESSONS) {
      window.OSON_LESSONS.renderLessons();
    }
    renderSavedQuestionsPage();
    renderSettingsPage();
  }

  // 10. CATEGORIES PAGE RENDERER
  function renderCategoriesPage() {
    const container = document.getElementById('categories-grid-container');
    if (!container || !window.OSON_DATA || !window.OSON_DATA.categories) return;

    const cats = window.OSON_DATA.categories;
    container.innerHTML = cats.map(cat => `
      <div class="card-minimal p-6 flex flex-col justify-between group hover:border-blue-500/40 transition-all">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-xl transition-transform group-hover:scale-105">
              <i class="fa-solid ${cat.icon}"></i>
            </div>
            <span class="badge-minimal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px]">
              ${cat.badge}
            </span>
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            ${cat.name}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            ${cat.desc}
          </p>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span class="flex items-center gap-1.5 font-medium">
              <i class="fa-regular fa-circle-question text-blue-500"></i> ${cat.questionCount} ta savol
            </span>
            <span class="flex items-center gap-1.5 font-medium">
              <i class="fa-solid fa-list-check text-emerald-500"></i> ${cat.testCount} ta test
            </span>
          </div>
          <button type="button" 
                  class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                  onclick="window.location.hash='#testlar'; window.OSON_TESTS.startTopicPractice('${cat.name}')">
            <span>Mashqni boshlash</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // 11. DEDICATED SEARCH PAGE CONTROLLER
  let currentSearchFilter = 'all';
  let searchDebounceTimer = null;

  function setPageSearchFilter(filter) {
    currentSearchFilter = filter;
    document.querySelectorAll('.page-search-tab').forEach(tab => {
      if (tab.getAttribute('data-filter') === filter) {
        tab.className = 'page-search-tab active px-3.5 py-1.5 rounded-lg font-semibold bg-blue-600 text-white transition';
      } else {
        tab.className = 'page-search-tab px-3.5 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition';
      }
    });
    const input = document.getElementById('page-search-input');
    handlePageSearch(input ? input.value : '');
  }

  function handlePageSearch(query) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      executePageSearch(query);
    }, 150);
  }

  function clearPageSearch() {
    const input = document.getElementById('page-search-input');
    if (input) input.value = '';
    executePageSearch('');
  }

  function executePageSearch(query) {
    const q = (query || '').trim().toLowerCase();
    const resultsContainer = document.getElementById('page-search-results');
    const clearBtn = document.getElementById('page-search-clear-btn');
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', q.length === 0);
    }
    if (!resultsContainer) return;

    if (!q) {
      resultsContainer.innerHTML = `
        <div class="py-12 px-4 text-center">
          <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-500 text-xl">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Qidiruv so‘zini kiriting</h4>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Yo‘l belgilari, qoidalar bandi yoki test savollarini tezkor qidirish uchun so‘z yozing.</p>
          <div class="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button type="button" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600" onclick="document.getElementById('page-search-input').value='3.27'; executePageSearch('3.27');">3.27 To‘xtash taqiqlanadi</button>
            <button type="button" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600" onclick="document.getElementById('page-search-input').value='chorraha'; executePageSearch('chorraha');">Aylanma chorraha</button>
            <button type="button" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600" onclick="document.getElementById('page-search-input').value='60 km'; executePageSearch('60 km');">60 km/soat tezlik</button>
          </div>
        </div>
      `;
      return;
    }

    const matches = [];

    // Search Signs
    if (currentSearchFilter === 'all' || currentSearchFilter === 'signs') {
      window.OSON_DATA.signs.forEach(s => {
        if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)) {
          matches.push({
            type: 'belgi',
            typeName: 'Yo‘l belgisi',
            badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
            icon: 'fa-diamond',
            title: `${s.code} ${s.name}`,
            desc: s.desc,
            action: `window.OSON_SIGNS.openSignModal('${s.id}')`
          });
        }
      });
    }

    // Search Rules
    if (currentSearchFilter === 'all' || currentSearchFilter === 'rules') {
      window.OSON_DATA.rules.forEach(r => {
        const titleMatch = (r.title || '').toLowerCase().includes(q);
        const summaryMatch = (r.summary || '').toLowerCase().includes(q);
        const contentMatch = (r.content || '').toLowerCase().includes(q);
        if (titleMatch || summaryMatch || contentMatch) {
          matches.push({
            type: 'qoida',
            typeName: 'Qoida bandi',
            badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
            icon: 'fa-book-open',
            title: r.title,
            desc: r.summary || (r.content ? r.content.substring(0, 100) + '...' : ''),
            action: `window.OSON_LESSONS.openRuleModal('${r.id}')`
          });
        }
      });
    }

    // Search Questions
    if (currentSearchFilter === 'all' || currentSearchFilter === 'questions') {
      window.OSON_DATA.questions.forEach((qu, i) => {
        if (qu.question.toLowerCase().includes(q) || qu.topic.toLowerCase().includes(q)) {
          matches.push({
            type: 'savol',
            typeName: `Savol #${i + 1}`,
            badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
            icon: 'fa-circle-question',
            title: qu.question,
            desc: `Mavzu: ${qu.topic} — To‘g‘ri javob: ${qu.options[qu.correctIndex]}`,
            action: `window.location.hash='#testlar'; window.OSON_TESTS.startTest({ topic: '${qu.topic}' })`
          });
        }
      });
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = window.OSON_UTILS.renderEmptyState({
        icon: 'fa-magnifying-glass',
        title: 'Hech qanday natija topilmadi',
        description: `"${query}" bo‘yicha hech narsa topilmadi. Boshqa so‘z yoki kod bilan qidirib ko‘ring.`,
        actionText: 'Qidiruvni tozalash',
        actionOnClick: 'window.OSON_UI.clearPageSearch()'
      });
      return;
    }

    resultsContainer.innerHTML = `
      <div class="text-xs font-semibold text-slate-500 mb-3">
        ${matches.length} ta mos keluvchi natija topildi:
      </div>
      <div class="space-y-3">
        ${matches.map(m => `
          <div class="card-minimal p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:border-blue-500/40 cursor-pointer transition"
               onclick="${m.action}">
            <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm shrink-0">
              <i class="fa-solid ${m.icon}"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="badge-minimal ${m.badgeClass}">${m.typeName}</span>
              </div>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1 truncate">${m.title}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${m.desc}</p>
            </div>
            <i class="fa-solid fa-chevron-right text-slate-300 dark:text-slate-600 text-xs shrink-0 self-center"></i>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 12. SAVED QUESTIONS CONTROLLER
  function renderSavedQuestionsPage() {
    const container = document.getElementById('saved-questions-container');
    if (!container) return;

    const savedIds = window.OSON_STORAGE.getSavedQuestions();
    const allQuestions = window.OSON_DATA.questions;
    const savedList = allQuestions.filter(q => savedIds.includes(Number(q.id)));

    if (savedList.length === 0) {
      container.innerHTML = window.OSON_UTILS.renderEmptyState({
        icon: 'fa-bookmark',
        title: 'Hozircha saqlangan savollar yo‘q',
        description: 'Test yoki mashq paytida murakkab deb topgan savollaringizni "Saqlash" tugmasi orqali shu yerda to‘plang.',
        actionText: 'Testlarni boshlash',
        actionHash: '#testlar'
      });
      return;
    }

    container.innerHTML = `
      <div class="text-xs font-semibold text-slate-500 mb-2">
        Jami ${savedList.length} ta saqlangan savol:
      </div>
      <div class="space-y-4">
        ${savedList.map(q => `
          <div class="card-minimal p-6 transition" id="saved-card-${q.id}">
            <div class="flex items-center justify-between gap-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="badge-minimal bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold">
                  ${q.topic}
                </span>
                <span class="badge-minimal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  ${q.difficulty || 'Standart'}
                </span>
              </div>
              <button type="button" 
                      class="text-xs text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1"
                      onclick="window.OSON_UI.removeSavedQuestionItem(${q.id})"
                      title="Saqlanganlardan o‘chirish">
                <i class="fa-regular fa-trash-can"></i>
                <span class="hidden sm:inline">O‘chirish</span>
              </button>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-4 leading-relaxed">
              ${q.question}
            </h3>

            <!-- Options Preview -->
            <div class="space-y-2 mb-4">
              ${q.options.map((opt, i) => `
                <div class="p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2.5 ${
                  i === q.correctIndex
                    ? 'border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400'
                }">
                  <span class="w-5 h-5 rounded-full ${i === q.correctIndex ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} flex items-center justify-center font-bold text-[10px] shrink-0">
                    ${String.fromCharCode(65 + i)}
                  </span>
                  <span>${opt}</span>
                  ${i === q.correctIndex ? '<span class="ml-auto text-[10px] font-bold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-check"></i> To‘g‘ri variant</span>' : ''}
                </div>
              `).join('')}
            </div>

            <!-- Official Explanation Accordion -->
            <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong class="text-slate-800 dark:text-slate-200 block mb-1">
                <i class="fa-solid fa-circle-info text-blue-500 mr-1"></i> Rasmiy qoida izohi:
              </strong>
              ${q.explanation}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function removeSavedQuestionItem(qid) {
    window.OSON_STORAGE.toggleSavedQuestion(qid);
    showToast('Savol saqlanganlardan olib tashlandi', 'info');
    renderSavedQuestionsPage();
  }

  function clearAllSavedQuestions() {
    window.OSON_UTILS.confirmDialog({
      title: 'Barcha saqlanganlarni tozalash',
      message: 'Rostdan ham barcha saqlangan savollarni ro‘yxatdan o‘chirmoqchimisiz?',
      confirmText: 'Ha, tozalash',
      onConfirm: () => {
        window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.SAVED_QUESTIONS, []);
        showToast('Saqlangan savollar tozalandi', 'info');
        renderSavedQuestionsPage();
      }
    });
  }

  // 13. NOTIFICATIONS PAGE RENDERER
  function renderNotificationsPage() {
    const container = document.getElementById('notifications-page-container');
    if (!container) return;

    const notifs = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.NOTIFICATIONS, []);
    if (notifs.length === 0) {
      container.innerHTML = window.OSON_UTILS.renderEmptyState({
        icon: 'fa-bell',
        title: 'Yangi bildirishnomalar yo‘q',
        description: 'Sizda hozircha hech qanday bildirishnoma yoki tizim xabarlari mavjud emas.'
      });
      return;
    }

    container.innerHTML = notifs.map(n => `
      <div class="card-minimal p-4 sm:p-5 flex items-start gap-4 transition ${n.unread ? 'border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20' : ''}">
        <div class="w-10 h-10 rounded-xl ${n.color || 'bg-blue-100 text-blue-600'} flex items-center justify-center text-sm shrink-0">
          <i class="fa-solid ${n.icon || 'fa-bell'}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">${n.title}</h4>
            <span class="text-[11px] text-slate-400 shrink-0">${n.time || 'Yaqinda'}</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${n.text}</p>
        </div>
        ${n.unread ? '<span class="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 self-center"></span>' : ''}
      </div>
    `).join('');
  }

  // 14. SETTINGS PAGE CONTROLLER
  function renderSettingsPage() {
    const user = window.OSON_AUTH ? window.OSON_AUTH.getUser() : null;
    const settings = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.SETTINGS, { sound: true, reminders: true });

    const nameEl = document.getElementById('settings-name-preview');
    const emailEl = document.getElementById('settings-email-preview');
    const avEl = document.getElementById('settings-avatar-preview');

    const demoBadgeEl = document.getElementById('settings-demo-badge');

    if (user) {
      if (nameEl) nameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email;
      if (avEl) avEl.textContent = user.avatar || (user.isDemo ? 'DU' : 'OP');
      if (demoBadgeEl) {
        if (user.isDemo) {
          demoBadgeEl.className = 'px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white tracking-wider uppercase';
          demoBadgeEl.textContent = 'DEMO';
          demoBadgeEl.classList.remove('hidden');
        } else {
          demoBadgeEl.classList.add('hidden');
        }
      }
    } else {
      if (nameEl) nameEl.textContent = 'Mehmon (Tizimga kirmagan)';
      if (emailEl) emailEl.textContent = 'Sozlamalarni saqlash uchun tizimga kiring';
      if (avEl) avEl.textContent = 'M';
      if (demoBadgeEl) demoBadgeEl.classList.add('hidden');
    }

    const soundInput = document.getElementById('settings-page-sound');
    const reminderInput = document.getElementById('settings-page-reminders');
    if (soundInput) soundInput.checked = settings.sound !== false;
    if (reminderInput) reminderInput.checked = settings.reminders !== false;
  }

  // 16. HERO EXAM READINESS CARD (DYNAMIC AUTH / STORAGE STATE)
  function updateHeroReadiness() {
    const badgeEl = document.getElementById('hero-readiness-badge');
    const scoreBoxEl = document.getElementById('hero-readiness-score-box');
    if (!scoreBoxEl) return;

    const user = window.OSON_AUTH?.getUser?.();
    const isAuth = window.OSON_AUTH?.isAuthenticated?.();

    if (!isAuth || !user) {
      // 1. GUEST USER (Unauthenticated / Incognito / Clean Default)
      if (badgeEl) {
        badgeEl.textContent = 'Mehmon';
        badgeEl.className = 'px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold';
      }
      scoreBoxEl.innerHTML = `
        <div class="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
          <i class="fa-solid fa-chart-pie text-2xl"></i>
        </div>
        <h5 class="font-bold text-sm text-slate-800 dark:text-slate-200">Tayyorgarligingizni aniqlang</h5>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          Shaxsiy ko‘rsatkich va imtihonga tayyorlik foizini hisoblash uchun ro‘yxatdan o‘ting yoki testni boshlang.
        </p>
        <div class="mt-3 flex items-center justify-center gap-2">
          <button type="button" 
                  class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                  onclick="window.OSON_UI.openModal('auth-modal')">
            Kirish / Ro‘yxatdan o‘tish
          </button>
          <a href="#testlar" class="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors">
            Testni boshlash
          </a>
        </div>
      `;
      return;
    }

    // 2. AUTHENTICATED USER — Calculate dynamically from active user's storage
    const history = window.OSON_STORAGE?.getTestHistory?.() || [];
    if (history.length === 0) {
      if (badgeEl) {
        badgeEl.textContent = '0% • Yangi';
        badgeEl.className = 'px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold';
      }
      scoreBoxEl.innerHTML = `
        <div class="w-16 h-16 mx-auto rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-2">
          <span class="text-xl font-black text-slate-400">0%</span>
        </div>
        <h5 class="font-bold text-xs text-slate-800 dark:text-slate-200">Hali test yechilmadi</h5>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">1-testni boshlang va natijangizni ko‘ring</p>
        <div class="mt-2.5">
          <a href="#testlar" class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
            <i class="fa-solid fa-play text-[10px]"></i> 1-testni boshlash
          </a>
        </div>
      `;
      return;
    }

    // User has test history: compute average & latest
    let totalPerc = 0;
    history.forEach(t => {
      const p = t.percent !== undefined ? t.percent : (t.total ? Math.round((t.score / t.total) * 100) : 0);
      totalPerc += p;
    });
    const avgPercent = Math.min(100, Math.max(0, Math.round(totalPerc / history.length)));
    const latestTest = history[history.length - 1];
    const latestScore = latestTest?.score || 0;
    const latestTotal = latestTest?.total || 20;

    let levelBadge = "Boshlang‘ich";
    let badgeClass = "px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-black";
    let strokeColor = "border-blue-600";
    let desc = "Ko‘proq mashq qilish tavsiya etiladi";
    let descClass = "text-blue-600 dark:text-blue-400";

    if (avgPercent >= 85) {
      levelBadge = "A’lo daraja";
      badgeClass = "px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-black";
      strokeColor = "border-emerald-600";
      desc = `O‘tish ehtimoli yuqori (${latestScore}/${latestTotal} to‘g‘ri)`;
      descClass = "text-emerald-700 dark:text-emerald-400";
    } else if (avgPercent >= 60) {
      levelBadge = "O‘rtacha daraja";
      badgeClass = "px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-black";
      strokeColor = "border-amber-500";
      desc = `Mashqlarni davom ettiring (${latestScore}/${latestTotal} to‘g‘ri)`;
      descClass = "text-amber-600 dark:text-amber-400";
    }

    if (badgeEl) {
      badgeEl.textContent = levelBadge;
      badgeEl.className = badgeClass;
    }

    scoreBoxEl.innerHTML = `
      <div class="w-20 h-20 mx-auto rounded-full border-4 ${strokeColor} border-t-transparent flex items-center justify-center mb-2 shadow-inner">
        <span class="text-2xl font-black text-slate-900 dark:text-white">${avgPercent}%</span>
      </div>
      <h5 class="font-bold text-xs text-slate-800 dark:text-slate-200">Davlat imtihoniga tayyorlik</h5>
      <p class="text-[11px] ${descClass} font-semibold mt-0.5">${desc}</p>
    `;
  }

  function updateSettingFromPage(key, val) {
    const settings = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.SETTINGS, {});
    settings[key] = val;
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.SETTINGS, settings);
    showToast('Sozlama saqlandi', 'success');
  }

  return {
    lockBodyScroll,
    unlockBodyScroll,
    closeAllModals,
    openModal,
    closeModal,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    showToast,
    initTheme,
    toggleDarkMode,
    openGlobalSearch,
    runGlobalSearch,
    setSearchKeyword,
    dispatchSearchResult,
    toggleNotifications,
    renderNotifications,
    markAllNotificationsRead,
    toggleAccountDropdown,
    closeAccountDropdown,
    SUPPORT_BOT_URL,
    openSupportBot,
    updateSettingsUI,
    setDailyTarget,
    renderFAQ,
    toggleFaq,
    submitContactForm,
    triggerConfetti,
    initEvents,
    handleResetProgress,
    renderCategoriesPage,
    handlePageSearch,
    setPageSearchFilter,
    clearPageSearch,
    renderSavedQuestionsPage,
    removeSavedQuestionItem,
    clearAllSavedQuestions,
    renderNotificationsPage,
    renderSettingsPage,
    updateSettingFromPage,
    updateHeroReadiness
  };
})();
