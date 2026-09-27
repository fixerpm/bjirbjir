/**
 * OSON PRAVA — Main Application Bootstrap & Router
 * Hash navigation, animated statistics counters, event delegation, and initialization
 */

(function() {
  'use strict';

  // Navigation Router
  function handleRouting() {
    let hash = window.location.hash || '#bosh-sahifa';
    if (!hash.startsWith('#')) hash = '#' + hash;

    // Supported routes
    const routes = [
      '#bosh-sahifa',
      '#simulyator',
      '#ai-murabbiy',
      '#jarimalar',
      '#tariflar',
      '#qoidalar',
      '#belgilar',
      '#darslar',
      '#testlar',
      '#imtihon',
      '#dashboard',
      '#natijalar',
      '#profil',
      '#faq',
      '#haqida',
      '#aloqa',
      '#kategoriyalar',
      '#qidiruv',
      '#saqlanganlar',
      '#sozlamalar',
      '#bildirishnomalar',
      '#login',
      '#register'
    ];

    const activeRoute = routes.includes(hash) ? hash : '#bosh-sahifa';
    const sectionId = 'view-' + activeRoute.substring(1);

    // Hide all view sections and show active
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === activeRoute) {
        link.classList.add('active', 'text-blue-600', 'dark:text-blue-400', 'font-bold');
        link.classList.remove('text-slate-600', 'dark:text-slate-300');
      } else {
        link.classList.remove('active', 'text-blue-600', 'dark:text-blue-400', 'font-bold');
        link.classList.add('text-slate-600', 'dark:text-slate-300');
      }
    });

    // Update active mobile bottom dock items
    document.querySelectorAll('.dock-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === activeRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Close mobile menu, all modals/drawers and restore scroll on route change
    if (window.OSON_UI && typeof window.OSON_UI.closeMobileMenu === 'function') {
      window.OSON_UI.closeMobileMenu();
    }
    if (window.OSON_UI && typeof window.OSON_UI.closeAllModals === 'function') {
      window.OSON_UI.closeAllModals();
    } else if (typeof window.unlockBodyScroll === 'function') {
      window.unlockBodyScroll(true);
    }

    // Dynamic rendering hooks per view
    if ((activeRoute === '#simulyator' || activeRoute === '#bosh-sahifa') && window.OSON_SIMULATOR) {
      window.OSON_SIMULATOR.renderSimulator();
    }
    if (activeRoute === '#jarimalar' && window.OSON_FINES) {
      window.OSON_FINES.init();
    }
    if (activeRoute === '#ai-murabbiy' && window.OSON_AI) {
      window.OSON_AI.init();
    }
    if (activeRoute === '#dashboard' && window.OSON_PROFILE) {
      window.OSON_PROFILE.renderDashboard();
    } else if (activeRoute === '#profil' && window.OSON_PROFILE) {
      window.OSON_PROFILE.renderProfile();
    } else if (activeRoute === '#natijalar' && window.OSON_PROFILE) {
      window.OSON_PROFILE.renderResultsAnalytics();
    } else if (activeRoute === '#belgilar' && window.OSON_SIGNS) {
      window.OSON_SIGNS.renderSigns();
    } else if (activeRoute === '#darslar' && window.OSON_LESSONS) {
      window.OSON_LESSONS.renderLessons();
    } else if (activeRoute === '#qoidalar' && window.OSON_LESSONS) {
      window.OSON_LESSONS.renderRules();
    } else if (activeRoute === '#kategoriyalar' && window.OSON_UI) {
      window.OSON_UI.renderCategoriesPage();
    } else if (activeRoute === '#qidiruv' && window.OSON_UI) {
      window.OSON_UI.handlePageSearch('');
    } else if (activeRoute === '#saqlanganlar' && window.OSON_UI) {
      window.OSON_UI.renderSavedQuestionsPage();
    } else if (activeRoute === '#sozlamalar' && window.OSON_UI) {
      window.OSON_UI.renderSettingsPage();
    } else if (activeRoute === '#bildirishnomalar' && window.OSON_UI) {
      window.OSON_UI.renderNotificationsPage();
    } else if (activeRoute === '#testlar' && window.OSON_TESTS) {
      window.OSON_TESTS.renderTestPacks();
    } else if (activeRoute === '#faq' && window.OSON_UI) {
      window.OSON_UI.renderFAQ();
    }
  }

  // Animated Statistics Numbers Counter
  function initStatCounters() {
    const statsSection = document.getElementById('statistics-section');
    if (!statsSection) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateValue('stat-questions', 0, 50, 1000, '+');
          animateValue('stat-scenarios', 0, 8, 800, ' ta');
          animateValue('stat-signs', 0, 26, 900, ' ta');
          animateValue('stat-lessons', 0, 10, 800, ' ta');
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }

  function animateValue(id, start, end, duration, suffix = '') {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      obj.textContent = val.toLocaleString() + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Setup Auth Forms and Modal triggers
  function initAuthForms() {
    // Login form
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        const res = window.OSON_AUTH.login(email, password);
        if (res.success) {
          window.OSON_UI.closeModal('auth-modal');
          window.OSON_AUTH.syncAuthUI();
          window.location.hash = '#dashboard';
          window.OSON_UI.showToast(res.message, 'success');
        } else {
          window.OSON_UI.showToast(res.message, 'error');
        }
      });
    }

    // Register form
    const regForm = document.getElementById('form-register');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name')?.value;
        const email = document.getElementById('reg-email')?.value;
        const password = document.getElementById('reg-password')?.value;
        const confirmPass = document.getElementById('reg-confirm-password')?.value;

        const res = window.OSON_AUTH.register(name, email, password, confirmPass);
        if (res.success) {
          window.OSON_UI.closeModal('auth-modal');
          window.OSON_AUTH.syncAuthUI();
          window.location.hash = '#dashboard';
          window.OSON_UI.showToast(res.message, 'success');
        } else {
          window.OSON_UI.showToast(res.message, 'error');
        }
      });
    }
  }

  // Bootstrap Application
  document.addEventListener('DOMContentLoaded', () => {
    // 0. Telegram Mini App bridge: tells the Telegram client the page is
    // ready. Safe to call even outside Telegram (no-op there).
    if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.ready === 'function') {
      try { window.Telegram.WebApp.ready(); } catch (e) { /* ignore */ }
    }

    // 1. Theme & Global UI Events
    window.OSON_UI.initTheme();
    window.OSON_UI.initEvents();

    // 2. Authentication UI & Session Sync
    window.OSON_AUTH.syncAuthUI();
    initAuthForms();

    // 2b. Telegram certificate export hand-off (?cert_export=...): renders
    // and auto-downloads the certificate when this page was opened by
    // Telegram.WebApp.openLink() from inside the Mini App. No-op otherwise.
    if (window.OSON_CERTIFICATE && typeof window.OSON_CERTIFICATE.initFromUrlIfNeeded === 'function') {
      window.OSON_CERTIFICATE.initFromUrlIfNeeded();
    }

    // 3. Render Data Views
    window.OSON_SIGNS.renderSigns();
    window.OSON_LESSONS.renderLessons();
    window.OSON_LESSONS.renderRules();
    window.OSON_UI.renderFAQ();
    window.OSON_UI.renderNotifications();

    // 4. Initial Routing
    window.addEventListener('hashchange', handleRouting);
    handleRouting();

    // 5. Initialize Statistics Counter
    initStatCounters();

    // 6. Initialize Simulator
    if (window.OSON_SIMULATOR) {
      window.OSON_SIMULATOR.renderSimulator();
    }

    // 7. Register PWA Service Worker
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('[SW] ServiceWorker registration skipped:', err);
      });
    }
  });

  // Teaser Quiz Answer Handler on Homepage
  window.OSON_APP = {
    answerTeaser: function(choiceIdx) {
      const box = document.getElementById('teaser-result-box');
      if (!box) return;
      if (choiceIdx === 1) {
        box.className = 'mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-slide-up';
        box.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-base"></i> <span>Ajoyib! To‘g‘ri javob: Teng huquqli chorrahada o‘ngdan kelayotgan ustunlikka ega. Barcha testlarni sinab ko‘ring!</span>`;
      } else {
        box.className = 'mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-slide-up';
        box.innerHTML = `<i class="fa-solid fa-circle-xmark text-rose-600 text-base"></i> <span>Noto‘g‘ri! Qoidaga ko‘ra, o‘ng tomondan kelayotgan transport vositasi birinchi o‘tadi (O‘ng qo‘l qoidasi).</span>`;
      }
      box.classList.remove('hidden');
    }
  };
})();
