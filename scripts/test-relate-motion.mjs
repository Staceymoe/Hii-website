import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../src/assets/js/relate-hero.js", import.meta.url), "utf8");

const runScenario = (reducedMotion, mobileViewport = false, rejectPlay = false) => {
  const motionListeners = [];
  const viewportListeners = [];
  const videos = [0, 1, 2].map(() => {
    const attributes = new Map();
    return {
      currentTime: 4.2,
      paused: false,
      dataset: {},
      attributes,
      pause() { this.paused = true; },
      play() {
        this.paused = false;
        this.played = true;
        return rejectPlay ? Promise.reject(new Error("autoplay blocked")) : Promise.resolve();
      },
      load() { this.loadCount = (this.loadCount || 0) + 1; },
      getAttribute(name) { return attributes.has(name) ? attributes.get(name) : null; },
      setAttribute(name, value = "") { attributes.set(name, value); },
      removeAttribute(name) { attributes.delete(name); }
    };
  });
  videos[1].dataset = {
    mobileSrc: "/assets/media/relate/relational-system-mobile.mp4",
    desktopSrc: "/assets/media/relate/relational-system-desktop.mp4",
    mobilePoster: "/assets/media/relate/relational-system-mobile-poster.jpg",
    desktopPoster: "/assets/media/relate/relational-system-desktop-poster.jpg"
  };
  const motionQuery = {
    matches: reducedMotion,
    addEventListener(type, listener) { motionListeners.push({ type, listener }); }
  };
  const viewportQuery = {
    matches: mobileViewport,
    addEventListener(type, listener) { viewportListeners.push({ type, listener }); }
  };

  vm.runInNewContext(source, {
    document: { querySelectorAll: () => videos },
    window: { matchMedia: (query) => query.includes("prefers-reduced-motion") ? motionQuery : viewportQuery }
  });

  return { motionListeners, videos, viewportListeners, viewportQuery };
};

const reduced = runScenario(true, true);
assert.equal(reduced.motionListeners.length, 1);
assert.equal(reduced.viewportListeners.length, 1);
for (const video of reduced.videos) {
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
  assert.equal(video.attributes.has("autoplay"), false);
}
assert.equal(reduced.videos[1].getAttribute("src"), "/assets/media/relate/relational-system-mobile.mp4");
assert.equal(reduced.videos[1].getAttribute("poster"), "/assets/media/relate/relational-system-mobile-poster.jpg");
assert.equal(reduced.videos[1].loadCount, 2);

const animated = runScenario(false);
assert.equal(animated.motionListeners.length, 1);
assert.equal(animated.viewportListeners.length, 1);
for (const video of animated.videos) {
  assert.equal(video.played, true);
  assert.equal(video.attributes.has("autoplay"), true);
}
assert.equal(animated.videos[1].getAttribute("src"), "/assets/media/relate/relational-system-desktop.mp4");
assert.equal(animated.videos[1].getAttribute("poster"), "/assets/media/relate/relational-system-desktop-poster.jpg");

const blocked = runScenario(false, true, true);
await Promise.resolve();
await Promise.resolve();
for (const video of blocked.videos) {
  assert.equal(video.paused, true, "blocked motion must settle on a static frame");
  assert.equal(video.currentTime, 0, "blocked motion must reset to the poster state");
  assert.equal(video.attributes.has("autoplay"), false, "blocked motion must stop retrying autoplay immediately");
  assert.equal(video.dataset.motionBlocked, "true", "blocked motion must record the fallback state");
}
assert.equal(blocked.videos[1].getAttribute("poster"), "/assets/media/relate/relational-system-mobile-poster.jpg");

const mobile = runScenario(false, true);
assert.equal(mobile.videos[1].getAttribute("src"), "/assets/media/relate/relational-system-mobile.mp4");
assert.equal(mobile.videos[1].getAttribute("poster"), "/assets/media/relate/relational-system-mobile-poster.jpg");
mobile.viewportQuery.matches = false;
mobile.viewportListeners[0].listener();
assert.equal(mobile.videos[1].getAttribute("src"), "/assets/media/relate/relational-system-desktop.mp4");
assert.equal(mobile.videos[1].getAttribute("poster"), "/assets/media/relate/relational-system-desktop-poster.jpg");
assert.equal(mobile.videos[1].loadCount, 2);

console.log("Relate motion regression verified: approved responsive posters remain visible when autoplay is blocked, mobile and desktop receive only their approved media, and reduced motion settles on static frames.");
