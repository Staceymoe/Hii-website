(() => {
  const entry = document.querySelector('[data-hii-entry]');
  const hero = document.querySelector('[data-hero-motion]');
  const lensMap = document.querySelector('[data-lens-map]');
  const lenses = Array.from(document.querySelectorAll('[data-destination]'));
  const fallback = document.querySelector('[data-autoplay-fallback]');
  const destinationTest = document.querySelector('[data-destination-test]');
  const destinationTitle = document.querySelector('[data-destination-title]');
  const filmLayer = document.querySelector('[data-film-layer]');
  const film = document.querySelector('[data-hii-film]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!entry || !hero || !lensMap) return;

  let started = false;

  const settle = () => {
    entry.classList.add('is-ready');
    lenses.forEach((lens) => { lens.disabled = false; });
    fallback.hidden = true;
  };

  const returnToHii = () => {
    destinationTest.hidden = true;
    filmLayer.hidden = true;
    if (film) {
      film.pause();
      film.currentTime = 0;
    }
    settle();
    history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  const openFilm = () => {
    destinationTest.hidden = true;
    filmLayer.hidden = false;
    if (film) {
      film.currentTime = 0;
      film.play().catch(() => {});
    }
  };

  const openDestinationTest = (name) => {
    filmLayer.hidden = true;
    destinationTitle.textContent = name;
    destinationTest.hidden = false;
    history.replaceState(null, '', `#${name.toLowerCase()}`);
  };

  const startHero = () => {
    if (started) return;
    started = true;

    if (reduceMotion) {
      hero.pause();
      hero.currentTime = Math.max(0, hero.duration - 0.08);
      settle();
      return;
    }

    hero.currentTime = 0;
    const playAttempt = hero.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        fallback.hidden = false;
      });
    }
  };

  lensMap.addEventListener('click', (event) => {
    const lens = event.target.closest('[data-destination]');
    if (!lens || lens.disabled || !entry.classList.contains('is-ready')) return;
    const destination = lens.dataset.destination;
    if (destination === 'film') openFilm();
    else openDestinationTest(destination);
  });

  document.querySelectorAll('[data-return-hii]').forEach((button) => {
    button.addEventListener('click', returnToHii);
  });

  fallback.addEventListener('click', () => {
    fallback.hidden = true;
    hero.play().catch(() => { fallback.hidden = false; });
  });

  hero.addEventListener('ended', settle, { once: true });
  hero.addEventListener('error', () => {
    fallback.hidden = false;
    fallback.textContent = 'Reload Hii';
  });

  if (hero.readyState >= 1) startHero();
  else hero.addEventListener('loadedmetadata', startHero, { once: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (!filmLayer.hidden || !destinationTest.hidden)) {
      returnToHii();
    }
  });
})();
