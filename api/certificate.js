/**
 * OSON PRAVA - Certificate PDF download endpoint.
 *
 * This function is deliberately self-contained: it does NOT import server.js.
 * That keeps the Vercel serverless function small and prevents unrelated app
 * initialization from breaking certificate generation.
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const FONT_REGULAR = path.join(process.cwd(), 'assets', 'fonts', 'DejaVuSans.ttf');
const FONT_BOLD = path.join(process.cwd(), 'assets', 'fonts', 'DejaVuSans-Bold.ttf');

function clean(v, max, fallback = '') {
  const s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
  return s || fallback;
}

function number(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function decodePayload(raw) {
  // URLSearchParams.get() already percent-decodes the query parameter.
  // Still tolerate callers that send an encoded value.
  let value = String(raw || '');
  try { value = decodeURIComponent(value); } catch (_) {}
  value = value.replace(/ /g, '+');
  const json = Buffer.from(value, 'base64').toString('utf8');
  return JSON.parse(json);
}

function sanitize(raw) {
  const total = Math.max(1, Math.round(number(raw.total, 20)));
  const score = Math.max(0, Math.min(total, Math.round(number(raw.score, 0))));
  const percentage = Math.max(0, Math.min(100, Math.round(number(raw.percentage, (score / total) * 100))));
  const year = Math.max(2000, Math.min(2100, Math.round(number(raw.year, new Date().getFullYear()))));
  return {
    userName: clean(raw.userName, 100, 'Foydalanuvchi'),
    score, total, percentage,
    grade: clean(raw.grade, 50, "A’LO (PASS)"),
    certificateId: clean(raw.certificateId, 50, `OP-${year}-000000`),
    dateStr: clean(raw.dateStr, 80, new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })),
    year,
    isDemo: !!raw.isDemo
  };
}

function makePdf(cert) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0, autoFirstPage: true });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const regular = fs.existsSync(FONT_REGULAR);
    const bold = fs.existsSync(FONT_BOLD);
    if (regular) doc.registerFont('OSON', FONT_REGULAR);
    if (bold) doc.registerFont('OSON-Bold', FONT_BOLD);
    const body = regular ? 'OSON' : 'Helvetica';
    const head = bold ? 'OSON-Bold' : 'Helvetica-Bold';

    const W = doc.page.width, H = doc.page.height;
    const gold = '#B45309', dark = '#0F172A', muted = '#64748B', blue = '#1E3A8A';
    const m = 22;

    doc.rect(m, m, W - 2*m, H - 2*m).lineWidth(2.2).strokeColor(gold).stroke();
    doc.rect(m + 6, m + 6, W - 2*(m + 6), H - 2*(m + 6)).lineWidth(.8).strokeColor(gold).stroke();

    let y = 62;
    if (cert.isDemo) {
      doc.font(head).fontSize(9).fillColor(gold).text('DEMO REJIM • NAMUNA SERTIFIKAT', 0, y, { width: W, align: 'center', characterSpacing: 1 });
      y += 20;
    }
    doc.font(head).fontSize(16).fillColor(dark).text('OSON PRAVA', 0, y, { width: W, align: 'center' });
    y += 22;
    doc.font(body).fontSize(9).fillColor(muted).text('Zamonaviy nazariy ta’lim platformasi', 0, y, { width: W, align: 'center' });
    y += 35;
    doc.font(head).fontSize(28).fillColor(gold).text('MUVAFFAQIYAT SERTIFIKATI', 0, y, { width: W, align: 'center', characterSpacing: 1.2 });
    y += 42;
    doc.font(body).fontSize(9).fillColor(muted).text('USHBU SERTIFIKAT TASDIQLAYDIKI:', 0, y, { width: W, align: 'center', characterSpacing: 1 });
    y += 25;
    doc.font(head).fontSize(22).fillColor(blue).text(cert.userName, 50, y, { width: W - 100, align: 'center' });
    y += 37;
    doc.font(body).fontSize(10.5).fillColor('#334155').text(
      'O‘zbekiston Respublikasi Yo‘l Harakati Qoidalari bo‘yicha OSON PRAVA nazariy kursi va davlat imtihoni formati simulyatsiyasini muvaffaqiyatli topshirdi.',
      W/2 - 280, y, { width: 560, align: 'center', lineGap: 3 }
    );
    y += 58;

    const gridW = 420, gridH = 60, gridX = W/2 - gridW/2;
    doc.roundedRect(gridX, y, gridW, gridH, 10).fillAndStroke('#FFFBEB', '#FDE68A');
    const cols = [
      ['TO‘PLANGAN BALL', `${cert.score} / ${cert.total}`],
      ['O‘ZLASHTIRISH', `${cert.percentage}%`],
      ['BAHOLASH', cert.grade]
    ];
    cols.forEach((c, i) => {
      const x = gridX + i * (gridW/3);
      doc.font(body).fontSize(7).fillColor(muted).text(c[0], x, y + 12, { width: gridW/3, align: 'center' });
      doc.font(head).fontSize(14).fillColor(i === 1 ? '#1D4ED8' : gold).text(c[1], x, y + 29, { width: gridW/3, align: 'center' });
    });
    y += gridH + 28;

    doc.moveTo(m + 30, y).lineTo(W - m - 30, y).lineWidth(.7).strokeColor('#E2E8F0').stroke();
    const rowY = y + 18;
    doc.font(head).fontSize(9).fillColor(dark).text(`Sertifikat №: ${cert.certificateId}`, 90, rowY, { width: 260 });
    doc.font(body).fontSize(8.5).fillColor(muted).text(`Berilgan sana: ${cert.dateStr}`, 90, rowY + 17, { width: 260 });
    doc.font(body).fontSize(7.5).fillColor(muted).text('OSON PRAVA', 90, rowY + 34, { width: 260 });

    // Reliable text verification target instead of a second optional package.
    // The URL is clickable in PDF viewers and can be copied/scanned manually.
    const verifyUrl = cert.isDemo ? 'https://osonprava.uz/verify/demo' : `https://osonprava.uz/verify/${encodeURIComponent(cert.certificateId)}`;
    doc.font(head).fontSize(7.5).fillColor(dark).text('Tekshirish:', W - 300, rowY, { width: 220, align: 'right' });
    doc.font(body).fontSize(6.5).fillColor(muted).text(verifyUrl, W - 300, rowY + 14, { width: 220, align: 'right', link: verifyUrl, underline: true });
    doc.font(body).fontSize(6.5).fillColor(muted).text('Sertifikat ID orqali haqiqiyligini tekshiring.', W - 300, rowY + 31, { width: 220, align: 'right' });

    doc.end();
  });
}

module.exports = async function handler(req, res) {
  const origin = req.headers && req.headers.origin;
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', origin === 'https://web.telegram.org' ? origin : '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.end();
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD, OPTIONS');
    return res.end('Method Not Allowed');
  }

  try {
    const requestUrl = new URL(req.url, 'https://osonprava.local');
    const raw = requestUrl.searchParams.get('data');
    if (!raw) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.end(JSON.stringify({ success: false, error: 'data parametri kerak' }));
    }

    const cert = sanitize(decodePayload(raw));
    const pdf = await makePdf(cert);
    const safeId = cert.certificateId.replace(/[^a-zA-Z0-9_-]/g, '') || 'CERT';
    const fileName = `OSON-PRAVA-SERTIFIKAT-${safeId}.pdf`;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', String(pdf.length));
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (origin === 'https://web.telegram.org') {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    if (req.method === 'HEAD') return res.end();
    return res.end(pdf);
  } catch (err) {
    console.error('[OSON PRAVA] certificate error:', err && err.stack ? err.stack : err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ success: false, error: 'Sertifikat generatsiya qilishda xatolik yuz berdi' }));
  }
};
