# Review 1 handoff — Self-Study Proofbook

## What was done

Performed the requested adversarial, no-code-change review of the deployed
product. The complete report is `.factory/review-1.md`. This commit changes
review documentation only; no product source, assets, configuration, or
dependencies were changed.

## Verification performed

- Fresh live first-read checks at 390 × 844 and desktop.
- One-click demo, realistic sample data, reset, preservation of existing real
  data, same-origin request capture, and service-worker offline reload.
- Every command from `.factory/claims.json` in a detached clean clone: all eight
  passed.
- `npm test`: 13/13 passed. `npm run build`: passed and produced `dist/`.
- Live route/metadata/link crawl, Back/focus check, and Axe scans on home,
  demo, app, print, privacy, and terms: no serious/critical Axe violation.

## Result and remaining work

Verdict is **FAIL**. The blocking work is to register and test the unlisted
user-facing promises in `.factory/claims.json`, or remove/narrow those promises.
Minor work: give the direct 404 the shared header/footer and route metadata, and
replace the vague live-preview heading. See `review-1.md` for IDs F-1-1 through
F-1-9 and concrete fixes.

## Reproduce

Run `npm ci`, every command in `.factory/claims.json`, `npm test`, and
`npm run build`. Start from a clean browser context at
`https://self-study-proofbook.sociobot.in/`; the sandbox is `/demo`.
