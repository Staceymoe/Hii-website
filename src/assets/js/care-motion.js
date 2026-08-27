const careMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const careVideos = document.querySelectorAll("[data-care-play-once]");

if (!careMotionQuery.matches && careVideos.length) {
  const playOnce = (video, observer) => {
    if (video.dataset.carePlayed === "true") return;

    video.dataset.carePlayed = "true";
    video.currentTime = 0;
    const playPromise = video.play();

    if (playPromise) {
      playPromise.then(() => observer.unobserve(video)).catch(() => {
        video.dataset.carePlayed = "false";
      });
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
      video.play().catch(() => {});
    });
  }
}
