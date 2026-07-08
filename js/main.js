document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Contact form (Netlify Forms, AJAX submit) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formStatus = document.getElementById('formStatus');
  const encode = (data) => Object.keys(data).map(key =>
    encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  ).join('&');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    formStatus.textContent = 'Wird gesendet …';
    formStatus.className = 'form-status';

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(data)
    })
      .then((response) => {
        if (!response.ok) throw new Error('Form submission failed: ' + response.status);
        formStatus.textContent = 'Danke! Ich melde mich so schnell wie möglich bei dir.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      })
      .catch(() => {
        formStatus.textContent = 'Da ist etwas schiefgelaufen — schreib mir gern direkt per E-Mail.';
        formStatus.className = 'form-status error';
      });
  });
}

/* ---------- Header scroll state ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Hero parallax ---------- */
const heroMedia = document.querySelector('.hero-media');
const heroSection = document.querySelector('.hero');
if (heroMedia && heroSection) {
  let ticking = false;
  const applyParallax = () => {
    const rect = heroSection.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    heroMedia.style.transform = `translateY(${progress * 120}px)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });
  applyParallax();
}

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('is-open');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('is-open'));
});

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Portfolio filter ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const applyFilter = (filter) => {
  galleryItems.forEach(item => {
    const match = filter === 'all' || item.dataset.category === filter;
    item.classList.toggle('is-hidden', !match);
  });
};
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});
const defaultFilterBtn = document.querySelector('.filter-btn.active');
if (defaultFilterBtn) applyFilter(defaultFilterBtn.dataset.filter);

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.name || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
};
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ---------- Custom cursor (desktop) ---------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0, isHovering = false;

  const renderCursor = () => {
    const scale = isHovering ? 2.4 : 1;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${scale})`;
  };

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.opacity = '1';
    renderCursor();
  });
  document.querySelectorAll('a, button, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => { isHovering = true; renderCursor(); });
    el.addEventListener('mouseleave', () => { isHovering = false; renderCursor(); });
  });
}
