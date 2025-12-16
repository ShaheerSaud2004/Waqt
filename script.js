// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
const navBackdrop = document.getElementById('nav-backdrop');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (navBackdrop) navBackdrop.hidden = !isOpen;
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// Close menu when clicking outside or on a link
links?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  links.classList.remove('is-open');
  toggle?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (navBackdrop) navBackdrop.hidden = true;
  document.body.style.overflow = '';
}));
navBackdrop?.addEventListener('click', () => {
  links?.classList.remove('is-open');
  toggle?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  navBackdrop.hidden = true;
  document.body.style.overflow = '';
});

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

// Live time and clock hands with Islamic prayer times
const timeInline = document.getElementById('live-time');
const prayerTime = document.getElementById('prayer-time');
const hHand = document.getElementById('hand-hour');
const mHand = document.getElementById('hand-minute');
const sHand = document.getElementById('hand-second');

// Simple prayer time calculation (approximate)
function getCurrentPrayerTime() {
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const currentMinutes = hours * 60 + mins;
  
  // Approximate prayer times (these would normally be calculated based on location and date)
  const prayerTimes = {
    fajr: 5 * 60 + 30,    // 5:30 AM
    dhuhr: 12 * 60 + 15,  // 12:15 PM
    asr: 15 * 60 + 45,    // 3:45 PM
    maghrib: 18 * 60 + 30, // 6:30 PM
    isha: 20 * 60 + 15    // 8:15 PM
  };
  
  // Find the next prayer time
  const nextPrayer = Object.entries(prayerTimes).find(([name, time]) => time > currentMinutes);
  if (nextPrayer) {
    const [name, time] = nextPrayer;
    const prayerHours = Math.floor(time / 60);
    const prayerMins = time % 60;
    const h12 = ((prayerHours + 11) % 12) + 1;
    const mm = String(prayerMins).padStart(2, '0');
    return `${name.charAt(0).toUpperCase() + name.slice(1)}: ${h12}:${mm}`;
  } else {
    // If it's past Isha, show Fajr for next day
    const fajrHours = Math.floor(prayerTimes.fajr / 60);
    const fajrMins = prayerTimes.fajr % 60;
    const h12 = ((fajrHours + 11) % 12) + 1;
    const mm = String(fajrMins).padStart(2, '0');
    return `Fajr: ${h12}:${mm}`;
  }
}

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
  if (prayerTime) {
    prayerTime.textContent = getCurrentPrayerTime();
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
let scrollClock, knob, track, sh, sm;
let isDragging = false;
let dragOffset = 0;

function initScrollClock() {
  scrollClock = document.querySelector('.scroll-clock');
  knob = document.querySelector('.scroll-clock .clock-knob');
  track = document.querySelector('.scroll-clock .clock-track');
  sh = document.getElementById('scroll-hour');
  sm = document.getElementById('scroll-minute');
  
  if (!scrollClock || !knob || !track || !sh || !sm) {
    return; // Elements not found, skip initialization
  }
  
  // Set up scroll listener
  updateScrollClock();
  window.addEventListener('scroll', updateScrollClock, { passive: true });
  window.addEventListener('resize', updateScrollClock);
}

function updateScrollClock() {
  if (!scrollClock || !knob || !track || !sh || !sm) return;
  
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;

  // Update knob position
  const trackRect = track.getBoundingClientRect();
  const usable = trackRect.height - knob.offsetHeight;
  const position = Math.max(0, Math.min(usable, pct * usable));
  
  if (!isDragging) {
    knob.style.transform = `translateY(${position}px)`;
  }

  // Map scroll percent to a 12-hour dial (0-12 hours)
  const totalMinutes = Math.round(pct * 12 * 60); // 0 to 720 minutes (12 hours)
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  // Calculate degrees
  const minDeg = mins * 6; // 6 degrees per minute
  const hourDeg = hours * 30 + mins * 0.5; // 30 degrees per hour + minute adjustment
  
  // Update clock hands - ensure transform is applied
  sm.style.transform = `translate(-50%, -90%) rotate(${minDeg}deg)`;
  sh.style.transform = `translate(-50%, -90%) rotate(${hourDeg}deg)`;
}

function scrollToPercent(pct) {
  const doc = document.documentElement;
  const target = pct * (doc.scrollHeight - doc.clientHeight);
  window.scrollTo({ top: target, behavior: isDragging ? 'auto' : 'smooth' });
}

function setupScrollClockInteractions() {
  if (!knob || !track) return;
  
  // Mouse events for dragging
  knob.addEventListener('mousedown', (e) => {
    isDragging = true;
    const knobRect = knob.getBoundingClientRect();
    dragOffset = e.clientY - knobRect.top;
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !track || !knob) return;
    
    const trackRect = track.getBoundingClientRect();
    const y = e.clientY - trackRect.top - dragOffset;
    const max = trackRect.height - knob.offsetHeight;
    const pct = Math.max(0, Math.min(1, y / max));
    
    knob.style.transform = `translateY(${y}px)`;
    scrollToPercent(pct);
    updateScrollClock(); // Update clock hands while dragging
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });

  // Touch events for mobile dragging
  knob.addEventListener('touchstart', (e) => {
    isDragging = true;
    const knobRect = knob.getBoundingClientRect();
    const touch = e.touches[0];
    dragOffset = touch.clientY - knobRect.top;
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging || !track || !knob) return;
    
    const touch = e.touches[0];
    const trackRect = track.getBoundingClientRect();
    const y = touch.clientY - trackRect.top - dragOffset;
    const max = trackRect.height - knob.offsetHeight;
    const pct = Math.max(0, Math.min(1, y / max));
    
    knob.style.transform = `translateY(${y}px)`;
    scrollToPercent(pct);
    updateScrollClock(); // Update clock hands while dragging
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
    }
  });

  // Clicking the track moves scroll position
  track.addEventListener('click', (e) => {
    if (e.target === knob || e.target.closest('.clock-knob')) return; // Don't trigger on knob clicks
    
    const rect = track.getBoundingClientRect();
    const y = e.clientY - rect.top - knob.offsetHeight / 2;
    const max = rect.height - knob.offsetHeight;
    const pct = Math.max(0, Math.min(1, y / max));
    scrollToPercent(pct);
  });
}

// Initialize scroll clock when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initScrollClock();
    setupScrollClockInteractions();
  });
} else {
  initScrollClock();
  setupScrollClockInteractions();
}


