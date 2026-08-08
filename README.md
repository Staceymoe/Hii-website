# Hii website

The active build uses Eleventy behind the approved Hii front door. The front door remains an isolated, checksum-protected artifact; world and utility pages are generated from shared layouts, components, and structured data.

## Protected architecture

```text
approved front door (/)
  -> narrow destination routing seam
  -> shared Eleventy world and utility system
```

The approved source is in `restart-front-door/`. Do not change its HTML, CSS, media, timing, geometry, film behavior, or front-door interactions. The only authorized JavaScript differences are the narrow Relate and Understand destination routes plus the explicit static-return state. `scripts/verify-front-door.mjs` enforces that boundary.

## Current implementation scope

- `/` — checksum-locked approved front door
- `/relationships/` — approved consolidated Relate world
- `/relationships/the-relationship-as-unit-of-analysis/` — Relate paper overview; final public status and PDF pending
- `/relationships/research-inquiry/` — Relate inquiry form foundation; submissions disabled until the approved privacy notice is connected
- `/understand/` — frozen pending the next page-by-page review
- Existing `.html` pages — retained as migration sources and temporary destinations
- Other five worlds — intentionally not generated
- Legacy redirects — intentionally not configured

## Local development

Requirements: Node.js 22+ and pnpm.

The approved media is downloaded and verified by the protected staging script:

```bash
bash scripts/build-hii-front-door-restart.sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm serve
```

The generated site is written to `_site/`. Netlify uses the same protected staging step before the Eleventy build.

## Content system

- `src/_data/site.js` — canonical institutional language and shared utility links
- `src/_data/worlds.js` — world-level content; currently Relate only
- `src/_data/library.js` — canonical artifact, program, and update records
- `src/_includes/components/` — shared page components
- `src/_includes/layouts/` — shared layouts

Artifacts, programs, and updates should each have one canonical record in `library.js`, with world associations recorded as data. Do not duplicate records to place the same material in multiple worlds.

## Protection and checks

`pnpm test` verifies:

- approved front-door HTML, CSS, JavaScript seam, and media checksums
- built front-door byte identity
- `/relationships/` metadata and structural landmarks
- internal links
- Manrope and reduced-motion support
- sitemap inclusion
- absence of additional world routes and Netlify redirects

The GitHub workflow runs the protected media build, Eleventy build, and checks on the active branch and pull request. Production deployment, merges, and changes to `main` are outside this workflow.
