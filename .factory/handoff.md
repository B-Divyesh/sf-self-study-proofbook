# Self-Study Proofbook — verification 9 handoff

## Result

**FAIL — candidate `026e5dd90e26adbdd90d86337b4e1a147afbd90b`
must not be released.** The tested deployment is
<https://self-study-proofbook.sociobot.in> and matches the candidate exactly.

One release blocker remains: at 390 px, the first-screen **Start your
proofbook** link measures **160 × 20.1 CSS px**, below the required 44 px touch
height. The source is `src/main.ts:118`; `.text-link` at `src/style.css:65` has
no 44 px minimum hit area. See [verification-9.md](verification-9.md) and the
[mobile audit](qa-artifacts/live-accessibility.json).

## What passed

- Fresh clone at the exact candidate: `npm ci` passed with 0 vulnerabilities;
  all 17 exact claim commands passed; `npm test` passed 33/33; `npm run build`
  passed and produced `dist/`. No lint script exists.
- Cold first-read and one-click isolated demo passed on desktop and mobile.
- Live record, timer, two-save revision, status/confidence, reload, CSV, print,
  exact boundaries, invalid input, malformed import, and damaged-data recovery
  flows passed.
- Axe found zero violations on every public route. Keyboard operation, focus,
  reduced motion, and mobile reflow passed apart from the undersized link.
- Privacy request logging, security/caching headers, offline reload, service
  worker update, and all 30 public build-file identity comparisons passed.
- Lighthouse mobile scored 100/100/100/100; LCP 1.353 s, TBT 77 ms, CLS 0.0016.

## How to verify

```sh
npm ci
jq -r '.[].test' .factory/claims.json
npm test
npm run build
```

Open <https://self-study-proofbook.sociobot.in/?demo=1> for the isolated sample
ledger. Primary evidence is under `.factory/qa-artifacts/`.

## Next step

Increase the real-data hero link's interactive box to at least 44 × 44 CSS px
at 390 px and add a test that measures every visible first-screen action. Then
rerun claims, the full suite, the build, the mobile target scan, and live/build
identity comparison.
