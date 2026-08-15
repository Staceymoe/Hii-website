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

  const stage = document.querySelector('.hero-stage');
  const DESKTOP_FILM_SRC = '/media/hii-film-approved-web-1080p.mp4';
  const MOBILE_FILM_SRC = '/media/hii-film-mobile-vertical.mp4';
  const applyMobileFrontDoorScale = () => {
    if (!stage) return;
    const mobilePortrait = window.matchMedia('(max-width: 760px) and (orientation: portrait)').matches;
    stage.style.transform = mobilePortrait ? 'scale(1.93)' : '';
    stage.style.transformOrigin = mobilePortrait ? 'center center' : '';
    if (hero.style) hero.style.clipPath = mobilePortrait ? 'polygon(28% 0, 100% 0, 100% 100%, 0 100%, 0 23%, 28% 23%)' : '';
    if (film) {
      const desiredFilmSrc = mobilePortrait ? MOBILE_FILM_SRC : DESKTOP_FILM_SRC;
      if (film._hiiFilmVariant !== desiredFilmSrc) {
        film._hiiFilmVariant = desiredFilmSrc;
        film.src = desiredFilmSrc;
        if (typeof film.load === 'function') film.load();
      }
      if (film.style) {
        film.style.aspectRatio = mobilePortrait ? '9 / 16' : '';
        film.style.width = mobilePortrait ? 'min(92vw, calc(78svh * 9 / 16))' : '';
        film.style.maxWidth = mobilePortrait ? '92vw' : '';
        film.style.maxHeight = mobilePortrait ? '78svh' : '';
        film.style.height = mobilePortrait ? 'auto' : '';
      }
    }
  };
  applyMobileFrontDoorScale();
  if (typeof window.addEventListener === 'function') window.addEventListener('resize', applyMobileFrontDoorScale);

  const HERO_FREEZE_AT = 12.2;
  const RETURN_FRAME_SRC = '/media/hii-hero-front-door-final-frame.webp';
  let started = false;
  let frozen = false;

  const settle = () => {
    entry.classList.add('is-ready');
    lenses.forEach((lens) => { lens.disabled = false; });
    fallback.hidden = true;
  };

  if (returnToStaticFrontDoor) {
    hero.poster = RETURN_FRAME_SRC;
    frozen = true;
    settle();
  }

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
