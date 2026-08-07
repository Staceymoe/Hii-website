import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const required = [
  '_site/index.html',
  '_site/assets/hii-hero-v4-1080p.mp4',
  '_site/relationships/index.html',
  '_site/adaptation/index.html',
  '_site/mental-health/index.html',
  '_site/institutional-readiness/index.html',
  '_site/governance/index.html',
  '_site/understand/index.html',
  '_site/research/index.html',
  '_site/about/index.html',
  '_site/work-with-hii/index.html',
  '_site/accessibility/index.html',
  '_site/privacy/index.html',
  '_site/404.html'
];

for (const file of required) await access(path.join(root, file));

const generated = await readFile(path.join(root, '_site/index.html'), 'utf8');
if (!generated.includes('data-motion-hero')) throw new Error('New Hii motion hero is missing from the homepage.');
if (!generated.includes('/assets/hii-hero-v4-1080p.mp4')) throw new Error('New Hii motion hero video is not connected.');
if ((generated.match(/data-hero-node/g) || []).length !== 8) throw new Error('Hii interface must contain exactly eight clickable circles.');
if (generated.includes('class="pathway-grid"')) throw new Error('Homepage must remain the circle interface, not a scroll-first pathway grid.');

const heroSize = (await stat(path.join(root, '_site/assets/hii-hero-v4-1080p.mp4'))).size;
if (heroSize < 500000) throw new Error('Reconstructed Hii motion hero media is incomplete.');

for (const route of ['relationships', 'adaptation', 'mental-health', 'institutional-readiness', 'governance', 'understand', 'research']) {
  const page = await readFile(path.join(root, '_site', route, 'index.html'), 'utf8');
  if (!page.includes('class="return-to-hii"')) throw new Error(`${route} is missing Return to Hii.`);
}

console.log('Build checks passed: new motion hero, 8 circles, film entry, and Return to Hii are wired.');
