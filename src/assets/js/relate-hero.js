(() => {
  const video = document.querySelector("[data-relate-motion]");
  if (!video) return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  const applyMotionPreference = () => {
    if (motionPreference.matches) {
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }

    video.setAttribute("autoplay", "");
    video.play().catch(() => {});
  };

  applyMotionPreference();
  motionPreference.addEventListener?.("change", applyMotionPreference);
})();
