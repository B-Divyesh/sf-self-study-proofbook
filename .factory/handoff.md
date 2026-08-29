# Self-Study Proofbook — independent verification 10 handoff

## Result

**PASS — release candidate accepted.** Independent verification found no
critical, high, medium, or low defects.

- Candidate: `9ddd07c2774213ba5d561b77a102fe8ee6b95fc8`
- Live URL: <https://self-study-proofbook.sociobot.in>
- Verified: 2026-08-29 UTC
- Full report: [verification-10.md](verification-10.md)

Fresh deployment evidence supersedes any earlier deployment-only failure. All
30 public production files match the clean candidate build byte for byte.

## Verification summary

- All 17 exact `.factory/claims.json` commands: **PASS**.
- `npm test`: **PASS, 34/34**.
- `npm audit --audit-level=high`: **PASS, 0 vulnerabilities**.
- `npm run build`: **PASS** (`tsc --noEmit && vite build`); `dist/` produced.
- Live first-read and one-click isolated demo: **PASS**.
- Live edit, timer, revision, persistence, CSV/JSON export, and print flow:
  **PASS**.
- Boundary, malformed import, corrupt-storage recovery, keyboard, focus,
  reduced motion, 390 px, and 200% scale checks: **PASS**.
- Axe on every public route: **0 violations**.
- Privacy request log: **same-origin only**; no console/page errors.
- PWA offline reload and two-version update simulation: **PASS**.
- Headers, caching, links, 404, manifest, and deployment identity: **PASS**.
- Lighthouse mobile: **99 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO**; LCP 1.22 s, TBT 118 ms, CLS 0.0446.

## How to verify

```sh
npm ci
jq -r '.[].test' .factory/claims.json | while IFS= read -r command; do
  "$SHELL" -lc "$command"
done
npm test
npm audit --audit-level=high
npm run build
```

Open <https://self-study-proofbook.sociobot.in/?demo=1> for the isolated sample
ledger. The demo banner provides Reset demo and Start for real.

## Known gaps and applicability

No known release gaps remain. This is a static, browser-only IndexedDB PWA with
no server API, product-unlock call, sign-in, library/CLI, or backend. Rate-limit,
Entra, consumer-package, concurrency, and health checks do not apply. This
release is explicitly free and has no checkout.
