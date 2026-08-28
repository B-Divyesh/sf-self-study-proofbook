# Self-Study Proofbook

Record cited math and CS problems, timed attempts, revisions, and mastery
evidence in a private offline ledger.

Self-Study Proofbook is for serious self-learners who need evidence of what they
can solve. Proofbook records practice; it does not issue credentials.

Live site: <https://self-study-proofbook.sociobot.in>

Demo: <https://self-study-proofbook.sociobot.in/demo>

## What it does

- Groups problem attempts by topic and study goal.
- Records a source citation, problem reference, and optional source link.
- Times an attempt and preserves each changed solution as a revision.
- Adds a learner-set status and confidence score.
- Exports JSON with every revision and one CSV row per attempt.
- Creates a printable mastery index with sources, time, status, and revisions.
- Creates a password-encrypted backup with AES-256-GCM. The password is not saved.
- Works offline after the first visit.

JSON, CSV, printing, and password-encrypted backups are included in the local
ledger.

## Privacy and ownership

Study entries stay in the browser unless the learner exports them. IndexedDB
stores the ledger. The demo uses a separate database and never copies sample
records into the real ledger.

JSON is the complete archive and keeps every revision. CSV is useful for a
spreadsheet. Backups use AES-256-GCM encryption with a key derived from the
learner's password. The password is never stored.

Read the in-app [privacy page](https://self-study-proofbook.sociobot.in/privacy)
and [terms](https://self-study-proofbook.sociobot.in/terms).

## Run and test

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
npm test
npm run build
```

`npm run build` is the deployment command. It writes the static site to
`dist/`, with `dist/index.html` at the root.

Tests use Playwright 1.58.2 and Chromium. They cover every claim in
[`.factory/claims.json`](.factory/claims.json), including offline reload,
isolated demo storage, revision history, downloads, and the print route.

## Project notes

- `src/db.ts` owns the two IndexedDB namespaces.
- `src/crypto.ts` implements password-encrypted archives with Web Crypto.
- `vite.config.ts` generates the service worker and static route documents.
- `.factory/design.md` records the product-specific visual system and art
  provenance.
- `.factory/demo.md` documents the clean demo sandbox.

The generated hero art is original to this product. Departure Mono is bundled
under its license in `public/fonts/DEPARTURE_MONO_LICENSE.txt`. Application code
is available under the [MIT License](LICENSE).
