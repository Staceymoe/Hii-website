(() => {
  const videos = [...document.querySelectorAll("[data-relate-motion]")];
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileViewport = window.matchMedia("(max-width: 760px)");
  const responsiveVideo = videos.find((video) => video.dataset?.mobileSrc && video.dataset?.desktopSrc);

  const applyResponsiveSource = () => {
    if (!responsiveVideo) return;
    const nextSource = mobileViewport.matches ? responsiveVideo.dataset.mobileSrc : responsiveVideo.dataset.desktopSrc;
    const nextPoster = mobileViewport.matches ? responsiveVideo.dataset.mobilePoster : responsiveVideo.dataset.desktopPoster;

    if (nextPoster && responsiveVideo.getAttribute("poster") !== nextPoster) {
      responsiveVideo.setAttribute("poster", nextPoster);
    }
    if (responsiveVideo.getAttribute("src") === nextSource) return;

    responsiveVideo.pause();
    responsiveVideo.setAttribute("src", nextSource);
    responsiveVideo.load();
  };

  const settleOnPoster = (video) => {
    video.pause();
    video.removeAttribute("autoplay");
    video.currentTime = 0;
    video.dataset.motionBlocked = "true";
    video.load();
  };

  const applyMotionPreference = () => {
    videos.forEach((video) => {
      if (motionPreference.matches) {
        settleOnPoster(video);
        return;
      }

      video.setAttribute("autoplay", "");
      video.play().catch(() => settleOnPoster(video));
    });
  };

  applyResponsiveSource();
  applyMotionPreference();
  motionPreference.addEventListener?.("change", applyMotionPreference);
  mobileViewport.addEventListener?.("change", () => {
    applyResponsiveSource();
    applyMotionPreference();
  });
})();
