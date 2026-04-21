/* ============================================
   PORTFOLIO — script.js
   Cursor, scroll reveals, counters, tabs
   ============================================ */

// ---- Page Loader ----
window.addEventListener('load', () => {
  const loader = document.createElement('div');
  loader.classList.add('page-loader');
  document.body.prepend(loader);
  setTimeout(() => loader.remove(), 1400);
});

// ---- Custom Cursor ----
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Smooth follower
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor scale on hover
document.querySelectorAll('a, button, .work-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursorFollower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.opacity = '0.6';
  });
});

// ---- Navbar Scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Smooth Scroll for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Scroll Reveal Observer ----
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

// Skip hero elements (they animate on load automatically via CSS)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => {
  // Hero elements animate immediately via CSS delays, skip observer for them
  if (!el.closest('.hero')) {
    observer.observe(el);
  }
});

// ---- Counter Animation ----
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const duration = 1800;
      const step = target / (duration / 16);

      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };

      update();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ---- Work Tab Toggle ----
const toggleBtns = document.querySelectorAll('.toggle-btn');
const tabVideo = document.getElementById('tab-video');
const tabWeb = document.getElementById('tab-web');

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;

    if (tab === 'video') {
      tabVideo.classList.remove('hidden');
      tabWeb.classList.add('hidden');
    } else {
      tabWeb.classList.remove('hidden');
      tabVideo.classList.add('hidden');
    }

    // Re-trigger reveal on newly shown cards
    const newCards = (tab === 'video' ? tabVideo : tabWeb).querySelectorAll('.reveal-up');
    newCards.forEach((card, i) => {
      card.classList.remove('visible');
      setTimeout(() => card.classList.add('visible'), i * 100);
    });
  });
});

// ---- Parallax on Hero BG text ----
const heroBgText = document.querySelector('.hero-bg-text');
window.addEventListener('scroll', () => {
  if (heroBgText) {
    const scrolled = window.scrollY;
    heroBgText.style.transform = `translateY(calc(-50% + ${scrolled * 0.15}px))`;
  }
});

// ---- Active nav link highlight ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 120) current = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--fg)';
    }
  });
});

// ---- Magnetic effect on buttons ----
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) translateY(-3px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ---- Tilt effect on skill cards ----
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    setTimeout(() => { card.style.transform = ''; }, 300);
  });
});

// ---- Console Easter Egg ----
console.log(
  '%c 👾 Hey! Curious about the code? ',
  'background: #e8ff47; color: #0a0a0a; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
);
console.log(
  '%c This portfolio was crafted with ❤️ — HTML, CSS & vanilla JS. ',
  'color: #7a7570; font-size: 12px;'
);
