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

const cards = Array.from(document.querySelectorAll('.service-card'));
function measureHeights(card) {
  const frontContent = card.querySelector('.front .content');
  const backContent = card.querySelector('.back .content');
  const rotator = card.querySelector('.rotator');
  const wasFlipped = card.classList.contains('is-flipped');
  rotator.style.transition = 'none';
  card.classList.remove('is-flipped');
  const frontH = frontContent.offsetHeight;
  card.classList.add('is-flipped');
  const backH = backContent.offsetHeight;
  card.classList.toggle('is-flipped', wasFlipped);
  rotator.offsetHeight;
  rotator.style.transition = '';
  card._frontH = frontH;
  card._backH = backH;
}
function applyHeight(card) {
  const showingBack = card.classList.contains('is-flipped');
  const h = showingBack ? card._backH : card._frontH;
  if (h) card.style.height = h + 'px';
}
function addFlipHint(card) {
  const isTouch = (typeof window !== 'undefined' && ('ontouchstart' in window)) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const text = isTouch ? 'Tap to flip' : 'Click to flip';
  ['.front', '.back'].forEach(sel => {
    const face = card.querySelector(sel);
    if (!face) return;
    if (!face.querySelector('.flip-hint')) {
      const hint = document.createElement('span');
      hint.className = 'flip-hint';
      hint.textContent = text;
      face.appendChild(hint);
    }
  });
}
function recalcAll() { cards.forEach(c => { measureHeights(c); applyHeight(c); }); }
cards.forEach(card => {
  measureHeights(card); applyHeight(card); addFlipHint(card);
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    card.classList.toggle('is-flipped'); applyHeight(card);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('is-flipped'); applyHeight(card); }
  });
});
window.addEventListener('load', recalcAll);
window.addEventListener('resize', recalcAll);
document.fonts && document.fonts.ready && document.fonts.ready.then(recalcAll);

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


