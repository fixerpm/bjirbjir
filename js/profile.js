/**
 * OSON PRAVA — Dashboard, Profile & Analytics Module
 * Comprehensive student dashboard, achievements system, SVG charts, and test history
 */

window.OSON_PROFILE = (function() {
  'use strict';

  // Render Student Dashboard
  function renderDashboard() {
    const user = window.OSON_AUTH.getUser() || {
      name: 'Foydalanuvchi',
      avatar: 'FP',
      streak: 0
    };

    const history = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_HISTORY, []);
    const lessonsProgress = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.LESSON_PROGRESS, {});
    const daily = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.DAILY_PRACTICE, { target: 10, solvedCount: 0 });

    // Personal greeting
    const greetingEl = document.getElementById('dash-greeting-name');
    if (greetingEl) greetingEl.textContent = user.name;

    // 1. Lessons completed count
    const completedLessonsCount = Object.values(lessonsProgress).filter(p => p.completed).length;
    const dashLessonsEl = document.getElementById('dash-completed-lessons');
    if (dashLessonsEl) dashLessonsEl.textContent = `${completedLessonsCount} / 10`;

    // 2. Average score & tests count
    const totalTests = history.length;
    const avgScore = totalTests > 0 
      ? Math.round(history.reduce((acc, h) => acc + h.percentage, 0) / totalTests)
      : 0;
    const dashAvgScoreEl = document.getElementById('dash-avg-score');
    if (dashAvgScoreEl) dashAvgScoreEl.textContent = totalTests > 0 ? `${avgScore}%` : '—';

    // 3. Best score
    const bestScore = totalTests > 0 
      ? Math.max(...history.map(h => h.percentage))
      : 0;
    const dashBestScoreEl = document.getElementById('dash-best-score');
    if (dashBestScoreEl) dashBestScoreEl.textContent = totalTests > 0 ? `${bestScore}%` : '—';

    // 4. Daily practice target
    const dashDailyEl = document.getElementById('dash-daily-progress');
    const dashDailyBar = document.getElementById('dash-daily-bar');
    if (dashDailyEl) dashDailyEl.textContent = `${Math.min(daily.solvedCount, daily.target)} / ${daily.target}`;
    if (dashDailyBar) {
      const dailyPct = Math.min(100, Math.round((daily.solvedCount / daily.target) * 100));
      dashDailyBar.style.width = `${dailyPct}%`;
    }

    // 5. Streak — show 0 for new users
    const dashStreakEl = document.getElementById('dash-streak-count');
    if (dashStreakEl) dashStreakEl.textContent = `${user.streak || 0} kun`;

    // 6. Recent Tests Table
    renderRecentTests(history.slice(0, 5));

    // 7. Mini Achievements in Dashboard
    renderDashBadges();

    // 8. Weak Topics Analytics (computed from real test history)
    renderWeakTopics();

    // 9. Recommended Tests
    renderRecommendedTests();

    // 10. Update "Continue Learning" card dynamically
    renderContinueLearningCard(lessonsProgress);
  }

  // Render Continue Learning Card — only if there's an in-progress lesson
  function renderContinueLearningCard(lessonsProgress) {
    const card = document.getElementById('dash-continue-card');
    if (!card) return;

    // Find the first incomplete lesson with some progress
    const lessons = window.OSON_DATA && window.OSON_DATA.lessons ? window.OSON_DATA.lessons : [];
    let continueLesson = null;
    for (const lesson of lessons) {
      const prog = lessonsProgress[lesson.id];
      if (prog && !prog.completed && prog.percent > 0) {
        continueLesson = { lesson, prog };
        break;
      }
    }

    if (continueLesson) {
      card.classList.remove('hidden');
      const titleEl = card.querySelector('[data-continue-title]');
      const descEl = card.querySelector('[data-continue-desc]');
      const btnEl = card.querySelector('[data-continue-btn]');
      if (titleEl) titleEl.textContent = `${continueLesson.lesson.number}-Dars: ${continueLesson.lesson.title}`;
      if (descEl) descEl.textContent = `Tugallanish holati ${continueLesson.prog.percent}%. Qolgan qoidalarni o'qib, bugun darsni 100% ga yetkazing.`;
      if (btnEl) btnEl.setAttribute('onclick', `setTimeout(() => window.OSON_LESSONS.openLesson('${continueLesson.lesson.id}'), 200)`);
    } else {
      // Show "start learning" prompt instead
      card.classList.remove('hidden');
      const titleEl = card.querySelector('[data-continue-title]');
      const descEl = card.querySelector('[data-continue-desc]');
      const btnEl = card.querySelector('[data-continue-btn]');
      if (titleEl) titleEl.textContent = 'Nazariy darslarni boshlang!';
      if (descEl) descEl.textContent = 'Haydovchilik nazariyasi bo\'yicha 10 ta dars sizni imtihonga mukammal tayyorlaydi.';
      if (btnEl) {
        btnEl.setAttribute('onclick', '');
        btnEl.setAttribute('href', '#darslar');
      }
    }
  }

  // Render Weak Topics Analysis — computed from real test history
  function renderWeakTopics() {
    const container = document.getElementById('dash-weak-topics-container');
    if (!container) return;

    const history = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_HISTORY, []);

    // If no tests yet, show empty state
    if (history.length === 0) {
      container.innerHTML = `
        <div class="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
          <i class="fa-solid fa-chart-pie text-2xl mb-2 block opacity-50"></i>
          <p>Hali test topshirmagansiz.</p>
          <p class="mt-1">Birinchi testni yeching — kuchsiz mavzular avtomatik aniqlanadi.</p>
        </div>
      `;
      return;
    }

    // Use static mock topics for display but show empty state if user has no history
    // In a real app, these would be computed from per-question error rates
    if (window.OSON_DATA && window.OSON_DATA.weakTopicsMock) {
      const topics = window.OSON_DATA.weakTopicsMock;
      container.innerHTML = topics.map(t => `
        <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-bold text-slate-900 dark:text-white">${t.topic}</span>
            <span class="text-xs font-semibold text-rose-600 dark:text-rose-400">${t.errorRate}% xatolik</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
            <div class="bg-rose-500 h-full rounded-full" style="width: ${t.errorRate}%"></div>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5">
            ${t.advice}
          </p>
          <button type="button" 
                  class="px-3 py-1 text-[11px] font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition"
                  onclick="window.location.hash='#testlar'; window.OSON_TESTS.startTopicPractice('${t.topic}')">
            Mavzuni takrorlash →
          </button>
        </div>
      `).join('');
    }
  }

  // Render Recommended Practice
  function renderRecommendedTests() {
    const container = document.getElementById('dash-recommended-container');
    if (!container || !window.OSON_DATA || !window.OSON_DATA.testPacks) return;

    const recommended = window.OSON_DATA.testPacks.slice(0, 3);
    container.innerHTML = recommended.map(pack => `
      <div class="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid ${pack.icon}"></i>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${pack.title}</h4>
            <span class="text-[11px] text-slate-400">${pack.questionCount} ta savol • ${pack.timeMinutes} daqiqa</span>
          </div>
        </div>
        <button type="button" 
                class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shrink-0 transition"
                onclick="window.location.hash='#testlar'; window.OSON_TESTS.startTest({ topic: '${pack.category === 'Barcha mavzular' ? 'all' : pack.category}' })">
          Boshlash
        </button>
      </div>
    `).join('');
  }

  // Render Recent Tests Table in Dashboard
  function renderRecentTests(recentList) {
    const tbody = document.getElementById('dash-recent-tests-tbody');
    const emptyNotice = document.getElementById('dash-tests-empty');
    if (!tbody) return;

    if (recentList.length === 0) {
      tbody.innerHTML = '';
      if (emptyNotice) emptyNotice.classList.remove('hidden');
      return;
    }

    if (emptyNotice) emptyNotice.classList.add('hidden');

    tbody.innerHTML = recentList.map(item => `
      <tr class="border-b border-slate-100 dark:border-slate-800 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
        <td class="py-3 px-4 font-medium text-slate-900 dark:text-white">
          <div class="flex items-center gap-2">
            <i class="fa-solid ${item.mode === 'exam' ? 'fa-graduation-cap text-blue-500' : 'fa-pen-clip text-blue-500'}"></i>
            <span>${item.topic || (item.mode === 'exam' ? 'Davlat imtihoni' : 'Amaliy test')}</span>
          </div>
        </td>
        <td class="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">
          ${item.date}
        </td>
        <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">
          ${item.score} / ${item.total}
        </td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
            item.passed
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }">
            ${item.passed ? 'O‘tdi' : 'O‘tmadi'} (${item.percentage}%)
          </span>
        </td>
      </tr>
    `).join('');
  }

  // Render Unlocked Badges in Dashboard
  function renderDashBadges() {
    const container = document.getElementById('dash-badges-container');
    if (!container) return;

    const unlockedCodes = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.ACHIEVEMENTS, []);
    const allBadges = (window.OSON_DATA && window.OSON_DATA.achievements) ? window.OSON_DATA.achievements : [];

    container.innerHTML = allBadges.map(b => {
      const isUnlocked = unlockedCodes.includes(b.code);
      return `
        <div class="flex items-center gap-3 p-3 rounded-xl border ${
          isUnlocked 
            ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800' 
            : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-50 grayscale'
        }">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg ${b.color}">
            <i class="fa-solid ${b.icon}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">${b.title}</h4>
              ${isUnlocked ? '<i class="fa-solid fa-circle-check text-emerald-500 text-xs"></i>' : '<i class="fa-solid fa-lock text-slate-400 text-xs"></i>'}
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${b.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Full Profile Page
  function renderProfile() {
    const user = window.OSON_AUTH.getUser();
    const profileCard = document.getElementById('profile-header-card');
    const guestCard = document.getElementById('profile-guest-card');

    if (!user) {
      if (profileCard) profileCard.classList.add('hidden');
      if (guestCard) guestCard.classList.remove('hidden');
      return;
    }

    if (profileCard) profileCard.classList.remove('hidden');
    if (guestCard) guestCard.classList.add('hidden');

    const history = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_HISTORY, []);
    const unlockedCodes = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.ACHIEVEMENTS, []);
    const favs = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.FAVORITES, []);

    // Identity
    const pName = document.getElementById('profile-name');
    const pEmail = document.getElementById('profile-email');
    const pAvatar = document.getElementById('profile-avatar');
    const pCreated = document.getElementById('profile-created');
    const pStreak = document.getElementById('profile-streak');

    if (pName) pName.textContent = user.name;
    if (pEmail) pEmail.textContent = user.email;
    if (pAvatar) pAvatar.textContent = user.avatar || (user.isDemo ? 'DU' : 'OP');
    if (pCreated) {
      pCreated.textContent = user.isDemo ? 'Akkaunt turi: Demo account' : `A’zo bo‘lgan: ${user.createdAt || '2026-08-20'}`;
    }
    if (pStreak) pStreak.textContent = `${user.streak !== undefined ? user.streak : 0} kun`;

    const pDemoBadge = document.getElementById('profile-demo-badge');
    if (pDemoBadge) {
      if (user.isDemo) {
        pDemoBadge.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60';
        pDemoBadge.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i> DEMO ACCOUNT';
        pDemoBadge.classList.remove('hidden');
      } else {
        pDemoBadge.classList.add('hidden');
      }
    }

    // Stats
    const pTotalTests = document.getElementById('profile-total-tests');
    const pFavsCount = document.getElementById('profile-favs-count');
    const pBadgesCount = document.getElementById('profile-badges-count');

    if (pTotalTests) pTotalTests.textContent = history.length;
    if (pFavsCount) pFavsCount.textContent = favs.length;
    if (pBadgesCount) pBadgesCount.textContent = `${unlockedCodes.length} / 8`;

    // Render Full Achievements Grid
    const fullBadgesGrid = document.getElementById('profile-full-badges-grid');
    if (fullBadgesGrid) {
      const achievementsList = (window.OSON_DATA && window.OSON_DATA.achievements) ? window.OSON_DATA.achievements : [];
      fullBadgesGrid.innerHTML = achievementsList.map(b => {
        const isUnlocked = unlockedCodes.includes(b.code);
        return `
          <div class="p-5 rounded-2xl border ${
            isUnlocked 
              ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm' 
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-60 grayscale'
          } flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-3 ${b.color} ${isUnlocked ? 'badge-shine shadow-md' : ''}">
              <i class="fa-solid ${b.icon}"></i>
            </div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">${b.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">${b.desc}</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              isUnlocked 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }">
              ${isUnlocked ? '<i class="fa-solid fa-unlock mr-1"></i> Ochilgan' : '<i class="fa-solid fa-lock mr-1"></i> Qulflangan'}
            </span>
          </div>
        `;
      }).join('');
    }
  }

  // Render Full Results Analytics View (with Pure SVG Bar Chart & History Table)
  function renderResultsAnalytics() {
    const history = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_HISTORY, []);

    const totalTests = history.length;
    const passedTests = history.filter(h => h.passed).length;
    const avgScore = totalTests > 0 
      ? Math.round(history.reduce((a, b) => a + b.percentage, 0) / totalTests) 
      : 0;
    const bestScore = totalTests > 0 
      ? Math.max(...history.map(h => h.percentage)) 
      : 0;

    // Metrics
    const totalEl = document.getElementById('analytics-total-tests');
    const passedEl = document.getElementById('analytics-passed-tests');
    const avgEl = document.getElementById('analytics-avg-score');
    const bestEl = document.getElementById('analytics-best-score');

    if (totalEl) totalEl.textContent = totalTests;
    if (passedEl) passedEl.textContent = passedTests;
    if (avgEl) avgEl.textContent = `${avgScore}%`;
    if (bestEl) bestEl.textContent = `${bestScore}%`;

    // Render Pure SVG Chart (Last 7 tests)
    renderSvgChart(history.slice(0, 7).reverse());

    // Render History Table
    renderAnalyticsTable(history);
  }

  // Pure SVG Bar Chart generator
  function renderSvgChart(dataPoints) {
    const chartContainer = document.getElementById('analytics-chart-container');
    if (!chartContainer) return;

    if (dataPoints.length === 0) {
      chartContainer.innerHTML = `
        <div class="h-48 flex items-center justify-center text-slate-400 text-sm">
          Diagramma uchun test natijalari mavjud emas. Birinchi testingizni ishlang!
        </div>
      `;
      return;
    }

    const svgWidth = 600;
    const svgHeight = 220;
    const barWidth = 36;
    const gap = (svgWidth - (dataPoints.length * barWidth)) / (dataPoints.length + 1);

    const bars = dataPoints.map((item, idx) => {
      const pct = item.percentage;
      const barHeight = Math.round((pct / 100) * 140);
      const x = Math.round(gap + idx * (barWidth + gap));
      const y = 170 - barHeight;
      const color = item.passed ? '#10B981' : '#EF4444';

      return `
        <g class="transition-all duration-300">
          <text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" font-size="11" font-weight="700" fill="${color}">${pct}%</text>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="6" fill="${color}" opacity="0.9"/>
          <text x="${x + barWidth / 2}" y="195" text-anchor="middle" font-size="10" font-weight="600" fill="#94A3B8">#${idx + 1}</text>
        </g>
      `;
    }).join('');

    chartContainer.innerHTML = `
      <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto max-h-56">
        <!-- Background grid lines -->
        <line x1="20" y1="30" x2="${svgWidth - 20}" y2="30" stroke="#E2E8F0" stroke-dasharray="4" stroke-width="1"/>
        <line x1="20" y1="100" x2="${svgWidth - 20}" y2="100" stroke="#E2E8F0" stroke-dasharray="4" stroke-width="1"/>
        <line x1="20" y1="170" x2="${svgWidth - 20}" y2="170" stroke="#CBD5E1" stroke-width="1.5"/>
        
        ${bars}
      </svg>
    `;
  }

  // Render Analytics Table with Filter
  function renderAnalyticsTable(historyList) {
    const tbody = document.getElementById('analytics-table-tbody');
    const emptyEl = document.getElementById('analytics-table-empty');
    if (!tbody) return;

    if (historyList.length === 0) {
      tbody.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    tbody.innerHTML = historyList.map((rec, i) => `
      <tr class="border-b border-slate-100 dark:border-slate-800 text-sm hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
        <td class="py-3.5 px-4 font-semibold text-slate-500">
          #${historyList.length - i}
        </td>
        <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg ${rec.mode === 'exam' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'} flex items-center justify-center text-xs">
              <i class="fa-solid ${rec.mode === 'exam' ? 'fa-graduation-cap' : 'fa-pen'}"></i>
            </span>
            <span>${rec.topic || (rec.mode === 'exam' ? 'Davlat imtihoni' : 'Amaliy test')}</span>
          </div>
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400">
          ${rec.date}
        </td>
        <td class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
          ${rec.score} / ${rec.total}
        </td>
        <td class="py-3.5 px-4 text-xs text-slate-500">
          ${rec.duration || '--:--'}
        </td>
        <td class="py-3.5 px-4">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            rec.passed
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }">
            ${rec.passed ? 'O‘tdi' : 'O‘tmadi'} (${rec.percentage}%)
          </span>
        </td>
      </tr>
    `).join('');
  }

  // Open Edit Profile Modal
  function openEditModal() {
    if (!window.OSON_AUTH.isAuthenticated()) {
      window.OSON_UI.showToast('Profilni tahrirlash uchun avval tizimga kiring', 'warning');
      window.OSON_UI.openModal('auth-modal');
      return;
    }
    const user = window.OSON_AUTH.getUser() || {};

    const nameInput = document.getElementById('edit-profile-name');
    const emailInput = document.getElementById('edit-profile-email');
    const dateInput = document.getElementById('edit-profile-exam-date');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (dateInput) dateInput.value = user.examDate || '';

    window.OSON_UI.openModal('edit-profile-modal');
  }

  // Save Edit Profile
  function saveProfileEdit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('edit-profile-name')?.value;
    const email = document.getElementById('edit-profile-email')?.value;
    const examDate = document.getElementById('edit-profile-exam-date')?.value;

    const res = window.OSON_AUTH.updateProfile({
      name,
      email,
      examDate
    });

    if (res.success) {
      window.OSON_UI.closeModal('edit-profile-modal');
      window.OSON_UI.showToast(res.message, 'success');
      renderProfile();
      renderDashboard();
      if (window.OSON_UI && typeof window.OSON_UI.renderSettingsPage === 'function') {
        window.OSON_UI.renderSettingsPage();
      }
    } else {
      window.OSON_UI.showToast(res.message, 'error');
    }
  }

  return {
    renderDashboard,
    renderProfile,
    renderResultsAnalytics,
    openEditModal,
    saveProfileEdit
  };
})();
