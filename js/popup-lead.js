/**
 * Bigwin Digital — Timed Popup Lead Form
 * - Appears after 10 seconds on every page
 * - Shows every time the page loads/refreshes
 * - Same 3-step form as the Free Store Audit button
 * - Submits lead to /api/leads with source = "Popup Form"
 * - Works on every page via header-loader.js
 */
(function () {

  var DELAY_MS = 3000; // 3 seconds

  // ── Inject CSS ───────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#bw-popup-overlay{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.85);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .35s ease;}',
    '#bw-popup-overlay.bw-visible{opacity:1;}',
    '#bw-popup-box{background:#070b08;border:1px solid rgba(0,223,89,.3);border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;padding:36px 32px;position:relative;transform:translateY(20px);transition:transform .35s ease;}',
    '#bw-popup-overlay.bw-visible #bw-popup-box{transform:translateY(0);}',
    '#bw-popup-close{position:absolute;top:16px;right:16px;background:transparent;border:none;cursor:pointer;color:#94a3b8;line-height:1;padding:4px;}',
    '#bw-popup-close:hover{color:#fff;}',
    '.bw-step{display:none;} .bw-step.bw-active{display:block;}',
    '.bw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:#1a2420;color:#64748b;transition:all .2s;}',
    '.bw-dot.active{background:#00df59;color:#000;}',
    '.bw-input{width:100%;background:#0f1710;border:1px solid #27272a;border-radius:12px;padding:12px 14px;color:#fff;font-size:14px;outline:none;transition:border-color .2s;box-sizing:border-box;margin-top:4px;font-family:inherit;}',
    '.bw-input:focus{border-color:#00df59;}',
    '.bw-btn{width:100%;padding:14px;border-radius:12px;font-weight:800;font-size:14px;cursor:pointer;border:none;transition:all .2s;font-family:inherit;}',
    '.bw-btn-primary{background:#00df59;color:#000;} .bw-btn-primary:hover{background:#00ff66;}',
    '.bw-btn-outline{background:transparent;color:#00ff66;border:1.5px solid #00df59;} .bw-btn-outline:hover{background:rgba(0,223,89,.1);}',
    '.bw-cb-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;}',
    '.bw-cb-label{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:10px;border:1px solid #27272a;cursor:pointer;font-size:13px;color:#cbd5e1;transition:all .2s;}',
    '.bw-cb-label:hover{border-color:rgba(0,223,89,.4);} .bw-cb-label input{accent-color:#00df59;}',
    '.bw-err{color:#ef4444;font-size:11px;margin-top:4px;display:none;}',
    '.bw-err.show{display:block;}',
    '@keyframes bw-countdown{from{width:100%}to{width:0%}}',
    '#bw-timer-bar{height:3px;background:#00df59;border-radius:2px;animation:bw-countdown 10s linear forwards;}',
  ].join('');
  document.head.appendChild(style);

  // ── Build HTML ───────────────────────────────────────────────────────────
  var el = document.createElement('div');
  el.id = 'bw-popup-overlay';
  el.innerHTML = [
    '<div id="bw-popup-box">',
    '  <div id="bw-timer-bar"></div>',
    '  <button id="bw-popup-close" aria-label="Close">',
    '    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    '  </button>',

    '  <!-- Step dots -->',
    '  <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:24px;">',
    '    <span class="bw-dot active" id="bw-d1">1</span>',
    '    <span style="width:28px;height:2px;background:#1a2420;border-radius:2px;"></span>',
    '    <span class="bw-dot" id="bw-d2">2</span>',
    '    <span style="width:28px;height:2px;background:#1a2420;border-radius:2px;"></span>',
    '    <span class="bw-dot" id="bw-d3">3</span>',
    '  </div>',

    '  <!-- Step 1: Store & Revenue -->',
    '  <div class="bw-step bw-active" id="bw-s1">',
    '    <div style="text-align:center;margin-bottom:20px;">',
    '      <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:rgba(0,223,89,.1);border:1px solid rgba(0,223,89,.25);color:#00ff66;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px;">🎁 Limited Offer</div>',
    '      <h3 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 6px;">Get Your Free Store Audit</h3>',
    '      <p style="color:#94a3b8;font-size:13px;margin:0;">Takes 60 seconds. No credit card. No obligation.</p>',
    '    </div>',
    '    <label style="display:block;margin-bottom:14px;">',
    '      <span style="color:#94a3b8;font-size:12px;font-weight:600;">Store / Website URL</span>',
    '      <input class="bw-input" id="bw-website" type="url" placeholder="https://yourstore.com">',
    '    </label>',
    '    <label style="display:block;margin-bottom:20px;">',
    '      <span style="color:#94a3b8;font-size:12px;font-weight:600;">Monthly Revenue</span>',
    '      <select class="bw-input" id="bw-revenue">',
    '        <option value="">— Select your range —</option>',
    '        <option>Under $10k/mo</option>',
    '        <option>$10k – $50k/mo</option>',
    '        <option>$50k – $200k/mo</option>',
    '        <option>$200k+/mo</option>',
    '      </select>',
    '    </label>',
    '    <button class="bw-btn bw-btn-primary" id="bw-next1">Next — Choose Services →</button>',
    '  </div>',

    '  <!-- Step 2: Services -->',
    '  <div class="bw-step" id="bw-s2">',
    '    <h3 style="color:#fff;font-size:20px;font-weight:800;text-align:center;margin:0 0 6px;">What do you need help with?</h3>',
    '    <p style="color:#94a3b8;font-size:13px;text-align:center;margin:0 0 16px;">Pick all that apply</p>',
    '    <div class="bw-cb-grid">',
    '      <label class="bw-cb-label"><input type="checkbox" class="bw-svc" value="Performance Ads"> Performance Ads</label>',
    '      <label class="bw-cb-label"><input type="checkbox" class="bw-svc" value="SEO"> SEO</label>',
    '      <label class="bw-cb-label"><input type="checkbox" class="bw-svc" value="Social Media"> Social Media</label>',
    '      <label class="bw-cb-label"><input type="checkbox" class="bw-svc" value="Website / CRO"> Website / CRO</label>',
    '      <label class="bw-cb-label"><input type="checkbox" class="bw-svc" value="Email Marketing"> Email Marketing</label>',
    '      <label class="bw-cb-label"><input type="checkbox" class="bw-svc" value="Full Growth Stack"> Full Growth Stack</label>',
    '    </div>',
    '    <p class="bw-err" id="bw-svc-err">Please select at least one service</p>',
    '    <button class="bw-btn bw-btn-primary" id="bw-next2" style="margin-top:20px;">Next — Your Details →</button>',
    '    <button class="bw-btn bw-btn-outline" id="bw-back1" style="margin-top:8px;">← Back</button>',
    '  </div>',

    '  <!-- Step 3: Contact -->',
    '  <div class="bw-step" id="bw-s3">',
    '    <h3 style="color:#fff;font-size:20px;font-weight:800;text-align:center;margin:0 0 6px;">Almost there!</h3>',
    '    <p style="color:#94a3b8;font-size:13px;text-align:center;margin:0 0 16px;">Our strategist will reach out within 24 hours.</p>',
    '    <label style="display:block;margin-bottom:12px;">',
    '      <span style="color:#94a3b8;font-size:12px;font-weight:600;">Full Name *</span>',
    '      <input class="bw-input" id="bw-name" type="text" placeholder="Jane Smith">',
    '      <p class="bw-err" id="bw-name-err">Name is required</p>',
    '    </label>',
    '    <label style="display:block;margin-bottom:12px;">',
    '      <span style="color:#94a3b8;font-size:12px;font-weight:600;">Work Email *</span>',
    '      <input class="bw-input" id="bw-email" type="email" placeholder="jane@brand.com">',
    '      <p class="bw-err" id="bw-email-err">Valid email is required</p>',
    '    </label>',
    '    <label style="display:block;margin-bottom:20px;">',
    '      <span style="color:#94a3b8;font-size:12px;font-weight:600;">Phone / WhatsApp *</span>',
    '      <input class="bw-input" id="bw-phone" type="tel" placeholder="+91 98765 43210">',
    '      <p class="bw-err" id="bw-phone-err">Phone number is required</p>',
    '    </label>',
    '    <button class="bw-btn bw-btn-primary" id="bw-submit">🚀 Generate My Free Audit</button>',
    '    <button class="bw-btn bw-btn-outline" id="bw-back2" style="margin-top:8px;">← Back</button>',
    '  </div>',

    '  <!-- Success -->',
    '  <div class="bw-step" id="bw-s4">',
    '    <div style="text-align:center;padding:20px 0;">',
    '      <div style="width:64px;height:64px;border-radius:50%;background:#00df59;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">',
    '        <svg width="28" height="28" fill="none" stroke="#000" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>',
    '      </div>',
    '      <h3 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 8px;">Thank You! 🎉</h3>',
    '      <p style="color:#00ff66;font-weight:600;margin:0 0 8px;">Our team will connect with you shortly.</p>',
    '      <p style="color:#94a3b8;font-size:13px;margin:0;">A Senior Growth Strategist from Bigwin Digital will reach out within <strong style="color:#fff;">24 hours</strong> to discuss your free audit.</p>',
    '      <button class="bw-btn bw-btn-outline" id="bw-close-success" style="margin-top:24px;width:auto;padding:10px 28px;">Back to Site</button>',
    '    </div>',
    '  </div>',

    '</div>'
  ].join('');

  // ── Helpers ──────────────────────────────────────────────────────────────
  function show(id) {
    ['bw-s1','bw-s2','bw-s3','bw-s4'].forEach(function(s) {
      document.getElementById(s).classList.remove('bw-active');
    });
    document.getElementById(id).classList.add('bw-active');
  }
  function dot(n) {
    [1,2,3].forEach(function(i) {
      var d = document.getElementById('bw-d' + i);
      if (d) d.classList.toggle('active', i <= n);
    });
  }
  function showErr(id, show) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('show', show);
  }
  function highlightInput(id, err) {
    var el = document.getElementById(id);
    if (el) el.style.borderColor = err ? '#ef4444' : '';
  }

  function closePopup() {
    el.classList.remove('bw-visible');
    setTimeout(function() { el.remove(); }, 400);
  }

  async function submitLead() {
    var name  = (document.getElementById('bw-name')?.value  || '').trim();
    var email = (document.getElementById('bw-email')?.value || '').trim();
    var phone = (document.getElementById('bw-phone')?.value || '').trim();
    var website = (document.getElementById('bw-website')?.value || '').trim();
    var revenue = (document.getElementById('bw-revenue')?.value || '').trim();
    var services = [...document.querySelectorAll('.bw-svc:checked')].map(function(c){return c.value;}).join(', ');

    // Validate step 3
    var valid = true;
    showErr('bw-name-err',  !name);  highlightInput('bw-name',  !name);
    showErr('bw-email-err', !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    highlightInput('bw-email', !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    showErr('bw-phone-err', !phone); highlightInput('bw-phone', !phone);
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) valid = false;
    if (!valid) return;

    var btn = document.getElementById('bw-submit');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    var lead = {
      name:     name,
      email:    email,
      phone:    phone,
      website:  website,
      revenue:  revenue,
      services: services,
      source:   'Popup Form'
    };

    try {
      await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(lead)
      });
    } catch(e) {
      console.warn('Popup lead capture failed:', e);
    }

    sessionStorage.removeItem('bw_popup_done'); // always allow next load
    dot(3);
    show('bw-s4');
  }

  // ── Run after DOM is ready (handles dynamic script injection) ───────────
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn(); // DOM already ready — run immediately
    }
  }

  // ── Attach to DOM & wire events after mount ──────────────────────────────
  onReady(function () {
    setTimeout(function () {
      // Don't show on admin page
      if (location.pathname.includes('admin')) return;
      // Don't show if already submitted
      document.body.appendChild(el);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.classList.add('bw-visible'); });
      });

      // Close buttons
      document.getElementById('bw-popup-close').onclick  = closePopup;
      document.getElementById('bw-close-success').onclick = closePopup;
      el.addEventListener('click', function(e) { if (e.target === el) closePopup(); });

      // Step navigation
      document.getElementById('bw-next1').onclick = function () { dot(2); show('bw-s2'); };
      document.getElementById('bw-back1').onclick = function () { dot(1); show('bw-s1'); };
      document.getElementById('bw-next2').onclick = function () {
        var checked = document.querySelectorAll('.bw-svc:checked').length;
        showErr('bw-svc-err', !checked);
        if (!checked) return;
        dot(3); show('bw-s3');
      };
      document.getElementById('bw-back2').onclick = function () { dot(2); show('bw-s2'); };
      document.getElementById('bw-submit').onclick = submitLead;

    }, DELAY_MS);
  });
})();
