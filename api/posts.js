// Vercel Serverless Function — /api/posts
// GET  → return all posts
// POST → create new post

const BIN_ID  = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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
    res.writeHead(204, CORS);
    return res.end();
  }

  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    const { posts } = await readAll();
    const url = req.url || '';
    if (url.includes('status=published') || (req.query && req.query.status === 'published')) {
      return res.status(200).json(posts.filter(p => p.status !== 'draft'));
    }
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    try {
      const body  = await getBody(req);
      const { posts, leads } = await readAll();
      const newPost = {
        id:        Date.now().toString(),
        createdAt: new Date().toISOString(),
        status:    body.status || 'published',
        ...body
      };
      posts.unshift(newPost);
      await writeAll(posts, leads);
      return res.status(201).json(newPost);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
