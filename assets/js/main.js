const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuContent = document.getElementById('mobileMenuContent');
const iconBars = document.getElementById('iconBars');
const iconX = document.getElementById('iconX');
const overlay = document.getElementById('menuOverlay');

function setOverlay(open) {
  if (!overlay) return;
  overlay.classList.toggle('opacity-0', !open);
  overlay.classList.toggle('opacity-100', open);
  overlay.classList.toggle('pointer-events-none', !open);
}
function setMenu(open) {
  if (!mobileMenu || !mobileMenuContent) return;
  if (open) {
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('open');
    mobileMenu.style.maxHeight = mobileMenuContent.scrollHeight + 'px';
    document.body.style.overflow = 'hidden';
    iconBars?.classList.add('hidden');
    iconX?.classList.remove('hidden');
    menuBtn?.setAttribute('aria-expanded', 'true');
    menuBtn?.setAttribute('aria-label', 'Close menu');
    setOverlay(true);
  } else {
    mobileMenu.style.maxHeight = '0px';
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    iconBars?.classList.remove('hidden');
    iconX?.classList.add('hidden');
    menuBtn?.setAttribute('aria-expanded', 'false');
    menuBtn?.setAttribute('aria-label', 'Open menu');
    setOverlay(false);
  }
}
mobileMenu?.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'max-height' && mobileMenu.style.maxHeight === '0px') {
    mobileMenu.classList.add('hidden');
  }
});
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  setMenu(!open);
});
overlay?.addEventListener('click', () => setMenu(false));
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

function animateCount(el) {
  const end = parseInt(el.getAttribute('data-counter'), 10);
  let current = 0; const duration = 1200; const start = performance.now();
  function tick(t) {
    const p = Math.min(1, (t - start) / duration);
    current = Math.floor(end * p);
    el.textContent = current + (end < 100 ? '%' : '');
    if (p < 1) requestAnimationFrame(tick); else el.textContent = end + (end < 100 ? '%' : '');
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('[data-counter]');
const io2 = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target._counted) {
      e.target._counted = true;
      animateCount(e.target);
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => io2.observe(c));

const toggle = document.getElementById('priceToggle');
const dot = document.getElementById('priceDot');
const prices = document.querySelectorAll('.price');
let monthly = true;
function knobPositions() {
  if (!toggle || !dot) return { start: 0, end: 0 };
  const trackW = toggle.clientWidth;
  const knobW = dot.clientWidth;
  const margin = 4;
  const start = margin;
  const end = Math.max(margin, trackW - knobW - margin);
  return { start, end };
}
function renderPrices() {
  prices.forEach(p => { p.textContent = p.dataset[monthly ? 'month' : 'one']; });
  const { start, end } = knobPositions();
  if (dot) dot.style.transform = `translateX(${monthly ? start : end}px)`;
  const labelM = document.getElementById('labelMonthly');
  const labelO = document.getElementById('labelOneoff');
  if (labelM) {
    labelM.classList.toggle('font-semibold', monthly);
    labelM.classList.toggle('text-slate-900', monthly);
    labelM.classList.toggle('text-slate-500', !monthly);
  }
  if (labelO) {
    labelO.classList.toggle('font-semibold', !monthly);
    labelO.classList.toggle('text-slate-900', !monthly);
    labelO.classList.toggle('text-slate-500', monthly);
  }
}
if (toggle && dot) {
  renderPrices();
  toggle.addEventListener('click', () => {
    monthly = !monthly;
    renderPrices();
    toggle.setAttribute('aria-pressed', String(monthly));
  });
  window.addEventListener('resize', renderPrices);
  document.fonts && document.fonts.ready && document.fonts.ready.then(renderPrices);
}

function fakeSubmit() {
  const m = document.getElementById('formMsg');
  if (!m) return;
  m.classList.remove('hidden');
  setTimeout(() => m.classList.add('hidden'), 3500);
}
window.fakeSubmit = fakeSubmit;



(function () {
  const el = document.getElementById('hero-bg');
  if (!el) return;
  let y = 0, t = 0;
  const onScroll = () => { y = window.scrollY || 0; };
  const raf = () => {
    t += (y - t) * 0.06;
    el.style.transform = `translate3d(0, ${t * -0.08}px, 0)`;
    requestAnimationFrame(raf);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  raf();
})();

(function () {
  const charts = document.querySelectorAll('svg.progress-chart[data-percent]');
  if (!charts.length) return;
  function animate(svg) {
    const pct = Math.max(0, Math.min(100, parseFloat(svg.dataset.percent) || 0));
    const fg = svg.querySelector('.fg');
    const label = svg.querySelector('.pct');
    if (fg) {
      fg.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(.22,1,.36,1)';
      requestAnimationFrame(() => { fg.style.strokeDashoffset = (100 - pct) + ''; });
    }
    if (label) label.textContent = pct.toFixed(2) + '%';
  }
  const ioProgress = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = '1';
        animate(e.target);
      }
    });
  }, { threshold: 0.4 });
  charts.forEach(svg => ioProgress.observe(svg));

  // Animate sparkline path when revealed
  const sparklines = document.querySelectorAll('.spark-draw');
  const ioSpark = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(.22,1,.36,1)';
        requestAnimationFrame(() => { e.target.style.strokeDashoffset = '0'; });
        ioSpark.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  sparklines.forEach(p => ioSpark.observe(p));
  setTimeout(() => {
    const svg = document.querySelector('svg.progress-chart');
    const fg = svg && svg.querySelector('.fg');
    console.assert(!!svg, '[TEST] Progress SVG exists');
    console.assert(!!fg, '[TEST] Progress foreground circle exists');
    if (fg && typeof fg.style.strokeDashoffset !== 'undefined') {
      const val = parseFloat(fg.style.strokeDashoffset);
      if (!Number.isNaN(val)) {
        console.assert(val <= 30.5, `[TEST] strokeDashoffset ~= 29.56 for 70.44%. Got ${val}`);
      }
    }
    const spark = document.querySelector('.spark-draw');
    console.assert(!!spark, '[TEST] Sparkline path exists');
  }, 1500);
})();

/* ============================================
   HERO DASHBOARD BAR FILLS
   ============================================ */
(function () {
  const fills = document.querySelectorAll('.hero-dash-fill');
  if (!fills.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('animated'), 200);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();

/* ============================================
   SERVICES INTERACTIVE NODE NETWORK
   ============================================ */
(function () {
  const section = document.getElementById('services');
  const canvas = document.getElementById('servicesCanvas');
  if (!section || !canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [];
  let running = false, raf = null;
  const mouse = { x: -9999, y: -9999, active: false };
  const MOUSE_DIST = 170;

  function count() {
    const target = Math.round((W * H) / 22000);
    return Math.max(24, Math.min(70, target));
  }

  function resize() {
    const r = section.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    const n = count();
    nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 1
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, W, H);

    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // gentle drift toward the cursor when close
      if (mouse.active) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_DIST && d > 0.1) {
          const f = (1 - d / MOUSE_DIST) * 0.04;
          p.x += dx * f; p.y += dy * f;
        }
      }
    }

    // node-to-node links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(16,185,129,${(1 - dist / 130) * 0.18})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // links + glow toward the cursor
    for (const p of nodes) {
      let near = false;
      if (mouse.active) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_DIST) {
          near = true;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16,185,129,${(1 - d / MOUSE_DIST) * 0.5})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, near ? p.r + 0.8 : p.r, 0, Math.PI * 2);
      ctx.fillStyle = near ? 'rgba(5,150,105,0.85)' : 'rgba(16,185,129,0.5)';
      ctx.fill();
    }

    raf = requestAnimationFrame(step);
  }

  function start() { if (!running) { running = true; step(); } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
    section.style.setProperty('--mx', mouse.x + 'px');
    section.style.setProperty('--my', mouse.y + 'px');
  });
  section.addEventListener('pointerleave', () => { mouse.active = false; mouse.x = mouse.y = -9999; });

  // Only animate while the section is on screen
  const vis = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? start() : stop());
  }, { threshold: 0.05 });
  vis.observe(section);

  resize();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
})();

/* ============================================
   HERO PARTICLE CANVAS — KZN-inspired
   ============================================ */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  // Respect reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H;
  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 160;
  const particles = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 2 + 1;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.fill();
  };

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', () => { resize(); });
})();
