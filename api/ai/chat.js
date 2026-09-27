/**
 * Vercel Serverless Function — POST /api/ai/chat
 * Gemini kaliti Vercel'dagi Environment Variable (GEMINI_API_KEY) dan olinadi.
 * Kalit bo‘lmasa yoki Gemini xato bersa — oflayn YHQ zaxira mexanizmi javob beradi.
 */
const { handleChatPayload } = require('../../server.js');

const MAX_BODY_BYTES = 1000000; // 1MB

async function readJsonBody(req) {
  // Vercel JSON body'ni odatda o‘zi parse qiladi (req.body)
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body;
    const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body);
    return JSON.parse(raw || '{}');
  }
  // Aks holda oqimdan o‘qiymiz
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('Body juda katta');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return send(res, 405, { success: false, error: 'Method not allowed' });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (err) {
    return send(res, 200, { success: false, error: 'AI so‘rovini qayta ishlashda xatolik yuz berdi' });
  }

  const result = await handleChatPayload(payload);
  return send(res, 200, result);
};
