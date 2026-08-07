import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonical, pathways, utilityPages } from '../site/content.mjs';
import { footer, head, heroInterface, portalPage, utilityPage } from '../site/templates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
const excluded = new Set(['.git', '.github', '_site', 'node_modules', 'site', 'scripts', 'package.json', 'package-lock.json', '.gitignore', 'netlify.toml']);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (excluded.has(entry.name)) continue;
  await cp(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
}

// Reconstruct the web-optimized hero video from source-safe base64 chunks.
// This keeps binary media out of text-only connector writes while producing a normal MP4 in the deploy output.
const mediaSource = path.join(root, 'site', 'media');
const mediaChunks = (await readdir(mediaSource))
  .filter(name => /^hero-v4\.part-\d+\.b64$/.test(name))
  .sort();

if (!mediaChunks.length) throw new Error('New Hii motion hero media chunks are missing. Build stopped.');

const encodedHero = (await Promise.all(mediaChunks.map(name => readFile(path.join(mediaSource, name), 'utf8')))).join('');
const heroBuffer = Buffer.from(encodedHero, 'base64');
if (heroBuffer.length < 500000) throw new Error('New Hii motion hero media appears incomplete. Build stopped.');

await mkdir(path.join(out, 'assets'), { recursive: true });
await writeFile(path.join(out, 'assets', 'hii-hero-v4-1080p.mp4'), heroBuffer);

const home = `${head({ title: canonical.name, description: canonical.description, path: '/' })}
<body class="hii-interface-home">
  <a class="skip-link" href="#hii-interface">Skip to Hii interface</a>
  <main id="hii-interface">
    ${heroInterface()}
  </main>
  <script src="/js/hii-hero.js"></script>
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
<body class="utility-page"><a class="skip-link" href="#main">Skip to content</a><a class="return-to-hii" href="/">Return to Hii</a><main id="main"><section class="utility-hero section-shell"><p class="section-kicker">404</p><h1>This path has moved.</h1><p class="portal-lede">Return to the Hii interface and choose a pathway.</p></section></main>${footer()}<script src="/js/main.js"></script></body></html>\n`);

console.log(`Built circle-driven Hii interface with ${pathways.length} pathway worlds.`);
