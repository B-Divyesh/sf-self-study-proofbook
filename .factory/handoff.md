# Self-Study Proofbook — polish 4 handoff

## Result

Perfection-loop round 4 is complete. All findings in reviews 1–4 are resolved,
including the two newly inventoried safety claims and all current copy issues.
The product remains a static, offline-capable PWA with its original pixel proof
terminal identity.

- Work order: `self-study-proofbook-polish-4`
- Product repair commit: `7366b9c8542532ed0583f572be3cc43ce012d9d6`
- Deployment: `ebcc9478-6b68-4896-a3ed-268504b6f931`
- Live URL: <https://self-study-proofbook.sociobot.in>
- Direct demo: <https://self-study-proofbook.sociobot.in/?demo=1>
- Finding map: [`.factory/polish-4.md`](polish-4.md)

## What changed

- The first screen now states “Free in this release; no checkout.” Its primary
  action opens the isolated `/?demo=1` sample ledger in one click.
- App and demo pages now use the task H1 “Record and review problem attempts.”
- README price, storage, encryption, and contributor copy now use direct words.
- `.factory/claims.json` now contains 17 claims. `saved-data-recovery` proves
  valid-record salvage, untouched-original download, and restore.
  `safe-import-validation` proves malformed imports cannot replace a real ledger.
- The prior demo isolation, route metadata, navigation focus, real 404, legal
  links, mobile layout, accessibility, and archive behavior remain covered.
- The catalog description is a verb-first 81-character sentence.

## Exact verification

- Fresh clone: `/tmp/self-study-proofbook-polish-4-clean-sgAlzS` at
  `7366b9c8542532ed0583f572be3cc43ce012d9d6`.
- `npm ci`: pass, 25 packages audited, zero vulnerabilities.
- Every exact `.factory/claims.json` command: 17/17 pass. Log:
  [polish-4-clean-claims.log](evidence/polish-4-clean-claims.log).
- `npm test`: 33/33 Playwright tests pass, including browser, keyboard,
  routing, focus, mobile, privacy, offline, recovery, and zero-violation Axe
  scans. Log: [polish-4-clean-full-test.log](evidence/polish-4-clean-full-test.log).
- `npm run build`: pass; `dist/index.html` exists. JavaScript is 43.43 KB raw /
  13.49 KB gzip; CSS is 18.69 KB raw / 4.88 KB gzip. Log:
  [polish-4-clean-build.log](evidence/polish-4-clean-build.log).
- Local `/opt/fleet/lib/verify-url.sh`: pass on `/` and `/?demo=1`, with no
  console errors. Local Lighthouse mobile: 99/100/100/100, LCP 1.8 s,
  CLS 0.046.
- Live cold audit: all routes have one H1/main, correct titles, legal links,
  zero Axe violations, and zero mobile overflow. Demo reset, offline reload,
  separate storage, Start for real, focus/back restoration, saved-data recovery,
  and five malformed-import classes all pass. Evidence:
  [polish-4-live-audit.json](evidence/polish-4-live-audit.json).
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best
  practices, 100 SEO; LCP 1.4 s; CLS 0.046. Evidence:
  [lighthouse.json](evidence/polish-4-live-home/lighthouse.json).
- Live JavaScript and `dist/` SHA-256 both equal
  `19e9453a013b8d3ed534db88d895a16fee3667187200598a53320ca0b089b012`.
- The direct unknown route returns HTTP 404 with the shared shell, metadata,
  legal links, security headers, and return action.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

Then open `http://127.0.0.1:4173/?demo=1`.

## Known gaps and next steps

None within the brief or cumulative review scope. Deployment infrastructure,
DNS, and billing configuration remain factory-owned.
