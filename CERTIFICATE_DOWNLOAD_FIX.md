# OSON PRAVA — Certificate Download Fix

Sertifikat yuklab olish oqimi yangilandi.

## Nimalar tuzatildi

- Sertifikat PDF endi asosiy oqimda server tomonda PDFKit orqali generatsiya qilinadi.
- Chrome va boshqa oddiy brauzerlarda `GET /api/certificate` orqali haqiqiy PDF yuklanadi.
- Telegram Mini App'da `Telegram.WebApp.downloadFile()` mavjud bo'lsa, Telegram'ning native downloader'i ishlatiladi.
- Eski Telegram clientlarda fallback sifatida PDF endpoint tashqi brauzerga ochiladi.
- Telegram Web iframe ichida HTML/DOM'dan PDF yasashga bog'liq eski oqim ishlatilmaydi.
- PDF `Content-Type: application/pdf` va `Content-Disposition: attachment` headerlari bilan qaytariladi.
- O'zbekcha belgilar va foydalanuvchi ismlari uchun DejaVu Sans fontlari server PDF'iga embed qilinadi.
- Client-side html2canvas/jsPDF faqat server endpoint vaqtincha ishlamasa fallback sifatida qoldirilgan.

## Tekshiruv

```bash
node --check js/certificate.js
node --check api/certificate.js
node --check server.js
node scratch/verify_certificate_download_fix.js
node scratch/test_certificate_download.js
```

Deployment uchun `npm install` yoki Vercel dependency install jarayoni `package.json`dagi `pdfkit` va `qrcode` paketlarini o'rnatishi kerak.
