const header = document.querySelector('[data-site-header]');
const nav = document.querySelector('[data-site-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

function syncHeader() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}

function setNavState(isOpen) {
  if (!nav || !toggle) return;
  nav.classList.toggle('is-open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
}

function closeNav() {
  setNavState(false);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

if (nav && toggle) {
  toggle.addEventListener('click', () => {
    setNavState(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', event => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNav();
    }
  });

  document.addEventListener('click', event => {
    if (!nav.classList.contains('is-open')) return;
    if (event.target instanceof Node && !nav.contains(event.target) && !toggle.contains(event.target)) {
      closeNav();
    }
  });
}

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeNav();
    toggle?.focus();
  }
});

const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (motionAllowed && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');

  const revealTargets = document.querySelectorAll([
    '.content-section',
    '.study-card',
    '.work-link-card',
    '.publication-item',
    '.news-item',
    '.content-card',
    '.principle-list article',
    '.model-card',
    '.model-process article',
    '.evidence-grid article',
    '.visual-break-copy',
    '.bridge-orbit',
    '.signal-stop'
  ].join(','));

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.08
  });

  revealTargets.forEach(element => revealObserver.observe(element));
}
