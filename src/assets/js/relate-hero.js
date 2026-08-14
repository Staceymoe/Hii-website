(() => {
  const videos = [...document.querySelectorAll("[data-relate-motion]")];
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  const applyMotionPreference = () => {
    videos.forEach((video) => {
      if (motionPreference.matches) {
        video.pause();
        video.removeAttribute("autoplay");
        video.currentTime = 0;
        return;
      }

      video.setAttribute("autoplay", "");
      video.play().catch(() => {});
    });
  };

  const enhanceRelationalSystem = () => {
    const figure = document.querySelector(".relate-system-asset");
    const original = figure?.querySelector("img");
    if (!figure || !original || figure.querySelector("[data-relate-system-sequence]")) return;

    const style = document.createElement("style");
    style.textContent = `
      .relate-system-sequence { margin: 0; }
      .relate-system-sequence-title {
        margin: 0 0 1.35rem;
        max-width: none;
        color: #080b10;
        font-size: clamp(1.45rem, 2vw, 2rem);
        font-weight: 500;
        line-height: 1.15;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .relate-system-stage {
        position: relative;
        width: 100%;
        overflow: hidden;
        background: #000;
        border: 1px solid rgba(8,11,16,0.16);
      }
      .relate-system-stage--desktop { aspect-ratio: 1737 / 500; }
      .relate-system-stage--mobile { display: none; aspect-ratio: 1024 / 1432; }
      .relate-system-part {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: auto;
        max-width: none;
        border: 0 !important;
        pointer-events: none;
        will-change: opacity, transform;
      }
      .relate-system-stage--desktop .relate-system-part { transform: translateY(-15%); }
      .relate-system-stage--mobile .relate-system-part { transform: translateY(-6.8%); }

      .relate-system-stage--desktop .relate-system-part:nth-child(1) { clip-path: inset(0 82% 0 0); }
      .relate-system-stage--desktop .relate-system-part:nth-child(2) { clip-path: inset(0 75% 0 18%); }
      .relate-system-stage--desktop .relate-system-part:nth-child(3) { clip-path: inset(0 62% 0 25%); }
      .relate-system-stage--desktop .relate-system-part:nth-child(4) { clip-path: inset(0 55% 0 38%); }
      .relate-system-stage--desktop .relate-system-part:nth-child(5) { clip-path: inset(0 42% 0 45%); }
      .relate-system-stage--desktop .relate-system-part:nth-child(6) { clip-path: inset(0 35% 0 58%); }
      .relate-system-stage--desktop .relate-system-part:nth-child(7) { clip-path: inset(0 22% 0 65%); }
      .relate-system-stage--desktop .relate-system-part:nth-child(8) { clip-path: inset(0 15% 0 78%); }
      .relate-system-stage--desktop .relate-system-part:nth-child(9) { clip-path: inset(0 0 0 85%); }

      .relate-system-stage--mobile .relate-system-part:nth-child(1) { clip-path: inset(0 0 80% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(2) { clip-path: inset(20% 0 75% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(3) { clip-path: inset(25% 0 60% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(4) { clip-path: inset(40% 0 55% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(5) { clip-path: inset(45% 0 40% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(6) { clip-path: inset(60% 0 35% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(7) { clip-path: inset(65% 0 20% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(8) { clip-path: inset(80% 0 16% 0); }
      .relate-system-stage--mobile .relate-system-part:nth-child(9) { clip-path: inset(84% 0 0 0); }

      .relate-system-sequence.is-enhanced .relate-system-part { opacity: 0; }
      .relate-system-sequence.is-enhanced.is-revealed .relate-system-part {
        animation: relate-system-pop 280ms cubic-bezier(.2,.7,.2,1) forwards;
      }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(1) { animation-delay: 0ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(2) { animation-delay: 120ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(3) { animation-delay: 240ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(4) { animation-delay: 360ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(5) { animation-delay: 480ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(6) { animation-delay: 600ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(7) { animation-delay: 720ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(8) { animation-delay: 840ms; }
      .relate-system-sequence.is-revealed .relate-system-part:nth-child(9) { animation-delay: 960ms; }
      @keyframes relate-system-pop {
        from { opacity: 0; filter: brightness(.7); }
        to { opacity: 1; filter: brightness(1); }
      }
      @media (max-width: 760px) {
        .relate-system-sequence-title {
          margin-bottom: 1rem;
          font-size: clamp(1.25rem, 5.2vw, 1.65rem);
          letter-spacing: 0.06em;
          text-align: center;
        }
        .relate-system-stage--desktop { display: none; }
        .relate-system-stage--mobile { display: block; }
      }
      @media (prefers-reduced-motion: reduce) {
        .relate-system-sequence.is-enhanced .relate-system-part,
        .relate-system-sequence.is-enhanced.is-revealed .relate-system-part {
          opacity: 1;
          animation: none;
          filter: none;
        }
      }
    `;
    document.head.append(style);

    const createStage = (className, src, alt) => {
      const stage = document.createElement("div");
      stage.className = `relate-system-stage ${className}`;
      stage.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 9; i += 1) {
        const image = document.createElement("img");
        image.className = "relate-system-part";
        image.src = src;
        image.alt = "";
        image.decoding = "async";
        if (i > 0) image.loading = "lazy";
        stage.append(image);
      }
      stage.dataset.alt = alt;
      return stage;
    };

    const sequence = document.createElement("div");
    sequence.className = "relate-system-sequence";
    sequence.dataset.relateSystemSequence = "";

    const heading = document.createElement("h3");
    heading.className = "relate-system-sequence-title";
    heading.textContent = "The relational system we study";
    sequence.append(heading);

    const accessibleDescription = document.createElement("p");
    accessibleDescription.className = "visually-hidden";
    accessibleDescription.textContent = original.alt;
    sequence.append(accessibleDescription);

    sequence.append(
      createStage(
        "relate-system-stage--desktop",
        original.currentSrc || original.src,
        original.alt
      ),
      createStage(
        "relate-system-stage--mobile",
        "/assets/media/relate/relationship-system-mobile-vertical.png",
        original.alt
      )
    );

    original.replaceWith(sequence);

    const reveal = () => sequence.classList.add("is-revealed");
    const applySequenceMotion = () => {
      if (motionPreference.matches) {
        sequence.classList.remove("is-enhanced", "is-revealed");
        return;
      }

      sequence.classList.add("is-enhanced");
      if (!("IntersectionObserver" in window)) {
        reveal();
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        reveal();
        observer.disconnect();
      }, { threshold: 0.28 });
      observer.observe(sequence);
    };

    applySequenceMotion();
    motionPreference.addEventListener?.("change", applySequenceMotion);
  };

  applyMotionPreference();
  motionPreference.addEventListener?.("change", applyMotionPreference);
  enhanceRelationalSystem();
})();
