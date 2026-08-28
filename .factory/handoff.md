# Polish 1 handoff — Self-Study Proofbook

## Repair scope

Resolved every finding F-1-1 through F-1-9 in `.factory/review-1.md`. The
product keeps its pixel-proof-terminal visual system. The implementation adds a
functional `?demo=1` entry to the isolated sample ledger, visible persisted
topic goals, exact claim coverage for every visitor promise, and a full static
404 shell with route metadata.

## Verification before deployment

- `npm ci`: passed with zero audit vulnerabilities.
- `npm run build`: passed and produced `dist/`.
- `npm test`: 20/20 Playwright tests passed.
- All 15 exact commands listed in `.factory/claims.json` passed individually.
- `/opt/fleet/lib/verify-url.sh` passed against local `/` and `/demo`; see
  `.factory/evidence/polish-1-local-home/` and
  `.factory/evidence/polish-1-local-demo/`.
- The direct local unknown route returns HTTP 404 and includes its shared shell
  and metadata; see `.factory/evidence/polish-1-local-404/`.
- Axe integration found zero serious/critical violations on home, demo, app,
  print, privacy, terms, and the static 404. The existing offline claim runs a
  service-worker-controlled demo reload with `context.setOffline(true)`.
- A detached clean clone of pushed commit `255c353` at
  `/tmp/self-study-proofbook-clean-Sm8Tnz` completed `npm ci` with zero audit
  vulnerabilities, every one of the 15 exact claim commands, `npm test`
  (20/20), and `npm run build` successfully.

## Reproduce

Run `npm ci`, each command in `.factory/claims.json`, `npm test`, and `npm run
build`. The sample sandbox opens at `/demo` or `/?demo=1`; both use
`proofbook-demo-v1`, while real data uses `proofbook-v1`.

## Live deployment

- Deployed `6dfe00a` with `/opt/fleet/lib/deploy-static.sh self-study-proofbook
  dist`; Azure deployment `bbaf6cdd-f9bb-4727-8d90-1cd549504bef` succeeded.
- `https://self-study-proofbook.sociobot.in/` and `/demo` both passed
  `verify-url.sh` cold with no application console errors. Live captures are in
  `.factory/evidence/polish-1-live-home/` and
  `.factory/evidence/polish-1-live-demo/`.
- Live home SHA-256 equals the built `dist/index.html` SHA-256:
  `f4bbc73dd87dad1cf0795c6e648a32bd5ecb07dcc127fc0d17aab1141776bf6f`.
- Cold mobile Chromium checked `/`, `/?demo=1`, `/print?demo=1`, and
  `/not-a-proofbook-route`: first-screen wording, demo banner/reset, three
  samples, print disclaimer, shared 404 shell/metadata, and focusable routes
  all passed. The direct unknown URL returned HTTP 404. Its expected browser
  console message about the document's 404 status is not an application error.
