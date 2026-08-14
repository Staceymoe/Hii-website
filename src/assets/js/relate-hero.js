(() => {
  const videos = [...document.querySelectorAll("[data-relate-motion]")];
  if (!videos.length) return;

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

  applyMotionPreference();
  motionPreference.addEventListener?.("change", applyMotionPreference);
})();
