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

## Reproduce

Run `npm ci`, each command in `.factory/claims.json`, `npm test`, and `npm run
build`. The sample sandbox opens at `/demo` or `/?demo=1`; both use
`proofbook-demo-v1`, while real data uses `proofbook-v1`.

## Live deployment

This section is completed after the committed repair is deployed and checked
cold at `https://self-study-proofbook.sociobot.in`.
