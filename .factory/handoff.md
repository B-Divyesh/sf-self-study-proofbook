# Verification 7 handoff — PASS

- **Verdict:** PASS — candidate accepted for release.
- **Candidate:** `952f2f4c0d45ebe926d8a124804a1bba22a710dc`
- **Live URL:** <https://self-study-proofbook.sociobot.in>
- **Date:** 2026-08-29 UTC
- **Full report:** [`.factory/verification-7.md`](verification-7.md)

## Result

No critical, high, medium, or low defects were found. The previous unnamed-dialog
blocker is fixed on the live site and in the candidate: all three dialogs now
have exact accessible names, correct modal state, initial focus, Escape close,
and focus return.

The deployed site matches all 29 compared candidate artifacts byte-for-byte.
The mandatory 15 claim commands pass, the full suite passes 33/33, TypeScript
and the production build pass, and `npm audit --audit-level=high` reports zero
vulnerabilities.

## Verification summary

- Cold first screen plainly states the job, audience, and first action. The
  one-click sample-data demo is visible on desktop and 390 px mobile.
- Live create, timer, revision, status, confidence, JSON, CSV, print, encrypted
  backup, correct restore, wrong-password recovery, malformed import recovery,
  and cancelled deletion all pass.
- Live request logs are same-origin only. Demo and real IndexedDB namespaces are
  isolated, and leaving demo deletes demo storage.
- Offline reload and a controlled service-worker update pass. The old versioned
  cache is removed and the updated demo reloads offline.
- Axe reports zero violations on all public routes and 404. Keyboard, focus,
  dialog name/role/state, reduced motion, 44 px targets, 200% zoom, and mobile
  overflow checks pass.
- Lighthouse mobile live: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.4 s, TBT 90 ms, CLS 0.046, 89 KiB transferred.
- JS is 13.49 kB gzip, CSS 4.88 kB gzip, font 22.5 kB, and mobile hero 18.8 kB.

Evidence is in [`.factory/verification-assets-7/`](verification-assets-7/).

## Reproduce

```sh
npm ci
npm audit --audit-level=high
# Run each command in .factory/claims.json
npm test
npm run build
```

`npm run build` includes `tsc --noEmit` and writes `dist/`. No separate lint
configuration exists. This static PWA has no backend, server API, unlock call,
sign-in, package API, or CLI, so rate-limit, Entra, backend concurrency, health,
and consumer-install checks do not apply.

## Known gaps and next steps

No release blocker remains. The researched one-time purchase model is
deliberately deferred in the brief; this release contains no checkout or paid
surface. Register and verify a Sociobot billing product before introducing paid
copy or license checks in a future release.
