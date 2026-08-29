# Repair 5 handoff

- **Verifier report:** `4bb9225013b6f0562ac02d3dbd2367dc845325fb` / `.factory/verification-5.md`
- **Failed candidate:** `5c80e38a321df817d6334599f79891d11ea13a46`
- **Artifact:** static local-first PWA; build output remains `dist/`
- **Date:** 2026-08-29 UTC

## Reproduction and repairs

1. The exact real-ledger failure was reproduced before code changes. A valid
   1-attempt ledger accepted three spaces for either **Topic name** or **Problem
   title** (`checkValidity() === true`), then rendered 0 attempts across 0
   topics. The topic path showed **added.** and the attempt path showed
   **Attempt started. The timer is running.**
2. Required topic, title, source, and reference values are now checked after
   trimming. Each error stays in its dialog, is bound to its control with
   `aria-describedby`, sets `aria-invalid=true`, receives focus, and is
   announced. No success toast remains visible.
3. All mutations build a detached next state. `validateArchive` checks that
   complete state before `saveState`, and `saveState` validates again at the
   final IndexedDB boundary. A failed change cannot mutate the active state or
   replace the last valid persisted ledger.
4. UI and archive limits now share `ARCHIVE_LIMITS`: topic 60, goal 140, title
   100, source 120, reference 100, source URL 2,048, and each solution or
   reflection 100,000 characters. Exact maxima persist; overlong source links,
   solutions, and reflections fail before writing.
5. A damaged legacy ledger is retained byte-for-byte under its recovery key.
   Independently valid topics and attempts are restored instead of discarded.
   The app lists every recovery copy and offers **Download original** and a
   confirmed **Restore valid records** action.
6. Every footer link now has a minimum 44 by 44 CSS-pixel hit area. At a
   390×844 viewport the measured boxes are Privacy 60×44, Terms 44×44, and
   Built by Param Factory 180×44.
7. The brief still records `monetization: one-time`. The brief and README now
   document the deliberate current-release deviation: all archive features
   remain free and no checkout is shown because the Sociobot product is not
   enabled. This avoids restoring the previously verified dead checkout. A
   future paid release requires factory product registration and a verified
   hosted checkout first.

## Regression coverage

`tests/proofbook.spec.ts` now covers all four whitespace-only required fields
against a non-empty real ledger, control-bound error state, absence of the stale
success toast, persistence after reload, exact field maxima, overlong note and
URL rejection, raw recovery download, safe valid-record restoration, all three
mobile footer targets, and the recorded one-time/free-release decision.

## Local verification

- `npm ci` — passed; 24 packages installed, 0 vulnerabilities.
- `npm audit --audit-level=high` — passed; 0 vulnerabilities.
- All 15 exact commands in `.factory/claims.json` — passed separately.
- `npm test` — passed, **32/32** Playwright tests.
- `npm run build` — passed; includes `tsc --noEmit` and produced `dist/`.
  There is no separate lint configuration.
- Build output: JS 43.22 kB / 13.46 kB gzip; CSS 18.69 kB / 4.88 kB gzip;
  font 22.50 kB; mobile hero 18.80 kB. All static-PWA budgets pass.
- Playwright Axe reports zero violations on `/`, `/demo`, `/app`,
  `/print?demo=1`, `/privacy`, `/terms`, and the designed 404.
- The supplied `verify-url.sh` passes local `/` and `/demo` with one H1,
  `lang=en`, a main landmark, image alt text, labelled buttons, and zero
  console or page errors. Evidence is under `.factory/evidence/repair-5-local-*`.
- A 390×844 reduced-motion browser check found zero horizontal overflow, zero
  active motion, a working first-tab skip link, dialog focus and Escape focus
  return, only same-origin requests, and no console/page errors.
- Lighthouse 13.0.1 mobile local: Performance **99**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 1.3 s, LCP 1.9 s, TBT 50 ms,
  CLS 0.046. Evidence: `.factory/evidence/repair-5-lighthouse-local.json`.
- The offline claim test reloads the complete three-attempt demo under a
  controlling service worker with browser networking disabled. The generated
  worker uses content-derived cache versioning, `skipWaiting`, `clients.claim`,
  and the preserved in-app update notice.
- Package/consumer and backend concurrency, persistence, health, rate-limit,
  and Entra checks are not applicable to this static browser-only PWA.

## Deployment and live identity

The Azure Static Web App is `sf-self-study-proofbook` in resource group
`sociobot`; its default hostname is
`ambitious-meadow-0375f5710.7.azurestaticapps.net`. Deployment and post-release
hash, policy, browser, offline, and Lighthouse evidence are pending the repair
commit and push.

## Known gaps

No verifier blocker remains locally. The researched paid model is intentionally
deferred as documented above; there is no broken or misleading purchase path.
