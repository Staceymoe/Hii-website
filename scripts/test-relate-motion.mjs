import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../src/assets/js/relate-hero.js", import.meta.url), "utf8");

const runScenario = (reducedMotion) => {
  const listeners = [];
  const videos = [0, 1].map(() => ({
    currentTime: 4.2,
    paused: false,
    attributes: new Set(),
    pause() { this.paused = true; },
    play() { this.paused = false; this.played = true; return Promise.resolve(); },
    setAttribute(name) { this.attributes.add(name); },
    removeAttribute(name) { this.attributes.delete(name); }
  }));
  const mediaQuery = {
    matches: reducedMotion,
    addEventListener(type, listener) { listeners.push({ type, listener }); }
  };

  vm.runInNewContext(source, {
    document: { querySelectorAll: () => videos },
    window: { matchMedia: () => mediaQuery }
  });

  return { listeners, videos };
};

const reduced = runScenario(true);
assert.equal(reduced.listeners.length, 1);
for (const video of reduced.videos) {
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
  assert.equal(video.attributes.has("autoplay"), false);
}

const animated = runScenario(false);
assert.equal(animated.listeners.length, 1);
for (const video of animated.videos) {
  assert.equal(video.played, true);
  assert.equal(video.attributes.has("autoplay"), true);
}

console.log("Relate motion regression verified: normal mode plays both approved moments; reduced motion settles both on their posters.");
