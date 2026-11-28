/**
 * Bigwin Digital — Solar System Hero Background
 * Digital marketing platforms orbit a glowing green "sun" (Bigwin core)
 * Rendered on a fullscreen canvas behind the hero section text.
 */
(function () {
  'use strict';

  /* ── Platform definitions ─────────────────────────────────────────────── */
  var PLATFORMS = [
    // name, orbit radius multiplier, speed multiplier, icon SVG path commands, brand colour
    { name:'Meta',      r:0.13, spd:1.00, color:'#1877F2',
      svg:'M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h8.615v-6.96h-2.338v-2.717h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.717h-2.348V21H20a1 1 0 001-1V4a1 1 0 00-1-1z'},
    { name:'Google',    r:0.20, spd:0.72, color:'#4285F4',
      svg:'M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 3C7.021 3 2.543 7.477 2.543 13s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z'},
    { name:'YouTube',   r:0.28, spd:0.55, color:'#FF0000',
      svg:'M21.593 7.203a2.506 2.506 0 00-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 00-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 001.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.998 15.505V8.497l5.208 3.507-5.208 3.501z'},
    { name:'Instagram', r:0.37, spd:0.42, color:'#E1306C',
      svg:'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'},
    { name:'TikTok',    r:0.46, spd:0.33, color:'#010101',
      svg:'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.76a4.84 4.84 0 01-1.02-.07z'},
    { name:'LinkedIn',  r:0.56, spd:0.26, color:'#0A66C2',
      svg:'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'},
    { name:'Twitter',   r:0.65, spd:0.21, color:'#1DA1F2',
      svg:'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'},
    { name:'Snapchat',  r:0.74, spd:0.17, color:'#FFFC00',
      svg:'M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.814-.01.149-.01.291-.01.44 0 .463.671.774 1.766.774.267 0 .54-.031.802-.093.136-.03.273-.052.419-.052.459 0 .997.267 1.023.735.025.467-.556.887-1.351 1.235-.21.09-.264.195-.264.332 0 .108.062.251.159.432.288.564.72 1.414 1.056 2.521.09.291.064.527-.07.722-.323.471-1.068.722-2.034.869-.101.316-.232 1.044-.48 1.049-.207 0-.54-.126-1.072-.339-.424-.168-.915-.361-1.5-.453-.491-.074-1.044.168-1.544.419-.501.252-1.038.52-1.713.52-.675 0-1.212-.268-1.713-.52-.5-.251-1.053-.493-1.544-.419-.585.092-1.076.285-1.5.453-.532.213-.865.339-1.072.339-.244-.005-.379-.733-.48-1.049-.966-.147-1.711-.398-2.034-.869-.134-.195-.16-.431-.07-.722.336-1.107.768-1.957 1.056-2.521.097-.181.159-.324.159-.432 0-.137-.054-.242-.264-.332C4.542 11.44 3.961 11.02 3.986 10.553c.026-.468.564-.735 1.023-.735.146 0 .283.022.419.052.262.062.535.093.802.093 1.095 0 1.766-.311 1.766-.774 0-.149 0-.291-.01-.44-.086-1.595-.212-3.621.317-4.814C9.859 1.069 13.216.793 14.206.793h-2z'},
    { name:'Pinterest', r:0.83, spd:0.14, color:'#E60023',
      svg:'M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z'},
  ];

  /* ── Canvas setup ─────────────────────────────────────────────────────── */
  var canvas = document.createElement('canvas');
  canvas.id  = 'bw-solar-bg';
  canvas.style.cssText = [
    'position:absolute',
    'inset:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:0',
    'opacity:0.55',
  ].join(';');

  var hero = document.querySelector('section.max-w-7xl');
  if (!hero) return;
  hero.style.position = 'relative';
  hero.insertBefore(canvas, hero.firstChild);

  /* ── Sizing ───────────────────────────────────────────────────────────── */
  var dpr = window.devicePixelRatio || 1;
  var W, H, cx, cy, maxR;

  function resize() {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    cx = W / 2;
    cy = H / 2;
    maxR = Math.min(W, H) * 0.46;
  }
  resize();
  window.addEventListener('resize', resize);

  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  /* ── Pre-render icon images via offscreen canvas ──────────────────────── */
  var iconSize = 36;
  var iconCache = {};

  function makeIconCanvas(platform) {
    var oc = document.createElement('canvas');
    oc.width = oc.height = iconSize;
    var octx = oc.getContext('2d');

    // Circle background
    var grad = octx.createRadialGradient(iconSize/2, iconSize/2, 2, iconSize/2, iconSize/2, iconSize/2);
    grad.addColorStop(0, '#1a2420');
    grad.addColorStop(1, '#0d1710');
    octx.fillStyle = grad;
    octx.beginPath();
    octx.arc(iconSize/2, iconSize/2, iconSize/2, 0, Math.PI*2);
    octx.fill();

    // Border glow
    octx.strokeStyle = platform.color + 'cc';
    octx.lineWidth = 1.5;
    octx.stroke();

    // SVG icon path
    var scale = iconSize / 24;
    octx.save();
    octx.scale(scale, scale);
    octx.fillStyle = platform.color;
    var p = new Path2D(platform.svg);
    octx.fill(p);
    octx.restore();

    return oc;
  }

  PLATFORMS.forEach(function(pl) {
    iconCache[pl.name] = makeIconCanvas(pl);
  });

  /* ── Star field ───────────────────────────────────────────────────────── */
  var STARS = [];
  for (var i = 0; i < 80; i++) {
    STARS.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random()
    });
  }

  /* ── Animation ────────────────────────────────────────────────────────── */
  var startTime = null;

  function draw(ts) {
    if (!startTime) startTime = ts;
    var t = (ts - startTime) / 1000; // seconds

    ctx.clearRect(0, 0, W, H);

    /* Stars */
    STARS.forEach(function(s) {
      ctx.globalAlpha = s.a * 0.6;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    /* Sun (central glow) */
    var sunR = maxR * 0.055;
    var sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 3.5);
    sg.addColorStop(0,   '#00ff66ff');
    sg.addColorStop(0.2, '#00df59cc');
    sg.addColorStop(0.5, '#00df5933');
    sg.addColorStop(1,   '#00df5900');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(cx, cy, sunR * 3.5, 0, Math.PI*2);
    ctx.fill();

    // Sun core
    var sc = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR);
    sc.addColorStop(0, '#ffffff');
    sc.addColorStop(0.4, '#00ff88');
    sc.addColorStop(1,   '#00df59');
    ctx.fillStyle = sc;
    ctx.beginPath();
    ctx.arc(cx, cy, sunR, 0, Math.PI*2);
    ctx.fill();

    /* Orbits + icons */
    PLATFORMS.forEach(function(pl) {
      var orbitR = maxR * pl.r;
      var angle  = t * pl.spd * 0.6 + (PLATFORMS.indexOf(pl) * Math.PI * 2 / PLATFORMS.length);

      // Orbit ring (dashed)
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#00df59';
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI*2);
      ctx.stroke();
      ctx.restore();

      // Icon position
      var ix = cx + Math.cos(angle) * orbitR;
      var iy = cy + Math.sin(angle) * orbitR;

      // Glow aura behind icon
      var aura = ctx.createRadialGradient(ix, iy, 0, ix, iy, iconSize * 0.9);
      aura.addColorStop(0, pl.color + '55');
      aura.addColorStop(1, pl.color + '00');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(ix, iy, iconSize * 0.9, 0, Math.PI*2);
      ctx.fill();

      // Icon image
      var ic = iconCache[pl.name];
      ctx.drawImage(ic, ix - iconSize/2, iy - iconSize/2, iconSize, iconSize);
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();