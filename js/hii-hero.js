(async () => {
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
  const returning = new URLSearchParams(location.search).get('return') === '1' || sessionStorage.getItem('hii-interface-seen') === '1';
  let ready = false;
  let lastFocus = null;
  let heroUrl = null;

  const activateInterface = () => {
    if (ready) return;
    ready = true;
    sessionStorage.setItem('hii-interface-seen', '1');
    hero.classList.add('is-ready');
    nodes.forEach(node => node.setAttribute('tabindex', '0'));
    if (hint) hint.textContent = 'Choose a Hii pathway or select the center circle to play the Hii film.';
  };

  const settleAtFinalFrame = () => {
    if (!motionVideo) return activateInterface();
    const settle = () => {
      const target = Math.max(0, (motionVideo.duration || 12.36) - 0.08);
      try { motionVideo.currentTime = target; } catch (_) {}
      motionVideo.pause();
      activateInterface();
    };
    if (motionVideo.readyState >= 1) settle();
    else motionVideo.addEventListener('loadedmetadata', settle, { once: true });
  };

  try {
    const chunkUrls = Array.from({ length: 10 }, (_, i) => `/site/media/hero-v4.preview-${String(i).padStart(2, '0')}.b64`);
    const parts = await Promise.all(chunkUrls.map(async url => {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Hero media chunk failed: ${url}`);
      return (await response.text()).trim();
    }));
    const encoded = parts.join('');
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    heroUrl = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
    motionVideo.src = heroUrl;

    motionVideo.addEventListener('ended', activateInterface, { once: true });
    motionVideo.addEventListener('timeupdate', () => {
      if (motionVideo.duration && motionVideo.currentTime >= motionVideo.duration - 0.12) activateInterface();
    });

    if (returning || reducedMotion.matches) {
      settleAtFinalFrame();
    } else {
      const playAttempt = motionVideo.play();
      if (playAttempt?.catch) {
        playAttempt.catch(() => hero.addEventListener('pointerdown', () => motionVideo.play().catch(() => {}), { once: true }));
      }
    }
  } catch (error) {
    console.error(error);
    if (hint) hint.textContent = 'The Hii interface is ready.';
    activateInterface();
  }

  reducedMotion.addEventListener?.('change', event => {
    if (event.matches && !ready) settleAtFinalFrame();
  });

  const openFilm = () => {
    if (!ready || !dialog || !filmVideo) return;
    lastFocus = document.activeElement;
    dialog.hidden = false;
    const playAttempt = filmVideo.play();
    if (playAttempt?.catch) playAttempt.catch(() => {});
    dialog.querySelector('.film-dialog__close')?.focus();
  };

  const closeFilm = () => {
    if (!dialog || dialog.hidden) return;
    filmVideo?.pause();
    dialog.hidden = true;
    lastFocus?.focus?.();
  };

  openFilmButton?.addEventListener('click', openFilm);
  closeFilmControls.forEach(control => control.addEventListener('click', closeFilm));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog && !dialog.hidden) closeFilm();
  });
  window.addEventListener('pagehide', () => { if (heroUrl) URL.revokeObjectURL(heroUrl); }, { once: true });
})();
