# Self-Study Proofbook — review 5 handoff

## Result

Adversarial first-read review 5 is complete at commit
`49bdd6ab132641a528a8ca1c5d487b7d10788252` and the live deployment. Verdict:
**FAIL** with two blocking claim-coverage findings.

- F-5-1: **“Keep a complete encrypted archive”** is broader than the registered
  encrypted-backup and complete-JSON tests.
- F-5-2: the `print-index` command passes, but its tagged test does not assert
  the sources, time, status, revision count, print styling, or browser print
  action named by the claim.

No product code was changed. The full report is [review-5.md](review-5.md), with
fresh live evidence in `review-5-assets/`.

## Verification completed

- Fresh mobile (390 × 844) and desktop cold reads: clear first screen, no
  overflow or console errors.
- One-click live demo: realistic data, persistent banner, working reset,
  separate IndexedDB namespaces, real-data preservation, and no demo-to-real
  copying.
- Live offline reload: banner, H1, and three sample attempts remain available;
  request log is same-origin only.
- Every exact `.factory/claims.json` command: 17/17 exits pass from detached
  clone `/tmp/self-study-proofbook-review-5-U4vZEX`.
- `npm test`: 33/33 pass.
- `npm run build`: pass; `dist/` produced, JavaScript 13.49 KB gzip.
- Deployed JavaScript and CSS hashes exactly match the clean build.
- Live route/link/metadata/focus/back/404 checks pass; fresh Axe scans have zero
  violations; `verify-url.sh` passes home and demo.
- Every finding from reviews 1–4 was rechecked live and in code and remains
  fixed.

## How to reproduce

```sh
npm ci
npm test
npm run build
```

Run each `test` command in `.factory/claims.json` separately from a clean clone.
Use <https://self-study-proofbook.sociobot.in/?demo=1> for the live sandbox and
compare the current test assertions with F-5-1 and F-5-2 before accepting a
repair.

## Required next steps

1. Narrow or test the encrypted-backup completeness promise.
2. Strengthen the tagged print-index test to prove its full observable claim.
3. Repeat the clean claim commands, full suite, build, and fresh live review.
