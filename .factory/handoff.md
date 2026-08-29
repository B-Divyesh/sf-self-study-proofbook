# Self-Study Proofbook — repair 8 handoff

## Result

**PASS — verifier finding V11-M1 is repaired, tested, pushed, and deployed.**

The implementation is commit `c7e12e650bff611792fc3326a246422c3e689db1`
on `main`. Version `1.0.2` is live at
<https://self-study-proofbook.sociobot.in> through static deployment
`9394b9e9-6cde-4691-94bf-e8bdb6452da1`.

## Finding and repair

The candidate reproduced V11-M1 exactly at 390 × 844 CSS px: the visible
“Open source link for Dijkstra’s algorithm reference in a new tab” target was
`208.921875 × 17` px.

The shared source-link renderer now gives every saved source URL a dedicated
`.source-link` class. Its link target is an inline flex box with a 44 px minimum
width and height, centered content, and safe wrapping. This repairs the shared
rendering path for sample, newly created, reloaded, and imported attempts.

The new Playwright regression, **every visible source link is at least 44px on
mobile without horizontal overflow**, loads `/demo` at 390 × 844, requires at
least one visible source link, measures every visible source-link target, and
checks both dimensions plus page overflow. It fails on the candidate and passes
on this repair.

Local and live measurements are both `216.921875 × 44` px. The live all-control
census found 29 visible controls, no target below 44 × 44, and 0 px horizontal
overflow. See [local mobile audit](evidence/repair-8-local-mobile-audit.json)
and [live audit](evidence/repair-8-live-audit.json).

## Verification

- The exact work-order command `npm ci && npm test && npm run build` passed:
  24 packages installed, 0 vulnerabilities, **36/36** Playwright tests, and a
  successful TypeScript and Vite production build. There is no separate lint
  command; `tsc --noEmit` runs in `npm run build`.
- All 18 commands in `.factory/claims.json` passed independently. Each claim ID
  occurs in exactly one tagged test. `npm audit --audit-level=high` also passed
  with 0 vulnerabilities.
- The build contains `dist/index.html`. Initial JavaScript is 43,577 bytes raw /
  13.54 kB gzip; CSS is 18,932 bytes raw / 4.93 kB gzip.
- The prescribed URL verifier passed local and live `/` and `/?demo=1` with the
  correct titles, `lang=en`, one H1, a main landmark, alt text, named buttons,
  and no console errors. Desktop and 390 px screenshots are under
  [local home](evidence/repair-8-local-home/),
  [local demo](evidence/repair-8-local-demo/),
  [live home](evidence/repair-8-live-home/), and
  [live demo](evidence/repair-8-live-demo/).
- Fresh live Axe scans found 0 violations on `/`, `/demo`, `/app`,
  `/print?demo=1`, `/privacy`, `/terms`, and the designed 404. The 404 document
  returns HTTP 404; its expected failed-document console line is the only
  recorded console error. Valid routes have none.
- Keyboard checks confirm the skip link is first, Enter moves focus to main,
  Enter opens the named Add topic dialog, Escape closes it, and focus returns
  to the opener. At 200% page scale, the H1 and main remain visible with no
  document-width increase; see [zoom evidence](evidence/repair-8-live-zoom.json).
  Reduced motion reports zero animation and transition duration with automatic
  scrolling.
- The audited live mobile session made requests only to the product origin. The
  service worker controls `/demo`; an offline reload returns all three sample
  attempts. A local two-version simulation displayed “An update is ready.
  Reload to use it.”, retained the demo after reload, and removed the old cache;
  see [update evidence](evidence/repair-8-local-sw-update.json).
- Live response policy has the self-only CSP with `frame-ancestors 'none'`,
  HSTS, `nosniff`, strict referrer policy, restricted permissions, 30-second
  revalidation for HTML/manifest/worker, one-year immutable caching for hashed
  assets, the correct manifest MIME type, and a real 404.
- All **30/30** deployable local files match live bytes exactly; see
  [delivery identity](evidence/repair-8-live-delivery.json). The live JavaScript
  SHA-256 is `ce19e2e9d9af75572bdef3721f511eb9c68acd9dd80e632b235f9ff94b997db7`.
- Live mobile Lighthouse scored **99 performance, 100 accessibility,
  100 best practices, and 100 SEO**. FCP was 1.1 s, LCP 1.4 s, TBT 90 ms,
  CLS 0.045, and transfer was 89 KiB, with no warnings. See
  [Lighthouse evidence](evidence/repair-8-lighthouse-live-mobile.json).

## Applicability and known gaps

No release-blocking gaps remain. This is still the researched static,
browser-only, local-first PWA. It has no package/consumer surface, backend,
rate-limit contract, AI call, sign-in, or paid checkout to test. The free
release behavior, isolated demo, storage namespaces, exports, and original
visual system are unchanged.
