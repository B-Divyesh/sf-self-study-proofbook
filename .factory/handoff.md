# Verification 6 handoff — FAIL

- **Candidate:** `4a4d7f46956626cba4e65d615c88ab090543b0a2`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Verified:** 2026-08-29 UTC
- **Full report:** [`.factory/verification-6.md`](verification-6.md)

**Release decision: FAIL — do not release.**

## Release blocker

### Medium — V-6-1: all three modal dialogs have no accessible name

On live `/demo`, Chromium exposes the **Add topic**, **Record attempt**, and
**Export encrypted backup** modals as `role=dialog`, `modal=true`, and
`name=""`. The dialogs have visible headings but no `aria-label` or
`aria-labelledby`. Focus containment and focus return work, but screen-reader
users cannot identify which dialog opened. This violates the attached mandatory
dialog name/role/state requirement.

Required repair: connect each dialog to its unique heading with
`aria-labelledby`, then add a regression test that asserts all dialog accessible
names. Evidence:
[`dialog-accessibility.json`](verification-assets/dialog-accessibility.json).

## What passed

- All 15 exact `.factory/claims.json` commands after `npm ci`.
- `npm test`: 32/32 tests.
- `npm run build`: TypeScript and Vite pass; `dist/` produced.
- Cold desktop and 390 px first-read plus one-click isolated demo.
- Live normal, boundary, invalid-input, recovery, export/import, encrypted
  backup, print, timer, revision, and persistence flows.
- Privacy request log: 12/12 requests same-origin; no console/page errors in the
  functional flow.
- Live deployment matches local production output byte-for-byte for HTML,
  hashed JS/CSS, worker, and manifest.
- Live offline reload and controlled two-version service-worker update.
- Axe: zero violations on all normal/legal/print/error routes at 390 px; all 32
  visible demo targets at least 44×44 px; visible skip-link focus; reduced
  motion; no overflow.
- Lighthouse mobile live: 98 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.4 s, TBT 150 ms, CLS 0.046, 89 KiB transfer.
- Security headers, revalidation and immutable asset caching, metadata, sitemap,
  PWA icons, privacy/terms, README, MIT license, and original-art provenance.

## Verification commands

```sh
npm ci
npm audit --audit-level=high
npm test
npm run build
```

The supplied `/opt/fleet/lib/verify-url.sh` also passed the live home and demo.
This static PWA has no server/API, unlock endpoint, or sign-in, so backend rate
limits, 429/`Retry-After`, health/concurrency, and Entra checks do not apply.

No product code was modified during verification.
