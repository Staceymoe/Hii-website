import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceOnly = process.argv.includes("--source-only");
const approved = {
  index: "e4ebf7ab4ff0cc0fbf60dce6aafc760f77b41996d254869de337e56a9f44e1b0",
  css: "e1e858884224a5ac5c13313097c56e9f8ab48326c9806486fcaf74c06c28565e",
  normalizedJs: "677f525ac16008098dc714cddb94c06f98a4b0f63df82deea53b16fa2efe272d",
  hero: "e9054efa1eea286e74e50d76ddcb7e436cb2fe733b3a968553da5451de9f904e",
  film: "76e000d4d1e8e4e31a45d4f0bcbc412b286c4ac9524ed8fa8e84e145f3475abc"
};

const seam = "    else if (destination === 'Relate') window.location.assign('/relationships/');\n";
const bytes = async (relativePath) => readFile(path.join(root, relativePath));
const sha = (content) => createHash("sha256").update(content).digest("hex");
const assertHash = async (relativePath, expected) => {
  const actual = sha(await bytes(relativePath));
  if (actual !== expected) throw new Error(`${relativePath} checksum changed: ${actual}`);
};
const assertTextHash = async (relativePath, expected) => {
  const normalized = (await bytes(relativePath)).toString("utf8").replace(/\r\n/g, "\n");
  const actual = sha(normalized);
  if (actual !== expected) throw new Error(`${relativePath} canonical checksum changed: ${actual}`);
};

await assertTextHash("restart-front-door/index.html", approved.index);
await assertTextHash("restart-front-door/front-door.css", approved.css);

const jsPath = "restart-front-door/front-door.js";
const javascript = (await bytes(jsPath)).toString("utf8");
const normalizedLineEndings = javascript.replace(/\r\n/g, "\n");
if (normalizedLineEndings.split(seam).length !== 2) {
  throw new Error(`${jsPath} must contain exactly one approved Relate routing seam.`);
}
if (sha(normalizedLineEndings.replace(seam, "")) !== approved.normalizedJs) {
  throw new Error(`${jsPath} differs from the approved file outside the Relate routing seam.`);
}

if (!sourceOnly) {
  await assertTextHash("_restart/index.html", approved.index);
  await assertTextHash("_restart/front-door.css", approved.css);
  await assertHash("_restart/media/hii-hero-front-door-approved.mp4", approved.hero);
  await assertHash("_restart/media/hii-film-approved-web-1080p.mp4", approved.film);

  const stagedJs = await bytes("_restart/front-door.js");
  if (!stagedJs.equals(await bytes(jsPath))) {
    throw new Error("_restart/front-door.js is not the checksum-approved routed source.");
  }
}

console.log(`Front door integrity verified${sourceOnly ? " (source)" : " (source, stage, and media)"}.`);
