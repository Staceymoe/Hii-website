import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../restart-front-door/front-door.js", import.meta.url), "utf8");

const runFrontDoor = (search, destination = "Understand") => {
  const classes = new Set();
  const historyCalls = [];
  let playCalls = 0;
  let pauseCalls = 0;
  const assignments = [];

  const element = (extra = {}) => {
    const listeners = new Map();
    return {
      hidden: false,
      disabled: true,
      textContent: "",
      listeners,
      classList: { add: (name) => classes.add(name), contains: (name) => classes.has(name) },
      addEventListener: (type, callback) => listeners.set(type, callback),
      closest: () => null,
      ...extra
    };
  };

  const hero = element({
    readyState: 1,
    currentTime: 7,
    pause: () => { pauseCalls += 1; },
    play: () => { playCalls += 1; return Promise.resolve(); }
  });
  const entry = element();
  const lens = element();
  lens.dataset = { destination };
  lens.closest = (selector) => selector === "[data-destination]" ? lens : null;
  const lensMap = element();
  const fallback = element();
  const destinationTest = element();
  const destinationTitle = element();
  const filmLayer = element();
  const film = element({ currentTime: 0, pause: () => {}, play: () => Promise.resolve() });
  const selectors = new Map([
    ["[data-hii-entry]", entry],
    ["[data-hero-motion]", hero],
    ["[data-lens-map]", lensMap],
    ["[data-autoplay-fallback]", fallback],
    ["[data-destination-test]", destinationTest],
    ["[data-destination-title]", destinationTitle],
    ["[data-film-layer]", filmLayer],
    ["[data-hii-film]", film]
  ]);

  vm.runInNewContext(source, {
    URLSearchParams,
    window: {
      location: { pathname: "/", search, hash: "", assign: (href) => assignments.push(href) },
      matchMedia: () => ({ matches: false })
    },
    history: { replaceState: (...args) => historyCalls.push(args) },
    document: {
      querySelector: (selector) => selectors.get(selector) ?? null,
      querySelectorAll: (selector) => selector === "[data-destination]" ? [lens] : [],
      addEventListener: () => {}
    }
  });

  return {
    assignments,
    classes,
    clickLens: () => lensMap.listeners.get("click")?.({ target: lens }),
    fallback,
    hero,
    historyCalls,
    lens,
    pauseCalls,
    playCalls
  };
};

const direct = runFrontDoor("");
assert.equal(direct.playCalls, 1, "a direct visit must play the approved hero");
assert.equal(direct.pauseCalls, 0, "a direct visit must not immediately pause the hero");
assert.equal(direct.hero.currentTime, 0, "a direct visit must begin at the start");
assert.equal(direct.classes.has("is-ready"), false, "circles must wait for the direct-entry animation");

const returned = runFrontDoor("?return=hii");
assert.equal(returned.playCalls, 0, "a world return must not replay the hero");
assert.equal(returned.pauseCalls, 1, "a world return must pause the hero");
assert.equal(returned.hero.currentTime, 12.2, "a world return must seek to the approved final frame");
assert.equal(returned.classes.has("is-ready"), true, "a world return must settle the interface");
assert.equal(returned.lens.disabled, false, "a world return must enable the circles");
assert.equal(returned.fallback.hidden, true, "a world return must hide the autoplay fallback");
assert.deepEqual(returned.historyCalls, [[null, "", "/"]], "the temporary return marker must be removed");

const understandRoute = runFrontDoor("?return=hii", "Understand");
understandRoute.clickLens();
assert.deepEqual(understandRoute.assignments, ["/understand/"], "Understand must route to its built world");

const relateRoute = runFrontDoor("?return=hii", "Relate");
relateRoute.clickLens();
assert.deepEqual(relateRoute.assignments, ["/relationships/"], "Relate must retain its built-world route");

console.log("Front-door routing regression verified: direct entry plays; world return settles at 12.2s; Relate and Understand route correctly.");
