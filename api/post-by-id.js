// Vercel Serverless Function — /api/posts/:id  (PUT & DELETE)
// Route rewritten from /api/posts/:id via vercel.json

const BIN_ID  = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function readPosts() {
  const r = await fetch(BIN_URL + '/latest', {
    headers: { 'X-Master-Key': API_KEY }
  });
  const json = await r.json();
  const record = json.record;
  // Support both { posts: [] } and plain [] formats
  if (Array.isArray(record)) return record;
  if (record && Array.isArray(record.posts)) return record.posts;
  return [];
}

async function writePosts(posts) {
  await fetch(BIN_URL, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
    body:    JSON.stringify({ posts })
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

  // Extract id from query string (Vercel rewrite passes it as ?id=...)
  const id = req.query.id || req.url.split('/').pop().split('?')[0];
  if (!id) return res.status(400).json({ error: 'Missing post id' });

  if (req.method === 'PUT') {
    let posts = await readPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Post not found' });
    posts[idx] = { ...posts[idx], ...req.body, id, updatedAt: new Date().toISOString() };
    await writePosts(posts);
    return res.status(200).json(posts[idx]);
  }

  if (req.method === 'DELETE') {
    let posts  = await readPosts();
    const before = posts.length;
    posts = posts.filter(p => p.id !== id);
    if (posts.length === before) return res.status(404).json({ error: 'Post not found' });
    await writePosts(posts);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
