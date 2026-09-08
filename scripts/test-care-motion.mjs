import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../src/assets/js/care-motion.js", import.meta.url), "utf8");

const makeVideo = (className, existingPoster = null, rejectPlay = false) => {
  const attributes = new Map();
  if (existingPoster) attributes.set("poster", existingPoster);
  const classes = new Set(className ? [className] : []);
  return {
    currentTime: 4,
    dataset: {},
    paused: false,
    playCalls: 0,
    loadCalls: 0,
    classList: { contains: (name) => classes.has(name) },
    getAttribute: (name) => attributes.has(name) ? attributes.get(name) : null,
    setAttribute: (name, value) => attributes.set(name, value),
    pause() { this.paused = true; },
    load() { this.loadCalls += 1; },
    play() {
      this.playCalls += 1;
      return rejectPlay ? Promise.reject(new Error("autoplay blocked")) : Promise.resolve();
    }
  };
};

const runScenario = (reducedMotion, rejectPlay = false) => {
  const desktop = makeVideo("care-adaptation-video--desktop", null, rejectPlay);
  const mobile = makeVideo("care-adaptation-video--mobile", null, rejectPlay);
  const overwhelm = makeVideo("", "/assets/media/care/care-overwhelm-final-poster-v1.webp", rejectPlay);
  const videos = [desktop, mobile, overwhelm];
  const observed = [];
  const unobserved = [];
  let callback = null;

  class MockIntersectionObserver {
    constructor(cb) { callback = cb; }
    observe(video) { observed.push(video); }
    unobserve(video) { unobserved.push(video); }
  }

  vm.runInNewContext(source, {
    document: { querySelectorAll: () => videos },
    window: { matchMedia: () => ({ matches: reducedMotion }) },
    IntersectionObserver: MockIntersectionObserver
  });

  return {
    desktop,
    mobile,
    overwhelm,
    videos,
    observed,
    unobserved,
    trigger() {
      callback?.(videos.map((video) => ({ target: video, isIntersecting: true, intersectionRatio: 1 })));
    }
  };
};

const active = runScenario(false, true);
assert.equal(active.desktop.getAttribute("poster"), "/assets/media/care/care-human-ai-adaptation-desktop-poster-final.webp");
assert.equal(active.mobile.getAttribute("poster"), "/assets/media/care/care-human-ai-adaptation-mobile-poster-final.webp");
assert.equal(active.overwhelm.getAttribute("poster"), "/assets/media/care/care-overwhelm-final-poster-v1.webp");
assert.equal(active.observed.length, 3, "CARE videos should be observed for play-once motion");
active.trigger();
await Promise.resolve();
await Promise.resolve();
for (const video of active.videos) {
  assert.equal(video.dataset.carePlayed, "blocked", "blocked motion must settle instead of leaving a black video frame");
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
  assert.equal(video.loadCalls, 1, "blocked motion should reload its poster frame");
}
assert.equal(active.unobserved.length, 3, "blocked videos should stop retrying autoplay");

const reduced = runScenario(true);
for (const video of reduced.videos) {
  assert.equal(video.playCalls, 0, "reduced motion must not attempt playback");
  assert.equal(video.dataset.carePlayed, "blocked");
  assert.equal(video.currentTime, 0);
  assert.equal(video.loadCalls, 1);
}

console.log("CARE motion regression verified: desktop, mobile, and overwhelm visuals retain approved static posters when playback is unavailable or reduced.");
