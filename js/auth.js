/**
 * OSON PRAVA — Authentication & Session Simulation
 * Handles frontend registration, login, demo profiles, and session updates
 */

window.OSON_AUTH = (function() {
  'use strict';

  // Get authenticated user (strictly requires valid session)
  function getUser() {
    const session = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.SESSION, null);
    if (!session || !session.token) {
      return null;
    }
    const user = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.USER, null);
    if (!user) return null;

    // Normalize demo user if legacy session exists in localStorage
    if (user.id === 'demo-user' || user.id === 'user_demo_1' || user.isDemo || user.email === 'demo@osonprava.uz' || user.email === 'abror@osonprava.uz') {
      user.id = 'demo-user';
      user.name = 'Demo User';
      user.email = 'demo@osonprava.uz';
      user.username = 'demo';
      user.avatar = 'DU';
      user.accountType = 'demo';
      user.status = 'Demo';
      user.isDemo = true;
      user.plan = 'Demo account';
    }
    return user;
  }

  // Check login state
  function isAuthenticated() {
    return !!getUser();
  }

  // Create persistent session helper
  function createSession(userId, email) {
    const sessionToken = 'ses_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    const session = {
      token: sessionToken,
      userId: userId,
      email: email,
      createdAt: new Date().toISOString()
    };
    window.OSON_STORAGE.remove(window.OSON_STORAGE.KEYS.LOGGED_OUT);
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.SESSION, session);
    return session;
  }

  // Users Registry helpers
  function getUsersRegistry() {
    return window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.USERS, {}) || {};
  }

  function saveUserToRegistry(user) {
    if (!user || !user.email) return;
    const reg = getUsersRegistry();
    reg[user.email.toLowerCase()] = user;
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.USERS, reg);
  }

  function findUserByEmail(email) {
    if (!email) return null;
    const reg = getUsersRegistry();
    return reg[email.toLowerCase()] || null;
  }

  // Login
  function login(email, password) {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Iltimos, to‘g‘ri elektron pochta manzilini kiriting!' };
    }
    if (!password || password.length < 5) {
      return { success: false, message: 'Parol kamida 5 ta belgidan iborat bo‘lishi kerak!' };
    }

    // Check registered users registry first
    let user = findUserByEmail(email);
    if (!user) {
      // Check existing active user or create new stable user
      const existingUser = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.USER, null);
      if (existingUser && existingUser.email && existingUser.email.toLowerCase() === email.toLowerCase()) {
        user = existingUser;
      } else {
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const stableId = 'user_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        user = {
          id: stableId,
          name: formattedName,
          email: email,
          avatar: formattedName.substring(0, 2).toUpperCase(),
          examDate: '2026-10-20',
          streak: 0,
          lastActiveDate: window.OSON_STORAGE.getTodayString(),
          createdAt: new Date().toISOString().split('T')[0]
        };
      }
      saveUserToRegistry(user);
    }

    createSession(user.id, user.email);
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.USER, user);
    syncAuthUI();
    return { success: true, user, message: 'Tizimga muvaffaqiyatli kirdingiz!' };
  }

  // Demo Login (Instant access)
  function loginDemo() {
    const demoUser = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@osonprava.uz',
      username: 'demo',
      avatar: 'DU',
      accountType: 'demo',
      status: 'Demo',
      isDemo: true,
      examDate: '2026-10-15',
      streak: 4,
      isPro: false,
      plan: 'Demo account',
      lastActiveDate: window.OSON_STORAGE.getTodayString(),
      createdAt: '2026-08-20'
    };
    saveUserToRegistry(demoUser);
    createSession(demoUser.id, demoUser.email);
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.USER, demoUser);
    syncAuthUI();
    return { success: true, user: demoUser, message: 'Demo hisob bilan tizimga kirdingiz!' };
  }

  // Register
  function register(name, email, password, confirmPassword) {
    if (!name || name.trim().length < 2) {
      return { success: false, message: 'Iltimos, to‘liq ismingizni kiriting!' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Yaroqli elektron pochta manzilini kiriting!' };
    }
    if (!password || password.length < 5) {
      return { success: false, message: 'Parol kamida 5 ta belgidan iborat bo‘lishi lozim!' };
    }
    if (password !== confirmPassword) {
      return { success: false, message: 'Kiritilgan parollar bir-biriga mos kelmadi!' };
    }

    const initials = name
      .trim()
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const stableId = 'user_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newUser = {
      id: stableId,
      name: name.trim(),
      email: email.trim(),
      avatar: initials || 'OP',
      examDate: '2026-11-01',
      streak: 0,
      isPro: false,
      plan: 'Standart',
      lastActiveDate: window.OSON_STORAGE.getTodayString(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    saveUserToRegistry(newUser);
    createSession(newUser.id, newUser.email);
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.USER, newUser);
    syncAuthUI();
    return { success: true, user: newUser, message: 'Hisobingiz muvaffaqiyatli yaratildi!' };
  }

  // Update profile
  function updateProfile(updatedData) {
    const user = getUser();
    if (!user) return { success: false, message: 'Foydalanuvchi tizimga kirmagan!' };

    const merged = { ...user, ...updatedData };
    if (updatedData.name) {
      merged.avatar = updatedData.name
        .trim()
        .split(' ')
        .map(p => p.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    }

    saveUserToRegistry(merged);
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.USER, merged);
    syncAuthUI();
    return { success: true, user: merged, message: 'Profilingiz muvaffaqiyatli yangilandi!' };
  }

  // Logout
  function logout() {
    window.OSON_STORAGE.remove(window.OSON_STORAGE.KEYS.SESSION);
    window.OSON_STORAGE.remove(window.OSON_STORAGE.KEYS.USER);
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.LOGGED_OUT, true);
    
    // Close account dropdown immediately
    const dropdown = document.getElementById('account-dropdown');
    if (dropdown) dropdown.classList.add('hidden');

    // Close certificate modal if open
    if (window.OSON_UI && typeof window.OSON_UI.closeModal === 'function') {
      window.OSON_UI.closeModal('certificate-modal');
    }

    syncAuthUI();
    return { success: true, message: 'Tizimdan muvaffaqiyatli chiqdingiz!' };
  }

  // Sync Header & Navigation UI
  function syncAuthUI() {
    const user = getUser();
    const guestNav = document.getElementById('nav-guest-actions');
    const userNav = document.getElementById('nav-user-actions');
    const notifContainer = document.getElementById('header-notif-container');
    const mobileAuthContainer = document.getElementById('mobile-auth-container');
    const userAvatarText = document.querySelectorAll('.user-avatar-text');
    const userNameText = document.querySelectorAll('.user-name-text');
    const userEmailText = document.querySelectorAll('.user-email-text');
    const userPlanBadge = document.querySelectorAll('.user-plan-badge');
    const userStreakBadge = document.querySelectorAll('.user-streak-badge');

    if (user) {
      // 1. Authenticated State: Show Avatar + Name, Hide Guest button
      if (guestNav) {
        guestNav.classList.add('hidden');
        guestNav.classList.remove('flex');
      }
      if (userNav) {
        userNav.classList.remove('hidden');
        userNav.classList.add('flex', 'flex-shrink-0');
      }
      if (notifContainer) {
        notifContainer.classList.remove('hidden');
      }

      userAvatarText.forEach(el => el.textContent = user.avatar || (user.isDemo ? 'DU' : 'OP'));
      userNameText.forEach(el => el.textContent = user.name || (user.isDemo ? 'Demo User' : 'Foydalanuvchi'));
      userEmailText.forEach(el => el.textContent = user.email || (user.isDemo ? 'demo@osonprava.uz' : 'foydalanuvchi@osonprava.uz'));
      
      // Header DEMO status badge
      const headerStatusBadge = document.getElementById('header-user-status-badge');
      if (headerStatusBadge) {
        if (user.isDemo) {
          headerStatusBadge.className = 'px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white tracking-wider uppercase shadow-xs';
          headerStatusBadge.textContent = 'DEMO';
          headerStatusBadge.classList.remove('hidden');
        } else {
          headerStatusBadge.className = 'hidden';
          headerStatusBadge.classList.add('hidden');
          headerStatusBadge.textContent = '';
        }
      }

      const planText = user.isDemo ? 'Demo account' : (user.isPro ? 'PRO Haydovchi' : 'Standart a’zo');
      userPlanBadge.forEach(el => {
        if (user.isDemo) {
          el.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-[9px] mr-1"></i> DEMO';
          el.className = 'user-plan-badge px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm tracking-wider uppercase flex items-center';
        } else if (user.isPro) {
          el.textContent = planText;
          el.className = 'user-plan-badge px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm';
        } else {
          el.textContent = planText;
          el.className = 'user-plan-badge px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
        }
      });

      userStreakBadge.forEach(el => {
        el.innerHTML = `<i class="fa-solid fa-fire text-amber-500 mr-1"></i> ${user.streak !== undefined ? user.streak : 0} kun`;
      });

      // Render Mobile Drawer Logged-in Card
      if (mobileAuthContainer) {
        const badgeHtml = user.isDemo 
          ? '<span class="px-1.5 py-0.5 rounded bg-amber-500 text-white font-black text-[9px]">DEMO</span>'
          : (user.isPro ? '<span class="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px]">PRO</span>' : '');

        mobileAuthContainer.innerHTML = `
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                ${user.avatar || (user.isDemo ? 'DU' : 'OP')}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">${user.name}</h4>
                  ${badgeHtml}
                </div>
                <p class="text-xs text-slate-400 truncate">${user.email}</p>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
              <a href="#profil" 
                 class="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs text-center"
                 onclick="if(window.OSON_UI) window.OSON_UI.closeMobileMenu();">
                Mening profilim
              </a>
              <button type="button" 
                      class="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center gap-1.5"
                      onclick="window.OSON_AUTH.logout(); window.OSON_UI.showToast('Tizimdan chiqildi', 'info'); if(window.OSON_UI) window.OSON_UI.closeMobileMenu();">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Chiqish
              </button>
            </div>
          </div>
        `;
      }

    } else {
      // 2. Guest State: Show ONLY "Kirish", Hide Avatar, Dropdown & Logged-in Controls
      if (guestNav) {
        guestNav.classList.remove('hidden');
        guestNav.classList.add('flex');
      }
      if (userNav) {
        userNav.classList.add('hidden');
        userNav.classList.remove('flex', 'flex-shrink-0');
      }
      if (notifContainer) {
        notifContainer.classList.add('hidden');
      }
      const dropdown = document.getElementById('account-dropdown');
      if (dropdown) dropdown.classList.add('hidden');

      // Render Mobile Drawer Guest Card
      if (mobileAuthContainer) {
        mobileAuthContainer.innerHTML = `
          <div class="space-y-2">
            <button type="button" 
                    class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm btn-press"
                    onclick="window.OSON_UI.openModal('auth-modal'); if(window.OSON_UI) window.OSON_UI.closeMobileMenu();">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Kirish</span>
            </button>
          </div>
        `;
      }
    }

    // Refresh profile & dashboard views
    if (window.OSON_PROFILE && typeof window.OSON_PROFILE.renderProfile === 'function') {
      window.OSON_PROFILE.renderProfile();
    }
    if (window.OSON_PROFILE && typeof window.OSON_PROFILE.renderDashboard === 'function') {
      window.OSON_PROFILE.renderDashboard();
    }
    if (window.OSON_LESSONS && typeof window.OSON_LESSONS.renderLessons === 'function') {
      window.OSON_LESSONS.renderLessons();
    }
    if (window.OSON_UI && typeof window.OSON_UI.updateHeroReadiness === 'function') {
      window.OSON_UI.updateHeroReadiness();
    }
  }

  // Handle Standalone Login View Form Submit
  function handleStandaloneLogin(event) {
    if (event) event.preventDefault();
    const email = document.getElementById('login-page-email')?.value;
    const password = document.getElementById('login-page-password')?.value;
    const res = login(email, password);
    if (res.success) {
      if (window.OSON_UTILS) window.OSON_UTILS.showToast(res.message, 'success');
      window.location.hash = '#dashboard';
    } else {
      if (window.OSON_UTILS) window.OSON_UTILS.showToast(res.message, 'error');
    }
  }

  // Handle Standalone Register View Form Submit
  function handleStandaloneRegister(event) {
    if (event) event.preventDefault();
    const name = document.getElementById('reg-page-name')?.value;
    const email = document.getElementById('reg-page-email')?.value;
    const password = document.getElementById('reg-page-password')?.value;
    const res = register(name, email, password, password);
    if (res.success) {
      if (window.OSON_UTILS) window.OSON_UTILS.showToast(res.message, 'success');
      window.location.hash = '#dashboard';
    } else {
      if (window.OSON_UTILS) window.OSON_UTILS.showToast(res.message, 'error');
    }
  }

  return {
    getUser,
    isAuthenticated,
    login,
    loginDemo,
    register,
    updateProfile,
    logout,
    syncAuthUI,
    handleStandaloneLogin,
    handleStandaloneRegister
  };
})();
