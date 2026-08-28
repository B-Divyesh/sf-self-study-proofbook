# Review 2 handoff — Self-Study Proofbook

## Scope

Independent adversarial review only. No product code was changed. The review is
recorded in `.factory/review-2.md`.

## Result

**FAIL** with one minor finding: `F-2-1`. The live `/demo` and `/app` topic rail
is an `<aside>` nested inside `<main>`, producing Axe's moderate
`landmark-complementary-is-top-level` violation. Replace it with a labelled
`nav` or non-landmark element, then require zero Axe violations on these routes.

## Verification performed

- Fresh live Chromium at 390px and desktop: clear first screen, no application
  errors, no mobile overflow, distinct product visual identity.
- Fresh live demo: three realistic sample attempts, persistent isolated-demo
  banner, reset restores the original sample, Start for real leads to an empty
  real ledger.
- Live request log: demo and offline flows only requested the product origin.
  Service-worker-controlled `/demo` reloaded successfully while offline.
- Fresh clone at `/tmp/self-study-proofbook-review-ioxZOp`: `npm ci` completed
  with zero audit vulnerabilities; all 15 exact claims commands passed;
  `npm test` passed 20/20; `npm run build` passed and produced `dist/`.
- Live and built home HTML plus hashed application JavaScript had matching
  SHA-256 values. Route, metadata, link, focus/back, 404, and prior-findings
  checks are detailed in the review.

## Next step

Repair F-2-1, rerun the claim commands and suite, and perform a new full
first-read review. Do not treat this handoff as release approval.
