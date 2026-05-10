
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
 
// ── Custom Cursor ──────────────────────────────────────────
const cursorEl = document.createElement('div');
cursorEl.id = 'custom-cursor';
document.body.appendChild(cursorEl);
 
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
 
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorEl.style.left = mouseX + 'px';
  cursorEl.style.top  = mouseY + 'px';
  spawnFlower(e.clientX, e.clientY);
});
 
$$('a, button, input').forEach(el => {
  el.addEventListener('mouseenter', () => cursorEl.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorEl.classList.remove('hovered'));
});
 
// ── Çiçek Partikülleri ─────────────────────────────────────
const FLOWERS = ['🌸', '🌼', '💮', '🩵', '🤍'];
let lastFlower = 0;
 
function spawnFlower(x, y) {
  const now = Date.now();
  if (now - lastFlower < 85) return;
  lastFlower = now;
 
  const el = document.createElement('div');
  el.className = 'flower-particle';
  el.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
 
  const angle = Math.random() * Math.PI * 2;
  const dist  = 20 + Math.random() * 38;
  el.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
  el.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
  el.style.left = (x - 8) + 'px';
  el.style.top  = (y - 8) + 'px';
 
  $('#flower-container').appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
 
// ── Kartlara Sabit Oturan Kediler ──────────────────────────
// Her kart için kedi kartın üst kenarına oturur.
// Patiler kartın önüne sarkar, sadece gözler mouse'u takip eder.
 
const CAT_W = 60;
const CAT_H = 52;
 
function createCardCat(card) {
  const seat = card.querySelector('.card-cat-seat');
  if (!seat) return;
 
  const canvas = document.createElement('canvas');
  canvas.width  = CAT_W;
  canvas.height = CAT_H;
  canvas.style.cssText = [
    'position:absolute',
    `top:-${CAT_H - 12}px`,
    'left:50%',
    'transform:translateX(-50%)',
    'pointer-events:none',
    'z-index:10'
  ].join(';');
 
  card.style.overflow = 'visible';
  card.appendChild(canvas);
  seat.remove();
 
  const ctx = canvas.getContext('2d');
  let blinkTimer = Math.floor(Math.random() * 200);
  let blinking   = false;
 
  function draw() {
    ctx.clearRect(0, 0, CAT_W, CAT_H);
 
    // ── Yumuşak gölge ──
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur  = 5;
 
    // ── Gövde (yuvarlak, şişman) ──
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath();
    ctx.ellipse(30, 38, 17, 13, 0, 0, Math.PI * 2);
    ctx.fill();
 
    // ── Kafa (büyük yuvarlak) ──
    ctx.beginPath();
    ctx.ellipse(30, 21, 15, 14, 0, 0, Math.PI * 2);
    ctx.fill();
 
    ctx.shadowBlur = 0;
 
    // ── Kulaklar ──
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath();
    ctx.moveTo(17, 13); ctx.lineTo(11, 1); ctx.lineTo(24, 9); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(43, 13); ctx.lineTo(49, 1); ctx.lineTo(36, 9); ctx.fill();
 
    // İç kulak
    ctx.fillStyle = '#c8a0b8';
    ctx.beginPath();
    ctx.moveTo(18, 12); ctx.lineTo(14, 4); ctx.lineTo(23, 10); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(42, 12); ctx.lineTo(46, 4); ctx.lineTo(37, 10); ctx.fill();
 
    // ── Patiler (yuvarlak, kartın önüne sarkan) ──
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath(); ctx.ellipse(19, 47, 8, 6, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(41, 47, 8, 6,  0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath(); ctx.ellipse(19, 50, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(41, 50, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
 
    // ── Gözler ──
    const rect  = canvas.getBoundingClientRect();
    const eyeCX = rect.left + CAT_W / 2;
    const eyeCY = rect.top  + 21;
    const angle = Math.atan2(mouseY - eyeCY, mouseX - eyeCX);
    const pd    = 2.2;
 
    const lx = 22, ly = 20;
    const rx = 38, ry = 20;
 
    if (blinking) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth   = 2;
      ctx.lineCap     = 'round';
      ctx.beginPath(); ctx.moveTo(16, 20); ctx.lineTo(28, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(32, 20); ctx.lineTo(44, 20); ctx.stroke();
    } else {
      // Büyük siyah yuvarlak göz (resimdeki gibi)
      ctx.fillStyle = '#0a0a0a';
      ctx.beginPath(); ctx.ellipse(lx, ly, 5.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(rx, ry, 5.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
 
      // ✨ Beyaz parıltı — mouse yönüne kayar
      const px = Math.cos(angle) * pd;
      const py = Math.sin(angle) * pd;
 
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath(); ctx.ellipse(lx + px, ly + py, 2, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(rx + px, ry + py, 2, 2, 0, 0, Math.PI * 2); ctx.fill();
 
      // Küçük ikinci parıltı
      ctx.fillStyle = 'rgba(255,255,255,0.38)';
      ctx.beginPath(); ctx.ellipse(lx + px + 2, ly + py - 1.5, 0.9, 0.9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(rx + px + 2, ry + py - 1.5, 0.9, 0.9, 0, 0, Math.PI * 2); ctx.fill();
    }
 
    // ── Burun ──
    ctx.fillStyle = '#8a5a6a';
    ctx.beginPath();
    ctx.ellipse(30, 28, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

      // ── Pembe bıyıklar ──
    ctx.strokeStyle = '#f4a1db';
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    [[12,24,24,27],[12,30,24,27],
     [48,24,35,27],[48,30,35,27]]
      .forEach(([x1,y1,x2,y2]) => {
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      });
 
    // ── Göğüs tüyü (resimdeki beyaz leke) ──
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath();
    ctx.ellipse(30, 38, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
 
  function tick() {
    blinkTimer++;
    if (blinkTimer > 160 + Math.random() * 100) {
      blinking   = true;
      blinkTimer = 0;
      setTimeout(() => { blinking = false; }, 130);
    }
    draw();
    requestAnimationFrame(tick);
  }
  tick();
}
 
// Tüm kartlara kedi ekle
$$('.about-card, .post-card').forEach(card => createCardCat(card));
 
// ── Tavşan (Buton Zıplayıcısı) ─────────────────────────────
const bunnyEl     = $('#bunny');
const bunnyCanvas = $('#bunny-canvas');
const bunnyCtx    = bunnyCanvas.getContext('2d');
 
let bunnyX = window.innerWidth / 2;
let bunnyY = 80;
let bunnyFlipped = false;
 
function drawBunny() {
  const ctx = bunnyCtx;
  ctx.clearRect(0, 0, 50, 60);
  ctx.save();
  if (bunnyFlipped) { ctx.translate(50, 0); ctx.scale(-1, 1); }
 
  // Kulaklar
  ctx.fillStyle = '#f0ddf5';
  ctx.beginPath(); ctx.ellipse(17, 12, 5, 14, -0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(33, 12, 5, 14,  0.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f4a1db';
  ctx.beginPath(); ctx.ellipse(17, 12, 2.5, 10, -0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(33, 12, 2.5, 10,  0.1, 0, Math.PI * 2); ctx.fill();
 
  // Gövde
  ctx.fillStyle = '#f0ddf5';
  ctx.beginPath(); ctx.ellipse(25, 44, 14, 16, 0, 0, Math.PI * 2); ctx.fill();
 
  // Kafa
  ctx.beginPath(); ctx.ellipse(25, 27, 13, 12, 0, 0, Math.PI * 2); ctx.fill();
 
  // Gözler
  ctx.fillStyle = '#2786b1';
  ctx.beginPath(); ctx.ellipse(20, 26, 2.5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(30, 26, 2.5, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(20, 27, 1.2, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(30, 27, 1.2, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(21, 25, 0.8, 0.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(31, 25, 0.8, 0.8, 0, 0, Math.PI * 2); ctx.fill();
 
  // Burun
  ctx.fillStyle = '#e27fbc';
  ctx.beginPath(); ctx.ellipse(25, 32, 2, 1.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#e27fbc'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(23, 33.5); ctx.quadraticCurveTo(25, 35.5, 27, 33.5); ctx.stroke();
 
  // Patiler
  ctx.fillStyle = '#f0ddf5';
  ctx.beginPath(); ctx.ellipse(17, 56, 5, 4, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(33, 56, 5, 4,  0.3, 0, Math.PI * 2); ctx.fill();
 
  // Kuyruk
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(38, 48, 4, 4, 0, 0, Math.PI * 2); ctx.fill();
 
  ctx.restore();
}
drawBunny();
 
bunnyEl.style.display  = 'none';
bunnyEl.style.position = 'fixed';
 
function jumpBunnyTo(targetX, targetY) {
  bunnyEl.style.display = 'block';
  const dx = targetX - bunnyX;
  bunnyFlipped = dx < 0;
  bunnyX = targetX;
  bunnyY = targetY;
  bunnyEl.style.left = bunnyX + 'px';
  bunnyEl.style.top  = bunnyY + 'px';
  bunnyEl.classList.remove('jumping');
  void bunnyEl.offsetWidth;
  bunnyEl.classList.add('jumping');
  drawBunny();
}
 
$$('.nav-btn, .hero-btn, .post-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const rect = btn.getBoundingClientRect();
    jumpBunnyTo(rect.left + rect.width / 2 - 25, rect.top - 62);
  });
});
 
// ── Dark / Light Mod ───────────────────────────────────────
const themeToggle = $('#theme-toggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
 
const savedTheme = localStorage.getItem('bengy-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
 
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bengy-theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
});
 
// ── Scroll Reveal ──────────────────────────────────────────
const revealEls = $$('.reveal, .reveal-right');
 
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (entry.target.dataset.delay || 0) + 'ms';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
 
revealEls.forEach((el, i) => {
  el.dataset.delay = (i % 4) * 90;
  revealObserver.observe(el);
});
 
// ── Yazı Arama / Filtreleme ────────────────────────────────
const searchInput = $('#search-input');
const noResults   = $('#no-results');
 
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  let found = 0;
  $$('.post-card').forEach(card => {
    const title   = card.querySelector('.post-title').textContent.toLowerCase();
    const excerpt = card.querySelector('.post-excerpt').textContent.toLowerCase();
    const tags    = (card.dataset.tags || '').toLowerCase();
    const match   = !query || title.includes(query) || excerpt.includes(query) || tags.includes(query);
    card.style.display = match ? '' : 'none';
    if (match) found++;
  });
  noResults.style.display = found === 0 ? 'block' : 'none';
});
 
// ── Navbar scroll gölgesi ──────────────────────────────────
window.addEventListener('scroll', () => {
  $('#navbar').style.boxShadow = window.scrollY > 20
    ? '0 2px 20px rgba(27,91,127,0.15)'
    : 'none';
});
 
console.log('%c🌸 bengi\'s blog\'a hoş geldin! 🐱🐰', 'color: #2786b1; font-size:16px; font-weight:bold;');


// ── Kart Genişleme ─────────────────────────────────────────
const overlay = $('#card-overlay');

function expandCard(card) {
  const rect = card.getBoundingClientRect();
  card._origRect = rect;
  card.classList.add('expanded');
  overlay.classList.add('active');
}

function collapseCard(card) {
  overlay.classList.remove('active');
  card.style.transform = '';
  card.classList.remove('expanded');
  card.classList.add('collapsing');
  setTimeout(() => {
    card.classList.remove('collapsing');
    card.style.cssText = '';
  }, 320);
}

$$('.post-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.post-card');
    expandCard(card);
  });
});

$$('.close-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.post-card');
    collapseCard(card);
  });
});

overlay.addEventListener('click', () => {
  const expanded = $('.post-card.expanded');
  if (expanded) collapseCard(expanded);
});

// ── Balon Jöle Efekti ──────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  const expanded = $('.post-card.expanded');
  if (!expanded) return;

  const rect = expanded.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / rect.width;
  const dy = (e.clientY - cy) / rect.height;

  clearTimeout(expanded._jelloTimer);
  expanded.style.transform = `translate(-50%, -50%) scale(1.04) skewX(${dx * 4}deg) skewY(${dy * 4}deg)`;

  expanded._jelloTimer = setTimeout(() => {
    expanded.style.transform = 'translate(-50%, -50%) scale(1) skewX(0deg) skewY(0deg)';
  }, 200);
});