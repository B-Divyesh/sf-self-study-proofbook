# Repair 6 handoff

- **Verifier report:** `0fa0c2b82a0a0d4777fecb6c36f35868d9d4bdfd` / `.factory/verification-6.md`
- **Failed candidate:** `4a4d7f46956626cba4e65d615c88ab090543b0a2`
- **Repair commit:** `e2ba6a0` (`fix: name proofbook modal dialogs`)
- **Artifact:** static local-first PWA; build output remains `dist/`
- **Date:** 2026-08-29 UTC

## Reproduction and repair

The single release blocker, V-6-1, was reproduced before the product code was
changed. A new Playwright regression opened **Add topic** and failed to find a
visible dialog named **Add a topic**. The verifier's root cause was confirmed:
all three native `<dialog>` elements had visible headings but no accessible-name
relationship.

Each dialog now has `aria-labelledby` pointing to its unique visible heading:

- `topic-dialog` → `topic-dialog-title` (**Add a topic**)
- `attempt-dialog` → `attempt-dialog-title` (**Record an attempt**)
- `password-dialog` → `password-dialog-title` (**Password-protect this backup**)

`tests/proofbook.spec.ts` opens every modal and asserts its exact accessible
role/name before closing it with Escape. Existing password-field selectors were
made exact because the correctly named password dialog also contains the word
“Password.” No product copy, storage format, feature, route, or visual behavior
changed.

## Local verification

- `npm ci` — passed; 24 packages installed and 0 vulnerabilities.
- `npm audit --audit-level=high` — passed; 0 vulnerabilities.
- All 15 exact commands in `.factory/claims.json` — passed separately.
- `npm test` — passed, **33/33** Playwright tests.
- `npm run build` — passed; this includes `tsc --noEmit` and produced `dist/`.
  There is no separate lint configuration.
- Package/consumer and backend/API checks do not apply to this static browser-only
  PWA.
- Output: JS 43.41 kB / 13.49 kB gzip; CSS 18.69 kB / 4.88 kB gzip;
  font 22.50 kB; mobile hero 18.80 kB.
- The supplied `verify-url.sh` passed local `/` and `/demo` at desktop and
  390×844 with one H1, `lang=en`, a main landmark, complete alt text, labelled
  buttons, and no console/page errors. Evidence is under
  `.factory/evidence/repair-6-local-*`.
- Local Lighthouse 13.4.1: Performance **99**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1.3 s, LCP 1.9 s, TBT 10 ms, CLS 0.046.
  Evidence: `.factory/evidence/repair-6-lighthouse-local.json`.
- A controlled two-worker build check changed the active cache from
  `proofbook-1d7ab3f23bd1` to `proofbook-update-probe`, removed the old cache,
  displayed **An update is ready. Reload to use it.**, and reloaded the full
  three-attempt demo offline. The generated `dist/sw.js` was restored afterward.

## Accessibility, browser, privacy, and offline evidence

- Chromium's full accessibility tree on live `/demo` now reports all three
  dialogs as `role=dialog`, `modal=true`, with the exact names above. Initial
  focus is **Close dialog**; Escape closes and returns focus to each opener.
  Evidence: `.factory/evidence/repair-6-dialog-accessibility.json`.
- Playwright Axe 4.10.2 reports zero violations, including zero serious or
  critical findings, on `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`,
  `/terms`, and the designed 404 at 390 px.
- At 390×844, all visible controls are at least 44×44 CSS pixels, every route
  has zero horizontal overflow, and 200% text has zero horizontal overflow.
  The first Tab reaches the visible skip link and Enter focuses `main`.
  Reduced motion has no active animation. Evidence:
  `.factory/evidence/repair-6-live-mobile-audit.json`.
- The live edit-and-save smoke flow made 4 requests, all same-origin, with no
  console or page errors. The full privacy, archive, and print flows also pass
  their claim tests.
- A fresh live worker controls `/demo` with cache `proofbook-1d7ab3f23bd1`.
  With browser networking disabled, reload retains the demo banner and all
  three sample attempts.

## Deployment and live identity

Commit `e2ba6a0` was pushed to `origin/main`. `dist/` was deployed to the
production environment with `/opt/fleet/lib/deploy-static.sh
self-study-proofbook dist` (deployment `1b06339e-debc-4cf6-9fc7-5f9fc4455190`).
Azure Static Web App `sf-self-study-proofbook` remains in `centralus`; the
default hostname is `ambitious-meadow-0375f5710.7.azurestaticapps.net` and the
custom domain is <https://self-study-proofbook.sociobot.in>.

- Live `verify-url.sh` passes `/` and `/demo`; desktop/mobile screenshots and
  reports are under `.factory/evidence/repair-6-live-*`.
- Live Lighthouse 13.4.1: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1.1 s, LCP 1.4 s, TBT 10 ms, CLS 0.046,
  transfer 89 KiB. Evidence:
  `.factory/evidence/repair-6-lighthouse-live.json`.
- Local `dist/` and live deployment match byte-for-byte:
  - `index.html`: `3fd66cd51ac8414e4dbd8462ac7769175ee2c2eb0e2f0baa11383b21b051fee4`
  - `index-B-LXHcfq.js`: `5278868f49822cf0b2387967656f06ca02ac529ba87318b9a8af9c8345bc331a`
  - `index-CTvWy7GA.css`: `cdb831f466decb9a12d86f2df496fdc168c657838b56bc7c3a74e3a3adfa5b3d`
  - `sw.js`: `ba840b486fa4b36d09229c2d583d12dfeec4fead08e3dd5eff4c0fe94f253058`
  - `manifest.webmanifest`: `3b2dbb51155a2d2730f40e0f33270f4e67fb260154b408fb5221c9b8230dc45f`
- HTML, manifest, and worker responses use 30-second revalidation. Hashed
  assets use one-year immutable caching. HSTS, `nosniff`, strict referrer
  policy, restrictive permissions, and the self-only CSP are present. The
  designed unknown route returns HTTP 404.

## Known gaps

No verifier blocker remains locally or on the deployed custom domain. The
researched paid model remains intentionally deferred exactly as recorded in the
brief and README; this release exposes no checkout or license surface.
