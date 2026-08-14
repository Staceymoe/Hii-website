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
  const returnToStaticFrontDoor = new URLSearchParams(window.location.search).get('return') === 'hii';

  if (!entry || !hero || !lensMap) return;

  const HERO_FREEZE_AT = 12.2;
  let started = false;
  let frozen = false;

  const settle = () => {
    entry.classList.add('is-ready');
    lenses.forEach((lens) => { lens.disabled = false; });
    fallback.hidden = true;
  };

  const freezeHero = () => {
    if (frozen) return;
    frozen = true;
    hero.pause();
    if (Math.abs(hero.currentTime - HERO_FREEZE_AT) > 0.015) {
      try { hero.currentTime = HERO_FREEZE_AT; } catch (_) {}
    }
    settle();
  };

  const watchForFinalGraphic = () => {
    if (typeof hero.requestVideoFrameCallback === 'function') {
      const checkFrame = (_now, metadata) => {
        if (metadata.mediaTime >= HERO_FREEZE_AT) {
          freezeHero();
          return;
        }
        hero.requestVideoFrameCallback(checkFrame);
      };
      hero.requestVideoFrameCallback(checkFrame);
      return;
    }

    const checkTime = () => {
      if (hero.currentTime >= HERO_FREEZE_AT) freezeHero();
    };
    hero.addEventListener('timeupdate', checkTime);
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

    if (returnToStaticFrontDoor) {
      hero.pause();
      hero.currentTime = HERO_FREEZE_AT;
      frozen = true;
      settle();
      history.replaceState(null, '', window.location.pathname + window.location.hash);
      return;
    }

    if (reduceMotion) {
      hero.pause();
      hero.currentTime = HERO_FREEZE_AT;
      frozen = true;
      settle();
      return;
    }

    hero.currentTime = 0;
    watchForFinalGraphic();
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
    else if (destination === 'Relate') window.location.assign('/relationships/');
    else if (destination === 'Adapt') window.location.assign('/adaptation/');
    else if (destination === 'Care') window.location.assign('/mental-health/');
    else if (destination === 'Prepare') window.location.assign('/institutional-readiness/');
    else if (destination === 'Govern') window.location.assign('/governance/');
    else if (destination === 'Understand') window.location.assign('/understand/');
    else if (destination === 'Study') window.location.assign('/research/');
    else openDestinationTest(destination);
  });

  document.querySelectorAll('[data-return-hii]').forEach((button) => {
    button.addEventListener('click', returnToHii);
  });

  fallback.addEventListener('click', () => {
    fallback.hidden = true;
    if (!started) startHero();
    else hero.play().catch(() => { fallback.hidden = false; });
  });

  hero.addEventListener('ended', freezeHero, { once: true });
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
