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

async function readPosts() {
  const r = await fetch(BIN_URL + '/latest', {
    headers: { 'X-Master-Key': API_KEY }
  });
  const json = await r.json();
  return Array.isArray(json.record) ? json.record : [];
}

async function writePosts(posts) {
  await fetch(BIN_URL, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
    body:    JSON.stringify(posts)
  });
}

export default async function handler(req, res) {
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
    const posts   = await readPosts();
    const newPost = {
      id:        Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    posts.unshift(newPost);
    await writePosts(posts);
    return res.status(201).json(newPost);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
