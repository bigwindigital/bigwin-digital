/**
 * Bigwin Digital - Offer Popup (Premium Design)
 * - Glowing card, badge overlay, animated CTA button
 * - Fires bw:offer-done when closed so lead form shows next
 */
(function () {
  var DELAY_MS = 3000;

  if (location.pathname.includes('admin')) return;

  function offerDone() {
    window.dispatchEvent(new CustomEvent('bw:offer-done'));
  }

  // ── CSS ──────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    /* Overlay */
    '#bw-offer-overlay{position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .4s ease;}',
    '#bw-offer-overlay::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(10px);}',
    '#bw-offer-overlay.bw-of-in{opacity:1;}',

    /* Card */
    '#bw-offer-card{position:relative;z-index:1;width:100%;max-width:460px;border-radius:24px;overflow:hidden;',
    '  transform:translateY(32px) scale(0.92);',
    '  transition:transform .5s cubic-bezier(0.34,1.4,0.64,1);',
    '  box-shadow:0 0 0 1px rgba(0,223,89,0.4),0 0 40px rgba(0,223,89,0.15),0 32px 80px rgba(0,0,0,0.9);',
    '  background:linear-gradient(160deg,#0d1a10 0%,#060c07 100%);}',
    '#bw-offer-overlay.bw-of-in #bw-offer-card{transform:translateY(0) scale(1);}',

    /* Image wrapper */
    '#bw-offer-img-wrap{position:relative;overflow:hidden;}',
    '#bw-offer-img{display:block;width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;',
    '  transition:transform .4s ease;}',
    '#bw-offer-card:hover #bw-offer-img{transform:scale(1.02);}',

    /* Gradient fade at bottom of image */
    '#bw-offer-img-wrap::after{content:"";position:absolute;bottom:0;left:0;right:0;height:80px;',
    '  background:linear-gradient(to top,#060c07,transparent);pointer-events:none;}',

    /* "Limited Offer" badge on image */
    '#bw-offer-badge{position:absolute;top:14px;left:14px;',
    '  display:inline-flex;align-items:center;gap:5px;',
    '  padding:5px 12px;border-radius:999px;',
    '  background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);',
    '  border:1px solid rgba(0,223,89,0.5);',
    '  color:#00ff66;font-size:11px;font-weight:800;',
    '  text-transform:uppercase;letter-spacing:.06em;',
    '  font-family:inherit;}',

    /* Bottom content */
    '#bw-offer-body{padding:16px 20px 22px;}',

    /* CTA button */
    '#bw-offer-cta-btn{',
    '  display:flex;align-items:center;justify-content:center;gap:8px;',
    '  width:100%;padding:15px 20px;',
    '  background:linear-gradient(135deg,#00df59 0%,#00c44f 100%);',
    '  color:#000;font-size:15px;font-weight:900;',
    '  border:none;border-radius:14px;',
    '  cursor:pointer;text-align:center;text-decoration:none;',
    '  font-family:inherit;letter-spacing:.01em;',
    '  transition:all .2s;',
    '  box-shadow:0 4px 24px rgba(0,223,89,0.45),0 1px 0 rgba(255,255,255,0.15) inset;}',
    '#bw-offer-cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,223,89,0.6),0 1px 0 rgba(255,255,255,0.15) inset;background:linear-gradient(135deg,#00ff66 0%,#00df59 100%);}',
    '#bw-offer-cta-btn:active{transform:translateY(0);}',
    '.bw-btn-arrow{width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;}',

    /* Skip link */
    '#bw-offer-skip{display:block;text-align:center;margin-top:10px;color:#475569;font-size:11px;cursor:pointer;',
    '  font-family:inherit;background:none;border:none;width:100%;',
    '  transition:color .2s;}',
    '#bw-offer-skip:hover{color:#94a3b8;}',

    /* Close X */
    '#bw-offer-close{',
    '  position:absolute;top:12px;right:12px;z-index:10;',
    '  width:32px;height:32px;border-radius:50%;',
    '  background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);',
    '  border:1px solid rgba(255,255,255,0.15);',
    '  color:#94a3b8;font-size:16px;line-height:1;',
    '  cursor:pointer;display:flex;align-items:center;justify-content:center;',
    '  transition:all .2s;font-family:inherit;}',
    '#bw-offer-close:hover{background:rgba(0,0,0,0.9);color:#fff;border-color:rgba(255,255,255,0.3);}',

    /* Pulse ring on card */
    '@keyframes bw-glow-pulse{0%,100%{box-shadow:0 0 0 1px rgba(0,223,89,0.4),0 0 40px rgba(0,223,89,0.15),0 32px 80px rgba(0,0,0,0.9);}50%{box-shadow:0 0 0 1px rgba(0,223,89,0.7),0 0 60px rgba(0,223,89,0.25),0 32px 80px rgba(0,0,0,0.9);}}',
    '#bw-offer-overlay.bw-of-in #bw-offer-card{animation:bw-glow-pulse 3s ease-in-out infinite;}',

    '@media(max-width:500px){#bw-offer-card{max-width:calc(100vw - 24px);}}'
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
    fetch('/api/offer-popup?t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (cfg) {
        if (!cfg.enabled || !cfg.imageBase64) {
          setTimeout(offerDone, 2000);
          return;
        }

        var card = document.createElement('div');
        card.id  = 'bw-offer-card';

        // ── Image section ──────────────────────────────────────────────
        var imgWrap = document.createElement('div');
        imgWrap.id  = 'bw-offer-img-wrap';

        var img = document.createElement('img');
        img.id  = 'bw-offer-img';
        img.src = cfg.imageBase64;
        img.alt = cfg.altText || 'Special Offer';

        // "Limited Offer" badge
        var badge       = document.createElement('div');
        badge.id        = 'bw-offer-badge';
        badge.innerHTML = '<svg width="8" height="8" viewBox="0 0 8 8" fill="#00ff66"><circle cx="4" cy="4" r="4"/></svg> Limited Offer';

        imgWrap.appendChild(img);
        imgWrap.appendChild(badge);

        // ── Body section ───────────────────────────────────────────────
        var body = document.createElement('div');
        body.id  = 'bw-offer-body';

        if (cfg.linkUrl) {
          var btn         = document.createElement('a');
          btn.id          = 'bw-offer-cta-btn';
          btn.href        = cfg.linkUrl;
          btn.target      = '_blank';
          btn.rel         = 'noopener';
          var btnLabel    = cfg.buttonText || 'Claim This Offer';
          btn.innerHTML   =
            '<span>' + btnLabel + '</span>' +
            '<span class="bw-btn-arrow">' +
              '<svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 12h14M12 5l7 7-7 7"/></svg>' +
            '</span>';
          btn.addEventListener('click', function () { setTimeout(closeOffer, 300); });
          body.appendChild(btn);
        }

        var skip = document.createElement('button');
        skip.id  = 'bw-offer-skip';
        skip.textContent = 'No thanks, skip this offer';
        skip.addEventListener('click', closeOffer);
        body.appendChild(skip);

        // ── Close X ────────────────────────────────────────────────────
        var closeBtn = document.createElement('button');
        closeBtn.id  = 'bw-offer-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.innerHTML = '\u00d7';
        closeBtn.addEventListener('click', closeOffer);

        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) closeOffer();
        });

        card.appendChild(imgWrap);
        card.appendChild(body);
        card.appendChild(closeBtn);
        overlay.appendChild(card);
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