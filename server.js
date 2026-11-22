/**
 * Bigwin Digital - Local Server
 * Serves static files + Blog Admin REST API
 *
 * Routes:
 *   GET  /api/posts          → return all blog posts as JSON
 *   POST /api/posts          → create a new post (body: JSON)
 *   PUT  /api/posts/:id      → update a post by id
 *   DELETE /api/posts/:id    → delete a post by id
 *
 * Run:  node server.js
 * Open: http://localhost:3000
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT       = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const POSTS_FILE = path.join(__dirname, 'data', 'posts.json');
const LEADS_FILE = path.join(__dirname, 'data', 'leads.json');

// ── helpers ────────────────────────────────────────────────────────────────

function readPosts() {
  try {
    const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

function readLeads() {
  try {
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLeads(leads) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch(e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// ── MIME types ─────────────────────────────────────────────────────────────

const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp'
};

// ── server ─────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url    = req.url.split('?')[0];
  const method = req.method.toUpperCase();

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // ── API routes ────────────────────────────────────────────────────────────

  // GET /api/posts
  if (url === '/api/posts' && method === 'GET') {
    return sendJSON(res, 200, readPosts());
  }

  // GET /blogs/:slug  — individual blog post page
  const slugMatch = url.match(/^\/blogs\/([^/]+)$/);
  if (slugMatch && method === 'GET') {
    const slug  = slugMatch[1];
    const posts = readPosts();
    const post  = posts.find(p => p.slug === slug);
    if (!post) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>404 — Blog post not found</h1><p><a href="/blog.html">Back to Blog</a></p>');
    }
    const CAT_LABEL = {
      performance: 'Performance Marketing', cro: 'Shopify & CRO',
      website: 'Website Development', seo: 'Search Engine Optimisation',
      social: 'Social Media & UGC', strategy: 'Growth Strategy'
    };
    const catLabel = CAT_LABEL[post.category] || post.category;
    const dateStr  = new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const initials = (post.author || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const html = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | Bigwin Digital</title>
  <meta name="description" content="${post.excerpt}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    tailwind.config = {
      theme: { extend: { colors: { brand: { black:'#000000', dark:'#080808', green:'#00df59', neon:'#00ff66', border:'rgba(0,223,89,0.16)' } }, fontFamily: { heading:['Outfit','sans-serif'], sans:['Plus Jakarta Sans','sans-serif'] } } }
    }
  <\/script>
  <link rel="stylesheet" href="/css/style.css">
  <style>
    .prose-blog h1{font-size:1.9em;font-weight:800;color:#fff;margin:1.2em 0 .5em;line-height:1.2}
    .prose-blog h2{font-size:1.4em;font-weight:700;color:#fff;margin:1.4em 0 .4em;padding-bottom:.3em;border-bottom:1px solid rgba(0,223,89,.15)}
    .prose-blog h3{font-size:1.15em;font-weight:600;color:#e2e8f0;margin:1.2em 0 .3em}
    .prose-blog p{margin:.8em 0;line-height:1.8;color:#cbd5e1}
    .prose-blog ul{list-style:disc;padding-left:1.5em;margin:.8em 0;color:#cbd5e1}
    .prose-blog ol{list-style:decimal;padding-left:1.5em;margin:.8em 0;color:#cbd5e1}
    .prose-blog li{margin:.3em 0}
    .prose-blog strong,b{color:#00ff66;font-weight:700}
    .prose-blog em,i{color:#94c5ff;font-style:italic}
    .prose-blog a{color:#00ff66;text-decoration:underline;text-underline-offset:3px}
    .prose-blog a:hover{color:#00df59}
    .prose-blog code{background:#0d1a0e;color:#00ff66;padding:2px 7px;border-radius:4px;font-family:monospace;font-size:.88em}
    .prose-blog pre{background:#050c06;border:1px solid rgba(0,223,89,.2);border-radius:10px;padding:1.2em;overflow-x:auto;margin:1em 0}
    .prose-blog pre code{background:none;padding:0;color:#a3e635;font-size:.85em}
    .prose-blog blockquote{border-left:3px solid #00df59;padding:.7em 1.2em;color:#94a3b8;margin:1em 0;background:rgba(0,223,89,.04);border-radius:0 8px 8px 0;font-style:italic}
    .prose-blog hr{border:none;border-top:1px solid rgba(0,223,89,.2);margin:1.5em 0}
    .prose-blog table{border-collapse:collapse;width:100%;margin:1em 0;font-size:.9em}
    .prose-blog td,.prose-blog th{border:1px solid rgba(0,223,89,.2);padding:.6em .9em}
    .prose-blog th{background:rgba(0,223,89,.1);color:#00ff66;font-weight:700}
    .prose-blog img{max-width:100%;border-radius:10px;margin:1em 0}
    .prose-blog s{text-decoration:line-through;color:#64748b}
    .prose-blog sub{font-size:.75em;vertical-align:sub}
    .prose-blog sup{font-size:.75em;vertical-align:super}
  </style>
</head>
<body class="bg-[#000000] text-slate-100 font-sans antialiased">

  <!-- NAV -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#00df59]/10 h-20">
    <div class="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
      <a href="/index.html"><img src="/assets/bigwin-logo.jpg" alt="Bigwin Digital" class="h-14 object-contain"></a>
      <nav class="hidden md:flex items-center gap-8 text-sm font-semibold">
        <a href="/index.html" class="text-slate-300 hover:text-[#00ff66] transition-colors">Home</a>
        <a href="/about.html" class="text-slate-300 hover:text-[#00ff66] transition-colors">About</a>
        <a href="/blog.html" class="text-[#00ff66]">Blog</a>
        <a href="/contact.html" class="text-slate-300 hover:text-[#00ff66] transition-colors">Contact</a>
      </nav>
      <a href="/contact.html" class="hidden md:inline-flex items-center gap-2 bg-[#00df59] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00ff66] transition-colors">Get Started</a>
    </div>
  </header>

  <main class="pt-32 pb-24 px-6">
    <div class="max-w-3xl mx-auto">

      <!-- Breadcrumb -->
      <nav class="text-xs text-slate-500 mb-8 flex items-center gap-2">
        <a href="/index.html" class="hover:text-[#00ff66] transition-colors">Home</a>
        <span>/</span>
        <a href="/blog.html" class="hover:text-[#00ff66] transition-colors">Blog</a>
        <span>/</span>
        <span class="text-slate-400">${post.title}</span>
      </nav>

      <!-- Category + meta -->
      <div class="flex items-center gap-3 flex-wrap mb-5">
        <span class="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono uppercase bg-[#00df59]/15 text-[#00ff66] border border-[#00df59]/30">${catLabel}</span>
        <span class="text-xs font-mono text-slate-400">${post.readTime || '5 MIN READ'}</span>
        <span class="text-zinc-700">•</span>
        <span class="text-xs text-slate-400">${dateStr}</span>
      </div>

      <!-- Title -->
      <h1 class="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">${post.title}</h1>

      <!-- Excerpt -->
      <p class="text-slate-400 text-base leading-relaxed mb-8 pb-8 border-b border-zinc-800">${post.excerpt}</p>

      <!-- Author -->
      <div class="flex items-center gap-3 mb-10">
        <div class="w-10 h-10 rounded-full bg-zinc-800 border border-[#00df59]/40 flex items-center justify-center text-sm font-bold text-[#00ff66]">${initials}</div>
        <div>
          <div class="text-sm font-semibold text-white">${post.author || 'Bigwin Digital'}</div>
          ${post.authorRole ? `<div class="text-xs text-slate-400">${post.authorRole}</div>` : ''}
        </div>
        ${post.result ? `<div class="ml-auto text-sm font-mono text-[#00df59] font-bold">${post.result}</div>` : ''}
      </div>

      <!-- Full Content -->
      <div class="prose-blog text-sm sm:text-base">
        ${post.content}
      </div>

      <!-- Bottom CTA -->
      <div class="mt-16 p-8 rounded-2xl bg-[#060a07] border border-[#00df59]/20 text-center">
        <h3 class="font-heading text-xl font-bold text-white mb-2">Ready to Grand Your Brand?</h3>
        <p class="text-slate-400 text-sm mb-6">Let's talk about how Bigwin Digital can grow your business.</p>
        <a href="/contact.html" class="inline-flex items-center gap-2 bg-[#00df59] text-black font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#00ff66] transition-colors">
          Get a Free Audit &rarr;
        </a>
      </div>

      <!-- Back -->
      <div class="mt-10 text-center">
        <a href="/blog.html" class="text-sm text-[#00df59] hover:text-[#00ff66] transition-colors">&larr; Back to all articles</a>
      </div>

    </div>
  </main>

  <footer class="border-t border-[#00df59]/10 py-8 text-center text-xs text-slate-500">
    &copy; ${new Date().getFullYear()} Bigwin Digital. Grand Your Brand Day.
  </footer>

</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }

  // POST /api/posts
  if (url === '/api/posts' && method === 'POST') {
    try {
      const body  = await readBody(req);
      const posts = readPosts();
      const newPost = {
        id:        Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...body
      };
      posts.unshift(newPost);   // newest first
      writePosts(posts);
      return sendJSON(res, 201, newPost);
    } catch(e) {
      return sendJSON(res, 400, { error: 'Invalid JSON body' });
    }
  }

  // PUT /api/posts/:id
  const putMatch = url.match(/^\/api\/posts\/(.+)$/);
  if (putMatch && method === 'PUT') {
    try {
      const id    = putMatch[1];
      const body  = await readBody(req);
      let posts   = readPosts();
      const idx   = posts.findIndex(p => p.id === id);
      if (idx === -1) return sendJSON(res, 404, { error: 'Post not found' });
      posts[idx] = { ...posts[idx], ...body, id, updatedAt: new Date().toISOString() };
      writePosts(posts);
      return sendJSON(res, 200, posts[idx]);
    } catch(e) {
      return sendJSON(res, 400, { error: 'Invalid JSON body' });
    }
  }

  // DELETE /api/posts/:id
  const delMatch = url.match(/^\/api\/posts\/(.+)$/);
  if (delMatch && method === 'DELETE') {
    const id   = delMatch[1];
    let posts  = readPosts();
    const before = posts.length;
    posts = posts.filter(p => p.id !== id);
    if (posts.length === before) return sendJSON(res, 404, { error: 'Post not found' });
    writePosts(posts);
    return sendJSON(res, 200, { success: true });
  }

  // ── Leads API ─────────────────────────────────────────────────────────────

  // GET /api/leads
  if (url === '/api/leads' && method === 'GET') {
    return sendJSON(res, 200, readLeads());
  }

  // POST /api/leads
  if (url === '/api/leads' && method === 'POST') {
    try {
      const body = await readBody(req);
      const leads = readLeads();
      const newLead = { id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'new', ...body };
      leads.unshift(newLead);
      writeLeads(leads);
      return sendJSON(res, 201, newLead);
    } catch(e) {
      return sendJSON(res, 400, { error: 'Invalid JSON body' });
    }
  }

  // PUT /api/leads?id=...  (update status)
  if (url.startsWith('/api/leads') && method === 'PUT') {
    const idParam = req.url.split('?')[1]?.match(/id=([^&]+)/)?.[1];
    if (!idParam) return sendJSON(res, 400, { error: 'Missing lead id' });
    try {
      const body  = await readBody(req);
      const leads = readLeads();
      const idx   = leads.findIndex(l => l.id === idParam);
      if (idx === -1) return sendJSON(res, 404, { error: 'Lead not found' });
      leads[idx] = { ...leads[idx], ...body };
      writeLeads(leads);
      return sendJSON(res, 200, leads[idx]);
    } catch(e) {
      return sendJSON(res, 400, { error: 'Invalid JSON body' });
    }
  }

  // DELETE /api/leads?id=...
  if (url.startsWith('/api/leads') && method === 'DELETE') {
    const idParam = req.url.split('?')[1]?.match(/id=([^&]+)/)?.[1];
    if (!idParam) return sendJSON(res, 400, { error: 'Missing lead id' });
    let leads = readLeads();
    leads = leads.filter(l => l.id !== idParam);
    writeLeads(leads);
    return sendJSON(res, 200, { success: true });
  }

  // ── Static file serving ───────────────────────────────────────────────────

  let reqPath = url;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const filePath    = path.join(PUBLIC_DIR, reqPath);
  const ext         = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>500 Server Error</h1><p>${err.code}</p>`);
      }
    } else {
      // For blog.html: inject posts as a server-side variable so they
      // appear instantly without waiting for the fetch to complete
      if (reqPath === '/blog.html') {
        const posts = readPosts();
        const injection = `<script>window.__INJECTED_POSTS__ = ${JSON.stringify(posts)};</script>`;
        let html = content.toString('utf-8');
        html = html.replace('</head>', injection + '\n</head>');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html, 'utf-8');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(PORT, () => {
  console.log('\n==================================================');
  console.log('  Bigwin Digital - Local Preview Server');
  console.log(`  Website  → http://localhost:${PORT}`);
  console.log(`  Admin    → http://localhost:${PORT}/admin.html`);
  console.log(`  Blog API → http://localhost:${PORT}/api/posts`);
  console.log('  Press Ctrl + C to stop');
  console.log('==================================================\n');
});
