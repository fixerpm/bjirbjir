/**
 * OSON PRAVA — Official Exam Simulator
 * Realistic driving theory state exam simulation with strict 25-minute timer,
 * no instant reveals, question flagging, and comprehensive pass/fail analysis.
 */

window.OSON_EXAM = (function() {
  'use strict';

  let currentExam = null;
  let countdownTimer = null;
  const EXAM_DURATION_SECONDS = 25 * 60; // 25 minutes = 1500s
  const PASS_THRESHOLD = 18; // 18 out of 20 to pass (90%)

  // Start Official Exam
  function startExam() {
    if (window.OSON_LOADING) {
      window.OSON_LOADING.run(700, 'Davlat Imtihoni', '20 ta savol va taymer ishga tushirilmoqda...', () => {
        executeStartExam();
      });
    } else {
      executeStartExam();
    }
  }

  function executeStartExam() {
    if (!window.OSON_DATA || !Array.isArray(window.OSON_DATA.questions) || window.OSON_DATA.questions.length === 0) {
      if (window.OSON_UI) window.OSON_UI.showToast('Imtihon savollari topilmadi', 'error');
      return;
    }
    const allQuestions = [...window.OSON_DATA.questions];
    allQuestions.sort(() => Math.random() - 0.5);
    const selected = allQuestions.slice(0, 20);

    currentExam = {
      questions: selected,
      currentIndex: 0,
      userAnswers: {}, // questionIndex -> selectedOptionIndex
      flagged: {}, // questionIndex -> boolean
      remainingSeconds: EXAM_DURATION_SECONDS,
      isFinished: false
    };

    // UI state
    document.getElementById('exam-intro-view')?.classList.add('hidden');
    document.getElementById('exam-active-view')?.classList.remove('hidden');
    document.getElementById('exam-result-view')?.classList.add('hidden');

    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
      if (currentExam && !currentExam.isFinished) {
        currentExam.remainingSeconds--;
        updateTimerDisplay();

        if (currentExam.remainingSeconds <= 0) {
          clearInterval(countdownTimer);
          window.OSON_UI.showToast('Vaqt tugadi! Imtihon avtomatik yakunlandi.', 'error');
          finishExam(true);
        }
      }
    }, 1000);

    updateTimerDisplay();
    renderQuestion();
    renderMatrix();
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('exam-timer');
    if (!timerEl || !currentExam) return;

    timerEl.textContent = formatTime(currentExam.remainingSeconds);

    // Warning when less than 3 minutes left
    if (currentExam.remainingSeconds < 180) {
      timerEl.parentElement.classList.add('text-rose-500', 'animate-pulse');
      timerEl.parentElement.classList.remove('text-blue-600', 'dark:text-blue-400');
    } else {
      timerEl.parentElement.classList.remove('text-rose-500', 'animate-pulse');
      timerEl.parentElement.classList.add('text-blue-600', 'dark:text-blue-400');
    }
  }

  // Render question
  function renderQuestion() {
    if (!currentExam || !Array.isArray(currentExam.questions) || currentExam.questions.length === 0) return;
    const total = currentExam.questions.length;
    let idx = currentExam.currentIndex || 0;
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    currentExam.currentIndex = idx;

    const q = currentExam.questions[idx];
    if (!q) {
      const qTextEl = document.getElementById('exam-q-text');
      if (qTextEl) qTextEl.textContent = 'Savol yuklanmadi. Qayta urinib ko‘ring.';
      return;
    }

    const qNumEl = document.getElementById('exam-q-number');
    const qTextEl = document.getElementById('exam-q-text');
    const optionsContainer = document.getElementById('exam-options-container');
    const flagBtn = document.getElementById('exam-flag-btn');

    if (qNumEl) qNumEl.textContent = `Savol ${idx + 1} / ${total}`;
    if (qTextEl) qTextEl.textContent = q.question;

    // Show the related road sign (if the question text references one) above the question
    const examSignVisualEl = document.getElementById('exam-sign-visual');
    if (examSignVisualEl && window.OSON_UTILS) {
      const relatedSign = window.OSON_UTILS.findRelatedSign(q);
      examSignVisualEl.innerHTML = window.OSON_UTILS.renderSignVisualCard(relatedSign);
    }

    const selectedOption = currentExam.userAnswers[idx];
    const isFlagged = !!currentExam.flagged[idx];

    if (flagBtn) {
      flagBtn.innerHTML = `
        <i class="${isFlagged ? 'fa-solid text-amber-500' : 'fa-regular text-slate-400'} fa-bookmark"></i>
        <span>${isFlagged ? 'Belgilangan (Shubhali)' : 'Savolni belgilab qo‘yish'}</span>
      `;
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = q.options.map((opt, optIdx) => {
        const isSelected = selectedOption === optIdx;
        return `
          <button type="button" 
                  class="answer-choice w-full text-left ${isSelected ? 'selected' : ''}"
                  onclick="window.OSON_EXAM.selectOption(${optIdx})">
            <span class="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0 ${
              isSelected ? 'bg-blue-600 text-white border-blue-600' : ''
            }">
              ${String.fromCharCode(65 + optIdx)}
            </span>
            <span class="text-sm md:text-base font-medium flex-1">${opt}</span>
          </button>
        `;
      }).join('');
    }

    // Prev / Next button state
    const prevBtn = document.getElementById('exam-prev-btn');
    const nextBtn = document.getElementById('exam-next-btn');
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) {
      if (idx === total - 1) {
        nextBtn.innerHTML = `<span>Imtihonni topshirish</span> <i class="fa-solid fa-check ml-1"></i>`;
      } else {
        nextBtn.innerHTML = `<span>Keyingi</span> <i class="fa-solid fa-arrow-right ml-1"></i>`;
      }
    }

    renderMatrix();
  }

  // Option selection
  function selectOption(optIdx) {
    if (!currentExam || currentExam.isFinished) return;
    currentExam.userAnswers[currentExam.currentIndex] = optIdx;
    renderQuestion();
  }

  // Toggle flag for current question
  function toggleFlag() {
    if (!currentExam) return;
    const idx = currentExam.currentIndex;
    currentExam.flagged[idx] = !currentExam.flagged[idx];
    renderQuestion();
  }

  // Question Matrix (1..20)
  function renderMatrix() {
    const container = document.getElementById('exam-matrix');
    if (!container || !currentExam) return;

    container.innerHTML = currentExam.questions.map((_, i) => {
      const hasAnswer = currentExam.userAnswers[i] !== undefined;
      const isFlagged = currentExam.flagged[i];
      let cls = '';

      if (i === currentExam.currentIndex) {
        cls = 'active';
      } else if (isFlagged) {
        cls = 'flagged-pill';
      } else if (hasAnswer) {
        cls = 'answered';
      }

      return `
        <button type="button" 
                class="q-pill ${cls}"
                onclick="window.OSON_EXAM.jumpTo(${i})">
          ${i + 1}
        </button>
      `;
    }).join('');
  }

  function next() {
    if (!currentExam) return;
    if (currentExam.currentIndex < currentExam.questions.length - 1) {
      currentExam.currentIndex++;
      renderQuestion();
    } else {
      promptSubmit();
    }
  }

  function prev() {
    if (!currentExam || currentExam.currentIndex <= 0) return;
    currentExam.currentIndex--;
    renderQuestion();
  }

  function jumpTo(idx) {
    if (!currentExam || idx < 0 || idx >= currentExam.questions.length) return;
    currentExam.currentIndex = idx;
    renderQuestion();
  }

  // Confirmation before submit
  function promptSubmit() {
    if (!currentExam) return;
    const total = currentExam.questions.length;
    const answered = Object.keys(currentExam.userAnswers).length;
    const unanswered = total - answered;

    const modalBody = document.getElementById('exam-submit-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Siz jami <strong>${total}</strong> ta savoldan <strong>${answered}</strong> tasiga javob berdingiz.
          ${unanswered > 0 ? `<br><span class="text-amber-600 dark:text-amber-400 font-semibold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> ${unanswered} ta savolga javob berilmadi!</span>` : ''}
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Imtihonni topshirgandan so‘ng javoblarni o‘zgartirib bo‘lmaydi. Natijani ko‘rishga tayyormisiz?
        </p>
      `;
    }
    window.OSON_UI.openModal('exam-submit-confirm-modal');
  }

  // Finish exam and calculate score
  function finishExam(isTimeOut = false) {
    if (!currentExam) return;
    clearInterval(countdownTimer);
    currentExam.isFinished = true;
    window.OSON_UI.closeModal('exam-submit-confirm-modal');

    let correctCount = 0;
    const reviews = [];

    currentExam.questions.forEach((q, idx) => {
      const userAns = currentExam.userAnswers[idx];
      const isCorrect = userAns === q.correctIndex;
      if (isCorrect) correctCount++;

      reviews.push({
        index: idx + 1,
        question: q,
        userAns: userAns,
        isCorrect: isCorrect
      });
    });

    const total = currentExam.questions.length;
    const passed = correctCount >= PASS_THRESHOLD;
    const percentage = Math.round((correctCount / total) * 100);
    const timeSpentSec = EXAM_DURATION_SECONDS - currentExam.remainingSeconds;

    // Save record
    window.OSON_STORAGE.saveTestResult({
      mode: 'exam',
      topic: 'Davlat imtihoni',
      score: correctCount,
      total: total,
      percentage: percentage,
      passed: passed,
      duration: formatTime(timeSpentSec)
    });

    // Create or update genuine user certificate if passed
    let certRecord = null;
    if (passed && window.OSON_CERTIFICATE && typeof window.OSON_CERTIFICATE.createOrUpdateCertificate === 'function') {
      certRecord = window.OSON_CERTIFICATE.createOrUpdateCertificate({
        score: correctCount,
        total: total,
        percentage: percentage,
        passed: passed
      });
    }

    if (window.OSON_UI && typeof window.OSON_UI.updateHeroReadiness === 'function') {
      window.OSON_UI.updateHeroReadiness();
    }

    // Render result
    document.getElementById('exam-active-view')?.classList.add('hidden');
    document.getElementById('exam-result-view')?.classList.remove('hidden');

    const statusBadge = document.getElementById('exam-result-status-badge');
    const resultTitle = document.getElementById('exam-result-title');
    const resultDesc = document.getElementById('exam-result-desc');
    const scoreVal = document.getElementById('exam-result-score');
    const timeVal = document.getElementById('exam-result-time');
    const reviewList = document.getElementById('exam-result-review-list');

    if (statusBadge) {
      statusBadge.className = `inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
        passed
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
      }`;
      statusBadge.innerHTML = `<i class="fa-solid ${passed ? 'fa-circle-check' : 'fa-circle-xmark'} mr-2"></i> ${
        passed ? 'IMTIHONDAN O‘TDINGIZ' : 'YANA MASHQ QILISH KERAK'
      }`;
    }

    if (resultTitle) {
      resultTitle.textContent = passed
        ? 'Tabriklaymiz! Siz nazariy imtihondan muvaffaqiyatli o‘tdingiz!'
        : 'Afsuski, imtihondan o‘ta olmadingiz';
    }

    if (resultDesc) {
      resultDesc.textContent = passed
        ? 'Siz rasmiy me’yor talablariga to‘liq javob berdingiz va haydovchilik nazariyasini a’lo darajada o‘zlashtirgansiz.'
        : `Rasmiy imtihondan o‘tish uchun kamida 18 ta savolga (90%) to‘g‘ri javob berish lozim. Siz ${correctCount} ta to‘g‘ri javob berdingiz.`;
    }

    if (scoreVal) scoreVal.textContent = `${correctCount} / ${total} (${percentage}%)`;
    if (timeVal) timeVal.textContent = formatTime(timeSpentSec);

    // Dynamic Certificate Claim button visibility & payload
    const certBtn = document.getElementById('exam-claim-cert-btn');
    if (certBtn) {
      if (passed) {
        certBtn.classList.remove('hidden');
        certBtn.onclick = function() {
          window.OSON_CERTIFICATE.openCertificate(certRecord || {
            score: correctCount,
            total: total,
            percentage: percentage,
            passed: true
          });
        };
      } else {
        certBtn.classList.add('hidden');
      }
    }

    // Render full review list
    if (reviewList) {
      reviewList.innerHTML = reviews.map(r => `
        <div class="p-5 rounded-2xl border ${
          r.isCorrect 
            ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20' 
            : 'border-rose-200 dark:border-rose-800/60 bg-rose-50/40 dark:bg-rose-950/20'
        }">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-bold ${r.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}">
              Savol #${r.index}
            </span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded ${r.isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900' : 'bg-rose-100 text-rose-800 dark:bg-rose-900'}">
              ${r.isCorrect ? 'To‘g‘ri' : 'Xato'}
            </span>
          </div>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-3">${r.question.question}</h4>
          <div class="text-xs space-y-1 mb-3">
            <p class="${r.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'} font-medium">
              Sizning tanlovingiz: ${r.userAns !== undefined ? r.question.options[r.userAns] : 'Belgilanmagan'}
            </p>
            ${!r.isCorrect ? `
              <p class="text-emerald-600 dark:text-emerald-400 font-semibold">
                To‘g‘ri javob: ${r.question.options[r.question.correctIndex]}
              </p>
            ` : ''}
          </div>
          <div class="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
            <strong>Tushuntirish:</strong> ${r.question.explanation}
          </div>
        </div>
      `).join('');
    }

    if (passed) {
      window.OSON_UI.triggerConfetti();
      if (window.OSON_SOUND) window.OSON_SOUND.playSuccess();
    } else {
      if (window.OSON_SOUND) window.OSON_SOUND.playWrong();
    }
  }

  function quitExam() {
    clearInterval(countdownTimer);
    currentExam = null;
    document.getElementById('exam-intro-view')?.classList.remove('hidden');
    document.getElementById('exam-active-view')?.classList.add('hidden');
    document.getElementById('exam-result-view')?.classList.add('hidden');
  }

  // Global Keyboard Navigation for Official Exam
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    const examActiveView = document.getElementById('exam-active-view');
    if (!examActiveView || examActiveView.classList.contains('hidden') || !currentExam || currentExam.isFinished) return;

    if (['1', '2', '3', '4'].includes(e.key)) {
      const optIdx = parseInt(e.key, 10) - 1;
      selectOption(optIdx);
    } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
      next();
    } else if (e.key === 'ArrowLeft') {
      prev();
    } else if (e.key.toLowerCase() === 'f') {
      if (currentExam) toggleFlag(currentExam.currentIndex);
    }
  });

  return {
    startExam,
    selectOption,
    toggleFlag,
    next,
    prev,
    jumpTo,
    promptSubmit,
    finishExam,
    quitExam
  };
})();
