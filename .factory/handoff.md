# Polish 3 handoff

The release repair is complete and deployed.

## Delivered

- Repair commit: `61d38e880bc185f86c73d970e9ba65f9d9801d51`.
- Deployment: static work order `self-study-proofbook-polish-3`, Azure Static
  Web Apps deployment `2779c30e-78d2-4be7-a6da-d8ae9096653a`.
- Live URL: <https://self-study-proofbook.sociobot.in>.
- Repaired all cumulative findings F-1-1 through F-1-9, F-2-1, F-3-1, and
  F-3-2. The full finding-to-evidence map is `.factory/polish-3.md`.
- Replaced the three unclear route H1s, removed landing counters/archive
  ornament/footer slogan, kept the terminal-ledger identity, and added
  route-specific static + client-side metadata for deep links.
- Updated the verb-first catalog description and the landing copy audit.

## How to run and verify

```sh
npm ci
# Run each exact command listed in .factory/claims.json.
npm test
npm run build
npm run preview
```

The demo is <https://self-study-proofbook.sociobot.in/demo> or `/?demo=1`.
It has its own `proofbook-demo-v1` IndexedDB namespace; Reset demo restores the
shipped sample and Start for real deletes the demo namespace before opening the
empty real `proofbook-v1` ledger.

## Exact verification evidence

- A fresh clone at `/tmp/self-study-proofbook-polish-3-strict` ran `npm ci`
  with zero vulnerabilities, all 15 exact claim commands with `set -e`, then
  `npm test` (**22/22**) and `npm run build`. `dist/index.html` is present.
- Local `/opt/fleet/lib/verify-url.sh` checks passed on `/` and `/demo`:
  title, `lang=en`, one H1, main, image alt text, labelled controls, and no
  console/page errors. Direct local 404 returned HTTP 404. Artifacts:
  `.factory/evidence/polish-3-local-*`.
- Playwright Axe scans had zero violations on `/`, `/demo`, `/app`,
  `/print?demo=1`, `/privacy`, `/terms`, and `/not-a-proofbook-route`. The
  mobile route checks found zero horizontal overflow. Keyboard checks cover the
  first-tab skip link, main focus, and Space activation of Save revision.
- The clean demo tests prove same-origin-only requests, separate demo storage,
  reset/leave behavior, offline reload after service-worker control, JSON/CSV
  downloads, printing, encrypted backup, citations, topic goals, timer,
  evidence status, complete JSON restoration, and non-credential notice.
- Live cold mobile audit repeated the route checks: all normal routes were
  200, the unknown route was 404, all route Axe scans were clean, the demo had
  its banner/reset/real controls and three sample attempts, its topic selector
  was `nav[aria-label="Topics"]`, requests were same-origin only, and offline
  `/demo` reload passed. The expected browser resource message for direct 404
  was excluded from the no-error count.
- Live JavaScript hash equals the build hash:
  `b3f128d785329f940bc8065dbf05fcd9716cd531bc0d04ae75ee1aa1aaa85e6b`.
  Hashed assets return `Cache-Control: public, max-age=31536000, immutable`.
  Live responses have HSTS, `nosniff`, strict referrer policy, permissions
  policy, and the self-only CSP.
- Budgets: JavaScript 33,263 bytes / 10,807 bytes gzip; CSS 17,633 bytes /
  4,722 bytes gzip; mobile hero 18,802 bytes. Local Lighthouse mobile was
  99 performance, 100 accessibility, 100 best practices, 100 SEO (LCP 1.7 s,
  CLS 0.046). Live Lighthouse mobile was 100/100/100/100 (LCP 1.4 s, CLS
  0.046). Reports are in `.factory/evidence/polish-3-*/lighthouse.json`.

## Known gaps and next steps

None. No third-party runtime requests, analytics, account system, payment path,
or AI capability is present; that matches this local-first product's brief.
