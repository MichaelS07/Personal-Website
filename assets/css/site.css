/* assets/js/main.js */
'use strict';

/* ============ Mobile menu + overlay ============ */
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
    iconBars && iconBars.classList.add('hidden');
    iconX && iconX.classList.remove('hidden');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn && menuBtn.setAttribute('aria-label', 'Close menu');
    setOverlay(true);
  } else {
    mobileMenu.style.maxHeight = '0px';
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    iconBars && iconBars.classList.remove('hidden');
    iconX && iconX.classList.add('hidden');
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn && menuBtn.setAttribute('aria-label', 'Open menu');
    setOverlay(false);
  }
}

mobileMenu && mobileMenu.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'max-height' && mobileMenu.style.maxHeight === '0px') {
    mobileMenu.classList.add('hidden');
  }
});
menuBtn && menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  setMenu(!open);
});
overlay && overlay.addEventListener('click', () => setMenu(false));
mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ============ Footer year ============ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============ Reveal-on-scroll ============ */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
}

/* ============ Animated counters ============ */
function animateCount(el) {
  const end = parseInt(el.getAttribute('data-counter'), 10);
  if (Number.isNaN(end)) return;
  let current = 0;
  const duration = 1200;
  const start = performance.now();
  function tick(t) {
    const p = Math.min(1, (t - start) / duration);
    current = Math.floor(end * p);
    el.textContent = current + (end < 100 ? '%' : '');
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = end + (end < 100 ? '%' : '');
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('[data-counter]');
if (counters.length) {
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target._counted) {
        e.target._counted = true;
        animateCount(e.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => io2.observe(c));
}

/* ============ Pricing toggle ============ */
const toggle = document.getElementById('priceToggle');
const dot = document.getElementById('priceDot');
const prices = document.querySelectorAll('.price');
let monthly = false;

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
  if (dot) dot.style.transform = `translateX(${monthly ? end : start}px)`;
}
if (toggle && dot) {
  // Initialize once DOM + fonts are ready (defer ensures DOM is parsed)
  renderPrices();
  toggle.addEventListener('click', () => {
    monthly = !monthly;
    renderPrices();
    toggle.setAttribute('aria-pressed', String(monthly));
  });
  window.addEventListener('resize', renderPrices);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(renderPrices).catch(() => {});
  }
}

/* ============ Fake form submit ============ */
function fakeSubmit() {
  const m = document.getElementById('formMsg');
  if (!m) return;
  m.classList.remove('hidden');
  setTimeout(() => m.classList.add('hidden'), 3500);
}
window.fakeSubmit = fakeSubmit;

/* ============ Service card flip + height autosize ============ */
const cards = Array.from(document.querySelectorAll('.service-card'));
function measureHeights(card) {
  const frontContent = card.querySelector('.front .content');
  const backContent  = card.querySelector('.back .content');
  const rotator = card.querySelector('.rotator');
  if (!frontContent || !ba
