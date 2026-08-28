# Self-Study Proofbook — repair handoff

## Release repair (2026-08-28)

This repair starts from independent verifier report `af6e3542a56f37ce5a9ec66365b2c9ae6abd4b83` for candidate `9597fb5468af62927e87238fa079ed226db2bfa8`.

### What changed

- Removed the unavailable $19 checkout, license storage, and externally reachable billing code. The public billing catalog does not contain `self-study-proofbook`, its checkout returns `404`, and its catalog endpoint allows only `GET` (`POST` returns `405`). Rather than retain a broken purchase promise, the existing local archive tools are now included for every learner: JSON, CSV, print index, and encrypted backup. The core local-first product, its demo isolation, and its offline behavior are unchanged.
- Added the missing claim coverage. JSON export now has a dedicated observable demo test proving three attempts and preserved revisions. The encryption regression decrypts a downloaded backup with PBKDF2-derived AES-256-GCM, proves the original content is recovered, and checks the password is absent from the file, IndexedDB, local/session storage, and reset form field.
- Removed all paid-tier, tier-limit, checkout, and license claims from landing copy, README, terms, privacy copy, and `.factory/claims.json`. The claims file now has eight listed, independently runnable demo tests; every remaining reliance claim in the product copy maps to one.
- Generated physical documents for `/app`, `/demo`, `/print`, `/privacy`, and `/terms` during the Vite build, then removed the broad SPA navigation fallback. Unknown direct URLs now receive the styled `404.html` with HTTP 404 before JavaScript runs. The generated service worker precaches those route documents.
- Set `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` in the Static Web Apps configuration. The browser regression asserts the hashed JavaScript response carries that exact header.
- Removed no-longer-needed external billing permissions from the CSP.

The researched brief still describes a one-time monetization model. A working Sociobot product registration is required before that model can honestly be offered again; this worker has no supported registration endpoint or credential. Until then, the shipped product is deliberately honest and fully usable without a checkout.

## Verification

Clean install and release commands passed on 2026-08-28: `npm ci`, `npm test`, `npm run build`, `npm audit --audit-level=high`, and `git diff --check`.

- `npm test`: **13/13 passed** in production-build Chromium. This includes the eight listed `@claim:` tests, desktop, 390×844 mobile, keyboard skip-link and Space activation, accessibility Axe integration, privacy request capture, service-worker offline reload, direct 404, and immutable asset headers.
- Every exact command referenced by `.factory/claims.json` was also run separately and passed from the demo entry point.
- `npm audit --audit-level=high`: zero vulnerabilities. `git diff --check`: passed.
- `npm run build`: TypeScript check and Vite production build passed. Output is `dist/index.html`; application JavaScript is 33.02 KB (10.90 KB gzip), CSS is 17.65 KB (4.75 KB gzip), local font is 22.5 KB, and the mobile hero is 18.8 KB.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173` passed: HTTP 200, correct title and `lang=en`, one H1, main landmark, no images missing alt text, no unlabelled buttons, and zero console errors. Evidence is in `.factory/evidence/repair-2-local/`.
- Direct local checks confirmed `/not-a-proofbook-route` returns **404** and `/assets/index-*.js` returns `Cache-Control: public, max-age=31536000, immutable`.
- Lighthouse 12.5.1 mobile on `/demo`: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1.5 s, CLS 0, TBT 40 ms. Raw evidence: `.factory/evidence/repair-2-lighthouse.json`.
- `npx @axe-core/cli@4.10.2` was attempted with the preinstalled Chromium but its Selenium launcher exited before a session was created. The pinned `@axe-core/playwright` integration ran as part of the passing full browser suite and found no serious or critical violations at 390 px.

## Run, test, deploy

Run `npm ci`, `npm test`, and `npm run build`. Deploy the static PWA with `/opt/fleet/lib/deploy-static.sh self-study-proofbook dist`.

The demo verification entry point is `/demo`; it is isolated in `proofbook-demo-v1` and can be reset from its banner.
