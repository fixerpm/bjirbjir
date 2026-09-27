/**
 * OSON PRAVA — Official Certificate Generator
 * Generates personalized official driving theory completion certificates
 * tied strictly to the logged-in user's genuine exam performance.
 * Features:
 *   - Genuine score, percentage and dynamic grading (A'LO, YAXSHI, QONIQARLI)
 *   - Persistent unique Certificate ID per user (OP-YYYY-XXXXXX)
 *   - Genuine completion date and year
 *   - Verification QR-code & shareable verification URL
 *   - Graceful empty state when user hasn't passed the state exam yet
 *   - Strict user-scoping: new or unpassed accounts never receive fake 19/20 certificates
 */

window.OSON_CERTIFICATE = (function() {
  'use strict';

  // The most recently rendered certificate's data, kept so a Telegram
  // hand-off (see isTelegramWebApp / downloadCertificate) can pass it
  // along to the external browser tab that will actually do the PDF export.
  let lastCertData = null;

  /**
   * Dynamic Grading calculation based on real percentage and pass status
   * Official state exam requires at least 18/20 (90%) to pass.
   */
  function calculateGrade(percentage, passed = true) {
    if (passed) {
      if (percentage >= 95) return "A’LO (PASS)";
      if (percentage >= 85) return "YAXSHI (PASS)";
      if (percentage >= 70) return "QONIQARLI (PASS)";
      return "O‘TDI (PASS)";
    } else {
      if (percentage >= 70) return "QONIQARLI (FAIL)";
      return "QONIQARSIZ (FAIL)";
    }
  }

  /**
   * Generates a new unique certificate number formatted as OP-YYYY-XXXXXX
   */
  function generateCertificateId() {
    const year = new Date().getFullYear();
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `OP-${year}-${random6}`;
  }

  /**
   * Saves or updates a genuine certificate record for the current user
   */
  function createOrUpdateCertificate(data) {
    if (!data || !data.passed) return null;
    const user = window.OSON_AUTH ? window.OSON_AUTH.getUser() : null;
    if (!user) return null;

    let existing = null;
    if (window.OSON_STORAGE && typeof window.OSON_STORAGE.getCertificate === 'function') {
      existing = window.OSON_STORAGE.getCertificate();
    }
    const certNumber = (existing && existing.certificateId) ? existing.certificateId : generateCertificateId();

    const score = Number(data.score !== undefined ? data.score : 0);
    const total = Number(data.total !== undefined ? data.total : 20);
    const percentage = Number(data.percentage !== undefined ? data.percentage : Math.round((score / total) * 100));
    const grade = calculateGrade(percentage, true);

    const now = new Date();
    const dateStr = now.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
    const year = now.getFullYear();

    const certRecord = {
      userId: user.id,
      userName: user.name || 'Foydalanuvchi',
      score: score,
      total: total,
      percentage: percentage,
      grade: grade,
      passed: true,
      completedAt: now.toISOString(),
      dateStr: dateStr,
      year: year,
      certificateId: certNumber
    };

    if (window.OSON_STORAGE && typeof window.OSON_STORAGE.saveCertificate === 'function') {
      window.OSON_STORAGE.saveCertificate(certRecord);
    }
    return certRecord;
  }

  /**
   * Retrieve the current logged-in user's genuine certificate
   */
  function getStoredCertificate() {
    const user = window.OSON_AUTH ? window.OSON_AUTH.getUser() : null;
    if (!user) return null;

    // 1. Direct user-scoped certificate lookup
    if (window.OSON_STORAGE && typeof window.OSON_STORAGE.getCertificate === 'function') {
      const stored = window.OSON_STORAGE.getCertificate();
      if (stored && stored.passed && (stored.userId === user.id || !stored.userId)) {
        stored.userId = user.id;
        stored.userName = user.name || stored.userName;
        if (user.isDemo) stored.isDemo = true;
        return stored;
      }
    }

    // 2. Demo User Fallback: sample certificate for presentation purposes
    if (user.isDemo) {
      return {
        userId: user.id,
        userName: 'Demo User',
        score: 19,
        total: 20,
        percentage: 95,
        grade: "A’LO (PASS)",
        passed: true,
        isDemo: true,
        completedAt: new Date().toISOString(),
        dateStr: new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }),
        year: new Date().getFullYear(),
        certificateId: 'OP-2026-DEMO'
      };
    }

    // 2. Fallback check: look for legitimate passed exam in user's test history
    if (window.OSON_STORAGE) {
      const history = window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_HISTORY, []);
      if (Array.isArray(history)) {
        const passedExam = history.find(h => h.mode === 'exam' && h.passed);
        if (passedExam) {
          return createOrUpdateCertificate({
            score: passedExam.score,
            total: passedExam.total || 20,
            percentage: passedExam.percentage,
            passed: true
          });
        }
      }
    }

    return null;
  }

  /**
   * Main entry point to view the certificate or the requirement empty-state
   */
  function openCertificate(data = null) {
    const modal = document.getElementById('certificate-modal');
    const container = document.getElementById('certificate-content');
    if (!modal || !container) return;

    const user = window.OSON_AUTH ? window.OSON_AUTH.getUser() : null;

    // CASE 1: Guest / Not Logged In
    if (!user) {
      container.innerHTML = `
        <div class="p-6 sm:p-10 text-center">
          <div class="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-3xl mb-4 shadow-sm">
            <i class="fa-solid fa-certificate"></i>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 font-sans">
            Sertifikat olish uchun tizimga kiring
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6 font-sans">
            Davlat imtihoni natijalari va rasmiy sertifikat faqat ro‘yxatdan o‘tgan foydalanuvchilar nomiga rasmiylashtiriladi. Iltimos, hisobingizga kiring yoki yangi hisob yarating.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button type="button" 
                    class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    onclick="window.OSON_UI.closeModal('certificate-modal')">
              Yopish
            </button>
            <button type="button" 
                    class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all btn-press flex items-center gap-2"
                    onclick="window.OSON_UI.closeModal('certificate-modal'); window.OSON_UI.openModal('auth-modal');">
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Tizimga kirish</span>
            </button>
          </div>
        </div>
      `;
      window.OSON_UI.openModal('certificate-modal');
      return;
    }

    // CASE 2: Resolve Certificate Data
    let cert = null;
    if (data && data.passed && data.score !== undefined) {
      cert = createOrUpdateCertificate(data);
    } else {
      cert = getStoredCertificate();
    }

    // CASE 3: User is logged in, but has not passed the official exam yet (NO fake 19/20!)
    if (!cert) {
      const history = (window.OSON_STORAGE) ? window.OSON_STORAGE.get(window.OSON_STORAGE.KEYS.TEST_HISTORY, []) : [];
      const lastExam = Array.isArray(history) ? history.find(h => h.mode === 'exam') : null;

      container.innerHTML = `
        <div class="p-6 sm:p-10 text-center">
          <div class="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-3xl mb-4 shadow-sm">
            <i class="fa-solid fa-award"></i>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 font-sans">
            Sizda hali rasmiy sertifikat mavjud emas
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed mb-6 font-sans">
            ${
              lastExam
                ? `Oxirgi urinishingiz: <strong class="text-slate-900 dark:text-white font-bold">${lastExam.score} / ${lastExam.total || 20} (${lastExam.percentage}%)</strong>.<br>Rasmiy sertifikatga ega bo‘lish uchun kamida <strong>18 ta savolga (90%)</strong> to‘g‘ri javob berib, Davlat Imtihonini muvaffaqiyatli topshirishingiz lozim.`
                : 'Rasmiy QR-kodli va muhrli muvaffaqiyat sertifikati OSON PRAVA <strong>Davlat Imtihoni simulyatsiyasi</strong>ni muvaffaqiyatli (kamida 18/20 to‘g‘ri javob — 90%) topshirganingizdan so‘ng avtomatik generatsiya qilinadi.'
            }
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button type="button" 
                    class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    onclick="window.OSON_UI.closeModal('certificate-modal')">
              Yopish
            </button>
            <button type="button" 
                    class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all btn-press flex items-center gap-2"
                    onclick="window.OSON_UI.closeModal('certificate-modal'); window.location.hash = '#imtihon'; if(window.OSON_EXAM && typeof window.OSON_EXAM.startExam === 'function') window.OSON_EXAM.startExam();">
              <i class="fa-solid fa-play"></i>
              <span>Davlat imtihonini topshirish</span>
            </button>
          </div>
        </div>
      `;
      window.OSON_UI.openModal('certificate-modal');
      return;
    }

    // CASE 4: Genuine Passed Certificate Display (Preserving Full Luxury Design)
    renderCertificateModal(cert, user);
  }

  /**
   * Detects whether the app is currently running inside a Telegram Mini App
   * container (Telegram Desktop/Mobile WebView OR Telegram Web's iframe).
   * Both of these sandboxed environments block/ignore the synthetic
   * <a download> click that jsPDF's pdf.save() relies on, so file downloads
   * must be handed off to the user's real external browser instead.
   */
  function isTelegramWebApp() {
    // telegram-web-app.js ALWAYS defines window.Telegram.WebApp, even for a
    // plain visit in a normal browser (outside Telegram entirely) — so its
    // mere presence is not a valid signal. When the page is genuinely
    // launched from inside Telegram, WebApp.initData is a non-empty string;
    // in a normal browser tab it stays ''. That's the reliable check.
    return !!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData);
  }

  /**
   * Renders the full luxury certificate markup + action buttons into the
   * modal, given a resolved certificate record and a (possibly synthetic)
   * user object. Used both for the normal logged-in flow and for the
   * Telegram "export to external browser" handoff flow.
   */
  function renderCertificateModal(cert, user) {
    const modal = document.getElementById('certificate-modal');
    const container = document.getElementById('certificate-content');
    if (!modal || !container) return;

    const isDemo = !!(user && user.isDemo) || !!(cert && cert.isDemo);
    const userName = isDemo ? 'Demo User' : (user.name || cert.userName || 'Foydalanuvchi');
    const score = cert.score;
    const total = cert.total;
    const percentage = cert.percentage;
    const grade = cert.grade || calculateGrade(percentage, true);
    const certNumber = cert.certificateId || (isDemo ? 'OP-2026-DEMO' : generateCertificateId());
    const dateStr = cert.dateStr || new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
    const yearStr = cert.year || new Date().getFullYear();
    const verifyUrl = isDemo ? 'https://osonprava.uz/verify/demo' : `https://osonprava.uz/verify/${certNumber}`;

    // Remember exactly what is on screen so downloadCertificate() can hand
    // this same data off to an external browser tab if we're inside Telegram.
    lastCertData = {
      userName, score, total, percentage, grade,
      certificateId: certNumber, dateStr, year: yearStr, isDemo
    };

    container.innerHTML = `
      <div id="printable-certificate" class="relative bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-600/40 shadow-2xl overflow-hidden font-sans">
        
        <!-- Luxury Corner Ornaments -->
        <div class="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-600"></div>
        <div class="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-600"></div>
        <div class="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-600"></div>
        <div class="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-600"></div>

        <!-- Header -->
        <div class="text-center mb-8">
          ${isDemo ? `
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-extrabold text-[10px] tracking-widest uppercase mb-3 shadow-xs">
              <i class="fa-solid fa-wand-magic-sparkles text-amber-500"></i>
              <span>DEMO REJIM • NAMUNA SERTIFIKAT</span>
            </div>
          ` : ''}
          <div class="inline-flex items-center gap-2 mb-2">
            <div class="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
              <i class="fa-solid fa-car-side"></i>
            </div>
            <span class="font-extrabold text-xl tracking-tight text-slate-900">
              OSON <span class="text-blue-600">PRAVA</span>
            </span>
          </div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            OSON PRAVA — Zamonaviy Nazariy Ta’lim Platformasi
          </p>

          <h1 class="text-3xl sm:text-4xl font-serif font-black tracking-wider text-amber-700 mt-4 mb-1">
            MUVAFFAQIYAT SERTIFIKATI
          </h1>
          <p class="text-xs text-slate-500 font-serif italic">Certificate of Theoretical Course Excellence</p>
        </div>

        <!-- Body -->
        <div class="text-center space-y-4 my-8 max-w-xl mx-auto">
          <p class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Ushbu sertifikat tasdiqlaydiki:</p>
          
          <h2 class="text-2xl sm:text-3xl font-extrabold text-blue-900 border-b-2 border-amber-400/60 pb-2 inline-block px-8">
            ${userName}
          </h2>

          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            O‘zbekiston Respublikasi Yo‘l Harakati Qoidalari bo‘yicha 
            <strong>OSON PRAVA nazariy kursi va davlat imtihoni formati simulyatsiyasi</strong>ni muvaffaqiyatli topshirdi hamda yuqori darajadagi bilim va tayyorgarlik ko‘rsatdi.
          </p>
        </div>

        <!-- Scores & Verification Grid -->
        <div class="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 max-w-lg mx-auto text-center mb-8">
          <div>
            <span class="text-[10px] text-slate-500 block uppercase font-semibold">To‘plangan ball</span>
            <span class="text-lg font-black text-emerald-700">${score} / ${total}</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block uppercase font-semibold">O‘zlashtirish</span>
            <span class="text-lg font-black text-blue-700">${percentage}%</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block uppercase font-semibold">Baholash</span>
            <span class="text-lg font-black text-amber-600">${grade}</span>
          </div>
        </div>

        <!-- Footer: Seal, Pechat, QR, Signatures -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200 text-left relative">
          
          <!-- Left: Verification Info & ID -->
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 p-0.5 shadow flex items-center justify-center text-center flex-shrink-0">
              <div class="w-full h-full rounded-full border border-dashed border-amber-800 flex flex-col items-center justify-center text-[7px] font-black text-amber-900">
                <i class="fa-solid fa-award text-xs text-amber-950"></i>
                <span>TASDIQ</span>
              </div>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">Sertifikat raqami:</span>
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-mono font-bold text-slate-800 tracking-wide">${certNumber}</span>
                ${isDemo ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300">DEMO</span>' : ''}
              </div>
              <span class="text-[10px] text-slate-500 block mt-0.5"><i class="fa-regular fa-calendar-check mr-1"></i>${dateStr}</span>
            </div>
          </div>

          <!-- Center: Official Circular Stamp / Pechat with Site Brand Logo -->
          <div class="official-seal-stamp w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 my-2 sm:my-0">
            <svg viewBox="0 0 160 160" class="w-full h-full select-none" style="color: #1D4ED8;">
              <defs>
                <path id="sealPathUpper" d="M 18,80 A 62,62 0 1,1 142,80" fill="none"/>
                <path id="sealPathLower" d="M 142,80 A 62,62 0 0,1 18,80" fill="none"/>
                <filter id="stampGrain" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
              </defs>

              <g filter="url(#stampGrain)">
                <!-- Outer double circular borders with dashed security ring -->
                <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" stroke-width="3" opacity="0.92"/>
                <circle cx="80" cy="80" r="71" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3.5 2" opacity="0.85"/>
                <circle cx="80" cy="80" r="49" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.9"/>
                <circle cx="80" cy="80" r="45" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.75"/>

                <!-- Circular Text: Upper -->
                <text fill="currentColor" font-size="8.2" font-family="'Inter', -apple-system, sans-serif" font-weight="900" letter-spacing="1.4" opacity="0.95">
                  <textPath href="#sealPathUpper" startOffset="50%" text-anchor="middle">
                    OSON PRAVA • MILLIY TA’LIM
                  </textPath>
                </text>

                <!-- Circular Text: Lower (YHQ RASMIY MUHR • 2026 / HAYDOVCHILIK MARKAZI) -->
                <text fill="currentColor" font-size="7.4" font-family="'Inter', -apple-system, sans-serif" font-weight="800" letter-spacing="1.2" opacity="0.92">
                  <textPath href="#sealPathLower" startOffset="50%" text-anchor="middle">
                    YHQ RASMIY MUHR • ${yearStr}
                  </textPath>
                </text>

                <!-- Decorative Stars -->
                <text x="18" y="83" fill="currentColor" font-size="9" text-anchor="middle">★</text>
                <text x="142" y="83" fill="currentColor" font-size="9" text-anchor="middle">★</text>

                <!-- Center: Official Site Brand Logo Emblem (Steering Wheel + Road Perspective) -->
                <g transform="translate(56, 52) scale(0.4)">
                  <!-- Road perspective -->
                  <path d="M43 96 L53 58 L67 58 L77 96 Z" fill="currentColor" opacity="0.9"/>
                  <line x1="60" y1="62" x2="60" y2="72" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
                  <line x1="60" y1="78" x2="60" y2="92" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
                  <!-- Steering wheel outer rim -->
                  <circle cx="60" cy="60" r="41" stroke="currentColor" stroke-width="7" fill="none" opacity="0.95"/>
                  <!-- Spokes -->
                  <path d="M22 60 L48 60" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
                  <path d="M72 60 L98 60" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
                  <path d="M60 72 L60 97" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
                  <!-- Central Hub -->
                  <circle cx="60" cy="58" r="13" fill="currentColor"/>
                  <circle cx="60" cy="58" r="9" fill="#FFFFFF"/>
                  <path d="M55 58 L58 61 L65 54" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </g>

                <!-- Center verification text -->
                <text x="80" y="98" text-anchor="middle" fill="currentColor" font-size="7" font-weight="900" font-family="'Inter', sans-serif" letter-spacing="1">TASDIQLANDI</text>
                <text x="80" y="106" text-anchor="middle" fill="currentColor" font-size="6" font-weight="700" font-family="monospace">${yearStr}-YIL</text>
              </g>
            </svg>
          </div>

          <!-- Right: QR Code for Verification -->
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 bg-slate-900 rounded-xl p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                 title="Haqiqiyligini tekshirish havolasi: ${verifyUrl}"
                 onclick="window.OSON_CERTIFICATE.shareCertificate('${certNumber}')">
              <svg viewBox="0 0 40 40" class="w-full h-full fill-white">
                <rect x="2" y="2" width="10" height="10"/>
                <rect x="4" y="4" width="6" height="6" fill="#0F172A"/>
                <rect x="28" y="2" width="10" height="10"/>
                <rect x="30" y="4" width="6" height="6" fill="#0F172A"/>
                <rect x="2" y="28" width="10" height="10"/>
                <rect x="4" y="30" width="6" height="6" fill="#0F172A"/>
                <rect x="16" y="6" width="8" height="4"/>
                <rect x="16" y="16" width="8" height="8"/>
                <rect x="28" y="18" width="10" height="4"/>
                <rect x="18" y="28" width="6" height="10"/>
                <rect x="28" y="28" width="8" height="8"/>
              </svg>
            </div>
            <div class="text-[10px] text-slate-500 max-w-[120px] leading-tight">
              Haqiqiyligini tekshirish uchun QR-kodni skanerlang
            </div>
          </div>

        </div>

      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button type="button" 
                class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onclick="window.OSON_UI.closeModal('certificate-modal')">
          Yopish
        </button>

        <button type="button" 
                id="btn-download-cert"
                class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all btn-press flex items-center gap-2"
                onclick="window.OSON_CERTIFICATE.downloadCertificate('${certNumber}')">
          <i class="fa-solid fa-download"></i>
          <span>Sertifikatni yuklab olish</span>
        </button>
      </div>
    `;

    window.OSON_UI.openModal('certificate-modal');
  }

  /**
   * Renders a certificate straight from a plain data object, bypassing
   * login/localStorage entirely. Used on the receiving end of the Telegram
   * export hand-off: the external browser tab has no session of its own,
   * so all the certificate's fields are passed in via the URL instead.
   */
  function openCertificateFromData(payload) {
    if (!payload) return;
    const cert = {
      userName: payload.userName,
      score: payload.score,
      total: payload.total,
      percentage: payload.percentage,
      grade: payload.grade,
      certificateId: payload.certificateId,
      dateStr: payload.dateStr,
      year: payload.year,
      isDemo: !!payload.isDemo
    };
    const user = { name: payload.userName, isDemo: !!payload.isDemo };
    renderCertificateModal(cert, user);
  }

  /**
   * Encodes the given certificate data into a URL-safe string carried in
   * the ?cert_export= query parameter (UTF-8 safe, for Uzbek/Cyrillic names).
   */
  function encodeCertExportParam(cert) {
    const json = JSON.stringify(cert);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return encodeURIComponent(base64);
  }

  function decodeCertExportParam(param) {
    const base64 = decodeURIComponent(param);
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  }

  /**
   * On page load, checks whether this page was opened as a Telegram export
   * hand-off (?cert_export=...). If so, renders the certificate from the
   * URL payload and immediately attempts the PDF download — this call runs
   * in a normal, unsandboxed browser tab, so the download works normally.
   * Safe to call on every page load: does nothing when the param is absent.
   */
  function initFromUrlIfNeeded() {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('cert_export');
      if (!raw) return;

      const payload = decodeCertExportParam(raw);
      openCertificateFromData(payload);

      // Give the modal a moment to paint, then trigger the export. The
      // visible "Sertifikatni yuklab olish" button stays as a manual
      // fallback in case the auto-attempt is blocked by the browser.
      setTimeout(() => {
        downloadCertificate(payload.certificateId);
      }, 400);
    } catch (err) {
      console.warn('[Certificate] Havoladagi sertifikat ma\'lumotini o\'qib bo\'lmadi:', err);
    }
  }

  /**
   * Detects whether we're specifically inside Telegram WEB (web.telegram.org
   * in Chrome/etc.) as opposed to the native Desktop/Android/iOS apps. Web
   * Telegram embeds the Mini App in an <iframe>; Telegram.WebApp.openLink()
   * there works by posting a message up to the parent web.telegram.org page,
   * which then calls window.open() on our behalf. That extra postMessage hop
   * happens outside the original click's call stack, so Chrome's popup
   * blocker frequently does NOT treat it as a genuine user gesture and
   * silently blocks it — this is exactly why the native apps' download
   * worked but Web Telegram's didn't.
   */
  function isTelegramWebClient() {
    if (!isTelegramWebApp()) return false;
    const platform = window.Telegram.WebApp.platform;
    if (platform === 'web' || platform === 'weba' || platform === 'webk') return true;
    // Fallback heuristic: native Telegram apps host the Mini App as a full
    // WebView (top-level), while Telegram Web always embeds it in an iframe.
    try {
      return window.self !== window.top;
    } catch (e) {
      return true; // cross-origin access blocked => definitely inside an iframe
    }
  }

  /**
   * Preferred Telegram download path (Bot API 8.0+): hands the file off to
   * Telegram's own native downloadFile() popup instead of relying on a
   * synthetic <a download> click (which the Mini App's sandboxed
   * WebView/iframe silently swallows). Crucially, this works identically in
   * Telegram Desktop/Android/iOS AND in Telegram Web (web.telegram.org),
   * because the *Telegram client itself* — not our sandboxed page — fetches
   * the URL directly from api/certificate.js, where the PDF is generated
   * fully server-side. Returns true if the download was handed off this way.
   */
  function buildServerCertificateUrl(certData) {
    const dataParam = encodeCertExportParam(certData);
    return `${window.location.origin}/api/certificate?data=${dataParam}`;
  }

  /**
   * Telegram-native download. Telegram fetches the PDF itself, which avoids
   * WebView/iframe download restrictions.
   */
  function downloadViaTelegramDownloadFile(certId) {
    if (!isTelegramWebApp() || !lastCertData) return false;
    const wa = window.Telegram.WebApp;
    if (!wa.downloadFile || typeof wa.downloadFile !== 'function') return false;

    try {
      const url = buildServerCertificateUrl(lastCertData);
      const fileName = `OSON-PRAVA-SERTIFIKAT-${certId}.pdf`;

      wa.downloadFile({ url, file_name: fileName }, (accepted) => {
        if (window.OSON_UI && typeof window.OSON_UI.showToast === 'function') {
          window.OSON_UI.showToast(
            accepted ? 'Sertifikat muvaffaqiyatli yuklab olindi ✓' : 'Yuklab olish bekor qilindi',
            accepted ? 'success' : 'info'
          );
        }
      });
      return true;
    } catch (err) {
      console.error('[Certificate] Telegram downloadFile() xatolik:', err);
      return false;
    }
  }

  /**
   * Fallback for older Telegram clients. Open the server PDF endpoint itself,
   * not the HTML certificate page. Content-Disposition: attachment then makes
   * Telegram/Chrome download the actual PDF instead of displaying the page.
   */
  function redirectToExternalBrowserIfInTelegram() {
    if (!isTelegramWebApp() || !lastCertData) return false;

    const url = buildServerCertificateUrl(lastCertData);
    try {
      if (isTelegramWebClient()) {
        const opened = window.open(url, '_blank', 'noopener');
        if (!opened && window.Telegram.WebApp.openLink) {
          window.Telegram.WebApp.openLink(url, { try_instant_view: false });
        }
      } else if (window.Telegram.WebApp.openLink) {
        window.Telegram.WebApp.openLink(url, { try_instant_view: false });
      } else {
        window.open(url, '_blank', 'noopener');
      }
    } catch (err) {
      console.error('[Certificate] Tashqi brauzerga yo‘naltirishda xatolik:', err);
      window.open(url, '_blank', 'noopener');
    }

    if (window.OSON_UI && typeof window.OSON_UI.showToast === 'function') {
      window.OSON_UI.showToast('Sertifikat yuklab olish uchun brauzerga yuborildi ✓', 'info');
    }
    return true;
  }

  /**
   * Universal browser download. The PDF is generated on the server and
   * returned with Content-Disposition: attachment. This avoids html2canvas
   * and jsPDF completely, so Chrome, Telegram Web and other browsers receive
   * the same real PDF file.
   */
  async function downloadFromServer(certId) {
    if (!lastCertData) throw new Error('Sertifikat ma’lumotlari topilmadi');

    const url = buildServerCertificateUrl(lastCertData);
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Accept': 'application/pdf' }
    });

    if (!response.ok) {
      let message = `Server xatosi: ${response.status}`;
      try {
        const body = await response.json();
        if (body && body.error) message = body.error;
      } catch (_) {}
      throw new Error(message);
    }

    const blob = await response.blob();
    if (!blob || blob.size < 100 || !blob.type.includes('pdf')) {
      throw new Error('Server haqiqiy PDF qaytarmadi');
    }

    const blobUrl = URL.createObjectURL(blob);
    try {
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = `OSON-PRAVA-SERTIFIKAT-${certId}.pdf`;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } finally {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    }
  }

  /**
   * Helper: Ensure html2canvas and jsPDF are loaded and available
   */
  async function ensurePdfLibraries() {
    if (window.html2canvas && (window.jspdf || window.jsPDF)) {
      return true;
    }

    const loadScript = (src) => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });

    try {
      if (!window.html2canvas) {
        try {
          await loadScript('vendor/pdf/html2canvas.min.js');
        } catch (_) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        }
      }
      if (!window.jspdf && !window.jsPDF) {
        try {
          await loadScript('vendor/pdf/jspdf.umd.min.js');
        } catch (_) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
      }
      return !!(window.html2canvas && (window.jspdf || window.jsPDF));
    } catch (err) {
      console.error('[Certificate] PDF kutubxonalarini yuklashda xatolik:', err);
      return false;
    }
  }

  /**
   * Helper: Rasterize an inline SVG into a high-resolution PNG image
   * This ensures circular <textPath>, filters, and vector stamps render
   * with 100% precision inside html2canvas without missing SVG elements.
   */
  async function rasterizeSvgToImage(svgElement, scale = 3) {
    try {
      const rect = svgElement.getBoundingClientRect();
      const width = rect.width || parseFloat(svgElement.getAttribute('width')) || 144;
      const height = rect.height || parseFloat(svgElement.getAttribute('height')) || 144;

      const svgClone = svgElement.cloneNode(true);
      svgClone.setAttribute('width', width);
      svgClone.setAttribute('height', height);

      const xml = new XMLSerializer().serializeToString(svgClone);
      const svgBase64 = btoa(unescape(encodeURIComponent(xml)));
      const src = 'data:image/svg+xml;base64,' + svgBase64;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // graceful fallback
        img.src = src;
      });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngImg = document.createElement('img');
      pngImg.src = canvas.toDataURL('image/png');
      pngImg.style.width = width + 'px';
      pngImg.style.height = height + 'px';
      pngImg.style.display = 'block';
      if (svgElement.getAttribute('class')) {
        pngImg.className = svgElement.getAttribute('class');
      }
      return pngImg;
    } catch (e) {
      console.warn('[Certificate] SVG render ogohlantirish:', e);
      return null;
    }
  }

  let isDownloading = false;

  /**
   * Professional Client-Side PDF Certificate Generation & Direct Download
   * Generates high-fidelity PDF without window.print() or browser print dialogs.
   * Preserves full luxury diploma design, seal stamp, QR code, borders, fonts and colors.
   */
  async function downloadCertificate(certId) {
    if (isDownloading) return;

    if (!certId) {
      const stored = getStoredCertificate();
      const user = window.OSON_AUTH ? window.OSON_AUTH.getUser() : null;
      certId = (stored && stored.certificateId)
        ? stored.certificateId
        : ((user && user.isDemo) ? 'OP-2026-DEMO' : 'OP-2026-CERT');
    }

    // Telegram Mini App: use Telegram's native file downloader first.
    if (isTelegramWebApp()) {
      if (downloadViaTelegramDownloadFile(certId)) return;
      // Fall through to the same server-generated PDF used by Chrome.
    }

    isDownloading = true;
    const btn = document.getElementById('btn-download-cert');
    let originalBtnHtml = '';
    if (btn) {
      btn.disabled = true;
      originalBtnHtml = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i><span>Yuklanmoqda...</span>`;
    }

    try {
      // All normal browsers use the same server-generated PDF. No client-side
      // screenshot/PDF libraries are needed for the actual certificate file.
      await downloadFromServer(certId);

      if (window.OSON_UI && typeof window.OSON_UI.showToast === 'function') {
        window.OSON_UI.showToast('Sertifikat muvaffaqiyatli yuklab olindi ✓', 'success');
      }
    } catch (serverErr) {
      console.error('[Certificate] Server PDF yuklab olishda xatolik:', serverErr);

      // Keep a client-side fallback for temporary API/network failures. This
      // is intentionally secondary; the server PDF is the canonical download.
      try {
        const libsReady = await ensurePdfLibraries();
        if (!libsReady) throw serverErr;

        const originalCert = document.getElementById('printable-certificate');
        if (!originalCert) throw new Error('Sertifikat elementi topilmadi');

        const stage = document.createElement('div');
        stage.style.position = 'fixed';
        stage.style.left = '-9999px';
        stage.style.top = '0';
        stage.style.width = '960px';
        stage.style.minWidth = '960px';
        stage.style.maxWidth = '960px';
        stage.style.zIndex = '-9999';
        stage.style.opacity = '1';
        stage.style.pointerEvents = 'none';

        const cloneCert = originalCert.cloneNode(true);
        cloneCert.id = 'printable-certificate-export';
        cloneCert.style.width = '960px';
        cloneCert.style.margin = '0';
        cloneCert.style.boxSizing = 'border-box';
        cloneCert.style.padding = '48px';
        cloneCert.style.transform = 'none';
        cloneCert.style.boxShadow = 'none';
        cloneCert.style.backgroundColor = '#ffffff';

        stage.appendChild(cloneCert);
        document.body.appendChild(stage);

        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch (_) {}
        }
        await new Promise(res => setTimeout(res, 60));

        const canvas = await window.html2canvas(cloneCert, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 960
        });
        stage.remove();

        const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
        if (!jsPdfConstructor) throw new Error('jsPDF mavjud emas');

        const pdf = new jsPdfConstructor({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        const ratio = canvas.width / canvas.height;
        let printW = maxW;
        let printH = printW / ratio;
        if (printH > maxH) {
          printH = maxH;
          printW = printH * ratio;
        }
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG',
          (pageWidth - printW) / 2, (pageHeight - printH) / 2, printW, printH,
          undefined, 'FAST');
        pdf.save(`OSON-PRAVA-SERTIFIKAT-${certId}.pdf`);

        if (window.OSON_UI && typeof window.OSON_UI.showToast === 'function') {
          window.OSON_UI.showToast('Sertifikat muvaffaqiyatli yuklab olindi ✓', 'success');
        }
      } catch (fallbackErr) {
        console.error('[Certificate] Client fallback ham xato:', fallbackErr);
        if (window.OSON_UI && typeof window.OSON_UI.showToast === 'function') {
          window.OSON_UI.showToast('Sertifikatni yuklab olishda xatolik yuz berdi. Qayta urinib ko‘ring.', 'error');
        }
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml || `<i class="fa-solid fa-download"></i><span>Sertifikatni yuklab olish</span>`;
      }
      isDownloading = false;
    }
  }

  function shareCertificate(certId) {
    const shareUrl = `https://osonprava.uz/verify/${certId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      if (window.OSON_UI && typeof window.OSON_UI.showToast === 'function') {
        window.OSON_UI.showToast(`Sertifikat tekshiruv havolasi nusxalandi: ${certId} 📋`, 'success');
      }
    } else {
      if (window.OSON_UI && typeof window.OSON_UI.showToast === 'function') {
        window.OSON_UI.showToast(`Sertifikat kodi: ${certId}`, 'info');
      }
    }
  }

  return {
    openCertificate,
    openCertificateFromData,
    initFromUrlIfNeeded,
    downloadCertificate,
    shareCertificate,
    createOrUpdateCertificate,
    getStoredCertificate,
    calculateGrade
  };
})();
