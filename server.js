/**
 * OSON PRAVA — Lightweight Local Development Server & Intelligent API Backend
 * Zero dependencies, built-in Node.js HTTP/HTTPS server
 * Features:
 *   - Google Gemini 2.0 Flash / 2.5 Pro API integration for PravaGPT AI Coach
 *   - Local RAG context engine (data_questions.json semantic match)
 *   - Intelligent offline rule-based fallback engine (generateSmartAIResponse)
 *   - REST API: GET /api/questions and POST /api/ai/chat
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// -------------------------------------------------------------
// 1. Environment Variable Loader (.env zero-dependency parser)
// -------------------------------------------------------------
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn('[Env] .env faylini o‘qishda ogohlantirish:', e.message);
    }
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;
function getPublicDir() {
  if (fs.existsSync(path.join(__dirname, 'data_questions.json'))) return __dirname;
  if (fs.existsSync(path.join(process.cwd(), 'data_questions.json'))) return process.cwd();
  return __dirname;
}
const PUBLIC_DIR = getPublicDir();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

const BHM_VALUE = 375000; // 2026 UZS

// -------------------------------------------------------------
// 2. Load and Index Question Database for RAG
// -------------------------------------------------------------
let cachedQuestions = [];
function loadQuestions() {
  try {
    const candidates = [
      path.join(PUBLIC_DIR, 'data_questions.json'),
      path.join(__dirname, 'data_questions.json'),
      path.join(process.cwd(), 'data_questions.json')
    ];
    for (const jsonPath of candidates) {
      if (fs.existsSync(jsonPath)) {
        cachedQuestions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        return cachedQuestions;
      }
    }
    const dataCandidates = [
      path.join(PUBLIC_DIR, 'js', 'data.js'),
      path.join(__dirname, 'js', 'data.js'),
      path.join(process.cwd(), 'js', 'data.js')
    ];
    for (const jsPath of dataCandidates) {
      if (fs.existsSync(jsPath)) {
        const dataContent = fs.readFileSync(jsPath, 'utf8');
        const vm = require('vm');
        const sandbox = { window: {} };
        vm.createContext(sandbox);
        vm.runInContext(dataContent, sandbox);
        cachedQuestions = (sandbox.window && sandbox.window.OSON_DATA && sandbox.window.OSON_DATA.questions) || [];
        return cachedQuestions;
      }
    }
    return [];
  } catch (err) {
    console.error('[RAG] Savollar bazasini yuklashda xatolik:', err.message);
    return [];
  }
}
loadQuestions();

/**
 * Clean and tokenize text for fast semantic/keyword similarity matching
 */
function tokenizeText(text) {
  if (!text) return [];
  const stopWords = new Set([
    'va', 'yoki', 'ham', 'uchun', 'bilan', 'haqida', 'bo‘yicha', 'boyicha',
    'qanday', 'qaysi', 'nima', 'qachon', 'qayerda', 'mumkin', 'kerak', 'shart',
    'agar', 'esa', 'shu', 'bu', 'o‘sha', 'bir', 'ikki', 'tushuntiring', 'ayting',
    'bering', 'haqida', 'iltimos', 'javob', 'savol', 'dars', 'test'
  ]);

  return text
    .toLowerCase()
    .replace(/[\u2018\u2019`]/g, "'")
    .replace(/[^\w\s\u0400-\u04FF']/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 3 && !stopWords.has(word));
}

/**
 * RAG Context Matcher: selects top 3-5 most relevant questions from official database
 */
function findRAGContext(query, limit = 4) {
  if (!cachedQuestions || cachedQuestions.length === 0) {
    loadQuestions();
  }
  if (!cachedQuestions || cachedQuestions.length === 0) return '';

  const qTokens = tokenizeText(query);
  if (qTokens.length === 0) return '';

  const scored = [];

  for (const item of cachedQuestions) {
    let score = 0;
    const qText = (item.question || '').toLowerCase();
    const topicText = (item.topic || '').toLowerCase();
    const explText = (item.explanation || '').toLowerCase();
    const correctOpt = (item.options && item.options[item.correctIndex]) ? item.options[item.correctIndex].toLowerCase() : '';

    for (const token of qTokens) {
      if (qText.includes(token)) score += 4.0;
      if (topicText.includes(token)) score += 3.0;
      if (explText.includes(token)) score += 2.5;
      if (correctOpt.includes(token)) score += 1.5;
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const topItems = scored.slice(0, limit).map(s => s.item);

  if (topItems.length === 0) return '';

  let context = 'RASMIY YHQ TEST VA QOIDALAR BAZASIDAN KONTEKST (RAG Context):\n';
  topItems.forEach((q, idx) => {
    const correctAns = (q.options && q.options[q.correctIndex]) ? q.options[q.correctIndex] : 'Noma’lum';
    context += `[Savol #${idx + 1}] Mavzu: ${q.topic}\n`;
    context += `Savol matni: "${q.question}"\n`;
    context += `To‘g‘ri javob: "${correctAns}"\n`;
    if (q.explanation) context += `Rasmiy izoh: "${q.explanation}"\n`;
    context += '\n';
  });

  return context.trim();
}

/**
 * Detect contextually relevant action buttons for the frontend
 */
function getActionSuggestion(query, responseText = '') {
  const combined = ((query || '') + ' ' + (responseText || '')).toLowerCase().replace(/[\u2018\u2019`]/g, "'");

  if (
    combined.includes('chorraha') ||
    combined.includes('svetofor') ||
    combined.includes('krug') ||
    combined.includes('aylanma') ||
    combined.includes('o\'ng qo\'l') ||
    combined.includes('ong qol') ||
    combined.includes('tramvay') ||
    combined.includes('simulyator')
  ) {
    return { actionUrl: '#simulyator', actionLabel: 'Chorraha 2D Simulyatorida Sinash' };
  }

  if (
    combined.includes('jarima') ||
    combined.includes('radar') ||
    combined.includes('bhm') ||
    combined.includes('ball') ||
    combined.includes('12 ball') ||
    combined.includes('chegirma') ||
    combined.includes('shtraf')
  ) {
    return { actionUrl: '#jarimalar', actionLabel: 'Jarimalar & Ball Kalkulyatori' };
  }

  if (
    combined.includes('imtihon') ||
    combined.includes('yhxbb') ||
    combined.includes('bilet') ||
    combined.includes('o\'tish bali') ||
    combined.includes('20 ta savol')
  ) {
    return { actionUrl: '#imtihon', actionLabel: 'Davlat Imtihonini Boshlash' };
  }

  if (
    combined.includes('belgi') ||
    combined.includes('taqiqlovchi') ||
    combined.includes('ogohlantiruvchi') ||
    combined.includes('buyuruvchi') ||
    combined.includes('ustunlik')
  ) {
    return { actionUrl: '#belgilar', actionLabel: 'Belgilar Katalogini Ko‘rish' };
  }

  if (
    combined.includes('dars') ||
    combined.includes('nazariya') ||
    combined.includes('tibbiy') ||
    combined.includes('reanimatsiya') ||
    combined.includes('tezlik')
  ) {
    return { actionUrl: '#darslar', actionLabel: 'Nazariy Darslarga O‘tish' };
  }

  return { actionUrl: '#testlar', actionLabel: 'Mavzuli Testlarni Yechish' };
}

// -------------------------------------------------------------
// 3. Google Gemini API Engine (gemini-2.0-flash / gemini-2.5-pro)
// -------------------------------------------------------------
const SYSTEM_INSTRUCTION = `Siz O'zbekiston Respublikasi Yo'l Harakati Qoidalari (YHQ) bo'yicha ekspert AI murabbiysiz (OSON PRAVA platformasining PravaGPT murabbiyi).
Quyidagi qoidalarga qat'iy amal qiling:
1. Faqat o'zbek tilida (lotin yozuvida), aniq, muloyim va professional ohangda javob bering.
2. Yo'l harakati qoidalarining aniq band raqamlariga (masalan: YHQ 96-band, 102-band) va Ma'muriy javobgarlik to'g'risidagi kodeks (MJtK) moddalariga (masalan: MJtK 128-modda) tayaning.
3. Amaldagi 2026-yil me'yorlari: 1 BHM = 375,000 so'm, aholi punktlarida tezlik = 60 km/soat, 15 kunlik 50% jarima chegirmasi amal qiladi, 12 ballik jarima tizimi mavjud.
4. Javoblaringizda mavjud dizayn uslubiga mos holda chiroyli emoji (🚦, 🚗, ⚖️, 🛑, 💡, 📌, 🎓, 🏥 va h.k.) va qalin sarlavhalardan foydalaning.
5. Har doim qisqa, tushunarli punktlar va xulosalardan foydalaning. Agar savol noaniq bo'lsa, aniqlashtiruvchi maslahat bering.
6. Sizga berilgan rasmiy testlar va qoidalar bazasi ma'lumotlariga (RAG kontekst) to'liq tayaning.`;

/**
 * Generic Gemini API Caller with Model Selection & Fallback
 */
async function callGeminiAPISingle(modelName, contents, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const requestBody = JSON.stringify({
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.35,
      topP: 0.95,
      maxOutputTokens: 1024
    }
  });

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      timeout: 15000 // 15s timeout
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const candidate = parsed.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text;
            if (text) {
              resolve({ text, model: modelName });
            } else {
              reject(new Error(`Gemini bo‘sh javob qaytardi: ${data.slice(0, 200)}`));
            }
          } catch (jsonErr) {
            reject(new Error(`Gemini JSON parsing xatosi: ${jsonErr.message}`));
          }
        } else {
          let errMsg = `Gemini API Status ${res.statusCode}`;
          try {
            const errObj = JSON.parse(data);
            if (errObj.error?.message) {
              errMsg += `: ${errObj.error.message}`;
            }
          } catch (_) {
            errMsg += `: ${data.slice(0, 150)}`;
          }
          const error = new Error(errMsg);
          error.statusCode = res.statusCode;
          reject(error);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const err = new Error('Gemini API so‘rovida vaqt tugadi (Timeout: 15s)');
      err.code = 'ETIMEDOUT';
      reject(err);
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * High-level Gemini Assistant with Model Fallback (flash -> pro)
 */
async function generateGeminiAIResponse(query, history = [], userState = {}) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY kaliti mavjud emas');
  }

  // 1. Prepare RAG context
  const ragContext = findRAGContext(query, 4);

  // 2. Format History for Gemini API (contents: [{ role, parts: [{ text }] }])
  const formattedContents = [];

  if (Array.isArray(history)) {
    // Keep last 6 dialogue turns for optimal latency and context window
    const recent = history.slice(-6);
    for (const msg of recent) {
      const isUser = (msg.role === 'user' || msg.sender === 'user');
      const role = isUser ? 'user' : 'model';
      const text = (msg.content || msg.text || '').trim();
      if (!text) continue;

      if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === role) {
        formattedContents[formattedContents.length - 1].parts[0].text += '\n' + text;
      } else {
        formattedContents.push({ role, parts: [{ text }] });
      }
    }
  }

  // Combine query with RAG context
  let finalUserPrompt = query;
  if (ragContext) {
    finalUserPrompt = `${query}\n\n---\n${ragContext}`;
  }

  // Append or set current user message
  if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === 'user') {
    formattedContents[formattedContents.length - 1].parts = [{ text: finalUserPrompt }];
  } else {
    formattedContents.push({
      role: 'user',
      parts: [{ text: finalUserPrompt }]
    });
  }

  // 3. Try primary model: gemini-2.0-flash, fallback to gemini-2.5-pro
  const primaryModel = 'gemini-2.0-flash';
  const fallbackModel = 'gemini-2.5-pro';

  try {
    const result = await callGeminiAPISingle(primaryModel, formattedContents, GEMINI_API_KEY);
    const suggestion = getActionSuggestion(query, result.text);
    return {
      text: result.text,
      actionUrl: suggestion.actionUrl,
      actionLabel: suggestion.actionLabel,
      modelUsed: result.model
    };
  } catch (primaryErr) {
    console.warn(`[Gemini API] '${primaryModel}' da xatolik (${primaryErr.message}), '${fallbackModel}' ga fallback qilinmoqda...`);

    // If rate limited or model error, try pro model
    try {
      const resultFallback = await callGeminiAPISingle(fallbackModel, formattedContents, GEMINI_API_KEY);
      const suggestion = getActionSuggestion(query, resultFallback.text);
      return {
        text: resultFallback.text,
        actionUrl: suggestion.actionUrl,
        actionLabel: suggestion.actionLabel,
        modelUsed: resultFallback.model
      };
    } catch (secondaryErr) {
      console.error(`[Gemini API] '${fallbackModel}' ham xato berdi:`, secondaryErr.message);
      throw secondaryErr;
    }
  }
}

// -------------------------------------------------------------
// 4. Intelligent Offline Fallback Engine (Preserved & Enhanced)
// -------------------------------------------------------------
function generateSmartAIResponse(query, history = [], userState = {}) {
  const q = (query || '').trim();
  const clean = q.toLowerCase().replace(/[\u2018\u2019`]/g, "'");

  let text = '';
  let actionUrl = null;
  let actionLabel = null;

  // 1. Situational Crossroads
  if (
    clean.includes('chorraha') ||
    clean.includes('svetofor buzil') ||
    clean.includes('ochiq svetofor') ||
    clean.includes('kim birinchi') ||
    clean.includes('yo\'l beradi') ||
    clean.includes("yo'l beradi") ||
    clean.includes('asosiy yo') ||
    clean.includes('ikkinchi darajali') ||
    clean.includes('teng huquqli') ||
    clean.includes('o\'ng qo\'l') ||
    clean.includes('ong qol') ||
    clean.includes('tramvay')
  ) {
    actionUrl = '#simulyator';
    actionLabel = 'Chorraha 2D Simulyatorida Sinash';

    if (clean.includes('svetofor buzil') || clean.includes('ishlamasa') || clean.includes('ochgan')) {
      text = `🚦 **Svetofor ishlamayotgan (buzilgan) chorrahada harakatlanish tartibi:**\n\n` +
        `Savolingizdagi vaziyatda: **svetofor o‘chgan yoki miltillovchi sariq chiroq holatida bo‘lsa, chorraha tartibga solinmagan hisoblanadi** (YHQ 96-band).\n\n` +
        `1. **Imtiyoz belgilari kuchga kiradi:** Agar chorrahada 2.1 ("Asosiy yo‘l") yoki 2.4 ("Yo‘l bering") belgilari o‘rnatilgan bo‘lsa, haydovchilar aynan shu belgilarga amal qiladi.\n` +
        `2. **Asosiy yo‘ldagi transport:** Asosiy yo‘ldan kelayotgan avtomobil birinchi bo‘lib o‘tish imtiyoziga ega.\n` +
        `3. **Ikkinchi darajali yo‘ldagi transport:** "Yo‘l bering" yoki "STOP" belgisi oldidagi haydovchi asosiy yo‘ldagi transportni to‘liq o‘tkazib yuborgach harakatlanadi.\n` +
        `4. **Agar belgilar bo‘lmasa (Teng huquqli chorraha):** «O‘ng qo‘l qoidasi» amal qiladi — o‘ng tomoni bo‘sh bo‘lgan haydovchi birinchi o‘tadi.\n\n` +
        `💡 *Ushbu vaziyatni platformamizning "Chorraha 2D" simulyatorida (Ssenariy #2 va #7) amalda sinab ko‘rishingiz mumkin.*`;
    } else if (clean.includes('tramvay')) {
      text = `🚋 **Chorrahada Tramvay va Avtomobillar o‘zaro harakatlanish tartibi:**\n\n` +
        `O‘zbekiston YHQga asosan relsli transport vositalari (tramvay) quyidagi qoidalarga bo‘ysunadi:\n\n` +
        `• **Teng huquqli sharoitda:** Tramvay o‘z harakat yo‘nalishidan qat’i nazar (to‘g‘riga, o‘ngga yoki chapga burilayotgan bo‘lsa ham) relssiz transportga nisbatan **mutlaq ustunlikka ega**!\n` +
        `• **Notekis huquqli chorrahada:** Agar tramvay ikkinchi darajali yo‘lda (2.4 belgisi) bo‘lsa, u asosiy yo‘ldagi avtomobilga yo‘l beradi. Ammo ikkalasi ham asosiy yo‘lda bo‘lsa, tramvay birinchi o‘tadi.\n` +
        `• **Depodan chiqishda:** Depodan chiqayotgan tramvay yo‘ldagi barcha transport vositalariga yo‘l berishi shart (YHQ 103-band).\n\n` +
        `💡 *Ushbu qoidani 2D simulyatorimizdagi #4-stsenariy orqali animatsiyada ko‘rishingiz mumkin.*`;
    } else if (clean.includes('chapga') && (clean.includes('buril') || clean.includes('qayril'))) {
      text = `↩️ **Chorrahada chapga burilishda yo‘l berish qoidasi:**\n\n` +
        `• **Yashil chiroqda / Asosiy yo‘lda:** Chapga burilayotgan yoki qayrilib olayotgan haydovchi qarama-qarshi tomondan to‘g‘riga va o‘ngga harakatlanayotgan transport vositalariga **yo‘l berishi shart** (YHQ 102-band).\n` +
        `• **Traektoriya:** Chapga burilish paytida transport vositasi chorrahadan chiqishda qarama-qarshi harakatlanish chizig‘iga chiqib ketmasligi shart.\n\n` +
        `💡 *Simulyatorda Qizil mashina chapga burilish stsenariysini (#2) ko‘rishingiz mumkin.*`;
    } else {
      text = `🚦 **Chorrahadan o‘tish tartibi bo‘yicha aniq huquqiy yechim:**\n\n` +
        `Savolingizdagi chorraha vaziyatini tahlil qilamiz:\n\n` +
        `1. **Chorraha turi:** Agar svetofor bo‘lsa — svetofor ishoralariga amal qilinadi. Belgilar (2.1, 2.4) svetofor yongan holatda e’tiborga olinmaydi.\n` +
        `2. **Notekis huquqli chorrahada:** Asosiy yo‘ldagi transport vositalari birinchi navbatda, ikkinchi darajali yo‘ldagilar esa ularni o‘tkazib yuborgach harakatlanadi.\n` +
        `3. **Teng sharoitda («O‘ng qo‘l» qoidasi):** Bir xil huquqqa ega transport vositalari o‘rtasida o‘ng tomondan kelayotganga yo‘l beriladi. O‘ng tomoni ochiq (bo‘sh) bo‘lgan haydovchi birinchi harakatlanadi.\n` +
        `4. **Qarama-qarshi yo‘nalish:** Chapga buriluvchi transport qarshisidagi to‘g‘riga va o‘ngga ketuvchilarni o‘tkazib yuboradi.\n\n` +
        `💡 *Har qanday chorrahani real vaqtda 2D simulyatorimizda vizual sinab ko‘ring!*`;
    }
  }

  // 2. Aylanma harakat (Krug / 4.3)
  else if (clean.includes('krug') || clean.includes('aylanma') || clean.includes('aylana') || clean.includes('halqa')) {
    actionUrl = '#simulyator';
    actionLabel = 'Aylanma Harakat Simulyatori';
    text = `⭕ **Aylanma harakat (4.3-belgi) bo‘yicha to‘liq qoidalar:**\n\n` +
      `• **Mutlaq ustunlik:** Aylanada harakatlanayotgan transport vositasi aylanaga kirib kelayotgan barcha mashinalarga nisbatan mutlaq ustunlikka (imtiyozga) ega!\n` +
      `• **Kirish tartibi:** Aylanaga istalgan qatordan kirish mumkin, chap burilish signali yoqilmaydi.\n` +
      `• **Chiqish tartibi (Imtihonda eng ko‘p tushadigan savol!):** Aylanadan chiqish FAQAT o‘ng chekka qatordan, o‘ng burilish chirog‘i yoqilgan holda amalga oshiriladi.\n\n` +
      `💡 *2D simulyatorimizda Aylanma harakat stsenariysini (#3) amalda sinab ko‘rishingiz mumkin.*`;
  }

  // 3. Jarimalar, BHM, To'lov, Chegirma, Ball tizimi
  else if (
    clean.includes('jarima') ||
    clean.includes('radar') ||
    clean.includes('bhm') ||
    clean.includes('to\'lash') ||
    clean.includes("to'lash") ||
    clean.includes('chegirma') ||
    clean.includes('15 kun') ||
    clean.includes('shtraf') ||
    clean.includes('ball') ||
    clean.includes('12 ball')
  ) {
    actionUrl = '#jarimalar';
    actionLabel = 'Jarimalar & Ball Kalkulyatori';

    text = `⚖️ **2026-yilgi jarimalar va javobgarlik tartibi (1 BHM = ${BHM_VALUE.toLocaleString()} so‘m):**\n\n` +
      `• **Tezlik oshirish (MJtK 128-3-modda):**\n` +
      `   - +20 km/soatgacha: 1 BHM (${(1 * BHM_VALUE).toLocaleString()} so‘m) — 1 jarima bali\n` +
      `   - +20...+40 km/soat: 5 BHM (${(5 * BHM_VALUE).toLocaleString()} so‘m) — 2 jarima bali\n` +
      `   - +40 km/soatdan yuqori: 9 BHM (${(9 * BHM_VALUE).toLocaleString()} so‘m) — 3 jarima bali\n` +
      `• **Qizil chiroqqa o‘tish (128-4-modda):** 2 BHM (${(2 * BHM_VALUE).toLocaleString()} so‘m) — 2 jarima bali\n` +
      `• **Xavfsizlik kamari taqmaslik:** 0.5 BHM (${(0.5 * BHM_VALUE).toLocaleString()} so‘m) — 0.5 ball\n` +
      `• **Qarama-qarshi yo‘nalishga (vstrecha) chiqish:** 10 BHM (${(10 * BHM_VALUE).toLocaleString()} so‘m)\n` +
      `• **Mast holda boshqarish (131-modda):** 25 BHM (${(25 * BHM_VALUE).toLocaleString()} so‘m) va 1.5 - 3 yilgacha pravadan mahrum qilish\n\n` +
      `🎁 **15 kunlik 50% chegirma:** Jarima to‘g‘risidagi qaror rasmiylashtirilgan kundan boshlab **15 kalendar kuni** ichida to‘lansa, jarimaning roppa-rosa 50% qismi to‘lanadi.\n` +
      `⚠️ **12 ballik tizim:** Haydovchi 1 yil davomida 12 ball to‘plasa, sud qarori bilan ma’lum muddatga transport vositasini boshqarish huquqidan mahrum qilinadi.\n\n` +
      `💡 *Platformamizning "Jarimalar" bo‘limida barcha qoidabuzarliklarni interaktiv kalkulyatorda hisoblashingiz mumkin.*`;
  }

  // 4. Tezlik me'yorlari
  else if (clean.includes('tezlik') || clean.includes('km/s') || clean.includes('km/soat') || clean.includes('aholi punkti') || clean.includes('magistral')) {
    actionUrl = '#darslar';
    actionLabel = 'Tezlik Qoidalari Darsi';
    text = `🚗 **O‘zbekiston YHQ bo‘yicha belgilangan maksimal tezlik me’yorlari:**\n\n` +
      `1. **Aholi punktlarida (shaharlar, qishloqlar):** maksimal **60 km/soat** (amaldagi rasmiy qoida bo‘yicha).\n` +
      `2. **Maktab va bog‘chalar atrofida (ish vaqtida):** maksimal **30 km/soat**.\n` +
      `3. **Turar joy zonalari va hovlilarda (5.38 belgisi):** maksimal **20 km/soat**.\n` +
      `4. **Aholi punktidan tashqarida:** yengil avtomobillarga **100 km/soat**, avtobus va tirkamalarga **70-80 km/soat**.\n` +
      `5. **Avtomagistrallarda (5.1 belgisi):** maksimal **110 km/soat**.\n\n` +
      `📌 *Eslatma: Radar tezlik o‘lchagichlarida +5 km/soat xatolik ko‘rsatkichi mavjud (masalan, 60 bo‘lgan joyda 65 km/soatgacha jarima yozilmaydi).*`;
  }

  // 5. Davlat nazariy imtihoni va baholash tartibi
  else if (clean.includes('imtihon') || clean.includes('yhxbb') || clean.includes('bilet') || clean.includes('nechta savol') || clean.includes('necha daqiqa') || clean.includes('o\'tish bali')) {
    actionUrl = '#imtihon';
    actionLabel = 'Davlat Imtihonini Boshlash';
    text = `🎓 **YHXBB Davlat Nazariy Imtihoni Reglamenti va O‘tish Shartlari:**\n\n` +
      `• **Savollar soni:** 20 ta rasmiy test savoli.\n` +
      `• **Ajratilgan vaqt:** 25 daqiqa (1500 soniya).\n` +
      `• **O‘tish chegarasi:** Kamida **18 ta to‘g‘ri javob (90%)**.\n` +
      `• **Ruxsat etilgan xatolar:** Ko‘pi bilan **2 ta xato**. 3-xato qilingan lahzada test to‘xtatiladi va imtihondan o‘tmagan hisoblanadi.\n` +
      `• **Qayta topshirish:** Yiqilgan nomzod kamida 7 kundan so‘ng qayta topshirish huquqiga ega.\n\n` +
      `🚀 *Platformamizning "Davlat Imtihoni" bo‘limi aynan ushbu davlat standarti bo‘yicha ishlaydi!*`;
  }

  // 6. Birinchi tibbiy yordam
  else if (clean.includes('tibbiy') || clean.includes('jgut') || clean.includes('cpr') || clean.includes('reanimatsiya') || clean.includes('qon ket') || clean.includes('singan')) {
    actionUrl = '#darslar';
    actionLabel = 'Tibbiy Yordam Darsini Ochish';
    text = `🏥 **Favqulodda vaziyatlarda Birinchi Tibbiy Yordam ko‘rsatish qoidalari:**\n\n` +
      `1. **Yurak-o‘pka reanimatsiyasi (CPR):**\n` +
      `   • Ketma-ketlik: 30 marta ko‘krak qafasini bosish va 2 marta sun’iy nafas berish (**30:2** nisbatda).\n` +
      `   • Bosish tezligi: daqiqasiga 100-120 marta, chuqurligi 5-6 sm.\n` +
      `2. **Arterial qon ketishida jgut qo‘yish:**\n` +
      `   • Jgut jarohatlangan joydan yuqoriga qo‘yiladi.\n` +
      `   • Vaqt me’yori: Yozda ko‘pi bilan **1 soat**, qishda esa **30 daqiqa** (qo‘yilgan aniq vaqt qog‘ozga yozib qistiriladi).\n` +
      `3. **Suyak singanda immobilizatsiya:**\n` +
      `   • Shina qo‘yishda singan joyga qo‘shni kamida 2 ta bo‘g‘im harakatsizlantirilishi shart.\n\n` +
      `📞 *Shoshilinch xizmatlar: 102 — YPX/IIB, 103 — Tez yordam, 1050 — FVV.*`;
  }

  // 7. Shaxsiy tayyorgarlik va profil statistikasi
  else if (clean.includes('tayyorligim') || clean.includes('natijam') || clean.includes('qancha test') || clean.includes('ballim')) {
    const isAuth = userState.isAuthenticated;
    const testsCount = userState.testsCount || 0;
    if (!isAuth) {
      actionUrl = '#darslar';
      actionLabel = 'Ro‘yxatdan O‘tish va Boshlash';
      text = `📊 **Sizning tayyorgarlik holatingiz:**\n\n` +
        `Hozirda mehmon foydalanuvchi rejimidasiz. O‘z natijalaringiz, imtihonga tayyorlik foizi va xatolar statistikasini kuzatib borish uchun tizimga kiring yoki bepul ro‘yxatdan o‘ting!`;
    } else {
      actionUrl = testsCount > 0 ? '#dashboard' : '#testlar';
      actionLabel = testsCount > 0 ? 'Dashboardga O‘tish' : '1-Testni Boshlash';
      text = `📊 **Hurmatli ${userState.name || 'haydovchi'}, sizning tayyorgarlik ko‘rsatkichingiz:**\n\n` +
        `• **Tizimda ishlangan testlar:** ${testsCount} ta\n` +
        `• **Tavsiya:** Rasmiy imtihonga 100% ishonch bilan kirish uchun kamida 10-15 ta to‘liq imtihon simulyatsiyasini 90%+ natija bilan topshirish tavsiya etiladi.\n\n` +
        `Davom etish uchun "Testlar" yoki "Dashboard" bo‘limiga o‘tishingiz mumkin!`;
    }
  }

  // 8. RAG-enhanced default response
  else {
    const ragContext = findRAGContext(query, 2);
    const suggestion = getActionSuggestion(query);
    actionUrl = suggestion.actionUrl;
    actionLabel = suggestion.actionLabel;

    let ragExtra = '';
    if (ragContext) {
      ragExtra = `\n\n📚 **Mavzuga oid rasmiy test bazasi ma’lumoti:**\n` + ragContext;
    }

    text = `🤖 **OsonPrava AI Murabbiy javobi:**\n\n` +
      `Savolingiz: *«${q}»*\n\n` +
      `Yo‘l harakati qoidalari bo‘yicha quyidagilarni e’tiborga oling:\n` +
      `1. **Qoida asosi:** Harakat xavfsizligini ta’minlashda yo‘l belgilari, chiziqlari va svetofor signallari ketma-ketlikda eng yuqori yuridik kuchga ega.\n` +
      `2. **Amaliy tavsiya:** Imtihonda ushbu mavzudagi savollar tushganda shartdagi "ruxsat etiladi" va "taqiqlanadi" kalit so‘zlariga hamda istisno holatlariga diqqat qiling.\n` +
      `3. **Mashg‘ulot:** Mavzuni mustahkamlash uchun platformadagi tegishli test va simulyatsiyalardan foydalaning.` +
      ragExtra;
  }

  return { text, actionUrl, actionLabel };
}

// -------------------------------------------------------------
// 4b. Shared API logic (lokal server VA Vercel funksiyalari bir xil kodni ishlatadi)
// -------------------------------------------------------------

/**
 * GET /api/questions — filtrlangan savollar ro‘yxatini qaytaradi
 * @param {URLSearchParams} searchParams
 */
function buildQuestionsResponse(searchParams) {
  const questions = cachedQuestions.length > 0 ? cachedQuestions : loadQuestions();
  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');
  const limit = parseInt(searchParams.get('limit'), 10);

  let filtered = [...questions];
  if (topic && topic !== 'all' && topic !== 'Barcha mavzular') {
    const cleanTopic = topic.trim().toLowerCase();
    filtered = filtered.filter(q => q.topic.toLowerCase().includes(cleanTopic) || cleanTopic.includes(q.topic.toLowerCase()));
  }
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (!isNaN(limit) && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  return {
    success: true,
    count: filtered.length,
    total: questions.length,
    data: filtered
  };
}

// -------------------------------------------------------------
// 4c. Server-side Certificate PDF generation
//   Used by GET /api/certificate — the endpoint that Telegram.WebApp.downloadFile()
//   fetches directly (see js/certificate.js). Generating the PDF fully server-side
//   (instead of relying on jsPDF+html2canvas in the browser) means the download
//   works identically inside the Telegram Desktop/Android/iOS apps AND Telegram
//   Web (web.telegram.org) — both of which sandbox the Mini App's WebView/iframe
//   and silently block the synthetic <a download> click that client-side export
//   relies on. Telegram's own client fetches this URL directly, so none of that
//   sandboxing applies. A bundled DejaVu Sans font is embedded so Uzbek (o‘, g‘)
//   and Cyrillic names render correctly with no browser involved.
// -------------------------------------------------------------

const CERT_FONT_REGULAR = path.join(__dirname, 'assets', 'fonts', 'DejaVuSans.ttf');
const CERT_FONT_BOLD = path.join(__dirname, 'assets', 'fonts', 'DejaVuSans-Bold.ttf');

/**
 * Clamps/sanitizes untrusted certificate data coming from the client (the
 * ?data= query param) into safe, bounded values before it's drawn into a PDF.
 */
function sanitizeCertificatePayload(raw) {
  const safe = (v, max) => String(v === undefined || v === null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
  const num = (v, fallback) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };

  const total = Math.max(1, Math.round(num(raw.total, 20)));
  const score = Math.max(0, Math.min(total, Math.round(num(raw.score, 0))));
  const percentage = Math.max(0, Math.min(100, Math.round(num(raw.percentage, Math.round((score / total) * 100)))));
  const year = Math.max(2000, Math.min(2100, Math.round(num(raw.year, new Date().getFullYear()))));

  return {
    userName: safe(raw.userName, 80) || 'Foydalanuvchi',
    score, total, percentage,
    grade: safe(raw.grade, 40) || 'A’LO (PASS)',
    certificateId: safe(raw.certificateId, 40) || ('OP-' + year + '-000000'),
    dateStr: safe(raw.dateStr, 60) || new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    year,
    isDemo: !!raw.isDemo
  };
}

/**
 * Builds the official OSON PRAVA certificate PDF (A4 landscape) entirely
 * server-side with PDFKit — vector shapes + an embedded Unicode font, so no
 * browser, DOM, or html2canvas is involved. Resolves to a Buffer with the PDF.
 */
async function buildCertificatePdfBuffer(rawCert) {
  const PDFDocument = require('pdfkit');
  const QRCode = require('qrcode');

  const cert = sanitizeCertificatePayload(rawCert || {});
  const verifyUrl = cert.isDemo
    ? 'https://osonprava.uz/verify/demo'
    : `https://osonprava.uz/verify/${encodeURIComponent(cert.certificateId)}`;
  const qrPngBuffer = await QRCode.toBuffer(verifyUrl, {
    margin: 1, width: 260, color: { dark: '#0F172A', light: '#FFFFFF' }
  });

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const hasRegular = fs.existsSync(CERT_FONT_REGULAR);
  const hasBold = fs.existsSync(CERT_FONT_BOLD);
  if (hasRegular) doc.registerFont('Body', CERT_FONT_REGULAR);
  if (hasBold) doc.registerFont('Heading', CERT_FONT_BOLD);
  const FONT_BODY = hasRegular ? 'Body' : 'Helvetica';
  const FONT_HEAD = hasBold ? 'Heading' : 'Helvetica-Bold';

  const W = doc.page.width;
  const H = doc.page.height;
  const GOLD = '#B45309';
  const GOLD_LIGHT = '#D97706';
  const SLATE_900 = '#0F172A';
  const SLATE_700 = '#334155';
  const SLATE_500 = '#64748B';
  const BLUE_700 = '#1D4ED8';
  const BLUE_900 = '#1E3A8A';
  const EMERALD_700 = '#047857';
  const AMBER_50 = '#FFFBEB';

  // Outer double border
  const m = 22;
  doc.rect(m, m, W - m * 2, H - m * 2).lineWidth(2.2).strokeColor(GOLD).stroke();
  doc.rect(m + 6, m + 6, W - (m + 6) * 2, H - (m + 6) * 2).lineWidth(0.8).strokeColor(GOLD).stroke();

  // Corner ornaments
  const cornerLen = 34, co = m + 14;
  doc.lineWidth(2.4).strokeColor(GOLD);
  doc.moveTo(co, co + cornerLen).lineTo(co, co).lineTo(co + cornerLen, co).stroke();
  doc.moveTo(W - co, co + cornerLen).lineTo(W - co, co).lineTo(W - co - cornerLen, co).stroke();
  doc.moveTo(co, H - co - cornerLen).lineTo(co, H - co).lineTo(co + cornerLen, H - co).stroke();
  doc.moveTo(W - co, H - co - cornerLen).lineTo(W - co, H - co).lineTo(W - co - cornerLen, H - co).stroke();

  let y = 54;

  if (cert.isDemo) {
    doc.font(FONT_HEAD).fontSize(9).fillColor(GOLD_LIGHT)
      .text('DEMO REJIM • NAMUNA SERTIFIKAT', 0, y, { width: W, align: 'center', characterSpacing: 1.2 });
    y += 20;
  }

  doc.font(FONT_HEAD).fontSize(15).fillColor(SLATE_900)
    .text('OSON PRAVA', 0, y, { width: W, align: 'center' });
  y += 20;
  doc.font(FONT_BODY).fontSize(8.5).fillColor(SLATE_500)
    .text('OSON PRAVA — Zamonaviy Nazariy Ta’lim Platformasi', 0, y, { width: W, align: 'center', characterSpacing: 1 });
  y += 26;

  doc.font(FONT_HEAD).fontSize(30).fillColor(GOLD)
    .text('MUVAFFAQIYAT SERTIFIKATI', 0, y, { width: W, align: 'center', characterSpacing: 1.5 });
  y += 40;
  doc.font(FONT_BODY).fontSize(9).fillColor(SLATE_500)
    .text('Certificate of Theoretical Course Excellence', 0, y, { width: W, align: 'center' });
  y += 30;

  doc.font(FONT_BODY).fontSize(9).fillColor(SLATE_500)
    .text('USHBU SERTIFIKAT TASDIQLAYDIKI:', 0, y, { width: W, align: 'center', characterSpacing: 1 });
  y += 22;

  doc.font(FONT_HEAD).fontSize(22).fillColor(BLUE_900)
    .text(cert.userName, 40, y, { width: W - 80, align: 'center' });
  const nameWidth = Math.min(doc.widthOfString(cert.userName), W - 160);
  const lineY = y + 30;
  doc.moveTo(W / 2 - nameWidth / 2 - 20, lineY).lineTo(W / 2 + nameWidth / 2 + 20, lineY)
    .lineWidth(1.4).strokeColor('#FBBF24').stroke();
  y = lineY + 18;

  const bodyText = 'O‘zbekiston Respublikasi Yo‘l Harakati Qoidalari bo‘yicha OSON PRAVA nazariy kursi va davlat imtihoni formati simulyatsiyasini muvaffaqiyatli topshirdi hamda yuqori darajadagi bilim va tayyorgarlik ko‘rsatdi.';
  doc.font(FONT_BODY).fontSize(10.5).fillColor(SLATE_700)
    .text(bodyText, W / 2 - 280, y, { width: 560, align: 'center', lineGap: 3 });
  y += 48;

  // Score / percentage / grade grid
  const gridW = 420, gridH = 62, gridX = W / 2 - gridW / 2;
  doc.roundedRect(gridX, y, gridW, gridH, 12).fillAndStroke(AMBER_50, '#FDE68A');
  const colW = gridW / 3;
  const gridCols = [
    ['TO‘PLANGAN BALL', `${cert.score} / ${cert.total}`, EMERALD_700],
    ['O‘ZLASHTIRISH', `${cert.percentage}%`, BLUE_700],
    ['BAHOLASH', cert.grade, GOLD_LIGHT]
  ];
  gridCols.forEach((col, i) => {
    const cx = gridX + colW * i;
    doc.font(FONT_BODY).fontSize(7.2).fillColor(SLATE_500)
      .text(col[0], cx, y + 13, { width: colW, align: 'center', characterSpacing: 0.5 });
    doc.font(FONT_HEAD).fontSize(15).fillColor(col[2])
      .text(col[1], cx, y + 30, { width: colW, align: 'center' });
  });
  y += gridH + 34;

  // Footer row: seal stamp (left) — cert id/date (left-center) — QR code (right)
  const footerY = y;
  doc.moveTo(m + 30, footerY).lineTo(W - m - 30, footerY).lineWidth(0.75).strokeColor('#E2E8F0').stroke();
  const rowY = footerY + 22;

  const sealCX = m + 30 + 42, sealCY = rowY + 30;
  doc.circle(sealCX, sealCY, 40).lineWidth(1.6).strokeColor(GOLD).stroke();
  doc.circle(sealCX, sealCY, 34).lineWidth(0.8).dash(2, { space: 2 }).strokeColor(GOLD).stroke();
  doc.undash();
  doc.font(FONT_HEAD).fontSize(7).fillColor(GOLD)
    .text('TASDIQLANDI', sealCX - 40, sealCY - 10, { width: 80, align: 'center' });
  doc.font(FONT_BODY).fontSize(6.5).fillColor(GOLD_LIGHT)
    .text(String(cert.year) + '-YIL', sealCX - 40, sealCY + 2, { width: 80, align: 'center' });

  const idX = sealCX + 62;
  doc.font(FONT_HEAD).fontSize(9.5).fillColor(SLATE_900)
    .text('Sertifikat №: ' + cert.certificateId, idX, rowY, { width: 260 });
  doc.font(FONT_BODY).fontSize(8.5).fillColor(SLATE_500)
    .text('Berilgan sana: ' + cert.dateStr, idX, rowY + 16, { width: 260 });
  doc.font(FONT_BODY).fontSize(7.5).fillColor(SLATE_500)
    .text('OSON PRAVA — Zamonaviy Nazariy Ta’lim Platformasi', idX, rowY + 32, { width: 260 });

  const qrSize = 70;
  const qrX = W - m - 30 - qrSize;
  const qrY = rowY - 6;
  doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10).fillAndStroke(SLATE_900, SLATE_900);
  doc.image(qrPngBuffer, qrX, qrY, { width: qrSize, height: qrSize });
  doc.font(FONT_BODY).fontSize(7).fillColor(SLATE_500)
    .text('Haqiqiyligini tekshirish uchun\nQR-kodni skanerlang', qrX - 110, qrY + 14, { width: 96, align: 'right', lineGap: 1 });

  doc.end();
  return done;
}

/**
 * POST /api/ai/chat — Gemini (kalit bo‘lsa) yoki oflayn zaxira mexanizmi bilan javob beradi
 * @param {object} payload { query, history, userState }
 * @returns {Promise<object>} JSON javob obyekti
 */
async function handleChatPayload(payload) {
  try {
    const safePayload = payload && typeof payload === 'object' ? payload : {};
    const query = (safePayload.query || '').trim();
    const history = safePayload.history || [];
    const userState = safePayload.userState || {};

    if (!query) {
      return { success: false, error: 'Savol matni kiritilmadi' };
    }

    // Try Gemini AI Pro/Flash integration if API key is configured
    if (GEMINI_API_KEY) {
      try {
        const geminiResult = await generateGeminiAIResponse(query, history, userState);
        return {
          success: true,
          query: query,
          text: geminiResult.text,
          actionUrl: geminiResult.actionUrl,
          actionLabel: geminiResult.actionLabel,
          source: 'gemini',
          model: geminiResult.modelUsed
        };
      } catch (geminiErr) {
        // Check error types and log detailed technical info
        if (geminiErr.statusCode === 429) {
          console.warn('[Gemini API 429] So‘rovlar kvotasi (Rate Limit) to‘ldi. Oflayn intellektual fallback ishga tushirildi.');
        } else if (geminiErr.statusCode === 400 || geminiErr.statusCode === 401 || geminiErr.statusCode === 403) {
          console.error(`[Gemini API ${geminiErr.statusCode}] API kalit yaroqsiz yoki ruxsat yo‘q:`, geminiErr.message);
        } else {
          console.error('[Gemini API Xatolik]:', geminiErr.message);
        }

        // Graceful fallback to offline smart engine
        const fallbackResult = generateSmartAIResponse(query, history, userState);
        return {
          success: true,
          query: query,
          text: fallbackResult.text,
          actionUrl: fallbackResult.actionUrl,
          actionLabel: fallbackResult.actionLabel,
          source: 'fallback',
          notice: 'Javob oflayn YHQ bazasidan tayyorlandi.'
        };
      }
    }

    // GEMINI_API_KEY is not set -> use offline smart generator
    const fallbackResult = generateSmartAIResponse(query, history, userState);
    return {
      success: true,
      query: query,
      text: fallbackResult.text,
      actionUrl: fallbackResult.actionUrl,
      actionLabel: fallbackResult.actionLabel,
      source: 'offline'
    };
  } catch (chatErr) {
    console.error('[API /api/ai/chat] Fatal error:', chatErr);
    return { success: false, error: 'AI so‘rovini qayta ishlashda xatolik yuz berdi' };
  }
}

// -------------------------------------------------------------
// 5. HTTP Server & Request Routing
// -------------------------------------------------------------
const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = urlObj.pathname;

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // 1. REST API: GET /api/questions
  if (reqPath === '/api/questions') {
    try {
      const payload = buildQuestionsResponse(urlObj.searchParams);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800'
      });
      res.end(JSON.stringify(payload));
    } catch (apiErr) {
      console.error('[API /api/questions] Xatolik:', apiErr);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: 'Savollar bazasini yuklashda xatolik yuz berdi' }));
    }
    return;
  }

  // 2. REST API: POST /api/ai/chat
  if (reqPath === '/api/ai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1000000) req.destroy(); // 1MB limit
    });

    req.on('end', async () => {
      let payload = null;
      try {
        payload = JSON.parse(body || '{}');
      } catch (parseErr) {
        payload = null;
      }
      const result = payload === null
        ? { success: false, error: 'AI so‘rovini qayta ishlashda xatolik yuz berdi' }
        : await handleChatPayload(payload);

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(result));
    });
    return;
  }

  // 3. REST API: GET /api/certificate — server-side PDF, fetched directly by
  //    Telegram.WebApp.downloadFile() (see js/certificate.js)
  if (reqPath === '/api/certificate') {
    (async () => {
      try {
        const raw = urlObj.searchParams.get('data');
        if (!raw) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'data parametri kerak' }));
          return;
        }
        // Mirrors js/certificate.js's encodeCertExportParam(): the client does
        // btoa(unescape(encodeURIComponent(json))), i.e. base64 of the UTF-8
        // bytes of the JSON string — so a plain base64 -> utf8 decode here
        // reconstructs the original JSON exactly (handles Cyrillic/Uzbek names).
        const json = Buffer.from(decodeURIComponent(raw), 'base64').toString('utf8');
        const certPayload = JSON.parse(json);
        const pdfBuffer = await buildCertificatePdfBuffer(certPayload);
        const fileName = `OSON-PRAVA-SERTIFIKAT-${(certPayload.certificateId || 'CERT').replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`;
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Access-Control-Allow-Origin': 'https://web.telegram.org',
          'Vary': 'Origin',
          'Cache-Control': 'no-store',
          'Content-Length': String(pdfBuffer.length),
          'X-Content-Type-Options': 'nosniff'
        });
        res.end(pdfBuffer);
      } catch (certErr) {
        console.error('[API /api/certificate] Xatolik:', certErr);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Sertifikat generatsiya qilishda xatolik yuz berdi' }));
      }
    })();
    return;
  }

  // 4. Static File Handling
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Maxfiy va server tomonidagi fayllarni (.env, server.js, scratch, api, node_modules) hech qachon tarqatmaymiz
  if (/(^|\/)\.|^\/(server\.js|scratch|api|node_modules)(\/|$)/i.test(reqPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const filePath = path.join(PUBLIC_DIR, decodeURIComponent(reqPath));

  // Prevent path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`  OSON PRAVA server ishga tushdi!`);
    console.log(`  Manzil: http://localhost:${PORT}`);
    console.log(`  Gemini AI API: ${GEMINI_API_KEY ? 'ULANGAN (Aktiv)' : 'OFLAYN REJIM (.env fayliga GEMINI_API_KEY kiriting)'}`);
    console.log(`  API: GET /api/questions | POST /api/ai/chat`);
    console.log(`==================================================\n`);
  });
}

// Vercel serverless funksiyalari (api/*.js) shu yerdan foydalanadi
module.exports = { buildQuestionsResponse, handleChatPayload, buildCertificatePdfBuffer };
