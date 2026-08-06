import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const required = [
  '_site/index.html',
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
const source = await readFile(path.join(root, 'index.html'), 'utf8');
const match = source.match(/<section class="observatory-hero"[\s\S]*?<\/section>/);
if (!match || !generated.includes(match[0])) throw new Error('Protected hero changed or was omitted from generated homepage.');
if ((generated.match(/class="pathway-card"/g) || []).length !== 7) throw new Error('Homepage must contain exactly seven pathway cards.');

console.log('Build checks passed. Protected hero preserved and required routes generated.');
