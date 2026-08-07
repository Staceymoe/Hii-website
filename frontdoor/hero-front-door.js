(() => {
  const frontDoor = document.querySelector('[data-front-door]');
  const motion = document.querySelector('[data-motion-video]');
  const hits = [...document.querySelectorAll('[data-lens]')];
  const status = document.querySelector('[data-interface-status]');
  const filmLayer = document.querySelector('[data-film-layer]');
  const film = document.querySelector('[data-film-video]');
  const openFilm = document.querySelector('[data-open-film]');
  const closeFilm = [...document.querySelectorAll('[data-close-film]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ready = false;
  let lastFocus = null;

  const activate = () => {
    if (ready) return;
    ready = true;
    frontDoor?.classList.add('is-ready');
    hits.forEach(hit => { hit.tabIndex = 0; });
    if (status) status.textContent = 'Hii is ready. Choose a pathway, or select the center to play the Hii film.';
  };

  const settle = () => {
    if (!motion) return activate();
    const finish = () => {
      const target = Math.max(0, (motion.duration || 12.366) - 0.04);
      try { motion.currentTime = target; } catch (_) {}
      motion.pause();
      activate();
    };
    if (motion.readyState >= 1) finish();
    else motion.addEventListener('loadedmetadata', finish, { once: true });
  };

  if (motion) {
    motion.addEventListener('ended', activate, { once: true });
    if (reduced.matches) settle();
    else {
      const attempt = motion.play();
      attempt?.catch?.(() => {
        frontDoor?.addEventListener('pointerdown', () => motion.play().catch(() => {}), { once: true });
      });
    }
  } else activate();

  reduced.addEventListener?.('change', event => {
    if (event.matches && !ready) settle();
  });

  // The seven destinations are intentionally not built until the front door is approved.
  hits.filter(hit => !hit.hasAttribute('data-open-film')).forEach(hit => {
    hit.addEventListener('click', () => {
      if (status) status.textContent = `${hit.dataset.lens} is selected. Destination content is intentionally paused until the front door is approved.`;
    });
  });

  const showFilm = () => {
    if (!ready || !filmLayer) return;
    lastFocus = document.activeElement;
    filmLayer.hidden = false;
    film?.play?.().catch?.(() => {});
    filmLayer.querySelector('.return-to-hii')?.focus();
  };

  const hideFilm = () => {
    if (!filmLayer || filmLayer.hidden) return;
    film?.pause?.();
    filmLayer.hidden = true;
    lastFocus?.focus?.();
  };

  openFilm?.addEventListener('click', showFilm);
  closeFilm.forEach(control => control.addEventListener('click', hideFilm));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hideFilm();
  });
})();
