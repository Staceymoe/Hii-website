import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonical, currentWork, pathways, utilityPages } from '../site/content.mjs';
import { footer, head, header, pathwayCards, portalPage, utilityPage } from '../site/templates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
const excluded = new Set(['.git', '.github', '_site', 'node_modules', 'site', 'scripts', 'package.json', 'package-lock.json', '.gitignore', 'netlify.toml']);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  await cp(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
}

const sourceHome = await readFile(path.join(root, 'index.html'), 'utf8');
const heroMatch = sourceHome.match(/<section class="observatory-hero"[\s\S]*?<\/section>/);
if (!heroMatch) throw new Error('Protected observatory hero boundary was not found in root index.html. Build stopped.');
const protectedHero = heroMatch[0];

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);

const workCards = currentWork.map(item => `<article class="current-card">
  <p class="section-kicker">${escapeHtml(item.label)}</p>
  <h3>${escapeHtml(item.title)}</h3>
  <p>${escapeHtml(item.description)}</p>
  <a href="${escapeHtml(item.href)}">Explore the work <span aria-hidden="true">→</span></a>
</article>`).join('\n');

const home = `${head({ title: canonical.name, description: canonical.description, path: '/' })}
<body class="post-hero-home">
  <a class="skip-link" href="#main">Skip to content</a>
  <main id="main">
    ${protectedHero}
    ${header()}
    <section class="orientation section-shell" id="research" aria-labelledby="orientation-title">
      <p class="section-kicker">What Hii is</p>
      <h1 id="orientation-title">${escapeHtml(canonical.description)}</h1>
      <p class="orientation-focus">${escapeHtml(canonical.focus)}</p>
    </section>

    <section class="mission-band section-shell" aria-labelledby="mission-title">
      <p class="section-kicker">Why Hii exists</p>
      <h2 id="mission-title">${escapeHtml(canonical.mission)}</h2>
      <p>${escapeHtml(canonical.role)}</p>
    </section>

    <section class="pathways-section section-shell" id="pathways" aria-labelledby="pathways-title">
      <div class="section-heading-row">
        <div><p class="section-kicker">Seven pathways</p><h2 id="pathways-title">Enter through the question you are carrying.</h2></div>
        <p>The same transition looks different from a home, a clinic, a workplace, a research program, or a public institution. These pathways keep the system connected without forcing every visitor through the same doorway.</p>
      </div>
      <div class="pathway-grid">${pathwayCards()}</div>
    </section>

    <section class="film-entry section-shell" aria-labelledby="film-entry-title">
      <div><p class="section-kicker">The Hii Film</p><h2 id="film-entry-title">Start with the human questions already entering the room.</h2></div>
      <a class="button button-secondary" href="#hero">Return to the observatory and select the center lens</a>
    </section>

    <section class="current-work-v2 section-shell" aria-labelledby="current-title">
      <div class="section-heading-row">
        <div><p class="section-kicker">Current work</p><h2 id="current-title">Three places the work is becoming usable now.</h2></div>
        <p>These are provisional launch features. The complete research and project archive remains available while the new architecture is migrated.</p>
      </div>
      <div class="current-grid">${workCards}</div>
    </section>

    <section class="work-with-hii section-shell" aria-labelledby="work-with-title">
      <p class="section-kicker">Work with Hii</p>
      <h2 id="work-with-title">Bring the human layer into the room before it becomes the missing layer.</h2>
      <p>Hii works with clinicians, institutions, researchers, funders, and public-interest partners who need orientation, preparation, translation, or evidence-building around AI-mediated change.</p>
      <a class="button button-primary" href="/work-with-hii/">Explore ways to work together</a>
    </section>

    <section class="final-orientation section-shell" aria-labelledby="final-title">
      <p class="section-kicker">A new hello for a new world</p>
      <h2 id="final-title">The transition is already underway. We can still decide how to meet it.</h2>
      <a href="/contact/">Begin a conversation <span aria-hidden="true">→</span></a>
    </section>
  </main>
  ${footer()}
  <script src="/js/main.js"></script>
</body>
</html>\n`;

await writeFile(path.join(out, 'index.html'), home);

for (const pathway of pathways) {
  const directory = path.join(out, pathway.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), portalPage(pathway));
}

for (const page of utilityPages) {
  const directory = path.join(out, page.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), utilityPage(page));
}

await writeFile(path.join(out, '404.html'), `${head({ title: 'Page not found', description: 'The requested Hii page could not be found.', path: '/404.html' })}
<body class="utility-page"><a class="skip-link" href="#main">Skip to content</a>${header()}<main id="main"><section class="utility-hero section-shell"><p class="section-kicker">404</p><h1>This path has moved.</h1><p class="portal-lede">Return to Hii or enter through one of the seven pathways.</p><a class="button button-primary" href="/">Return to Hii</a></section></main>${footer()}<script src="/js/main.js"></script></body></html>\n`);

console.log(`Built Hii preview with ${pathways.length} pathways and ${utilityPages.length} utility pages.`);
