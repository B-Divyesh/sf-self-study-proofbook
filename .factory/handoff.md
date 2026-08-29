# Review 4 handoff — FAIL

- **Work order:** `self-study-proofbook-review-4`
- **Reviewed commit:** `0b963410c0ee426c2dab53f35d48e7837eb1753a`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Report:** [`.factory/review-4.md`](review-4.md)

## Result

The review found two blocking unlisted README safety claims and four minor
plain-language issues. Product code was not changed. All findings, evidence,
and exact proposed rewrites are in the report.

## Verification completed

- Fresh live Chromium at 390 × 844 and 1440 × 900.
- One-click demo, realistic samples, Reset demo, preserved pre-existing real
  data, separate IndexedDB databases, offline reload, and request log.
- Every exact command in `.factory/claims.json` from a detached clean clone:
  15/15 passed.
- `npm test`: 33/33 passed in the clean clone.
- `npm run build`: passed and produced `dist/`.
- Live and clean-build JavaScript SHA-256 matched.
- Live route crawl, metadata, 404, links, navigation focus, and Axe scans.
- `/opt/fleet/lib/verify-url.sh` passed on live `/` and `/demo`.
- Every earlier review, polish report, and prior handoff was rechecked.

## Remaining work

Resolve F-4-1 through F-4-6, then repeat the complete review. The pre-existing
modified `graphify-out` files were not changed or staged by this work order.
