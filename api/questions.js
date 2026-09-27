/**
 * Vercel Serverless Function — GET /api/questions
 * Mantiq server.js ichida (lokal server bilan umumiy), bu yerda faqat yupqa qobiq.
 */
const { buildQuestionsResponse } = require('../server.js');

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD, OPTIONS');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const payload = buildQuestionsResponse(url.searchParams);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.end(JSON.stringify(payload));
  } catch (err) {
    console.error('[api/questions] Xatolik:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ success: false, error: 'Savollar bazasini yuklashda xatolik yuz berdi' }));
  }
};
