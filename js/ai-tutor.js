/**
 * OSON PRAVA — Oson AI Murabbiy (PravaGPT)
 * Real-time conversational AI driving mentor for Uzbek traffic rules,
 * crossroads, road signs, state exams, and fines.
 */

(function() {
  'use strict';

  // Pre-indexed knowledge base for intelligent NLP matching
  const KNOWLEDGE_BASE = [
    {
      keywords: ['chorraha', 'chorrahalar', 'o\'ng qo\'l', 'ong qol', 'kim birinchi', 'birinchi o\'tadi'],
      title: 'Chorrahada o‘tish navbati',
      reply: `🚦 **Chorrahalarda harakatlanishning oltin qoidalari:**\n\n` +
             `1. **Tartibga solingan chorraha:** Svetofor yoki tartibga soluvchi (inspektor) ishorasiga qat’iy bo‘ysuniladi.\n` +
             `2. **Tartibga solinmagan (notekis huquqli):** Agar "Asosiy yo‘l" (2.1) belgisi bo‘lsa, asosiy yo‘ldagilar birinchi o‘tadi. "Yo‘l bering" (2.4) belgisi bor haydovchi to‘xtab yo‘l beradi.\n` +
             `3. **Teng huquqli chorraha:** *"O‘ng qo‘l qoidasi"* amal qiladi — o‘ng tomoningizdan kelayotgan transport vositasiga doimo yo‘l berishingiz shart!\n` +
             `4. **Aylanma harakat (Krug):** Aylanma yo‘lda bo‘lgan transport vositasi imtiyozga ega.\n\n` +
             `💡 *Buni amalda sinab ko‘rish uchun platformamizning **"Chorraha 2D"** simulyatoridan foydalaning!*`,
      detailedReply: `🚦 **Chorrahadan o‘tish tartibi — Kengaytirilgan huquqiy tahlil:**\n\n` +
             `1. **Tartibga solingan chorrahalar (YHQ 96-105-bandlar):**\n` +
             `   • Svetofor signallari imtiyoz belgilarini (2.1, 2.4, 2.5) bekor qiladi!\n` +
             `   • Yashil chiroqda chapga burilayotgan haydovchi qarama-qarshi tomondan to‘g‘riga yoki o‘ngga ketayotgan transportga yo‘l berishi shart.\n\n` +
             `2. **Tartibga solinmagan chorrahalar:**\n` +
             `   • **Asosiy yo‘nalish burilganda (7.13 lavhasi):** Asosiy yo‘lda bo‘lgan haydovchilar o‘zaro "o‘ng qo‘l qoidasi" bo‘yicha harakatlanadi. So‘ng ikkinchi darajali yo‘ldagilar ham o‘zaro o‘ng qo‘l qoidasiga bo‘ysunadi.\n` +
             `   • **Relsli transport (Tramvay):** Teng huquqli sharoitda tramvay harakat yo‘nalishidan qat’i nazar doimo ustundir!\n` +
             `   • **Chorrahada tiqilinch bo‘lsa:** Agar chorrahada tirbandlik hosil bo‘lgan bo‘lsa, ruxsat etuvchi chiroq yongan bo‘lsa ham chorrahaga kirish taqiqlanadi (MJtK 128-modda, 0.5 BHM jarima).\n\n` +
             `💡 *Barcha 8 ta ssenariyni "Chorraha 2D" simulyatorida real animatsiyada ko‘rishingiz mumkin.*`,
      actionUrl: '#simulyator',
      actionLabel: 'Chorraha 2D Simulyatoriga o‘tish'
    },
    {
      keywords: ['krug', 'aylanma', 'aylana', 'halqa'],
      title: 'Aylanma harakat (Krug) qoidasi',
      reply: `⭕ **Aylanma harakat (4.3-belgi) qoidasi:**\n\n` +
             `• Amaldagi YHQga asosan, agar boshqa belgilar o‘rnatilmagan bo‘lsa, **aylana bo‘ylab harakatlanayotgan haydovchilar ustunlikka ega**!\n` +
             `• Aylanaga kirib kelayotgan haydovchi aylanadagilarni o‘tkazib yuborishi shart.\n` +
             `• Aylanadan chiqish faqat o‘ng chekka qatnov qismidan (o‘ng burilish chirog‘ini yoqib) amalga oshiriladi.\n\n` +
             `💡 *Eslatma: Aylanaga kirishda chap chiroqni yoqish shart emas, lekin aylanadan chiqishda o‘ng chiroqni yoqish majburiy!*`,
      detailedReply: `⭕ **Aylanma harakat chorrahasi (4.3-belgi) — Batafsil tushuntirish va qoidalar:**\n\n` +
             `1. **Ustunlik qoidasi:** O‘zbekiston YHQga kiritilgan so‘nggi o‘zgartirishlarga ko‘ra, aylanada harakatlanayotgan transport vositasi aylanaga kirib kelayotgan barcha transportga nisbatan mutlaq ustunlikka ega.\n` +
             `2. **Kirish qoidasi:** Aylanaga istalgan qatordan (o‘ng, o‘rta yoki chap) kirishga ruxsat etiladi.\n` +
             `3. **Chiqish qoidasi (Imtihonda ko‘p xato qilinadi):** Aylanadan chiqish FAQAT o‘ng chekka qatordan amalga oshirilishi shart! Ichki qatordan to‘g‘ridan-to‘g‘ri chiqish qoidabuzarlik hisoblanadi.\n` +
             `4. **Signal berish:** Aylanaga kirishda chap chiroq yoqilmaydi. Ichki qatorga o‘tishda chap chiroq, chiqishda esa oldindan o‘ng burilish chirog‘i yoqiladi.`,
      actionUrl: '#simulyator',
      actionLabel: 'Chorrahada mashq qilish'
    },
    {
      keywords: ['jarima', 'radar', 'tezlik', 'bhm', 'qancha', 'to\'lash', 'chegirma'],
      title: '2026-yilgi jarimalar va 15 kunlik chegirma',
      reply: `⚖️ **2026-yilda jarimalar tartibi (1 BHM = 375,000 so‘m):**\n\n` +
             `• **Tezlik +20 km/soatgacha:** 1 BHM (375,000 so‘m) | 1 ball\n` +
             `• **Tezlik +20...+40 km/soat:** 5 BHM (1,875,000 so‘m) | 2 ball\n` +
             `• **Tezlik +40 km/soatdan yuqori:** 9 BHM (3,375,000 so‘m) | 3 ball\n` +
             `• **Qizil chiroqqa o‘tish:** 2 BHM (750,000 so‘m) | 2 ball\n` +
             `• **Xavfsizlik kamari:** 0.5 BHM (187,500 so‘m) | 0.5 ball\n` +
             `• **Telefondan foydalanish:** 3 BHM (1,125,000 so‘m) | 2 ball\n\n` +
             `🎁 **50% Chegirma:** Qaror chiqarilgan kundan boshlab 15 kun ichida to‘lasangiz, jarimaning roppa-rosa yarmini to‘laysiz!`,
      detailedReply: `⚖️ **2026-yilgi jarimalar, ball tizimi va imtiyozlar bo‘yicha to‘liq reglament:**\n\n` +
             `• **Baza hisoblash miqdori (BHM):** 375,000 so‘m.\n` +
             `• **Tezlik me’yorlarini buzish (MJtK 128-3-modda):**\n` +
             `   - 20 km/soatgacha: 1 BHM (375,000 so‘m) — 1 ball\n` +
             `   - 20-40 km/soat: 5 BHM (1,875,000 so‘m) — 2 ball\n` +
             `   - 40 km/soatdan yuqori: 9 BHM (3,375,000 so‘m) — 3 ball\n` +
             `• **Qizil chiroqqa o‘tish (MJtK 128-4):** 2 BHM (750,000 so‘m) — 2 ball\n` +
             `• **Qarama-qarshi yo‘nalishga chiqish (128-5):** 10 BHM (3,750,000 so‘m)\n` +
             `• **Mast holda boshqarish (131-modda):** 25 BHM va 1.5 yildan 3 yilgacha pravadan mahrum qilish!\n\n` +
             `🎁 **50% chegirma mexanizmi:** Jarima to‘g‘risidagi qaror SMS yoki xat orqali yetib kelgan kundan boshlab **15 kalendar kuni** ichida to‘lansa, jarimaning roppa-rosa 50% qismi to‘lanadi va qaror to‘liq ijro etilgan hisoblanadi (sud qarorlari bundan mustasno).`,
      actionUrl: '#jarimalar',
      actionLabel: 'Jarima & Ball Kalkulyatoriga o‘tish'
    },
    {
      keywords: ['imtihon', 'davlat imtihoni', 'yhxbb', 'nechta savol', 'necha daqiqa', 'ball', 'baho', 'o\'tish'],
      title: 'Davlat nazariy imtihoni tartibi',
      reply: `🎓 **YHXBB davlat nazariy imtihoni talablari:**\n\n` +
             `• **Savollar soni:** 20 ta test savoli.\n` +
             `• **Ajratilgan vaqt:** 25 daqiqa.\n` +
             `• **O‘tish chegarasi:** Kamida 18 ta to‘g‘ri javob (90%).\n` +
             `• **Ruxsat etilgan xatolar:** Ko‘pi bilan 2 ta xato. 3-xatoda imtihon to‘xtatiladi va topshirilmagan hisoblanadi.\n\n` +
             `🚀 *Bizning platformadagi "Davlat Imtihoni" bo‘limi aynan ushbu rasmiy reglament asosida ishlaydi!*`,
      detailedReply: `🎓 **YHXBB Davlat Nazariy Imtihoni — Qabul qilish reglamenti va sirlari:**\n\n` +
             `1. **Imtihon formati:**\n` +
             `   • Avtomatlashtirilgan kompyuter sinfida yuzni tanish (Face-ID) orqali topshiriladi.\n` +
             `   • Tasodifiy 20 ta savol generatsiya qilinadi. Vaqt: roppa-rosa 25 daqiqa (savol boshiga 75 soniya).\n` +
             `2. **Baholash mezonlari:**\n` +
             `   • 18-20 ta to‘g‘ri javob: **«O‘TDI» (Muvaffaqiyatli)**.\n` +
             `   • 3 ta xato qilingan lahzada imtihon avtomatik to‘xtaydi va «O‘TMADI» deb baholanadi.\n` +
             `3. **Qayta topshirish tartibi:**\n` +
             `   • Birinchi marta o‘ta olmagan taqdirda, kamida 7 kundan keyin qayta topshirish mumkin.\n` +
             `4. **Muvaffaqiyat strategiyasi:**\n` +
             `   • Avval aniq bilgan savollaringizni belgilang, ikkilangan savollarni oxiriga qoldiring.\n` +
             `   • Savol shartidagi "ruxsat etiladi" va "taqiqlanadi" so‘zlariga diqqat qiling.\n\n` +
             `🚀 *Platformamizning "Davlat Imtihoni" simulyatori aynan shu shartlar asosida tayyorlangan!*`,
      actionUrl: '#imtihon',
      actionLabel: 'Haqiqiy Imtihonni Boshlash'
    },
    {
      keywords: ['toifa', 'kategoriya', 'b toifa', 'a toifa', 'c toifa', 'prava turi'],
      title: 'Haydovchilik guvohnomasi toifalari',
      reply: `🪪 **O‘zbekistonda asosiy haydovchilik toifalari:**\n\n` +
             `• **"A" toifa:** Mototsikllar va skuterlar (18 yoshdan).\n` +
             `• **"B" toifa (eng keng tarqalgan):** To‘liq vazni 3,5 tonnadan va yo‘lovchi o‘rinlari soni 8 tadan oshmaydigan yengil avtomobillar (18 yoshdan).\n` +
             `• **"C" toifa:** Ruxsat etilgan to‘la vazni 3,5 tonnadan oshadigan yuk avtomobillari (18 yoshdan).\n` +
             `• **"D" toifa:** O‘rindiqlar soni 8 tadan ortiq bo‘lgan avtobuslar (21 yoshdan va 3 yillik tajriba).\n\n` +
             `💡 *B toifa bo‘yicha to‘liq darslarni "Darslar" bo‘limida o‘rganishingiz mumkin.*`,
      actionUrl: '#darslar',
      actionLabel: 'Nazariy Darslarga o‘tish'
    },
    {
      keywords: ['belgi', 'belgilar', 'taqiqlovchi', 'ogohlantiruvchi', 'stop', 'kirish taqiqlanadi'],
      title: 'Yo‘l belgilari tasnifi',
      reply: `🛑 **Yo‘l belgilari 7 ta asosiy guruhga bo‘linadi:**\n\n` +
             `1. **Ogohlantiruvchi (uchburchak qizil jiyakli):** Xavf haqida oldindan xabar beradi (masalan: 1.1 "Piyodalar o‘tish joyi").\n` +
             `2. **Imtiyoz (ustunlik):** Chorrahada kim birinchi o‘tishini belgilaydi (2.1 "Asosiy yo‘l", 2.4 "Yo‘l bering").\n` +
             `3. **Taqiqlovchi (dumaloq qizil hoshiyali):** Cheklovlar o‘rnatadi (3.1 "Kirish taqiqlanadi - G‘isht").\n` +
             `4. **Buyuruvchi (dumaloq ko‘k):** Qat’iy harakat yo‘nalishini ko‘rsatadi (4.1.1 "To‘g‘riga harakat").\n` +
             `5. **Axborot-ko‘rsatkich, Servis va Qo‘shimcha axborot lavhalari**.\n\n` +
             `🔍 *Barcha 26 ta rasmiy belgini interaktiv katalogimizda o‘rganing!*`,
      actionUrl: '#belgilar',
      actionLabel: 'Belgilar Katalogini Ko‘rish'
    },
    {
      keywords: ['spirtli', 'mast', 'alkogol', 'ichkilik', 'ichib'],
      title: 'Mast holda transport boshqarish javobgarligi',
      reply: `⚠️ **Mast holda avtomobil boshqarish qat’iyan man etiladi!**\n\n` +
             `• **Jarima:** 25 BHM miqdorida jarima va **1,5 yildan 3 yilgacha** haydovchilik huquqidan mahrum qilish.\n` +
             `• **Tekshiruvdan o‘tishdan bosh tortish:** Xuddi shu jazoga sabab bo‘ladi.\n` +
             `• Agar ushbu holat takroran sodir etilsa, ma’muriy emas, jinoiy javobgarlik (ozodlikdan mahrum qilish) ko‘zda tutilgan.\n\n` +
             `🛡️ *Xavfsiz haydash — o‘zingiz va yaqinlaringiz hayotini asraydi.*`,
      actionUrl: '#jarimalar',
      actionLabel: 'Jarima & Qonunchilik'
    },
    {
      keywords: ['piyoda', 'piyodalar', 'zebra', 'o\'tish joyi', 'otish joyi'],
      title: 'Piyodalar oldida haydovchi majburiyati',
      reply: `🚶 **Piyodalar o‘tish joyi (zebra) qoidalari:**\n\n` +
             `• Tartibga solinmagan piyodalar o‘tish joyida piyoda yo‘lga chiqqan (yoki chiqishga tayyorlangan) bo‘lsa, haydovchi to‘xtab, uni to‘liq o‘tkazib yuborishi shart.\n` +
             `• Piyodalar o‘tish joyiga yaqinlashganda, oldinda to‘xtagan boshqa transportni **obgon qilish (o‘zib o‘tish) taqiqlanadi** — orqasida piyoda yashiringan bo‘lishi mumkin.\n` +
             `• Maktab va bog‘cha yaqinidagi o‘tish joylarida ayniqsa ehtiyot bo‘ling.\n\n` +
             `💡 *Piyodaga yo‘l bermaslik og‘ir jarima va ballga sabab bo‘ladi.*`,
      actionUrl: '#testlar',
      actionLabel: 'Piyodalar mavzusida test yechish'
    },
    {
      keywords: ['obgon', 'o\'zib o\'tish', 'ozib otish', 'ortga o\'tish', 'quvib o\'tish', 'overtaking'],
      title: 'Obgon (o‘zib o‘tish) qoidalari',
      reply: `🏎️ **Obgon qilishning asosiy qoidalari:**\n\n` +
             `• Qarshi tomondan kelayotgan yo‘lak bo‘sh va yetarlicha ko‘rinishga ega bo‘lgandagina obgon qilinadi.\n` +
             `• Piyodalar o‘tish joyida, temir yo‘l kesishmasida, ko‘prikda, tunnel ichida va chorraha oldida (imtiyoz belgilari bo‘lmasa) **obgon taqiqlanadi**.\n` +
             `• Uzluksiz chiziq (1.1 yoki 1.3) ustidan obgon qilib o‘tish taqiqlanadi.\n\n` +
             `⚠️ *Noto‘g‘ri obgon YHQdagi eng og‘ir baxtsiz hodisalar sababi hisoblanadi.*`,
      actionUrl: '#belgilar',
      actionLabel: 'Yo‘l chiziqlari va belgilarini ko‘rish'
    },
    {
      keywords: ['to\'xtash', 'toxtash', 'parkovka', 'turish', 'mashina qoyish'],
      title: 'To‘xtash va turish qoidalari',
      reply: `🅿️ **Qayerda to‘xtash/turish taqiqlanadi:**\n\n` +
             `• Piyodalar o‘tish joyida va undan 5 metr masofada.\n` +
             `• Chorrahada va undan 5 metr masofada (tartibga solinmagan chorrahalarda).\n` +
             `• Yo‘lning ko‘rinishi cheklangan joylarida (burilish, tepalik oldida).\n` +
             `• Bekat belgisidan 15 metr masofada.\n` +
             `• Nogironlar uchun belgilangan joylarda (tegishli ruxsatnomasiz).\n\n` +
             `🚗 *"To‘xtash taqiqlangan" (3.27) va "Turish taqiqlangan" (3.28) belgilari farqini "Belgilar" bo‘limida ko‘ring.*`,
      actionUrl: '#belgilar',
      actionLabel: 'Taqiqlovchi belgilarni ko‘rish'
    },
    {
      keywords: ['xavfsizlik kamari', 'kamar', 'bolalar o\'rindig\'i', 'bolalar kreslosi'],
      title: 'Xavfsizlik kamari va bolalar xavfsizligi',
      reply: `🔒 **Xavfsizlik kamari va bolalar tashish qoidalari:**\n\n` +
             `• Haydovchi va barcha yo‘lovchilar harakat davomida xavfsizlik kamarini taqishi **shart**.\n` +
             `• 12 yoshgacha bo‘lgan bolalar faqat maxsus bolalar kreslosi (avtokresло) yoki moslamada tashiladi.\n` +
             `• Bolani old o‘rindiqqa maxsus moslamasiz o‘tqazish taqiqlanadi.\n\n` +
             `⚖️ *Buzilsa 0.5 BHM miqdorida jarima solinadi — lekin asosiysi, bu hayot-mamot masalasi!*`,
      actionUrl: '#jarimalar',
      actionLabel: 'Jarima kalkulyatorini ko‘rish'
    },
    {
      keywords: ['hujjat', 'guvohnoma', 'texpasport', 'osago', 'sug\'urta', 'sugurta'],
      title: 'Haydovchida bo‘lishi shart hujjatlar',
      reply: `📄 **Rulda bo‘lganda yonda bo‘lishi shart hujjatlar:**\n\n` +
             `1. **Haydovchilik guvohnomasi** (tegishli toifa bo‘yicha).\n` +
             `2. **Transport vositasi texnik pasporti** (yoki uning elektron nusxasi).\n` +
             `3. **OSAGO (majburiy sug‘urta polisi)**.\n` +
             `4. Kerak bo‘lganda — ishonchnoma (agar mashina o‘zinikimas bo‘lsa).\n\n` +
             `📱 *Hozirda ko‘pchilik hujjatlar "MyGov" yoki "Yagona window" ilovalarida elektron shaklda ham qabul qilinadi.*`,
      actionUrl: '#profil',
      actionLabel: 'Rasmiy Sertifikatingizni ko‘rish'
    },
    {
      keywords: ['distansiya', 'masofa', 'orasidagi masofa', 'yaqin yurish'],
      title: 'Xavfsiz distansiya (masofa) qoidasi',
      reply: `📏 **Oldindagi mashinagacha xavfsiz masofa:**\n\n` +
             `• Aniq metr YHQda ko‘rsatilmagan, lekin qoida: to‘satdan to‘xtaganda **to‘qnashmaslik uchun yetarli masofa** saqlanishi shart.\n` +
             `• Oddiy formula: tezlikning yarmini metrga aylantiring (masalan, 60 km/soatda ~30 metr).\n` +
             `• Yomg‘ir, qor, tumanda distansiyani kamida 2 barobar oshiring.\n\n` +
             `💡 *"Chorraha 2D" simulyatorida turli tezliklarda tormozlash masofasini his qilib ko‘rishingiz mumkin.*`,
      actionUrl: '#simulyator',
      actionLabel: 'Simulyatorda sinab ko‘rish'
    },
    {
      keywords: ['tramvay', 'transport ustunligi'],
      title: 'Tramvayning ustunligi',
      reply: `🚋 **Tramvay va boshqa transport o‘rtasidagi ustunlik:**\n\n` +
             `• Teng huquqli chorrahada, agar boshqa belgi bo‘lmasa, **relsli transport (tramvay) har doim ustunlikka ega**, tomonidan qat’i nazar.\n` +
             `• Tramvay yo‘lini kesib o‘tayotganda, uning tezligini va tormoz masofasini hisobga oling.\n\n` +
             `🚦 *Bu qoida ko‘pincha imtihon testlarida uchraydigan "tuzoq" savollardan biri!*`,
      actionUrl: '#testlar',
      actionLabel: 'Chorraha mavzusida mashq qilish'
    },
    {
      keywords: ['burilish', 'u aylanish', 'ortga qaytish', 'chapga burilish'],
      title: 'Chapga burilish va orqaga qaytish (U-burilish)',
      reply: `↩️ **Chapga burilish / orqaga qaytish qoidalari:**\n\n` +
             `• Chapga burilish yoki orqaga qaytishdan oldin, agar yo‘l bir necha qatorli bo‘lsa, eng chap qatordan harakatlaning va oldindan signal (chiroq) bering.\n` +
             `• Piyodalar o‘tish joyida, ko‘prikda, temir yo‘l kesishmasida va ko‘rinish yomon joylarda orqaga qaytish (U-burilish) **taqiqlanadi**.\n` +
             `• Chapga burilish taqiqlangan joyda, kerak bo‘lsa, "U-turn" o‘rniga uch marta o‘ngga burilib maqsadga erishish mumkin.\n\n` +
             `🔄 *Signal chiroqlarini o‘z vaqtida berish — boshqa haydovchilarni ogohlantirishning eng muhim usuli.*`,
      actionUrl: '#belgilar',
      actionLabel: 'Buyuruvchi belgilarni ko‘rish'
    },
    {
      keywords: ['telefon', 'mobil telefon', 'qo\'lda gaplashish'],
      title: 'Telefondan foydalanish qoidasi',
      reply: `📵 **Rulda telefondan foydalanish:**\n\n` +
             `• Harakat davomida telefonni **qo‘lda ushlab** gaplashish yoki matn yozish qat’iyan taqiqlanadi.\n` +
             `• Faqat "hands-free" (qo‘lni bandlamaydigan) tizim orqali gaplashishga ruxsat etiladi.\n` +
             `• Jarima: 3 BHM (1,125,000 so‘m) va 2 ball.\n\n` +
             `⚠️ *Rulda telefon — diqqatni eng ko‘p chalg‘itadigan omillardan biri hisoblanadi.*`,
      actionUrl: '#jarimalar',
      actionLabel: 'Barcha jarimalarni ko‘rish'
    },
    {
      keywords: ['ball', 'ball tizimi', 'guvohnomadan mahrum', 'huquqdan mahrum'],
      title: 'Jarima ball tizimi va guvohnomadan mahrum qilish',
      reply: `🎯 **Ball tizimi qanday ishlaydi:**\n\n` +
             `• Har bir qoidabuzarlik uchun ma’lum miqdorda **jarima ball** yoziladi (masalan, qizil chiroqqa o‘tish — 2 ball).\n` +
             `• Agar 1 yil ichida to‘plangan ball belgilangan chegaradan oshsa, haydovchilik huquqi **vaqtincha to‘xtatilishi** mumkin.\n` +
             `• Mast holda haydash kabi og‘ir buzilishlarda huquqdan bevosita 1.5–3 yilga mahrum qilinadi.\n\n` +
             `📊 *Ballaringizni nazorat qilish uchun ehtiyotkor haydash — eng yaxshi strategiya!*`,
      actionUrl: '#jarimalar',
      actionLabel: 'Jarima & Ball Kalkulyatori'
    },
    {
      keywords: ['nechta savol topshiraman', 'testda nechta savol', 'test qanday ishlaydi', 'mashq testi', 'imtihon rejimi'],
      title: 'Platformada testlar qanday ishlaydi',
      reply: `📝 **OSON PRAVA'da 2 xil test rejimi mavjud:**\n\n` +
             `1. **"Mashq testi" (Testlar bo‘limi):** Har bir savolga javob berganingizdan so‘ng, to‘g‘ri javob va batafsil izoh darhol ko‘rsatiladi — o‘rganish uchun ideal.\n` +
             `2. **"Davlat Imtihoni" rejimi:** 20 ta savol, 25 daqiqa vaqt, natija faqat oxirida chiqadi — rasmiy imtihonni to‘liq simulyatsiya qiladi.\n\n` +
             `🎯 *Avval "Mashq testi"da mustahkamlab, keyin "Imtihon" rejimida o‘zingizni sinab ko‘ring.*`,
      actionUrl: '#testlar',
      actionLabel: 'Mashq Testini Boshlash'
    },
    {
      keywords: ['natijalarim saqlanadimi', 'tarix saqlanadimi', 'o\'rganish tarixi', 'natijalar tarixi'],
      title: 'Natijalar va o‘rganish tarixi saqlanishi',
      reply: `💾 **Ha, barcha natijalaringiz saqlanadi!**\n\n` +
             `• Yechilgan barcha testlar, to‘plangan ballar, tugatilgan darslar va saqlangan belgilar brauzeringizning lokal xotirasida (localStorage) avtomatik saqlanadi.\n` +
             `• "Dashboard" va "Natijalar" bo‘limlarida progressingiz grafiklar orqali ko‘rsatiladi.\n\n` +
             `⚠️ *Eslatma: brauzer keshi/tarixi tozalansa, bu ma’lumotlar ham o‘chib ketishi mumkin — shuning uchun bir qurilmadan foydalanishni tavsiya qilamiz.*`,
      actionUrl: '#dashboard',
      actionLabel: 'Dashboardni ko‘rish'
    },
    {
      keywords: ['bepulmi', 'pullikmi', 'tolov', 'narxi', 'tarif', 'obuna'],
      title: 'OSON PRAVA’dan foydalanish narxi',
      reply: `🆓 **Ha, OSON PRAVA — bepul ijtimoiy-ta’limiy startap loyihasi!**\n\n` +
             `• Barcha nazariy darslar, yo‘l belgilari katalogi, mashq va imtihon testlari **hech qanday to‘lovsiz** ochiq.\n` +
             `• "PRO" tarif — qo‘shimcha shaxsiy AI tahlil va maxsus funksiyalar uchun ixtiyoriy taklif, lekin asosiy imtihonga tayyorgarlik uchun barchasi bepul.\n\n` +
             `💛 *Maqsadimiz — har bir yosh haydovchiga sifatli tayyorgarlikni ochiq qilish.*`,
      actionUrl: '#tariflar',
      actionLabel: 'Tariflarni ko‘rish'
    },
    {
      keywords: ['internetsiz', 'offline', 'internet bo\'lmaganda'],
      title: 'Internet bo‘lmaganda platforma ishlaydimi',
      reply: `📶 **Qisman ha!**\n\n` +
             `• OSON PRAVA yengil veb-arxitekturada qurilgan: sahifa bir marta yuklangach, ko‘p savollar, belgilar va sozlamalar brauzeringizda keshlanadi.\n` +
             `• Ammo yangi ma’lumotlarni yuklash, AI Murabbiy va sinxronizatsiya uchun internet aloqasi kerak bo‘ladi.\n\n` +
             `📲 *Eng barqaror tajriba uchun doimiy internet aloqasida foydalanishni tavsiya qilamiz.*`,
      actionUrl: '#faq',
      actionLabel: 'Ko‘proq savol-javoblar'
    },
    {
      keywords: ['svetofor', 'svetafor', 'strelka', 'qoshimcha seksiya', 'qo‘shimcha seksiya', 'yashil strelka', 'miltillovchi'],
      title: 'Svetofor signallari va qo‘shimcha seksiyalar',
      reply: `🚦 **Svetofor signallari va qo‘shimcha seksiyalar:**\n\n` +
             `• **Qizil va sariq:** Harakatlanish qat’iyan man etiladi.\n` +
             `• **Yashil:** Barcha yo‘nalishlarda harakatga ruxsat.\n` +
             `• **Miltillovchi yashil:** Ruxsat etilgan vaqt tugayotganini va tez orada sariq yonishini bildiradi.\n` +
             `• **Miltillovchi sariq:** Chorraha tartibga solinmaganini (tungi rejim yoki nosozlik) bildiradi — chorraha qoidalariga rioya qilinadi.\n` +
             `• **Qo‘shimcha yashil strelka:** Asosiy qizil bilan yonganida, burilishga ruxsat etiladi, ammo boshqa barcha yo‘nalishdagi transportga yo‘l berish SHART!`,
      detailedReply: `🚦 **Svetofor signallari, qo‘shimcha seksiyalar va qoidabuzarlik tahlili:**\n\n` +
             `1. **Asosiy qizil + Qo‘shimcha yashil strelka:**\n` +
             `   • Bu holatda sizga faqat strelka ko‘rsatgan tomonga burilishga ruxsat beriladi.\n` +
             `   • **Eng muhim shart:** Boshqa yo‘nalishlardan (yashil chiroqda) kelayotgan barcha avtomobillar va piyodalarga to‘liq yo‘l berishingiz shart!\n\n` +
             `2. **Sariq chiroq signali:**\n` +
             `   • Sariq chiroq ogohlantiruvchi emas, **taqiqlovchi** signal hisoblanadi!\n` +
             `   • Faqat favqulodda (keskin) tormoz bermasdan to‘xtash imkoni bo‘lmagan hollardagina to‘xtamasdan o‘tishga ruxsat etiladi.\n\n` +
             `3. **Miltillovchi sariq chiroq:**\n` +
             `   • Chorraha tartibga solinmagan holatga o‘tgan. Imtiyoz belgilari (2.1 "Asosiy yo‘l", 2.4 "Yo‘l bering") yoki "O‘ng qo‘l" qoidasi bo‘yicha harakatlaniladi.\n\n` +
             `⚖️ **Jarima:** Qizil yoki taqiqlovchi sariq chiroqqa o‘tish — 2 BHM (750,000 so‘m) va 2 jarima balli (MJtK 128-4-modda).`,
      actionUrl: '#simulyator',
      actionLabel: 'Chorraha simulyatorida sinab ko‘rish'
    },
    {
      keywords: ['tezlik', 'tezlik chegarasi', 'tezlik meyori', 'necha tezlik', 'aholi punkti', 'magistral', 'shahar tezlik', 'tezlik cheklovi'],
      title: 'Tezlik me’yorlari va hududiy cheklovlar',
      reply: `⚡ **O‘zbekistonda ruxsat etilgan tezlik me’yorlari:**\n\n` +
             `• **Aholi punktlarida (shahar/tuman markazlari):** 60 km/soatgacha.\n` +
             `• **Maktab va bog‘cha atrofi:** 30 km/soatgacha.\n` +
             `• **Turar-joy dahalari (hovlilar):** 20 km/soatgacha.\n` +
             `• **Aholi punktidan tashqarida:** 100 km/soatgacha (yengil avtomobillar).\n` +
             `• **Avtomagistrallarda:** 110 km/soatgacha.`,
      detailedReply: `⚡ **O‘zbekiston YHQ bo‘yicha tezlik me’yorlarining to‘liq tahlili:**\n\n` +
             `1. **Hududlar bo‘yicha ruxsat etilgan maksimal tezlik:**\n` +
             `   • **Aholi punktlarida:** Toshkent va viloyat markazlarida qat’iy **60 km/soat** (ilgari 70 km/s bo‘lgan).\n` +
             `   • **Maktab, litsey, bog‘chalar oldida:** Maxsus belgi bilan **30 km/soat** etib belgilangan.\n` +
             `   • **Turar-joy zonalari (daxalar, turar-joy hovlilari):** Maksimal **20 km/soat** — bu yerda piyodalar qatnov qismida ham ustunlikka ega!\n` +
             `   • **Umumiy foydalanishdagi yo‘llar (shahardan tashqari):** Yengil avtomobillar uchun **100 km/soat**.\n` +
             `   • **Avtomagistrallarda (5.1-belgi):** Yengil avtomobillar uchun **110 km/soat**, yuk transporti uchun 90 km/soat.\n\n` +
             `2. **Tezlikni oshirganlik uchun 2026-yilgi jarimalar (1 BHM = 375,000 so‘m):**\n` +
             `   • **+20 km/soatgacha:** 1 BHM (375,000 so‘m) | 1 ball\n` +
             `   • **+20 dan +40 km/soatgacha:** 5 BHM (1,875,000 so‘m) | 2 ball\n` +
             `   • **+40 km/soatdan ortiq:** 9 BHM (3,375,000 so‘m) | 3 ball\n` +
             `   • 1 yil ichida takroriy sodir etilsa: haydovchilik huquqidan mahrum qilishgacha!`,
      actionUrl: '#jarimalar',
      actionLabel: 'Tezlik jarimalarini hisoblash'
    },
    {
      keywords: ['tibbiy', 'tibbiy yordam', 'birinchi yordam', 'qon ketishi', 'jgut', 'suniy nafas', 'jarohat', 'yth', 'avariya'],
      title: 'Yo‘l-transport hodisasida birinchi tibbiy yordam',
      reply: `🩹 **YTHda birinchi tibbiy yordam ko‘rsatish qoidalari:**\n\n` +
             `1. **Xavfsizlikni ta’minlang:** Avariya signalini yoqing, avariya to‘xtash belgisini qo‘ying (aholi punktida 15m, tashqarida 30m).\n` +
             `2. **Tez yordam (103) chaqiring.**\n` +
             `3. **Qon ketishini to‘xtatish:** Arterial qon ketishida jarohatdan yuqoriga jgut qo‘yiladi (yozda 1 soat, qishda 30 daqiqa).\n` +
             `4. **Nafas yo‘llari:** Jabrlanuvchini ehtiyotkorlik bilan yonboshiga yotqizib, nafas yo‘llarini bo‘shating.`,
      detailedReply: `🩹 **YTHda birinchi tibbiy yordam ko‘rsatish algoritmi (Imtihon savollarida eng ko‘p tushadigan holatlar):**\n\n` +
             `1. **Kuchli arterial qon ketishini to‘xtatish:**\n` +
             `   • Qon ochiq qizil rangda va favvora bo‘lib otilib chiqadi.\n` +
             `   • **Jgut qo‘yish qoidasi:** Jarohatdan **yuqoriroqqa** (yurakka yaqin) mato ustidan qo‘yiladi.\n` +
             `   • **Maksimal vaqt:** Yozda ko‘pi bilan **1 soat**, qishda **30 daqiqa**! Vaqt yozilgan qog‘oz jgut ostiga qistirib qo‘yilishi shart, aks holda to‘qimalar nobud bo‘lishi (gangrena) xavfi bor.\n\n` +
             `2. **Yurak-o‘pka reanimatsiyasi (Sun’iy nafas va yurak massaji):**\n` +
             `   • Nisbat: **30 marta ko‘krak qafasini bosish** va **2 marta havo puflash** (30:2 standarti).\n` +
             `   • Ko‘krak qafasi 4-5 sm chuqurlikda bosiladi.\n\n` +
             `3. **Umurtqa pog‘onasi shikastlanganda:**\n` +
             `   • Jabrlanuvchini qat’iyan egish, burish yoki silkitish man etiladi — faqat qattiq tekis yuzada ehtiyotkorlik bilan harakatlantiriladi.\n\n` +
             `💡 *Barcha haydovchilar avtomobilida rasmiy tibbiy aptechka saqlashi majburiy!*`,
      actionUrl: '#testlar',
      actionLabel: 'Tibbiy yordam mavzusida test yechish'
    },
    {
      keywords: ['xalqaro prava', 'xalqaro guvohnoma', 'idp', 'chet elda haydash', 'xorijda', 'boshqa davlatda'],
      title: 'Xalqaro haydovchilik guvohnomasi (IDP)',
      reply: `🌐 **Xalqaro haydovchilik guvohnomasi (IDP) haqida:**\n\n` +
             `• O‘zbekistonning yangi plastik milliy guvohnomasi 1968-yilgi **Vena konvensiyasi** talablariga to‘liq javob beradi va 80 dan ortiq davlatda to‘g‘ridan-to‘g‘ri amal qiladi.\n` +
             `• Jeneva konvensiyasiga a’zo davlatlarda (masalan, AQSH, Yaponiya) qo‘shimcha **Xalqaro haydovchilik guvohnomasi (IDP)** talab qilinishi mumkin.\n` +
             `• IDP milliy guvohnomasiz mustaqil kuchga ega emas — har doim milliy prava bilan birga taqdim etiladi.`,
      detailedReply: `🌐 **Xalqaro va milliy haydovchilik guvohnomalari farqi va chet elda avto boshqarish:**\n\n` +
             `1. **Vena konvensiyasiga a’zo davlatlar (80 dan ortiq mamlakat):**\n` +
             `   • O‘zbekiston, Rossiya, Turkiya, Qozog‘iston, Germaniya, Fransiya, Italiya, BAA va boshqalar.\n` +
             `   • Bu davlatlarda O‘zbekistonning yangi namunadagi milliy plastik guvohnomasi (lotin yozuvidagi) qonuniy kuchga ega.\n\n` +
             `2. **Jeneva konvensiyasiga a’zo davlatlar:**\n` +
             `   • AQSH, Buyuk Britaniya, Kanada, Yaponiya, Avstraliya va h.k.\n` +
             `   • Bu davlatlarda avtomobil ijaraga olish yoki haydash uchun milliy guvohnomaga qo‘shimcha ravishda **International Driving Permit (IDP)** kerak bo‘ladi.\n\n` +
             `3. **Qanday olinadi:**\n` +
             `   • Imtihon qayta topshirilmaydi! Mavjud milliy guvohnoma asosida Yagona Davlat Xizmatlari Portali (my.gov.uz) orqali rasmiylashtiriladi. Amal qilish muddati: 3 yilgacha.`,
      actionUrl: '#darslar',
      actionLabel: 'Nazariy darslarni o‘rganish'
    },
    {
      keywords: ['qayrilib olish', 'u-turn', 'orqaga qaytish', 'u burilish', 'qayrilish'],
      title: 'Qayrilib olish (U-burilish) qoidalari',
      reply: `↩️ **Qayrilib olish qoidalari:**\n\n` +
             `• Qayrilib olish faqat eng chap qatnov qismidan (yoki ruxsat beruvchi belgi bo‘lsa) amalga oshiriladi.\n` +
             `• **Taqiqlangan joylar:** Piyodalar o‘tish joyida, tunnellarda, ko‘priklarda, temir yo‘l kesishmalarida va ko‘rinish masofasi 100 metrdan kam joylarda qayrilib olish qat’iyan taqiqlanadi.\n` +
             `• 3.18.2 "Chapga burilish taqiqlangan" belgisi qayrilib olishni **taqiqlamaydi**!`,
      detailedReply: `↩️ **Chorrahada va yo‘lda qayrilib olishning nozik qoidalari (Imtihondagi asosiy tuzoqlar):**\n\n` +
             `1. **Belgilarning ta’siri:**\n` +
             `   • **3.18.2 "Chapga burilish taqiqlanadi":** Bu belgi FAQAT chapga burilishni taqiqlaydi, **qayrilib olishga ruxsat beradi**!\n` +
             `   • **3.19 "Qayrilib olish taqiqlanadi":** Faqat orqaga qaytishni taqiqlaydi, lekin chapga burilishga ruxsat beradi.\n` +
             `   • **4.1.1 "To‘g‘riga harakat":** Ham chapga, ham qayrilib olishni taqiqlaydi.\n\n` +
             `2. **Qayerda qayrilib olish mutlaqo taqiqlanadi (YHQ 67-band):**\n` +
             `   • Piyodalar o‘tish joylarida (zebra ustida);\n` +
             `   • Tunnellarda, ko‘priklar, estakada va yo‘l o‘tkazgichlarda;\n` +
             `   • Temir yo‘l kesishmalarida;\n` +
             `   • Ko‘rinish masofasi biror yo‘nalishda 100 metrdan kam bo‘lgan joylarda;\n` +
             `   • Jamoat transporti to‘xtash bekatlarida.\n\n` +
             `⚖️ **Jarima:** Qayrilib olish qoidasini buzish — 0.5 BHM (187,500 so‘m) jarimaga sabab bo‘ladi.`,
      actionUrl: '#belgilar',
      actionLabel: 'Belgilar katalogida ko‘rish'
    },
    {
      keywords: ['texnik holat', 'nosozlik', 'tormoz', 'fara', 'nosoz mashina', 'haydash taqiqlangan nosozlik'],
      title: 'Harakatlanish taqiqlanadigan texnik nosozliklar',
      reply: `🔧 **Quyidagi 5 ta holatda avtomobil harakatlanishi mutlaqo taqiqlanadi:**\n\n` +
             `1. Ishchi tormoz tizimi ishlamasa.\n` +
             `2. Rul boshqaruvi ishlamasa.\n` +
             `3. Tirkama ulagich moslamasi nosoz bo‘lsa.\n` +
             `4. Qorong‘i vaqtda yoki ko‘rinish cheklangan sharoitda faralar va orqa gabarit chiroqlari yonmasa.\n` +
             `5. Yomg‘ir yoki qor yog‘ayotganda haydovchi tomonidagi oyna tozalagich (dvornik) ishlamasa.`,
      detailedReply: `🔧 **Avtomobil nosozliklari va ulardan foydalanish shartlari (YHQ Ilova):**\n\n` +
             `1. **Harakatlanish MUTLAQO taqiqlanadi (evakuator kerak):**\n` +
             `   • Ishchi tormoz ishlamay qolsa;\n` +
             `   • Rul boshqaruvi mexanizmi ishlamasa;\n` +
             `   • Qorong‘i vaqtda faralar yonmasa;\n` +
             `   • Yomg‘ir/qorda haydovchi tomonidagi oyna tozalagich ishlamasa.\n\n` +
             `2. **Tuzatish uchun ta’mirlash joyiga sekin borishga ruxsat etiladigan nosozliklar:**\n` +
             `   • Signal (tovush signali) ishlamasligi;\n` +
             `   • O‘ng tarafdagi oyna tozalagich ishlamasligi;\n` +
             `   • Spidometr ishlamay qolishi;\n` +
             `   • Glushitel (tovush so‘ndirgich) nosozligi.\n\n` +
             `⚖️ **Jarima:** Tormoz yoki rul nosoz transportni boshqarish — 5 BHM jarima va avtomobilni jarima maydonchasiga qo‘yish bilan jazolanadi!`,
      actionUrl: '#jarimalar',
      actionLabel: 'Jarimalar ro‘yxatini ko‘rish'
    }
  ];

  // Extra site/FAQ oriented KB, matched with a slightly looser scoring pass below
  const FAQ_KNOWLEDGE_BASE = [
    {
      keywords: ['imtihonda nechta xato', 'necha xato', 'nechta savolga to\'g\'ri', 'o\'tish balli', 'otish balli', "90%"],
      title: 'Imtihondan o‘tish uchun talab',
      reply: `✅ **Rasmiy standartlarga muvofiq:** 20 ta savoldan kamida **18 tasiga (90%)** to‘g‘ri javob bersangiz, imtihondan o‘tgan hisoblanasiz.\n\n` +
             `Ko‘pi bilan **2 ta xatoga** yo‘l qo‘yiladi — 3-xatoda imtihon avtomatik to‘xtatiladi.`,
      actionUrl: '#imtihon',
      actionLabel: 'Davlat Imtihonini Boshlash'
    },
    {
      keywords: ['darslarni qayta', 'takrorlash mumkinmi', 'qayta o\'qish'],
      title: 'Darslarni qayta o‘qish',
      reply: `🔁 **Albatta!** Barcha 10 ta dars va 30 dan ortiq qoida mavzulari istalgan vaqtda qayta o‘qish uchun ochiq. Cheklov yo‘q — xohlagancha takrorlang.`,
      actionUrl: '#darslar',
      actionLabel: 'Darslarga qaytish'
    },
    {
      keywords: ['bugungi mashq', 'kunlik maqsad', 'kunlik vazifa'],
      title: '"Bugungi mashq" nima beradi',
      reply: `🎯 **"Bugungi mashq"** har kuni sizga tasodifiy 10 ta eng muhim savolni yechishni taklif qiladi. Bu kunlik odat hosil qilib, bilimingizni doim yangilab turishga yordam beradi — imtihondan oldin eng samarali usul!`,
      actionUrl: '#testlar',
      actionLabel: 'Bugungi mashqni boshlash'
    },
    {
      keywords: ['sertifikat', 'rasmiy sertifikat', 'diplom'],
      title: 'Rasmiy sertifikat funksiyasi',
      reply: `🏅 Testlarni muvaffaqiyatli yakunlagach, profilingizdan **shaxsiy tayyorgarlik sertifikatini** yuklab olishingiz mumkin — bu rasmiy YHXBB hujjati emas, balki sizning platformadagi natijalaringizni tasdiqlovchi yodgorlik hujjatidir.`,
      actionUrl: '#profil',
      actionLabel: 'Sertifikatni ko‘rish'
    }
  ];
  KNOWLEDGE_BASE.push(...FAQ_KNOWLEDGE_BASE);

  // Default fallback answer
  const FALLBACK_RESPONSE = {
    title: 'Oson AI Murabbiy Maslahati',
    reply: `Assalomu alaykum! Men savolingizni tushundim. O‘zbekiston YHQ bo‘yicha quyidagi asosiy tavsiyalarga amal qilishni maslahat beraman:\n\n` +
           `1. **Yo‘lda doimo hushyor bo‘ling:** Tezlik me’yoriga rioya qiling va xavfsiz masofa (distansiya) saqlang.\n` +
           `2. **Chorrahalarda:** O‘ng tomondan kelayotgan transportga va piyodalarga ustunlik bering.\n` +
           `3. **Imtihonga tayyorgarlik:** Har kuni kamida 20 ta test yechib, xatolaringiz ustida ishlang.\n\n` +
           `Savolingizni aniqroq berishingiz mumkin: masalan, *"Chorrahada kim birinchi o‘tadi?"*, *"Radarga tushsam jarima qancha?"* yoki *"Aylanma harakat qoidasi"*.`,
    actionUrl: '#testlar',
    actionLabel: 'Mashq Testlarini Yechish'
  };

  // State
  let chatHistory = [];
  let isThinking = false;

  function init() {
    renderPresetChips();
    initChatHistory();
  }

  function initChatHistory() {
    chatHistory = [
      {
        sender: 'ai',
        time: getCurrentTime(),
        text: `Assalomu alaykum! Men **Oson AI Murabbiyman** 🤖\n\nHaydovchilik nazariyasi, yo‘l harakati qoidalari, chorrahalar, davlat imtihoni va jarimalar bo‘yicha istalgan savolingizga javob berishga tayyorman.\n\nQuyidagi tayyor savollardan birini tanlang yoki o‘z savolingizni yozing!`
      }
    ];
    renderMessages();
  }

  function getCurrentTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function renderPresetChips() {
    const chipsContainer = document.getElementById('ai-preset-chips');
    const pageChipsContainer = document.getElementById('ai-page-preset-chips');

    const chips = [
      { icon: '💡', text: 'Bu savolni tushuntir' },
      { icon: '❌', text: 'Nega mening javobim noto‘g‘ri?' },
      { icon: '📖', text: 'Qoidani sodda tushuntir' },
      { icon: '🚗', text: 'Misol keltir' },
      { icon: '🚦', text: 'Chorrahada kim birinchi o‘tadi?' },
      { icon: '⭕', text: 'Aylanma harakat (krug) qoidasi' },
      { icon: '⚖️', text: 'Radarga tushsam necha so‘m jarima?' },
      { icon: '🎓', text: 'Davlat imtihoni tartibi qanday?' }
    ];

    const html = chips.map(c => `
      <button type="button" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-all hover:border-blue-400 hover:text-blue-600 flex-shrink-0"
              onclick="window.OSON_AI.askPreset('${escapeQuote(c.text)}')">
        <span>${c.icon}</span>
        <span>${c.text}</span>
      </button>
    `).join('');

    if (chipsContainer) chipsContainer.innerHTML = html;
    if (pageChipsContainer) pageChipsContainer.innerHTML = html;
  }

  function escapeQuote(str) {
    return str.replace(/'/g, "\\'");
  }

  function formatMarkdown(text) {
    let out = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return out;
  }

  function renderMessages() {
    const listContainers = [
      document.getElementById('ai-chat-messages'),
      document.getElementById('ai-page-chat-messages')
    ];

    listContainers.forEach(container => {
      if (!container) return;

      container.innerHTML = chatHistory.map(msg => {
        const isUser = msg.sender === 'user';

        let actionButtonHtml = '';
        if (msg.actionUrl && msg.actionLabel) {
          actionButtonHtml = `
            <div class="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
              <a href="${msg.actionUrl}" 
                 onclick="window.OSON_AI.closeDrawer()"
                 class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all">
                <span>${msg.actionLabel}</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          `;
        }

        return `
          <div class="flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''} mb-3.5 animate-slide-up">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
              isUser
                ? 'bg-gradient-to-tr from-blue-600 to-blue-700 text-white'
                : 'bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white'
            }">
              <i class="fa-solid ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            
            <div class="max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
            }">
              <div class="prose prose-sm dark:prose-invert">
                ${formatMarkdown(msg.text)}
              </div>
              ${actionButtonHtml}
              <div class="mt-1 text-[10px] text-right opacity-60">
                ${msg.time}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Scroll to bottom
      container.scrollTop = container.scrollHeight;
    });
  }

  function showTypingIndicator() {
    const listContainers = [
      document.getElementById('ai-chat-messages'),
      document.getElementById('ai-page-chat-messages')
    ];

    listContainers.forEach(container => {
      if (!container) return;
      const id = 'typing-indicator-node';
      let node = container.querySelector('#' + id);
      if (!node) {
        node = document.createElement('div');
        node.id = id;
        node.className = 'flex items-center gap-2 mb-3.5';
        node.innerHTML = `
          <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div class="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        `;
        container.appendChild(node);
        container.scrollTop = container.scrollHeight;
      }
    });
  }

  function hideTypingIndicator() {
    document.querySelectorAll('#typing-indicator-node').forEach(node => node.remove());
  }

  // Context-aware dynamic response generator for various YHQ domains
  function getSmartFallback(cleanQuery, isComplex = false) {
    if (/jarima|radar|bhm|to.lash|summa|penya|shtraf|ball|12 ball/.test(cleanQuery)) {
      return {
        title: 'Jarima va qonunchilik ma’lumotlari',
        reply: `⚖️ **2026-yilgi jarimalar va ball tizimi bo‘yicha to‘liq huquqiy ma’lumot:**\n\n` +
               `• **Baza hisoblash miqdori (1 BHM):** 375,000 so‘m.\n` +
               `• **Tezlik me’yorlari:** +20 km/soatgacha — 1 BHM (375,000 so‘m, 1 ball); +20...+40 km/soat — 5 BHM (1,875,000 so‘m, 2 ball); +40 km/soatdan yuqori — 9 BHM (3,375,000 so‘m, 3 ball).\n` +
               `• **Qizil chiroqqa o‘tish:** 2 BHM (750,000 so‘m, 2 ball).\n` +
               `• **Qarama-qarshi yo‘nalish (vstrecha):** 10 BHM (3,750,000 so‘m, 4 ball).\n` +
               `• **15 kunlik 50% chegirma:** Jarima to‘g‘risidagi qaror chiqarilgan kundan boshlab 15 kalendar kun ichida to‘lansa, jarimaning roppa-rosa yarmi (50%) to‘lanadi.\n` +
               `• **12 ballik tizim:** 1 yil ichida 12 ball to‘plagan haydovchi sud qarori bilan haydovchilik huquqidan mahrum qilinadi.\n\n` +
               `💡 *Aniq hisob-kitob qilish uchun platformamizning **"Jarimalar"** bo‘limidagi kalkulyatordan foydalaning.*`,
        actionUrl: '#jarimalar',
        actionLabel: 'Jarimalar kalkulyatorini ochish'
      };
    }
    if (/tezlik|km\/s|km\/soat|aholi punkti|magistral|turar joy|maktab/.test(cleanQuery)) {
      return {
        title: 'Tezlik me’yorlari bo‘yicha to‘liq reglament',
        reply: `🚗 **O‘zbekiston YHQ bo‘yicha belgilangan maksimal tezlik me’yorlari:**\n\n` +
               `1. **Aholi punktlarida (shaharlar, qishloqlar):** maksimal **60 km/soat** (yengil avtomobillar va yuk mashinalari uchun).\n` +
               `2. **Maktab va bog‘chalar atrofida (08:00 - 18:00):** maksimal **30 km/soat**.\n` +
               `3. **Turar joy zonalari va hovlilarda (5.38 belgisi):** maksimal **20 km/soat** (piyodalar mutlaq ustun).\n` +
               `4. **Aholi punktidan tashqarida (umumiy yo‘llar):** yengil avtomobillarga **100 km/soat**, avtobus va tirkamali transportlarga **70-80 km/soat**.\n` +
               `5. **Avtomagistrallarda (5.1 belgisi):** maksimal **110 km/soat**.\n\n` +
               `Radar xatolik hisobi: amaldagi qoidalarga ko‘ra tezlik me’yoridan +5 km/soatgacha oshirilganda jarima qo‘llanilmaydi.`,
        actionUrl: '#darslar',
        actionLabel: 'Tezlik darsini o‘qish'
      };
    }
    if (/chorraha|o.ng qo.l|tramvay|asosiy yo.l|imtiyoz|yo.l bering|stop|burilish|kim birinchi/.test(cleanQuery)) {
      return {
        title: 'Chorrahada o‘tish va imtiyoz qoidalari',
        reply: `🚦 **Chorrahadan o‘tish tartibi — Bosqichma-bosqich qo‘llanma:**\n\n` +
               `1. **Svetofor va tartibga soluvchi ustunligi:** Ishlayotgan svetofor imtiyoz belgilarini (2.1, 2.4, 2.5) bekor qiladi!\n` +
               `2. **Asosiy va ikkinchi darajali yo‘llar:** 2.1 ("Asosiy yo‘l")dagilar birinchi, 2.4 ("Yo‘l bering") yoki 2.5 ("STOP")dagilar keyin o‘tadi.\n` +
               `3. **Teng huquqli chorraha («O‘ng qo‘l» qoidasi):** O‘ng tomondan kelayotgan transportga yo‘l beriladi. O‘ng tomoni bo‘sh bo‘lgan haydovchi birinchi o‘tadi.\n` +
               `4. **Relsli transport (Tramvay):** Teng huquqli sharoitda tramvay harakat yo‘nalishidan qat’i nazar (to‘g‘riga yoki burilayotgan bo‘lsa ham) doimo ustundir!\n` +
               `5. **Chapga burilish qoidasi:** Yashil chiroqda chapga burilayotgan transport qarama-qarshi tomondan to‘g‘riga va o‘ngga ketayotganlarga yo‘l berishi shart.\n\n` +
               `💡 *Har bir holatni 2D interaktiv chorraha simulyatorimizda sinab ko‘ring!*`,
        actionUrl: '#simulyator',
        actionLabel: 'Chorraha Simulyatorini Ochish'
      };
    }
    if (/krug|aylanma|halqa|doira/.test(cleanQuery)) {
      return {
        title: 'Aylanma harakat (4.3) qoidasi',
        reply: `⭕ **Aylanma harakat chorrahasi (4.3) bo‘yicha qat’iy qoidalar:**\n\n` +
               `• **Ustunlik:** Aylanada harakatlanayotgan transport vositasi aylanaga kirib kelayotgan barcha transportga nisbatan mutlaq ustunlikka ega.\n` +
               `• **Kirish:** Aylanaga istalgan qatordan kirish mumkin, chap burilish chirog‘ini yoqish talab etilmaydi.\n` +
               `• **Chiqish (Imtihonda muhim!):** Aylanadan chiqish FAQAT o‘ng chekka qatordan, o‘ng burilish chirog‘ini yoqqan holda amalga oshiriladi.\n\n` +
               `💡 *Simulyatorimizda aylanma harakat stsenariysini (#3) amalda sinab ko‘ring.*`,
        actionUrl: '#simulyator',
        actionLabel: 'Simulyatorda mashq qilish'
      };
    }
    if (/tibbiy|yordam|sos|qon|jgut|cpr|reanimatsiya|singan|shina/.test(cleanQuery)) {
      return {
        title: 'Birinchi tibbiy yordam ko‘rsatish standartlari',
        reply: `🏥 **Imtihon va favqulodda vaziyatlarda birinchi tibbiy yordam:**\n\n` +
               `• **CPR (Yurak-o‘pka reanimatsiyasi):** 30 marta ko‘krakni bosish va 2 marta sun’iy nafas (30:2), 5-6 sm chuqurlikda, daqiqasiga 100-120 marta.\n` +
               `• **Arterial qon ketishida jgut:** Jarohatdan yuqoriroqqa qo‘yiladi. Yozda ko‘pi bilan 1 soat, qishda 30 daqiqa (vaqti yozilgan qog‘oz qistiriladi).\n` +
               `• **Singan suyaklar:** Singan joyga qo‘shni kamida 2 ta bo‘g‘im harakatsizlantiriladi (shina qo‘yiladi).\n` +
               `• **Shoshilinch raqamlar:** 102 — IIB/YPX, 103 — Tez yordam, 101 — Yong‘in xavfsizligi, 1050 — FVV Qutqaruv.`,
        actionUrl: '#darslar',
        actionLabel: 'Tibbiy yordam mavzusini o‘rganish'
      };
    }
    if (/imtihon|test|bilet|savol|xato|o.tish|ball|shikoyat/.test(cleanQuery)) {
      return {
        title: 'Imtihon va testlar haqida ma’lumot',
        reply: `🎓 **Davlat nazariy imtihoniga tayyorgarlik bo‘yicha maslahat:**\n\n` +
               `• Davlat imtihonida jami **20 ta savol** beriladi va **25 daqiqa** vaqt ajratiladi.\n` +
               `• Muvaffaqiyatli o‘tish uchun kamida **18 ta to‘g‘ri javob (90%)** to‘plash shart.\n` +
               `• Ko‘pi bilan **2 ta xatoga** ruxsat etiladi (3-xatoda imtihon to‘xtatiladi).\n\n` +
               `Bilimingizni sinash uchun platformamizdagi **"Davlat Imtihoni"** yoki **"Mashq Testlari"** bo‘limiga o‘ting!`,
        actionUrl: '#imtihon',
        actionLabel: 'Davlat Imtihonini Boshlash'
      };
    }
    if (/belgi|chiziq|taqiq|svetofor|chiroq|strelka/.test(cleanQuery)) {
      return {
        title: 'Yo‘l belgilari va svetofor qoidalari',
        reply: `🛑 **Yo‘l belgilari va svetofor qoidalari:**\n\n` +
               `• Barcha 26 ta rasmiy yo‘l belgisini interaktiv ko‘rish uchun **"Belgilar"** bo‘limimizga o‘ting.\n` +
               `• Belgilar 7 ta guruhga bo‘linadi: Ogohlantiruvchi, Imtiyoz, Taqiqlovchi, Buyuruvchi, Axborot-ko‘rsatkich, Servis va Qo‘shimcha.\n` +
               `• Svetoforning asosiy qizil chirog‘i bilan yonuvchi qo‘shimcha yashil strelka boshqalarga yo‘l berib burilishga ruxsat etadi.`,
        actionUrl: '#belgilar',
        actionLabel: 'Belgilar katalogini ochish'
      };
    }
    if (/dars|o.rganish|qoida|nazariya|yhq|boshlash/.test(cleanQuery)) {
      return {
        title: 'Nazariy darslar bo‘yicha yo‘l-yo‘riq',
        reply: `📚 **Haydovchilik nazariyasi bo‘yicha tavsiya:**\n\n` +
               `• Platformamizda 10 ta maxsus tayyorlangan nazariy dars mavjud bo‘lib, ular imtihonga noldan tayyorlaydi.\n` +
               `• Har bir dars oxirida mustahkamlash savollari va qoida moddalari keltirilgan.\n\n` +
               `Barcha darslarni ko‘rish uchun **"Darslar"** bo‘limiga o‘ting!`,
        actionUrl: '#darslar',
        actionLabel: 'Darslar bo‘limiga o‘tish'
      };
    }

    return {
      title: 'Oson AI Murabbiy Tushuntirishi',
      reply: `🤖 **Yo‘l harakati qoidalari bo‘yicha tavsiya:**\n\n` +
             `Savolingiz bo‘yicha asosiy qoidalar:\n` +
             `1. **Harakat xavfsizligi:** Tezlik me’yoriga rioya qiling va ob-havo sharoitiga qarab masofa (distansiya) saqlang.\n` +
             `2. **Ustunlik qoidalari:** Teng huquqli chorrahalarda «O‘ng qo‘l qoidasi»ga, aylanma harakatda doiradagi transportga, relsli yo‘llarda esa tramvayga ustunlik bering.\n` +
             `3. **Imtihon strategiyasi:** 20 ta savoldan kamida 18 tasini to‘g‘ri topish uchun har kuni platformada 2-3 ta test yechib boring.\n\n` +
             `*Savolingizni aniqroq berishingiz mumkin: masalan, "Chorrahada kim birinchi o‘tadi?", "Aylanma harakat qoidasi", "Tezlik me’yorlari" yoki "Jarimalar miqdori".*`,
      actionUrl: '#testlar',
      actionLabel: 'Mashq Testlarini Yechish'
    };
  }

  // Handle user submit query via real-time conversational AI API
  async function processUserQuery(query) {
    if (!query || query.trim() === '' || isThinking) return;

    const trimmedQuery = query.trim();

    // Add user message to history
    chatHistory.push({
      sender: 'user',
      time: getCurrentTime(),
      text: trimmedQuery
    });

    renderMessages();
    showTypingIndicator();
    isThinking = true;

    if (window.OSON_SOUND) window.OSON_SOUND.playClick();

    // Collect conversation history context
    const recentHistory = chatHistory.slice(-8).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    const userState = {
      isAuthenticated: window.OSON_AUTH?.isAuthenticated?.() || false,
      name: window.OSON_AUTH?.getUser?.()?.name || null,
      testsCount: (window.OSON_STORAGE?.getTestHistory?.() || []).length
    };

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          query: trimmedQuery,
          history: recentHistory,
          userState: userState
        })
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();

      hideTypingIndicator();
      isThinking = false;

      if (data && data.success && data.text) {
        chatHistory.push({
          sender: 'ai',
          time: getCurrentTime(),
          text: data.text,
          actionUrl: data.actionUrl || null,
          actionLabel: data.actionLabel || null
        });
      } else {
        throw new Error(data?.error || 'AI javobi olinmadi');
      }

      renderMessages();
      if (window.OSON_SOUND) window.OSON_SOUND.playCorrect();

    } catch (networkOrApiErr) {
      console.warn('AI API ulanishida xatolik, lokal fallback ishga tushirildi:', networkOrApiErr);
      hideTypingIndicator();
      isThinking = false;

      // Graceful technical failure fallback
      const smartFallback = getSmartFallback(trimmedQuery.toLowerCase().replace(/[\u2018\u2019`]/g, "'"), true);
      chatHistory.push({
        sender: 'ai',
        time: getCurrentTime(),
        text: smartFallback.reply,
        actionUrl: smartFallback.actionUrl || null,
        actionLabel: smartFallback.actionLabel || null
      });

      renderMessages();
      if (window.OSON_SOUND) window.OSON_SOUND.playCorrect();
    }
  }

  function askPreset(question) {
    processUserQuery(question);
  }

  function handleUserSubmit(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const val = input.value.trim();
    if (val) {
      processUserQuery(val);
      input.value = '';
    }
  }

  // Drawer modal controls
  function openDrawer() {
    const drawer = document.getElementById('ai-tutor-drawer');
    const overlay = document.getElementById('ai-tutor-overlay');
    if (drawer) {
      drawer.classList.remove('translate-x-full');
      drawer.classList.remove('hidden');
    }
    if (overlay) overlay.classList.remove('hidden');
    if (typeof window.lockBodyScroll === 'function') window.lockBodyScroll();
    if (window.OSON_SOUND) window.OSON_SOUND.playClick();
  }

  function closeDrawer() {
    const drawer = document.getElementById('ai-tutor-drawer');
    const overlay = document.getElementById('ai-tutor-overlay');
    if (drawer) drawer.classList.add('translate-x-full');
    if (overlay) overlay.classList.add('hidden');
    if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll();
  }

  function toggleDrawer() {
    const drawer = document.getElementById('ai-tutor-drawer');
    if (drawer && drawer.classList.contains('translate-x-full')) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }

  function askAboutQuestion(questionText, explanation, userChoice) {
    openDrawer();
    let prompt = `Savol: "${questionText}".`;
    if (userChoice) {
      prompt += ` Mening javobim: "${userChoice}".`;
    }
    if (explanation) {
      prompt += ` Qoidaning rasmiy izohi: "${explanation}".`;
    }
    prompt += ` Iltimos, nega bu javob noto‘g‘ri bo‘lganini va qoidani sodda so‘zlar bilan tushuntirib bering hamda misol keltiring.`;
    setTimeout(() => {
      processUserQuery(prompt);
    }, 300);
  }

  // Public API
  window.OSON_AI = {
    init: init,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    toggleDrawer: toggleDrawer,
    askPreset: askPreset,
    askAboutQuestion: askAboutQuestion,
    handleUserSubmit: handleUserSubmit,
    processQuery: processUserQuery
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
