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

    const source = original.currentSrc || original.src;
    const labels = [
      "Human participant",
      "AI + product state",
      "Preservation infrastructure",
      "Interaction history",
      "External context"
    ];
    const iconPositions = ["0%", "25%", "50%", "75%", "100%"];

    const style = document.createElement("style");
    style.textContent = `
      .relate-system-sequence {
        --relate-ink: #080b10;
        --relate-ivory: #f2ede2;
        --relate-ivory-soft: #d8d2c6;
        --relate-champagne: #cbb88e;
        overflow: hidden;
        padding: clamp(1.5rem, 3vw, 2.4rem);
        color: var(--relate-ivory);
        background: #030506;
        border: 1px solid rgba(8, 11, 16, 0.16);
      }

      .relate-system-sequence-heading {
        display: grid;
        grid-template-columns: minmax(1.5rem, 1fr) auto minmax(1.5rem, 1fr);
        gap: clamp(0.8rem, 1.8vw, 1.5rem);
        align-items: center;
        margin-bottom: clamp(1.6rem, 3vw, 2.4rem);
      }

      .relate-system-sequence-heading::before,
      .relate-system-sequence-heading::after {
        content: "";
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(203, 184, 142, 0.7));
      }

      .relate-system-sequence-heading::after {
        background: linear-gradient(90deg, rgba(203, 184, 142, 0.7), transparent);
      }

      .relate-system-sequence-title {
        margin: 0;
        max-width: none;
        color: var(--relate-ivory);
        font-family: "Manrope", sans-serif;
        font-size: clamp(1rem, 1.55vw, 1.35rem);
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: 0.14em;
        text-align: center;
        text-transform: uppercase;
      }

      .relate-system-list {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: clamp(1rem, 2vw, 2rem);
        align-items: start;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .relate-system-item {
        --item-delay: 0ms;
        --arrow-delay: 160ms;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 0;
        text-align: center;
      }

      .relate-system-item:not(:last-child)::after {
        content: "→";
        position: absolute;
        top: clamp(3.2rem, 4.7vw, 4.1rem);
        left: calc(100% + clamp(0.15rem, 0.55vw, 0.5rem));
        color: var(--relate-champagne);
        font-size: clamp(1.1rem, 1.7vw, 1.45rem);
        font-weight: 400;
        line-height: 1;
        transform: translate(-50%, -50%);
      }

      .relate-system-icon {
        width: clamp(6.6rem, 9.2vw, 8.4rem);
        aspect-ratio: 1;
        background-image: var(--relate-system-source);
        background-repeat: no-repeat;
        background-size: 620% auto;
        background-position: var(--icon-position) 42%;
        border-radius: 50%;
      }

      .relate-system-label {
        display: block;
        max-width: 13rem;
        margin-top: 0.8rem;
        color: var(--relate-ivory);
        font-family: "Manrope", sans-serif;
        font-size: clamp(0.72rem, 1vw, 0.88rem);
        font-weight: 500;
        line-height: 1.35;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .relate-system-sequence.is-enhanced .relate-system-item {
        opacity: 0;
        transform: translateY(0.45rem) scale(0.97);
      }

      .relate-system-sequence.is-enhanced .relate-system-item:not(:last-child)::after {
        opacity: 0;
      }

      .relate-system-sequence.is-enhanced.is-revealed .relate-system-item {
        animation: relate-system-settle 380ms cubic-bezier(.22,.61,.36,1) var(--item-delay) forwards;
      }

      .relate-system-sequence.is-enhanced.is-revealed .relate-system-item:not(:last-child)::after {
        animation: relate-system-arrow 300ms ease-out var(--arrow-delay) forwards;
      }

      @keyframes relate-system-settle {
        from { opacity: 0; transform: translateY(0.45rem) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes relate-system-arrow {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @media (max-width: 760px) {
        .relate-system-sequence {
          padding: 1.35rem 1.15rem 1.55rem;
        }

        .relate-system-sequence-heading {
          grid-template-columns: minmax(1rem, 0.6fr) minmax(0, auto) minmax(1rem, 0.6fr);
          gap: 0.8rem;
          margin-bottom: 1.25rem;
        }

        .relate-system-sequence-title {
          max-width: 19rem;
          font-size: clamp(0.92rem, 4.3vw, 1.15rem);
          line-height: 1.3;
          letter-spacing: 0.11em;
        }

        .relate-system-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          width: min(100%, 25rem);
          margin-inline: auto;
        }

        .relate-system-item {
          display: grid;
          grid-template-columns: 7.4rem minmax(0, 1fr);
          gap: 1.25rem;
          align-items: center;
          width: 100%;
          text-align: left;
        }

        .relate-system-item:not(:last-child)::after {
          content: "↓";
          top: calc(100% + 0.6rem);
          left: 3.7rem;
          font-size: 1.25rem;
          transform: translate(-50%, -50%);
        }

        .relate-system-icon {
          width: 7.4rem;
        }

        .relate-system-label {
          max-width: 13rem;
          margin-top: 0;
          font-size: clamp(0.78rem, 3.4vw, 0.94rem);
          line-height: 1.45;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .relate-system-sequence.is-enhanced .relate-system-item,
        .relate-system-sequence.is-enhanced.is-revealed .relate-system-item,
        .relate-system-sequence.is-enhanced .relate-system-item:not(:last-child)::after,
        .relate-system-sequence.is-enhanced.is-revealed .relate-system-item:not(:last-child)::after {
          opacity: 1;
          animation: none;
          transform: none;
        }
      }
    `;
    document.head.append(style);

    const sequence = document.createElement("div");
    sequence.className = "relate-system-sequence";
    sequence.dataset.relateSystemSequence = "";
    sequence.style.setProperty("--relate-system-source", `url("${source}")`);

    const heading = document.createElement("div");
    heading.className = "relate-system-sequence-heading";

    const title = document.createElement("h3");
    title.className = "relate-system-sequence-title";
    title.textContent = "The relational system we study";
    heading.append(title);
    sequence.append(heading);

    const accessibleDescription = document.createElement("p");
    accessibleDescription.className = "visually-hidden";
    accessibleDescription.textContent = original.alt;
    sequence.append(accessibleDescription);

    const list = document.createElement("ol");
    list.className = "relate-system-list";

    labels.forEach((label, index) => {
      const item = document.createElement("li");
      item.className = "relate-system-item";
      item.style.setProperty("--item-delay", `${index * 300}ms`);
      item.style.setProperty("--arrow-delay", `${index * 300 + 160}ms`);

      const icon = document.createElement("span");
      icon.className = "relate-system-icon";
      icon.style.setProperty("--icon-position", iconPositions[index]);
      icon.setAttribute("aria-hidden", "true");

      const text = document.createElement("span");
      text.className = "relate-system-label";
      text.textContent = label;

      item.append(icon, text);
      list.append(item);
    });

    sequence.append(list);
    original.replaceWith(sequence);

    let observer;
    const reveal = () => {
      sequence.classList.add("is-revealed");
      observer?.disconnect();
    };

    const applySequenceMotion = () => {
      observer?.disconnect();
      if (motionPreference.matches) {
        sequence.classList.remove("is-enhanced", "is-revealed");
        return;
      }

      sequence.classList.add("is-enhanced");
      if (!("IntersectionObserver" in window)) {
        reveal();
        return;
      }

      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      }, { threshold: 0.24 });
      observer.observe(sequence);
    };

    applySequenceMotion();
    motionPreference.addEventListener?.("change", applySequenceMotion);
  };

  applyMotionPreference();
  motionPreference.addEventListener?.("change", applyMotionPreference);
  enhanceRelationalSystem();
})();
