/**
 * Bigwin Digital — Offer Popup (FIRST popup)
 * - Appears 3 seconds after page load
 * - Shows admin-uploaded 1080×1080 offer image
 * - When closed (or if disabled/no image), fires CustomEvent 'bw:offer-done'
 *   so the lead form knows it can show next
 */
(function () {
  var DELAY_MS = 3000;

  if (location.pathname.includes('admin')) return;

  // -- Helper: signal that offer is done so lead popup can proceed ----------
  function offerDone() {
    window.dispatchEvent(new CustomEvent('bw:offer-done'));
  }

  // -- Inject CSS -----------------------------------------------------------
  var style = document.createElement('style');
  style.textContent = [
    '#bw-offer-overlay{',
    '  position:fixed;inset:0;z-index:10001;',
    '  background:rgba(0,0,0,0.9);backdrop-filter:blur(8px);',
    '  display:flex;align-items:center;justify-content:center;padding:16px;',
    '  opacity:0;transition:opacity 0.4s ease;',
    '}',
    '#bw-offer-overlay.bw-of-in{opacity:1;}',
    '#bw-offer-box{',
    '  position:relative;',
    '  width:100%;max-width:500px;',
    '  border-radius:20px;overflow:hidden;',
    '  transform:scale(0.88);',
    '  transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);',
    '  box-shadow:0 24px 80px rgba(0,0,0,0.9),0 0 0 1px rgba(0,223,89,0.25);',
    '}',
    '#bw-offer-overlay.bw-of-in #bw-offer-box{transform:scale(1);}',
    '#bw-offer-img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;}',
    '#bw-offer-img.clickable{cursor:pointer;}',
    '#bw-offer-close{',
    '  position:absolute;top:12px;right:12px;',
    '  width:36px;height:36px;border-radius:50%;',
    '  background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);',
    '  border:1px solid rgba(255,255,255,0.25);',
    '  color:#fff;font-size:18px;line-height:1;',
    '  cursor:pointer;display:flex;align-items:center;justify-content:center;',
    '  transition:background 0.2s;font-weight:400;',
    '}',
    '#bw-offer-close:hover{background:rgba(0,0,0,1);}',
  ].join('\n');
  document.head.appendChild(style);

  // -- Build overlay --------------------------------------------------------
  var overlay = document.createElement('div');
  overlay.id = 'bw-offer-overlay';

  function closeOffer() {
    overlay.classList.remove('bw-of-in');
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      offerDone(); // ? trigger lead popup AFTER offer closes
    }, 450);
  }

  // -- Fetch config & show --------------------------------------------------
  function tryShowOffer() {
    fetch('/api/offer-popup')
      .then(function (r) { return r.json(); })
      .then(function (cfg) {
        if (!cfg.enabled || !cfg.imageBase64) {
          setTimeout(offerDone, 2000); // disabled: 2s pause then trigger lead popup
          return;
        }

        var box = document.createElement('div');
        box.id  = 'bw-offer-box';

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
        closeBtn.id  = 'bw-offer-close';
        closeBtn.setAttribute('aria-label', 'Close offer');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', closeOffer);

        // Click backdrop to close
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeOffer();
        });

        box.appendChild(img);
        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            overlay.classList.add('bw-of-in');
          });
        });
      })
      .catch(function () {
        offerDone(); // on error ? don't block lead popup
      });
  }

  // -- Init -----------------------------------------------------------------
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  onReady(function () {
    setTimeout(tryShowOffer, DELAY_MS);
  });
})();