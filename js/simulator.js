/**
 * OSON PRAVA — Interactive 2D Crossroad Simulator (v2.0)
 * Realistic Uzbek intersection scenarios, interactive turn sequence guessing,
 * visual traffic priority animations, and instant educational feedback.
 */

window.OSON_SIMULATOR = (function() {
  'use strict';

  let currentScenarioIdx = 0;
  let userSelectedOrder = [];
  let isChecking = false;

  function getScenarios() {
    if (window.OSON_DATA && Array.isArray(window.OSON_DATA.simulatorScenarios)) {
      return window.OSON_DATA.simulatorScenarios;
    }
    return [
      {
        id: 'sc-1',
        title: 'Teng ahamiyatli chorraha (O‘ng qo‘l qoidasi)',
        desc: 'Svetofor va imtiyoz belgilari yo‘q. 3 ta avtomobil bir vaqtda chorrahaga yaqinlashmoqda.',
        signsText: 'Belgilar yo‘q (Teng huquqli)',
        cars: [
          { id: 'yellow', name: 'Sariq avtomobil (C)', dir: 'To‘g‘riga ketmoqda', color: '#F59E0B', icon: 'car-side', enterFrom: 'S' },
          { id: 'red', name: 'Qizil avtomobil (A)', dir: 'To‘g‘riga ketmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'N' },
          { id: 'blue', name: 'Ko‘k avtomobil (B)', dir: 'Chapga burilmoqda', color: '#2563EB', icon: 'car-side', enterFrom: 'E' }
        ],
        correctOrder: ['yellow', 'red', 'blue'],
        orderText: '1. Sariq (C) → 2. Qizil (A) → 3. Ko‘k (B)',
        explanation: 'Teng ahamiyatli yo‘llarda haydovchi o‘zidan o‘ng tomondan kelayotgan transportga yo‘l berishi shart.'
      }
    ];
  }

  // Render crossroad simulator UI
  function renderSimulator() {
    const containers = [
      document.getElementById('crossroad-sim-container'),
      document.getElementById('simulyator-dedicated-container')
    ].filter(Boolean);
    if (containers.length === 0) return;

    const scenarios = getScenarios();
    const sc = scenarios[currentScenarioIdx] || scenarios[0];
    userSelectedOrder = [];

    const html = `
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
        
        <!-- Header & Scenario Tabs -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] tracking-wide">
                INTERAKTIV 2D CHORRAHA
              </span>
              <span class="text-xs text-slate-400 font-medium">Stsenariy ${currentScenarioIdx + 1} / ${scenarios.length}</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ${sc.title}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">${sc.desc}</p>
          </div>

          <!-- Scenario Pills Scroller -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
            ${scenarios.map((s, idx) => `
              <button type="button" 
                      class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                        idx === currentScenarioIdx 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }"
                      onclick="window.OSON_SIMULATOR.selectScenario(${idx})">
                #${idx + 1}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 2D Intersection Arena -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Visual Crossroad Graphics (SVG Canvas) -->
          <div class="lg:col-span-7 bg-slate-950 rounded-3xl p-4 sm:p-6 relative overflow-hidden shadow-2xl flex items-center justify-center border border-slate-800">
            ${renderCrossroadSVG(sc)}
            
            <div class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
              <i class="fa-solid fa-traffic-light text-amber-400 text-xs"></i>
              <span>${sc.signsText}</span>
            </div>

            <span class="absolute bottom-3 right-4 text-[10px] text-slate-500 font-mono">
              2D Simulyator • 60 FPS
            </span>
          </div>

          <!-- Right Column: Interactive Turn Sequence Builder -->
          <div class="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  O‘tish ketma-ketligini belgilang:
                </h4>
                <button type="button" 
                        class="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        onclick="window.OSON_SIMULATOR.resetSelection()">
                  Qayta tanlash
                </button>
              </div>

              <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Qaysi transport birinchi o‘tishi kerak bo‘lsa, ketma-ketlikda bosing:
              </p>

              <!-- Vehicle Pickers -->
              <div class="sim-vehicles-list space-y-2 mb-4">
                ${sc.cars.map(c => `
                  <button type="button" 
                          data-car-id="${c.id}"
                          class="btn-car-${c.id} w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 hover:border-blue-500 dark:hover:border-blue-400 flex items-center justify-between text-xs transition-all text-left group"
                          onclick="window.OSON_SIMULATOR.pickCar('${c.id}')">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm" style="background-color: ${c.color}">
                        <i class="fa-solid fa-${c.icon || 'car-side'}"></i>
                      </div>
                      <div>
                        <div class="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          ${c.name}
                        </div>
                        <div class="text-[11px] text-slate-400">${c.dir}</div>
                      </div>
                    </div>
                    <span class="badge-order-${c.id} w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center">
                      -
                    </span>
                  </button>
                `).join('')}
              </div>

              <!-- Selected Order Pill Strip -->
              <div class="sim-order-display p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 min-h-[42px]">
                <span class="text-slate-400 text-xs font-normal">Sizning tanlovingiz:</span>
                <span class="sim-order-tags font-bold text-blue-600 dark:text-blue-400">Hali tanlanmadi</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2.5 pt-2">
              <div class="grid grid-cols-2 gap-2">
                <button type="button" 
                        class="sim-check-btn py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all btn-press flex items-center justify-center gap-1.5"
                        onclick="window.OSON_SIMULATOR.checkAnswer()">
                  <i class="fa-solid fa-check-double"></i>
                  <span>Tekshirish</span>
                </button>

                <button type="button" 
                        class="sim-action-btn py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all btn-press flex items-center justify-center gap-1.5"
                        onclick="window.OSON_SIMULATOR.runAnimation()">
                  <i class="fa-solid fa-play"></i>
                  <span>Play animatsiya</span>
                </button>
              </div>

              <button type="button" 
                      class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-1.5"
                      onclick="window.OSON_SIMULATOR.resetCars()">
                <i class="fa-solid fa-rotate-left text-xs"></i>
                <span>Boshlang‘ich holatga qaytarish</span>
              </button>
            </div>

            <!-- Result & Explanation Box -->
            <div class="sim-result-box hidden p-4 rounded-2xl border text-xs leading-relaxed animate-slide-up">
              <!-- Dynamically populated -->
            </div>

          </div>

        </div>

      </div>
    `;

    containers.forEach(c => {
      c.innerHTML = html;
    });
  }

  // Get realistic starting transform based on scenario and lane geometry
  function getStartTransform(sc, slotIndex) {
    if (!sc) return 'translate(210, 310)';
    if (sc.id === 'sc-3') {
      // Roundabout start positions:
      // Slot 0 (Red): inside the circular roundabout lane (East arc, oriented counter-clockwise facing NNW)
      if (slotIndex === 0) return 'translate(260, 160) rotate(-35 17 30)';
      // Slot 1 (Blue): waiting behind the South yield line
      if (slotIndex === 1) return 'translate(210, 305)';
    }
    if (sc.id === 'sc-8' && slotIndex === 0) {
      // Pedestrian start position on sidewalk near zebra crossing
      return 'translate(120, 275)';
    }
    if (slotIndex === 0) return 'translate(210, 310)'; // South approach
    if (slotIndex === 1) return 'translate(155, 30)';  // North approach
    if (slotIndex === 2) return 'translate(310, 155)'; // East approach
    return 'translate(210, 310)';
  }

  // Generate SVG Graphic depending on Scenario Type
  function renderCrossroadSVG(sc) {
    const isRoundabout = sc.id === 'sc-3';
    const isTram = sc.id === 'sc-4';
    const isPriorityTurn = sc.id === 'sc-5';
    const isAmbulance = sc.id === 'sc-6';
    const isArrowLight = sc.id === 'sc-7';
    const isPedestrian = sc.id === 'sc-8';

    const trans0 = getStartTransform(sc, 0);
    const trans1 = getStartTransform(sc, 1);
    const trans2 = getStartTransform(sc, 2);

    return `
      <svg viewBox="0 0 400 400" class="w-full max-w-sm sm:max-w-md h-auto select-none">
        <defs>
          <!-- Asphalt Texture & Glow Filters -->
          <filter id="simGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Asphalt Ground -->
        <rect width="400" height="400" fill="#0F172A"/>

        ${isRoundabout ? `
          <!-- ==================== ROUNDABOUT GEOMETRY ==================== -->
          <!-- Approach Asphalt Roads -->
          <rect x="140" y="0" width="120" height="400" fill="#1E293B"/>
          <rect x="0" y="140" width="400" height="120" fill="#1E293B"/>

          <!-- Circular Asphalt Ring -->
          <circle cx="200" cy="200" r="125" fill="#1E293B"/>

          <!-- Sidewalk Green Curbs -->
          <rect x="0" y="0" width="130" height="130" rx="28" fill="#064E3B" stroke="#047857" stroke-width="2"/>
          <rect x="270" y="0" width="130" height="130" rx="28" fill="#064E3B" stroke="#047857" stroke-width="2"/>
          <rect x="0" y="270" width="130" height="130" rx="28" fill="#064E3B" stroke="#047857" stroke-width="2"/>
          <rect x="270" y="270" width="130" height="130" rx="28" fill="#064E3B" stroke="#047857" stroke-width="2"/>

          <!-- Approach Divider Lines -->
          <line x1="200" y1="0" x2="200" y2="75" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.75"/>
          <line x1="200" y1="325" x2="200" y2="400" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.75"/>
          <line x1="0" y1="200" x2="75" y2="200" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.75"/>
          <line x1="325" y1="200" x2="400" y2="200" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.75"/>

          <!-- Yield Entry Markings (Give Way Triangles at mouths) -->
          <line x1="200" y1="290" x2="260" y2="290" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 4"/>
          <line x1="140" y1="110" x2="200" y2="110" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 4"/>
          <line x1="290" y1="140" x2="290" y2="200" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 4"/>
          <line x1="110" y1="200" x2="110" y2="260" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 4"/>

          <!-- Circulating Lane Guide (Dashed Inner Ring) -->
          <circle cx="200" cy="200" r="90" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="8 8" opacity="0.6"/>

          <!-- Central Island with Cobblestone Curb -->
          <circle cx="200" cy="200" r="55" fill="#064E3B" stroke="#334155" stroke-width="5"/>
          <circle cx="200" cy="200" r="32" fill="#022C22"/>

          <!-- 4.3 Roundabout Sign Badge in Center -->
          <circle cx="200" cy="200" r="18" fill="#2563EB" stroke="#FFFFFF" stroke-width="2"/>
          <path d="M 194 190 A 10 10 0 0 1 206 190 M 209 198 A 10 10 0 0 1 202 208 M 191 204 A 10 10 0 0 1 191 194" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
          <polygon points="208,187 206,194 201,189" fill="#FFFFFF"/>
          <polygon points="199,211 204,206 206,212" fill="#FFFFFF"/>
          <polygon points="188,193 192,198 186,199" fill="#FFFFFF"/>
        ` : `
          <!-- ==================== REGULAR CROSSROAD GEOMETRY ==================== -->
          <!-- Regular Crossroad Asphalt Roads -->
          <rect x="140" y="0" width="120" height="400" fill="#1E293B"/>
          <rect x="0" y="140" width="400" height="120" fill="#1E293B"/>

          <!-- Sidewalk Green Curbs -->
          <rect x="0" y="0" width="130" height="130" rx="20" fill="#064E3B" stroke="#047857" stroke-width="1.5"/>
          <rect x="270" y="0" width="130" height="130" rx="20" fill="#064E3B" stroke="#047857" stroke-width="1.5"/>
          <rect x="0" y="270" width="130" height="130" rx="20" fill="#064E3B" stroke="#047857" stroke-width="1.5"/>
          <rect x="270" y="270" width="130" height="130" rx="20" fill="#064E3B" stroke="#047857" stroke-width="1.5"/>

          <!-- Center Road Dashed Lines -->
          <line x1="200" y1="0" x2="200" y2="130" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="10 8" opacity="0.8"/>
          <line x1="200" y1="270" x2="200" y2="400" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="10 8" opacity="0.8"/>
          <line x1="0" y1="200" x2="130" y2="200" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="10 8" opacity="0.8"/>
          <line x1="270" y1="200" x2="400" y2="200" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="10 8" opacity="0.8"/>

          ${isTram ? `
            <!-- Tramway Rails -->
            <line x1="185" y1="0" x2="185" y2="400" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="6 2"/>
            <line x1="215" y1="0" x2="215" y2="400" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="6 2"/>
            <!-- Rail ties -->
            ${[40, 80, 120, 280, 320, 360].map(y => `<line x1="180" y1="${y}" x2="220" y2="${y}" stroke="#64748B" stroke-width="1.5"/>`).join('')}
          ` : ''}

          <!-- Pedestrian Crossings (Zebra) -->
          <g fill="#FFFFFF" opacity="0.75">
            <rect x="145" y="115" width="110" height="4"/>
            <rect x="145" y="105" width="110" height="4"/>
            <rect x="145" y="280" width="110" height="4"/>
            <rect x="145" y="290" width="110" height="4"/>
            <rect x="105" y="145" width="4" height="110"/>
            <rect x="115" y="145" width="4" height="110"/>
            <rect x="280" y="145" width="4" height="110"/>
            <rect x="290" y="145" width="4" height="110"/>
          </g>

          <!-- Intersection Center Ring -->
          <circle cx="200" cy="200" r="12" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="3 3"/>
        `}

        ${isPriorityTurn ? `
          <!-- 7.13 Priority Road Direction Plate (Main road curves South to West) -->
          <g transform="translate(272, 272)">
            <rect x="0" y="0" width="38" height="38" rx="4" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
            <path d="M 19 36 L 19 22 Q 19 19 8 19" fill="none" stroke="#0F172A" stroke-width="7" stroke-linecap="round"/>
            <line x1="19" y1="2" x2="19" y2="19" stroke="#94A3B8" stroke-width="2"/>
            <line x1="19" y1="19" x2="36" y2="19" stroke="#94A3B8" stroke-width="2"/>
            <text x="19" y="47" text-anchor="middle" font-size="8" font-weight="bold" fill="#F8FAFC">7.13</text>
          </g>
          <!-- 2.1 Main Road Diamond Sign -->
          <g transform="translate(278, 230)">
            <rect x="0" y="0" width="22" height="22" transform="rotate(45 11 11)" fill="#FACC15" stroke="#FFFFFF" stroke-width="2"/>
            <rect x="3" y="3" width="16" height="16" transform="rotate(45 11 11)" fill="#FACC15" stroke="#1E293B" stroke-width="1"/>
          </g>
        ` : ''}

        ${isArrowLight ? `
          <!-- Traffic Light with Additional Right Green Arrow Section -->
          <g transform="translate(272, 240)">
            <!-- Main Signal Housing -->
            <rect x="0" y="0" width="16" height="38" rx="4" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
            <circle cx="8" cy="7" r="4.5" fill="#EF4444" filter="url(#simGlow)"/> <!-- Red Lit -->
            <circle cx="8" cy="19" r="4.5" fill="#475569" opacity="0.6"/> <!-- Yellow Off -->
            <circle cx="8" cy="31" r="4.5" fill="#475569" opacity="0.6"/> <!-- Green Off -->
            <!-- Auxiliary Green Arrow Section Box -->
            <rect x="18" y="24" width="14" height="14" rx="3" fill="#0F172A" stroke="#475569" stroke-width="1.5"/>
            <path d="M 22 31 L 28 31 M 26 28 L 29 31 L 26 34" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" filter="url(#simGlow)"/>
          </g>
        ` : ''}

        <!-- Dynamic Vehicle SVG Elements -->
        <!-- Car / Actor 1 (Slot 0) -->
        <g class="sim-car-primary transition-all duration-1000 ease-in-out cursor-pointer" transform="${trans0}" onclick="window.OSON_SIMULATOR.pickCar('${sc.cars[0]?.id}')">
          ${isPedestrian ? `
            <!-- Pedestrian Figure -->
            <circle cx="12" cy="7" r="5" fill="#3B82F6" stroke="#FFFFFF" stroke-width="1.5"/>
            <line x1="12" y1="12" x2="12" y2="24" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>
            <line x1="12" y1="16" x2="5" y2="21" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="12" y1="16" x2="19" y2="20" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="12" y1="24" x2="7" y2="34" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="12" y1="24" x2="17" y2="34" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
            <text x="12" y="-3" text-anchor="middle" fill="#93C5FD" font-size="10" font-weight="900" font-family="sans-serif">1</text>
          ` : `
            <rect x="0" y="0" width="34" height="60" rx="8" fill="${sc.cars[0]?.color || '#EF4444'}" stroke="#FFFFFF" stroke-width="2"/>
            <rect x="4" y="10" width="26" height="16" rx="4" fill="#0F172A" opacity="0.7"/>
            <text x="17" y="38" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="sans-serif">1</text>
            <circle cx="6" cy="4" r="2.5" fill="#FEF08A"/>
            <circle cx="28" cy="4" r="2.5" fill="#FEF08A"/>
            ${isAmbulance ? `
              <!-- Emergency Vehicle Red/Blue Flasher Bar -->
              <rect x="8" y="27" width="18" height="6" rx="3" fill="#0F172A" stroke="#FFFFFF" stroke-width="1"/>
              <circle cx="12" cy="30" r="3" fill="#EF4444" filter="url(#simGlow)"/>
              <circle cx="22" cy="30" r="3" fill="#3B82F6" filter="url(#simGlow)"/>
            ` : ''}
            ${isTram ? `
              <!-- Tram Roof Pantograph & Headlight -->
              <line x1="12" y1="3" x2="22" y2="3" stroke="#CBD5E1" stroke-width="2"/>
              <line x1="17" y1="3" x2="17" y2="8" stroke="#CBD5E1" stroke-width="1.5"/>
            ` : ''}
          `}
        </g>

        <!-- Car / Actor 2 (Slot 1) -->
        ${sc.cars[1] ? `
          <g class="sim-car-secondary transition-all duration-1000 ease-in-out cursor-pointer" transform="${trans1}" onclick="window.OSON_SIMULATOR.pickCar('${sc.cars[1]?.id}')">
            <rect x="0" y="0" width="34" height="60" rx="8" fill="${sc.cars[1]?.color || '#2563EB'}" stroke="#FFFFFF" stroke-width="2"/>
            <rect x="4" y="34" width="26" height="16" rx="4" fill="#0F172A" opacity="0.7"/>
            <text x="17" y="26" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="sans-serif">2</text>
            <circle cx="6" cy="56" r="2.5" fill="#FEF08A"/>
            <circle cx="28" cy="56" r="2.5" fill="#FEF08A"/>
          </g>
        ` : ''}

        <!-- Car / Actor 3 (Slot 2) -->
        ${sc.cars[2] ? `
          <g class="sim-car-tertiary transition-all duration-1000 ease-in-out cursor-pointer" transform="${trans2}" onclick="window.OSON_SIMULATOR.pickCar('${sc.cars[2]?.id}')">
            <rect x="0" y="0" width="60" height="34" rx="8" fill="${sc.cars[2]?.color || '#F59E0B'}" stroke="#FFFFFF" stroke-width="2"/>
            <rect x="10" y="4" width="16" height="26" rx="4" fill="#0F172A" opacity="0.7"/>
            <text x="36" y="22" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="sans-serif">3</text>
            <circle cx="4" cy="6" r="2.5" fill="#FEF08A"/>
            <circle cx="4" cy="28" r="2.5" fill="#FEF08A"/>
          </g>
        ` : ''}
      </svg>
    `;
  }

  function selectScenario(idx) {
    currentScenarioIdx = idx;
    userSelectedOrder = [];
    renderSimulator();
  }

  // Interactive picking of vehicle turn sequence
  function pickCar(carId) {
    const sc = getScenarios()[currentScenarioIdx];
    if (!sc) return;

    // Toggle: if already in array, remove it
    const existingIdx = userSelectedOrder.indexOf(carId);
    if (existingIdx !== -1) {
      userSelectedOrder.splice(existingIdx, 1);
    } else {
      userSelectedOrder.push(carId);
    }

    updateSelectionUI(sc);
    if (window.OSON_SOUND) window.OSON_SOUND.playClick();
  }

  function updateSelectionUI(sc) {
    sc.cars.forEach(c => {
      const badges = document.querySelectorAll(`.badge-order-${c.id}`);
      const btns = document.querySelectorAll(`.btn-car-${c.id}`);
      const idx = userSelectedOrder.indexOf(c.id);

      badges.forEach(badge => {
        if (idx !== -1) {
          badge.textContent = idx + 1;
          badge.className = `badge-order-${c.id} w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center animate-pop`;
        } else {
          badge.textContent = '-';
          badge.className = `badge-order-${c.id} w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center`;
        }
      });

      btns.forEach(btn => {
        if (idx !== -1) {
          btn.classList.add('border-blue-500', 'bg-blue-50/50', 'dark:bg-blue-950/30');
        } else {
          btn.classList.remove('border-blue-500', 'bg-blue-50/50', 'dark:bg-blue-950/30');
        }
      });
    });

    const tagsContainers = document.querySelectorAll('.sim-order-tags');
    tagsContainers.forEach(tagsContainer => {
      if (userSelectedOrder.length === 0) {
        tagsContainer.textContent = 'Hali tanlanmadi';
        tagsContainer.className = 'sim-order-tags font-bold text-slate-400';
      } else {
        const names = userSelectedOrder.map(id => {
          const car = sc.cars.find(c => c.id === id);
          return car ? car.name.split(' ')[0] : id;
        });
        tagsContainer.textContent = names.join(' → ');
        tagsContainer.className = 'sim-order-tags font-bold text-blue-600 dark:text-blue-400';
      }
    });
  }

  function resetSelection() {
    const sc = getScenarios()[currentScenarioIdx];
    userSelectedOrder = [];
    if (sc) updateSelectionUI(sc);
    document.querySelectorAll('.sim-result-box').forEach(resultBox => {
      resultBox.classList.add('hidden');
    });
  }

  // Check user selected order
  function checkAnswer() {
    const sc = getScenarios()[currentScenarioIdx];
    if (!sc) return;

    if (userSelectedOrder.length < sc.cars.length) {
      window.OSON_UI.showToast('Iltimos, avval barcha transport vositalari o‘tish navbatini belgilang!', 'warning');
      return;
    }

    const resultBoxes = document.querySelectorAll('.sim-result-box');
    if (resultBoxes.length === 0) return;

    const isCorrect = JSON.stringify(userSelectedOrder) === JSON.stringify(sc.correctOrder);

    if (isCorrect) {
      if (window.OSON_SOUND) window.OSON_SOUND.playCorrect();
      resultBoxes.forEach(resultBox => {
        resultBox.className = 'sim-result-box p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs leading-relaxed animate-slide-up';
        resultBox.innerHTML = `
          <div class="flex items-center gap-2 mb-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
            <i class="fa-solid fa-circle-check text-base"></i>
            <span>To‘g‘ri javob! +20 XP</span>
          </div>
          <p class="font-bold text-emerald-700 dark:text-emerald-400 mb-2">Tartib: ${sc.orderText}</p>
          <p class="leading-relaxed opacity-95">${sc.explanation}</p>
        `;
        resultBox.classList.remove('hidden');
      });
      window.OSON_UI.showToast('Mukammal! Qoidani to‘g‘ri qo‘lladingiz (+20 XP)!', 'success');
      runAnimation();
    } else {
      if (window.OSON_SOUND) window.OSON_SOUND.playWrong();
      resultBoxes.forEach(resultBox => {
        resultBox.className = 'sim-result-box p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200 text-xs leading-relaxed animate-slide-up';
        resultBox.innerHTML = `
          <div class="flex items-center gap-2 mb-1.5 text-rose-800 dark:text-rose-300 font-extrabold text-sm">
            <i class="fa-solid fa-circle-xmark text-base"></i>
            <span>Xatolik mavjud!</span>
          </div>
          <p class="font-bold text-rose-700 dark:text-rose-400 mb-2">To‘g‘ri tartib: ${sc.orderText}</p>
          <p class="leading-relaxed opacity-95">${sc.explanation}</p>
        `;
        resultBox.classList.remove('hidden');
      });
      window.OSON_UI.showToast('Xato tartib! Tushuntirishni o‘qib chiqing.', 'error');
    }
  }

  // ==========================================================================
  // Vehicle exit-path resolver — figures out which off-screen exit a car
  // should animate to, based on which side it entered from (its slot) and
  // whether its scenario text says it goes straight, turns left, or turns
  // right. Previously this was hardcoded (every 3rd car always shot straight
  // west, first), which ignored each car's real "dir" text and the
  // scenario's correct priority order — so cars turned the wrong way and
  // crossed in the wrong sequence versus the explanation shown underneath.
  // ==========================================================================
  const EXIT_POINTS = {
    N: 'translate(210, -120)', // off the top edge
    S: 'translate(155, 450)',  // off the bottom edge
    E: 'translate(450, 200)',  // off the right edge
    W: 'translate(-100, 155)'  // off the left edge
  };
  // Clockwise compass order, used to derive left/right turns from the
  // direction a car is already facing when it entered the junction.
  const RIGHT_OF = { N: 'E', E: 'S', S: 'W', W: 'N' };
  const LEFT_OF = { N: 'W', W: 'S', S: 'E', E: 'N' };
  // Slot 0 = primary (enters from the south, facing north)
  // Slot 1 = secondary (enters from the north, facing south)
  const SLOT_FACING = ['N', 'S', 'W', 'E'];

  // Map enterFrom direction → the direction the car is FACING (opposite)
  const ENTER_TO_FACING = { S: 'N', N: 'S', E: 'W', W: 'E' };

  function getTurnType(car, slotIndex) {
    const text = `${car.name || ''} ${car.dir || ''}`.toLowerCase().replace(/[\u2018\u2019`]/g, "'");
    const turnsLeft = (text.includes('chapga') || (text.includes('chap') && (text.includes('buril') || text.includes('qayril') || text.includes('yo‘l') || text.includes("yo'l")))) &&
                      !text.includes("chap tomoni bo'sh") && !text.includes("chapdan");
    const turnsRight = !turnsLeft && (text.includes("o'ngga") || text.includes("ongga") || (text.includes("o'ng") && (text.includes('buril') || text.includes('qayril')))) &&
                       !text.includes("o'ng tomoni bo'sh") && !text.includes("ong tomoni bo'sh");
    if (turnsLeft) return 'left';
    if (turnsRight) return 'right';
    return 'straight';
  }

  function resolveExitTransform(car, slotIndex) {
    const enterDir = car.enterFrom || (SLOT_FACING[slotIndex] || 'N');
    const facing = ENTER_TO_FACING[enterDir] || SLOT_FACING[slotIndex] || 'N';
    const turnType = getTurnType(car, slotIndex);
    const finalFacing = turnType === 'left' ? LEFT_OF[facing] : (turnType === 'right' ? RIGHT_OF[facing] : facing);
    return EXIT_POINTS[finalFacing] || EXIT_POINTS[facing];
  }

  // Realistic vehicle motion with center intersection entry and body rotation on turns
  function animateCarPassage(el, car, slotIndex, sc) {
    // 1. Special Handling: Roundabout Circular Trajectories (sc-3)
    if (sc && sc.id === 'sc-3') {
      if (slotIndex === 0) {
        // Red car: already inside roundabout circle, follows counter-clockwise ring arc and exits West
        el.style.transition = 'transform 620ms ease-in';
        el.setAttribute('transform', 'translate(165, 105) rotate(-90 17 30)');
        setTimeout(() => {
          el.style.transition = 'transform 780ms ease-out';
          el.setAttribute('transform', 'translate(-100, 155) rotate(-90 17 30)');
        }, 630);
        return;
      } else if (slotIndex === 1) {
        // Blue car: yields at South entrance, then curves smoothly into the roundabout lane counter-clockwise
        el.style.transition = 'transform 550ms ease-in';
        el.setAttribute('transform', 'translate(245, 220) rotate(-40 17 30)');
        setTimeout(() => {
          el.style.transition = 'transform 580ms linear';
          el.setAttribute('transform', 'translate(260, 140) rotate(0 17 30)');
          setTimeout(() => {
            el.style.transition = 'transform 720ms ease-out';
            el.setAttribute('transform', 'translate(210, -120) rotate(0 17 30)');
          }, 600);
        }, 570);
        return;
      }
    }

    // 2. Special Handling: Pedestrian crossing & Vehicle yield (sc-8)
    if (sc && sc.id === 'sc-8') {
      if (slotIndex === 0) {
        // Pedestrian walks across the zebra crossing
        el.style.transition = 'transform 1700ms linear';
        el.setAttribute('transform', 'translate(275, 275)');
        return;
      } else if (slotIndex === 1) {
        // Car approaches intersection, yields to pedestrian on zebra, then turns right
        el.style.transition = 'transform 450ms ease-out';
        el.setAttribute('transform', 'translate(155, 115)');
        setTimeout(() => {
          el.style.transition = 'transform 750ms ease-in-out';
          el.setAttribute('transform', 'translate(-100, 155) rotate(90 17 30)');
        }, 1450);
        return;
      }
    }

    const enterDir = car.enterFrom || (slotIndex === 0 ? 'S' : (slotIndex === 1 ? 'N' : 'E'));
    const turnType = getTurnType(car, slotIndex);

    if (enterDir === 'N') { // Slot 1: enters from North moving South
      if (turnType === 'left') { // Turns East (left from car's perspective)
        el.style.transition = 'transform 480ms ease-in';
        el.setAttribute('transform', 'translate(155, 170)');
        setTimeout(() => {
          el.style.transition = 'transform 720ms ease-out';
          el.setAttribute('transform', 'translate(450, 185) rotate(-90 17 30)');
        }, 490);
      } else if (turnType === 'right') { // Turns West
        el.style.transition = 'transform 400ms ease-in';
        el.setAttribute('transform', 'translate(155, 115)');
        setTimeout(() => {
          el.style.transition = 'transform 680ms ease-out';
          el.setAttribute('transform', 'translate(-100, 155) rotate(90 17 30)');
        }, 410);
      } else { // Straight South
        el.style.transition = 'transform 1000ms ease-in-out';
        el.setAttribute('transform', 'translate(155, 450)');
      }
    } else if (enterDir === 'S') { // Slot 0: enters from South moving North
      if (turnType === 'left') { // Turns West (left from car's perspective)
        el.style.transition = 'transform 480ms ease-in';
        el.setAttribute('transform', 'translate(210, 175)');
        setTimeout(() => {
          el.style.transition = 'transform 720ms ease-out';
          el.setAttribute('transform', 'translate(-100, 205) rotate(-90 17 30)');
        }, 490);
      } else if (turnType === 'right') { // Turns East
        el.style.transition = 'transform 400ms ease-in';
        el.setAttribute('transform', 'translate(210, 225)');
        setTimeout(() => {
          el.style.transition = 'transform 680ms ease-out';
          el.setAttribute('transform', 'translate(450, 215) rotate(90 17 30)');
        }, 410);
      } else { // Straight North
        el.style.transition = 'transform 1000ms ease-in-out';
        el.setAttribute('transform', 'translate(210, -120)');
      }
    } else if (enterDir === 'E') { // Slot 2: enters from East moving West
      if (turnType === 'left') { // Turns South (left from car's perspective)
        el.style.transition = 'transform 480ms ease-in';
        el.setAttribute('transform', 'translate(185, 155)');
        setTimeout(() => {
          el.style.transition = 'transform 720ms ease-out';
          el.setAttribute('transform', 'translate(160, 450) rotate(-90 30 17)');
        }, 490);
      } else if (turnType === 'right') { // Turns North
        el.style.transition = 'transform 400ms ease-in';
        el.setAttribute('transform', 'translate(235, 155)');
        setTimeout(() => {
          el.style.transition = 'transform 680ms ease-out';
          el.setAttribute('transform', 'translate(210, -120) rotate(90 30 17)');
        }, 410);
      } else { // Straight West
        el.style.transition = 'transform 1000ms ease-in-out';
        el.setAttribute('transform', 'translate(-100, 155)');
      }
    } else {
      el.style.transition = 'transform 1000ms ease-in-out';
      el.setAttribute('transform', resolveExitTransform(car, slotIndex));
    }
  }

  // Smooth vehicle passage animation — cars cross in the exact order shown
  // in "Qoidaviy o'tish tartibi" (sc.cars[0] first, then [1], then [2]),
  // each following the exit path that matches its own turn direction.
  function runAnimation() {
    if (isChecking) return;
    isChecking = true;

    const sc = getScenarios()[currentScenarioIdx];
    const slotGroups = [
      document.querySelectorAll('.sim-car-primary'),
      document.querySelectorAll('.sim-car-secondary'),
      document.querySelectorAll('.sim-car-tertiary')
    ];
    const resultBoxes = document.querySelectorAll('.sim-result-box');
    const actionBtns = document.querySelectorAll('.sim-action-btn');

    actionBtns.forEach(btn => {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> O‘tmoqda...`;
    });

    // Reset initial positions first dynamically based on scenario geometry
    slotGroups.forEach((group, i) => {
      const initialTransform = getStartTransform(sc, i);
      group.forEach(el => {
        el.style.transition = 'none';
        el.setAttribute('transform', initialTransform);
      });
    });

    // Drive each car in realistic order matching correct priority
    setTimeout(() => {
      const delays = [100, 1400, 2700];
      sc.cars.forEach((car, i) => {
        if (!car || !slotGroups[i] || slotGroups[i].length === 0) return;
        setTimeout(() => {
          slotGroups[i].forEach(el => animateCarPassage(el, car, i, sc));
        }, delays[i] || (100 + i * 1300));
      });
    }, 60);

    setTimeout(() => {
      resultBoxes.forEach(resultBox => {
        if (resultBox.classList.contains('hidden')) {
          resultBox.className = 'sim-result-box p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed animate-slide-up';
          resultBox.innerHTML = `
            <div class="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-2">
              <i class="fa-solid fa-circle-info text-blue-500"></i>
              <span>Qoidaviy o‘tish tartibi:</span>
            </div>
            <p class="font-extrabold text-blue-600 dark:text-blue-400 mb-2">${sc.orderText}</p>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${sc.explanation}</p>
          `;
          resultBox.classList.remove('hidden');
        }
      });

      actionBtns.forEach(btn => {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-play"></i> <span>Play animatsiya</span>`;
      });
      isChecking = false;
    }, 4000);
  }

  function resetCars() {
    renderSimulator();
  }

  return {
    renderSimulator,
    selectScenario,
    pickCar,
    checkAnswer,
    resetSelection,
    runAnimation,
    resetCars
  };
})();
