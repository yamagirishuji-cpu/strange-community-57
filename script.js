const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
};

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector('img').alt;
    lightbox.classList.add('is-open');
    document.body.classList.add('no-scroll');
  });
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const revealItems = document.querySelectorAll('.performer-card, .guest-card, .ticket-box, .feature-image, .leader-image');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

const heroCarousel = document.querySelector('.hero-carousel');

if (heroCarousel) {
  const slides = Array.from(heroCarousel.querySelectorAll('.hero-carousel-slide'));
  const dotsWrap = heroCarousel.querySelector('.hero-carousel-dots');
  const prevBtn = heroCarousel.querySelector('.hero-carousel-nav--prev');
  const nextBtn = heroCarousel.querySelector('.hero-carousel-nav--next');
  const AUTOPLAY_DELAY = 6000;
  let active = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (active < 0) active = 0;
  let timer = null;

  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `スライド ${index + 1}`);
    dot.addEventListener('click', () => goTo(index));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function render() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === active);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      dot.setAttribute('aria-selected', index === active ? 'true' : 'false');
    });
  }

  function goTo(index) {
    active = (index + slides.length) % slides.length;
    render();
    restartAutoplay();
  }

  function next() { goTo(active + 1); }
  function prev() { goTo(active - 1); }

  function restartAutoplay() {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(next, AUTOPLAY_DELAY);
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  heroCarousel.addEventListener('mouseenter', () => window.clearInterval(timer));
  heroCarousel.addEventListener('mouseleave', restartAutoplay);
  heroCarousel.addEventListener('focusin', () => window.clearInterval(timer));
  heroCarousel.addEventListener('focusout', restartAutoplay);

  render();
  restartAutoplay();
}

