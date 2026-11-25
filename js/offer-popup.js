/**
 * Bigwin Digital — Offer Popup
 * - Fetches config from /api/offer-popup
 * - Appears after the lead form closes (15s delay)
 * - Shows a full 1080x1080 offer image in a lightbox
 * - Skipped on admin page
 */
(function () {
  var DELAY_MS = 15000; // 15s — after the 3s lead form

  if (location.pathname.includes('admin')) return;

  // ── Inject CSS ──────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#bw-offer-overlay{',
    '  position:fixed;inset:0;z-index:10001;',
    '  background:rgba(0,0,0,0.88);backdrop-filter:blur(8px);',
    '  display:flex;align-items:center;justify-content:center;padding:16px;',
    '  opacity:0;transition:opacity 0.4s ease;',
    '}',
    '#bw-offer-overlay.bw-of-in{opacity:1;}',
    '#bw-offer-box{',
    '  position:relative;',
    '  width:100%;max-width:480px;',
    '  border-radius:20px;overflow:hidden;',
    '  transform:scale(0.88);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);',
    '  box-shadow:0 24px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(0,223,89,0.2);',
    '}',
    '#bw-offer-overlay.bw-of-in #bw-offer-box{transform:scale(1);}',
    '#bw-offer-img{',
    '  display:block;width:100%;height:auto;',
    '  aspect-ratio:1/1;object-fit:cover;',
    '}',
    '#bw-offer-img.clickable{cursor:pointer;}',
    '#bw-offer-close{',
    '  position:absolute;top:12px;right:12px;',
    '  width:34px;height:34px;border-radius:50%;',
    '  background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);',
    '  border:1px solid rgba(255,255,255,0.2);',
    '  color:#fff;font-size:16px;line-height:1;',
    '  cursor:pointer;display:flex;align-items:center;justify-content:center;',
    '  transition:background 0.2s;',
    '}',
    '#bw-offer-close:hover{background:rgba(0,0,0,0.9);}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Build overlay ────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'bw-offer-overlay';

  function closeOffer() {
    overlay.classList.remove('bw-of-in');
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 450);
  }

  // ── Fetch config & show ──────────────────────────────────────────────────
  function tryShowOffer() {
    fetch('/api/offer-popup')
      .then(function (r) { return r.json(); })
      .then(function (cfg) {
        if (!cfg.enabled || !cfg.imageBase64) return; // nothing to show

        var box = document.createElement('div');
        box.id = 'bw-offer-box';

        var img = document.createElement('img');
        img.id  = 'bw-offer-img';
        img.src = cfg.imageBase64;
        img.alt = cfg.altText || 'Special Offer';

        if (cfg.linkUrl) {
          img.classList.add('clickable');
          img.addEventListener('click', function () {
            window.open(cfg.linkUrl, '_blank', 'noopener');
            closeOffer();
          });
        }

        var closeBtn = document.createElement('button');
        closeBtn.id = 'bw-offer-close';
        closeBtn.setAttribute('aria-label', 'Close offer');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeOffer);

        box.appendChild(img);
        box.appendChild(closeBtn);
        overlay.appendChild(box);

        // Click backdrop to close
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeOffer();
        });

        document.body.appendChild(overlay);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            overlay.classList.add('bw-of-in');
          });
        });
      })
      .catch(function () { /* silent fail */ });
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  onReady(function () {
    setTimeout(tryShowOffer, DELAY_MS);
  });
})();
