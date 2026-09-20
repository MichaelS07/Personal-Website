/* NovaReach FX — interactive constellation + cursor spotlight.
   Tasteful, lightweight, respects reduced-motion, pauses when offscreen. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function constellation(canvas) {
    var ctx = canvas.getContext('2d');
    var color = canvas.dataset.color || '16,185,129';
    var maxDist = parseInt(canvas.dataset.dist || '130', 10);
    var host = canvas.closest('section') || canvas.parentElement;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var dots = [], w = 0, h = 0;
    var mouse = { x: null, y: null };
    var raf = null, running = false;

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(16, Math.min(64, Math.floor(w * h * 0.00007)));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      var i, j;
      for (i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        if (mouse.x != null) {
          var mdx = mouse.x - d.x, mdy = mouse.y - d.y, md = Math.hypot(mdx, mdy);
          if (md < 150 && md > 0.01) { d.x += mdx / md * 0.35; d.y += mdy / md * 0.35; }
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + color + ',0.75)';
        ctx.fill();
      }
      for (i = 0; i < dots.length; i++) {
        for (j = i + 1; j < dots.length; j++) {
          var a = dots[i], b = dots[j], dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(' + color + ',' + (0.16 * (1 - dist / maxDist)) + ')';
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      if (mouse.x != null) {
        for (i = 0; i < dots.length; i++) {
          var p = dots[i], pdx = p.x - mouse.x, pdy = p.y - mouse.y, pd = Math.hypot(pdx, pdy);
          if (pd < 170) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(' + color + ',' + (0.22 * (1 - pd / 170)) + ')';
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!running && !reduce) { running = true; frame(); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    host.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    host.addEventListener('mouseleave', function () { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', function () { resize(); });

    resize();
    if (reduce) { frame(); return; } // one static frame, no animation
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0 }).observe(canvas);
    } else { start(); }
  }

  function spotlight(el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      el.classList.add('fx-on');
    });
    el.addEventListener('mouseleave', function () { el.classList.remove('fx-on'); });
  }

  function init() {
    document.querySelectorAll('canvas[data-constellation]').forEach(constellation);
    document.querySelectorAll('[data-spotlight]').forEach(spotlight);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* Homepage latest-writing override — 21 Sep 2026 Meta Advantage+ creative test post */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  ready(function () {
    var side = document.querySelector('.side-card');
    if (side && side.querySelector('.lbl') && /LATEST WRITING/i.test(side.querySelector('.lbl').textContent || '')) {
      side.innerHTML = '<div class="lbl">LATEST WRITING</div><div class="meta">Meta · 21 Sep 2026</div><h3>Don\'t hand Meta a blank Advantage+ budget for Black Friday — run one creative test first</h3><p>One September creative test beats a November budget raise. Kill losers before you scale Advantage+ for BFCM.</p><div class="foot"><span>Paid Media · 21 Sep · Meta</span><a href="blog.html">All posts →</a></div>';
    }
    var feat = document.querySelector('a.feat-post');
    var list = document.querySelector('.post-list');
    if (feat && list) {
      var oldHref = feat.getAttribute('href') || '';
      var oldThumb = (feat.querySelector('.feat-thumb') || {}).src || '';
      var oldMeta = (feat.querySelector('.meta') || {}).textContent || '';
      var oldTitle = (feat.querySelector('h3') || {}).textContent || '';
      feat.setAttribute('href', 'blog-posts/meta-advantage-creative-test-before-bfcm.html');
      var thumb = feat.querySelector('.feat-thumb');
      if (thumb) { thumb.src = 'images/blog/meta-advantage-creative-test-before-bfcm.svg'; thumb.alt = ''; }
      var meta = feat.querySelector('.meta');
      if (meta) meta.textContent = 'Meta · 21 Sep 2026 · Featured';
      var h3 = feat.querySelector('h3');
      if (h3) h3.textContent = 'Don\'t hand Meta a blank Advantage+ budget for Black Friday — run one creative test first';
      var p = feat.querySelector('p');
      if (p) p.textContent = 'NZ/AU stores dump Q4 budget into Advantage+ with last year\'s creatives and wonder why CPA climbs. One September creative test beats a November budget raise.';
      if (oldHref && oldHref.indexOf('meta-advantage-creative-test') === -1) {
        var row = document.createElement('a');
        row.className = 'post-row';
        row.href = oldHref;
        var img = document.createElement('img');
        img.className = 'pr-thumb';
        img.loading = 'lazy';
        img.alt = '';
        if (oldThumb.indexOf('abandon-cart') !== -1 || oldHref.indexOf('abandon-cart') !== -1) {
          img.src = 'images/blog/abandon-cart-nz-au-freight-before-q4.svg';
        } else if (oldThumb.indexOf('ai-max') !== -1 || oldHref.indexOf('ai-max') !== -1) {
          img.src = 'images/blog/ai-max-search-auto-conversion-sept-2026.svg';
        } else {
          img.src = oldThumb || 'images/blog/abandon-cart-nz-au-freight-before-q4.svg';
        }
        var wrap = document.createElement('div');
        var rm = document.createElement('div');
        rm.className = 'meta';
        rm.textContent = (oldMeta || 'Email · 14 Sep 2026').replace(/\s*·\s*Featured/, '');
        var h4 = document.createElement('h4');
        h4.textContent = oldTitle || 'Stop discounting abandon carts before Q4 — fix freight and GST first';
        wrap.appendChild(rm); wrap.appendChild(h4);
        row.appendChild(img); row.appendChild(wrap);
        var firstRow = list.querySelector('.post-row');
        if (firstRow) list.insertBefore(row, firstRow);
        else list.insertBefore(row, list.firstChild);
      }
    }
  });
})();
