/**
 * Bigwin Digital - Offer Popup (FIRST popup)
 * - Appears 3 seconds after page load
 * - Shows admin-uploaded offer image with a CTA button below
 * - When closed fires CustomEvent bw:offer-done so lead form shows next
 */
(function () {
  var DELAY_MS = 3000;

  if (location.pathname.includes('admin')) return;

  function offerDone() {
    window.dispatchEvent(new CustomEvent('bw:offer-done'));
  }

  var style = document.createElement('style');
  style.textContent = [
    '#bw-offer-overlay{position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.9);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity 0.4s ease;}',
    '#bw-offer-overlay.bw-of-in{opacity:1;}',
    '#bw-offer-box{position:relative;width:100%;max-width:500px;border-radius:20px;overflow:hidden;transform:scale(0.88);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 24px 80px rgba(0,0,0,0.9),0 0 0 1px rgba(0,223,89,0.25);background:#0d1410;}',
    '#bw-offer-overlay.bw-of-in #bw-offer-box{transform:scale(1);}',
    '#bw-offer-img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;}',
    '#bw-offer-cta-wrap{padding:16px 20px 20px;background:#0d1410;}',
    '#bw-offer-cta-btn{display:block;width:100%;padding:14px 20px;background:#00df59;color:#000;font-size:15px;font-weight:800;border:none;border-radius:12px;cursor:pointer;text-align:center;text-decoration:none;font-family:inherit;transition:background 0.2s,transform 0.15s;box-shadow:0 4px 20px rgba(0,223,89,0.4);}',
    '#bw-offer-cta-btn:hover{background:#00ff66;transform:scale(1.02);}',
    '#bw-offer-close{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,0.25);color:#fff;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;}',
    '#bw-offer-close:hover{background:rgba(0,0,0,1);}',
    '@media(max-width:540px){#bw-offer-box{max-width:calc(100vw - 32px);}}'
  ].join('');
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'bw-offer-overlay';

  function closeOffer() {
    overlay.classList.remove('bw-of-in');
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      offerDone();
    }, 450);
  }

  function tryShowOffer() {
    fetch('/api/offer-popup')
      .then(function (r) { return r.json(); })
      .then(function (cfg) {
        if (!cfg.enabled || !cfg.imageBase64) {
          setTimeout(offerDone, 2000);
          return;
        }

        var box = document.createElement('div');
        box.id  = 'bw-offer-box';

        var img = document.createElement('img');
        img.id  = 'bw-offer-img';
        img.src = cfg.imageBase64;
        img.alt = cfg.altText || 'Special Offer';

        var closeBtn = document.createElement('button');
        closeBtn.id  = 'bw-offer-close';
        closeBtn.setAttribute('aria-label', 'Close offer');
        closeBtn.innerHTML = '\u00d7';
        closeBtn.addEventListener('click', closeOffer);

        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeOffer();
        });

        box.appendChild(img);

        if (cfg.linkUrl) {
          var ctaWrap     = document.createElement('div');
          ctaWrap.id      = 'bw-offer-cta-wrap';
          var btn         = document.createElement('a');
          btn.id          = 'bw-offer-cta-btn';
          btn.href        = cfg.linkUrl;
          btn.target      = '_blank';
          btn.rel         = 'noopener';
          btn.textContent = cfg.buttonText || 'Claim This Offer';
          btn.addEventListener('click', function () { setTimeout(closeOffer, 300); });
          ctaWrap.appendChild(btn);
          box.appendChild(ctaWrap);
        }

        box.appendChild(closeBtn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () { overlay.classList.add('bw-of-in'); });
        });
      })
      .catch(function () { offerDone(); });
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  onReady(function () { setTimeout(tryShowOffer, DELAY_MS); });
})();