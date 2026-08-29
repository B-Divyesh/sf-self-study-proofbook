# Self-Study Proofbook — polish 6 handoff

## Result

**PASS — every finding from reviews 1–6 is fixed and rechecked.** The product
repair is commit `60f49b2266c4133d44eee44a91c3d36b9401a243`, pushed to `main`
and deployed at <https://self-study-proofbook.sociobot.in> through static
deployment `61120da4-d27a-4c45-8248-a7c202075dd6`.

The final functional repairs are:

- `source-link` is now an 18th registered claim with one observable test. The
  demo immediately exposes a safe HTTPS source link; user links persist through
  reload and JSON export/import, and open with `external noopener noreferrer`.
- Version `1.0.1` is declared once in the package manifest. The Vite build uses
  it in app footers and substitutes it into the static 404 footer.
- The catalog line is now verb-first, 81 characters, and describes the current
  private offline ledger plainly.

The complete finding-by-finding record is [polish-6.md](polish-6.md).

## How to run and verify

```sh
npm ci
npm test
npm run build
```

The build writes the static PWA to `dist/` with `dist/index.html` at its root.
Open `/?demo=1` for the isolated sample ledger. Its persistent banner provides
**Reset demo** and **Start for real**; demo storage is `proofbook-demo-v1` and
real storage is `proofbook-v1`.

A detached clean clone at `/tmp/self-study-proofbook-polish-6.494PTF` ran
`npm ci`, `npm audit --audit-level=high`, all 18 exact claim commands in
`.factory/claims.json`, `npm test` (**35/35**), and `npm run build` successfully.
The checkout remained clean. The application bundle is 13.54 KB gzip; CSS is
4.89 KB gzip.

Cold production checks used `/opt/fleet/lib/verify-url.sh` on `/` and
`/?demo=1`, then a fresh mobile Chromium/Axe audit on every public route and
the direct 404. The audit records no app console errors, zero Axe violations,
no horizontal overflow, same-origin demo requests, proper titles/H1s/landmarks,
offline reload, the source-link attributes, and the designed HTTP 404. Evidence
is under [evidence/polish-6-live-home](evidence/polish-6-live-home/),
[evidence/polish-6-live-demo](evidence/polish-6-live-demo/),
[evidence/polish-6-live-404](evidence/polish-6-live-404/), and
[evidence/polish-6-live-audit.json](evidence/polish-6-live-audit.json).

Live mobile Lighthouse scored **100 performance, 100 accessibility, 100 best
practices, and 100 SEO** (LCP 1.4 s, CLS 0.045). The deployed JavaScript
SHA-256 equals the local build:
`d1e672bd2051af254afc878ff9b4c380048ff4dc9a95e176b3bed8b1bbad0b02`.

## Known gaps and next steps

None. The release is fully free in this scope; it has no checkout or license
flow. Future paid work would require a separately registered and verified
Sociobot billing product before user-facing paid copy is added.
