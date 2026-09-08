const careMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const careVideos = document.querySelectorAll("[data-care-play-once]");

const carePosterFor = (video) => {
  if (video.classList?.contains("care-adaptation-video--desktop")) {
    return "/assets/media/care/care-human-ai-adaptation-desktop-poster-final.webp";
  }
  if (video.classList?.contains("care-adaptation-video--mobile")) {
    return "/assets/media/care/care-human-ai-adaptation-mobile-poster-final.webp";
  }
  return video.getAttribute("poster");
};

careVideos.forEach((video) => {
  const poster = carePosterFor(video);
  if (poster && video.getAttribute("poster") !== poster) video.setAttribute("poster", poster);
});

const settleOnPoster = (video, observer) => {
  video.pause();
  video.currentTime = 0;
  video.dataset.carePlayed = "blocked";
  video.load();
  observer?.unobserve(video);
};

if (!careMotionQuery.matches && careVideos.length) {
  const playOnce = (video, observer) => {
    if (video.dataset.carePlayed === "true" || video.dataset.carePlayed === "blocked") return;

    video.dataset.carePlayed = "true";
    video.currentTime = 0;
    const playPromise = video.play();

    if (playPromise) {
      playPromise.then(() => observer.unobserve(video)).catch(() => settleOnPoster(video, observer));
    } else {
      observer.unobserve(video);
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          playOnce(entry.target, observer);
        }
      });
    }, { threshold: [0.35] });

    careVideos.forEach((video) => observer.observe(video));
  } else {
    careVideos.forEach((video) => {
      video.dataset.carePlayed = "true";
      video.play().catch(() => settleOnPoster(video));
    });
  }
} else {
  careVideos.forEach((video) => settleOnPoster(video));
}
