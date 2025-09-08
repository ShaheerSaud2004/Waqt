// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Simple hero rotator
const mediaWrap = document.querySelector('[data-hero-media]');
if (mediaWrap) {
  const slides = Array.from(mediaWrap.querySelectorAll('img'));
  let idx = 0;
  const show = (i) => {
    slides.forEach((el, n) => el.classList.toggle('is-active', n === i));
  };
  if (slides.length) show(0);
  setInterval(() => {
    idx = (idx + 1) % slides.length;
    show(idx);
  }, 4500);
}

// Smooth scroll for on-page links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      links?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Header style on scroll + reveal animations
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (!header) return;
  const s = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle('is-scrolled', s > 6);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal
const revealNodes = document.querySelectorAll('[data-reveal]');
if (revealNodes.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.15 });
  revealNodes.forEach((n) => io.observe(n));
}

// Live time and clock hands
const timeInline = document.getElementById('live-time');
const hHand = document.getElementById('hand-hour');
const mHand = document.getElementById('hand-minute');
const sHand = document.getElementById('hand-second');

function updateTime() {
  const d = new Date();
  const hours = d.getHours();
  const mins = d.getMinutes();
  const secs = d.getSeconds();
  if (timeInline) {
    const h12 = ((hours + 11) % 12) + 1;
    const mm = String(mins).padStart(2, '0');
    timeInline.textContent = `${h12}:${mm}`;
  }
  const secDeg = secs * 6; // 360/60
  const minDeg = mins * 6 + secs * 0.1;
  const hourDeg = (hours % 12) * 30 + mins * 0.5;
  if (sHand) sHand.style.transform = `translate(-50%, -90%) rotate(${secDeg}deg)`;
  if (mHand) mHand.style.transform = `translate(-50%, -90%) rotate(${minDeg}deg)`;
  if (hHand) hHand.style.transform = `translate(-50%, -90%) rotate(${hourDeg}deg)`;
}
updateTime();
setInterval(updateTime, 1000);

// Menu tabs
const tabs = document.querySelectorAll('.menu-modern .tab');
const panels = {
  mojitos: document.getElementById('panel-mojitos'),
  matcha: document.getElementById('panel-matcha')
};
tabs.forEach((t) => t.addEventListener('click', () => {
  tabs.forEach((x) => x.classList.remove('is-active'));
  t.classList.add('is-active');
  Object.values(panels).forEach((p) => p?.classList.remove('is-active'));
  const key = t.dataset.tab;
  panels[key]?.classList.add('is-active');
}));

// Scroll Clock behavior
const scrollClock = document.querySelector('.scroll-clock');
const knob = document.querySelector('.scroll-clock .clock-knob');
const track = document.querySelector('.scroll-clock .clock-track');
const sh = document.getElementById('scroll-hour');
const sm = document.getElementById('scroll-minute');

function updateScrollClock() {
  if (!scrollClock || !knob || !track) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

  const trackRect = track.getBoundingClientRect();
  const usable = trackRect.height - knob.offsetHeight;
  const y = trackRect.top + window.scrollY + pct * usable;
  knob.style.transform = `translateY(${Math.max(0, Math.min(usable, pct * usable))}px)`;

  // Map scroll percent to a 12-hour dial
  const minutes = Math.round(pct * 12 * 60) % (12 * 60);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const minDeg = mins * 6;
  const hourDeg = hours * 30 + mins * 0.5;
  if (sm) sm.style.transform = `translate(-50%, -90%) rotate(${minDeg}deg)`;
  if (sh) sh.style.transform = `translate(-50%, -90%) rotate(${hourDeg}deg)`;
}

updateScrollClock();
window.addEventListener('scroll', updateScrollClock, { passive: true });
window.addEventListener('resize', updateScrollClock);

// Clicking the track moves scroll position
if (track) {
  track.addEventListener('click', (e) => {
    const rect = track.getBoundingClientRect();
    const y = e.clientY - rect.top - knob.offsetHeight / 2;
    const max = rect.height - knob.offsetHeight;
    const pct = Math.max(0, Math.min(1, y / max));
    const doc = document.documentElement;
    const target = pct * (doc.scrollHeight - doc.clientHeight);
    window.scrollTo({ top: target, behavior: 'smooth' });
  });
}


