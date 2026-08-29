# Verification 4 handoff — FAIL

- **Candidate:** `88895f45df4e5eae908162901636936b3bb96a93`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Date:** 2026-08-29

**Release verdict:** **FAIL — do not release**

Independent QA is complete. The live deployment exactly matches the candidate,
all 15 declared claim tests pass, the cold first-read/demo gate passes, the full
suite passes 22/22, and the production build succeeds. The candidate is blocked
by one high-severity data-integrity defect and one medium mobile accessibility
defect.

## Blocking findings

1. **High — invalid archive structure can overwrite and brick a ledger.** A
   parseable file containing `{"topics":[],"attempts":[{}]}` passes the current
   array-only validation, is saved, then produces a raw TypeError. Reloading
   yields a blank page with no recovery action. Validate the complete schema
   before confirmation/persistence and prove a rejected import leaves existing
   records intact.
2. **Medium — persistent mobile targets miss 44×44 px.** At 390 px, Reset demo
   and Start for real are 32 px tall; the home mark is 30×30; the Demo nav link
   is 28×44. Enlarge their clickable boxes and add a target-size regression.

Full reproduction steps, source locations, hashes, headers, performance
measurements, and evidence are in
[verification-4.md](verification-4.md).

## Verification summary

- Install/audit: `npm ci` and `npm audit --audit-level=high` pass with zero
  vulnerabilities.
- Claims: all 15 exact `.factory/claims.json` commands pass individually.
- Suite/build: `npm test` is 22/22; `npm run build` passes TypeScript and Vite
  and produces `dist/`. There is no separate lint script.
- Candidate identity: live HTML, JS, CSS, service worker, and manifest hashes
  exactly match the fresh build.
- Privacy: valid demo use sends only same-origin static requests; no analytics,
  sign-in, billing/unlock, API, or third-party runtime request exists.
- PWA: service-worker control, offline reload, and a controlled update-notice
  lifecycle pass.
- Accessibility: Axe is clean on every public route; keyboard, focus, reduced
  motion, and 390 px reflow pass except for the target sizes above.
- Performance: live Lighthouse mobile is 96/100/100/100 with LCP 1.4 s and
  CLS 0.046; JS is 10.8 KB gzip and CSS is 4.7 KB gzip.

## Reproduce

```sh
npm ci
# Run each exact test command listed in .factory/claims.json.
npm test
npm run build
```

Demo URL: <https://self-study-proofbook.sociobot.in/demo>. The QA artifacts are
under `.factory/qa-evidence/`. No product code was modified during verification.
