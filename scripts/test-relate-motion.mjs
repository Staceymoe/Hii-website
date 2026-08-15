import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../src/assets/js/relate-hero.js", import.meta.url), "utf8");

const runScenario = (reducedMotion, mobileViewport = false) => {
  const motionListeners = [];
  const viewportListeners = [];
  const videos = [0, 1, 2].map(() => ({
    currentTime: 4.2,
    paused: false,
    src: null,
    dataset: {},
    attributes: new Set(),
    pause() { this.paused = true; },
    play() { this.paused = false; this.played = true; return Promise.resolve(); },
    load() { this.loadCount = (this.loadCount || 0) + 1; },
    getAttribute(name) { return name === "src" ? this.src : null; },
    setAttribute(name, value = "") { this.attributes.add(name); if (name === "src") this.src = value; },
    removeAttribute(name) { this.attributes.delete(name); if (name === "src") this.src = null; }
  }));
  videos[1].dataset = {
    mobileSrc: "/assets/media/relate/relational-system-mobile.mp4",
    desktopSrc: "/assets/media/relate/relational-system-desktop.mp4"
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
assert.equal(reduced.videos[1].src, "/assets/media/relate/relational-system-mobile.mp4");
assert.equal(reduced.videos[1].loadCount, 1);

const animated = runScenario(false);
assert.equal(animated.motionListeners.length, 1);
assert.equal(animated.viewportListeners.length, 1);
for (const video of animated.videos) {
  assert.equal(video.played, true);
  assert.equal(video.attributes.has("autoplay"), true);
}
assert.equal(animated.videos[1].src, "/assets/media/relate/relational-system-desktop.mp4");

const mobile = runScenario(false, true);
assert.equal(mobile.videos[1].src, "/assets/media/relate/relational-system-mobile.mp4");
mobile.viewportQuery.matches = false;
mobile.viewportListeners[0].listener();
assert.equal(mobile.videos[1].src, "/assets/media/relate/relational-system-desktop.mp4");
assert.equal(mobile.videos[1].loadCount, 2);

console.log("Relate motion regression verified: mobile and desktop receive only their approved source, final-frame videos do not loop, and reduced motion settles all three moments on their posters.");
