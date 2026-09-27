/**
 * OSON PRAVA — Investor Pitch Deck Module
 * Interactive slide deck presentation modal for investors, academies, and juries
 */

window.OSON_PITCH = (function() {
  'use strict';

  let currentSlide = 0;
  const slides = [
    {
      badge: 'SLAYD 1: MUAMMO',
      title: 'O‘zbekistonda Haydovchilik Ta’limidagi Inqiroz',
      subtitle: 'Nega an’anaviy avtomaktablar bugungi talabga javob bermayapti?',
      content: `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div class="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center">
            <span class="text-3xl font-black text-rose-600 block mb-1">42%</span>
            <p class="text-xs text-rose-800 dark:text-rose-200 font-semibold">1-urinishda nazariy imtihondan yiqilish darajasi</p>
          </div>
          <div class="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center">
            <span class="text-3xl font-black text-amber-600 block mb-1">70%+</span>
            <p class="text-xs text-amber-800 dark:text-amber-200 font-semibold">Qoidani tushunmasdan ko‘r-ko‘rona yodlovchi o‘quvchilar</p>
          </div>
          <div class="p-5 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-center">
            <span class="text-3xl font-black text-slate-800 dark:text-white block mb-1">9,800+</span>
            <p class="text-xs text-slate-600 dark:text-slate-300 font-semibold">Yillik yo‘l-transport hodisalari va qoidabuzarliklar</p>
          </div>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Amaldagi test dasturlari zerikarli, tushuntirishsiz va faqat quruq variantlarni taqdim etadi. O‘quvchi nega aynan shu javob to‘g‘riligini bilmaydi.
        </p>
      `
    },
    {
      badge: 'SLAYD 2: YECHIM',
      title: 'OSON PRAVA — Yangi Avlod EdTech Platformasi',
      subtitle: 'Gamifikatsiya, tushunarli vizualizatsiya va 100% rasmiy standartlar',
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
            <i class="fa-solid fa-traffic-light text-blue-600 text-xl mt-1"></i>
            <div>
              <h5 class="font-bold text-xs text-blue-950 dark:text-blue-200 mb-1">2D Interaktiv Chorraha Simulyatori</h5>
              <p class="text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed">Mashinalar harakat navbati real vaqtda jonlanadi va har bir qoida asoslanadi.</p>
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-start gap-3">
            <i class="fa-solid fa-stopwatch text-emerald-600 text-xl mt-1"></i>
            <div>
              <h5 class="font-bold text-xs text-emerald-950 dark:text-emerald-200 mb-1">25 Daqiqalik Davlat Imtihoni</h5>
              <p class="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed">YHXBB andozasi bo‘yicha to‘liq psixologik va nazariy tayyorgarlik muhiti.</p>
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
            <i class="fa-solid fa-brain text-blue-600 text-xl mt-1"></i>
            <div>
              <h5 class="font-bold text-xs text-blue-950 dark:text-blue-200 mb-1">Har bir xatoga o‘zbekcha izoh</h5>
              <p class="text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed">Noto‘g‘ri javob berilganda qonun moddasi va amaliy maslahat darhol ko‘rsatiladi.</p>
            </div>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-3">
            <i class="fa-solid fa-certificate text-amber-600 text-xl mt-1"></i>
            <div>
              <h5 class="font-bold text-xs text-amber-950 dark:text-amber-200 mb-1">QR-kodli Rasmiy Sertifikat</h5>
              <p class="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">Imtihondan o‘tgan talabalarga sertifikat berilib, avtomaktabda sinovdan ozod etiladi.</p>
            </div>
          </div>
        </div>
      `
    },
    {
      badge: 'SLAYD 3: BOZOR HAJMI',
      title: 'O‘zbekiston va Markaziy Osiyo Bozori Salohiyati',
      subtitle: 'Har yili barqaror o‘sib boruvchi ulkan auditoriya',
      content: `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-center">
          <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="text-xs text-slate-400 block mb-1">TAM (Jami bozor)</span>
            <span class="text-2xl font-black text-slate-900 dark:text-white">$45 Million</span>
            <p class="text-[10px] text-slate-500 mt-1">Markaziy Osiyo haydovchilik ta’limi</p>
          </div>
          <div class="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <span class="text-xs text-blue-600 dark:text-blue-300 block mb-1">SAM (O‘zbekiston)</span>
            <span class="text-2xl font-black text-blue-700 dark:text-blue-300">$15 Million</span>
            <p class="text-[10px] text-blue-600/70 mt-1">Yillik 500,000+ yangi haydovchilar</p>
          </div>
          <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
            <span class="text-xs text-emerald-600 dark:text-emerald-300 block mb-1">SOM (2 Yillik maqsad)</span>
            <span class="text-2xl font-black text-emerald-700 dark:text-emerald-300">$3.2 Million</span>
            <p class="text-[10px] text-emerald-600/70 mt-1">150,000 ta to‘lovchi o‘quvchilar</p>
          </div>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-400">
          Har yili O‘zbekistonda 500 mingdan ziyod fuqarolar avtomaktablarga qatnashadi. Ularning 85% dan ortig‘i yoshlar va smartfon foydalanuvchilaridir.
        </p>
      `
    },
    {
      badge: 'SLAYD 4: BIZNES MODEL',
      title: 'Monetizatsiya va Daromad Oqimlari',
      subtitle: 'Barqaror B2C va B2B gibrid modeli',
      content: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] uppercase mb-2 inline-block">B2C Model</span>
            <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2">Freemium + PRO Obuna</h4>
            <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li>• Bepul: 10 ta dars va asosiy testlar</li>
              <li>• <strong>PRO Haydovchi: 79,000 so‘m</strong> (cheksiz imtihon, sertifikat)</li>
              <li>• <strong>VIP Murabbiy: 199,000 so‘m</strong> (1-on-1 onlayn tahlil)</li>
            </ul>
          </div>
          <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase mb-2 inline-block">B2B SaaS Model</span>
            <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2">Avtomaktablar LMS Tizimi</h4>
            <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li>• O‘quvchilar progressini kuzatish boshqaruv paneli</li>
              <li>• <strong>Oyiga 1,500,000 so‘m</strong> litsenziya to‘lovi</li>
              <li>• Respublika bo‘ylab 600+ faol avtomaktablar</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      badge: 'SLAYD 5: ROADMAP',
      title: 'Rivojlanish Yo‘l Xaritasi (Roadmap 2026 - 2027)',
      subtitle: 'Loyiha kelgusi 12 oy ichida qanday kengayadi?',
      content: `
        <div class="space-y-4 my-6">
          <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">Q3</span>
            <div>
              <h5 class="font-bold text-xs text-slate-900 dark:text-white">Web MVP & 2D Chorraha Simulyatori (Amalda)</h5>
              <p class="text-[11px] text-slate-500">To‘liq o‘zbekcha interfeys, LocalStorage, davlat imtihoni simulyatsiyasi va sertifikatlar.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">Q4</span>
            <div>
              <h5 class="font-bold text-xs text-slate-900 dark:text-white">Mobil Ilova (iOS & Android) + Avtomaktablar Integratsiyasi</h5>
              <p class="text-[11px] text-slate-500">Toshkentdagi 20 ta yirik avtomaktab bilan rasmiy sinov integratsiyasi.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span class="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">2027</span>
            <div>
              <h5 class="font-bold text-xs text-slate-900 dark:text-white">3D / VR Haydash Amaliyoti va AI Murabbiy</h5>
              <p class="text-[11px] text-slate-500">Shahar ko‘chalarida xavflarni oldindan sezish va virtual haydash ko‘nikmasi.</p>
            </div>
          </div>
        </div>
      `
    }
  ];

  function openPitchDeck() {
    currentSlide = 0;
    renderSlide();
    window.OSON_UI.openModal('pitch-modal');
  }

  function renderSlide() {
    const container = document.getElementById('pitch-slide-content');
    const dotsContainer = document.getElementById('pitch-dots');
    const prevBtn = document.getElementById('pitch-prev-btn');
    const nextBtn = document.getElementById('pitch-next-btn');
    if (!container) return;

    const s = slides[currentSlide];

    container.innerHTML = `
      <div class="animate-fade-in">
        <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-extrabold uppercase tracking-wider mb-3 inline-block">
          ${s.badge}
        </span>
        <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
          ${s.title}
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          ${s.subtitle}
        </p>
        
        <div>
          ${s.content}
        </div>
      </div>
    `;

    // Render navigation dots
    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((_, idx) => `
        <button type="button" 
                class="w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? 'w-8 bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }"
                onclick="window.OSON_PITCH.goToSlide(${idx})">
        </button>
      `).join('');
    }

    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) {
      if (currentSlide === slides.length - 1) {
        nextBtn.innerHTML = `<span>Yopish</span> <i class="fa-solid fa-check ml-1"></i>`;
      } else {
        nextBtn.innerHTML = `<span>Keyingi</span> <i class="fa-solid fa-arrow-right ml-1"></i>`;
      }
    }
  }

  function nextSlide() {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      renderSlide();
    } else {
      window.OSON_UI.closeModal('pitch-modal');
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      renderSlide();
    }
  }

  function goToSlide(idx) {
    currentSlide = idx;
    renderSlide();
  }

  return {
    openPitchDeck,
    nextSlide,
    prevSlide,
    goToSlide
  };
})();
