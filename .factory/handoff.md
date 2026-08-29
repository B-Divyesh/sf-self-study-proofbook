# Self-Study Proofbook — independent verification 12 handoff

## Result

**FAIL — do not release candidate `0a886e3cace21ded823f398a9fdda841f8a0c463`.**

The live deployment at <https://self-study-proofbook.sociobot.in> is an exact
match for the candidate (30/30 deployable files matched byte-for-byte), so this
is not a deployment-only issue.

## Release blocker

At the required 390 px mobile width, the legal-page email links are only 20 px
tall: `privacy@sociobot.in` on `/privacy` measures 150.05 × 20 px and
`support@sociobot.in` on `/terms` measures 150.08 × 20 px. Both are interactive
targets and violate the mandatory 44 × 44 px touch-target requirement. This is
M1/release-blocking until both `mailto:` links are styled as adequate targets.

## Verification summary

- Clean-clone `npm ci`, all 18 declared claim commands, full `npm test`
  (36/36), exact `npm run build`, and high-severity `npm audit` passed.
- The cold first screen plainly explains the product, audience, and one-click
  sample demo. Normal, boundary, invalid-input, recovery, archive, print,
  keyboard, offline reload, and service-worker update flows passed.
- Live request logging was same-origin only; CSP/caching/security headers,
  desktop and 390 px layout, reduced motion, and axe scans otherwise passed.
- Lighthouse desktop: 100 performance, 100 accessibility, 100 best practices,
  100 SEO. Initial JS is 13,464 bytes gzip and CSS is 4,936 bytes gzip.

See [verification-12.md](verification-12.md) for exact commands, measurements,
scope, and all non-blocking passing evidence.
