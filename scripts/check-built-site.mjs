import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "_site");
const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);
const read = (relativePath) => readFile(path.join(root, relativePath));
const sha = (content) => createHash("sha256").update(content).digest("hex");

const frontDoorFiles = ["index.html", "front-door.css", "front-door.js"];
for (const filename of frontDoorFiles) {
  const source = filename === "index.html" ? `restart-front-door/${filename}` : `restart-front-door/${filename}`;
  const [expected, built] = await Promise.all([read(source), read(`_site/${filename}`)]);
  if (!expected.equals(built)) fail(`_site/${filename} differs from ${source}`);
  else pass(`${filename} is byte-identical to its locked source`);
}

const pagePath = "_site/relationships/index.html";
const page = (await read(pagePath)).toString("utf8");
const required = [
  [/<html lang="en">/, "document language"],
  [/<title>Human-AI Relationships \| Hii<\/title>/, "page title"],
  [/<meta name="description" content="[^"]+">/, "meta description"],
  [/<link rel="canonical" href="https:\/\/hii\.earth\/relationships\/">/, "canonical URL"],
  [/<main id="main-content"[^>]*>/, "main landmark"],
  [/href="#main-content">Skip to content/, "skip link"],
  [/aria-label="Institutional navigation"/, "utility navigation label"],
  [/href="\/\?return=hii">Return to Hii/, "static-state Return to Hii"],
  [/class="wordmark" href="\/\?return=hii"/, "static-state Hii wordmark return"],
  [/The Relationship as the Unit of Analysis/, "canonical working-paper title"],
  [/Hii studies what changes when relationships with AI become sustained, personal, and consequential\./, "approved hero copy"],
  [/human-ai-relationship-still\.png/, "approved hero still"],
  [/class="relationship-system-svg"/, "accessible relationship-system reconstruction"],
  [/Waking ÆLYSIA/, "approved publication"],
  [/href="\/relationships\/research-inquiry\/"/, "internal Research Inquiry route"]
];
for (const [pattern, label] of required) {
  if (!pattern.test(page)) fail(`relationships page is missing ${label}`);
  else pass(`relationships page includes ${label}`);
}
if (/Content decision/i.test(page)) fail("relationships page exposes a visitor-facing content decision");
else pass("relationships page has no visitor-facing content decisions");
for (const removedSection of ["Flagship artifact", "Relationship literacy", "Study what happens between people and systems across time.</h2>"]) {
  if (page.includes(removedSection)) fail(`relationships page retains removed content: ${removedSection}`);
}
if (!failures.some((item) => item.includes("retains removed content"))) pass("relationships page omits superseded standalone sections");

const relateOrder = [
  'class="relate-hero',
  'class="section-shell relationship-intro',
  'class="paper-feature-section',
  'class="section-shell pathway-section relate-pathway-section',
  'class="section-shell publications-section',
  'class="research-inquiry-section'
].map((marker) => page.indexOf(marker));
if (relateOrder.some((position) => position < 0) || relateOrder.some((position, index) => index > 0 && position <= relateOrder[index - 1])) {
  fail("relationships page does not follow the approved section order");
} else pass("relationships page follows the approved section order");

const h1Count = (page.match(/<h1(?:\s|>)/g) || []).length;
if (h1Count !== 1) fail(`relationships page has ${h1Count} h1 elements; expected 1`);
else pass("relationships page has one h1");

const understandPath = "_site/understand/index.html";
const understandPage = (await read(understandPath)).toString("utf8");
const understandRequired = [
  [/<title>Public Orientation and Literacy \| Hii<\/title>/, "page title"],
  [/<link rel="canonical" href="https:\/\/hii\.earth\/understand\/">/, "canonical URL"],
  [/href="\/\?return=hii">Return to Hii/, "static-state Return to Hii"],
  [/Every public claim should show what kind of claim it is\./, "evidence framework"],
  [/Epistemic Guardrails/, "shared Epistemic Guardrails artifact"],
  [/href="\/relationships\/"/, "Relationships cross-world link"],
  [/class="disclosure-list"/, "accessible disclosure-list component"],
  [/Public literacy should reduce both panic and false reassurance\./, "public boundary"]
];
for (const [pattern, label] of understandRequired) {
  if (!pattern.test(understandPage)) fail(`understand page is missing ${label}`);
  else pass(`understand page includes ${label}`);
}
const understandH1Count = (understandPage.match(/<h1(?:\s|>)/g) || []).length;
if (understandH1Count !== 1) fail(`understand page has ${understandH1Count} h1 elements; expected 1`);
else pass("understand page has one h1");

const understandSourceHash = sha(await read("src/understand/index.njk"));
if (understandSourceHash !== "2694b225ef11796b5f446f0badaa2c5c1ace46a76efc05b50ed46e01da228120") fail("frozen Understand template changed");
else pass("frozen Understand template is unchanged");

for (const assetPath of [
  "_site/assets/media/relate/human-ai-relationship-still.png",
  "_site/assets/media/relate/relationship-system-reference.png",
  "_site/assets/media/relate/waking-aelysia-cover.png"
]) {
  try { await access(path.join(root, assetPath)); }
  catch { fail(`approved Relate asset is missing: ${assetPath}`); }
}
if (!failures.some((item) => item.includes("approved Relate asset"))) pass("approved Relate stills and reference art are present");
if (/<video|\.mp4/i.test(page)) fail("relationships page uses video before the clean hero export is supplied");
else pass("relationships page uses the approved still while the clean hero video is pending");

const paperPath = "_site/relationships/the-relationship-as-unit-of-analysis/index.html";
const paperPage = (await read(paperPath)).toString("utf8");
const paperRequired = [
  [/<title>The Relationship as the Unit of Analysis \| Hii<\/title>/, "page title"],
  [/<meta name="robots" content="noindex">/, "temporary noindex"],
  [/<link rel="canonical" href="https:\/\/hii\.earth\/relationships\/the-relationship-as-unit-of-analysis\/">/, "canonical URL"],
  [/What it studies/, "What it studies card"],
  [/How it can be tested/, "How it can be tested card"],
  [/Why it matters/, "Why it matters card"],
  [/Relationship-level research does not require a claim about machine consciousness\./, "claim boundary"],
  [/Final public paper-status wording and PDF access are pending approval\./, "explicit pending dependency"]
];
for (const [pattern, label] of paperRequired) {
  if (!pattern.test(paperPage)) fail(`paper page is missing ${label}`);
  else pass(`paper page includes ${label}`);
}
if ((paperPage.match(/href="\/relationships\/"/g) || []).length < 2) fail("paper page lacks repeated Back to Relate controls");
else pass("paper page repeats Back to Relate controls");
if (/target="_blank"|\.pdf/i.test(paperPage)) fail("paper page activates unapproved PDF access");
else pass("paper page does not activate unapproved PDF access");

const inquiryPath = "_site/relationships/research-inquiry/index.html";
const inquiryPage = (await read(inquiryPath)).toString("utf8");
const inquiryRequired = [
  [/<title>Research Inquiry \| Hii<\/title>/, "page title"],
  [/<meta name="robots" content="noindex">/, "temporary noindex"],
  [/name="full-name"/, "full-name field"],
  [/name="email"/, "email field"],
  [/name="role"/, "role field"],
  [/name="area-of-interest"/, "area-of-interest field"],
  [/name="message"/, "open-text field"],
  [/fieldset disabled/, "disabled pre-privacy form state"],
  [/Submissions are not yet enabled\./, "explicit pending dependency"]
];
for (const [pattern, label] of inquiryRequired) {
  if (!pattern.test(inquiryPage)) fail(`inquiry page is missing ${label}`);
  else pass(`inquiry page includes ${label}`);
}
if (/data-netlify="true"|<form[^>]+method="post"/i.test(inquiryPage)) fail("inquiry page activates an unapproved submission route");
else pass("inquiry page does not activate an unapproved submission route");
if ((inquiryPage.match(/href="\/relationships\/"/g) || []).length < 2) fail("inquiry page lacks repeated Back to Relate controls");
else pass("inquiry page repeats Back to Relate controls");

for (const [pageLabel, pageHtml] of [["relationships", page], ["understand", understandPage], ["paper", paperPage], ["inquiry", inquiryPage]]) {
  const hrefs = [...pageHtml.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const clean = decodeURIComponent(href.split("#")[0].split("?")[0]);
    if (!clean) continue;
    const relative = clean.replace(/^\//, "");
    const candidate = clean.endsWith("/") ? path.join(output, relative, "index.html") : path.join(output, relative);
    try {
      await access(candidate);
    } catch {
      fail(`${pageLabel} internal link does not resolve in the build: ${href}`);
    }
  }
}
if (!failures.some((item) => item.includes("internal link"))) pass("all world-page internal links resolve");

const css = (await read("_site/assets/css/hii-site.css")).toString("utf8");
if (!/@media \(prefers-reduced-motion: reduce\)/.test(css)) fail("shared CSS lacks a reduced-motion mode");
else pass("shared CSS includes reduced-motion handling");
if (!/font-family: "Manrope"/.test(css)) fail("shared CSS does not specify Manrope");
else pass("shared CSS specifies Manrope");

for (const unbuiltWorld of ["adaptation", "mental-health", "institutional-readiness", "governance", "research"]) {
  try {
    await access(path.join(output, unbuiltWorld));
    fail(`unapproved world route was built: /${unbuiltWorld}/`);
  } catch {}
}
pass("no additional world routes beyond Relate and Understand were generated");

const netlify = (await read("netlify.toml")).toString("utf8");
if (/\[\[redirects\]\]/.test(netlify)) fail("Netlify redirects were activated");
else pass("no Netlify redirects are active");

const sitemap = (await read("_site/sitemap.xml")).toString("utf8");
if (!sitemap.includes("https://hii.earth/relationships/")) fail("sitemap omits /relationships/");
else pass("sitemap includes /relationships/");
if (!sitemap.includes("https://hii.earth/understand/")) fail("sitemap omits /understand/");
else pass("sitemap includes /understand/");

const builtFrontDoorJs = (await read("_site/front-door.js")).toString("utf8");
if (!builtFrontDoorJs.includes("destination === 'Understand') window.location.assign('/understand/')")) fail("front door lacks the Understand routing seam");
else pass("front door routes Understand to /understand/");

const approvedSource = (await read("restart-front-door/index.html")).toString("utf8").replace(/\r\n/g, "\n");
const approvedSourceHash = sha(approvedSource);
if (approvedSourceHash !== "e4ebf7ab4ff0cc0fbf60dce6aafc760f77b41996d254869de337e56a9f44e1b0") {
  fail("approved front-door HTML checksum changed");
}

if (failures.length) {
  console.error("\nBuild checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nAll build-integrity checks passed.");
