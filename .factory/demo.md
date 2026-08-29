# Demo sandbox

- URL: `/?demo=1` (the `/demo` route opens the same isolated sample ledger).
- Sample: three cited attempts across real analysis, graph algorithms, and
  abstract algebra. The selected graph-algorithms attempt includes a visible
  HTTPS source link. The records include working, revised, and mastered states,
  timed effort, reflections, and revision history.
- Storage: IndexedDB database `proofbook-demo-v1`. Real records use the separate
  `proofbook-v1` database. Code in demo mode never opens the real database.
- Reset: choose **Reset demo** in the persistent amber banner.
- Leave: choose **Start for real**. This deletes the demo database and opens the
  real, empty proofbook. Sample records are never copied.
- Offline: open `/demo` once, wait for the page to settle, then disconnect and
  reload. The service worker caches the app shell and sample data ships in the
  JavaScript bundle.
