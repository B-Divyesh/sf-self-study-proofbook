# Independent verification 8 — PASS

- **Candidate:** `3ce39632021aafed8336b500a77d2e89abc06c80`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Browser:** Playwright 1.58.2 bundled Chromium

## Verdict

**PASS — release accepted.** Fresh testing shows the live deployment is the candidate build and fulfills the brief's private, local-first problem/proof ledger job. The earlier reported deployment-only concern is not reproducible.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Mandatory first gates

`.factory/claims.json` exists and contains 17 claims. After a fresh `npm ci`, every exact listed `npm test -- --grep @claim:<id>` command was run separately against the product's demo entry point. All passed. The full suite reran the same tagged cases and passed 33/33.

| Claim | Result |
| --- | --- |
| privacy-local | PASS |
| offline-reload | PASS |
| csv-export | PASS |
| revision-history | PASS |
| print-index | PASS |
| encrypted-backup | PASS |
| json-revisions | PASS |
| demo-isolation | PASS |
| archive-tools-included | PASS |
| cited-attempt | PASS |
| topics-and-goals | PASS |
| attempt-timer | PASS |
| evidence-status | PASS |
| json-complete-archive | PASS |
| no-credential-service | PASS |
| saved-data-recovery | PASS |
| safe-import-validation | PASS |

Cold first-read, from a brand-new live browser context:

- **What it does:** “Record problems you can solve.”
- **For whom:** “For serious math and CS learners who need evidence beyond course badges.”
- **What to click first:** “Try it with sample data” — “Opens a separate sample ledger.”

This passes on desktop and 390 px mobile. One click opens the realistic, isolated three-attempt demo and its persistent “Demo — sample data, nothing is saved to your proofbook” banner. Evidence: [`live-cold-desktop.png`](verification-assets-8/live-cold-desktop.png), [`live-cold-mobile-390.png`](verification-assets-8/live-cold-mobile-390.png), and [`live-flow.json`](verification-assets-8/live-flow.json).

## Clean checkout and product exercise

- `npm ci`: PASS; 24 packages installed, 0 vulnerabilities reported.
- `npm test`: PASS; **33/33** Playwright tests in 1.3 minutes.
- `npm run build`: PASS (`tsc --noEmit && vite build`), creating `dist/`. No lint script exists.
- Initial JavaScript: 43,430 bytes / 13.49 kB gzip; CSS: 18,693 bytes / 4.88 kB gzip; local font: 22,496 bytes; mobile hero: 18,802 bytes. All are within static/PWA budgets.

Fresh live exercise used the real `/app` ledger and demo sandbox. It rejected a whitespace-only topic with `aria-invalid=true` and a clear error; the demo saved a Markdown revision across reload, exported a 4-row CSV (header plus three attempts), and produced a three-row print index with the non-credential notice. The suite additionally covered source citations, timers, confidence, revision history, JSON/CSV/encrypted export, malformed imports, damaged-data recovery, exact limits, and restore behavior.

## Accessibility, privacy, PWA, and delivery

- Live axe scans found **zero violations** (therefore zero serious/critical) on `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the 404.
- At 390 px there is no horizontal overflow. Keyboard Tab reaches the skip link with a visible `rgb(185, 242, 39) solid 3px` outline; Enter focuses `main`. Reduced motion sets transitions to `none` and scroll behavior to `auto`.
- The live demo is service-worker controlled with cache `proofbook-9cf81f50d718`; after first visit it reloaded offline with its sample records. A controlled local two-version worker check showed “An update is ready. Reload to use it.” when a new worker became available.
- The live demo flow made only same-origin requests; no analytics, trackers, CDN, AI, auth, billing, or credential service request was observed. Browser console/page errors: none.
- HTML uses 30-second revalidation; hashed JS uses `public, max-age=31536000, immutable`. Responses have a self-only CSP, `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer policy, and a camera/microphone/geolocation-denying permissions policy. All discovered internal links return 200; the designed unknown route returns 404.

Evidence: [`live-accessibility-pwa.json`](verification-assets-8/live-accessibility-pwa.json), [`live-headers-links.json`](verification-assets-8/live-headers-links.json), and [`local-sw-update.json`](verification-assets-8/local-sw-update.json).

Lighthouse mobile on the live landing page recorded Performance **98**, Accessibility **100**, Best Practices **100**, and SEO **100**; FCP 1.06 s, LCP 1.36 s, CLS 0.046. The final screenshot collection crashed after the LHR was written, but the LHR has no run warnings and contains the complete category scores and metrics. Evidence: [`lighthouse-live-home.json`](verification-assets-8/lighthouse-live-home.json).

## Deployment identity and applicability

The candidate was at the requested SHA before testing. All 29 user-deployable files in a fresh candidate build (including HTML routes, JS, CSS, worker, manifest, fonts, images, icons, source map, robots, and sitemap) match the live bytes exactly. The sole non-public item, `staticwebapp.config.json`, is deployment configuration and correctly returns the designed 404 when requested as a public asset. Evidence: [`deployment-identity.json`](verification-assets-8/deployment-identity.json).

This is a browser-only static PWA with IndexedDB storage. It has no server API, product unlock endpoint, sign-in, package/CLI interface, or backend health / concurrency boundary. API rate-limit/429/`Retry-After`, Entra tenant, and clean consumer package checks are therefore not applicable.
