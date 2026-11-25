/**
 * Bigwin Digital — WhatsApp Expert CTA Popup
 * A toast-style notification that appears after 8s on every page.
 * Has a "Connect with Expert Strategist" WhatsApp button.
 */
(function () {
  var WA_NUMBER = '919685892813';
  var WA_MSG    = encodeURIComponent("Hi Bigwin Digital! I'd like to connect with an Expert Strategist.");
  var WA_LINK   = 'https://wa.me/' + WA_NUMBER + '?text=' + WA_MSG;
  var DELAY_MS  = 8000; // 8 seconds (after lead form at 3s)

  // Skip on admin page
  if (location.pathname.includes('admin')) return;

  // ── Inject CSS ──────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#bw-wa-toast {',
    '  position: fixed;',
    '  bottom: 110px;',           /* above the WhatsApp float button */
    '  right: 24px;',
    '  z-index: 9998;',
    '  width: 320px;',
    '  background: #0d1410;',
    '  border: 1px solid rgba(0,223,89,0.3);',
    '  border-radius: 18px;',
    '  padding: 16px 18px;',
    '  box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,223,89,0.08);',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 12px;',
    '  transform: translateX(120%);',
    '  opacity: 0;',
    '  transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease;',
    '}',
    '#bw-wa-toast.bw-toast-in {',
    '  transform: translateX(0);',
    '  opacity: 1;',
    '}',
    '#bw-wa-toast.bw-toast-out {',
    '  transform: translateX(120%);',
    '  opacity: 0;',
    '}',
    '#bw-wa-toast-close {',
    '  position: absolute;',
    '  top: 10px; right: 12px;',
    '  background: none; border: none;',
    '  color: #64748b; cursor: pointer;',
    '  font-size: 16px; line-height: 1;',
    '  padding: 2px 4px;',
    '  transition: color 0.2s;',
    '}',
    '#bw-wa-toast-close:hover { color: #fff; }',
    '.bw-toast-top { display: flex; align-items: center; gap: 10px; }',
    '.bw-toast-icon {',
    '  width: 42px; height: 42px; border-radius: 12px;',
    '  background: linear-gradient(135deg, #00df59 0%, #00a040 100%);',
    '  display: flex; align-items: center; justify-content: center;',
    '  flex-shrink: 0;',
    '  box-shadow: 0 4px 12px rgba(0,223,89,0.35);',
    '}',
    '.bw-toast-info { flex: 1; }',
    '.bw-toast-title {',
    '  color: #fff; font-size: 13px; font-weight: 700;',
    '  margin: 0 0 2px; font-family: inherit;',
    '}',
    '.bw-toast-sub {',
    '  color: #94a3b8; font-size: 11px; margin: 0;',
    '  font-family: inherit; line-height: 1.4;',
    '}',
    '.bw-toast-badge {',
    '  display: inline-flex; align-items: center; gap: 4px;',
    '  background: rgba(0,223,89,0.12); border: 1px solid rgba(0,223,89,0.25);',
    '  color: #00ff66; font-size: 10px; font-weight: 700;',
    '  padding: 2px 8px; border-radius: 999px;',
    '  text-transform: uppercase; letter-spacing: 0.04em;',
    '}',
    '.bw-toast-btn {',
    '  display: flex; align-items: center; justify-content: center; gap: 8px;',
    '  width: 100%; padding: 11px 16px;',
    '  background: #25D366;',
    '  color: #000; font-size: 13px; font-weight: 800;',
    '  border-radius: 12px; border: none;',
    '  text-decoration: none; cursor: pointer;',
    '  transition: background 0.2s, transform 0.15s;',
    '  font-family: inherit;',
    '  box-shadow: 0 4px 16px rgba(37,211,102,0.4);',
    '}',
    '.bw-toast-btn:hover { background: #1db954; transform: scale(1.02); }',
    '@media (max-width: 400px) {',
    '  #bw-wa-toast { width: calc(100vw - 32px); right: 16px; bottom: 100px; }',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Build HTML ──────────────────────────────────────────────────────────
  var el = document.createElement('div');
  el.id = 'bw-wa-toast';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Connect with Expert Strategist');
  el.innerHTML = [
    '<button id="bw-wa-toast-close" aria-label="Dismiss">✕</button>',

    '<div class="bw-toast-top">',
    '  <div class="bw-toast-icon">',
    '    <!-- WhatsApp icon -->',
    '    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">',
    '      <path fill="#fff" d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.638 4.587 1.748 6.496L2.667 29.333l6.996-1.72A13.267 13.267 0 0016 29.333c7.364 0 13.333-5.969 13.333-13.333S23.364 2.667 16 2.667zm5.812 18.73c-.318-.16-1.883-.93-2.175-1.035-.291-.106-.503-.159-.715.16-.212.317-.82 1.033-1.005 1.246-.185.212-.37.238-.688.08-.317-.16-1.34-.494-2.552-1.575-.943-.842-1.58-1.882-1.765-2.2-.185-.318-.02-.49.139-.648.143-.143.318-.371.477-.556.159-.186.212-.318.318-.53.106-.212.053-.398-.026-.556-.08-.159-.716-1.726-.98-2.363-.258-.62-.52-.536-.715-.546l-.609-.01c-.212 0-.556.08-.847.398-.291.318-1.112 1.087-1.112 2.65 0 1.564 1.139 3.075 1.298 3.287.159.212 2.24 3.42 5.428 4.797.759.327 1.35.522 1.812.669.761.242 1.454.208 2.002.126.611-.091 1.883-.77 2.149-1.514.265-.744.265-1.382.185-1.514-.079-.133-.29-.212-.609-.371z"/>',
    '    </svg>',
    '  </div>',
    '  <div class="bw-toast-info">',
    '    <p class="bw-toast-title">Talk to a Growth Expert</p>',
    '    <p class="bw-toast-sub">Free 15-min strategy call — no sales pitch.</p>',
    '  </div>',
    '</div>',

    '<div style="display:flex;align-items:center;gap:8px;padding:0 2px;">',
    '  <span class="bw-toast-badge">🟢 Online Now</span>',
    '  <span style="color:#64748b;font-size:11px;">Avg. reply in &lt; 2 min</span>',
    '</div>',

    '<a href="' + WA_LINK + '" target="_blank" rel="noopener" class="bw-toast-btn" id="bw-wa-cta-btn">',
    '  <svg width="18" height="18" viewBox="0 0 32 32" fill="none">',
    '    <path fill="#000" d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.638 4.587 1.748 6.496L2.667 29.333l6.996-1.72A13.267 13.267 0 0016 29.333c7.364 0 13.333-5.969 13.333-13.333S23.364 2.667 16 2.667zm5.812 18.73c-.318-.16-1.883-.93-2.175-1.035-.291-.106-.503-.159-.715.16-.212.317-.82 1.033-1.005 1.246-.185.212-.37.238-.688.08-.317-.16-1.34-.494-2.552-1.575-.943-.842-1.58-1.882-1.765-2.2-.185-.318-.02-.49.139-.648.143-.143.318-.371.477-.556.159-.186.212-.318.318-.53.106-.212.053-.398-.026-.556-.08-.159-.716-1.726-.98-2.363-.258-.62-.52-.536-.715-.546l-.609-.01c-.212 0-.556.08-.847.398-.291.318-1.112 1.087-1.112 2.65 0 1.564 1.139 3.075 1.298 3.287.159.212 2.24 3.42 5.428 4.797.759.327 1.35.522 1.812.669.761.242 1.454.208 2.002.126.611-.091 1.883-.77 2.149-1.514.265-.744.265-1.382.185-1.514-.079-.133-.29-.212-.609-.371z"/>',
    '  </svg>',
    '  Connect with Expert Strategist',
    '</a>',
  ].join('\n');

  // ── Show / Hide logic ───────────────────────────────────────────────────
  function showToast() {
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('bw-toast-in');
      });
    });
    // Auto-dismiss after 20 seconds if not interacted
    setTimeout(dismissToast, 20000);
  }

  function dismissToast() {
    el.classList.remove('bw-toast-in');
    el.classList.add('bw-toast-out');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 500);
  }

  // ── Wire events ─────────────────────────────────────────────────────────
  el.querySelector('#bw-wa-toast-close').addEventListener('click', dismissToast);

  // ── Init ─────────────────────────────────────────────────────────────────
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    setTimeout(showToast, DELAY_MS);
  });
})();
