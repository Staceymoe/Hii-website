const header = document.querySelector('[data-site-header]');
const nav = document.querySelector('[data-site-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

function syncHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}

function closeNav() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

nav.addEventListener('click', event => {
  if (event.target instanceof HTMLAnchorElement) {
    closeNav();
  }
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeNav();
  }
});
