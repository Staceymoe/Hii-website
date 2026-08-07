# Hii shared world contract

Status: checkpoint contract after the approved Relationships reference implementation. Page composition and component variants remain provisional until Relationships and Understand are reviewed together.

## Invariants

- The protected front door remains the root experience. Its approved HTML, CSS, media, timing, geometry, film behavior, and interaction are checksum-controlled. World routing and the explicit static-return state are the only permitted script seams.
- Every world uses one canonical record in `src/_data/worlds.js`, one canonical route, the shared Eleventy layout, shared header/footer, and the static `/?return=hii` return path.
- Every page supplies a unique title, description, canonical URL, Open Graph metadata, document language, one `h1`, a skip link, a `main` landmark, visible focus, keyboard-native controls, and reduced-motion support.
- Manrope, the deep near-black field, warm ivory, restrained champagne, established spacing scale, and the approved focus treatment are brand-level rules.
- Artifacts live once in `src/_data/library.js`. Each artifact has a stable id, type, structured status with a human-readable display value, summary, canonical Hii href, world associations, and provenance. Worlds reference records; they do not copy them.
- Evidence labels live in shared structured data. Status, maturity, review, publication, and evidence language must remain visible and must not be inferred or inflated.
- Published worlds appear in shared world navigation. Unbuilt worlds are not linked as if complete. Legacy destinations remain available until replacements contain migrated and approved content.
- Builds must verify protected-front-door integrity, direct versus static-return behavior, metadata, headings, internal links, sitemap inclusion, world-route scope, reduced motion, and the absence of active production redirects.

## Provisional composition system

- Section order, number of pathways, diagram use, card density, light/dark section rhythm, and page-specific storytelling are not frozen after one world.
- Existing components should be reused when their semantics fit. A new variant requires a real content or interaction need demonstrated by a world.
- Relationships establishes the relationship map, three-pathway portal, editorial rows, artifact treatment, literacy section, and research boundary.
- Understand pressure-tests the system with public-orientation cards, an accessible disclosure list, evidence labels, a five-role pathway selector, and cross-world artifact reuse.
- After Understand review, the two approved worlds together define the stronger contract for the remaining five worlds.

## Review gate for each additional world

Before another world becomes a pattern source, verify source provenance, desktop and mobile composition, keyboard navigation, touch targets, metadata, internal and cross-world links, static Return to Hii behavior, front-door checksums, and a branch-only preview. Production and `main` remain untouched until explicit release approval.
