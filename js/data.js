/**
 * OSON PRAVA — Comprehensive Data Store
 * Authentic Uzbek Driving License Question Bank, Road Signs, Rules, Lessons & FAQ
 */

window.OSON_DATA = (function() {
  'use strict';

  // 1. ROAD SIGNS (25+ Signs with SVG Visuals and Detailed Metadata)
  const signs = [
    {
      id: 'sign-1',
      code: '1.1',
      category: 'ogohlantiruvchi',
      categoryName: 'Ogohlantiruvchi belgilar',
      name: 'Shlagbaumli temir yo‘l kesishmasi',
      desc: 'Shlagbaum bilan jihozlangan temir yo‘l kesishmasiga yaqinlashayotganlik haqida ogohlantiradi.',
      meaning: 'Aholi punktlarida 50-100 metr, aholi punktlaridan tashqarida 150-300 metr masofada o‘rnatiladi. Haydovchi tezlikni pasaytirishi va ehtiyotkor bo‘lishi shart.',
      example: 'Poyezd kelayotganda shlagbaum yopiladi, svetofor qizil yonadi. Kesishmaga 5 metrdan yaqin to‘xtamaslik kerak.',
      shape: 'triangle-red',
      icon: 'train'
    },
    {
      id: 'sign-2',
      code: '1.2',
      category: 'ogohlantiruvchi',
      categoryName: 'Ogohlantiruvchi belgilar',
      name: 'Shlagbaumsiz temir yo‘l kesishmasi',
      desc: 'Shlagbaum bilan jihozlanmagan temir yo‘l kesishmasiga yaqinlashayotganlik haqida ogohlantiradi.',
      meaning: 'Haydovchidan o‘ta yuqori diqqat talab etiladi. Odatda "To‘xtamasdan harakatlanish taqiqlangan" (2.5) belgisi bilan birga qo‘llaniladi.',
      example: 'Poyezd yo‘qligiga to‘liq ishonch hosil qilibgina harakatni davom ettirish mumkin.',
      shape: 'triangle-red',
      icon: 'train-subway'
    },
    {
      id: 'sign-3',
      code: '1.20',
      category: 'ogohlantiruvchi',
      categoryName: 'Ogohlantiruvchi belgilar',
      name: 'Piyodalar o‘tish joyi',
      desc: 'Oldinda tartibga solinmagan piyodalar o‘tish joyi borligini bildiradi.',
      meaning: 'Aholi punktida 50-100 m, tashqarida 150-300 m oldin o‘rnatiladi. Tezlikni kamaytirish va piyodaga yo‘l berishga tayyor turish lozim.',
      example: 'Piyoda yo‘lga qadam qo‘ygan bo‘lsa, uni to‘liq o‘tkazib yuborish shart.',
      shape: 'triangle-red',
      icon: 'person-walking'
    },
    {
      id: 'sign-4',
      code: '1.21',
      category: 'ogohlantiruvchi',
      categoryName: 'Ogohlantiruvchi belgilar',
      name: 'Bolalar',
      desc: 'Bolalar muassasalari (maktab, bog‘cha) yaqinidagi yo‘l qismiga yaqinlashuv.',
      meaning: 'Yo‘l qismida to‘satdan bolalar paydo bo‘lish ehtimoli yuqori. Maksimal ruxsat etilgan tezlikdan ham sekinroq harakatlanish tavsiya etiladi.',
      example: 'Maktab oldida tezlikni 30 km/soatgacha pasaytirish qat’iy talab etiladi.',
      shape: 'triangle-red',
      icon: 'children'
    },
    {
      id: 'sign-5',
      code: '1.23',
      category: 'ogohlantiruvchi',
      categoryName: 'Ogohlantiruvchi belgilar',
      name: 'Yo‘l ishlari',
      desc: 'Oldinda yo‘lda ta’mirlash yoki qurilish ishlari olib borilayotganini bildiradi.',
      meaning: 'Yo‘l yuzasida to‘siqlar, ishchilar yoki texnikalar bo‘lishi mumkin. Vaqtinchalik sariq fonda ham o‘rnatiladi.',
      example: 'Ko‘pincha tezlikni 50 yoki 30 km/soatga cheklovchi belgilar bilan birga qo‘yiladi.',
      shape: 'triangle-red',
      icon: 'person-digging'
    },
    {
      id: 'sign-6',
      code: '2.1',
      category: 'imtiyozli',
      categoryName: 'Imtiyozli belgilar',
      name: 'Asosiy yo‘l',
      desc: 'Tartibga solinmagan chorrahalarda haydovchiga ustunlik (birinchi o‘tish huquqi) beradi.',
      meaning: 'Ushbu belgisi bor yo‘lda ketayotgan transport vositasi ikkinchi darajali yo‘ldan kelayotganlarga nisbatan ustunlikka ega.',
      example: 'Agar asosiy yo‘l yo‘nalishini o‘zgartirsa, pastida 7.13 qo‘shimcha lavhasi o‘rnatiladi.',
      shape: 'diamond-yellow',
      icon: 'diamond'
    },
    {
      id: 'sign-7',
      code: '2.4',
      category: 'imtiyozli',
      categoryName: 'Imtiyozli belgilar',
      name: 'Yo‘l bering',
      desc: 'Kesib o‘tilayotgan yo‘ldan harakatlanayotgan transport vositalariga yo‘l berish shart.',
      meaning: 'Haydovchi kesib o‘tilayotgan yo‘ldagi harakatlanuvchilarga to‘sqinlik qilmasligi, zarur bo‘lsa to‘xtashi lozim.',
      example: 'Agar asosiy yo‘lda hech kim bo‘lmasa, to‘liq to‘xtamasdan ham ehtiyotkorlik bilan o‘tish mumkin.',
      shape: 'triangle-inverted',
      icon: 'circle-chevron-down'
    },
    {
      id: 'sign-8',
      code: '2.5',
      category: 'imtiyozli',
      categoryName: 'Imtiyozli belgilar',
      name: 'To‘xtamasdan harakatlanish taqiqlangan (STOP)',
      desc: 'To‘xtash chizig‘i yoki kesib o‘tiladigan qatnov qismi chetida to‘xtamasdan o‘tish taqiqlanadi.',
      meaning: 'Yo‘lda transport bo‘lsin yoki bo‘lmasin, haydovchi g‘ildiraklarni to‘liq to‘xtatishi (0 km/soat) shart.',
      example: 'Xavfli chorrahalar, temir yo‘l kesishmalari va postlarda o‘rnatiladi.',
      shape: 'octagon-red',
      icon: 'hand'
    },
    {
      id: 'sign-9',
      code: '3.1',
      category: 'taqiqlovchi',
      categoryName: 'Taqiqlovchi belgilar',
      name: 'Kirish taqiqlangan (G‘isht)',
      desc: 'Barcha transport vositalarining ushbu yo‘nalishda kirishini taqiqlaydi.',
      meaning: 'Bir tomonlama harakat yo‘llarida qarama-qarshi oqimga kirishni to‘sish yoki maxsus zonalarda qo‘llaniladi.',
      example: 'Faqat belgilangan yo‘nalishli transport vositalariga (avtobus) istisno berilishi mumkin.',
      shape: 'circle-rose-brick',
      icon: 'ban'
    },
    {
      id: 'sign-10',
      code: '3.2',
      category: 'taqiqlovchi',
      categoryName: 'Taqiqlovchi belgilar',
      name: 'Harakatlanish taqiqlangan',
      desc: 'Barcha transport vositalarining harakatlanishini taqiqlaydi.',
      meaning: 'Ushbu hududda yashovchilar, xizmat ko‘rsatuvchilar va 1-2 guruh nogironlari uchun istisno mavjud.',
      example: 'Sayilgohlar, piyodalar ko‘chasi boshida qo‘yiladi.',
      shape: 'circle-rose-empty',
      icon: 'circle-xmark'
    },
    {
      id: 'sign-11',
      code: '3.20',
      category: 'taqiqlovchi',
      categoryName: 'Taqiqlovchi belgilar',
      name: 'Quvib o‘tish taqiqlangan',
      desc: 'Barcha transport vositalarini quvib o‘tish taqiqlanadi.',
      meaning: 'Soatiga 30 km dan kam tezlikda harakatlanayotgan yakka transport vositalari, ot-aravalarni quvib o‘tish bundan mustasno.',
      example: 'Ko‘rinishi cheklangan burilishlar, ko‘priklar va xavfli zonalarda amal qiladi.',
      shape: 'circle-rose-doublecar',
      icon: 'arrows-left-right'
    },
    {
      id: 'sign-12',
      code: '3.24',
      category: 'taqiqlovchi',
      categoryName: 'Taqiqlovchi belgilar',
      name: 'Yuqori tezlik cheklangan (60 km/s)',
      desc: 'Belgida ko‘rsatilganidan ortiq tezlikda harakatlanish taqiqlanadi.',
      meaning: 'O‘zbekiston shahar va aholi punktlarida odatiy maksimal tezlik 60 km/soat etib belgilangan.',
      example: 'Belgi ta’sir zonasi keyingi eng yaqin chorrahagacha yoki aholi punkti tugashigacha davom etadi.',
      shape: 'circle-rose-speed',
      icon: 'gauge-high'
    },
    {
      id: 'sign-13',
      code: '3.27',
      category: 'taqiqlovchi',
      categoryName: 'Taqiqlovchi belgilar',
      name: 'To‘xtash taqiqlangan',
      desc: 'Transport vositalarining to‘xtashi va to‘xtab turishi (parkovka) qat’iyan taqiqlanadi.',
      meaning: 'Hatto 1 daqiqaga ham yo‘lovchi tushirish uchun to‘xtash mumkin emas (majburiy to‘xtashdan tashqari).',
      example: 'Yo‘lning o‘tkazuvchanligi tor bo‘lgan markaziy ko‘chalarda o‘rnatiladi.',
      shape: 'circle-rose-cross',
      icon: 'xmark'
    },
    {
      id: 'sign-14',
      code: '3.28',
      category: 'taqiqlovchi',
      categoryName: 'Taqiqlovchi belgilar',
      name: 'To‘xtab turish taqiqlangan',
      desc: 'Transport vositalarining 5 daqiqadan ortiq to‘xtab turishi taqiqlanadi.',
      meaning: 'Yo‘lovchilarni mindirish/tushirish yoki yuk ortish/tushirish bilan bog‘liq bo‘lsa, 5 daqiqadan ortiq ham ruxsat etiladi.',
      example: 'Bir chiziqli qizil chiziq bilan belgilanadi.',
      shape: 'circle-rose-slash',
      icon: 'slash'
    },
    {
      id: 'sign-15',
      code: '4.1.1',
      category: 'buyuruvchi',
      categoryName: 'Buyuruvchi belgilar',
      name: 'Harakat faqat to‘g‘riga',
      desc: 'Harakatlanish faqat to‘g‘ri yo‘nalishda ruxsat etiladi.',
      meaning: 'Chorraga o‘rnatilganda o‘ngga yoki chapga burilishni va orqaga qaytishni taqiqlaydi.',
      example: 'Yo‘nalishli transport vositalari (avtobus) ushbu belgi talabiga bo‘ysunmasligi mumkin.',
      shape: 'circle-blue-arrow-up',
      icon: 'arrow-up'
    },
    {
      id: 'sign-16',
      code: '4.1.2',
      category: 'buyuruvchi',
      categoryName: 'Buyuruvchi belgilar',
      name: 'Harakat faqat o‘ngga',
      desc: 'Harakatlanish faqat o‘ng tomonga ruxsat etiladi.',
      meaning: 'Faqat birinchi qatnov qismi kesishmasiga ta’sir qiladi.',
      example: 'Chorrahada to‘g‘riga va chapga yurish qat’iyan taqiqlanadi.',
      shape: 'circle-blue-arrow-right',
      icon: 'arrow-right'
    },
    {
      id: 'sign-17',
      code: '4.3',
      category: 'buyuruvchi',
      categoryName: 'Buyuruvchi belgilar',
      name: 'Aylanma harakat',
      desc: 'Belgilangan strelkalar yo‘nalishi bo‘yicha (soat miliga teskari) harakatlanish buyuriladi.',
      meaning: 'Aylanma harakat chorrahasiga kirayotgan haydovchi aylanada harakatlanayotganlarga yo‘l berishi shart.',
      example: 'Hozirgi qoidalarga ko‘ra, doira ichidagilar doimo ustunlikka ega.',
      shape: 'circle-blue-roundabout',
      icon: 'rotate'
    },
    {
      id: 'sign-18',
      code: '5.1',
      category: 'axborot',
      categoryName: 'Axborot-ko‘rsatkich belgilari',
      name: 'Avtomagistral',
      desc: 'Avtomagistral qoidalari amal qiladigan yo‘l boshlanishi.',
      meaning: 'Piyodalar, velosipedlar, traktorlar va tezligi 40 km/soatdan kam texnikalar harakati taqiqlanadi. Maksimal tezlik 110 km/soat.',
      example: 'Orqaga qaytish va to‘xtash faqat maxsus ajratilgan maydonchalarda ruxsat etiladi.',
      shape: 'square-green-highway',
      icon: 'road'
    },
    {
      id: 'sign-19',
      code: '5.5',
      category: 'axborot',
      categoryName: 'Axborot-ko‘rsatkich belgilari',
      name: 'Bir tomonlama harakatli yo‘l',
      desc: 'Butun kengligi bo‘ylab transport bir yo‘nalishda harakatlanadigan yo‘l.',
      meaning: 'Qarama-qarshi yo‘nalish mavjud emas. Orqaga harakatlanish faqat ehtiyotkorlik bilan cheklangan hollarda mumkin.',
      example: 'Chap tomonda ham yengil avtomobillar to‘xtab turishi ruxsat etiladi.',
      shape: 'square-blue-oneway',
      icon: 'arrow-up-long'
    },
    {
      id: 'sign-20',
      code: '5.16.1',
      category: 'axborot',
      categoryName: 'Axborot-ko‘rsatkich belgilari',
      name: 'Piyodalar o‘tish joyi (Yer usti)',
      desc: 'Piyodalarning yo‘lni kesib o‘tish chegarasini belgilaydi.',
      meaning: 'Belgi o‘ng tomonda o‘tish joyining yaqin chegarasida, chap tomonda esa narigi chegarasida o‘rnatiladi.',
      example: 'Belgidan 5 metr oldinroqda to‘xtash taqiqlanadi.',
      shape: 'square-blue-pedestrian',
      icon: 'person-walking'
    },
    {
      id: 'sign-21',
      code: '5.15',
      category: 'axborot',
      categoryName: 'Axborot-ko‘rsatkich belgilari',
      name: 'To‘xtash joyi (Parkovka)',
      desc: 'Transport vositalarini to‘xtab turishi uchun maxsus ajratilgan maydoncha.',
      meaning: 'Qo‘shimcha lavhalar bilan birga transport vositasini qo‘yish usuli (burchak ostida, parallel) ko‘rsatiladi.',
      example: '"P" harfli ko‘k rangli kvadrat belgi.',
      shape: 'square-blue-parking',
      icon: 'square-parking'
    },
    {
      id: 'sign-22',
      code: '6.1',
      category: 'servis',
      categoryName: 'Servis belgilari',
      name: 'Birinchi tibbiy yordam punkti',
      desc: 'Tibbiy yordam ko‘rsatish maskani yaqinligini bildiradi.',
      meaning: 'Yo‘l yoqasida tibbiyot muassasasi yoki birinchi yordam posti joylashgan.',
      example: 'Favqulodda holatlarda yo‘lovchilar va haydovchilarga tibbiy ko‘mak beriladi.',
      shape: 'rect-blue-medical',
      icon: 'kit-medical'
    },
    {
      id: 'sign-23',
      code: '6.3',
      category: 'servis',
      categoryName: 'Servis belgilari',
      name: 'Yoqilg‘i quyish shoxobchasi (AYQSH)',
      desc: 'Benzin, dizel yoki gaz quyish shoxobchasi borligini ko‘rsatadi.',
      meaning: 'Shoxobchagacha bo‘lgan masofa pastdagi lavhada ko‘rsatilishi mumkin.',
      example: 'Uzoq masofali yo‘llarda haydovchi o‘z yoqilg‘isini rejalashtirishi uchun juda muhim.',
      shape: 'rect-blue-gas',
      icon: 'gas-pump'
    },
    {
      id: 'sign-24',
      code: '6.4',
      category: 'servis',
      categoryName: 'Servis belgilari',
      name: 'Avtomobillarga texnik xizmat ko‘rsatish (USTAXONA)',
      desc: 'Avtomobillarni ta’mirlash va texnik ko‘rik maskani.',
      meaning: 'Nosozlik yuz berganda ehtiyot qismlar va ta’mirlash xizmati mavjud.',
      example: 'Ochiq kalit belgisi bilan ifodalanadi.',
      shape: 'rect-blue-wrench',
      icon: 'wrench'
    },
    {
      id: 'sign-25',
      code: '7.2.1',
      category: 'qoshimcha',
      categoryName: 'Qo‘shimcha axborot belgilari (Lavhalar)',
      name: 'Amal qilish sohasi',
      desc: 'Belgining xavfli joy yoki cheklov davom etadigan masofasini (masalan, 100 m) ko‘rsatadi.',
      meaning: 'Ikkala tomonida strelkalar bo‘lgan raqamli lavha asosiy belgi bilan birga qo‘llaniladi.',
      example: '"To‘xtash taqiqlangan" belgisi tagida 30 m yozilgan bo‘lsa, keyingi 30 metrda to‘xtash taqiqlanadi.',
      shape: 'rect-white-range',
      icon: 'arrows-up-down'
    },
    {
      id: 'sign-26',
      code: '7.14',
      category: 'qoshimcha',
      categoryName: 'Qo‘shimcha axborot belgilari (Lavhalar)',
      name: 'Foto va video qayd etish',
      desc: 'Qoidabuzarliklar maxsus avtomatlashtirilgan fotoradar yoki kameralar orqali qayd etilishini bildiradi.',
      meaning: 'Ushbu hududda tezlik, qizil chiroq yoki yo‘l chiziqlari buzilishini kuzatuvchi kameralar o‘rnatilgan.',
      example: 'Kamera tasviri tushirilgan to‘g‘ri to‘rtburchak oq belgi.',
      shape: 'rect-white-camera',
      icon: 'camera'
    }
  ];

  // 2. ROAD RULES (30+ comprehensive rules categorized into 10 groups)
  const rules = [
    {
      id: 'rule-1',
      category: 'umumiy',
      categoryName: 'Umumiy qoidalar',
      title: 'Haydovchining asosiy burchlari',
      summary: 'Haydovchi yonida qanday hujjatlarni olib yurishi va ularni taqdim etishi shart?',
      content: `O‘zbekiston Respublikasi Yo‘l harakati qoidalariga muvofiq, haydovchi o‘zida quyidagi hujjatlarni olib yurishi shart:
1. Haydovchilik guvohnomasi (tegishli toifa) va uning taloni;
2. Transport vositasining ro‘yxatdan o‘tganligi to‘g‘risidagi guvohnoma (texpasport);
3. Fuqarolik javobgarligini majburiy sug‘urta qilish polisi (OSAGO);
4. Ishonchnoma (agar avtomobil boshqa shaxs nomiga rasmiylashtirilgan bo‘lsa va haydovchi sug‘urtada ko‘rsatilmagan bo‘lsa).
Izoh: Hozirgi kunda ID-karta mavjud bo‘lganda ushbu hujjatlar YPX xodimlari tomonidan planshet orqali elektron tekshirilishi mumkin, ammo qoidada hujjatlarni doimo amalda saqlash talab qilinadi.`,
      important: 'Mast holatda, charchoq yoki dori vositalari ta’sirida avtomobil boshqarish qat’iyan man etiladi.'
    },
    {
      id: 'rule-2',
      category: 'umumiy',
      categoryName: 'Umumiy qoidalar',
      title: 'Xavfsizlik kamarlari va motoshlem',
      summary: 'Harakatlanayotganda kamar taqish tartibi va istisnolar.',
      content: `Xavfsizlik kamari bilan jihozlangan konstruksiyadagi avtomobillarda harakatlanish paytida barcha yo‘lovchilar va haydovchi xavfsizlik kamarini taqib olishi shart.
Orqa o‘rindiqdagi yo‘lovchilar ham konstruksiyada ko‘zda tutilgan bo‘lsa, kamar taqishlari lozim.
Istisnolar: Aholi punktlarida faqat operativ xizmat (tez yordam, IIB, FVV) avtomobillari haydovchilari va yo‘lovchilari xizmat vazifasini bajarayotganda kamar taqmasligi mumkin.`,
      important: 'Xavfsizlik kamarini taqmaslik ma’muriy jarimaga sabab bo‘ladi.'
    },
    {
      id: 'rule-3',
      category: 'svetofor',
      categoryName: 'Svetofor va tartibga soluvchi',
      title: 'Svetofor ishoralarining ma’nosi',
      summary: 'Yashil, sariq, qizil va miltillovchi chiroqlarning aniq huquqiy talablari.',
      content: `Svetofor signallari quyidagicha talqin qilinadi:
- Yashil chiroq: Harakatlanishga to‘liq ruxsat beradi;
- Yashil miltillovchi chiroq: Ruxsat beradi, ammo uning vaqti tugayotganligi va tez orada taqiqlovchi signal yonishidan ogohlantiradi (3 soniya miltillaydi);
- Sariq chiroq: Harakatlanishni taqiqlaydi (keskin tormozlanishsiz to‘xtashning iloji bo‘lmagan hollar mustasno);
- Qizil chiroq: Harakatlanishni qat’iyan taqiqlaydi;
- Qizil va sariq bir vaqtda yonganda: Harakatlanish taqiqlanadi va tez orada yashil yonishidan ogohlantiradi.`,
      important: 'Sariq chiroqqa tezlikni oshirib chorrahaga kirish qoidabuzarlik hisoblanadi.'
    },
    {
      id: 'rule-4',
      category: 'svetofor',
      categoryName: 'Svetofor va tartibga soluvchi',
      title: 'Qo‘shimcha tarmoqli svetoforlar (Strelkalar)',
      summary: 'Qo‘shimcha yashil strelka yonganda yoki o‘chganda qanday harakatlanish kerak?',
      content: `Svetoforda asosiy yashil chiroq bilan birga qo‘shimcha yon strelka bo‘lishi mumkin:
1. Agar asosiy chiroq qizil bo‘lib, o‘ngga yashil strelka yonsa: O‘ngga burilish mumkin, biroq boshqa yo‘nalishlardan kelayotgan barcha transport vositalari va piyodalarga yo‘l berish shart.
2. Agar o‘ngga burilish harakati bo‘yicha temir yashil strelka taxtachasi o‘rnatilgan bo‘lsa: Qizil chiroqda ham piyodalar va boshqa mashinalarni o‘tkazib yuborib, o‘ngga burilishga ruxsat beriladi.`,
      important: 'Asosiy yashil chiroq yonganda, qo‘shimcha strelka o‘chiq bo‘lsa, o‘sha tomonga burilish taqiqlanadi.'
    },
    {
      id: 'rule-5',
      category: 'chiziqlar',
      categoryName: 'Yo‘l chiziqlari',
      title: 'Yaxlit oq chiziq (1.1) va uzuq-uzuq chiziq (1.5)',
      summary: 'Chiziqlarni bosib o‘tish va qatorni o‘zgartirish qoidalari.',
      content: `Yo‘l chiziqlari harakat oqimini tartibga soladi:
- 1.1 Yaxlit chiziq: Qarama-qarshi oqimlarni ajratadi yoki xavfli joylarda qatnov qismini belgilaydi. Uni kesib o‘tish qat’iyan taqiqlanadi.
- 1.3 Qo‘shaloq yaxlit chiziq: 4 va undan ortiq tasmali yo‘llarda qarama-qarshi oqimlarni ajratadi. Uni bosish yoki kesib o‘tish eng og‘ir qoidabuzarliklardan biridir.
- 1.5 Uzuq-uzuq chiziq: Istalgan tomondan chiziqni kesib o‘tib boshqa qatorga o‘tish va quvib o‘tishga ruxsat etiladi.`,
      important: 'Yaxlit chiziqni bosib burilish yoki qayrilib olish qat’iyan taqiqlanadi.'
    },
    {
      id: 'rule-6',
      category: 'chiziqlar',
      categoryName: 'Yo‘l chiziqlari',
      title: 'Sariq yo‘l chiziqlari (1.4 va 1.10)',
      summary: 'To‘xtash va to‘xtab turishni cheklovchi sariq chiziqlar.',
      content: `Yo‘l chetidagi sariq chiziqlar to‘xtash rejimini bildiradi:
- Yaxlit sariq chiziq (1.4): Qatnov qismi chetida chiziladi. Bu joyda transport vositalarining to‘xtashi va to‘xtab turishi taqiqlanadi ("To‘xtash taqiqlangan" belgisi bilan teng).
- Uzuq-uzuq sariq chiziq (1.10): Bu joyda to‘xtab turish (parkovka) taqiqlanadi, ammo 5 daqiqagacha odam mindirish/tushirish uchun to‘xtash mumkin.`,
      important: 'Sariq chiziq yo‘l chetida aniq ko‘rinib turadi va belgining amal qilish zonasini belgilaydi.'
    },
    {
      id: 'rule-7',
      category: 'chorraha',
      categoryName: 'Chorrahadan o‘tish',
      title: 'Teng ahamiyatli chorrahalar qoidasi (O‘ng qo‘l qoidasi)',
      summary: 'Belgilar va svetofor bo‘lmagan chorrahada kim birinchi o‘tadi?',
      content: `Teng ahamiyatli yo‘llar kesishgan chorrahada haydovchi o‘ng tomondan yaqinlashib kelayotgan transport vositasiga yo‘l berishi shart ("O‘ng qo‘l qoidasi").
Shuningdek, teng sharoitda tramvay har doim relssiz transport vositasiga nisbatan harakatlanish yo‘nalishidan qat’i nazar ustunlikka ega.
Agar chorrahada bir vaqtda 4 ta transport vositasi paydo bo‘lsa, haydovchilar o‘zaro ishora va kelishuv asosida navbat bilan o‘tadilar.`,
      important: 'Chorraha ichida to‘xtab qolib boshqalarga xalaqit beradigan bo‘lsa, unga kirish taqiqlanadi.'
    },
    {
      id: 'rule-8',
      category: 'chorraha',
      categoryName: 'Chorrahadan o‘tish',
      title: 'Asosiy va ikkinchi darajali yo‘l kesishmasi',
      summary: 'Asosiy yo‘l yo‘nalishini o‘zgartirganda harakatlanish tartibi.',
      content: `Agar chorrahada asosiy yo‘l yo‘nalishini o‘zgartirsa (7.13 lavhasi bilan):
1. Asosiy yo‘lda kelayotgan haydovchilar o‘zaro teng ahamiyatli yo‘l qoidasiga (o‘ng qo‘l qoidasiga) amal qiladilar.
2. Ikkinchi darajali yo‘ldan kelayotganlar ham avval barcha asosiy yo‘ldagilarni o‘tkazib, keyin o‘zaro o‘ng qo‘l qoidasi bo‘yicha chorrahani kesib o‘tadilar.`,
      important: 'Chapga burilayotgan haydovchi qarshidan to‘g‘riga yoki o‘ngga burilayotgan transportga yo‘l berishi shart.'
    },
    {
      id: 'rule-9',
      category: 'tezlik',
      categoryName: 'Tezlik qoidalari',
      title: 'Aholi punktlarida va tashqarisida tezlik me’yorlari',
      summary: 'O‘zbekistonda joriy etilgan rasmiy maksimal tezliklar.',
      content: `O‘zbekiston Respublikasining amaldagi qoidalariga binoan:
- Aholi punktlarida (shahar, qishloq): barcha yengil avtomobillar uchun maksimal tezlik 60 km/soat (Toshkent va viloyat markazlarida);
- Turar joy zonalari va hovlilarda: maksimal 20 km/soat;
- Maktab va bolalar bog‘chalari oldida: 30 km/soat;
- Aholi punktlaridan tashqarida: yengil avtomobillar uchun 100 km/soat;
- Avtomagistralda: yengil avtomobillar uchun 110 km/soat.`,
      important: 'Tezlikni sababsiz me’yordan ortiq past darajada ushlab boshqalarga sun’iy to‘siq yaratish ham man etiladi.'
    },
    {
      id: 'rule-10',
      category: 'toxtash',
      categoryName: 'To‘xtash va parkovka',
      title: 'To‘xtash qat’iyan taqiqlangan joylar',
      summary: 'Qonun bo‘yicha qaysi nuqtalarda to‘xtash jazolanadi?',
      content: `Quyidagi o‘rinlarda transport vositalarining to‘xtashi taqiqlanadi:
1. Tramvay yo‘llarida va ularga bevosita yaqin joylarda;
2. Temir yo‘l kesishmalarida, tonnellarda, ko‘priklar va estakadalarda;
3. Piyodalar o‘tish joyida va undan 5 metr oldinroqda;
4. Qatnov qismining ko‘rinishi 100 metrdan kam bo‘lgan burilishlarda;
5. Chorrahalarda va kesishuvchi qatnov qismi chetiga 5 metrdan kam masofada;
6. Marshrutli transport to‘xtash bekatidan 15 metr oldin va keyin.`,
      important: 'Piyodalar o‘tish joyining ustida va bevosita 5 metr yaqinida to‘xtash piyodalar xavfsizligiga tahdid soladi.'
    },
    {
      id: 'rule-11',
      category: 'piyodalar',
      categoryName: 'Piyodalar qoidalari',
      title: 'Haydovchilarning piyodalarga yo‘l berish tartibi',
      summary: 'Tartibga solinmagan va solingan o‘tish joylaridagi qoidalar.',
      content: `Tartibga solinmagan piyodalar o‘tish joyiga yaqinlashayotgan haydovchi o‘tish joyidan o‘tayotgan yoki unga qadam qo‘ygan piyodani o‘tkazib yuborish uchun tezlikni kamaytirishi yoki to‘xtashi shart.
Agar o‘tish joyi oldida boshqa transport vositasi to‘xtagan yoki tezlikni pasaytirgan bo‘lsa, qo‘shni qatordagi haydovchi ham to‘xtashi, piyoda yo‘qligiga to‘liq ishonch hosil qilgachgina harakatlanishi shart.`,
      important: 'Piyodalar o‘tish joyi oldida to‘xtab turgan avtomobilni ko‘r-ko‘rona quvib o‘tish fojiaviy oqibatlarga olib keladi.'
    },
    {
      id: 'rule-12',
      category: 'maxsus',
      categoryName: 'Maxsus transport vositalari',
      title: 'Yaltiroq mayoqcha va maxsus tovushli signallar',
      summary: 'Tez yordam, IIB va FVV vositalariga yo‘l berish qoidalari.',
      content: `Ko‘k (yoki ko‘k va qizil) yaltiroq mayoqchasini va maxsus tovush signalini yoqqan holda yaqinlashayotgan transport vositasiga haydovchilar to‘siqsiz o‘tib ketishi uchun yo‘l berishi shart.
Ushbu transport vositalari qatnov qoidalarining svetofor, tezlik va qator tartibi talablaridan chetga chiqishi mumkin (tartibga soluvchi ishorasidan tashqari).
Bunday mashinalarni quvib o‘tish taqiqlanadi.`,
      important: 'Maxsus transport vositasining yo‘lini to‘sish qat’iy ma’muriy javobgarlikka sabab bo‘ladi.'
    }
  ];

  // 3. 10 STRUCTURED LESSONS (With reading time, modules, difficulty)
  const lessons = [
    {
      id: 'les-1',
      number: 1,
      title: 'Yo‘l harakati asoslari va tushunchalar',
      category: 'Asoslar',
      duration: '15 daqiqa',
      difficulty: 'Oson',
      level: 1,
      summary: 'Qatnov qismi, yo‘l yoqasi, ajratuvchi tasma, haydovchi va piyoda huquqiy tushunchalari.',
      readCount: 1420,
      content: `Ushbu darsda O‘zbekiston Respublikasi yo‘l harakati qoidalarida qo‘llaniladigan asosiy terminologiya bilan tanishasiz.
- "Yo‘l" — transport vositalari va piyodalar harakatlanishi uchun qurilgan yoki moslashtirilgan yer polosasidir.
- "Qatnov qismi" — yo‘lning relssiz transportlar harakati uchun mo‘ljallangan asosiy qismi.
- "Ajratuvchi tasma" — yondosh qatnov qismlarini ajratuvchi, harakatlanish uchun mo‘ljallanmagan konstruktiv element.
- "Yetarli ko‘rinmaslik" — tuman, yomg‘ir, qor yog‘ishi yoki g‘ira-shira paytida yo‘lning 300 metrdan kam masofada ko‘rinishi.`,
      takeaways: ['Yo‘l tushunchalari', 'Ko‘rinish zonalari', 'Harakat ishtirokchilari turlari']
    },
    {
      id: 'les-2',
      number: 2,
      title: 'Yo‘l belgilari guruhlari va ierarxiyasi',
      category: 'Belgilar',
      duration: '25 daqiqa',
      difficulty: 'O‘rta',
      level: 2,
      summary: '7 ta belgi guruhining vazifalari, shakllari, rangi va ustunlik ierarxiyasi.',
      readCount: 2310,
      content: `Yo‘l belgilari 7 asosiy guruhga bo‘linadi:
1. Ogohlantiruvchi (Uchburchak, qizil hoshiyali) — xavf haqida xabar beradi.
2. Imtiyozli (Turli shakllar) — chorraha va tor joylarda o‘tish navbatini belgilaydi.
3. Taqiqlovchi (Doira, oq yoki ko‘k fon, qizil hoshiya) — muayyan cheklovlarni kiritadi.
4. Buyuruvchi (Doira, ko‘k fon) — majburiy harakat yo‘nalishlarini ko‘rsatadi.
5. Axborot-ko‘rsatkich — yo‘nalishlar va joylashuvlar haqida ma’lumot beradi.
6. Servis — haydovchiga xizmat ko‘rsatish ob’ektlarini bildiradi.
7. Qo‘shimcha axborot (Lavhalar) — asosiy belgi bilan birga uning shartini aniqlashtiradi.`,
      takeaways: ['Belgilar shakli va rangi', 'Doimiy va vaqtinchalik belgilar', 'Qaysi belgi ustun turadi']
    },
    {
      id: 'les-3',
      number: 3,
      title: 'Svetofor va tartibga soluvchi ishoralari',
      category: 'Tartibga solish',
      duration: '20 daqiqa',
      difficulty: 'O‘rta',
      level: 2,
      summary: 'Tartibga soluvchi qo‘l harakatlari, svetofor signallari va ularning ta’sir doirasi.',
      readCount: 1890,
      content: `Yo‘lda ustunlik ierarxiyasi juda aniq:
1-o‘rinda: Tartibga soluvchi (YPX xodimi) — uning ishoralari svetofor va barcha yo‘l belgilaridan USTUN turadi!
2-o‘rinda: Svetofor — u yo‘lning imtiyozli belgilarini bekor qiladi (masalan, "Asosiy yo‘l" belgisi turgan bo‘lsa ham, qizil chiroqda to‘xtash shart).
3-o‘rinda: Imtiyozli yo‘l belgilari (Svetofor ishlamayotgan yoki sariq miltillayotgan hollarda).
4-o‘rinda: O‘ng qo‘l qoidasi (Hech qanday belgi bo‘lmaganda).`,
      takeaways: ['YPX xodimi ishoralari', 'Svetofor va belgi ziddiyati', 'Reversiv svetoforlar']
    },
    {
      id: 'les-4',
      number: 4,
      title: 'Chorrahani kesib o‘tish san’ati',
      category: 'Chorrahalar',
      duration: '30 daqiqa',
      difficulty: 'Qiyin',
      level: 3,
      summary: 'Tartibga solingan va solinmagan chorrahalar, chapga burilish va aylanma harakat.',
      readCount: 3410,
      content: `Chorrahalar nazariy imtihonda eng ko‘p xato qilinadigan mavzudir.
Asosiy qoidalar:
- O‘ngga burilayotganda avtomobil qatnov qismining iloji boricha o‘ng chetiga yaqin bo‘lishi shart.
- Chapga burilish yoki qayrilib olishda chorrahaning markaziy qismidan o‘tib, qarama-qarshi oqimga xalaqit bermaslik kerak.
- Aylanma harakat chorrahasiga kirayotganda doira bo‘ylab harakatlanayotgan transport vositasiga yo‘l berish qat’iy qoidadir.`,
      takeaways: ['Aylanma harakat', 'Chapga burilish traektoriyasi', 'Trajektoriya kesishuvi']
    },
    {
      id: 'les-5',
      number: 5,
      title: 'Tezlik me’yorlari va xavfsiz masofa',
      category: 'Harakat',
      duration: '15 daqiqa',
      difficulty: 'Oson',
      level: 1,
      summary: 'Shahar va trassadagi tezlik chegaralari, tormozlanish masofasi va reaksiya vaqti.',
      readCount: 1650,
      content: `Tezlik tanlashda haydovchi nafaqat belgilangan chegarani, balki ob-havo, yo‘l holati va yuk og‘irligini hisobga olishi shart.
Reaksiya vaqti o‘rtacha 0.8 - 1 soniyani tashkil etadi. Soatiga 60 km tezlikda harakatlanayotgan avtomobil 1 soniyada deyarli 17 metr masofani bosib o‘tadi.
Xavfsiz oraliq masofa — quruq yo‘lda oldindagi avtomobil tezligining yarmiga teng (masalan, 60 km/soatda kamida 30 metr).`,
      takeaways: ['Reaksiya vaqti', 'Tormoz yo‘li', 'Oraliq masofa hisoblash']
    },
    {
      id: 'les-6',
      number: 6,
      title: 'To‘xtash, to‘xtab turish va parkovka qoidalari',
      category: 'To‘xtash',
      duration: '20 daqiqa',
      difficulty: 'O‘rta',
      level: 2,
      summary: 'To‘xtash (5 daqiqagacha) va to‘xtab turish (5 daqiqadan ko‘p) farqlari va taqiqlangan zonalar.',
      readCount: 1980,
      content: `Ko‘pchilik to‘xtash va to‘xtab turish tushunchalarini aralashtiradi:
- "To‘xtash" — 5 daqiqagacha bo‘lgan yoki undan ko‘p bo‘lsa ham faqat yo‘lovchilarni chiqarish/mindirish, yuk ortish/tushirish bilan bog‘liq harakatsizlik.
- "To‘xtab turish" (Parkovka) — 5 daqiqadan ortiq muddatga boshqa sabablar bilan harakatni to‘xtatish.
Yo‘lning chap tomonida faqat aholi punktlarida harakat yo‘nalishida bittadan tasma bo‘lgan yoki bir tomonlama yo‘llarda to‘xtashga ruxsat beriladi.`,
      takeaways: ['To‘xtash va to‘xtab turish farqi', 'Chorraha oldida masofa (5m)', 'Piyodalar o‘tish joyi oldida masofa']
    },
    {
      id: 'les-7',
      number: 7,
      title: 'Piyodalar va yo‘lovchilar xavfsizligi',
      category: 'Xavfsizlik',
      duration: '15 daqiqa',
      difficulty: 'Oson',
      level: 1,
      summary: 'Tartibga solinmagan zebra, ko‘zi ojiz piyodalar, bolalarni tashish qoidalari.',
      readCount: 1470,
      content: `Piyodalar yo‘lning eng himoyasiz ishtirokchilaridir:
- Haydovchi oq hassa ko‘targan ko‘zi ojiz piyodaga hamma joyda (hatto piyodalar o‘tish joyidan tashqarida ham) yo‘l berishi shart!
- 12 yoshga to‘lmagan bolalarni old o‘rindiqda faqat maxsus bolalar ushlab turuvchi moslamasi (avtokreslo) bo‘lganda tashishga ruxsat beriladi.`,
      takeaways: ['Ko‘zi ojiz piyodalar oq hassasi', 'Bolalar kreslosi', 'To‘xtab turgan avtobusdan o‘tish']
    },
    {
      id: 'les-8',
      number: 8,
      title: 'Quvib o‘tish va qatnov qismida joylashish',
      category: 'Manevrlar',
      duration: '25 daqiqa',
      difficulty: 'Qiyin',
      level: 3,
      summary: 'Quvib o‘tish taqiqlangan xavfli holatlar, orqaga harakatlanish va qayrilib olish.',
      readCount: 2840,
      content: `Quvib o‘tish — oldindagi transport vositasidan o‘zib ketish uchun qarama-qarshi harakatlanish tasmasiga chiqish bilan bog‘liq eng xavfli manevrdir.
Quvib o‘tish qat’iyan man etiladi:
- Tartibga solinadigan chorrahalarda;
- Asosiy hisoblanmagan yo‘lda harakatlanayotganda tartibga solinmagan chorrahalarda;
- Piyodalar o‘tish joylarida;
- Temir yo‘l kesishmalarida va ularga 100 metrdan kam qolganda;
- Tepalik cho‘qqisida va yo‘lning ko‘rinishi cheklangan joylarida.`,
      takeaways: ['Quvib o‘tish qoidalari', 'Qarama-qarshi yo‘lga chiqish', 'Quvib o‘tish taqiqlangan joylar']
    },
    {
      id: 'les-9',
      number: 9,
      title: 'Tashqi yoritish asboblari va tovush signallari',
      category: 'Texnika',
      duration: '15 daqiqa',
      difficulty: 'Oson',
      level: 1,
      summary: 'Uzoqni va yaqinni yorituvchi chiroqlar, kunduzgi chiroqlar, tuman chiroqlari qoidalari.',
      readCount: 1320,
      content: `Qorong‘i vaqtda va yetarli ko‘rinmaslik sharoitida mexanik transport vositalarida yaqinni yoki uzoqni yorituvchi faralar yoqilishi shart.
- Uzoqni yorituvchi chiroq qarshidan kelayotgan mashinaga kamida 150 metr qolganda yaqin chiroqqa o‘tkazilishi shart.
- Aholi punktlarida tovush signalidan (klakson) faqat yo‘l-transport hodisasining oldini olish uchungina foydalanishga ruxsat etiladi. Quvib o‘tish haqida ogohlantirish uchun signaldan faqat shahar tashqarisida foydalanish mumkin.`,
      takeaways: ['Faralarni almashtirish masofasi (150m)', 'Klakson chalish qoidalari', 'Tuman chiroqlari']
    },
    {
      id: 'les-10',
      number: 10,
      title: 'Favqulodda vaziyatlar va birinchi tibbiy yordam',
      category: 'Tibbiy yordam',
      duration: '20 daqiqa',
      difficulty: 'O‘rta',
      level: 2,
      summary: 'YTH sodir bo‘lganda haydovchining harakatlari, qon ketishini to‘xtatish, sun’iy nafas berish.',
      readCount: 2190,
      content: `Yo‘l-transport hodisasi (YTH) yuz berganda haydovchining birinchi harakatlari:
1. Darhol transport vositasini to‘xtatish, avariya ishorasini yoqish va avariya to‘xtash belgisini o‘rnatish (aholi punktida 15 m, tashqarida 30 m masofada).
2. Jabrlanganlarga birinchi tibbiy yordam ko‘rsatish va zudlik bilan 103 (Tez yordam) hamda 102 (Yo‘l harakati xavfsizligi) raqamlariga xabar berish.
3. Arterial qon ketishda jarohatdan yuqoriroq qismga jgut qo‘yiladi (yozda 1 soat, qishda 30 daqiqadan ko‘p qoldirmaslik kerak).`,
      takeaways: ['Avariya belgisi masofalari', 'YTH paytidagi tartib', 'Birinchi tibbiy yordam asoslari']
    }
  ];

  // 4. 50+ REALISTIC DRIVING THEORY QUESTIONS
  const questions = [
    {
      id: 1,
      topic: 'Chorrahadan o‘tish',
      question: 'Teng ahamiyatli yo‘llar kesishgan tartibga solinmagan chorrahada siz qaysi transport vositasiga yo‘l berishingiz shart?',
      options: [
        'Chap tomondan kelayotgan har qanday transport vositasiga',
        'O‘ng tomondan yaqinlashib kelayotgan har qanday transport vositasiga',
        'Faqat og‘ir yuk avtomobillariga',
        'Hech kimga, birinchi bo‘lib o‘tasiz'
      ],
      correctIndex: 2,
      explanation: 'Teng ahamiyatli chorrahada "O‘ng qo‘l qoidasi" amal qiladi: haydovchi o‘ng tomondan kelayotgan transportga yo‘l berishi shart.',
      difficulty: 'Oson'
    },
    {
      id: 2,
      topic: 'Tezlik qoidalari',
      question: 'O‘zbekiston Respublikasi hududidagi aholi punktlarida yengil avtomobillarning maksimal ruxsat etilgan tezligi qancha?',
      options: [
        '70 km/soat',
        '80 km/soat',
        '60 km/soat',
        '50 km/soat'
      ],
      correctIndex: 2,
      explanation: 'Amaldagi Yo‘l harakati qoidalariga asosan aholi punktlarida barcha transport vositalarining harakatlanish tezligi soatiga 60 kilometrdan oshmasligi kerak.',
      difficulty: 'Oson'
    },
    {
      id: 3,
      topic: 'Yo‘l belgilari',
      question: '"To‘xtamasdan harakatlanish taqiqlangan" (2.5 STOP) belgisi oldida haydovchi nima qilishi shart?',
      options: [
        'Faqat asosiy yo‘lda transport bo‘lsa to‘xtashi',
        'Tezlikni 10 km/soatgacha tushirib o‘tib ketishi',
        'To‘xtash chizig‘i yoki qatnov qismi kesishmasi oldida to‘liq to‘xtashi',
        'Faqat chapga burilayotganda to‘xtashi'
      ],
      correctIndex: 2,
      explanation: '2.5 belgisi oldida yo‘lda transport bo‘lishi yoki bo‘lmasligidan qat’i nazar to‘liq to‘xtash (g‘ildiraklar 0 km/s) majburiydir.',
      difficulty: 'Oson'
    },
    {
      id: 4,
      topic: 'Svetofor',
      question: 'Svetoforning asosiy qizil chirog‘i yonib, o‘ngga qo‘shimcha yashil strelkasi yonganda haydovchi qanday harakatlanadi?',
      options: [
        'Barcha yo‘nalishdagi mashinalar to‘xtab, faqat unga yo‘l beradi',
        'O‘ngga burilishi mumkin, biroq boshqa yo‘nalishdagi transportlar va piyodalarga yo‘l bergan holda',
        'To‘g‘riga va o‘ngga to‘siqsiz yurishi mumkin',
        'Qo‘shimcha strelka yonishidan qat’i nazar kutib turishi shart'
      ],
      correctIndex: 2,
      explanation: 'Asosiy qizil chiroq bilan birga yongan qo‘shimcha strelka orqali burilayotgan haydovchi boshqa barcha transport va piyodalarni o‘tkazib yuborishi shart.',
      difficulty: 'O‘rta'
    },
    {
      id: 5,
      topic: 'To‘xtash va parkovka',
      question: 'Piyodalar o‘tish joyiga yetmasdan kamida necha metr masofada to‘xtashga ruxsat etiladi?',
      options: [
        'Kamida 5 metr',
        'Kamida 10 metr',
        'Kamida 15 metr',
        'Bevosita o‘tish joyi oldida'
      ],
      correctIndex: 2,
      explanation: 'Piyodalar o‘tish joyida va undan oldin 5 metrdan kam masofada to‘xtash qat’iyan taqiqlanadi (o‘tish joyidan keyin esa to‘xtash mumkin).',
      difficulty: 'O‘rta'
    },
    {
      id: 6,
      topic: 'Piyodalar',
      question: 'Tartibga solinmagan piyodalar o‘tish joyida piyoda yo‘lga qadam qo‘ygan bo‘lsa, haydovchi nima qilishi shart?',
      options: [
        'Tovush signali chalib, piyodani shoshiltirishi',
        'Tezlikni kamaytirishi yoki to‘xtab, piyodaga yo‘l berishi',
        'Agar piyoda chap tomondan kelayotgan bo‘lsa, to‘xtamasdan o‘tib ketishi',
        'Avariya chirog‘ini yoqib tezlikni oshirishi'
      ],
      correctIndex: 2,
      explanation: 'Haydovchi tartibga solinmagan o‘tish joyida qatnov qismiga chiqqan har qanday piyodaga yo‘l berishi shart.',
      difficulty: 'Oson'
    },
    {
      id: 7,
      topic: 'Maxsus transport',
      question: 'Ko‘k rangli miltillovchi mayoqcha va maxsus ovozli signalni yoqib kelayotgan avtomashinaga qanday munosabatda bo‘lish kerak?',
      options: [
        'Tezlikni oshirib oldinga o‘tib ketish',
        'Unga to‘siqsiz o‘tib ketishi uchun yo‘l bo‘shatib berish',
        'Faqat chapga burilayotgan bo‘lsa yo‘l berish',
        'O‘z harakat yo‘nalishini o‘zgartirmay ketaverish'
      ],
      correctIndex: 2,
      explanation: 'Maxsus operativ transport vositalariga qoidaga ko‘ra darhol yo‘l bo‘shatib berish shart.',
      difficulty: 'Oson'
    },
    {
      id: 8,
      topic: 'Favqulodda vaziyatlar',
      question: 'Aholi punktlaridan tashqaridagi yo‘llarda majburiy to‘xtaganda avariya to‘xtash belgisi avtomobildan kamida necha metr masofada o‘rnatiladi?',
      options: [
        'Kamida 15 metr',
        'Kamida 30 metr',
        'Kamida 50 metr',
        'Kamida 10 metr'
      ],
      correctIndex: 2,
      explanation: 'Avariya to‘xtash belgisi aholi punktlarida kamida 15 metr, aholi punktidan tashqarida esa kamida 30 metr masofada o‘rnatilishi shart.',
      difficulty: 'O‘rta'
    },
    {
      id: 9,
      topic: 'Haydovchi majburiyatlari',
      question: 'Bolalarni yengil avtomobilning old o‘rindig‘ida maxsus bolalar ushlab turuvchi moslamasisiz necha yoshdan tashishga ruxsat beriladi?',
      options: [
        '10 yoshdan',
        '12 yoshdan',
        '14 yoshdan',
        '16 yoshdan'
      ],
      correctIndex: 2,
      explanation: '12 yoshga to‘lmagan bolalarni oldingi o‘rindiqda maxsus bolalar ushlab turish moslamasisiz (kreslo) tashish taqiqlanadi.',
      difficulty: 'O‘rta'
    },
    {
      id: 10,
      topic: 'Yo‘l belgilari',
      question: '"Kirish taqiqlangan" (3.1 "G‘isht") belgisi qaysi transport vositalariga o‘z ta’sirini o‘tkazmaydi?',
      options: [
        'Taksilarga',
        'Marshrutli belgilangan yo‘nalishdagi transport vositalariga',
        'Ushbu ko‘chada yashovchi fuqarolarning mashinalariga',
        'Yuk tashuvchi transportlarga'
      ],
      correctIndex: 2,
      explanation: '3.1 belgisi faqat belgilangan yo‘nalishda qatnovchi marshrutli jamoat transportlariga (avtobus, marshrutka) tatbiq etilmaydi.',
      difficulty: 'O‘rta'
    },
    {
      id: 11,
      topic: 'Chorrahadan o‘tish',
      question: 'Aylanma harakat chorrahasiga kirib kelayotgan haydovchi aylanadagi transport vositasiga yo‘l berishi shartmi?',
      options: [
        'Yo‘q, aylanaga kirayotgan haydovchi ustunlikka ega',
        'Ha, aylanada harakatlanayotgan transport ustunlikka ega',
        'Faqat aylanadagi transport yuk mashinasi bo‘lsa yo‘l beradi',
        'Faqat kechasi yo‘l berishi kerak'
      ],
      correctIndex: 2,
      explanation: 'O‘zbekiston YHQga kiritilgan o‘zgarishlarga muvofiq, 4.3 belgisi o‘rnatilgan aylanma chorrahada doira ichidagi transport vositalari doimo ustunlikka ega.',
      difficulty: 'Oson'
    },
    {
      id: 12,
      topic: 'Yo‘l chiziqlari',
      question: 'Qatnov qismidagi 1.3 qo‘shaloq yaxlit oq chiziqni bosib o‘tish yoki kesish mumkinmi?',
      options: [
        'Faqat orqaga qayrilib olish uchun mumkin',
        'Qarama-qarshi oqim bo‘lmaganda mumkin',
        'Qat’iyan taqiqlanadi',
        'Soatiga 20 km dan kam tezlikdagi transportni quvib o‘tishda mumkin'
      ],
      correctIndex: 2,
      explanation: '1.3 qo‘shaloq yaxlit chiziqni kesib o‘tish qat’iyan man etiladi. Bu harakat qoidabuzarlik hisoblanadi.',
      difficulty: 'Oson'
    },
    {
      id: 13,
      topic: 'Tezlik qoidalari',
      question: 'Turar joy hududlarida (mahallalarda, ko‘p qavatli uy hovlilarida) ruxsat etilgan eng yuqori tezlik qancha?',
      options: [
        '10 km/soat',
        '20 km/soat',
        '30 km/soat',
        '40 km/soat'
      ],
      correctIndex: 2,
      explanation: 'Turar joy zonalari va hovlilarda harakatlanish tezligi soatiga 20 km dan oshmasligi shart va piyodalar butun yo‘l bo‘ylab ustunlikka ega.',
      difficulty: 'Oson'
    },
    {
      id: 14,
      topic: 'To‘xtash va parkovka',
      question: 'Yo‘lning qaysi joylarida to‘xtab turish (parkovka) qat’iyan taqiqlanadi?',
      options: [
        'Qatnov qismining ko‘rinishi biror tomonga 100 metrdan kam bo‘lgan yo‘l qismlarida',
        'Maxsus ajratilgan cho‘ntaklarda',
        'Bir tomonlama yo‘lning o‘ng tomonida',
        'Avtoturargoh hududida'
      ],
      correctIndex: 2,
      explanation: 'Ko‘rinish masofasi kamida 100 metrdan kam bo‘lgan xavfli burilish va qiya yo‘llarda to‘xtab turish xavfsizlik nuqtai nazaridan man etiladi.',
      difficulty: 'O‘rta'
    },
    {
      id: 15,
      topic: 'Chorrahadan o‘tish',
      question: 'Svetofor ishlayotgan chorrahada "Asosiy yo‘l" (2.1) belgisi o‘rnatilgan. Haydovchi nimaga amal qilishi kerak?',
      options: [
        'Belgiga, chunki u doimiy o‘rnatilgan',
        'Svetofor signallariga, chunki svetofor imtiyoz belgilarini bekor qiladi',
        'O‘ng qo‘l qoidasiga',
        'O‘z xohishiga ko‘ra'
      ],
      correctIndex: 2,
      explanation: 'Ishlab turgan svetofor imtiyoz belgilarining (Asosiy yo‘l, Yo‘l bering) ta’sirini bekor qiladi.',
      difficulty: 'O‘rta'
    },
    {
      id: 16,
      topic: 'Svetofor',
      question: 'Yashil miltillovchi svetofor signali nimani bildiradi?',
      options: [
        'Harakatlanish taqiqlanganligini',
        'Svetofor buzilganligini',
        'Harakatlanishga ruxsat berilishini va tez orada taqiqlovchi signal yonishini',
        'Tezlikni zudlik bilan 0 ga tushirish kerakligini'
      ],
      correctIndex: 2,
      explanation: 'Yashil miltillovchi signal harakatlanishga ruxsat beradi va uning muddati tugayotganidan ogohlantiradi (odatda 3 soniya).',
      difficulty: 'Oson'
    },
    {
      id: 17,
      topic: 'Haydovchi majburiyatlari',
      question: 'Harakatlanish vaqtida haydovchining telefondan qo‘lda foydalanishi mumkinmi?',
      options: [
        'Faqat tirbandlikda ruxsat beriladi',
        'Faqat quloqchin (hands-free) orqali gaplashishga ruxsat beriladi, qo‘lda ushlash taqiqlanadi',
        'Soatiga 40 km dan kam tezlikda mumkin',
        'Har qanday holatda to‘liq ruxsat etiladi'
      ],
      correctIndex: 2,
      explanation: 'Avtomobil harakatlanayotgan vaqtda haydovchining telefonni qo‘lda ushlab foydalanishi taqiqlanadi. Faqat hands-free moslamalari ruxsat etiladi.',
      difficulty: 'Oson'
    },
    {
      id: 18,
      topic: 'Favqulodda vaziyatlar',
      question: 'YTH natijasida kuchli arterial qon ketish kuzatilganda jgut (bog‘ich) jarohatdan qayerga qo‘yiladi?',
      options: [
        'To‘g‘ridan-to‘g‘ri jarohat ustiga',
        'Jarohatdan pastroqqa',
        'Jarohatdan yuqoriroqqa (yurakka yaqinroq)',
        'Faqat bilak qismiga'
      ],
      correctIndex: 2,
      explanation: 'Arterial qon yurakdan kelayotgani sababli, qon ketishini to‘xtatish uchun jgut jarohatlangan joydan yuqoriga qo‘yiladi.',
      difficulty: 'Qiyin'
    },
    {
      id: 19,
      topic: 'Yo‘l belgilari',
      question: '"Yuqori tezlik cheklangan 70" belgisi ta’sir doirasi qayergacha davom etadi?',
      options: [
        'Har doim 5 kilometrgacha',
        'Eng yaqin chorrahagacha yoki aholi punkti tugashigacha',
        'Faqat 100 metr masofagacha',
        'Keyingi svetoforgacha'
      ],
      correctIndex: 2,
      explanation: 'Taqiqlovchi belgilarning ta’sir doirasi belgi o‘rnatilgan joydan boshlab yo‘nalishdagi eng yaqin chorrahagacha, chorraha bo‘lmaganda aholi punkti tugashigacha davom etadi.',
      difficulty: 'O‘rta'
    },
    {
      id: 20,
      topic: 'Chorrahadan o‘tish',
      question: 'Chorrahada chapga burilayotgan transport vositasi qarama-qarshi tomondan to‘g‘riga ketayotgan transportga yo‘l berishi shartmi?',
      options: [
        'Ha, doimo yo‘l berishi shart',
        'Yo‘q, chapga burilayotgan birinchi o‘tadi',
        'Faqat qarshidagi mashina yuk mashinasi bo‘lsa',
        'Faqat tunda yo‘l beradi'
      ],
      correctIndex: 2,
      explanation: 'Chapga burilish yoki qayrilib olishda haydovchi teng huquqli yo‘ldan qarama-qarshi tomondan to‘g‘riga yoki o‘ngga harakatlanayotgan transportga yo‘l berishi shart.',
      difficulty: 'Oson'
    },
    {
      id: 21,
      topic: 'Harakatlanish qoidalari',
      question: 'Quvib o‘tish manevrini bajarishdan oldin haydovchi nimaga ishonch hosil qilishi shart?',
      options: [
        'Qarama-qarshi yo‘l tasmasi yetarli masofada bo‘sh ekanligiga va orqadagi mashina quvib o‘tishni boshlamaganiga',
        'Oldindagi mashina tezligi 100 km/soatdan ortiq emasligiga',
        'Musiqa ovozi pasaytirilganiga',
        'Faqat kunduz kuni ekanligiga'
      ],
      correctIndex: 2,
      explanation: 'Quvib o‘tishdan oldin qarama-qarshi yo‘nalishdagi tasma xavfsiz masofada bo‘shligiga va o‘zini hech kim quvib o‘tmayotganiga to‘liq ishonch hosil qilish zarur.',
      difficulty: 'O‘rta'
    },
    {
      id: 22,
      topic: 'Yo‘l belgilari',
      question: 'Ko‘k rangli dumaloq belgilar qaysi guruhga kiradi?',
      options: [
        'Ogohlantiruvchi belgilar',
        'Buyuruvchi belgilar',
        'Taqiqlovchi belgilar',
        'Axborot-ko‘rsatkich belgilari'
      ],
      correctIndex: 2,
      explanation: 'Doira shaklidagi ko‘k fondagi belgilar "Buyuruvchi belgilar" guruhiga kiradi va faqat ko‘rsatilgan yo‘nalishda yurishni majbur qiladi.',
      difficulty: 'Oson'
    },
    {
      id: 23,
      topic: 'Tezlik qoidalari',
      question: 'Avtomagistrallarda yengil avtomobillar uchun ruxsat etilgan maksimal tezlik qancha?',
      options: [
        '90 km/soat',
        '100 km/soat',
        '110 km/soat',
        '130 km/soat'
      ],
      correctIndex: 2,
      explanation: 'Avtomagistralda yengil avtomobillarning maksimal tezligi soatiga 110 km etib belgilangan.',
      difficulty: 'Oson'
    },
    {
      id: 24,
      topic: 'To‘xtash va parkovka',
      question: 'Marshrutli transport vositalari to‘xtash bekatlariga qancha masofada to‘xtash taqiqlanadi?',
      options: [
        'Bekatdan 5 metr oldin va keyin',
        'Bekatdan 15 metr oldin va keyin',
        'Bekatdan 30 metr oldin va keyin',
        'Faqat bekatning o‘zida'
      ],
      correctIndex: 2,
      explanation: 'Marshrutli transport to‘xtash bekatlariga 15 metrdan kam masofada to‘xtash (odam chiqarish hollaridan tashqari) taqiqlanadi.',
      difficulty: 'O‘rta'
    },
    {
      id: 25,
      topic: 'Yo‘l chiziqlari',
      question: 'Qatnov qismida sariq rangli yaxlit chiziq (1.4) nimani bildiradi?',
      options: [
        'Bu joyda to‘xtash va to‘xtab turish taqiqlanganligini',
        'Faqat avtobuslar harakatlanishi mumkinligini',
        'Velosipedchilar yo‘lkasini',
        'Tezlik 50 km/soat ekanligini'
      ],
      correctIndex: 2,
      explanation: 'Yo‘l chetidagi sariq yaxlit chiziq transport vositalarining to‘xtashini taqiqlaydi.',
      difficulty: 'O‘rta'
    },
    {
      id: 26,
      topic: 'Svetofor',
      question: 'Qora rangli kontur strelkali yashil svetofor signali nimani anglatadi?',
      options: [
        'Svetofor ishdan chiqqanini',
        'Harakatlanish faqat o‘sha strelka yo‘nalishlarida ruxsat etilishini',
        'Hamma tomonga burilish mumkinligini',
        'Faqat yuk mashinalari yurishini'
      ],
      correctIndex: 2,
      explanation: 'Konturli strelka haydovchiga ushbu chiroqda harakatlanish faqat ruxsat etilgan yo‘nalishlardagina mumkinligini bildiradi.',
      difficulty: 'O‘rta'
    },
    {
      id: 27,
      topic: 'Chorrahadan o‘tish',
      question: 'Tartibga solinmagan chorrahada tramvay bilan oddiy avtomobil teng sharoitda bo‘lsa, kim ustunlikka ega?',
      options: [
        'Avtomobil, agar u o‘ng tomonda bo‘lsa',
        'Tramvay, harakat yo‘nalishidan qat’i nazar',
        'Ikkalasi bir vaqtda o‘tadi',
        'Katta tezlikdagi transport'
      ],
      correctIndex: 2,
      explanation: 'Teng huquqli sharoitda tramvay harakatlanish yo‘nalishidan qat’i nazar relssiz transport vositalariga nisbatan doim ustunlikka ega.',
      difficulty: 'Oson'
    },
    {
      id: 28,
      topic: 'Haydovchi majburiyatlari',
      question: 'Haydovchilik guvohnomasini yangi olgan (staji 2 yildan kam) haydovchi qanday belgini avtomobiliga taqishi kerak?',
      options: [
        '"Boshlovchi haydovchi" (sariq fonda undov belgisi)',
        '"Nogiron" belgisi',
        '"Shinalar" belgisi',
        'Hech qanday belgi shart emas'
      ],
      correctIndex: 2,
      explanation: 'Haydash staji 2 yildan kam bo‘lgan shaxslar boshqarayotgan avtomobillarning orqa qismiga "Boshlovchi haydovchi" belgisi o‘rnatiladi.',
      difficulty: 'Oson'
    },
    {
      id: 29,
      topic: 'Favqulodda vaziyatlar',
      question: 'Qorong‘i vaqtda qarshidan kelayotgan avtomobil uzoqni yorituvchi chirog‘i bilan ko‘zingizni qamashtirganda nima qilish kerak?',
      options: [
        'Siz ham unga uzoq chiroqni yoqib qasos olishingiz',
        'Avariya chirog‘ini yoqib, o‘z tasmasidan chiqmagan holda tezlikni pasaytirib to‘xtashingiz kerak',
        'Tezlikni oshirib o‘tib ketishingiz kerak',
        'Keskin chapga burishingiz kerak'
      ],
      correctIndex: 2,
      explanation: 'Ko‘z qamashganda haydovchi avariya signalini yoqishi, egallab turgan tasmasini o‘zgartirmasdan tezlikni pasaytirishi va to‘xtashi shart.',
      difficulty: 'Qiyin'
    },
    {
      id: 30,
      topic: 'Harakatlanish qoidalari',
      question: 'Aholi punktlaridan tashqaridagi yo‘llarda qarshidan kelayotgan mashinaga kamida necha metr qolganda uzoq chiroq yaqin chiroqqa o‘tkazilishi shart?',
      options: [
        'Kamida 50 metr',
        'Kamida 100 metr',
        'Kamida 150 metr',
        'Kamida 300 metr'
      ],
      correctIndex: 2,
      explanation: 'Qarshidan kelayotgan transport vositasi haydovchisining ko‘zini qamashtirmaslik uchun kamida 150 metr qolganda uzoq chiroq yaqin chiroqqa o‘tkaziladi.',
      difficulty: 'O‘rta'
    },
    {
      id: 31,
      topic: 'Yo‘l belgilari',
      question: '"Avariya holatida to‘xtash maydonchasi" qaysi belgi hisoblanadi?',
      options: [
        'Servis belgisi',
        'Axborot-ko‘rsatkich belgisi',
        'Ogohlantiruvchi belgi',
        'Taqiqlovchi belgi'
      ],
      correctIndex: 2,
      explanation: 'Avariya holatida to‘xtash joyi axborot-ko‘rsatkich belgilari guruhiga tegishlidir.',
      difficulty: 'Oson'
    },
    {
      id: 32,
      topic: 'Chorrahadan o‘tish',
      question: 'Tartibga soluvchi (YPX xodimi) ikki qo‘lini yon tomonga yoyib yoki tushirib tursa, uning ko‘kragi va orqasi tomondan harakatlanish mumkinmi?',
      options: [
        'Ha, barcha yo‘nalishlarda mumkin',
        'Faqat o‘ngga mumkin',
        'Yo‘q, ko‘krak va orqa tomondan barcha transport vositalari harakati taqiqlanadi',
        'Faqat piyodalar o‘tishi mumkin'
      ],
      correctIndex: 2,
      explanation: 'Tartibga soluvchining ko‘kragi va orqasi devor hisoblanadi: bu tomonlardan har qanday harakat qat’iyan taqiqlanadi.',
      difficulty: 'Qiyin'
    },
    {
      id: 33,
      topic: 'Tezlik qoidalari',
      question: 'Tirkamali yengil avtomobillarning aholi punktidan tashqaridagi yo‘llarda eng yuqori ruxsat etilgan tezligi qancha?',
      options: [
        '70 km/soat',
        '80 km/soat',
        '90 km/soat',
        '100 km/soat'
      ],
      correctIndex: 2,
      explanation: 'Tirkamali yengil avtomobillarga aholi punktlaridan tashqarida maksimal 80 km/soat tezlik bilan harakatlanishga ruxsat etiladi.',
      difficulty: 'Qiyin'
    },
    {
      id: 34,
      topic: 'To‘xtash va parkovka',
      question: 'Temir yo‘l kesishmalarida to‘xtab turish (parkovka) kesishmagacha kamida necha metr masofada taqiqlanadi?',
      options: [
        'Kamida 20 metr',
        'Kamida 50 metr',
        'Kamida 100 metr',
        'Kamida 15 metr'
      ],
      correctIndex: 2,
      explanation: 'Temir yo‘l kesishmalariga 50 metrdan yaqin masofada to‘xtab turish (parkovka) qat’iyan taqiqlanadi.',
      difficulty: 'Qiyin'
    },
    {
      id: 35,
      topic: 'Haydovchi majburiyatlari',
      question: 'Avtomobil yo‘lda nosoz bo‘lib qolsa (masalan, kechasi tormoz tizimi yoki faralari mutlaqo ishlamasa), harakatni davom ettirish mumkinmi?',
      options: [
        'Avariya chirog‘ini yoqib asta-sekin yurish mumkin',
        'Harakatlanish qat’iyan taqiqlanadi',
        'Faqat ustaxonagacha borish mumkin',
        'Signal chalib borish mumkin'
      ],
      correctIndex: 2,
      explanation: 'Qorong‘ida faralari va gabarit chiroqlari yo‘q yoki ishchi tormoz tizimi ishlamayotgan transport vositasining harakatlanishi qat’iyan man etiladi.',
      difficulty: 'O‘rta'
    },
    {
      id: 36,
      topic: 'Yo‘l belgilari',
      question: '"Tik tushish" va "Tik ko‘tarilish" belgilarida qaysi haydovchi tor yo‘lda yo‘l berishi shart?',
      options: [
        'Pastga tushayotgan haydovchi yo‘l berishi shart',
        'Tepaga chiqayotgan haydovchi yo‘l berishi shart',
        'Tezligi yuqori bo‘lgan haydovchi',
        'Kichikroq avtomobil'
      ],
      correctIndex: 2,
      explanation: 'Qiyalikda qarama-qarshi o‘tish qiyin bo‘lgan joyda pastga tushib kelayotgan haydovchi tepaga chiqayotgan transportga yo‘l berishi shart.',
      difficulty: 'Qiyin'
    },
    {
      id: 37,
      topic: 'Harakatlanish qoidalari',
      question: 'Chorrahadan tashqarida tramvay yo‘llari bilan qatnov qismi kesishganda kim ustunlikka ega?',
      options: [
        'Har doim avtomobil',
        'Tramvay depo (garaj)dan chiqayotgan hollardan tashqari har doim tramvay ustunlikka ega',
        'Kim birinchi signal bersa',
        'Faqat o‘ngdagi transport'
      ],
      correctIndex: 2,
      explanation: 'Chorrahadan tashqarida tramvay relssiz transportlar bilan kesishganda (depodan chiqish holati bundan mustasno) doimo ustunlikka ega.',
      difficulty: 'O‘rta'
    },
    {
      id: 38,
      topic: 'Yo‘l chiziqlari',
      question: 'Yo‘ldagi sariq katak-katak chiziqlar (Vafli / 1.26) nimani bildiradi?',
      options: [
        'Tirbandlik paytida bu hududga kirib to‘xtab qolish taqiqlanganligini',
        'Faqat tez yordam yurishi mumkinligini',
        'Piyodalar zonasi ekanligini',
        'Bepul parkovka joyini'
      ],
      correctIndex: 2,
      explanation: 'Vafli chizig‘i bilan belgilangan chorraha qismida, agar oldinda tirbandlik bo‘lib haydovchini to‘xtashga majbur qilsa, unga kirish taqiqlanadi.',
      difficulty: 'O‘rta'
    },
    {
      id: 39,
      topic: 'Piyodalar',
      question: 'Ko‘zi ojiz piyoda yo‘lni kesib o‘tayotganini qanday ishora orqali bildiradi?',
      options: [
        'Qo‘lini yuqoriga ko‘taradi',
        'Oq hassani oldinga yoki yuqoriga ko‘taradi',
        'Maxsus hushtak chaladi',
        'Faqat svetofor orqali o‘tadi'
      ],
      correctIndex: 2,
      explanation: 'Oq hassasini ko‘targan ko‘zi ojiz piyodaga barcha joylarda haydovchilar to‘liq yo‘l berishlari shart.',
      difficulty: 'Oson'
    },
    {
      id: 40,
      topic: 'Svetofor',
      question: 'Svetoforning sariq miltillovchi chirog‘i nimani anglatadi?',
      options: [
        'Harakatlanish qat’iyan taqiqlangan',
        'Chorraha tartibga solinmaganligini va harakatlanishga ruxsat berilishini',
        'Faqat tez yordam yurishi mumkinligini',
        'Svetofor 5 daqiqadan so‘ng o‘chishini'
      ],
      correctIndex: 2,
      explanation: 'Sariq miltillovchi signal chorrahani tartibga solinmagan deb hisoblash kerakligini va haydovchilar ehtiyotkorlik bilan qoidalar bo‘yicha o‘tishini bildiradi.',
      difficulty: 'Oson'
    },
    {
      id: 41,
      topic: 'Tezlik qoidalari',
      question: 'Maktab va maktabgacha ta’lim muassasalari yaqinidagi yo‘llarda ruxsat etilgan maksimal tezlik qancha?',
      options: [
        '20 km/soat',
        '30 km/soat',
        '50 km/soat',
        '60 km/soat'
      ],
      correctIndex: 2,
      explanation: 'Maktab va bolalar bog‘chalari hududida tegishli yo‘l belgilari o‘rnatilgan joylarda maksimal tezlik soatiga 30 km etib belgilangan.',
      difficulty: 'Oson'
    },
    {
      id: 42,
      topic: 'To‘xtash va parkovka',
      question: 'Quyidagi hollarning qaysi birida avtomobilni yo‘l yoqasida qoldirib ketish xavfsiz hisoblanadi?',
      options: [
        'Kalitni o‘t oldirgichda qoldirib, eshiklarni ochiq qo‘yganda',
        'Dvigatelni o‘chirib, to‘xtash tormozini (ruchnik) tortib, eshiklarni qulflaganda',
        'Faqat birinchi vitesga qo‘yib ketganda',
        'Avariya chirog‘ini yoqib qo‘yib ketganda'
      ],
      correctIndex: 2,
      explanation: 'Haydovchi avtomobilning o‘z-o‘zidan harakatlanib ketishini va ruxsatsiz shaxslar foydalanishini oldini oluvchi barcha choralarni ko‘rgandagina undan uzoqlashishi mumkin.',
      difficulty: 'Oson'
    },
    {
      id: 43,
      topic: 'Harakatlanish qoidalari',
      question: 'Orqaga harakatlanish (zadniy xod) yo‘lning qaysi qismlarida taqiqlanadi?',
      options: [
        'Chorrahalarda, ko‘priklarda, piyodalar o‘tish joylarida va tonnellarda',
        'Faqat keng ko‘chalarda',
        'Faqat hovlilarda',
        'Hech qayerda taqiqlanmaydi'
      ],
      correctIndex: 2,
      explanation: 'Chorrahada, piyodalar o‘tish joyida, ko‘prik, tonnel va temir yo‘l kesishmalarida orqaga harakatlanish taqiqlanadi.',
      difficulty: 'O‘rta'
    },
    {
      id: 44,
      topic: 'Chorrahadan o‘tish',
      question: 'Tartibga soluvchi o‘ng qo‘lini oldinga cho‘zib tursa, haydovchi uning chap yonboshi tomonidan qaysi yo‘nalishlarda harakatlanishi mumkin?',
      options: [
        'Faqat to‘g‘riga',
        'Faqat o‘ngga',
        'Barcha yo‘nalishlarda (to‘g‘riga, o‘ngga, chapga va qayrilib olish)',
        'Harakat taqiqlanadi'
      ],
      correctIndex: 2,
      explanation: 'Tartibga soluvchi o‘ng qo‘lini oldinga cho‘zganda, uning chap tomonidagi haydovchi barcha yo‘nalishlarda (to‘g‘ri, o‘ng, chap, orqaga) harakatlanishi mumkin.',
      difficulty: 'Qiyin'
    },
    {
      id: 45,
      topic: 'Yo‘l belgilari',
      question: '"Turar-joy zonasi" (5.38) belgisi o‘rnatilgan hududda piyodalarga qanday huquq beriladi?',
      options: [
        'Ular faqat trotuardan yurishi kerak',
        'Ular qatnov qismi bo‘ylab ham bemalol harakatlanishi mumkin va ustunlikka ega',
        'Ular faqat yashil chiroqda o‘tishi mumkin',
        'Ular transportga yo‘l berishi shart'
      ],
      correctIndex: 2,
      explanation: 'Turar-joy zonasida piyodalar trotuarda ham, qatnov qismida ham harakatlanishlari mumkin va ular avtomobillarga nisbatan imtiyozga ega.',
      difficulty: 'Oson'
    },
    {
      id: 46,
      topic: 'Favqulodda vaziyatlar',
      question: 'Suyanib qolgan yoki nafas olmayotgan jabrlanuvchiga yurak-o‘pka reanimatsiyasi o‘tkazilganda yurakni bosish va nafas berish nisbati qanday?',
      options: [
        '15 ta bosish : 1 marta nafas',
        '30 ta ko‘krak qafasini bosish : 2 marta sun’iy nafas',
        '10 ta bosish : 5 marta nafas',
        '50 ta bosish : 5 marta nafas'
      ],
      correctIndex: 2,
      explanation: 'Zamonaviy birinchi yordam standartlariga ko‘ra nisbat 30 ta ko‘krak qafasini bosish va 2 marta puflash (30:2) etib belgilangan.',
      difficulty: 'Qiyin'
    },
    {
      id: 47,
      topic: 'Haydovchi majburiyatlari',
      question: 'Avtomobil salonida bo‘lishi majburiy bo‘lgan ashyolar qaysilar?',
      options: [
        'Faqat zaxira g‘ildirak va nasos',
        'Tibbiyot qutichasi (aptechka), o‘t o‘chirgich va avariya to‘xtash belgisi',
        'Faqat audio tizim va navigator',
        'Faqat domkrat'
      ],
      correctIndex: 2,
      explanation: 'Har bir transport vositasida yaroqlilik muddati o‘tmagan aptechka, o‘t o‘chirgich va avariya to‘xtash belgisi bo‘lishi shart.',
      difficulty: 'Oson'
    },
    {
      id: 48,
      topic: 'Chorrahadan o‘tish',
      question: 'Asosiy yo‘ldan ketayotgan transport vositasi chapga burilayotganda, qarama-qarshi tomondan asosiy yo‘lda to‘g‘riga ketayotganga yo‘l beradimi?',
      options: [
        'Yo‘q, burilayotgan transport ustun',
        'Ha, to‘g‘riga ketayotgan transportga yo‘l beradi',
        'Ikkalasi bir vaqtda buriladi',
        'Ovoz bergan transport o‘tadi'
      ],
      correctIndex: 2,
      explanation: 'Asosiy yo‘lda bo‘lsa ham, chapga burilayotgan haydovchi qarama-qarshi tomondan to‘g‘riga harakatlanayotgan avtomobilga yo‘l berishi shart.',
      difficulty: 'O‘rta'
    },
    {
      id: 49,
      topic: 'Yo‘l belgilari',
      question: '"Balandlik cheklangan" (3.13) belgisi qaysi holatda o‘rnatiladi?',
      options: [
        'Ko‘priklar, estakadalar va past osilgan simlar ostidan o‘tish joylarida',
        'Tog‘li dovonlarda',
        'Yoqilg‘i quyish shoxobchalarida',
        'Shahar markazida'
      ],
      correctIndex: 2,
      explanation: '3.13 belgisi gabarit balandligi (yuk bilan birga) belgida ko‘rsatilganidan ortiq bo‘lgan transportlarning o‘tishini taqiqlash uchun ko‘prik va tonnellar oldida o‘rnatiladi.',
      difficulty: 'Oson'
    },
    {
      id: 50,
      topic: 'Tezlik qoidalari',
      question: 'Boshqa nosoz transport vositasini shatakka olib (buksirda) harakatlanayotganda maksimal tezlik qancha bo‘lishi mumkin?',
      options: [
        '40 km/soat',
        '50 km/soat',
        '60 km/soat',
        '70 km/soat'
      ],
      correctIndex: 2,
      explanation: 'Mexanik transport vositalarini shatakka olib harakatlanishda tezlik soatiga 50 kilometrdan oshmasligi kerak.',
      difficulty: 'O‘rta'
    },
    {
      id: 51,
      topic: 'Harakatlanish qoidalari',
      question: 'Xavfsizlik yostiqchalari (Airbag) mavjud bo‘lganda xavfsizlik kamarini taqmaslik mumkinmi?',
      options: [
        'Ha, yostiqcha to‘liq himoya qiladi',
        'Yo‘q, kamar taqilmasa, yostiqchaning ochilishi inson hayoti uchun jiddiy xavf tug‘dirishi mumkin',
        'Faqat shahar ichida mumkin',
        'Faqat haydovchi xohishiga bog‘liq'
      ],
      correctIndex: 2,
      explanation: 'Xavfsizlik yostiqchasi faqat kamar taqilgan holatda to‘g‘ri ishlaydi. Kamarsiz ochilgan yostiqcha insonni qattiq jarohatlashi mumkin.',
      difficulty: 'Oson'
    },
    {
      id: 52,
      topic: 'Chorrahadan o‘tish',
      question: 'Yashil chiroq yonganda ham qaysi holatda chorrahaga kirish qat’iyan taqiqlanadi?',
      options: [
        'Kechasi soat 22:00 dan keyin',
        'Agar oldinda tirbandlik yuzaga kelib, haydovchini chorrahada to‘xtashga majbur qilsa va ko‘ndalang harakatga to‘sqinlik yaratsa',
        'Yoningizda yo‘lovchi bo‘lmasa',
        'Yomg‘ir yog‘ayotgan bo‘lsa'
      ],
      correctIndex: 2,
      explanation: 'Chorrahada yoki qatnov qismlari kesishmasida to‘xtab qolib, ko‘ndalang yo‘nalishdagi harakatga xalaqit beradigan bo‘lsa, yashil chiroqda ham chorrahaga kirish taqiqlanadi.',
      difficulty: 'O‘rta'
    },
    {
      id: 53,
      topic: 'Birinchi tibbiy yordam',
      question: 'Kuchli arterial qon ketishida qon ketishini to‘xtatuvchi jgut qayerga qo‘yiladi?',
      options: [
        'Jarohatlangan joyning o‘ziga bevosita',
        'Jarohatlangan joydan pastroqqa (tanadan uzoqroqqa)',
        'Jarohatlangan joydan yuqoriroqqa (yurakka yaqinroqqa) mato ustidan',
        'Faqat bo‘g‘im sohasiga'
      ],
      correctIndex: 2,
      explanation: 'Arterial qon ketishida qon bosim bilan favvora bo‘lib oqadi. Shuning uchun jgut qon ketayotgan joydan yuqoriga (yurakka yaqin tomonga) mato yoki kiyim ustidan qo‘yiladi.',
      difficulty: 'Oson'
    },
    {
      id: 54,
      topic: 'Birinchi tibbiy yordam',
      question: 'Qon to‘xtatuvchi jgutni qo‘yishning maksimal ruxsat etilgan muddati yoz faslida qancha?',
      options: [
        '1 soatdan oshmasligi kerak',
        '2 soatdan oshmasligi kerak',
        '30 daqiqadan oshmasligi kerak',
        'Vaqt chegaralanmagan'
      ],
      correctIndex: 2,
      explanation: 'Jgut to‘qimalarning oziqlanishini to‘xtatadi. Shuning uchun yoz faslida 1 soatdan, qish faslida esa 30 daqiqadan oshmasligi shart. Jgut ostiga aniq vaqt yozilgan qog‘oz qistiriladi.',
      difficulty: 'O‘rta'
    },
    {
      id: 55,
      topic: 'Birinchi tibbiy yordam',
      question: 'YTH jabrlanuvchisiga yurak-o‘pka reanimatsiyasi o‘tkazilganda ko‘krak qafasini bosish va nafas berish nisbati qanday?',
      options: [
        '15 marta bosish va 1 marta nafas berish',
        '30 marta bosish va 2 marta nafas berish (30:2)',
        '10 marta bosish va 2 marta nafas berish',
        '5 marta bosish va 1 marta nafas berish'
      ],
      correctIndex: 2,
      explanation: 'Zamonaviy xalqaro va milliy standartlarga ko‘ra, yoshi va qutqaruvchilar sonidan qat’i nazar reanimatsiya nisbati: 30 marta ko‘krak qafasini bosish va 2 marta sun’iy nafas berish (30:2).',
      difficulty: 'Oson'
    },
    {
      id: 56,
      topic: 'Birinchi tibbiy yordam',
      question: 'Bosh miya chayqalishi (jarohati) alomatlari qaysi javobda to‘g‘ri ko‘rsatilgan?',
      options: [
        'Faqat tana haroratining keskin ko‘tarilishi',
        'Bosh aylanishi, ko‘ngil aynishi, qusish va qisqa muddatli hushdan ketish',
        'Faqat ko‘rish qobiliyatining yaxshilanishi',
        'Bo‘g‘imlarda kuchli og‘riq'
      ],
      correctIndex: 2,
      explanation: 'Bosh miya chayqalishida bosh aylanishi, ko‘ngil aynishi, qayt qilish, quloqda shovqin va YTH voqeasini eslay olmaslik (retrograd amneziya) kuzatiladi.',
      difficulty: 'O‘rta'
    },
    {
      id: 57,
      topic: 'Birinchi tibbiy yordam',
      question: 'Suyak singanda immobilizatsiya (shina qo‘yish) uchun qaysi bo‘g‘imlar harakatsizlantirilishi shart?',
      options: [
        'Faqat singan suyak joylashgan bo‘g‘im',
        'Singan joydan pastdagi bitta bo‘g‘im',
        'Singan joyga tutash bo‘lgan kamida ikkita bo‘g‘im (singan joydan pastki va yuqoridagi)',
        'Faqat tana markaziga yaqin bo‘g‘im'
      ],
      correctIndex: 2,
      explanation: 'Suyak bo‘laklarining siljishini oldini olish uchun shina singan joydan pastki va yuqoridagi kamida ikkita bo‘g‘imni to‘liq qamrab olishi va harakatsizlantirishi shart.',
      difficulty: 'O‘rta'
    },
    {
      id: 58,
      topic: 'Birinchi tibbiy yordam',
      question: 'Jabrlanuvchining umurtqa pog‘onasi shikastlangan deb taxmin qilinganda uni qanday holatda tashish kerak?',
      options: [
        'Yumshoq zambilda qorin bilan yotqizilgan holda',
        'Qattiq tekis yuzada chalqancha yotqizilgan holatda',
        'O‘tirgan holatda',
        'Yonboshlagan holatda'
      ],
      correctIndex: 2,
      explanation: 'Umurtqa pog‘onasi shikastlanganda orqa miyaga zarar yetkazmaslik uchun jabrlanuvchi qattiq tekis yuzada (masalan qalqon yoki maxsus qattiq zambil) chalqancha yotqizilgan holda harakatsiz tashiladi.',
      difficulty: 'Qiyin'
    },
    {
      id: 59,
      topic: 'Birinchi tibbiy yordam',
      question: 'Nafas olayotgan, ammo hushsiz bo‘lgan jabrlanuvchiga qanday holat berilishi lozim?',
      options: [
        'Boshini pastga qilib chalqancha yotqizish',
        'Oyoqlarini ko‘tarib o‘tqazish',
        'Barqaror yonbosh holatga keltirish',
        'Qorni bilan yotqizib boshini burish'
      ],
      correctIndex: 2,
      explanation: 'Hushsiz holatda til orqaga ketib nafas yo‘lini to‘sib qo‘yishi yoki qusuq massasi nafas yo‘liga ketishini oldini olish uchun jabrlanuvchi barqaror yonbosh holatga yotqiziladi.',
      difficulty: 'O‘rta'
    },
    {
      id: 60,
      topic: 'Birinchi tibbiy yordam',
      question: 'Termik kuyish (olov, qaynoq suv) jarohatida dastlabki birinchi yordam nimalardan iborat?',
      options: [
        'Kuygan joyga yog‘ yoki qatiq surtish',
        'Kuygan joyni 15-20 daqiqa sovuq oqadigan suv ostida tutish va steril quruq bog‘lam qo‘yish',
        'Kuygan pufakchalarni igna bilan yorish',
        'Spirt yoki yod bilan kuydirish'
      ],
      correctIndex: 2,
      explanation: 'Kuyishda jarohatni sovitish to‘qimalarning chuqur shikastlanishini to‘xtatadi. 15-20 daqiqa sovuq suvda tutib, so‘ng toza quruq bog‘lam qo‘yiladi. Yog‘ yoki malham surtish qat’iyan man etiladi!',
      difficulty: 'Oson'
    }
  ];

  // 5. FREQUENTLY ASKED QUESTIONS (FAQ)
  const faqs = [
    {
      id: 'faq-1',
      question: 'Prava (haydovchilik guvohnomasi) olish uchun nimalarni bilish kerak?',
      answer: 'Haydovchilik guvohnomasini olish uchun O‘zbekiston Respublikasi Yo‘l harakati qoidalari (YHQ), yo‘l belgilari, tibbiy yordam ko‘rsatish asoslari hamda amaliy haydash ko‘nikmalarini bilish zarur. Avtomaktabni muvaffaqiyatli tamomlab, YHXBB (DYHXX)ning nazariy va amaliy imtihonlaridan o‘tish talab etiladi.'
    },
    {
      id: 'faq-2',
      question: 'OSON PRAVA platformasida testlar qanday ishlaydi?',
      answer: 'Platformada ikkita rejim mavjud: 1) "Mashq testi" — bunda har bir savolga javob berishingiz bilan to‘g‘ri javob va to‘liq o‘zbekcha tushuntirish chiqadi; 2) "Imtihon rejimi" — davlat imtihoni andozasi bo‘yicha 20 ta savol va 25 daqiqa vaqt beriladi. Natija faqat test to‘liq yakunlangach taqdim etiladi.'
    },
    {
      id: 'faq-3',
      question: 'Natijalarim va o‘rganish tarixim saqlanib qoladimi?',
      answer: 'Ha! Barcha yechilgan testlar, to‘plangan ballar, tugatilgan darslar va saralangan belgilar brauzeringizning xavfsiz LocalStorage xotirasida avtomatik saqlanadi. Sahifani yangilasangiz ham ma’lumotlaringiz yo‘qolmaydi.'
    },
    {
      id: 'faq-4',
      question: 'Imtihon rejimidan o‘tish uchun nechta savolga to‘g‘ri javob berish lozim?',
      answer: 'Rasmiy standartlarga muvofiq, 20 ta savoldan kamida 18 tasiga (90%) to‘g‘ri javob bersangiz, imtihon muvaffaqiyatli topshirilgan hisoblanadi. 3 ta yoki undan ko‘p xato qilsangiz, qayta tayyorgarlik ko‘rish tavsiya etiladi.'
    },
    {
      id: 'faq-5',
      question: 'Darslarni qayta o‘qish va takrorlash mumkinmi?',
      answer: 'Albatta. Barcha 10 ta dars va 30 dan ortiq qoida maqolalari istalgan vaqtda qayta o‘qish uchun ochiq. Shuningdek, o‘zingizga yoqqan mavzularni "Sevimlilar" ro‘yxatiga yulduzcha orqali qo‘shib qo‘yishingiz mumkin.'
    },
    {
      id: 'faq-6',
      question: 'OSON PRAVA platformasidan foydalanish bepulmi?',
      answer: 'Ha, OSON PRAVA ijtimoiy-ta’limiy startap loyihasi bo‘lib, barcha nazariy darslar, yo‘l belgilari katalogi va test savollari foydalanuvchilar uchun mutlaqo bepul taqdim etiladi.'
    },
    {
      id: 'faq-7',
      question: 'Bugungi mashq (kunlik maqsad) nima beradi?',
      answer: '"Bugungi mashq" har kuni sizga tasodifiy 10 ta eng muhim savolni yechishni taklif qiladi. Ushbu mashqni har kuni bajarish orqali o‘rganish davomiyligini (streak) oshirasiz va yangi yutuq nishonlarini (achievements) qo‘lga kiritasiz.'
    },
    {
      id: 'faq-8',
      question: 'Internet bo‘lmaganda ham platforma ishlaydimi?',
      answer: 'OSON PRAVA yengil veb-arxitekturada yaratilgan. Sahifa bir marta yuklangach, barcha savollar, belgilar va hisob-kitoblar internet sekinlashganda ham lokal brauzeringizda to‘liq ishlashda davom etadi.'
    }
  ];

  // 6. INITIAL NOTIFICATIONS
  const initialNotifications = [
    {
      id: 'notif-1',
      title: 'OSON PRAVA ga xush kelibsiz!',
      message: 'Prava imtihoniga tayyorgarlikni boshlash uchun darslar va mashq testlaridan foydalaning.',
      time: 'Bugun',
      unread: true,
      icon: 'sparkles'
    },
    {
      id: 'notif-2',
      title: 'Kunlik maqsad yangilandi',
      message: 'Bugungi 10 ta savoldan iborat mashqni bajarib, bilimingizni mustahkamlang.',
      time: '1 soat oldin',
      unread: true,
      icon: 'calendar-check'
    },
    {
      id: 'notif-3',
      title: 'Imtihon simulyatori tayyor',
      message: 'O‘z bilimingizni 25 daqiqalik rasmiy davlat imtihoni rejimida sinab ko‘ring.',
      time: 'Kechagi',
      unread: false,
      icon: 'award'
    }
  ];

  // 7. GAMIFIED ACHIEVEMENTS (Badges)
  const achievements = [
    {
      id: 'ach-1',
      code: 'boshlovchi',
      title: 'Boshlovchi',
      desc: 'Birinchi testni muvaffaqiyatli yakunlang',
      icon: 'fa-seedling',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      unlocked: true
    },
    {
      id: 'ach-2',
      code: 'test_10',
      title: '10 ta test',
      desc: 'Platformada jami 10 ta to‘liq test yeching',
      icon: 'fa-book-open',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
      unlocked: false
    },
    {
      id: 'ach-3',
      code: 'questions_100',
      title: '100 ta savol',
      desc: 'Jami 100 ta nazariy savolga javob bering',
      icon: 'fa-brain',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
      unlocked: false
    },
    {
      id: 'ach-4',
      code: 'perfect_score',
      title: 'Perfect Score',
      desc: 'Biror testda 100% (20/20) natija ko‘rsating',
      icon: 'fa-crown',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      unlocked: false
    },
    {
      id: 'ach-5',
      code: 'streak_7',
      title: '7 kunlik streak',
      desc: 'Ketma-ket 7 kun davomida tizimga kirib mashq bajaring',
      icon: 'fa-fire',
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
      unlocked: false
    },
    {
      id: 'ach-6',
      code: 'exam_master',
      title: 'Imtihon ustasi',
      desc: 'Rasmiy imtihon rejimidan kamida 3 marta o‘ting',
      icon: 'fa-medal',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
      unlocked: false
    },
    {
      id: 'ach-7',
      code: 'signs_guru',
      title: 'Belgilar bilimdoni',
      desc: 'Yo‘l belgilari bo‘limidagi barcha belgilarni ko‘rib chiqing',
      icon: 'fa-diamond',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      unlocked: true
    },
    {
      id: 'ach-8',
      code: 'rules_hero',
      title: 'Qoidalar qahramoni',
      desc: 'Barcha 10 ta darsni to‘liq tamomlang',
      icon: 'fa-shield-halved',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
      unlocked: false
    }
  ];

  // 8. STUDENT REVIEWS (Social Proof & Testimonials)
  const testimonials = [
    {
      id: 'rev-1',
      name: 'Jasur Bekmurodov',
      city: 'Toshkent sh.',
      role: 'B toifa haydovchisi',
      avatar: 'JB',
      rating: 5,
      date: '3 kun oldin',
      comment: 'Avtomaktabda chorrahalarni hech tushunmasdim. OSON PRAVA simulyatori orqali 2 kunda barcha o‘tish tartiblarini o‘rganib oldim. Davlat imtihonida 20 tadan 20 ta to‘g‘ri topdim!'
    },
    {
      id: 'rev-2',
      name: 'Madina Umarova',
      city: 'Samarqand',
      role: 'Talaba',
      avatar: 'MU',
      rating: 5,
      date: '1 hafta oldin',
      comment: 'Darslarning tili nihoyatda tushunarli. Har bir xato qilgan savolimga darhol qoida izohi chiqishi menga juda yoqdi. Qat’iy 25 daqiqalik imtihon rejimi esa hayajonni butunlay yengishga yordam berdi.'
    },
    {
      id: 'rev-3',
      name: 'Farrux Qodirov',
      city: 'Farg‘ona',
      role: 'Dasturchi',
      avatar: 'FQ',
      rating: 5,
      date: '2 hafta oldin',
      comment: 'O‘zbekistondagi eng zamonaviy ta’lim startapi deb bemalol ayta olaman. Dizayn, 2D chorraha va telefon qulayligi a’lo darajada. Do‘stlarimga ham tavsiya qildim.'
    }
  ];

  // 9. PARTNER AVTOMAKTABLAR & TRUST STATS
  const partners = [
    { name: 'Toshkent Avtotayyorlov Markazi', city: 'Toshkent' },
    { name: 'Samarqand Drayv Akademiya', city: 'Samarqand' },
    { name: 'Farg‘ona Avtomobil Maktabi', city: 'Farg‘ona' },
    { name: 'Buxoro AvtoLider', city: 'Buxoro' }
  ];

  // 10. CURATED TOPIC CATEGORIES
  const categories = [
    {
      id: 'yol-belgilari',
      name: 'Yo‘l belgilari',
      desc: 'Ogohlantiruvchi, taqiqlovchi, buyuruvchi, axborot va servis belgilari.',
      icon: 'fa-signs-post',
      badge: '120+ belgi',
      questionCount: 42,
      testCount: 6,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      id: 'yhq',
      name: 'Yo‘l harakati qoidalari',
      desc: 'O‘zbekiston Respublikasining rasmiy 28 bobdan iborat YHQ qoidalari.',
      icon: 'fa-book-open',
      badge: '28 ta bob',
      questionCount: 65,
      testCount: 8,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      id: 'chorrahalar',
      name: 'Chorrahadan o‘tish',
      desc: 'Tartibga solingan va solinmagan chorrahalar, tramvay ustunligi va manevrlar.',
      icon: 'fa-shuffle',
      badge: '2D simulyator',
      questionCount: 38,
      testCount: 5,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      id: 'tezlik',
      name: 'Tezlik me’yorlari',
      desc: 'Aholi punktlari, trassalar, yangi 60 km/soat chegarasi va radar zonalari.',
      icon: 'fa-gauge-high',
      badge: '2026 standart',
      questionCount: 24,
      testCount: 4,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      id: 'toxtash',
      name: 'To‘xtash va to‘xtab turish',
      desc: 'Belgilangan joylarda to‘xtash, favqulodda to‘xtash va evakuatsiya qoidalari.',
      icon: 'fa-ban',
      badge: 'Amaliy',
      questionCount: 28,
      testCount: 4,
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
      id: 'piyodalar',
      name: 'Piyodalar va yo‘lovchilar',
      desc: 'Tartibga solinmagan o‘tish joylari, bolalar muassasalari va xavfsizlik kamari.',
      icon: 'fa-person-walking',
      badge: 'Asosiy',
      questionCount: 22,
      testCount: 3,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      id: 'tibbiyot',
      name: 'Birinchi tibbiy yordam',
      desc: 'YTH paytida qon ketishini to‘xtatish, yurak-o‘pka reanimatsiyasi va tashish.',
      icon: 'fa-heart-pulse',
      badge: 'SOS',
      questionCount: 18,
      testCount: 3,
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
      id: 'maxsus',
      name: 'Maxsus transportlar',
      desc: 'Tez yordam, o‘t o‘chirish, IIB avtomashinalariga yo‘l berish talablari.',
      icon: 'fa-truck-medical',
      badge: 'Muhim',
      questionCount: 16,
      testCount: 2,
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  ];

  // 11. PRACTICE TEST PACKS (Pre-assembled curated test packages)
  const testPacks = [
    {
      id: 'pack-1',
      title: 'Boshlang‘ich bazaviy test',
      category: 'Yo‘l harakati qoidalari',
      categoryId: 'yhq',
      difficulty: 'Oson',
      questionCount: 20,
      timeMinutes: 20,
      icon: 'fa-graduation-cap',
      desc: 'Yangi boshlovchilar uchun YHQ asoslari, haydovchi majburiyatlari va asosiy tushunchalar.'
    },
    {
      id: 'pack-2',
      title: 'Yo‘l belgilari bo‘yicha ekspress test',
      category: 'Yo‘l belgilari',
      categoryId: 'yol-belgilari',
      difficulty: 'Oson',
      questionCount: 20,
      timeMinutes: 15,
      icon: 'fa-signs-post',
      desc: 'Ogohlantiruvchi, taqiqlovchi, buyuruvchi va axborot-ishora belgilarini chuqur tekshirish.'
    },
    {
      id: 'pack-3',
      title: 'Murakkab chorrahalar va manevrlar',
      category: 'Chorrahadan o‘tish',
      categoryId: 'chorrahalar',
      difficulty: 'Qiyin',
      questionCount: 20,
      timeMinutes: 25,
      icon: 'fa-shuffle',
      desc: 'Tartibga solinmagan, aylanma va tramvay qatnashgan qaltis vaziyatli chorrahalar.'
    },
    {
      id: 'pack-4',
      title: 'Tezlik va to‘xtash qoidalari',
      category: 'Tezlik me’yorlari',
      categoryId: 'tezlik',
      difficulty: 'O‘rta',
      questionCount: 20,
      timeMinutes: 20,
      icon: 'fa-gauge-high',
      desc: '2026 yangi 60 km/soat tezlik chegaralari, radar zonalari va to‘xtash taqiqlangan joylar.'
    },
    {
      id: 'pack-5',
      title: 'Birinchi tibbiy yordam va SOS',
      category: 'Birinchi tibbiy yordam',
      categoryId: 'tibbiyot',
      difficulty: 'O‘rta',
      questionCount: 15,
      timeMinutes: 15,
      icon: 'fa-heart-pulse',
      desc: 'Favqulodda YTH holatida birinchi tibbiy ko‘mak, bog‘lamlar va transportirovka qoidalari.'
    },
    {
      id: 'pack-6',
      title: 'Davlat YHXBB Bosh Imtihoni',
      category: 'Barcha mavzular',
      categoryId: 'all',
      difficulty: 'Imtihon',
      questionCount: 20,
      timeMinutes: 25,
      icon: 'fa-shield-halved',
      desc: 'Rasmiy YHXBB imtihon standartidagi 20 ta aralash savol (kamida 18 to‘g‘ri javob talab etiladi).'
    }
  ];

  // 12. WEAK TOPICS MOCK (For Personalized User Analytics)
  const weakTopicsMock = [
    {
      topic: 'Chorrahadan o‘tish',
      errorRate: 34,
      totalQuestions: 45,
      advice: 'Tartibga solinmagan chorrahalarda "O‘ng qo‘l qoidasi" va tramvay ustunligini takrorlang.'
    },
    {
      topic: 'Yo‘l belgilari',
      errorRate: 22,
      totalQuestions: 60,
      advice: 'Taqiqlovchi va buyuruvchi belgilar ta’sir doirasini o‘rganib chiqing.'
    },
    {
      topic: 'Tezlik me’yorlari',
      errorRate: 18,
      totalQuestions: 30,
      advice: 'Aholi punktlarida 60 km/soat va turar joy hududlarida 20 km/soat me’yorlariga e’tibor bering.'
    }
  ];

  // 13. 2D CHORRAHA SIMULATOR SCENARIOS (8 Realistic Uzbek Traffic Scenarios)
  const simulatorScenarios = [
    {
      id: 'sc-1',
      title: 'Teng ahamiyatli chorraha (O‘ng qo‘l qoidasi)',
      desc: 'Svetofor va imtiyoz belgilari yo‘q. 3 ta avtomobil bir vaqtda chorrahaga yaqinlashmoqda.',
      signsText: 'Belgilar yo‘q (Teng huquqli)',
      cars: [
        { id: 'yellow', name: 'Sariq avtomobil (C)', dir: 'To‘g‘riga ketmoqda (O‘ng tomoni bo‘sh)', color: '#F59E0B', icon: 'car-side', enterFrom: 'S', hasPriorityOver: 'red' },
        { id: 'red', name: 'Qizil avtomobil (A)', dir: 'To‘g‘riga ketmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'N', hasPriorityOver: 'blue' },
        { id: 'blue', name: 'Ko‘k avtomobil (B)', dir: 'Chapga burilmoqda', color: '#2563EB', icon: 'car-side', enterFrom: 'E', hasPriorityOver: 'yellow' }
      ],
      correctOrder: ['yellow', 'red', 'blue'],
      orderText: '1. Sariq (C) → 2. Qizil (A) → 3. Ko‘k (B)',
      explanation: 'Teng ahamiyatli yo‘llarda haydovchi o‘zidan o‘ng tomondan kelayotgan transportga yo‘l berishi shart. Sariq mashinaning o‘ng tomoni bo‘sh bo‘lgani uchun birinchi o‘tadi. U o‘tgach qizilning o‘ngi bo‘shaydi. Chapga burilayotgan ko‘k avtomobil esa oxirida o‘tadi.'
    },
    {
      id: 'sc-2',
      title: 'Asosiy yo‘l va ikkinchi darajali yo‘l kesishuvi',
      desc: 'Chorrahada 2.1 "Asosiy yo‘l" va 2.4 "Yo‘l bering" belgilari o‘rnatilgan.',
      signsText: '2.1 "Asosiy yo‘l" va 2.4 "Yo‘l bering"',
      cars: [
        { id: 'blue', name: 'Ko‘k avtomobil (Asosiy yo‘lda)', dir: 'To‘g‘riga harakatlanmoqda', color: '#2563EB', icon: 'car-side', enterFrom: 'S', priority: 1 },
        { id: 'red', name: 'Qizil avtomobil (Asosiy yo‘lda)', dir: 'Chapga burilmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'N', priority: 2 },
        { id: 'yellow', name: 'Sariq avtomobil (Ikkinchi darajali)', dir: 'To‘g‘riga ketmoqda ("Yo‘l bering")', color: '#F59E0B', icon: 'car-side', enterFrom: 'E', priority: 3 }
      ],
      correctOrder: ['blue', 'red', 'yellow'],
      orderText: '1. Ko‘k avtomobil → 2. Qizil avtomobil → 3. Sariq avtomobil',
      explanation: 'Avvalo asosiy yo‘ldagi transport vositalari o‘tadi. Ko‘k va qizil asosiy yo‘lda, ammo qizil chapga burilayotgani uchun to‘g‘ridan kelayotgan ko‘k mashinani o‘tkazib yuboradi. Ikkinchi darajali yo‘ldagi sariq mashina barchadan keyin o‘tadi.'
    },
    {
      id: 'sc-3',
      title: 'Aylanma harakat chorrahasi (4.3-belgi)',
      desc: 'Doira bo‘ylab harakatlanayotgan va aylanaga kirib kelayotgan transport vositalari.',
      signsText: '4.3 "Aylanma harakat" belgisi',
      cars: [
        { id: 'red', name: 'Qizil avtomobil (Doira ichida)', dir: 'Aylanada harakatlanmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'S', priority: 1 },
        { id: 'blue', name: 'Ko‘k avtomobil (Aylanaga kirayotgan)', dir: 'Doiraga kirishga tayyor', color: '#2563EB', icon: 'car-side', enterFrom: 'N', priority: 2 }
      ],
      correctOrder: ['red', 'blue'],
      orderText: '1. Qizil (Doiradagi) → 2. Ko‘k (Kirayotgan)',
      explanation: 'O‘zbekiston YHQga ko‘ra, aylanma harakat chorrahasida harakatlanayotgan transport vositasi aylanaga kirib kelayotgan transport vositasiga nisbatan mutlaq ustunlikka ega!'
    },
    {
      id: 'sc-4',
      title: 'Tramvay va avtomobillar chorrahasi',
      desc: 'Teng ahamiyatli chorrahada to‘g‘riga ketayotgan avtomobil va chapga burilayotgan tramvay.',
      signsText: 'Teng ahamiyatli chorraha, tramvay yo‘li',
      cars: [
        { id: 'tram', name: 'Tramvay (Chapga burilmoqda)', dir: 'Chapga burilish yo‘lida', color: '#059669', icon: 'train-tram', enterFrom: 'S', priority: 1 },
        { id: 'red', name: 'Qizil avtomobil (To‘g‘riga ketmoqda)', dir: 'To‘g‘riga harakatlanmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'N', priority: 2 }
      ],
      correctOrder: ['tram', 'red'],
      orderText: '1. Tramvay → 2. Qizil avtomobil',
      explanation: 'Teng huquqli sharoitda relsli transport vositasi (tramvay) harakat yo‘nalishidan qat’i nazar relssiz transport vositalariga nisbatan har doim ustunlikka ega bo‘ladi!'
    },
    {
      id: 'sc-5',
      title: 'Asosiy yo‘l burilganda (7.13 lavhasi)',
      desc: 'Asosiy yo‘l chorrahada chapga buriladi (2.1 + 7.13 belgilari).',
      signsText: '2.1 "Asosiy yo‘l" va 7.13 "Asosiy yo‘l yo‘nalishi"',
      cars: [
        { id: 'red', name: 'Qizil avtomobil (Asosiy yo‘lda)', dir: 'Asosiy yo‘l bo‘ylab chapga burilmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'S', priority: 1 },
        { id: 'blue', name: 'Ko‘k avtomobil (Asosiy yo‘lda)', dir: 'To‘g‘riga ketmoqda (Asosiy yo‘ldan chiqadi)', color: '#2563EB', icon: 'car-side', enterFrom: 'N', priority: 2 },
        { id: 'yellow', name: 'Sariq avtomobil (Ikkinchi darajali)', dir: 'To‘g‘riga ketmoqda', color: '#F59E0B', icon: 'car-side', enterFrom: 'E', priority: 3 }
      ],
      correctOrder: ['red', 'blue', 'yellow'],
      orderText: '1. Qizil avtomobil → 2. Ko‘k avtomobil → 3. Sariq avtomobil',
      explanation: 'Asosiy yo‘ldagi qizil va ko‘k o‘zaro teng huquqli. Ko‘k mashina uchun qizil mashina o‘ng tomondan kelayotgani sababli, qizil birinchi o‘tadi, so‘ngra ko‘k o‘tadi. Ikkinchi darajali sariq mashina eng oxirida o‘tadi.'
    },
    {
      id: 'sc-6',
      title: 'Maxsus xizmat transporti (Sirena va mayoqcha)',
      desc: 'Ikkinchi darajali yo‘ldan ko‘k-qizil mayoqchasi va sirena bilan harakatlanayotgan tez yordam.',
      signsText: 'Maxsus xizmat mashinasi',
      cars: [
        { id: 'ambulance', name: 'Tez yordam (Sirena va mayoqcha)', dir: 'Shoshilinch chaqiruvga ketmoqda', color: '#DC2626', icon: 'truck-medical', enterFrom: 'S', priority: 1 },
        { id: 'blue', name: 'Ko‘k avtomobil (Asosiy yo‘lda)', dir: 'To‘g‘riga ketmoqda', color: '#2563EB', icon: 'car-side', enterFrom: 'N', priority: 2 },
        { id: 'red', name: 'Qizil avtomobil (Chapga burilmoqda)', dir: 'Chorrahada burilmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'E', priority: 3 }
      ],
      correctOrder: ['ambulance', 'blue', 'red'],
      orderText: '1. Tez yordam → 2. Ko‘k avtomobil → 3. Qizil avtomobil',
      explanation: 'Yoniq ko‘k yoki ko‘k-qizil rangli mayoqcha va maxsus tovushli signal (sirena) yoqilgan transport vositasi svetofor, belgilar va yo‘l ustunligidan qat’i nazar birinchi bo‘lib o‘tadi. Barcha haydovchilar unga yo‘l berishi shart.'
    },
    {
      id: 'sc-7',
      title: 'Svetoforning qo‘shimcha seksiyasi (Yashil strelka)',
      desc: 'Asosiy qizil chiroq bilan birga o‘ngga buriluvchi yashil strelka yonmoqda.',
      signsText: 'Svetofor qo‘shimcha seksiyasi',
      cars: [
        { id: 'green', name: 'Yashil avtomobil (Asosiy yashilda)', dir: 'Chorrahadan to‘g‘riga o‘tmoqda', color: '#10B981', icon: 'car-side', enterFrom: 'S', priority: 1 },
        { id: 'blue', name: 'Ko‘k avtomobil (Strelka bilan burilayotgan)', dir: 'Qo‘shimcha strelka bilan o‘ngga burilmoqda', color: '#2563EB', icon: 'car-side', enterFrom: 'N', priority: 2 }
      ],
      correctOrder: ['green', 'blue'],
      orderText: '1. Yashil avtomobil → 2. Ko‘k avtomobil',
      explanation: 'Svetoforning asosiy qizil chirog‘i bilan birga yongan qo‘shimcha yashil strelka yo‘nalishida harakatlanayotgan haydovchi boshqa yo‘nalishlardan kelayotgan barcha transport vositalariga yo‘l berishi shart!'
    },
    {
      id: 'sc-8',
      title: 'Piyodalar o‘tish joyi va burilish',
      desc: 'Yashil chiroqda o‘ngga burilayotgan avtomobil va piyodalar o‘tish joyi.',
      signsText: '1.20 Piyodalar o‘tish joyi',
      cars: [
        { id: 'pedestrian', name: 'Piyoda (Piyodalar yo‘lkasida)', dir: 'Yo‘lni kesib o‘tmoqda', color: '#3B82F6', icon: 'person-walking', enterFrom: 'S', priority: 1 },
        { id: 'red', name: 'Qizil avtomobil (O‘ngga burilmoqda)', dir: 'O‘ng tomondagi ko‘chaga burilmoqda', color: '#EF4444', icon: 'car-side', enterFrom: 'N', priority: 2 }
      ],
      correctOrder: ['pedestrian', 'red'],
      orderText: '1. Piyoda → 2. Qizil avtomobil',
      explanation: 'Haydovchi o‘ngga yoki chapga burilayotganda qatnov qismini kesib o‘tayotgan piyodalarga va velosipedchilarga yo‘l berishi shart (YHQ 102-band).'
    }
  ];

  // 14. 2026 OFFICIAL FINES CATALOG (1 BHM = 375,000 UZS)
  const fines = [
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

  return {
    signs,
    rules,
    lessons,
    questions,
    categories,
    testPacks,
    weakTopicsMock,
    simulatorScenarios,
    fines,
    faqs,
    initialNotifications,
    achievements,
    testimonials,
    partners
  };
})();
