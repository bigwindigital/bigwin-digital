// Vercel Serverless Function — /api/offer-popup
// GET  → return current offer popup config
// POST → save offer popup config (admin only)

const BIN_ID  = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const DEFAULT_CONFIG = {
  enabled:     false,
  imageBase64: '',
  linkUrl:     '',
  altText:     'Special Offer',
  updatedAt:   ''
};

async function getBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk.toString(); });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { resolve({}); }
    });
  });
}

async function readBin() {
  const r    = await fetch(BIN_URL + '/latest', { headers: { 'X-Master-Key': API_KEY } });
  const json = await r.json();
  return json.record || {};
}

async function writeBin(record) {
  await fetch(BIN_URL, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
    body:    JSON.stringify(record)
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET → return current offer popup config
  if (req.method === 'GET') {
    try {
      const record = await readBin();
      return res.status(200).json(record.offerPopup || DEFAULT_CONFIG);
    } catch (err) {
      return res.status(200).json(DEFAULT_CONFIG); // safe fallback
    }
  }

  // POST → save config
  if (req.method === 'POST') {
    try {
      const body   = await getBody(req);
      const record = await readBin();

      record.offerPopup = {
        enabled:     !!body.enabled,
        imageBase64: body.imageBase64 || '',
        linkUrl:     body.linkUrl     || '',
        altText:     body.altText     || 'Special Offer',
        updatedAt:   new Date().toISOString()
      };

      await writeBin(record);
      return res.status(200).json({ success: true, data: record.offerPopup });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
