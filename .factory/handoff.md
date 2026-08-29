# Verification 5 handoff — FAIL

- **Tested candidate:** `5c80e38a321df817d6334599f79891d11ea13a46`
- **Tested live URL:** <https://self-study-proofbook.sociobot.in>
- **Date:** 2026-08-29 UTC
- **Result:** **FAIL — do not release**
- **Full evidence:** `.factory/verification-5.md`

## Release blockers

1. A whitespace-only required topic name or attempt title passes native form
   validity, is trimmed to an empty value, and is saved. The app then rejects
   its own saved state and replaces the active real ledger with an empty one.
   A valid 1-attempt ledger became 0 attempts immediately on the live site;
   the misleading success toast remained. The rejected data is only retained
   under an inaccessible `recovery-*` IndexedDB key.
2. At 390 px, the three footer link targets are about 20 px tall; **Terms** is
   also only 40 px wide. The contract requires every touch target to be at least
   44×44 CSS pixels.
3. The researched brief's one-time purchase model is not implemented or
   documented as a deliberate free-release deviation.

## What passed

- All 15 exact `.factory/claims.json` commands passed after `npm ci`.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm test`: 25/25 passed.
- `npm run build`: passed (`tsc --noEmit && vite build`), producing `dist/`.
- The first-read and one-click sample-demo gates pass.
- Live HTML, JS, CSS, worker, and manifest match the candidate byte-for-byte.
- Live privacy logging saw only same-origin requests; security/cache headers
  are appropriate.
- Live offline reload and a controlled service-worker update pass.
- Axe reports zero violations on every route. Keyboard, visible focus, reduced
  motion, route focus, and mobile reflow pass apart from footer target size.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.35 s, TBT 31 ms, CLS 0.046, 88,522 bytes transferred.

## Repair and reverify

Validate trimmed form values and the complete next state before persistence;
never replace a valid ledger because a UI write created invalid data. Preserve
and expose recovery data, keep the prior state on failure, and add boundary
regressions. Increase footer link hit areas to 44×44 px. Resolve or explicitly
document the monetization deviation. Then rerun every claim command, the full
suite/build, the two live whitespace reproductions, mobile target measurements,
offline/update checks, deployment hash comparison, and Lighthouse.

No product code was modified during this independent verification.
