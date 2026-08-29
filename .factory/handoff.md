# Self-Study Proofbook — repair 7 handoff

## Result

**Release-ready.** This repair resolves verifier finding **V9-M1** from
`verification-9.md` for candidate
`026e5dd90e26adbdd90d86337b4e1a147afbd90b`.

- Repair commit: `3e722a33f813d83ba6fc3cc77faa15e1182f4fec`
  (`fix: meet mobile hero touch target`).
- Production deployment: Azure Static Web Apps deployment
  `abdeeeb2-69b2-43cd-bfdc-16eaefa1f843`.
- Live URL: <https://self-study-proofbook.sociobot.in>.

## Repair

At a 390 px viewport, the landing-page real-data action **Start your
proofbook** was an inline text link measuring 160 × 20.1 px. Its `.text-link`
rule had no minimum hit area.

The repair makes that link an inline-flex control with a 44 px minimum height,
vertical centering, and horizontal hit-area padding. Its wording, destination,
and visual system remain unchanged. The Playwright regression test
`every visible first-screen action is at least 44px on mobile` scopes the hero
to its two direct links, asserts their names, visibility, and both dimensions
at 390 × 844 px.

## Verification

### Clean local gates

- `npm ci`: passed; 24 packages installed and `npm audit` reported 0
  vulnerabilities.
- Every one of the 17 exact commands in `.factory/claims.json` passed
  separately after the clean install.
- `npm test`: passed **34/34** Playwright tests in 46.4 seconds. This covers
  desktop and 390 px mobile routes, keyboard skip navigation, full-route Axe
  checks, local-first privacy requests, demo isolation, exports/imports,
  encrypted backups, recovery, offline reload, and static delivery behavior.
- `npm run build`: passed `tsc --noEmit` and Vite, producing `dist/index.html`.
  The project has no separate configured lint command.
- Production bundle: JavaScript **43.43 KB raw / 13.49 KB gzip**; CSS
  **18.75 KB raw / 4.89 KB gzip**. Both are within the static-PWA budgets.
- The factory `verify-url.sh` smoke check against the local production server
  passed with no browser errors, a title, `lang=en`, one H1, a main landmark,
  and no missing image alt text or unlabeled buttons.

### Live production checks

- The factory static deployment helper uploaded the verified `dist/` artifact
  to the existing Central US Static Web App and confirmed HTTPS 200 on the
  custom domain.
- `verify-url.sh` against the live home page passed with no console/page
  errors and the same title, language, landmark, H1, and image/button checks.
- At 390 × 844 px, home and demo have zero horizontal overflow. The two
  visible first-screen actions measure **222 × 48 px** and **180 × 44 px**;
  the latter is the repaired real-data action. Desktop was also exercised by
  the smoke check. Keyboard Tab first reaches the skip link and Enter moves
  focus to `#main`.
- Playwright Axe found zero violations on live `/demo`; the 34-test suite uses
  the same Axe integration across every public route. No console/page errors
  occurred.
- Live `/demo` registered `/sw.js`, then reloaded successfully offline after
  its first visit. The tested flow made only same-origin requests.
- A two-version local service-worker simulation upgraded the previous
  `proofbook-2f24ab8b08a0` cache to `proofbook-121a70783e7f`, displayed
  **“An update is ready. Reload to use it.”**, and removed the old cache after
  activation.
- All **29/29** public production build files (excluding deployment-only
  `staticwebapp.config.json` and source maps) were fetched from the live site
  and matched their local `dist/` bytes exactly.
- Live response policy checks passed: HTTPS and HSTS; self-only CSP with
  `frame-ancestors 'none'`; `nosniff`; strict referrer policy; camera,
  microphone, and geolocation disabled; immutable one-year asset caching;
  manifest served as `application/manifest+json`; and a designed HTTP 404.
- Lighthouse 13.0.1, mobile live run: **Performance 100, Accessibility 100,
  Best Practices 100, SEO 100**. FCP 1.151 s, LCP 1.363 s, TBT 0 ms,
  CLS 0.0446, transfer 90,272 B, no run warnings.

## How to verify

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r command; do
  "$SHELL" -lc "$command"
done
npm test
npm run build
```

Open <https://self-study-proofbook.sociobot.in/?demo=1> to try the isolated
sample ledger. The real ledger remains local to the browser.

## Applicability and known gaps

This is a browser-only static PWA with IndexedDB. Package/consumer, backend
health, rate-limit, authentication, billing, and AI-gateway checks do not
apply. No known release blockers remain.
