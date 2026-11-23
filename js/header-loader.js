/**
 * Bigwin Digital — Shared Header Loader
 * Fetches header.html and injects it into #site-header on every page.
 * Also sets the active nav link based on current page filename.
 */
(function () {
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
