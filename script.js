/* Cursor  */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();
document
  .querySelectorAll('a,button,.modal-card,.plano-card,.dep-card')
  .forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      ring.style.width = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'var(--neon)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });

/* Navbar scroll */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* Hamburger */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
function closeMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}

/* Navbar links*/
const navLinks = [
  ['#sobre', 'Sobre'],
  ['#modalidades', 'Modalidades'],
  ['#professores', 'Equipe'],
  ['#horarios', 'Horários'],
  ['#galeria', 'Galeria'],
  ['#planos', 'Planos'],
  ['#contato-form', 'Contato'],
];
document.querySelector('.nav-links').innerHTML = navLinks
  .map(([h, l]) => '<li><a href="' + h + '">' + l + '</a></li>')
  .join('');
document.getElementById('mobileMenu').innerHTML = navLinks
  .map(([h, l]) => '<a href="' + h + '" onclick="closeMenu()">' + l + '</a>')
  .join('');

/* Particles  */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W,
  H,
  particles = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.3;
    this.a = Math.random() * 0.5 + 0.1;
    this.life = Math.random() * 200 + 100;
    this.age = 0;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    if (
      this.age > this.life ||
      this.x < 0 ||
      this.x > W ||
      this.y < 0 ||
      this.y > H
    )
      this.reset();
  }
  draw() {
    const alpha = Math.sin((this.age / this.life) * Math.PI) * this.a;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,191,255,${alpha})`;
    ctx.fill();
  }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());
function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x,
        dy = particles[i].y - particles[j].y,
        d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,191,255,${0.08 * (1 - d / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animParticles);
}
animParticles();

/* Scroll Animations & Counters */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const counter = entry.target.querySelector('[data-counter]');
        if (counter && !counter.dataset.animated) {
          counter.dataset.animated = true;
          const target = parseInt(counter.dataset.counter);
          const prefix = counter.dataset.prefix || '',
            suffix = counter.dataset.suffix || '';
          const step = target / (2000 / 16);
          let current = 0;
          const tick = () => {
            current = Math.min(current + step, target);
            const display =
              target >= 1000
                ? Math.floor(current).toLocaleString('pt-BR')
                : Math.floor(current);
            counter.textContent = prefix + display + suffix;
            if (current < target) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }
    });
  },
  { threshold: 0.15 }
);
document
  .querySelectorAll(
    '[data-animate], .section-tag, .section-title, .section-desc, .sobre-visual, .sobre-text, .motiv-quote, .motiv-sub, .motiv-tags, .modal-card, .stat-item, .estrutura-item, .plano-card, .cta-title, .cta-desc, .cta-buttons, .imc-card'
  )
  .forEach(el => {
    observer.observe(el);
  });

/* IMC Calculator */
function calcularIMC() {
  const peso = parseFloat(document.getElementById('imcPeso').value);
  const alturaCm = parseFloat(document.getElementById('imcAltura').value);
  if (!peso || !alturaCm || peso < 30 || alturaCm < 100) {
    alert('Por favor, insira valores válidos de peso e altura.');
    return;
  }
  const imc = peso / Math.pow(alturaCm / 100, 2);
  document.getElementById('imcNum').textContent = imc.toFixed(1);
  let cat, rec;
  if (imc < 18.5) {
    cat = '⚠️ Abaixo do peso';
    rec = 'Recomendamos um programa de ganho de massa muscular.';
  } else if (imc < 25) {
    cat = '✅ Peso ideal';
    rec = 'Ótimo! Vamos manter e definir sua musculatura.';
  } else if (imc < 30) {
    cat = '⚠️ Sobrepeso';
    rec = 'Combinação de cardio e musculação vai te ajudar!';
  } else {
    cat = '🔴 Obesidade';
    rec = 'Nossos especialistas têm o plano perfeito para você.';
  }
  document.getElementById('imcCat').textContent = cat;
  document.getElementById('imcRec').textContent = rec;
  document.getElementById('imcResult').classList.add('show');
}

/* Active nav link*/
const sections = document.querySelectorAll('section[id], footer[id]');
window.addEventListener(
  'scroll',
  () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color =
        a.getAttribute('href') === '#' + current ? 'var(--neon)' : '';
    });
  },
  { passive: true }
);

/* Horários */
function showHorario(id, btn) {
  document
    .querySelectorAll('.hor-panel')
    .forEach(p => p.classList.remove('active'));
  document
    .querySelectorAll('.hor-tab')
    .forEach(t => t.classList.remove('active'));
  document.getElementById('hor-' + id).classList.add('active');
  btn.classList.add('active');
  document.querySelectorAll('#hor-' + id + ' .hor-card').forEach((c, i) => {
    c.classList.remove('visible');
    setTimeout(() => c.classList.add('visible'), i * 80);
  });
}

const galSrcs = [
  './assets/img188.jpg',
  './assets/img189.jpg',
  './assets/img191.jpg',
  './assets/img192.jpg',
];

if (galSrcs.length > 0) {
  const grid = document.getElementById('galGrid');
  galSrcs.forEach((src, idx) => {
    const div = document.createElement('div');
    div.className = 'gal-item';
    div.onclick = () => openLightbox(idx);
    div.innerHTML = `<img src="${src}" alt="DarkFit ${idx + 1}"/><div class="gal-overlay"><div class="gal-zoom">⊕</div></div>`;
    grid.appendChild(div);
    observer.observe(div);
  });
} else {
  // Placeholder enquanto sem imagens
  const grid = document.getElementById('galGrid');
  grid.style.cssText =
    'border:1px dashed rgba(0,191,255,0.2);border-radius:8px;padding:4rem;text-align:center;';
  grid.innerHTML =
    '<p style="font-family:var(--font-title);font-size:0.7rem;letter-spacing:3px;color:rgba(0,191,255,0.3);text-transform:uppercase">Adicione seus assets em galSrcs[]<br>no script da galeria</p>';
}

/* Lightbox */
let galIdx = 0;
function openLightbox(idx) {
  if (!galSrcs.length) return;
  galIdx = idx;
  document.getElementById('lightboxImg').src = galSrcs[galIdx];
  document.getElementById('lightboxCounter').textContent =
    galIdx + 1 + ' / ' + galSrcs.length;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function lightboxNav(dir) {
  galIdx = (galIdx + dir + galSrcs.length) % galSrcs.length;
  document.getElementById('lightboxImg').src = galSrcs[galIdx];
  document.getElementById('lightboxCounter').textContent =
    galIdx + 1 + ' / ' + galSrcs.length;
}
document.getElementById('lightbox').addEventListener('click', function (e) {
  if (e.target === this) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

/* WhatsApp Form */
function enviarWhatsApp() {
  const nome = document.getElementById('ctNome').value.trim();
  const tel = document.getElementById('ctTel').value.trim();
  const obj = document.getElementById('ctObj').value;
  const plano = document.getElementById('ctPlano').value;
  const msg = document.getElementById('ctMsg').value.trim();
  if (!nome || !tel) {
    alert('Por favor, preencha nome e telefone.');
    return;
  }
  let text =
    'Olá! Vim pelo site da DarkFit e quero agendar minha aula experimental.%0A%0A';
  text += '*Nome:* ' + encodeURIComponent(nome) + '%0A';
  text += '*Telefone:* ' + encodeURIComponent(tel) + '%0A';
  if (obj) text += '*Objetivo:* ' + encodeURIComponent(obj) + '%0A';
  if (plano)
    text += '*Plano de interesse:* ' + encodeURIComponent(plano) + '%0A';
  if (msg) text += '*Mensagem:* ' + encodeURIComponent(msg) + '%0A';
  window.open('https://wa.me/5515999999999?text=' + text, '_blank');
  document.getElementById('thankyouOverlay').classList.add('open');
}
