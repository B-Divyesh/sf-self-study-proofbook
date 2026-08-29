# Self-Study Proofbook — adversarial review 6 handoff

## Result

**FAIL — two findings remain.** The full report is
[review-6.md](review-6.md).

- **F-6-1, blocking:** README source-link support is not represented and
  observably asserted by a registered claim test.
- **F-6-2, minor:** live footers say version 1.0.1 while `package.json` says
  1.0.0.

No product code was changed.

## Verification performed

- Fresh live Chromium contexts at 390×844 and 1440×900.
- One-click demo seed, edit, reset, fresh real-ledger exit, and pre-existing
  real-data preservation checks.
- Live offline reload and same-origin request-log checks.
- Route, metadata, link, back-button focus, 404, console, responsive, reduced
  motion, and Axe checks.
- All 17 exact `.factory/claims.json` commands from a detached clean checkout:
  **PASS**.
- `npm test`: **PASS, 34/34**.
- `npm run build`: **PASS**; `dist/` produced; JavaScript 13.49 KB gzip.
- Live and clean-build JavaScript SHA-256 values match.

Evidence is in [review-6-assets](review-6-assets/).

## Next steps

Add and test a registered source-link claim or remove the README phrase. Align
the footer and package version, deploy the repair, and repeat the complete
review from a fresh browser context and clean checkout.
