// Vercel Serverless Function — /api/offer-popup
// GET  → return current offer popup config
// POST → save offer popup config (admin only)
// Uses a DEDICATED JSONBin bin (JSONBIN_OFFER_BIN_ID env var)
// Falls back to the shared bin if dedicated bin not set

const OFFER_BIN_ID = process.env.JSONBIN_OFFER_BIN_ID || process.env.JSONBIN_BIN_ID;
const API_KEY      = process.env.JSONBIN_API_KEY;
const BIN_URL      = `https://api.jsonbin.io/v3/b/${OFFER_BIN_ID}`;

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

async function readConfig() {
  const r    = await fetch(BIN_URL + '/latest', { headers: { 'X-Master-Key': API_KEY } });
  if (!r.ok) return { ...DEFAULT_CONFIG };
  const json = await r.json();
  const rec  = json.record || {};

  // If using shared bin (has posts/leads), look inside offerPopup key
  // If using dedicated bin, the whole record is the config
  if (rec.offerPopup || rec.posts !== undefined || rec.leads !== undefined) {
    return rec.offerPopup || { ...DEFAULT_CONFIG };
  }
  // Dedicated bin — record IS the config
  if (typeof rec.enabled !== 'undefined') return rec;
  return { ...DEFAULT_CONFIG };
}

async function writeConfig(cfg) {
  // Always write to dedicated bin (or shared bin's offerPopup if no dedicated)
  const isSharedBin = !process.env.JSONBIN_OFFER_BIN_ID;

  if (isSharedBin) {
    // Read shared bin, merge offerPopup key, write back
    const r      = await fetch(BIN_URL + '/latest', { headers: { 'X-Master-Key': API_KEY } });
    const json   = await r.json();
    const record = json.record || {};
    record.offerPopup = cfg;

    const w = await fetch(BIN_URL, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
      body:    JSON.stringify(record)
    });
    if (!w.ok) {
      const err = await w.text();
      throw new Error(`JSONBin write failed (${w.status}): ${err}`);
    }
  } else {
    // Write directly to dedicated bin
    const w = await fetch(BIN_URL, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
      body:    JSON.stringify(cfg)
    });
    if (!w.ok) {
      const err = await w.text();
      throw new Error(`JSONBin write failed (${w.status}): ${err}`);
    }
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET — return current config
  if (req.method === 'GET') {
    try {
      const cfg = await readConfig();
      return res.status(200).json(cfg);
    } catch (err) {
      return res.status(200).json(DEFAULT_CONFIG);
    }
  }

  // POST — save config
  if (req.method === 'POST') {
    try {
      const body = await getBody(req);

      // Size guard — base64 image must be under 80KB
      const imgSize = (body.imageBase64 || '').length;
      if (imgSize > 90000) {
        return res.status(400).json({
          error: `Image too large (${Math.round(imgSize/1024)}KB). Please use the compressed version — max ~80KB.`
        });
      }

      const cfg = {
        enabled:     !!body.enabled,
        imageBase64: body.imageBase64 || '',
        linkUrl:     body.linkUrl     || '',
        altText:     body.altText     || 'Special Offer',
        updatedAt:   new Date().toISOString()
      };

      await writeConfig(cfg);
      return res.status(200).json({ success: true, data: cfg });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
