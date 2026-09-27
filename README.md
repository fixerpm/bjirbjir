# OSON PRAVA 🚦

> O‘zbekistonda haydovchilik guvohnomasi nazariy imtihoniga zamonaviy, interaktiv va qulay tayyorgarlik platformasi.

---

## 🌟 Asosiy Imkoniyatlar

- **🎯 Davlat Imtihoni Simulyatori:** Rasmiy 20 ta savoldan iborat test rejimi, real vaqt hisoblagichi va haqiqiy imtihon mezonlari (kamida 18/20 o'tish balli).
- **🎓 Rasmiy Muvaffaqiyat Sertifikati:** Imtihondan muvaffaqiyatli o'tgan foydalanuvchilar uchun maxsus QR-kodli, tasdiqlovchi muhrga ega PDF formatidagi yuklab olinuvchi sertifikat.
- **🤖 PravaGPT (AI Murabbiy):** Yo‘l harakati qoidalari, jarimalar va vaziyatli savollar bo‘yicha Google Gemini 2.0 Flash / aqlli oflayn YHQ qidiruv tizimi.
- **🔄 Chorraha Simulyatori:** 8 xil interaktiv chorraha animatsiyasi, avtomobillar harakati ketma-ketligi va burilish qoidalari.
- **📚 Interaktiv Yo‘l Belgilari & Jarimalar:** 2026-yilgi BHM miqdorlariga moslashtirilgan to'liq ma'lumotlar bazasi.
- **👤 Foydalanuvchi & Demo Profil:** "Demo User" orqali darhol barcha funksiyalarni sinab ko'rish imkoniyati (haqiqiy foydalanuvchilar ma'lumotlaridan to'liq ajratilgan).
- **📱 PWA & Oflayn Rejim:** Mobil va kompyuter ekranlariga to'liq moslashgan (Responsive), Service Worker bilan oflayn ishlash qobiliyati.

---

## 🚀 Texnologiyalar

- **Frontend:** Vanilla HTML5, CSS3, Modern ES6+ JavaScript, Tailwind CSS utility layers
- **Shriftlar & Ikonkalar:** Sora, Inter, FontAwesome 6 Pro (mahalliy vendor yuklamalari bilan)
- **PDF & Grafikalar:** jsPDF, html2canvas, SVG QR generator
- **Backend / Serverless:** Node.js (Standard HTTP server & Vercel Serverless Functions)
- **AI Integratsiyasi:** Google Gemini Flash API + Local RAG Context Matcher

---

## 🛠 O'rnatish va Ishga Tushirish

### Lokal serverda ishga tushirish:

```bash
# Serverni ishga tushirish (Node.js >= 18)
npm start
# yoki
node server.js
```

Brauzerda oching: `http://localhost:3000`

### .env konfiguratsiyasi (ixtiyoriy):

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Agar Gemini API kaliti kiritilmasa, AI Murabbiy avtomatik tarzda boyitilgan oflayn YHQ bazasidan javob beradi).*

---

## 📦 Loyiha Strukturasi

```
OSONPRAVA/
├── api/                  # Vercel Serverless API funksiyalari
│   ├── ai/chat.js        # PravaGPT AI suhbat API
│   └── questions.js      # Savollar bazasi API
├── css/                  # Uslublar (style.css, tailwind.css)
├── js/                   # Platforma modullari (auth, exam, certificate, simulator, va b.)
├── vendor/               # Mahalliy fontlar, ikonkalar va PDF kutubxonalari
├── data_questions.json   # 2026-yilgi rasmiy savollar bazasi
├── index.html            # Asosiy SPA interfeysi
├── server.js             # Lokal server va RAG mantiqi
├── vercel.json           # Vercel deployment konfiguratsiyasi
└── sw.js                 # PWA Service Worker
```

---

## 📄 Litsenziya

MIT License © 2026 OSON PRAVA Team. Barcha huquqlar himoyalangan.# osonnpravaa
# bjirbjir
