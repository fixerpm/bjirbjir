/**
 * OSON PRAVA — 2026 Yo‘l Harakati Jarimalari va 12-Ballik Tizim Kalkulyatori
 * 1 BHM = 375,000 so‘m (2026-yil amaldagi miqdor)
 * 15 kunlik 50% chegirmali to‘lov va jarima ballari hisoblagichi
 */

(function() {
  'use strict';

  const BHM_AMOUNT = 375000; // 1 BHM = 375,000 UZS

  const FINES_DATA = [
    {
      id: 'speed-20',
      category: 'speed',
      title: 'Tezlikni 20 km/soatgacha oshirish',
      bhm: 1,
      points: 1,
      article: 'MJtK 128-3-modda 1-qism',
      description: 'Belgilangan harakat tezligini soatiga 20 kilometrdan ko‘p bo‘lmagan kattalikda oshirish.',
      tips: 'Shaharlarda ruxsat etilgan tezlik 60 km/soat. Spidometrga doimo e’tibor bering.'
    },
    {
      id: 'speed-40',
      category: 'speed',
      title: 'Tezlikni 20 dan 40 km/soatgacha oshirish',
      bhm: 5,
      points: 2,
      article: 'MJtK 128-3-modda 2-qism',
      description: 'Belgilangan harakat tezligini soatiga 20 dan ortiq, lekin 40 kilometrdan ko‘p bo‘lmagan miqdorda oshirish.',
      tips: 'Aholi punktlarida yuqori tezlik piyodalar va chorrahalarda tormoz yo‘lini 2 barobar uzaytiradi.'
    },
    {
      id: 'speed-over40',
      category: 'speed',
      title: 'Tezlikni 40 km/soatdan ortiq oshirish',
      bhm: 9,
      points: 3,
      article: 'MJtK 128-3-modda 3-qism',
      description: 'Belgilangan harakat tezligini soatiga 40 kilometrdan ortiq kattalikda oshirish.',
      tips: 'O‘ta og‘ir qoidabuzarlik. Takror sodir etilsa, transport vositasini boshqarish huquqidan mahrum qilishga sabab bo‘ladi.'
    },
    {
      id: 'rose-light',
      category: 'safety',
      title: 'Svetoforning taqiqlovchi (qizil/sariq) chirog‘iga o‘tish',
      bhm: 2,
      points: 2,
      article: 'MJtK 128-4-modda 1-qism',
      description: 'Svetoforning taqiqlovchi signali yoki yo‘l harakatini tartibga soluvchining taqiqlovchi ishorasiga bo‘ysunmaslik.',
      tips: 'Sariq chiroq ham taqiqlovchi hisoblanadi! Faqat favqulodda keskin tormozlanishning oldini olish uchungina o‘tishga ruxsat etiladi.'
    },
    {
      id: 'seatbelt',
      category: 'safety',
      title: 'Xavfsizlik kamarini taqmasdan harakatlanish',
      bhm: 0.5,
      points: 0.5,
      article: 'MJtK 125-modda 2-qism',
      description: 'Haydovchining harakat vaqtida xavfsizlik kamaridan foydalanmasligi.',
      tips: 'Kamar yo‘l-transport hodisasida hayotni saqlab qolish ehtimolini 70% ga oshiradi.'
    },
    {
      id: 'phone-call',
      category: 'safety',
      title: 'Harakat vaqtida telefondan foydalanish',
      bhm: 3,
      points: 2,
      article: 'MJtK 128-1-modda',
      description: 'Transport vositasini boshqarish paytida haydovchining telefondan (quloqliksiz) foydalanishi.',
      tips: 'Telefonga 3 soniya chalg‘ish 60 km/soat tezlikda mashinaning 50 metrni ko‘r-ko‘rona bosib o‘tishiga tengdir.'
    },
    {
      id: 'road-markings',
      category: 'order',
      title: 'Yo‘l chizig‘ini bosish / To‘xtash qoidasini buzish',
      bhm: 0.5,
      points: 0.5,
      article: 'MJtK 128-modda 1-qism',
      description: 'Yo‘l belgilari yoki yo‘l chiziqlari talablariga rioya etmaslik, to‘xtash yoki to‘xtab turish qoidalarini buzish.',
      tips: 'Yaxlit oq chiziqni kesib o‘tish taqiqlanadi.'
    },
    {
      id: 'oncoming-lane',
      category: 'severe',
      title: 'Qarama-qarshi yo‘nalishga (Vstrechaga) chiqish',
      bhm: 10,
      points: 4,
      article: 'MJtK 128-5-modda 2-qism',
      description: 'Yo‘l harakati qoidalarini buzgan holda qarama-qarshi yo‘nalishdagi transport vositalari harakati uchun mo‘ljallangan yo‘l bo‘lagiga chiqish.',
      tips: 'Eng xavfli qoidabuzarliklardan biri. To‘qnashuv oqibatlari juda og‘ir bo‘ladi.'
    },
    {
      id: 'pedestrian-priority',
      category: 'safety',
      title: 'Piyodalar o‘tish joyida yo‘l bermaslik',
      bhm: 2,
      points: 1,
      article: 'MJtK 128-modda',
      description: 'Tartibga solinmagan piyodalar o‘tish joyida qatnov qismiga chiqqan piyodalarga yo‘l bermaslik.',
      tips: 'Piyodalar o‘tish joyiga yaqinlashganda tezlikni oldindan pasaytiring.'
    },
    {
      id: 'tinted-glass',
      category: 'order',
      title: 'Ruxsatnomasiz qoraytirilgan oynalar (Tonirovka)',
      bhm: 25,
      points: 3,
      article: 'MJtK 126-modda',
      description: 'Tegishli ruxsatnomasiz ko‘zgusimon yoki tusini o‘zgartiruvchi oynalar o‘rnatilgan avtotransportni boshqarish.',
      tips: 'Oynalarni qoraytirish uchun Yagona interaktiv davlat xizmatlari portali (my.gov.uz) orqali ruxsatnoma oling.'
    }
  ];

  // State
  let selectedFineIds = new Set(['speed-20']);
  let activeFilter = 'all';

  function formatMoney(num) {
    return Math.round(num).toLocaleString('uz-UZ') + ' so‘m';
  }

  function init() {
    renderFilterButtons();
    renderFinesCatalog();
    calculateTotals();
  }

  function renderFilterButtons() {
    const container = document.getElementById('fines-filter-container');
    if (!container) return;

    const filters = [
      { id: 'all', label: 'Barchasi' },
      { id: 'speed', label: 'Tezlik' },
      { id: 'safety', label: 'Xavfsizlik' },
      { id: 'order', label: 'Tartib' },
      { id: 'severe', label: 'Og‘ir qoidabuzarlik' }
    ];

    container.innerHTML = filters.map(f => `
      <button type="button" 
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }"
              onclick="window.OSON_FINES.setFilter('${f.id}')">
        ${f.label}
      </button>
    `).join('');
  }

  function setFilter(filterId) {
    activeFilter = filterId;
    renderFilterButtons();
    renderFinesCatalog();
  }

  function toggleFine(fineId) {
    if (selectedFineIds.has(fineId)) {
      selectedFineIds.delete(fineId);
    } else {
      selectedFineIds.add(fineId);
    }
    renderFinesCatalog();
    calculateTotals();
    if (window.OSON_SOUND) window.OSON_SOUND.playClick();
  }

  function clearAllSelections() {
    selectedFineIds.clear();
    renderFinesCatalog();
    calculateTotals();
  }

  function renderFinesCatalog() {
    const listContainer = document.getElementById('fines-cards-grid');
    if (!listContainer) return;

    const filtered = FINES_DATA.filter(item => {
      if (activeFilter === 'all') return true;
      return item.category === activeFilter;
    });

    listContainer.innerHTML = filtered.map(item => {
      const isSelected = selectedFineIds.has(item.id);
      const fullAmount = item.bhm * BHM_AMOUNT;
      const discountAmount = fullAmount * 0.5;

      return `
        <div class="relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
          isSelected
            ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
        }" onclick="window.OSON_FINES.toggleFine('${item.id}')">
          
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex items-center gap-2.5">
              <span class="w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
              }">
                ${isSelected ? '<i class="fa-solid fa-check text-[10px]"></i>' : ''}
              </span>
              <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                ${item.title}
              </h4>
            </div>

            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold flex-shrink-0 ${
              item.points >= 3
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : item.points >= 2
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }">
              <i class="fa-solid fa-triangle-exclamation text-[10px]"></i>
              ${item.points} ball
            </span>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 ml-7">
            ${item.description}
          </p>

          <div class="ml-7 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-3">
              <span class="font-bold text-slate-900 dark:text-slate-100">
                ${formatMoney(fullAmount)} <span class="text-slate-400 font-normal">(${item.bhm} BHM)</span>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold">
                15 kunda: ${formatMoney(discountAmount)} (-50%)
              </span>
            </div>
            <span class="text-[11px] font-medium text-slate-400">
              ${item.article}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  function calculateTotals() {
    let totalBhm = 0;
    let totalFullAmount = 0;
    let totalDiscountAmount = 0;
    let totalPoints = 0;

    selectedFineIds.forEach(id => {
      const fine = FINES_DATA.find(f => f.id === id);
      if (fine) {
        totalBhm += fine.bhm;
        const full = fine.bhm * BHM_AMOUNT;
        totalFullAmount += full;
        totalDiscountAmount += full * 0.5;
        totalPoints += fine.points;
      }
    });

    const bhmElem = document.getElementById('calc-total-bhm');
    const fullElem = document.getElementById('calc-total-full');
    const discElem = document.getElementById('calc-total-discount');
    const pointsElem = document.getElementById('calc-total-points');
    const pointsBar = document.getElementById('calc-points-bar');
    const warningBox = document.getElementById('calc-warning-box');
    const selectedCountElem = document.getElementById('calc-selected-count');

    if (bhmElem) bhmElem.textContent = `${totalBhm.toFixed(1)} BHM`;
    if (fullElem) fullElem.textContent = formatMoney(totalFullAmount);
    if (discElem) discElem.textContent = formatMoney(totalDiscountAmount);
    if (pointsElem) pointsElem.textContent = `${totalPoints.toFixed(1)} / 12 ball`;
    if (selectedCountElem) selectedCountElem.textContent = selectedFineIds.size;

    // Progress bar for 12 points limit
    if (pointsBar) {
      const percent = Math.min(100, (totalPoints / 12) * 100);
      pointsBar.style.width = percent + '%';

      if (totalPoints >= 9) {
        pointsBar.className = 'h-full bg-rose-500 rounded-full transition-all duration-500';
      } else if (totalPoints >= 5) {
        pointsBar.className = 'h-full bg-amber-500 rounded-full transition-all duration-500';
      } else {
        pointsBar.className = 'h-full bg-emerald-500 rounded-full transition-all duration-500';
      }
    }

    // Warning status box
    if (warningBox) {
      if (totalPoints >= 12) {
        warningBox.className = 'p-3.5 rounded-xl bg-rose-500 text-white text-xs font-semibold flex items-center gap-2.5 animate-pulse';
        warningBox.innerHTML = `
          <i class="fa-solid fa-skull-crossbones text-base"></i>
          <div>
            <strong>DIQQAT! 12 ball to‘liq to‘plandi!</strong><br>
            Qonunchilikka binoan haydovchi guvohnomasidan mahrum qilinadi va qayta imtihon topshirishi shart!
          </div>
        `;
        warningBox.classList.remove('hidden');
      } else if (totalPoints >= 8) {
        warningBox.className = 'p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-medium flex items-center gap-2.5';
        warningBox.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation text-rose-600 text-base"></i>
          <div>
            <strong>Yuqori xavf darajasi (${totalPoints} ball)!</strong><br>
            Yana ${12 - totalPoints} ball to‘plasangiz, guvohnomadan mahrum bo‘lishingiz mumkin. Ehtiyotkor bo‘ling!
          </div>
        `;
        warningBox.classList.remove('hidden');
      } else if (totalPoints > 0) {
        warningBox.className = 'p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-center gap-2.5';
        warningBox.innerHTML = `
          <i class="fa-solid fa-shield-halved text-amber-600 text-base"></i>
          <div>
            <strong>15 kunlik imtiyoz:</strong> Jarimani 15 kun ichida to‘lasangiz, 50% tejab qolasiz (${formatMoney(totalDiscountAmount)}).
          </div>
        `;
        warningBox.classList.remove('hidden');
      } else {
        warningBox.classList.add('hidden');
      }
    }
  }

  // Public API
  window.OSON_FINES = {
    init: init,
    toggleFine: toggleFine,
    setFilter: setFilter,
    clearAllSelections: clearAllSelections,
    getFinesData: () => FINES_DATA
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
