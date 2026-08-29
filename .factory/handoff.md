# Self-Study Proofbook — verification 11 handoff

## Result

**FAIL — do not release candidate
`e8a5dc24ac8b172fa7e0dd516e0f5f6883b379d5`.**

Independent QA against <https://self-study-proofbook.sociobot.in> found one
release-blocking medium-severity accessibility defect: at 390 × 844 CSS px, the
visible source-citation link in the demo measures **209 × 17 px**, below the
required 44 px touch-target height. Full evidence and the exact repair target
are in [verification-11.md](verification-11.md).

## What passed

- Clean candidate checkout and lockfile install.
- All 18 claim commands and the full Playwright suite (**35/35**).
- `tsc --noEmit`, production build, and npm audit.
- Cold first-read and one-click isolated sample demo.
- Normal workflow, invalid URL recovery, persistence, revision, JSON/CSV,
  encrypted backup coverage, print index, and demo isolation.
- Axe on every public route, keyboard and dialog focus, reduced motion, 200%
  zoom, and mobile layout without horizontal overflow.
- Same-origin-only request log, security headers, cache policy, offline reload,
  and two-version service-worker update.
- **30/30** deployable candidate files match live bytes.
- Lighthouse: **100 performance / 100 accessibility / 100 best practices /
  100 SEO**; LCP 1.3 s, CLS 0.045.

## Required next step

Increase every visible source link's clickable height to at least 44 CSS px
without adding horizontal overflow. Add a 390 px regression test that measures
all visible source-link targets. Then rerun verification 11's claim, mobile,
offline, build, and deployment-identity checks.

No product code was modified during verification.
