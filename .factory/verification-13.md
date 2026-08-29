# Independent verification 13 — Self-Study Proofbook

## Verdict

**PASS** for candidate `cea8edae24f0fe9cfca85ecb25b02450ca20fb80` at <https://self-study-proofbook.sociobot.in> (verified 2026-08-29 UTC).

This was an independent, read-only product verification. No product source, configuration, deployment, or user data was changed. The only repository changes from this verification are this report and the required handoff update.

## First-read and demo gate

A cold desktop visit to the live page gave this answer without setup:

- **What:** “Record problems you can solve.”
- **For whom:** “serious math and CS learners who need evidence beyond course badges.”
- **What to do first:** the visible one-click **“Try it with sample data”** link, explained as “Opens a separate sample ledger.”

The first-read gate passes. `/demo` (and `/?demo=1`) immediately shows three realistic cited attempts and a persistent “Demo — sample data” banner with Reset demo and Start for real. The demo uses the separate `proofbook-demo-v1` IndexedDB namespace documented in `.factory/demo.md`.

## Required claim tests — PASS

`.factory/claims.json` is present and declares 18 claims. After `npm ci` from the supplied candidate checkout, I ran every listed command exactly as written, against the product's Playwright demo entry point. Every command passed:

| Claim ID | Result |
| --- | --- |
| `privacy-local` | PASS |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `revision-history` | PASS |
| `print-index` | PASS |
| `encrypted-backup` | PASS |
| `json-revisions` | PASS |
| `demo-isolation` | PASS |
| `archive-tools-included` | PASS |
| `cited-attempt` | PASS |
| `source-link` | PASS |
| `topics-and-goals` | PASS |
| `attempt-timer` | PASS |
| `evidence-status` | PASS |
| `json-complete-archive` | PASS |
| `no-credential-service` | PASS |
| `saved-data-recovery` | PASS |
| `safe-import-validation` | PASS |

The final Playwright result file was `status: passed` with no failed tests. The complete suite then passed **37/37** tests. This includes representative normal flows, boundary validation, malformed import preservation, corrupt saved data recovery, keyboard operation, source links, exports, timer persistence, and print-index coverage. No unlisted visitor-facing reliance claim was found in the landing copy or README.

## Build and delivery identity — PASS

- `npm ci`: installed 24 packages; npm reported 0 vulnerabilities.
- `npm test`: PASS, 37/37 Playwright tests.
- `npm run build`: PASS (`tsc --noEmit` and Vite); `dist/` produced.
- No separate lint/type-check script exists; TypeScript checking is part of the build.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Initial compiled JS: **43.62 kB raw / 13.54 kB gzip**; CSS: **19.10 kB raw / 4.94 kB gzip**. Both are below the static-product budgets.
- Freshly built deployable output matched live byte-for-byte: **30/30** served candidate files. `staticwebapp.config.json` is deliberately deployment-only, returns the styled 404 when requested, and is not a served product artifact.

## Live product, accessibility, and privacy — PASS

- The prescribed `verify-url.sh` passed on live `/` and `/demo`: each has the correct title, `lang=en`, one H1, a main landmark, image alt text, named controls, and no console/page errors.
- Fresh Playwright axe scans had **0 serious or critical findings** on `/`, `/demo`, `/app`, `/print?demo=1`, `/privacy`, `/terms`, and the designed 404.
- At 390 × 844, all visible interactive controls on those routes measured at least 44 × 44 CSS px and every route had 0 px horizontal overflow. This includes both legal-page mail links, the previous release-blocking defect.
- Keyboard-only smoke test: Tab first reached “Skip to main content” with a visible `rgb(185, 242, 39) solid 3px` focus ring; Enter moved focus to `<main>`. The suite also covers space activation, dialogs, and focus return.
- Reduced-motion behavior is covered by the committed test suite and the motion policy uses static alternatives. The deliberate single dark treatment and its contrast values are documented in `.factory/design.md`.
- Live demo editing saved a second revision; CSV downloaded as `proofbook-attempts.csv`; Start for real opened an empty real ledger; an empty topic produced “Topic name cannot be blank.”
- Request recording during the full live demo edit/export flow saw only the product origin (HTML, JS, CSS, and bundled font). There were no console or page errors. This confirms the browser-local privacy promise for the tested flow.
- Live responses send self-only CSP including `frame-ancestors 'none'`, HSTS, `nosniff`, `strict-origin-when-cross-origin`, and a restrictive permissions policy. HTML/worker/manifest use 30-second revalidation; hashed assets use one-year immutable caching. The manifest is correctly typed and provides standalone display, 192/512 icons, maskable icon, themed splash colors, and a versioned start URL.
- Every internal link observed across the key routes returned HTTP 200; the designed missing route correctly returned HTTP 404. The expected failed document console entry is the only 404 console error.
- Mobile Lighthouse on the live homepage: **94 performance / 100 accessibility / 100 best practices / 100 SEO**; FCP 1.1 s, LCP 1.4 s, TBT 280 ms, CLS 0.045, 89 KiB transfer.

## PWA and update behavior — PASS

On a fresh live browser context, `/demo` became controlled by `https://self-study-proofbook.sociobot.in/sw.js`; after setting the context offline, a reload still rendered the sample proofbook and its three attempts.

I also ran the candidate app against a controlled two-version local service worker simulation without changing product files. Version A created `proofbook-update-a`; a Version B update displayed **“An update is ready. Reload to use it.”**; after reload only `proofbook-update-b` remained and the demo still contained its three attempts. This exercises the candidate's `updatefound`, `skipWaiting`, `clients.claim`, cache replacement, and reload path.

## Applicability

This is a static, local-first PWA. It has no server-side API, authentication, Sociobot product-unlock request, billing flow, AI endpoint, package/CLI public API, or backend persistence boundary. Rate-limit and Entra tenant checks are therefore not applicable. It is intentionally free in this release; archive tools are not paywalled. No release-blocking defects were found.
