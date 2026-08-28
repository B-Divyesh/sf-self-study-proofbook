# Self-Study Proofbook — repair handoff

## Keyboard focus repair (2026-08-28)

Repair commit: `fa9e529` (`fix: preserve skip link as initial focus stop`), based on candidate `7a29bd400b1fd18754eeaad4431530f717143c61`.

### What changed

- Initial document rendering now explicitly releases any restored or accidental element focus after the app shell is drawn. A fresh navigation therefore starts at the document focus origin, making the shell's skip link the first Tab stop. Client-side navigation still moves focus to the new H1, and activating the skip link still moves focus to `main`.
- Strengthened the existing keyboard browser regression without changing suite size: after `page.goto('/demo')`, it first asserts `document.body` is active, then asserts the first Tab focuses `.skip-link`, Enter focuses `main`, and Space still saves a revision. This directly covers the reported first-Tab regression.
- Preserved the prior local-first PWA, offline reload, export, encryption, demo-isolation, privacy, static 404, and immutable-asset repairs.

### Verification

Clean release sequence passed on 2026-08-28: `npm ci`, `npm test`, `npm run build`, `npm audit --audit-level=high`, and `git diff --check`.

- `npm test`: **13/13 passed** against a production build in Chromium. It covers all eight `@claim:` entries, privacy request capture, offline service-worker reload, CSV/JSON/encrypted export, revision history, demo isolation, desktop routes, 390×844 mobile accessibility and overflow, keyboard navigation, direct 404, and immutable assets.
- The focused keyboard regression passed separately before the full suite.
- `npm run build` passed (`tsc --noEmit && vite build`) and wrote `dist/`. The application JavaScript is **33.12 KB** (10.94 KB gzip); CSS is **17.65 KB** (4.75 KB gzip).
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/evidence/repair-3-local` passed: HTTP 200, title, `lang=en`, one H1, main landmark, image alt text, labelled buttons, and no console errors. The local visual evidence is in `.factory/evidence/repair-3-local/`.
- The pinned Playwright Axe integration found zero serious or critical violations in the full suite. The standalone `npx @axe-core/cli@4.10.2` Selenium launcher could not create a session with the supplied Chromium; the equivalent live Playwright Axe check passed with zero serious/critical findings.
- Lighthouse 13.4.1 mobile report for `/demo` recorded Performance **100**, Accessibility **100**, Best Practices **100**, and SEO **100**; FCP 1.3 s, LCP 1.5 s, TBT 40 ms, CLS 0. Chromium crashed while Lighthouse was closing after it wrote the report, so this is retained as tooling evidence rather than a clean Lighthouse process exit. Raw report: `.factory/evidence/repair-3-lighthouse.json`.

### Deployment and live identity

- Deployed the committed `dist/` with `/opt/fleet/lib/deploy-static.sh self-study-proofbook dist`. Azure deployment **`8a380ffc-661d-42df-a730-cdce8f06cb84`** succeeded at `https://self-study-proofbook.sociobot.in`.
- `/opt/fleet/lib/verify-url.sh https://self-study-proofbook.sociobot.in .factory/evidence/repair-3-live` passed with zero console errors. Desktop and mobile screenshots plus the verification JSON are in `.factory/evidence/repair-3-live/`.
- A fresh live Chromium check confirmed title `Demo — Self-Study Proofbook`, document-body initial focus, first-Tab skip-link focus, Enter-to-main focus, zero mobile horizontal overflow, zero serious/critical Axe findings, service-worker offline reload to `Build proof you can revisit`, HTTP 404 for an unknown route, and `Cache-Control: public, max-age=31536000, immutable` on the deployed hashed JavaScript asset.

### Known gap

The standalone Axe CLI cannot launch a Selenium session in this container. Accessibility is covered by the pinned Playwright Axe integration locally and a separate live Playwright Axe scan; no product defect remains from this tooling limitation.

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

## Deployment and live checks

- Deployed the committed `dist/` output with `/opt/fleet/lib/deploy-static.sh self-study-proofbook dist`. Azure deployment `d620430f-84cb-4dbb-bb17-fad17a9aefe0` completed successfully at `https://self-study-proofbook.sociobot.in`.
- Live `verify-url.sh` passed with the same title, language, H1, main, alt-text, labelled-button, and zero-console-error checks. Evidence is in `.factory/evidence/repair-2-live/`.
- Live response checks confirm `/not-a-proofbook-route` is HTTP **404** and the live hashed JavaScript asset is HTTP 200 with `Cache-Control: public, max-age=31536000, immutable`.
- Fresh live Chromium checks passed on desktop and at 390×844 reduced-motion mobile: desktop H1 was correct with no console errors; mobile had zero horizontal overflow, skip-link focus moved to main, and `/demo` reloaded offline under service-worker control with its expected H1. The landing HTML contains no checkout, $19, buy, or restore-license copy.

## Run, test, deploy

Run `npm ci`, `npm test`, and `npm run build`. Deploy the static PWA with `/opt/fleet/lib/deploy-static.sh self-study-proofbook dist`.

The demo verification entry point is `/demo`; it is isolated in `proofbook-demo-v1` and can be reset from its banner.
