// Vercel Serverless Function — /api/posts
// GET  → return all posts
// POST → create new post
// Uses JSONBin.io for persistent storage (free)

const BIN_ID  = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Safely parse request body — handles both Vercel auto-parsed and raw stream
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

async function readPosts() {
  try {
    const r = await fetch(BIN_URL + '/latest', {
      headers: { 'X-Master-Key': API_KEY }
    });
    const json = await r.json();
    const record = json.record;
    if (Array.isArray(record)) return record;
    if (record && Array.isArray(record.posts)) return record.posts;
    return [];
  } catch (err) {
    console.error('readPosts error:', err);
    return [];
  }
}

async function writePosts(posts) {
  try {
    const r = await fetch(BIN_URL, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
      body:    JSON.stringify({ posts })
    });
    const json = await r.json();
    console.log('writePosts response:', JSON.stringify(json).slice(0, 200));
  } catch (err) {
    console.error('writePosts error:', err);
    throw err;
  }
}

module.exports = async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    return res.end();
  }

  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    const posts = await readPosts();
    return res.status(200).json(posts);
  }

  if (req.method === 'POST') {
    try {
      const body    = await getBody(req);
      console.log('POST body received:', JSON.stringify(body).slice(0, 200));
      const posts   = await readPosts();
      const newPost = {
        id:        Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...body
      };
      posts.unshift(newPost);
      await writePosts(posts);
      return res.status(201).json(newPost);
    } catch (err) {
      console.error('POST error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
