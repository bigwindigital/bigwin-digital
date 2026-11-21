// Vercel Serverless Function — /blogs/:slug
// Renders individual blog post as a full HTML page

const BIN_ID  = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const CAT_LABEL = {
  performance: 'Performance Marketing',
  cro:         'Shopify & CRO',
  website:     'Website Development',
  seo:         'Search Engine Optimisation',
  social:      'Social Media & UGC',
  strategy:    'Growth Strategy'
};

async function readPosts() {
  const r = await fetch(BIN_URL + '/latest', {
    headers: { 'X-Master-Key': API_KEY }
  });
  const json = await r.json();
  return Array.isArray(json.record) ? json.record : [];
}

export default async function handler(req, res) {
  const slug = req.query.slug || req.url.replace('/blogs/', '').split('?')[0];

  const posts = await readPosts();
  const post  = posts.find(p => p.slug === slug);

  if (!post) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(404).send(`<!DOCTYPE html><html><head><title>404 Not Found</title>
      <style>body{background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:16px}</style>
      </head><body><h1 style="color:#00ff66">404</h1><p>Blog post not found.</p><a href="/blog.html" style="color:#00df59">← Back to Blog</a></body></html>`);
  }

  const catLabel = CAT_LABEL[post.category] || post.category;
  const dateStr  = new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const initials = (post.author || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const year     = new Date().getFullYear();

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
  <script>tailwind.config={theme:{extend:{colors:{brand:{black:'#000000',dark:'#080808',green:'#00df59',neon:'#00ff66'}},fontFamily:{heading:['Outfit','sans-serif'],sans:['Plus Jakarta Sans','sans-serif']}}}}<\/script>
  <link rel="stylesheet" href="/css/style.css">
  <style>
    .prose-blog h1{font-size:1.9em;font-weight:800;color:#fff;margin:1.2em 0 .5em;line-height:1.2}
    .prose-blog h2{font-size:1.4em;font-weight:700;color:#fff;margin:1.4em 0 .4em;padding-bottom:.3em;border-bottom:1px solid rgba(0,223,89,.15)}
    .prose-blog h3{font-size:1.15em;font-weight:600;color:#e2e8f0;margin:1.2em 0 .3em}
    .prose-blog p{margin:.8em 0;line-height:1.8;color:#cbd5e1}
    .prose-blog ul{list-style:disc;padding-left:1.5em;margin:.8em 0;color:#cbd5e1}
    .prose-blog ol{list-style:decimal;padding-left:1.5em;margin:.8em 0;color:#cbd5e1}
    .prose-blog li{margin:.3em 0}
    .prose-blog strong,.prose-blog b{color:#00ff66;font-weight:700}
    .prose-blog em,.prose-blog i{color:#94c5ff;font-style:italic}
    .prose-blog a{color:#00ff66;text-decoration:underline;text-underline-offset:3px}
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
  </style>
</head>
<body class="bg-[#000000] text-slate-100 font-sans antialiased">

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
      <nav class="text-xs text-slate-500 mb-8 flex items-center gap-2">
        <a href="/index.html" class="hover:text-[#00ff66] transition-colors">Home</a>
        <span>/</span>
        <a href="/blog.html" class="hover:text-[#00ff66] transition-colors">Blog</a>
        <span>/</span>
        <span class="text-slate-400">${post.title}</span>
      </nav>
      <div class="flex items-center gap-3 flex-wrap mb-5">
        <span class="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono uppercase bg-[#00df59]/15 text-[#00ff66] border border-[#00df59]/30">${catLabel}</span>
        <span class="text-xs font-mono text-slate-400">${post.readTime || '5 MIN READ'}</span>
        <span class="text-zinc-700">•</span>
        <span class="text-xs text-slate-400">${dateStr}</span>
      </div>
      <h1 class="font-heading text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">${post.title}</h1>
      <p class="text-slate-400 text-base leading-relaxed mb-8 pb-8 border-b border-zinc-800">${post.excerpt}</p>
      <div class="flex items-center gap-3 mb-10">
        <div class="w-10 h-10 rounded-full bg-zinc-800 border border-[#00df59]/40 flex items-center justify-center text-sm font-bold text-[#00ff66]">${initials}</div>
        <div>
          <div class="text-sm font-semibold text-white">${post.author || 'Bigwin Digital'}</div>
          ${post.authorRole ? `<div class="text-xs text-slate-400">${post.authorRole}</div>` : ''}
        </div>
        ${post.result ? `<div class="ml-auto text-sm font-mono text-[#00df59] font-bold">${post.result}</div>` : ''}
      </div>
      <div class="prose-blog text-sm sm:text-base">${post.content}</div>
      <div class="mt-16 p-8 rounded-2xl bg-[#060a07] border border-[#00df59]/20 text-center">
        <h3 class="font-heading text-xl font-bold text-white mb-2">Ready to Grand Your Brand?</h3>
        <p class="text-slate-400 text-sm mb-6">Let's talk about how Bigwin Digital can grow your business.</p>
        <a href="/contact.html" class="inline-flex items-center gap-2 bg-[#00df59] text-black font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#00ff66] transition-colors">Get a Free Audit &rarr;</a>
      </div>
      <div class="mt-10 text-center">
        <a href="/blog.html" class="text-sm text-[#00df59] hover:text-[#00ff66] transition-colors">&larr; Back to all articles</a>
      </div>
    </div>
  </main>

  <footer class="border-t border-[#00df59]/10 py-8 text-center text-xs text-slate-500">
    &copy; ${year} Bigwin Digital. Grand Your Brand Day.
  </footer>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}
