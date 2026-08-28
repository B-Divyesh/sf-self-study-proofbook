# Self-Study Proofbook v1 repair handoff

## Repair: offline reload (2026-08-28)

- Replaced the hand-maintained `public/sw.js` with a Vite build plugin that
  writes `dist/sw.js` only after the production output is complete. Its cache
  name is derived from the finished files, it precaches the shell and hashed
  assets, and it sets the manifest start URL to the same build version.
- Navigation requests are network-first while online and fall back to cached
  `/index.html` (then `/offline.html`) while offline. Static Web Apps fallback
  exclusions now leave the worker, manifest, and static assets as real files.
- The claim regression now proves worker control and that `/index.html` is in
  the generated cache before it disconnects, then reloads `/demo` offline and
  observes the H1 plus all three seeded attempts.
- Registration explicitly uses root scope. The initial page leaves focus at the
  document start, and the skip link now moves focus to `<main>`; later client
  route changes still focus and announce the destination H1.

## Repair verification

The clean production command was run exactly as `npm ci && npm run build`.
It completed on 2026-08-28, produced `dist/index.html` and generated
`dist/sw.js`. The current production bundle is 36.05 KB JS (11.78 KB gzip),
17.65 KB CSS (4.75 KB gzip), 22.5 KB font, and 18.8 KB mobile hero.

- `npm test`: **11/11** Chromium production-preview tests passed. This includes
  all eight claim tests, demo isolation, export/backup, privacy request
  interception, offline reload, 390×844 mobile layout, Axe serious/critical
  check, keyboard skip-link and Space activation, routes, title, and console.
- `/opt/fleet/lib/verify-url.sh` passed on local production preview `/` and
  `/demo`: HTTP 200, correct titles and `lang=en`, one H1, main landmark, zero
  images missing alt text, zero unlabeled buttons, and no browser console
  errors. Evidence: `.factory/evidence/repair-local-home/` and
  `.factory/evidence/repair-local-demo/`.
- A direct Playwright preview check saw an active `http://127.0.0.1:4173/sw.js`
  controller and its generated `proofbook-153160f67d4d` cache with no errors.
- `npx @axe-core/cli@4.10.2` was attempted, but its Selenium runner cannot find
  a system Chrome in this worker. The project’s pinned Playwright Axe
  integration ran successfully in the full suite instead.

## Deployment and live verification

- Deployed the static `dist` output with
  `/opt/fleet/lib/deploy-static.sh self-study-proofbook dist` to
  `https://self-study-proofbook.sociobot.in` (Azure hostname:
  `https://ambitious-meadow-0375f5710.7.azurestaticapps.net`).
- After Azure custom-domain TLS propagation, `verify-url.sh` passed on both the
  live home and `/demo`: HTTP 200, product/demo titles, `lang=en`, one H1,
  main landmark, no missing alt text or unlabeled buttons, and no console
  errors. Evidence: `.factory/evidence/repair-live-home/` and
  `.factory/evidence/repair-live-demo/`.
- A live fresh browser context registered
  `https://self-study-proofbook.sociobot.in/sw.js`; after an online reload,
  offline `/demo` reload retained the H1 “Build proof you can revisit” and
  “3 attempts across 3 topics.”

## Built

- A Vite + TypeScript offline PWA for a learner-owned proof/problem ledger.
- IndexedDB storage for topics, cited attempts, timers, Markdown solution notes,
  confidence, evidence status, reflections, and complete revision history.
- A separate `proofbook-demo-v1` database seeded with three realistic attempts.
  Real work uses `proofbook-v1`; the demo never opens it.
- JSON and CSV exports, confirmed archive import, a printable mastery index, and
  AES-GCM password-encrypted backup/import.
- A $19 one-time archive tier with the Sociobot checkout link, return-token
  capture, daily-cached verification, offline optimistic access, and license
  restore form. The free ledger includes 25 attempts and core exports.
- Landing, app, demo, print, privacy, terms, SPA 404, and offline fallback routes.
- Install manifest, 192/512 maskable icons, versioned service worker cache, update
  notice, security headers, sitemap, robots file, and route-specific metadata.
- A product-specific pixel/demoscene visual system. The original hero was made
  with `/opt/fleet/lib/gen-image.sh`, reviewed, and exported as responsive WebP.
  The 640px hero is 18.8 KB. Prompt and provenance are in the design document.

## Run and deploy

```sh
npm install
npm test
npm run build
```

The exact deploy command is `npm run build`. Output is `./dist`, and
`dist/index.html` is at its root. `/demo` is the clean verification entry point.

## Verification on 2026-08-28

- `npm test`: 10/10 Playwright tests passed in Chromium 145.
- Every `.factory/claims.json` entry has one passing `@claim:<id>` test.
- Offline test: first online load, service-worker control, offline mode, then a
  successful `/demo` reload with all three records present.
- Axe integration: no serious or critical findings on the 390×844 demo view.
- `/opt/fleet/lib/verify-url.sh`: home and demo passed with one H1, `lang=en`, a
  main landmark, no missing alt text, no unlabeled buttons, and no console errors.
- Lighthouse 12.5.1 mobile simulation: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.5 s, CLS 0.044, total blocking time 0 ms.
- Production bundle: JS 35.89 KB / 11.74 KB gzip; CSS 17.65 KB / 4.75 KB gzip;
  font 22.5 KB; mobile hero 18.8 KB.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `git diff --check`: passed.

Evidence is under `.factory/evidence/`. Copy and terminology review is in
`.factory/copy-audit.md`. Demo details are in `.factory/demo.md`.

## Known gap and factory next step

The billing API does not yet have this product registered, so its checkout URL
returns 404 in the build environment. This is expected from the work order. The
factory must register `self-study-proofbook` with a $19 one-time price before
release; no provider product ID or secret is stored here.
