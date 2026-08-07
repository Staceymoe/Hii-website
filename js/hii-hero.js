(() => {
  const hero = document.querySelector('[data-motion-hero]');
  if (!hero) return;

  const motionVideo = hero.querySelector('[data-motion-video]');
  const nodes = [...hero.querySelectorAll('[data-hero-node]')];
  const hint = hero.querySelector('[data-hero-hint]');
  const openFilmButton = hero.querySelector('[data-open-film]');
  const dialog = document.querySelector('[data-film-dialog]');
  const filmVideo = document.querySelector('[data-film-video]');
  const closeFilmControls = [...document.querySelectorAll('[data-close-film]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false;
  let lastFocus = null;

  const activateInterface = () => {
    if (ready) return;
    ready = true;
    hero.classList.add('is-ready');
    nodes.forEach(node => node.setAttribute('tabindex', '0'));
    if (hint) hint.textContent = 'Choose a Hii pathway or select the center circle to play the Hii film.';
  };

  const settleAtFinalFrame = () => {
    if (!motionVideo) {
      activateInterface();
      return;
    }
    const settle = () => {
      const target = Math.max(0, (motionVideo.duration || 12.36) - 0.08);
      try { motionVideo.currentTime = target; } catch (_) {}
      motionVideo.pause();
      activateInterface();
    };
    if (motionVideo.readyState >= 1) settle();
    else motionVideo.addEventListener('loadedmetadata', settle, { once: true });
  };

  if (motionVideo) {
    motionVideo.addEventListener('ended', activateInterface, { once: true });
    motionVideo.addEventListener('timeupdate', () => {
      if (motionVideo.duration && motionVideo.currentTime >= motionVideo.duration - 0.12) activateInterface();
    });

    if (reducedMotion.matches) {
      settleAtFinalFrame();
    } else {
      const playAttempt = motionVideo.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {
          hero.addEventListener('pointerdown', () => motionVideo.play().catch(() => {}), { once: true });
        });
      }
    }
  } else {
    activateInterface();
  }

  reducedMotion.addEventListener?.('change', event => {
    if (event.matches && !ready) settleAtFinalFrame();
  });

  const openFilm = () => {
    if (!ready || !dialog || !filmVideo) return;
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add('film-open');
    const playAttempt = filmVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {});
    const closeButton = dialog.querySelector('.film-dialog__close');
    closeButton?.focus();
  };

  const closeFilm = () => {
    if (!dialog || dialog.hidden) return;
    filmVideo?.pause();
    dialog.hidden = true;
    document.body.classList.remove('film-open');
    lastFocus?.focus?.();
  };

  openFilmButton?.addEventListener('click', openFilm);
  closeFilmControls.forEach(control => control.addEventListener('click', closeFilm));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog && !dialog.hidden) closeFilm();
  });
})();
