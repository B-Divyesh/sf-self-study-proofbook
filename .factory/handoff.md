# Self-Study Proofbook v1 handoff

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
