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
