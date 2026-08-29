# Independent verification 12 — Self-Study Proofbook

## Verdict

**FAIL** for candidate `0a886e3cace21ded823f398a9fdda841f8a0c463` at
<https://self-study-proofbook.sociobot.in> (verified 2026-08-29 UTC).

The deployed files match the candidate, so the finding is in the release
candidate rather than a stale deployment. This verification made no product
code changes.

## Release-blocking finding

### M1 — Legal-page email links miss the required 44 px touch target

At a 390 × 844 CSS-pixel mobile viewport, the visible interactive contact
links are only about 20 px tall:

| Route | Link | Measured target |
| --- | --- | --- |
| `/privacy` | `privacy@sociobot.in` | 150.05 × 20 px |
| `/terms` | `support@sociobot.in` | 150.08 × 20 px |

This violates the applicable accessibility/product requirement that touch
targets are at least 44 × 44 px. It is reproducible in the deployed candidate
and traces to the unstyled `mailto:` links in `src/main.ts` (the 44 px link
rule applies to footer navigation, not these legal-body links). The terms link
is in the first mobile viewport. Make both contact links 44 px high/wide
targets, then re-run the mobile target census and relevant accessibility tests.

## What passed

- First-read cold-live test passed. The first screen says “Record problems you
  can solve,” names serious math and CS self-learners, and offers one-click
  “Try it with sample data” with the plain explanation “Opens a separate
  sample ledger.”
- `.factory/claims.json` exists with 18 claims. From a newly cloned, detached
  checkout of the candidate, `npm ci` followed by every listed `npm test --
  --grep @claim:…` command passed. The demo-only tests cover privacy, offline
  reload, CSV/JSON/print/encrypted exports, revisions, isolated demo storage,
  citations/source links, goals, timer, evidence status, invalid imports, and
  recovery.
- In an independent clean checkout, `npm test` passed **36/36** Playwright
  tests; `npm run build` passed (`tsc --noEmit` plus Vite); and `npm audit
  --audit-level=high` reported 0 vulnerabilities. There is no separate lint
  script.
- Production build budgets pass: initial JS is 43,577 bytes raw / 13,464 gzip;
  CSS is 18,932 bytes raw / 4,936 gzip. Live desktop Lighthouse was 100 for
  performance, accessibility, best practices, and SEO (FCP 0.3 s, LCP 0.3 s,
  CLS 0.001, TBT 50 ms, 89 KiB transfer).
- Fresh live axe scans found no serious or critical findings on `/`, `/demo`,
  `/app`, `/print?demo=1`, `/privacy`, `/terms`, or the designed 404. Each
  valid route has one H1, a main landmark, `lang=en`, and no console/page
  errors. The 404 correctly returns 404 and therefore has the expected failed
  document console line.
- Keyboard checks found the skip link first with a visible 3 px focus ring;
  Enter moves focus to `main`. Demo banner controls, header links, and dialogs
  were reachable. Reduced-motion mode exposed no running animations or
  transitions. No route had mobile horizontal overflow.
- Live functional smoke test: editing a sample solution changed revision count
  1 → 2; CSV downloaded a header plus three data rows; the print index exposed
  Problem, Source, Time, Evidence, Revisions, and Updated; its non-credential
  notice appeared; a blank-topic submission returned “Topic name cannot be
  blank.” No external request or console error occurred during this flow.
- Privacy checks passed for the tested demo flow: all observed page requests
  were same-origin. The live policy sends a self-only CSP (including
  `frame-ancestors 'none'`), HSTS, `nosniff`, strict referrer policy, and
  restrictive permissions policy. HTML/worker/manifest use 30-second
  revalidation; hashed JS/CSS use one-year immutable caching.
- PWA checks passed. The live `/demo` page was controlled by `/sw.js`, then
  reloaded offline with the sample ledger available. An isolated two-version
  service-worker simulation using the candidate’s generated worker showed the
  “An update is ready. Reload to use it.” notice; after reload the new cache
  was solely active and demo data remained available.
- Deployment identity passed: 30 of 30 deployable candidate `dist/` files had
  byte-identical live responses. The live JS SHA-256 is
  `ce19e2e9d9af75572bdef3721f511eb9c68acd9dd80e632b235f9ff94b997db7`.

## Applicability

This is a static local-first PWA. It has no backend API, server-side rate-limit
allowance, sign-in, Sociobot billing endpoint, AI endpoint, package/CLI public
API, or consumer-install surface to exercise. The only release blocker found
is M1.
