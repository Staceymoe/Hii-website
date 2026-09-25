const header = document.querySelector('[data-site-header]');
const nav = document.querySelector('[data-site-nav]');
const toggle = document.querySelector('[data-nav-toggle]');

const observatoryHero = document.querySelector('[data-observatory-hero]');
const observatoryAwakening = document.querySelector('[data-observatory-awakening]');
const observatoryFilm = document.querySelector('[data-hii-film]');
const observatoryFilmOpen = document.querySelector('[data-observatory-film-open]');
const observatoryFilmClose = document.querySelector('[data-observatory-film-close]');
const observatoryStatus = document.querySelector('[data-observatory-status]');
const observatoryHoldTime = 20.9;

function setObservatoryReady() {
  observatoryHero?.classList.add('is-ready');
  if (observatoryStatus) observatoryStatus.textContent = 'The Hii observatory is ready. Select the center lens to play the Hii Film.';
}

function holdObservatoryFinalFrame() {
  if (!(observatoryAwakening instanceof HTMLVideoElement)) return;
  observatoryAwakening.pause();
  observatoryAwakening.currentTime = Math.min(observatoryHoldTime, observatoryAwakening.duration || observatoryHoldTime);
  setObservatoryReady();
}

function playObservatoryFilm() {
  if (!(observatoryFilm instanceof HTMLVideoElement)) return;
  observatoryHero?.classList.add('is-film-playing');
  document.body.classList.add('is-observatory-film-playing');
  observatoryFilm.controls = true;
  observatoryFilm.currentTime = 0;
  observatoryFilm.muted = false;
  observatoryFilm.play().catch(() => {
    observatoryFilm.controls = true;
  });
  if (observatoryStatus) observatoryStatus.textContent = 'The Hii Film is playing.';
}

function closeObservatoryFilm() {
  if (observatoryFilm instanceof HTMLVideoElement) {
    observatoryFilm.pause();
    observatoryFilm.currentTime = 0;
    observatoryFilm.controls = false;
  }
  observatoryHero?.classList.remove('is-film-playing');
  document.body.classList.remove('is-observatory-film-playing');
  observatoryFilmOpen?.focus();
  if (observatoryStatus) observatoryStatus.textContent = 'Returned to the Hii observatory.';
}

if (observatoryAwakening instanceof HTMLVideoElement) {
  observatoryAwakening.addEventListener('timeupdate', () => {
    if (observatoryAwakening.currentTime >= observatoryHoldTime) {
      holdObservatoryFinalFrame();
    }
  });
  observatoryAwakening.addEventListener('ended', holdObservatoryFinalFrame);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    observatoryAwakening.addEventListener('loadedmetadata', () => {
      holdObservatoryFinalFrame();
    }, { once: true });
  } else {
    observatoryAwakening.play().catch(() => {
      if (observatoryAwakening.readyState >= 1) {
        holdObservatoryFinalFrame();
      } else {
        observatoryAwakening.addEventListener('loadedmetadata', holdObservatoryFinalFrame, { once: true });
      }
    });
  }
}

observatoryFilmOpen?.addEventListener('click', playObservatoryFilm);
observatoryFilmClose?.addEventListener('click', closeObservatoryFilm);

observatoryFilm?.addEventListener('ended', () => {
  closeObservatoryFilm();
});

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

const filmModal = document.querySelector('[data-film-modal]');
const filmModalVideo = document.querySelector('[data-film-modal-video]');
const filmOpeners = document.querySelectorAll('[data-film-open]');
const filmCloser = document.querySelector('[data-film-close]');
const embeddedFilm = document.querySelector('#hii-film video');

function openFilm() {
  if (!(filmModal instanceof HTMLDialogElement) || typeof filmModal.showModal !== 'function') {
    document.querySelector('#hii-film')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (embeddedFilm instanceof HTMLVideoElement) {
      window.setTimeout(() => embeddedFilm.play().catch(() => {}), 450);
    }
    return;
  }

  if (!filmModal.open) {
    filmModal.showModal();
  }

  if (filmModalVideo instanceof HTMLVideoElement) {
    filmModalVideo.play().catch(() => {});
  }
}

function closeFilm() {
  if (filmModalVideo instanceof HTMLVideoElement) {
    filmModalVideo.pause();
  }
  if (filmModal instanceof HTMLDialogElement && filmModal.open) {
    filmModal.close();
  }
}

filmOpeners.forEach(opener => opener.addEventListener('click', openFilm));
filmCloser?.addEventListener('click', closeFilm);

filmModal?.addEventListener('click', event => {
  if (event.target === filmModal) {
    closeFilm();
  }
});

filmModal?.addEventListener('close', () => {
  if (filmModalVideo instanceof HTMLVideoElement) {
    filmModalVideo.pause();
  }
});

window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (observatoryHero?.classList.contains('is-film-playing')) {
      closeObservatoryFilm();
      return;
    }
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
