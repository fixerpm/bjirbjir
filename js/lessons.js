/**
 * OSON PRAVA — Lessons & Road Rules Module
 * Manages structured lesson curriculum, road rules knowledgebase, reading progress
 */

window.OSON_LESSONS = (function() {
  'use strict';

  let currentRuleCategory = 'all';
  let ruleSearchQuery = '';

  // Render Lessons List
  function renderLessons() {
    const container = document.getElementById('lessons-container');
    if (!container) return;

    const lessons = window.OSON_DATA.lessons;
    const isAuthed = window.OSON_AUTH && window.OSON_AUTH.isAuthenticated();
    const progressMap = isAuthed ? window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.LESSON_PROGRESS, {}) : {};

    container.innerHTML = lessons.map(lesson => {
      const prog = isAuthed ? (progressMap[lesson.id] || { completed: false, percent: 0 }) : { completed: false, percent: 0 };
      const isFav = isAuthed && window.OSON_STORAGE.isFavorite(lesson.id);

      return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-hover flex flex-col justify-between transition-all">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                ${lesson.number}-Dars
              </span>
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <i class="fa-regular fa-clock"></i> ${lesson.duration}
                </span>
                <button type="button" 
                        class="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onclick="window.OSON_LESSONS.toggleLessonFav('${lesson.id}', this)"
                        title="Sevimlilarga qo‘shish">
                  <i class="${isFav ? 'fa-solid text-amber-500' : 'fa-regular'} fa-star text-sm"></i>
                </button>
              </div>
            </div>

            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              ${lesson.title}
            </h3>

            <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
              ${lesson.summary}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-5">
              ${lesson.takeaways.map(t => `
                <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  # ${t}
                </span>
              `).join('')}
            </div>
          </div>

          <div>
            <div class="mb-3">
              <div class="flex justify-between items-center text-xs mb-1.5">
                <span class="text-slate-500 dark:text-slate-400">O‘zlashtirish</span>
                <span class="font-bold ${prog.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}">
                  ${prog.completed ? 'Tamomlangan (100%)' : (prog.percent > 0 ? `${prog.percent}%` : 'Boshlanmagan')}
                </span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ${prog.completed ? 'bg-emerald-500' : 'bg-blue-600'}" 
                     style="width: ${prog.completed ? 100 : prog.percent}%"></div>
              </div>
            </div>

            <button type="button" 
                    class="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all btn-press flex items-center justify-center gap-2 ${
                      prog.completed 
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300' 
                        : (prog.percent > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm')
                    }"
                    onclick="window.OSON_LESSONS.openLesson('${lesson.id}')">
              <i class="fa-solid ${prog.completed ? 'fa-rotate-right' : (prog.percent > 0 ? 'fa-play' : 'fa-book-open')}"></i>
              <span>${prog.completed ? 'Qayta takrorlash' : (prog.percent > 0 ? 'Davom etish' : 'Boshlash')}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open Lesson Reader Modal
  function openLesson(lessonId) {
    const lesson = window.OSON_DATA.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const modal = document.getElementById('lesson-reader-modal');
    const modalBody = document.getElementById('lesson-modal-body');
    if (!modal || !modalBody) return;

    // Mark as started or update progress
    const progressMap = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.LESSON_PROGRESS, {});
    if (!progressMap[lesson.id] || progressMap[lesson.id].percent < 50) {
      progressMap[lesson.id] = { completed: false, percent: 50, lastRead: window.OSON_STORAGE.getTodayString() };
      window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.LESSON_PROGRESS, progressMap);
      renderLessons();
    }

    const allLessons = window.OSON_DATA.lessons || [];
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = (currentIndex !== -1 && currentIndex < allLessons.length - 1) ? allLessons[currentIndex + 1] : null;

    modalBody.innerHTML = `
      <div class="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
        <div class="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              ${lesson.number}-Dars • ${lesson.category}
            </span>
            <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <i class="fa-regular fa-clock"></i> O‘qish vaqti: ${lesson.duration}
            </span>
          </div>
          <span class="text-xs font-bold text-slate-400">
            ${currentIndex + 1} / ${allLessons.length}
          </span>
        </div>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">
          ${lesson.title}
        </h2>
      </div>

      <div class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-base leading-relaxed">
        ${lesson.content.split('\n').map(p => `<p>${p}</p>`).join('')}
      </div>

      <div class="mt-8 p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
        <h4 class="font-bold text-sm text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          <i class="fa-solid fa-list-check text-blue-600"></i> Darsning asosiy kalit nuqtalari
        </h4>
        <ul class="list-disc list-inside text-sm text-blue-800 dark:text-blue-300 space-y-1">
          ${lesson.takeaways.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>

      <!-- Previous / Next Lesson Navigation -->
      <div class="mt-8 pt-5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
        ${prevLesson ? `
          <button type="button" 
                  class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-2 btn-press"
                  onclick="window.OSON_LESSONS.openLesson('${prevLesson.id}')">
            <i class="fa-solid fa-chevron-left text-[10px]"></i>
            <span>${prevLesson.number}-dars: ${prevLesson.title.length > 20 ? prevLesson.title.substring(0, 20) + '...' : prevLesson.title}</span>
          </button>
        ` : '<div></div>'}

        ${nextLesson ? `
          <button type="button" 
                  class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2 btn-press ml-auto"
                  onclick="window.OSON_LESSONS.openLesson('${nextLesson.id}')">
            <span>${nextLesson.number}-dars: ${nextLesson.title.length > 20 ? nextLesson.title.substring(0, 20) + '...' : nextLesson.title}</span>
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        ` : '<div></div>'}
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button type="button" 
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onclick="window.OSON_LESSONS.completeLesson('${lesson.id}')">
          <i class="fa-solid fa-check text-emerald-500 mr-1.5"></i> Darsni tugatdim deb belgilash
        </button>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button type="button"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all btn-press flex items-center justify-center gap-2 shadow-sm"
                  onclick="window.OSON_UI.closeModal('lesson-reader-modal'); window.location.hash = '#testlar'; window.OSON_TESTS.startTopicPractice('${lesson.category}')">
            <i class="fa-solid fa-pen-clip"></i>
            Mavzu testini yechish
          </button>
        </div>
      </div>
    `;

    window.OSON_UI.openModal('lesson-reader-modal');
  }

  // Mark Lesson as Completed
  function completeLesson(lessonId) {
    const progressMap = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.LESSON_PROGRESS, {});
    progressMap[lessonId] = { completed: true, percent: 100, lastRead: window.OSON_STORAGE.getTodayString() };
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.LESSON_PROGRESS, progressMap);

    renderLessons();
    window.OSON_UI.closeModal('lesson-reader-modal');
    window.OSON_UI.showToast('Tabriklaymiz! Dars muvaffaqiyatli tamomlandi.', 'success');
  }

  // Toggle favorite for lesson
  function toggleLessonFav(lessonId, btnElement) {
    const isNowFav = window.OSON_STORAGE.toggleFavorite(lessonId);
    if (btnElement) {
      const icon = btnElement.querySelector('i');
      if (icon) {
        icon.className = isNowFav ? 'fa-solid fa-star text-amber-500 text-sm' : 'fa-regular fa-star text-sm';
      }
    }
    window.OSON_UI.showToast(isNowFav ? 'Dars sevimlilarga saqlandi' : 'Dars sevimlilardan olindi', 'info');
  }

  // Render Rules Knowledge Base
  function renderRules() {
    const container = document.getElementById('rules-list');
    const emptyState = document.getElementById('rules-empty-state');
    if (!container) return;

    const rules = window.OSON_DATA.rules;
    const query = ruleSearchQuery.trim().toLowerCase();

    const filtered = rules.filter(r => {
      const matchCat = currentRuleCategory === 'all' || r.category === currentRuleCategory;
      const matchSearch = !query || r.title.toLowerCase().includes(query) || r.summary.toLowerCase().includes(query) || r.content.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = filtered.map(rule => {
      const isFav = window.OSON_STORAGE.isFavorite(rule.id);
      return `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm card-hover flex flex-col justify-between transition-all"
             onclick="window.OSON_LESSONS.openRuleModal('${rule.id}')">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                ${rule.categoryName}
              </span>
              <button type="button" 
                      class="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      onclick="event.stopPropagation(); window.OSON_LESSONS.toggleRuleFav('${rule.id}', this)">
                <i class="${isFav ? 'fa-solid text-amber-500' : 'fa-regular'} fa-star text-sm"></i>
              </button>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              ${rule.title}
            </h3>

            <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
              ${rule.summary}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <span class="text-slate-400">YHQ moddasi</span>
            <span class="text-blue-600 dark:text-blue-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              To‘liq o‘qish <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Open Rule Modal
  function openRuleModal(ruleId) {
    const rule = window.OSON_DATA.rules.find(r => r.id === ruleId);
    if (!rule) return;

    const modal = document.getElementById('rule-detail-modal');
    const modalBody = document.getElementById('rule-modal-body');
    if (!modal || !modalBody) return;

    const isFav = window.OSON_STORAGE.isFavorite(rule.id);

    modalBody.innerHTML = `
      <div class="mb-4">
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
          ${rule.categoryName}
        </span>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mt-2">
          ${rule.title}
        </h2>
      </div>

      <div class="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-3 text-sm leading-relaxed whitespace-pre-line mb-6">
        ${rule.content}
      </div>

      ${rule.important ? `
        <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
          <i class="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5 text-base"></i>
          <div>
            <strong class="font-bold">Eslatma:</strong> ${rule.important}
          </div>
        </div>
      ` : ''}

      <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <button type="button" 
                class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                onclick="window.OSON_LESSONS.toggleRuleFav('${rule.id}', this)">
          <i class="${isFav ? 'fa-solid text-amber-500' : 'fa-regular'} fa-star"></i>
          <span>${isFav ? 'Sevimlilardan o‘chirish' : 'Sevimlilarga saqlash'}</span>
        </button>
        <button type="button" 
                class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors btn-press"
                onclick="window.OSON_UI.closeModal('rule-detail-modal')">
          Tushunarli
        </button>
      </div>
    `;

    window.OSON_UI.openModal('rule-detail-modal');
  }

  function toggleRuleFav(ruleId, btnElement) {
    const isNowFav = window.OSON_STORAGE.toggleFavorite(ruleId);
    if (btnElement) {
      const icon = btnElement.querySelector('i');
      if (icon) {
        icon.className = isNowFav ? 'fa-solid fa-star text-amber-500 text-sm' : 'fa-regular fa-star text-sm';
      }
    }
    window.OSON_UI.showToast(isNowFav ? 'Qoida sevimlilarga qo‘shildi' : 'Qoida sevimlilardan olindi', 'info');
    renderRules();
  }

  function setRuleCategory(cat, btnElement) {
    currentRuleCategory = cat;
    document.querySelectorAll('.rule-filter-btn').forEach(btn => {
      btn.classList.remove('bg-blue-600', 'text-white');
      btn.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    });
    if (btnElement) {
      btnElement.classList.add('bg-blue-600', 'text-white');
      btnElement.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
    }
    renderRules();
  }

  function onRuleSearch(query) {
    ruleSearchQuery = query;
    renderRules();
  }

  return {
    renderLessons,
    openLesson,
    completeLesson,
    toggleLessonFav,
    renderRules,
    openRuleModal,
    toggleRuleFav,
    setRuleCategory,
    onRuleSearch
  };
})();
