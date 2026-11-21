// Vercel Serverless Function — /api/leads
// GET  → return all leads
// POST → create new lead
// PUT  → update lead status (?id=...)
// DELETE → remove lead (?id=...)

const BIN_ID  = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

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

async function readAll() {
  const r = await fetch(BIN_URL + '/latest', { headers: { 'X-Master-Key': API_KEY } });
  const json = await r.json();
  const record = json.record || {};
  return {
    posts: Array.isArray(record.posts) ? record.posts : (Array.isArray(record) ? record : []),
    leads: Array.isArray(record.leads) ? record.leads : []
  };
}

async function writeAll(posts, leads) {
  await fetch(BIN_URL, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
    body:    JSON.stringify({ posts, leads })
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const { leads } = await readAll();
    return res.status(200).json(leads);
  }

  if (req.method === 'POST') {
    try {
      const body = await getBody(req);
      const { posts, leads } = await readAll();
      const newLead = {
        id:        Date.now().toString(),
        createdAt: new Date().toISOString(),
        status:    'new',
        ...body
      };
      leads.unshift(newLead);
      await writeAll(posts, leads);
      return res.status(201).json(newLead);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PUT') {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing lead id' });
    try {
      const body = await getBody(req);
      const { posts, leads } = await readAll();
      const idx = leads.findIndex(l => l.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
      leads[idx] = { ...leads[idx], ...body };
      await writeAll(posts, leads);
      return res.status(200).json(leads[idx]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing lead id' });
    const { posts, leads } = await readAll();
    const filtered = leads.filter(l => l.id !== id);
    await writeAll(posts, filtered);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
