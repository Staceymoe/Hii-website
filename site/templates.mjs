import { canonical, pathways } from './content.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);

export function head({ title, description, path = '/' }) {
  const pageTitle = title === canonical.name ? `${canonical.name} | ${canonical.fullName}` : `${title} | ${canonical.name}`;
  const canonicalUrl = `${canonical.url}${path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="theme-color" content="#020305" />
  <link rel="canonical" href="${esc(canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(pageTitle)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonicalUrl)}" />
  <meta property="og:site_name" content="Hii" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(pageTitle)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="/css/styles.css" />
  <link rel="stylesheet" href="/css/mobile-polish.css" />
  <link rel="stylesheet" href="/css/site-expansion.css" />
  <link rel="stylesheet" href="/css/relational-system.css" />
  <link rel="stylesheet" href="/css/post-hero.css" />
</head>`;
}

export function heroInterface() {
  const byShort = short => pathways.find(pathway => pathway.short === short);
  const node = (short, position) => {
    const pathway = byShort(short);
    return `<a class="hero-node hero-node--${position}" data-hero-node href="/${pathway.slug}/" tabindex="-1" aria-label="${esc(pathway.short)}: ${esc(pathway.title)}"><span class="sr-only">${esc(pathway.short)}: ${esc(pathway.title)}</span></a>`;
  };

  return `<section class="motion-hero" aria-label="Hii interactive observatory" data-motion-hero>
    <div class="motion-hero__stage">
      <video class="motion-hero__video" data-motion-video autoplay muted playsinline preload="auto" aria-label="Hii observatory interface opening animation">
        <source src="/assets/hii-hero-v4-1080p.mp4" type="video/mp4" />
      </video>

      <nav class="hero-hit-map" data-hero-map aria-label="Choose a Hii pathway">
        ${node('Relate', 'relate')}
        ${node('Adapt', 'adapt')}
        ${node('Care', 'care')}
        ${node('Prepare', 'prepare')}
        ${node('Govern', 'govern')}
        ${node('Understand', 'understand')}
        ${node('Study', 'study')}
        <button class="hero-node hero-node--film" data-hero-node data-open-film type="button" tabindex="-1" aria-label="Play the Hii film"><span class="sr-only">Play the Hii film</span></button>
      </nav>

      <p class="motion-hero__hint" data-hero-hint aria-live="polite">The observatory is opening.</p>
    </div>
  </section>

  <div class="film-dialog" data-film-dialog hidden>
    <div class="film-dialog__backdrop" data-close-film></div>
    <section class="film-dialog__panel" role="dialog" aria-modal="true" aria-label="Hii film">
      <button class="film-dialog__close" type="button" data-close-film aria-label="Close Hii film">Return to Hii</button>
      <video class="film-dialog__video" data-film-video controls playsinline preload="metadata" poster="/hii-film-poster.jpg">
        <source src="/hii-film-1080p.mp4" type="video/mp4" media="(min-width: 900px)" />
        <source src="/hii-film-720p.mp4" type="video/mp4" />
      </video>
    </section>
  </div>`;
}

export function header() {
  const links = pathways.map(pathway => `<a href="/${pathway.slug}/">${esc(pathway.short)}</a>`).join('\n          ');
  return `<header class="site-header post-hero-header" data-site-header>
    <a class="brand" href="/" aria-label="Hii home">
      <span class="brand-mark">Hii</span>
      <span class="brand-name">Hybrid Intelligence<br />Institute</span>
    </a>
    <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-nav-toggle><span></span><span></span></button>
    <nav class="site-nav pathway-nav" aria-label="Seven Hii pathways" data-site-nav>
      ${links}
      <a class="nav-utility" href="/about/">About</a>
      <a class="nav-utility" href="/work-with-hii/">Work with Hii</a>
    </nav>
  </header>`;
}

export function footer() {
  return `<footer class="site-footer post-hero-footer">
    <div class="footer-inner">
      <div><p class="footer-mark">Hii</p><p>${esc(canonical.mission)}</p></div>
      <nav aria-label="Utility navigation">
        <a href="/about/">About</a><a href="/work-with-hii/">Work with Hii</a><a href="/updates/">Updates</a><a href="/press/">Press</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/accessibility/">Accessibility</a>
      </nav>
    </div>
    <p class="footer-note">${esc(canonical.tagline)}</p>
  </footer>`;
}

export function shell({ title, description, path, main, bodyClass = '', showHeader = true, showReturn = false }) {
  return `${head({ title, description, path })}
<body class="${esc(bodyClass)}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${showReturn ? '<a class="return-to-hii" href="/">Return to Hii</a>' : ''}
  ${showHeader ? header() : ''}
  <main id="main">${main}</main>
  ${footer()}
  <script src="/js/main.js"></script>
</body>
</html>\n`;
}

export function portalPage(pathway) {
  const themes = pathway.themes.map(item => `<li>${esc(item)}</li>`).join('');
  const links = pathway.links.map(link => `<a class="artifact-link" href="${esc(link.href)}">${esc(link.label)} <span aria-hidden="true">→</span></a>`).join('');
  return shell({
    title: pathway.title,
    description: pathway.summary,
    path: `/${pathway.slug}/`,
    bodyClass: `portal-page portal-page--${esc(pathway.slug)}`,
    showHeader: false,
    showReturn: true,
    main: `<section class="portal-hero section-shell">
      <p class="section-kicker">${esc(pathway.short)}</p>
      <h1>${esc(pathway.title)}</h1>
      <p class="portal-lede">${esc(pathway.summary)}</p>
    </section>
    <section class="portal-question section-shell" aria-labelledby="central-question">
      <p class="section-kicker">Central question</p>
      <h2 id="central-question">${esc(pathway.question)}</h2>
      <p>${esc(pathway.intro)}</p>
    </section>
    <section class="portal-grid section-shell">
      <div><p class="section-kicker">What this pathway examines</p><ul class="theme-list">${themes}</ul></div>
      <aside class="boundary-card"><p class="section-kicker">Boundary</p><p>${esc(pathway.boundary)}</p></aside>
    </section>
    <section class="portal-links section-shell"><p class="section-kicker">Start with the existing work</p><div class="artifact-links">${links}</div></section>`
  });
}

export function utilityPage(page) {
  const sections = page.sections.map(([heading, text]) => `<section class="utility-section"><h2>${esc(heading)}</h2><p>${esc(text)}</p></section>`).join('');
  return shell({
    title: page.title,
    description: page.intro,
    path: `/${page.slug}/`,
    bodyClass: 'utility-page',
    main: `<section class="utility-hero section-shell">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Hii</a><span>/</span><span>${esc(page.title)}</span></nav>
      <p class="section-kicker">${esc(page.eyebrow)}</p>
      <h1>${esc(page.title)}</h1>
      <p class="portal-lede">${esc(page.intro)}</p>
    </section><div class="utility-sections section-shell">${sections}</div>`
  });
}
