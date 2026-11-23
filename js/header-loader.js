/**
 * Bigwin Digital — Shared Header Loader
 * Fetches header.html and injects it into #site-header on every page.
 * Also sets the active nav link based on current page filename.
 * Also injects the WhatsApp floating button on every page.
 *
 * To change WhatsApp number: update WHATSAPP_NUMBER below.
 */
(function () {
  // ── WhatsApp Floating Button ───────────────────────────────────────────
  var WHATSAPP_NUMBER = '919685892813'; // No + prefix
  var WHATSAPP_MSG    = encodeURIComponent('Hi Bigwin Digital! I\'d like to know more about your services.');

  var wa = document.createElement('div');
  wa.id  = 'wa-float';
  wa.innerHTML = [
    '<style>',
    '  #wa-float { position:fixed; bottom:28px; right:28px; z-index:9999; display:flex; flex-direction:column; align-items:flex-end; gap:10px; }',
    '  #wa-float a { display:flex; align-items:center; justify-content:center; width:58px; height:58px; border-radius:50%; background:#25D366; box-shadow:0 4px 24px rgba(37,211,102,.45); transition:transform .2s, box-shadow .2s; text-decoration:none; position:relative; }',
    '  #wa-float a:hover { transform:scale(1.1); box-shadow:0 6px 32px rgba(37,211,102,.65); }',
    '  #wa-float a svg { width:30px; height:30px; }',
    '  #wa-float .wa-tooltip { position:absolute; right:68px; background:#111; color:#fff; font-size:12px; font-weight:600; padding:6px 12px; border-radius:8px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .2s; box-shadow:0 2px 12px rgba(0,0,0,.4); }',
    '  #wa-float .wa-tooltip::after { content:""; position:absolute; left:100%; top:50%; transform:translateY(-50%); border:5px solid transparent; border-left-color:#111; }',
    '  #wa-float a:hover .wa-tooltip { opacity:1; }',
    '  #wa-pulse { position:absolute; inset:0; border-radius:50%; background:#25D366; animation:wa-ping 2s ease-out infinite; }',
    '  @keyframes wa-ping { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.7);opacity:0} }',
    '</style>',
    '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + WHATSAPP_MSG + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">',
    '  <span id="wa-pulse"></span>',
    '  <span class="wa-tooltip">Chat with us</span>',
    '  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">',
    '    <path fill="#fff" d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.638 4.587 1.748 6.496L2.667 29.333l6.996-1.72A13.267 13.267 0 0016 29.333c7.364 0 13.333-5.969 13.333-13.333S23.364 2.667 16 2.667zm0 24a10.6 10.6 0 01-5.408-1.48l-.387-.23-4.152 1.02 1.052-3.998-.252-.41A10.6 10.6 0 015.333 16C5.333 10.11 10.11 5.333 16 5.333S26.667 10.11 26.667 16 21.89 26.667 16 26.667zm5.812-7.938c-.318-.159-1.883-.929-2.175-1.034-.291-.106-.503-.159-.715.16-.212.317-.82 1.033-1.005 1.246-.185.212-.37.238-.688.08-.317-.16-1.34-.494-2.552-1.575-.943-.842-1.58-1.882-1.765-2.2-.185-.318-.02-.49.139-.648.143-.143.318-.371.477-.556.159-.186.212-.318.318-.53.106-.212.053-.398-.026-.556-.08-.159-.716-1.726-.98-2.363-.258-.62-.52-.536-.715-.546l-.609-.01c-.212 0-.556.08-.847.398-.291.318-1.112 1.087-1.112 2.65 0 1.564 1.139 3.075 1.298 3.287.159.212 2.24 3.42 5.428 4.797.759.327 1.35.522 1.812.669.761.242 1.454.208 2.002.126.611-.091 1.883-.77 2.149-1.514.265-.744.265-1.382.185-1.514-.079-.133-.29-.212-.609-.371z"/>',
    '  </svg>',
    '</a>'
  ].join('');
  document.body.appendChild(wa);

  // ── Shared Footer Inject (wait for full DOM so site-footer div exists) ──
  document.addEventListener('DOMContentLoaded', function () {
    var footerPlaceholder = document.getElementById('site-footer');
    if (footerPlaceholder) {
      fetch('footer.html')
        .then(r => r.text())
        .then(html => { footerPlaceholder.outerHTML = html; })
        .catch(() => console.warn('footer.html could not be loaded'));
    }
  });

  // ── Shared Header Inject ───────────────────────────────────────────────
  const placeholder = document.getElementById('site-header');
  if (!placeholder) return;

  fetch('header.html')
    .then(r => r.text())
    .then(html => {
      placeholder.outerHTML = html;
      initHeader();
    })
    .catch(() => console.warn('header.html could not be loaded'));

  function initHeader() {
    // ── Active nav link highlight ──────────────────────────────────────
    const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.dataset.page === page) {
        el.classList.remove('text-slate-200', 'hover:text-[#00ff66]');
        el.classList.add('text-[#00ff66]', 'border-b-2', 'border-[#00ff66]', 'pb-1');
      }
    });

    // ── Mobile menu toggle ─────────────────────────────────────────────
    const toggle = document.getElementById('mobile-menu-toggle');
    const close  = document.getElementById('mobile-menu-close');
    const menu   = document.getElementById('mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
    }
    if (close && menu) {
      close.addEventListener('click', () => menu.classList.add('hidden'));
    }
    // Close mobile menu when any link inside it is clicked
    if (menu) {
      menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => menu.classList.add('hidden'));
      });
    }

    // ── Free Audit modal trigger (re-attach after inject) ──────────────
    document.querySelectorAll('[data-open-audit-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('audit-modal');
        if (modal) modal.classList.remove('hidden');
      });
    });
  }
})();
