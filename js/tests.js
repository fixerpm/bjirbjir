/**
 * OSON PRAVA — Practice Tests Engine
 * Interactive driving theory quiz system with immediate feedback,
 * question navigator matrix, explanations, and score tracking.
 */

window.OSON_TESTS = (function() {
  'use strict';

  let currentSession = null;
  let timerInterval = null;

  // Topic normalization and alias mapping so that any lesson, category, or testPack works seamlessly
  const TOPIC_ALIASES = {
    'yo‘l harakati qoidalari': ['Harakatlanish qoidalari', 'Haydovchi majburiyatlari'],
    'yol harakati qoidalari': ['Harakatlanish qoidalari', 'Haydovchi majburiyatlari'],
    'harakatlanish qoidalari': ['Harakatlanish qoidalari'],
    'harakat': ['Harakatlanish qoidalari'],
    'manevrlar': ['Harakatlanish qoidalari'],
    'tezlik me’yorlari': ['Tezlik qoidalari'],
    'tezlik meyorlari': ['Tezlik qoidalari'],
    'tezlik qoidalari': ['Tezlik qoidalari'],
    'tezlik': ['Tezlik qoidalari'],
    'to‘xtash va to‘xtab turish': ['To‘xtash va parkovka'],
    'toxtash va toxtab turish': ['To‘xtash va parkovka'],
    'to‘xtash va parkovka': ['To‘xtash va parkovka'],
    'to‘xtash': ['To‘xtash va parkovka'],
    'toxtash': ['To‘xtash va parkovka'],
    'piyodalar va yo‘lovchilar': ['Piyodalar'],
    'piyodalar va yolovchilar': ['Piyodalar'],
    'piyodalar': ['Piyodalar'],
    'maxsus transportlar': ['Maxsus transport'],
    'maxsus transport': ['Maxsus transport'],
    'chorrahadan o‘tish': ['Chorrahadan o‘tish'],
    'chorrahadan otish': ['Chorrahadan o‘tish'],
    'chorrahalar': ['Chorrahadan o‘tish'],
    'yo‘l belgilari': ['Yo‘l belgilari'],
    'yol belgilari': ['Yo‘l belgilari'],
    'belgilar': ['Yo‘l belgilari'],
    'tartibga solish': ['Svetofor'],
    'svetofor': ['Svetofor'],
    'asoslar': ['Haydovchi majburiyatlari'],
    'texnika': ['Haydovchi majburiyatlari'],
    'xavfsizlik': ['Favqulodda vaziyatlar'],
    'favqulodda vaziyatlar': ['Favqulodda vaziyatlar'],
    'birinchi tibbiy yordam': ['Birinchi tibbiy yordam'],
    'tibbiy yordam': ['Birinchi tibbiy yordam'],
    'barcha mavzular': ['all'],
    'all': ['all']
  };

  let isLoadingQuestions = false;

  async function fetchServerQuestions(topic = null) {
    if (isLoadingQuestions) return (window.OSON_DATA && Array.isArray(window.OSON_DATA.questions)) ? window.OSON_DATA.questions : [];
    isLoadingQuestions = true;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const url = topic ? `/api/questions?topic=${encodeURIComponent(topic)}` : '/api/questions';
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          if (!window.OSON_DATA) window.OSON_DATA = {};
          if (!topic || !window.OSON_DATA.questions || window.OSON_DATA.questions.length === 0) {
            window.OSON_DATA.questions = json.data;
          }
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API questions fetch warning (fallback active):', e.message);
    } finally {
      isLoadingQuestions = false;
    }
    return (window.OSON_DATA && Array.isArray(window.OSON_DATA.questions)) ? window.OSON_DATA.questions : [];
  }

  function showQuestionsErrorUI(retryTopic = null) {
    const container = document.getElementById('practice-packs-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-10 px-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 animate-slide-up">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 mx-auto flex items-center justify-center text-xl mb-3">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">Savollar bazasini yuklashda uzilish</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
            Internet aloqasi sekinlashgan bo‘lishi mumkin. Qayta urinib ko‘ring.
          </p>
          <button type="button" 
                  class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition btn-press inline-flex items-center gap-2"
                  onclick="window.OSON_TESTS.retryLoadQuestions('${retryTopic || 'all'}')">
            <i class="fa-solid fa-rotate-right"></i>
            <span>Qayta urinib ko‘rish</span>
          </button>
        </div>
      `;
    }
    if (window.OSON_UI) window.OSON_UI.showToast('Savollarni yuklab bo‘lmadi, qayta urinib ko‘ring', 'warning');
  }

  async function retryLoadQuestions(topic = 'all') {
    if (window.OSON_UI) window.OSON_UI.showToast('Savollar qayta yuklanmoqda...', 'info');
    await fetchServerQuestions();
    renderTestPacks();
  }

  function getQuestionsForTopic(requestedTopic) {
    if (!window.OSON_DATA || !Array.isArray(window.OSON_DATA.questions)) {
      return [];
    }
    const all = window.OSON_DATA.questions;
    if (!requestedTopic || requestedTopic === 'all' || requestedTopic === 'Barcha mavzular') {
      return [...all];
    }

    const clean = requestedTopic.trim().toLowerCase();
    
    // 1. Check alias mapping
    if (TOPIC_ALIASES[clean]) {
      const targetTopics = TOPIC_ALIASES[clean];
      if (targetTopics.includes('all')) return [...all];
      const matched = all.filter(q => targetTopics.includes(q.topic));
      if (matched.length > 0) return matched;
    }

    // 2. Exact match
    const exact = all.filter(q => q.topic.toLowerCase() === clean);
    if (exact.length > 0) return exact;

    // 3. Partial match
    const partial = all.filter(q => q.topic.toLowerCase().includes(clean) || clean.includes(q.topic.toLowerCase()));
    if (partial.length > 0) return partial;

    // 4. Fallback to all questions
    return [...all];
  }

  // Start a new practice test session
  async function startTest(options = {}) {
    if (!window.OSON_DATA || !Array.isArray(window.OSON_DATA.questions) || window.OSON_DATA.questions.length === 0) {
      const fetched = await fetchServerQuestions(options.topic);
      if (!fetched || fetched.length === 0) {
        showQuestionsErrorUI(options.topic);
        return;
      }
    }

    let pool = getQuestionsForTopic(options.topic);
    if (!pool || pool.length === 0) {
      pool = [...window.OSON_DATA.questions];
    }

    // Shuffle and pick 20 questions (or available pool size)
    pool = [...pool].sort(() => Math.random() - 0.5);
    const selectedQuestions = pool.slice(0, Math.min(20, pool.length));

    if (selectedQuestions.length === 0) {
      if (window.OSON_UI) window.OSON_UI.showToast('Savollar topilmadi', 'error');
      return;
    }

    currentSession = {
      mode: 'practice',
      topic: options.topic || 'Aralash mashq',
      questions: selectedQuestions,
      currentIndex: 0,
      userAnswers: {}, // index -> { selectedIndex, isCorrect }
      timeSeconds: 0,
      isFinished: false,
      reviewMode: false
    };

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (currentSession && !currentSession.isFinished) {
        currentSession.timeSeconds++;
        updateTimerDisplay();
        // Autosave the timer tick every 10s so a refresh never loses more than ~10s of progress
        if (currentSession.timeSeconds % 10 === 0) persistSession();
      }
    }, 1000);

    // Switch view to active test interface
    hideResumeBanner();
    document.getElementById('test-start-view')?.classList.add('hidden');
    document.getElementById('test-active-view')?.classList.remove('hidden');
    document.getElementById('test-result-view')?.classList.add('hidden');

    renderQuestion();
    renderNavigator();
    persistSession();
  }

  // ==========================================================================
  // RESUMABLE SESSION — auto-save progress to this device (localStorage) so an
  // interrupted test (tab closed, refresh, phone locked) can be continued
  // exactly where the user left off, instead of forcing a restart from zero.
  // ==========================================================================

  function persistSession() {
    if (!currentSession || currentSession.isFinished || !window.OSON_STORAGE) return;
    window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.TEST_SESSION, {
      mode: currentSession.mode,
      topic: currentSession.topic,
      questionIds: currentSession.questions.map(q => q.id),
      currentIndex: currentSession.currentIndex,
      userAnswers: currentSession.userAnswers,
      timeSeconds: currentSession.timeSeconds,
      savedAt: Date.now()
    });
  }

  function clearPersistedSession() {
    if (window.OSON_STORAGE) window.OSON_STORAGE.remove(window.OSON_STORAGE.KEYS.TEST_SESSION);
    hideResumeBanner();
  }

  function hideResumeBanner() {
    document.getElementById('test-resume-banner')?.classList.add('hidden');
  }

  // Look for a saved unfinished session and, if one exists and matches the
  // currently loaded question bank, show the "Continue?" banner on the
  // Testlar start screen. Safe to call repeatedly (e.g. every time the
  // Testlar tab is opened).
  function checkResumableSession() {
    const banner = document.getElementById('test-resume-banner');
    if (!banner || !window.OSON_STORAGE || !window.OSON_DATA) return;

    const saved = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_SESSION);
    if (!saved || !Array.isArray(saved.questionIds) || saved.questionIds.length === 0) {
      banner.classList.add('hidden');
      return;
    }

    // Make sure the saved questions still exist in the current question bank
    const stillValid = saved.questionIds.every(id => window.OSON_DATA.questions.some(q => q.id === id));
    if (!stillValid) {
      clearPersistedSession();
      return;
    }

    const answeredCount = Object.keys(saved.userAnswers || {}).length;
    const info = document.getElementById('test-resume-info');
    if (info) {
      info.textContent = `${saved.topic} • ${answeredCount}/${saved.questionIds.length} ta savolga javob berilgan • ${formatTime(saved.timeSeconds || 0)}`;
    }
    banner.classList.remove('hidden');
  }

  // Rebuild the session from localStorage and continue exactly where it left off
  function resumeTest() {
    const saved = window.OSON_STORAGE && window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_SESSION);
    if (!saved || !window.OSON_DATA) return;

    const questions = saved.questionIds
      .map(id => window.OSON_DATA.questions.find(q => q.id === id))
      .filter(Boolean);

    if (questions.length === 0) {
      clearPersistedSession();
      return;
    }

    currentSession = {
      mode: saved.mode || 'practice',
      topic: saved.topic || 'Aralash mashq',
      questions: questions,
      currentIndex: Math.min(saved.currentIndex || 0, questions.length - 1),
      userAnswers: saved.userAnswers || {},
      timeSeconds: saved.timeSeconds || 0,
      isFinished: false,
      reviewMode: false
    };

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (currentSession && !currentSession.isFinished) {
        currentSession.timeSeconds++;
        updateTimerDisplay();
        if (currentSession.timeSeconds % 10 === 0) persistSession();
      }
    }, 1000);

    hideResumeBanner();
    document.getElementById('test-start-view')?.classList.add('hidden');
    document.getElementById('test-active-view')?.classList.remove('hidden');
    document.getElementById('test-result-view')?.classList.add('hidden');

    renderQuestion();
    renderNavigator();
    if (window.OSON_UI) window.OSON_UI.showToast('Test davom ettirildi', 'info');
  }

  function discardResumableSession() {
    clearPersistedSession();
    if (window.OSON_UI) window.OSON_UI.showToast('Tugallanmagan test bekor qilindi', 'info');
  }

  // Start specific topic practice from lessons
  function startTopicPractice(topicName) {
    startTest({ topic: topicName });
  }

  // Format MM:SS
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function escapeQuote(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  function updateTimerDisplay() {
    const el = document.getElementById('practice-timer');
    if (el && currentSession) {
      el.textContent = formatTime(currentSession.timeSeconds);
    }
  }

  // Render current question
  function renderQuestion() {
    if (!currentSession || !Array.isArray(currentSession.questions) || currentSession.questions.length === 0) {
      return;
    }
    const total = currentSession.questions.length;
    let idx = currentSession.currentIndex || 0;
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    currentSession.currentIndex = idx;

    const q = currentSession.questions[idx];
    if (!q) {
      const qTextEl = document.getElementById('practice-question-text');
      if (qTextEl) qTextEl.textContent = 'Savol yuklanmadi. Iltimos qaytadan urinib ko‘ring.';
      return;
    }

    // Header updates
    const qIndexEl = document.getElementById('practice-q-index');
    const qTopicEl = document.getElementById('practice-q-topic');
    const qProgressBar = document.getElementById('practice-progress-bar');
    const qTextEl = document.getElementById('practice-question-text');
    const optionsContainer = document.getElementById('practice-options-container');
    const explanationBox = document.getElementById('practice-explanation-box');

    if (qIndexEl) qIndexEl.textContent = `Savol ${idx + 1} / ${total}`;
    if (qTopicEl) qTopicEl.textContent = q.topic;
    if (qProgressBar) {
      const pct = Math.round(((idx + 1) / total) * 100);
      qProgressBar.style.width = `${pct}%`;
    }

    if (qTextEl) qTextEl.textContent = q.question;

    // Show the related road sign (if the question text references one) above the question
    const signVisualEl = document.getElementById('practice-sign-visual');
    if (signVisualEl && window.OSON_UTILS) {
      const relatedSign = window.OSON_UTILS.findRelatedSign(q);
      signVisualEl.innerHTML = window.OSON_UTILS.renderSignVisualCard(relatedSign);
    }

    // Sync Bookmark Button State
    const bookmarkBtn = document.getElementById('practice-bookmark-btn');
    if (bookmarkBtn && window.OSON_STORAGE) {
      const isSaved = window.OSON_STORAGE.isQuestionSaved(q.id);
      bookmarkBtn.innerHTML = `
        <i class="${isSaved ? 'fa-solid text-amber-500' : 'fa-regular'} fa-bookmark"></i>
        <span class="hidden sm:inline">${isSaved ? 'Saqlandi' : 'Saqlash'}</span>
      `;
      bookmarkBtn.className = `px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
        isSaved 
          ? 'border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' 
          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300'
      }`;
    }

    // Answer state
    const currentAnswer = currentSession.userAnswers[idx];
    const hasAnswered = currentAnswer !== undefined;

    if (optionsContainer) {
      optionsContainer.innerHTML = q.options.map((opt, optIdx) => {
        let stateClass = '';
        let iconHtml = `<span class="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">${String.fromCharCode(65 + optIdx)}</span>`;

        if (hasAnswered) {
          if (optIdx === q.correctIndex) {
            stateClass = 'correct disabled';
            iconHtml = `<span class="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0"><i class="fa-solid fa-check"></i></span>`;
          } else if (optIdx === currentAnswer.selectedIndex) {
            stateClass = 'wrong disabled';
            iconHtml = `<span class="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0"><i class="fa-solid fa-xmark"></i></span>`;
          } else {
            stateClass = 'disabled opacity-50';
          }
        }

        return `
          <button type="button" 
                  class="answer-choice w-full text-left ${stateClass}"
                  onclick="window.OSON_TESTS.selectAnswer(${optIdx})"
                  ${hasAnswered ? 'disabled' : ''}>
            ${iconHtml}
            <span class="text-sm md:text-base font-medium flex-1">${opt}</span>
          </button>
        `;
      }).join('');
    }

    // Explanation Box
    if (explanationBox) {
      if (hasAnswered) {
        const isCorrect = currentAnswer.isCorrect;
        explanationBox.className = `mt-6 p-5 rounded-2xl border transition-all animate-slide-up ${
          isCorrect
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50/70 border-rose-200 text-rose-950 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
        }`;
        explanationBox.innerHTML = `
          <div class="flex items-start gap-3">
            <i class="fa-solid ${isCorrect ? 'fa-circle-check text-emerald-600 dark:text-emerald-400' : 'fa-circle-xmark text-rose-600 dark:text-rose-400'} text-xl mt-0.5"></i>
            <div class="flex-1">
              <h4 class="font-bold text-sm mb-1">
                ${isCorrect ? 'Barakalla! To‘g‘ri javob berildi' : 'Noto‘g‘ri javob! Qoidani eslab qoling:'}
              </h4>
              <p class="text-sm leading-relaxed opacity-90">${q.explanation}</p>
              ${window.OSON_AI ? `
                <div class="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                  <button type="button" 
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition btn-press max-w-full"
                          onclick="window.OSON_AI.askAboutQuestion('${escapeQuote(q.question)}', '${escapeQuote(q.explanation)}', '${escapeQuote(q.options[currentAnswer.selectedIndex])}')">
                    <i class="fa-solid fa-robot flex-shrink-0"></i>
                    <span class="truncate">${isCorrect ? 'AI Murabbiydan misol so‘rash' : 'Nega xato bo‘ldi? (AI Murabbiy)'}</span>
                  </button>
                  <span class="text-[10px] text-slate-400 font-mono">24/7 PravaGPT</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
        explanationBox.classList.remove('hidden');
      } else {
        explanationBox.classList.add('hidden');
      }
    }

    // Prev / Next button states
    const prevBtn = document.getElementById('practice-prev-btn');
    const nextBtn = document.getElementById('practice-next-btn');
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) {
      if (idx === total - 1) {
        nextBtn.innerHTML = `<span>Testni yakunlash</span> <i class="fa-solid fa-flag-checkered ml-1"></i>`;
      } else {
        nextBtn.innerHTML = `<span>Keyingi savol</span> <i class="fa-solid fa-arrow-right ml-1"></i>`;
      }
    }

    renderNavigator();
  }

  // Answer selection handler
  function selectAnswer(optIdx) {
    if (!currentSession || currentSession.isFinished) return;
    const idx = currentSession.currentIndex;
    if (currentSession.userAnswers[idx] !== undefined) return; // Already answered

    const q = currentSession.questions[idx];
    const isCorrect = optIdx === q.correctIndex;

    currentSession.userAnswers[idx] = {
      selectedIndex: optIdx,
      isCorrect: isCorrect
    };

    // Play sound feedback
    if (window.OSON_SOUND) {
      if (isCorrect) {
        window.OSON_SOUND.playCorrect();
      } else {
        window.OSON_SOUND.playWrong();
      }
    }

    // Update daily practice counter
    updateDailyProgress();

    renderQuestion();
    persistSession();
  }

  // Update Daily Practice Progress in storage
  function updateDailyProgress() {
    const daily = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.DAILY_PRACTICE);
    if (daily && !daily.completed) {
      daily.solvedCount = (daily.solvedCount || 0) + 1;
      if (daily.solvedCount >= daily.target) {
        daily.completed = true;
        window.OSON_UI.showToast('Bugungi kunlik maqsad to‘liq bajarildi! 🔥', 'success');
      }
      window.OSON_STORAGE.set(window.OSON_STORAGE.KEYS.DAILY_PRACTICE, daily);
    }
  }

  // Question Navigator Matrix (1..20)
  function renderNavigator() {
    const container = document.getElementById('practice-matrix');
    if (!container || !currentSession) return;

    container.innerHTML = currentSession.questions.map((_, i) => {
      const ans = currentSession.userAnswers[i];
      let statusClass = '';

      if (i === currentSession.currentIndex) {
        statusClass = 'active';
      } else if (ans !== undefined) {
        statusClass = ans.isCorrect ? 'correct-pill' : 'wrong-pill';
      }

      return `
        <button type="button" 
                class="q-pill ${statusClass}"
                onclick="window.OSON_TESTS.jumpToQuestion(${i})">
          ${i + 1}
        </button>
      `;
    }).join('');
  }

  // Navigation handlers
  function nextQuestion() {
    if (!currentSession) return;
    if (currentSession.currentIndex < currentSession.questions.length - 1) {
      currentSession.currentIndex++;
      renderQuestion();
      persistSession();
    } else {
      confirmFinish();
    }
  }

  function prevQuestion() {
    if (!currentSession || currentSession.currentIndex <= 0) return;
    currentSession.currentIndex--;
    renderQuestion();
    persistSession();
  }

  function jumpToQuestion(i) {
    if (!currentSession || i < 0 || i >= currentSession.questions.length) return;
    currentSession.currentIndex = i;
    renderQuestion();
    persistSession();
  }

  // Prompt finish test
  function confirmFinish() {
    window.OSON_UI.openModal('test-finish-confirm-modal');
  }

  // Conclude practice test
  function finishTest() {
    if (!currentSession) return;
    clearInterval(timerInterval);
    currentSession.isFinished = true;
    clearPersistedSession(); // test is done — nothing left to resume

    window.OSON_UI.closeModal('test-finish-confirm-modal');

    // Calculate results
    let correctCount = 0;
    const mistakes = [];

    currentSession.questions.forEach((q, idx) => {
      const ans = currentSession.userAnswers[idx];
      if (ans && ans.isCorrect) {
        correctCount++;
      } else {
        mistakes.push({
          question: q,
          userAnswer: ans ? ans.selectedIndex : null
        });
      }
    });

    const total = currentSession.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 85;

    // Save to LocalStorage
    const savedRecord = window.OSON_STORAGE.saveTestResult({
      mode: 'practice',
      topic: currentSession.topic,
      score: correctCount,
      total: total,
      percentage: percentage,
      passed: passed,
      duration: formatTime(currentSession.timeSeconds)
    });

    if (window.OSON_UI && typeof window.OSON_UI.updateHeroReadiness === 'function') {
      window.OSON_UI.updateHeroReadiness();
    }

    // Render result screen
    renderResultView({
      score: correctCount,
      total: total,
      percentage: percentage,
      passed: passed,
      duration: formatTime(currentSession.timeSeconds),
      mistakes: mistakes
    });
  }

  // Render Result View
  function renderResultView(result) {
    document.getElementById('test-active-view')?.classList.add('hidden');
    document.getElementById('test-result-view')?.classList.remove('hidden');

    const scoreTitle = document.getElementById('result-score-title');
    const scoreSubtitle = document.getElementById('result-score-subtitle');
    const scorePercentage = document.getElementById('result-score-percentage');
    const correctCountEl = document.getElementById('result-correct-count');
    const wrongCountEl = document.getElementById('result-wrong-count');
    const durationEl = document.getElementById('result-duration');
    const mistakesContainer = document.getElementById('result-mistakes-container');

    if (scorePercentage) scorePercentage.textContent = `${result.percentage}%`;
    if (correctCountEl) correctCountEl.textContent = `${result.score} / ${result.total}`;
    if (wrongCountEl) wrongCountEl.textContent = `${result.total - result.score}`;
    if (durationEl) durationEl.textContent = result.duration;

    if (result.passed) {
      if (scoreTitle) scoreTitle.textContent = 'Ajoyib natija! Sinovdan muvaffaqiyatli o‘tdingiz!';
      if (scoreSubtitle) scoreSubtitle.textContent = 'Siz haydovchilik nazariyasini yuqori darajada o‘zlashtirgansiz.';
      window.OSON_UI.showToast('Muvaffaqiyatli topshirildi! +20 ball', 'success');
      if (window.OSON_SOUND) window.OSON_SOUND.playSuccess();
    } else {
      if (scoreTitle) scoreTitle.textContent = 'Yana biroz mashq qilish tavsiya etiladi';
      if (scoreSubtitle) scoreSubtitle.textContent = 'O‘tish uchun kamida 85% to‘g‘ri javob talab etiladi. Xatolaringiz ustida ishlang.';
      if (window.OSON_SOUND) window.OSON_SOUND.playWrong();
    }

    // Render mistakes
    if (mistakesContainer) {
      if (result.mistakes.length === 0) {
        mistakesContainer.innerHTML = `
          <div class="p-6 text-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl">
            <i class="fa-solid fa-circle-check text-3xl mb-2"></i>
            <p class="font-bold">Birorta ham xato yo‘q! Barcha savollarga to‘g‘ri javob berdingiz.</p>
          </div>
        `;
      } else {
        mistakesContainer.innerHTML = `
          <h3 class="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>
            Xatolar tahlili (${result.mistakes.length} ta savol):
          </h3>
          <div class="space-y-4">
            ${result.mistakes.map((m, idx) => `
              <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    Xato #${idx + 1}
                  </span>
                  <span class="text-xs text-slate-400">${m.question.topic}</span>
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-white text-sm mb-3">${m.question.question}</h4>
                <div class="text-xs space-y-1 mb-3">
                  <p class="text-rose-600 dark:text-rose-400 font-medium">
                    <i class="fa-solid fa-xmark"></i> Sizning javobingiz: ${m.userAnswer !== null ? m.question.options[m.userAnswer] : 'Javob berilmagan'}
                  </p>
                  <p class="text-emerald-600 dark:text-emerald-400 font-medium">
                    <i class="fa-solid fa-check"></i> To‘g‘ri javob: ${m.question.options[m.question.correctIndex]}
                  </p>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-300">
                  <strong>Izoh:</strong> ${m.question.explanation}
                </div>
                ${window.OSON_AI ? `
                  <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <button type="button" 
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-xs font-bold transition btn-press"
                            onclick="window.OSON_AI.askAboutQuestion('${escapeQuote(m.question.question)}', '${escapeQuote(m.question.explanation)}', '${m.userAnswer !== null ? escapeQuote(m.question.options[m.userAnswer]) : ''}')">
                      <i class="fa-solid fa-robot"></i>
                      <span>AI Murabbiydan so‘rash</span>
                    </button>
                    <span class="text-[11px] text-slate-400">YHQ qoidasi</span>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }
    }
  }

  // Restart practice test
  function restartTest() {
    startTest({ topic: currentSession ? currentSession.topic : 'all' });
  }

  // Quit to mode selector
  function quitTest() {
    clearInterval(timerInterval);
    currentSession = null;
    document.getElementById('test-start-view')?.classList.remove('hidden');
    document.getElementById('test-active-view')?.classList.add('hidden');
    document.getElementById('test-result-view')?.classList.add('hidden');
    checkResumableSession(); // progress was auto-saved — offer to continue it later
  }

  // Toggle Bookmark for Active Question
  function toggleCurrentBookmark() {
    if (!currentSession) return;
    const q = currentSession.questions[currentSession.currentIndex];
    const isSaved = window.OSON_STORAGE.toggleSavedQuestion(q.id);
    if (window.OSON_UTILS) {
      window.OSON_UTILS.showToast(isSaved ? 'Savol saqlanganlarga qo‘shildi' : 'Savol saqlanganlardan olib tashlandi', 'info');
    }
    renderQuestion();
  }

  // Practice from Saved Questions
  function startSavedQuestionsPractice() {
    const savedIds = window.OSON_STORAGE.getSavedQuestions();
    const allQuestions = window.OSON_DATA.questions;
    const pool = allQuestions.filter(q => savedIds.includes(Number(q.id)));
    if (pool.length === 0) {
      if (window.OSON_UTILS) {
        window.OSON_UTILS.showToast('Hozircha saqlangan savollar mavjud emas', 'warning');
      }
      return;
    }
    window.location.hash = '#testlar';
    currentSession = {
      mode: 'practice',
      topic: 'Saqlangan savollar',
      questions: pool,
      currentIndex: 0,
      userAnswers: {},
      timeSeconds: 0,
      isFinished: false,
      reviewMode: false
    };
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (currentSession && !currentSession.isFinished) {
        currentSession.timeSeconds++;
        updateTimerDisplay();
      }
    }, 1000);
    document.getElementById('test-start-view')?.classList.add('hidden');
    document.getElementById('test-active-view')?.classList.remove('hidden');
    document.getElementById('test-result-view')?.classList.add('hidden');
    renderQuestion();
    renderNavigator();
  }

  // Render Curated Test Packs
  function renderTestPacks(filter = 'all') {
    const container = document.getElementById('practice-packs-container');
    if (!container || !window.OSON_DATA || !window.OSON_DATA.testPacks) return;

    let packs = window.OSON_DATA.testPacks;
    if (filter !== 'all') {
      packs = packs.filter(p => p.difficulty.toLowerCase() === filter.toLowerCase());
    }

    container.innerHTML = packs.map(pack => `
      <div class="card-minimal p-6 flex flex-col justify-between group hover:border-blue-500/40 transition-all">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="badge-minimal ${
              pack.difficulty === 'Oson' 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                : pack.difficulty === 'O‘rta' 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            }">
              ${pack.difficulty}
            </span>
            <span class="text-xs text-slate-400 font-medium">${pack.timeMinutes} daqiqa</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base mb-3">
            <i class="fa-solid ${pack.icon}"></i>
          </div>
          <h4 class="font-bold text-base text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            ${pack.title}
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            ${pack.desc}
          </p>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span>Mavzu:</span>
            <span class="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">${pack.category}</span>
          </div>
          <button type="button" 
                  class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2"
                  onclick="window.OSON_TESTS.startTest({ topic: '${pack.category === 'Barcha mavzular' ? 'all' : pack.category}' })">
            <i class="fa-solid fa-play text-[10px]"></i>
            <span>Testni boshlash</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  function filterPacks(difficulty, btnElement) {
    document.querySelectorAll('.test-pack-filter-btn').forEach(b => {
      b.className = 'test-pack-filter-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition';
    });
    if (btnElement) {
      btnElement.className = 'test-pack-filter-btn active px-3 py-1.5 rounded-lg bg-blue-600 text-white transition';
    }
    renderTestPacks(difficulty);
  }

  // Global Keyboard Navigation for Practice Tests
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    const testActiveView = document.getElementById('test-active-view');
    if (!testActiveView || testActiveView.classList.contains('hidden') || !currentSession || currentSession.isFinished) return;

    if (['1', '2', '3', '4'].includes(e.key)) {
      const optIdx = parseInt(e.key, 10) - 1;
      selectAnswer(optIdx);
    } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
      nextQuestion();
    } else if (e.key === 'ArrowLeft') {
      prevQuestion();
    }
  });

  // Check for a resumable session as soon as the page/data is ready, and
  // again whenever the user navigates to the Testlar section.
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkResumableSession, 0);
  });
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#testlar') checkResumableSession();
  });

  // Also persist right before the tab/window actually closes, to capture
  // any last-second state (e.g. mid-answer) that the 10s tick missed.
  window.addEventListener('beforeunload', persistSession);

  return {
    startTest,
    startTopicPractice,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    confirmFinish,
    finishTest,
    restartTest,
    quitTest,
    toggleCurrentBookmark,
    startSavedQuestionsPractice,
    renderTestPacks,
    filterPacks,
    resumeTest,
    discardResumableSession,
    checkResumableSession,
    retryLoadQuestions,
    fetchServerQuestions
  };
})();
