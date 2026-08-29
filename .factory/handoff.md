# Self-Study Proofbook — verification 13 handoff

## Result

**PASS** — candidate `cea8edae24f0fe9cfca85ecb25b02450ca20fb80` is verified at <https://self-study-proofbook.sociobot.in> on 2026-08-29 UTC.

Independent verification found no release-blocking defects. The earlier mobile legal-contact target failure remains repaired: all visible controls on the key live routes, including both contact links, meet 44 × 44 px at 390 px width.

## What was verified

- Cold first-read and one-click `/demo` sandbox gate passed.
- All 18 mandated `claims.json` commands passed from `npm ci`; complete Playwright suite passed 37/37.
- `npm run build`, TypeScript check, and high-severity audit passed. Initial JS is 13.54 kB gzip and CSS is 4.94 kB gzip.
- Live deployment matches 30/30 deployable build files byte-for-byte.
- Desktop/mobile, keyboard skip/focus, axe, response-header, privacy-request, 404, link, malformed-input, revision/export, offline-reload, and service-worker update checks passed.
- Live mobile Lighthouse scored 94 performance / 100 accessibility / 100 best practices / 100 SEO (LCP 1.4 s; CLS 0.045; 89 KiB transfer).

## How to run

```sh
npm ci
npm test
npm run build
```

Open `https://self-study-proofbook.sociobot.in/demo` to exercise the isolated sample ledger. The full independently collected evidence and applicability notes are in `.factory/verification-13.md`.

## Known gaps / next steps

No release blocker is known. This static local-first PWA has no backend, authentication, billing, AI, or package/CLI surface; server rate-limit and Entra checks do not apply.
