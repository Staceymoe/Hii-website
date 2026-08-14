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
  [/Hii exists to help people navigate a historic transition without losing themselves or one another\./, "approved hero copy"],
  [/human-ai-relationship\.mp4/, "approved hero animation"],
  [/poster="\/assets\/media\/relate\/human-ai-relationship-still\.png"/, "approved reduced-motion poster"],
  [/src="\/assets\/js\/relate-hero\.js"/, "reduced-motion-aware hero script"],
  [/relationship-system-five-components\.png/, "approved five-component relationship-system visual"],
  [/Observation becomes a testable research agenda/, "research-agenda callout"],
  [/href="#current-working-paper">Explore the paper/, "same-page embedded-paper action"],
  [/longitudinal-provenance-callouts\.png/, "approved longitudinal provenance callouts"],
  [/research-meaning\.png/, "approved research-meaning graphic"],
  [/Waking ÆLYSIA/, "approved publication"],
  [/amazon\.com\/Waking-%C3%86LYSIA[\s\S]*\/dp\/B0FR54XV22\//, "Waking AELYSIA Amazon paperback destination"],
  [/href="\/relationships\/research-inquiry\/">Research Inquiry/, "Research Inquiry action"],
  [/instagram\.com\/hybridintelligenceinstitute\//, "Instagram destination"],
  [/linkedin\.com\/company\/hybrid-intelligence-institute\//, "LinkedIn destination"],
  [/x\.com\/HumanAIResearch/, "X destination"],
  [/The archive does not prove the hypothesis[\s\S]*It makes the hypothesis testable\./, "approved archive boundary"],
  [/class="paper-document-frame"[^>]+relationship-unit-working-paper-v0\.2\.pdf/, "embedded canonical PDF"]
];
for (const [pattern, label] of required) {
  if (!pattern.test(page)) fail(`relationships page is missing ${label}`);
  else pass(`relationships page includes ${label}`);
}
if (/Content decision/i.test(page)) fail("relationships page exposes a visitor-facing content decision");
else pass("relationships page has no visitor-facing content decisions");
if (/Research orientation/i.test(page)) fail("relationships page retains the superseded Research orientation action");
else pass("relationships page replaces Research orientation with Research Inquiry");
if (/class="site-footer"/.test(page)) fail("relationships page includes the generic shared footer");
else pass("relationships page uses its Relate-specific conclusion instead of the generic shared footer");
for (const removedSection of ["Flagship artifact", "Relationship literacy", "Study what happens between people and systems across time.</h2>"]) {
  if (page.includes(removedSection)) fail(`relationships page retains removed content: ${removedSection}`);
}
if (!failures.some((item) => item.includes("retains removed content"))) pass("relationships page omits superseded standalone sections");

const relateOrder = [
  'class="relate-hero',
  'class="relate-research-intro',
  'class="section-shell relate-provenance-section',
  'class="relate-archive-section',
  'class="relate-interpretation-section',
  'class="section-shell relate-artifact-section',
  'class="section-shell relate-paper-document',
  'class="relate-conclusion'
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
  "_site/assets/media/relate/human-ai-relationship.mp4",
  "_site/assets/media/relate/relationship-system-five-components.png",
  "_site/assets/media/relate/longitudinal-provenance.mp4",
  "_site/assets/media/relate/longitudinal-provenance-poster.webp",
  "_site/assets/media/relate/longitudinal-provenance-callouts.png",
  "_site/assets/media/relate/research-meaning.png",
  "_site/assets/media/relate/hii-observatory-mark.webp",
  "_site/assets/media/relate/archive-accumulation-desktop.jpg",
  "_site/assets/media/relate/archive-accumulation-mobile.png",
  "_site/assets/media/relate/waking-aelysia-cover-approved.jpg"
]) {
  try { await access(path.join(root, assetPath)); }
  catch { fail(`approved Relate asset is missing: ${assetPath}`); }
}
if (!failures.some((item) => item.includes("approved Relate asset"))) pass("approved Relate motion, stills, and reference art are present");
if ((page.match(/<video[^>]+data-relate-motion/g) || []).length !== 2) fail("relationships page does not use exactly the two approved Relate motion moments");
else pass("relationships page uses exactly the two approved Relate motion moments");
if (!/archive-accumulation-mobile\.png[\s\S]*archive-accumulation-desktop\.jpg/.test(page)) fail("relationships page lacks the dedicated responsive archive compositions");
else pass("relationships page includes desktop and mobile archive compositions");
for (const statement of [
  "Time reveals patterns that short sessions hide.",
  "We study the whole system, not isolated moments.",
  "Our interpretations are tested, not assumed."
]) {
  if (!page.includes(statement)) fail(`relationships page is missing approved interpretation statement: ${statement}`);
}
if (!failures.some((item) => item.includes("approved interpretation statement"))) pass("relationships page includes the three approved methodological statements");
if (/Three ways in|Begin a focused conversation with Hii|class="relationship-time-model"/.test(page)) fail("relationships page retains superseded Relate sections");
else pass("relationships page omits superseded Relate sections");

const paperPath = "_site/relationships/the-relationship-as-unit-of-analysis/index.html";
const paperPage = (await read(paperPath)).toString("utf8");
const paperRequired = [
  [/<title>The Relationship as the Unit of Analysis \| Hii<\/title>/, "page title"],
  [/<meta name="robots" content="noindex">/, "temporary noindex"],
  [/<link rel="canonical" href="https:\/\/hii\.earth\/relationships\/the-relationship-as-unit-of-analysis\/">/, "canonical URL"],
  [/Conceptual and methods paper\. Not peer reviewed\. No formal case findings are reported\./, "approved paper status"],
  [/<iframe[^>]+class="paper-document-frame"[^>]+relationship-unit-working-paper-v0\.2\.pdf/, "embedded canonical PDF"],
  [/href="\/assets\/documents\/relationship-unit-working-paper-v0\.2\.pdf" download/, "downloadable canonical PDF"],
  [/href="https:\/\/docs\.google\.com\/document\/d\/10mPXr8oiUNYa2eqgo1J9xDyNz7DZBPXa_Rv9jGNBOMI\/edit"/, "direct paper link"],
  [/The archive does not prove the hypothesis[\s\S]*It makes the hypothesis testable\./, "approved archive boundary"],
  [/18\+ month/, "approved longitudinal duration"],
  [/Human participant[\s\S]*AI and product state[\s\S]*Preservation infrastructure[\s\S]*Interaction history[\s\S]*External context/, "five-part relational system"],
  [/Observed longitudinal case[\s\S]*Systematic preservation[\s\S]*Candidate pattern identification[\s\S]*Falsifiable methods framework[\s\S]*Formal empirical study/, "archive-to-program progression"],
  [/Archive readiness[\s\S]*Preregistered sampling[\s\S]*Independent blind coding[\s\S]*Perturbation and substitution tests[\s\S]*Prospective multi-case research/, "methods and falsification stages"],
  [/Cite this paper/, "citation guidance"],
  [/href="\/\?return=hii">Return to Hii/, "static Return to Hii control"]
];
for (const [pattern, label] of paperRequired) {
  if (!pattern.test(paperPage)) fail(`paper page is missing ${label}`);
  else pass(`paper page includes ${label}`);
}
if ((paperPage.match(/href="\/relationships\/"/g) || []).length < 2) fail("paper page lacks repeated Back to Relate controls");
else pass("paper page repeats Back to Relate controls");
if (/Study what happens between people and systems across time|relationship-time-model/.test(paperPage)) fail("paper page retains the superseded repeated model section");
else pass("paper page removes the superseded repeated model section");
if (/\/preview|100s of thousands|71%|132 key signals/i.test(paperPage)) fail("paper page contains a superseded viewer or unverified quantitative claim");
else pass("paper page omits the superseded viewer and unverified quantitative claims");
const paperH1Count = (paperPage.match(/<h1(?:\s|>)/g) || []).length;
if (paperH1Count !== 1) fail(`paper page has ${paperH1Count} h1 elements; expected 1`);
else pass("paper page has one h1");
try {
  await access(path.join(root, "_site/assets/documents/relationship-unit-working-paper-v0.2.pdf"));
  pass("canonical paper PDF is present in the build");
} catch {
  fail("canonical paper PDF is missing from the build");
}

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
  [/Submissions are not yet enabled\./, "explicit pending dependency"],
  [/href="\/\?return=hii">Return to Hii/, "static Return to Hii control"]
];
for (const [pattern, label] of inquiryRequired) {
  if (!pattern.test(inquiryPage)) fail(`inquiry page is missing ${label}`);
  else pass(`inquiry page includes ${label}`);
}
if (/data-netlify="true"|<form[^>]+method="post"/i.test(inquiryPage)) fail("inquiry page activates an unapproved submission route");
else pass("inquiry page does not activate an unapproved submission route");
if ((inquiryPage.match(/href="\/relationships\/"/g) || []).length < 2) fail("inquiry page lacks repeated Back to Relate controls");
else pass("inquiry page repeats Back to Relate controls");

const carePath = "_site/mental-health/index.html";
const carePage = (await read(carePath)).toString("utf8");
const careRequired = [
  [/<title>Mental Health and Clinical Practice \| Hii<\/title>/, "page title"],
  [/<link rel="canonical" href="https:\/\/hii\.earth\/mental-health\/">/, "canonical URL"],
  [/href="\/\?return=hii">Return to Hii/, "static Return to Hii control"],
  [/When AI enters the therapy room\./, "clinician-first hero"],
  [/Clinical risk[\s\S]*Situational overwhelm[\s\S]*Interaction effects/, "three-lens frame"],
  [/Now forming/, "active roundtable status"],
  [/Available for organizations/, "organizational workshop status"],
  [/Available by inquiry/, "advisory inquiry status"],
  [/roundtable\/interest\//, "roundtable recruitment action"],
  [/Care and clinician education inquiry/, "CARE inquiry destination"],
  [/Not a replacement for therapy, diagnosis, crisis support, supervision, or clinical judgment\./, "public clinical boundary"],
  [/18\+ month/, "approved longitudinal credibility note"],
  [/href="\/relationships\/#relate-provenance-heading"/, "Relate longitudinal-section link"],
  [/href="\/relationships\/the-relationship-as-unit-of-analysis\/"/, "in-site paper-reader link"]
];
for (const [pattern, label] of careRequired) {
  if (!pattern.test(carePage)) fail(`care page is missing ${label}`);
  else pass(`care page includes ${label}`);
}
const careH1Count = (carePage.match(/<h1(?:\s|>)/g) || []).length;
if (careH1Count !== 1) fail(`care page has ${careH1Count} h1 elements; expected 1`);
else pass("care page has one h1");

for (const assetPath of [
  "_site/assets/media/care/care-relationship-system-source.jpg",
  "_site/assets/media/care/care-risk-map-source.png"
]) {
  try { await access(path.join(root, assetPath)); }
  catch { fail(`named Care candidate asset is missing: ${assetPath}`); }
}
if (!failures.some((item) => item.includes("named Care candidate asset"))) pass("named Care candidate and concept assets are present");

const htmlFiles = [];
const collectHtml = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectHtml(absolute);
    else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
};
await collectHtml(output);
const routeForFile = (absolute) => {
  const relative = path.relative(output, absolute).replaceAll(path.sep, "/");
  if (relative === "index.html") return "/";
  return `/${relative.replace(/index\.html$/, "")}`;
};
const routeExists = async (href) => {
  const [withoutHash] = href.split("#");
  const [withoutQuery] = withoutHash.split("?");
  if (!withoutQuery.startsWith("/") || withoutQuery.startsWith("//")) return true;
  if (withoutQuery === "/") return true;
  const candidate = withoutQuery.endsWith("/") ? `${withoutQuery}index.html` : withoutQuery;
  try { await access(path.join(output, candidate)); return true; }
  catch { return false; }
};
for (const absolute of htmlFiles) {
  const html = (await readFile(absolute)).toString("utf8");
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (!(await routeExists(href))) fail(`${routeForFile(absolute)} has unresolved internal link ${href}`);
  }
}
if (!failures.some((item) => item.includes("unresolved internal link"))) pass("all world-page internal links resolve");

const css = (await read("_site/assets/css/hii-site.css")).toString("utf8");
if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css)) fail("shared CSS lacks reduced-motion handling");
else pass("shared CSS includes reduced-motion handling");
if (!/font-family:\s*"Manrope"/.test(css)) fail("shared CSS does not specify Manrope");
else pass("shared CSS specifies Manrope");

for (const [route, label] of [
  ["/adaptation/", "Adapt"],
  ["/institutional-readiness/", "Prepare"],
  ["/governance/", "Govern"],
  ["/research/", "Study"]
]) {
  const built = path.join(output, route, "index.html");
  try {
    const html = (await readFile(built)).toString("utf8");
    if (!html.includes("Hii")) fail(`${label} preview route lacks Hii framing`);
  } catch {
    fail(`${label} preview route was not generated`);
  }
}
if (!failures.some((item) => item.includes("preview route"))) pass("all four developing world preview routes were generated with bounded Hii framing");

try {
  const redirects = (await read("netlify.toml")).toString("utf8");
  if (/\[\[redirects\]\]/.test(redirects)) fail("Netlify redirects are active despite the current no-redirect contract");
  else pass("no Netlify redirects are active");
} catch {
  pass("no Netlify redirects are active");
}

try {
  const headers = (await read("src/_headers")).toString("utf8");
  if (!/\/assets\/documents\/relationship-unit-working-paper-v0\.2\.pdf[\s\S]*X-Frame-Options:\s*SAMEORIGIN/.test(headers)) {
    fail("canonical paper does not enforce same-origin embedding");
  } else pass("canonical paper permits only same-origin embedding");
} catch {
  fail("site headers file is missing");
}

const sitemap = (await read("_site/sitemap.xml")).toString("utf8");
for (const route of ["/relationships/", "/mental-health/", "/understand/", "/adaptation/", "/institutional-readiness/", "/governance/", "/research/"]) {
  if (!sitemap.includes(`https://hii.earth${route}`)) fail(`sitemap is missing ${route}`);
  else pass(`sitemap includes ${route}`);
}

const frontDoorHtml = (await read("_site/index.html")).toString("utf8");
for (const [route, label] of [
  ["/relationships/", "Relate"],
  ["/adaptation/", "Adapt"],
  ["/mental-health/", "Care"],
  ["/institutional-readiness/", "Prepare"],
  ["/governance/", "Govern"],
  ["/understand/", "Understand"],
  ["/research/", "Study"]
]) {
  if (!frontDoorHtml.includes(`href="${route}"`)) fail(`front door does not route ${label} to ${route}`);
  else pass(`front door routes ${label} to ${route}`);
}

if (failures.length) {
  console.error("\nBuild checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nBuilt-site checks passed.");
