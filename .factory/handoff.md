# Self-Study Proofbook — polish 5 handoff

## Result

Review-5 is repaired and deployed. The product is live at
<https://self-study-proofbook.sociobot.in> from repair commit
`90a16ea59f811b6ce350f1a5aa85c9609c54490f`.

- F-5-1: replaced the unsupported **“Keep a complete encrypted archive”**
  heading with **“Export a password-encrypted backup.”** The remaining wording
  is covered by `@claim:encrypted-backup`.
- F-5-2: the `@claim:print-index` test now creates a revision, checks all six
  table headings and the source, reference, time, status, and new revision
  count for Dijkstra's sample, switches to print media, and proves the button
  calls `window.print`.

The full cumulative map is [polish-5.md](polish-5.md). No review finding is
left open.

## Exact verification

- Detached fresh clone at `/tmp/self-study-proofbook-polish-5-ikL3sq`, commit
  `90a16ea59f811b6ce350f1a5aa85c9609c54490f`: `npm ci` passed with **0
  vulnerabilities**. Every one of the 17 exact commands in
  `.factory/claims.json` passed separately, including the strengthened
  `npm test -- --grep @claim:print-index`.
- The same clean clone: `npm test` passed **33/33** Playwright browser tests;
  `npm run build` passed and produced `dist/index.html`.
- Fresh build budget: JavaScript **43.43 kB raw / 13.49 kB gzip**, CSS **18.69
  kB raw / 4.88 kB gzip**, locally hosted font **22.50 kB**, and mobile hero
  **18.80 kB**.
- Live cold checks: `verify-url.sh` passed home, demo, and print with zero
  console errors, one H1, `lang=en`, a main landmark, and labelled controls.
  Screenshots and reports are in `evidence/polish-5-live-home/`,
  `evidence/polish-5-live-demo/`, and `evidence/polish-5-live-print/`.
- Live Playwright/Axe audit at 390 × 844 checked home, query demo, `/demo`,
  `/app`, demo print, privacy, terms, and the 404: **0 Axe violations** and
  no horizontal overflow. The query demo reset restored the shipped sample;
  its banner, reset, and Start-for-real controls were present. Details:
  [polish-5-live-audit.json](evidence/polish-5-live-audit.json).
- Live 404 returned HTTP **404** with its header, main, footer, Privacy/Terms
  links, title, canonical, and social metadata. The deployed index, service
  worker, manifest, JavaScript, and CSS SHA-256 values matched the clean build.
- Lighthouse 13.4.1 mobile live audit (full-page screenshot disabled because
  Chromium crashes while capturing it): Performance **100**, Accessibility
  **100**, Best Practices **100**, SEO **100**; FCP **1.1 s**, LCP **1.4 s**,
  CLS **0.046**. Evidence:
  [polish-5-lighthouse-live.json](evidence/polish-5-lighthouse-live.json).

## Run locally

```sh
npm ci
npm test
npm run build
```

For the one-click isolated sandbox, open
<https://self-study-proofbook.sociobot.in/?demo=1>. **Reset demo** restores the
sample; **Start for real** removes the demo database and opens the separate real
ledger.

## Known gaps

None.
