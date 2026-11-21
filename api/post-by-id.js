// Vercel Serverless Function — /api/posts/:id  (PUT & DELETE)
// Route rewritten from /api/posts/:id via vercel.json

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
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const id = req.query.id || req.url.split('/').pop().split('?')[0];
  if (!id) return res.status(400).json({ error: 'Missing post id' });

  if (req.method === 'PUT') {
    const body = await getBody(req);
    const { posts, leads } = await readAll();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Post not found' });
    posts[idx] = { ...posts[idx], ...body, id, updatedAt: new Date().toISOString() };
    await writeAll(posts, leads);
    return res.status(200).json(posts[idx]);
  }

  if (req.method === 'DELETE') {
    const { posts, leads } = await readAll();
    const before = posts.length;
    const filtered = posts.filter(p => p.id !== id);
    if (filtered.length === before) return res.status(404).json({ error: 'Post not found' });
    await writeAll(filtered, leads);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
