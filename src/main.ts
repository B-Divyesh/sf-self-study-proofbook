import './style.css';
import { clearDemo, loadState, resetDemo, saveState } from './db';
import { decryptArchive, encryptArchive } from './crypto';
import type { Attempt, AttemptStatus, ProofbookState, Topic } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const path = location.pathname.replace(/\/$/, '') || '/';
let demo = path === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
let state: ProofbookState | null = null;
let timerTick: number | undefined;

const routeInfo: Record<string, { title: string; description: string }> = {
  '/': { title: 'Self-Study Proofbook — Record problems you can solve', description: 'Record cited math and CS problems, timed attempts, solution revisions, and a printable mastery index in your browser.' },
  '/app': { title: 'Your proofbook — Self-Study Proofbook', description: 'Write and review your private problem-solving record.' },
  '/demo': { title: 'Demo — Self-Study Proofbook', description: 'Try a sample proofbook without saving to your real records.' },
  '/print': { title: 'Mastery index — Self-Study Proofbook', description: 'Print a compact index of your problem-solving evidence.' },
  '/privacy': { title: 'Privacy — Self-Study Proofbook', description: 'How Self-Study Proofbook stores and handles your data.' },
  '/terms': { title: 'Terms — Self-Study Proofbook', description: 'Terms for using Self-Study Proofbook.' },
  '/404': { title: 'Page not found — Self-Study Proofbook', description: 'Return to Self-Study Proofbook.' },
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
}

function markdown(value: string): string {
  const safe = escapeHtml(value);
  return safe.split(/\n{2,}/).map((block) => {
    if (/^#{1,3} /.test(block)) {
      const level = Math.min(3, block.match(/^#+/)![0].length) + 2;
      return `<h${level}>${inline(block.replace(/^#{1,3} /, ''))}</h${level}>`;
    }
    if (block.split('\n').every((line) => /^[-*] /.test(line))) {
      return `<ul>${block.split('\n').map((line) => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
    }
    return `<p>${inline(block).replaceAll('\n', '<br>')}</p>`;
  }).join('');
}

function inline(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function safeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

function uid(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function secondsFor(attempt: Attempt): number {
  if (!attempt.timerStartedAt) return attempt.elapsedSeconds;
  return attempt.elapsedSeconds + Math.floor((Date.now() - new Date(attempt.timerStartedAt).getTime()) / 1000);
}

function duration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return hours ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

function statusLabel(status: AttemptStatus): string {
  return ({ working: 'Working', revised: 'Revised', mastered: 'Mastered' })[status];
}

function shell(content: string, active = ''): string {
  const demoBanner = demo ? `<aside class="demo-banner" aria-label="Demo status"><span><strong>Demo</strong> — sample data, nothing is saved to your proofbook.</span><span class="banner-actions"><button class="text-button" id="reset-demo">Reset demo</button><button class="text-button" id="start-real">Start for real</button></span></aside>` : '';
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demoBanner}
    <header class="site-header">
      <a class="wordmark" href="/" data-route aria-label="Self-Study Proofbook home"><span class="wordmark-mark" aria-hidden="true">P:</span><span>PROOFBOOK</span></a>
      <nav aria-label="Main navigation">
        <a href="/demo" data-route ${active === 'demo' ? 'aria-current="page"' : ''}>Demo</a>
        <a href="/app" data-route ${active === 'app' ? 'aria-current="page"' : ''}>My proofbook</a>
        <a href="/privacy" data-route ${active === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
      </nav>
    </header>
    <main id="main" tabindex="-1">${content}</main>
    <footer>
      <p>Evidence of practice, kept by the learner.</p>
      <nav aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
      <p class="build">v1.0.0 · Original generated art</p>
    </footer>
    <div class="route-status sr-only" aria-live="polite"></div>
    <div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
  `;
}

function landing(): string {
  return shell(`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">PRIVATE PRACTICE LEDGER / 01</p>
        <h1 tabindex="-1">Record problems you can solve</h1>
        <p class="lede">For serious math and CS learners who need evidence beyond course badges.</p>
        <div class="hero-actions">
          <a class="button primary" href="/demo" data-route>Try it with sample data</a>
          <span>Opens a separate sample ledger.</span>
        </div>
        <a class="text-link" href="/app" data-route>Start your proofbook</a>
        <ul class="facts" aria-label="Product facts">
          <li><span aria-hidden="true">■</span> Entries stay in this browser</li>
          <li><span aria-hidden="true">■</span> Works offline after your first visit</li>
          <li><span aria-hidden="true">■</span> Exports and backups included</li>
        </ul>
      </div>
      <figure class="hero-art">
        <picture>
          <source srcset="/assets/hero-proof-terminal-640.webp 640w, /assets/hero-proof-terminal-1120.webp 1120w" type="image/webp" />
          <img src="/assets/hero-proof-terminal-1120.webp" width="1120" height="747" alt="A pixel-art study desk where problem cards form an ordered evidence map." fetchpriority="high" decoding="async" />
        </picture>
        <figcaption>Each attempt becomes one cited, revisable record.</figcaption>
      </figure>
    </section>
    <section class="live-preview" aria-labelledby="preview-title">
      <div class="section-index">LIVE PREVIEW / 02</div>
      <div class="section-heading"><h2 id="preview-title">See the work, not a badge</h2><p>A mastery index points back to sources, time spent, and revision history.</p></div>
      <div class="preview-ledger" aria-label="Sample mastery index">
        <div class="ledger-head"><span>Problem</span><span>Source</span><span>Time</span><span>Evidence</span></div>
        <div class="ledger-row"><strong>Uniform limit theorem</strong><span>Analysis §6.2.7</span><span>41 min</span><span class="status mastered">Mastered</span></div>
        <div class="ledger-row"><strong>Dijkstra’s greedy step</strong><span>Algorithms §4.4</span><span>32 min</span><span class="status revised">Revised</span></div>
        <div class="ledger-row"><strong>Lagrange from cosets</strong><span>Algebra §7</span><span>13 min</span><span class="status working">Working</span></div>
      </div>
    </section>
    <section class="how" aria-labelledby="how-title">
      <div class="section-index">METHOD / 03</div>
      <h2 id="how-title">Build evidence in three steps</h2>
      <ol>
        <li><span>01</span><div><h3>Cite the problem</h3><p>Name the book, paper, exam, or page. Do not copy restricted problem text.</p></div></li>
        <li><span>02</span><div><h3>Time and revise your solution</h3><p>Keep each saved version. Add a short note about what changed.</p></div></li>
        <li><span>03</span><div><h3>Print your mastery index</h3><p>Review a compact list with sources, effort, status, and revision counts.</p></div></li>
      </ol>
    </section>
    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><div class="section-index">BOUNDARIES / 04</div><h2 id="boundaries-title">A record, not a credential</h2></div>
      <div><p>Proofbook does not grade, proctor, certify, or generate answers.</p><p>Your entries stay in this browser unless you export them.</p><p>Use source citations. Do not store copyrighted problem text you cannot redistribute.</p></div>
    </section>
    <section class="paid" id="paid" aria-labelledby="paid-title">
      <div class="paid-price"><span>∞</span><small>your local archive</small></div>
      <div><div class="section-index">FULL ARCHIVE / 05</div><h2 id="paid-title">Keep a complete encrypted archive</h2><p>Record attempts, then export JSON, CSV, a print index, or a password-encrypted backup.</p><div class="paid-actions"><a class="button primary" href="/app" data-route>Start your proofbook</a></div><p class="legal-note">Your archive stays in this browser until you choose to download it.</p></div>
    </section>
  `);
}

function topicName(id: string): string {
  return state?.topics.find((topic) => topic.id === id)?.name ?? 'Unknown topic';
}

function appView(): string {
  if (!state) return shell(`<section class="loading"><h1 tabindex="-1">Open your proofbook</h1><p>Reading your local ledger…</p></section>`, demo ? 'demo' : 'app');
  const selected = state.attempts.find((attempt) => attempt.id === state!.selectedAttemptId) ?? state.attempts[0];
  const topicItems = state.topics.map((topic) => {
    const count = state!.attempts.filter((attempt) => attempt.topicId === topic.id).length;
    const active = selected?.topicId === topic.id;
    return `<button class="topic-item" data-topic="${topic.id}" ${active ? 'aria-current="true"' : ''}><span>${escapeHtml(topic.name)}</span><span>${count}</span></button>`;
  }).join('');
  const shown = selected ? state.attempts.filter((attempt) => attempt.topicId === selected.topicId) : state.attempts;
  const attempts = shown.map((attempt) => `<button class="attempt-row" data-attempt="${attempt.id}" ${attempt.id === selected?.id ? 'aria-current="true"' : ''}><span><strong>${escapeHtml(attempt.title)}</strong><small>${escapeHtml(attempt.problemRef)}</small></span><span class="status ${attempt.status}">${statusLabel(attempt.status)}</span></button>`).join('');
  const content = selected ? editor(selected) : emptyLedger();
  return shell(`
    <section class="workspace-head">
      <div><p class="eyebrow">LOCAL LEDGER / ${demo ? 'DEMO' : 'PRIVATE'}</p><h1 tabindex="-1">Build proof you can revisit</h1><p>${state.attempts.length} attempt${state.attempts.length === 1 ? '' : 's'} across ${state.topics.length} topic${state.topics.length === 1 ? '' : 's'}.</p></div>
      <div class="workspace-actions"><button class="button secondary" id="new-topic">Add topic</button><button class="button primary" id="new-attempt">Record attempt</button></div>
    </section>
    <section class="workspace" aria-label="Proofbook workspace">
      <aside class="topic-rail"><div class="rail-title"><h2>Topics</h2><span>${state.topics.length}</span></div><div class="topic-list">${topicItems || '<p class="empty-small">Add a topic to group your attempts.</p>'}</div></aside>
      <div class="attempt-list"><div class="rail-title"><h2>Attempts</h2><span>${shown.length}</span></div>${attempts || '<p class="empty-small">No attempts in this topic yet.</p>'}</div>
      <div class="editor-panel">${content}</div>
    </section>
    <section class="archive-tools" aria-labelledby="archive-title">
      <div><p class="eyebrow">OWN YOUR WORK</p><h2 id="archive-title">Export and review</h2><p>JSON keeps every revision. CSV gives one row per attempt.</p></div>
      <div class="tool-actions"><button class="button secondary" id="export-json">Export JSON</button><button class="button secondary" id="export-csv">Export CSV</button><a class="button secondary" href="/print${demo ? '?demo=1' : ''}" data-route>Print mastery index</a><button class="button secondary" id="import-json">Import archive</button><button class="button secondary" id="encrypt-export">Export encrypted backup</button></div>
      <input type="file" id="import-file" accept=".json,.proofbook" hidden />
    </section>
    ${dialogs()}
  `, demo ? 'demo' : 'app');
}

function emptyLedger(): string {
  return `<div class="empty-state"><div class="pixel-glyph" aria-hidden="true">□<br>└─</div><h2>Your attempts will appear here</h2><p>Add a topic, then record one problem you tried to solve.</p><button class="button primary" id="empty-add">Add your first topic</button></div>`;
}

function editor(attempt: Attempt): string {
  const history = attempt.revisions.slice().reverse().map((revision, index) => `<details><summary>Revision ${attempt.revisions.length - index} · ${formatDate(revision.at)}</summary><div class="revision-body">${markdown(revision.solution)}${revision.reflection ? `<p class="reflection"><strong>Reflection:</strong> ${escapeHtml(revision.reflection)}</p>` : ''}</div></details>`).join('');
  const sourceUrl = safeExternalUrl(attempt.sourceUrl);
  const source = sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" rel="external noreferrer">${escapeHtml(attempt.source)} <span class="sr-only">(external site)</span></a>` : escapeHtml(attempt.source);
  return `
    <article class="attempt-editor">
      <div class="attempt-meta"><span class="status ${attempt.status}">${statusLabel(attempt.status)}</span><span>${escapeHtml(topicName(attempt.topicId))}</span><span>Updated ${formatDate(attempt.updatedAt)}</span></div>
      <h2>${escapeHtml(attempt.title)}</h2>
      <p class="source-line"><span>Source</span> ${source} · ${escapeHtml(attempt.problemRef)}</p>
      <div class="timer-panel"><div><span>Attempt time</span><strong data-timer-display="${attempt.id}">${duration(secondsFor(attempt))}</strong></div><button class="button timer" id="toggle-timer">${attempt.timerStartedAt ? 'Pause timer' : 'Start timer'}</button></div>
      <form id="attempt-form">
        <div class="field"><label for="solution">Solution notes <span>Markdown</span></label><textarea id="solution" name="solution" rows="12">${escapeHtml(attempt.solution)}</textarea></div>
        <div class="preview"><div class="preview-label">Preview</div><div id="markdown-preview" class="prose">${markdown(attempt.solution) || '<p>Your formatted solution appears here.</p>'}</div></div>
        <div class="field"><label for="reflection">What changed or remains uncertain?</label><textarea id="reflection" name="reflection" rows="3">${escapeHtml(attempt.reflection)}</textarea></div>
        <div class="editor-grid">
          <div class="field"><label for="status">Evidence status</label><select id="status" name="status"><option value="working" ${attempt.status === 'working' ? 'selected' : ''}>Working</option><option value="revised" ${attempt.status === 'revised' ? 'selected' : ''}>Revised</option><option value="mastered" ${attempt.status === 'mastered' ? 'selected' : ''}>Mastered</option></select></div>
          <fieldset><legend>Confidence</legend><div class="confidence">${[1,2,3,4].map((n) => `<label><input type="radio" name="confidence" value="${n}" ${attempt.confidence === n ? 'checked' : ''} /><span>${n}</span></label>`).join('')}</div></fieldset>
        </div>
        <div class="form-actions"><button class="button primary" type="submit">Save revision</button><button class="text-button danger" type="button" id="delete-attempt">Delete attempt</button><span id="save-status" role="status"></span></div>
      </form>
      <section class="history" aria-labelledby="history-title"><div class="history-head"><h3 id="history-title">Revision history</h3><span>${attempt.revisions.length}</span></div>${history || '<p class="empty-small">Earlier saved solutions will appear here.</p>'}</section>
    </article>`;
}

function dialogs(): string {
  const topicOptions = state?.topics.map((topic) => `<option value="${topic.id}">${escapeHtml(topic.name)}</option>`).join('') ?? '';
  return `
    <dialog id="topic-dialog"><form method="dialog" id="topic-form"><div class="dialog-head"><h2>Add a topic</h2><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><div class="field"><label for="topic-name">Topic name</label><input id="topic-name" name="name" required maxlength="60" /></div><div class="field"><label for="topic-goal">Study goal</label><input id="topic-goal" name="goal" maxlength="140" /></div><div class="dialog-actions"><button class="button secondary" value="cancel">Cancel</button><button class="button primary" value="default" id="save-topic">Add topic</button></div></form></dialog>
    <dialog id="attempt-dialog"><form method="dialog" id="new-attempt-form"><div class="dialog-head"><h2>Record an attempt</h2><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><div class="field"><label for="attempt-topic">Topic</label><select id="attempt-topic" name="topicId" required>${topicOptions}</select></div><div class="field"><label for="attempt-title">Problem title</label><input id="attempt-title" name="title" required maxlength="100" /></div><div class="field"><label for="attempt-source">Source</label><input id="attempt-source" name="source" required maxlength="120" /></div><div class="field"><label for="attempt-ref">Problem reference</label><input id="attempt-ref" name="problemRef" required maxlength="100" /></div><div class="field"><label for="attempt-url">Source link <span>Optional</span></label><input id="attempt-url" name="sourceUrl" type="url" /></div><p class="form-help">Cite the source. Do not paste copyrighted problem text.</p><div class="dialog-actions"><button class="button secondary" value="cancel">Cancel</button><button class="button primary" value="default" id="save-attempt">Start attempt</button></div></form></dialog>
    <dialog id="password-dialog"><form method="dialog" id="password-form"><div class="dialog-head"><h2>Password-protect this backup</h2><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><p>You need this password to open the backup. It cannot be recovered.</p><div class="field"><label for="backup-password">Password</label><input id="backup-password" name="password" type="password" minlength="10" required /></div><div class="dialog-actions"><button class="button secondary" value="cancel">Cancel</button><button class="button primary" id="make-backup" value="default">Download encrypted backup</button></div></form></dialog>
  `;
}

function printView(): string {
  if (!state) return shell('<section class="loading"><h1 tabindex="-1">Prepare your mastery index</h1><p>Reading your local ledger…</p></section>');
  const rows = state.attempts.map((attempt) => `<tr><td><strong>${escapeHtml(attempt.title)}</strong><small>${escapeHtml(topicName(attempt.topicId))}</small></td><td>${escapeHtml(attempt.source)}<small>${escapeHtml(attempt.problemRef)}</small></td><td>${duration(secondsFor(attempt))}</td><td>${statusLabel(attempt.status)} · ${attempt.confidence}/4</td><td>${attempt.revisions.length}</td><td>${formatDate(attempt.updatedAt)}</td></tr>`).join('');
  return shell(`<section class="print-page"><div class="print-head"><div><p class="eyebrow">SELF-STUDY EVIDENCE</p><h1 tabindex="-1">Mastery index</h1><p>${state.attempts.length} cited attempts across ${state.topics.length} topics. Generated ${formatDate(new Date().toISOString())}.</p></div><div class="no-print"><button class="button primary" id="print-index">Print index</button><a class="button secondary" href="${demo ? '/demo' : '/app'}" data-route>Back to proofbook</a></div></div><div class="print-disclaimer">This learner-maintained record is not an accredited credential.</div><table><thead><tr><th>Problem</th><th>Source</th><th>Time</th><th>Evidence</th><th>Revisions</th><th>Updated</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No attempts recorded yet.</td></tr>'}</tbody></table></section>`);
}

function legalView(kind: 'privacy' | 'terms'): string {
  const isPrivacy = kind === 'privacy';
  return shell(`<article class="legal"><p class="eyebrow">PLAIN TERMS / ${isPrivacy ? 'PRIVACY' : 'USE'}</p><h1 tabindex="-1">${isPrivacy ? 'Your work stays yours' : 'Use Proofbook honestly'}</h1>${isPrivacy ? `
    <h2>What this app stores</h2><p>Proofbook stores topics, attempts, timers, and revisions in your browser. Demo data uses a separate browser database.</p>
    <h2>What leaves your device</h2><p>Your study records do not leave your device unless you export them.</p>
    <h2>Deleting your data</h2><p>Delete attempts inside the app. You can also clear this site’s stored data in your browser settings.</p>
    <h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with privacy questions.</p>` : `
    <h2>Your records</h2><p>You are responsible for your entries and backups. This app does not certify knowledge or issue credentials.</p>
    <h2>Source material</h2><p>Cite books, papers, and exams. Do not copy material you lack permission to store or share.</p>
    <h2>Availability</h2><p>The app is provided as-is. Keep exported backups of work you cannot replace.</p>
    <h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> for support.</p>`}</article>`, kind);
}

function notFound(): string {
  return shell(`<section class="not-found"><div class="error-code" aria-hidden="true">4□4</div><h1 tabindex="-1">This page is outside the ledger</h1><p>The address does not match a Proofbook page.</p><a class="button primary" href="/" data-route>Return home</a></section>`);
}

function setMeta(route: string): void {
  const info = routeInfo[route] ?? routeInfo['/404'];
  document.title = info.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', info.description);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `https://self-study-proofbook.sociobot.in${route === '/' ? '/' : route}`;
}

async function navigate(next: string, push = true, focusHeading = true): Promise<void> {
  const url = new URL(next, location.origin);
  if (url.origin !== location.origin) { location.href = url.href; return; }
  if (push) history.pushState({}, '', url.pathname + url.search);
  const route = url.pathname.replace(/\/$/, '') || '/';
  demo = route === '/demo' || url.searchParams.get('demo') === '1';
  setMeta(routeInfo[route] ? route : '/404');
  clearInterval(timerTick);
  if (route === '/app' || route === '/demo' || route === '/print') {
    state = await loadState(demo);
  }
  app.innerHTML = route === '/' ? landing() : route === '/app' || route === '/demo' ? appView() : route === '/print' ? printView() : route === '/privacy' ? legalView('privacy') : route === '/terms' ? legalView('terms') : notFound();
  bindCommon();
  if (route === '/app' || route === '/demo') bindApp();
  if (route === '/print') document.querySelector('#print-index')?.addEventListener('click', () => print());
  if (focusHeading) document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  document.querySelector('.route-status')!.textContent = document.querySelector('h1')?.textContent ?? '';
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

function bindCommon(): void {
  document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector<HTMLElement>('#main')?.focus();
  });
  document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || link.target) return;
    event.preventDefault();
    void navigate(link.href);
  }));
  document.querySelector('#reset-demo')?.addEventListener('click', async () => { state = await resetDemo(); showToast('Demo restored to its starting point.'); await navigate('/demo', false); });
  document.querySelector('#start-real')?.addEventListener('click', async () => { await clearDemo(); await navigate('/app'); });
}

function openDialog(id: string): void {
  document.querySelector<HTMLDialogElement>(`#${id}`)?.showModal();
}

function bindApp(): void {
  if (!state) return;
  document.querySelectorAll<HTMLButtonElement>('[data-topic]').forEach((button) => button.addEventListener('click', async () => {
    const first = state!.attempts.find((attempt) => attempt.topicId === button.dataset.topic);
    state!.selectedAttemptId = first?.id ?? null;
    await persistAndRender();
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-attempt]').forEach((button) => button.addEventListener('click', async () => {
    state!.selectedAttemptId = button.dataset.attempt ?? null;
    await persistAndRender();
  }));
  const openTopic = () => openDialog('topic-dialog');
  document.querySelector('#new-topic')?.addEventListener('click', openTopic);
  document.querySelector('#empty-add')?.addEventListener('click', openTopic);
  document.querySelector('#new-attempt')?.addEventListener('click', () => state!.topics.length ? openDialog('attempt-dialog') : openTopic());
  bindCreateForms();
  bindEditor();
  bindArchive();
  timerTick = window.setInterval(updateTimerDisplay, 1000);
}

function bindCreateForms(): void {
  const topicForm = document.querySelector<HTMLFormElement>('#topic-form');
  document.querySelector('#save-topic')?.addEventListener('click', async (event) => {
    if (!topicForm?.reportValidity()) { event.preventDefault(); return; }
    const data = new FormData(topicForm);
    const topic: Topic = { id: uid('topic'), name: String(data.get('name')).trim(), goal: String(data.get('goal')).trim() };
    state!.topics.push(topic);
    state!.updatedAt = new Date().toISOString();
    await saveState(demo, state!);
    await navigate(demo ? '/demo' : '/app', false);
    showToast(`${topic.name} added.`);
  });
  const attemptForm = document.querySelector<HTMLFormElement>('#new-attempt-form');
  document.querySelector('#save-attempt')?.addEventListener('click', async (event) => {
    if (!attemptForm?.reportValidity()) { event.preventDefault(); return; }
    const data = new FormData(attemptForm);
    const timestamp = new Date().toISOString();
    const attempt: Attempt = {
      id: uid('attempt'), topicId: String(data.get('topicId')), title: String(data.get('title')).trim(), source: String(data.get('source')).trim(), sourceUrl: String(data.get('sourceUrl')).trim(), problemRef: String(data.get('problemRef')).trim(), startedAt: timestamp, elapsedSeconds: 0, timerStartedAt: timestamp, status: 'working', confidence: 1, solution: '', reflection: '', revisions: [], createdAt: timestamp, updatedAt: timestamp,
    };
    state!.attempts.unshift(attempt);
    state!.selectedAttemptId = attempt.id;
    await saveState(demo, state!);
    await navigate(demo ? '/demo' : '/app', false);
    showToast('Attempt started. The timer is running.');
  });
}

function bindEditor(): void {
  const attempt = state?.attempts.find((item) => item.id === state!.selectedAttemptId);
  if (!attempt) return;
  const solution = document.querySelector<HTMLTextAreaElement>('#solution');
  solution?.addEventListener('input', () => { document.querySelector('#markdown-preview')!.innerHTML = markdown(solution.value) || '<p>Your formatted solution appears here.</p>'; });
  document.querySelector('#toggle-timer')?.addEventListener('click', async () => {
    if (attempt.timerStartedAt) {
      attempt.elapsedSeconds = secondsFor(attempt);
      attempt.timerStartedAt = null;
      showToast('Timer paused.');
    } else {
      attempt.timerStartedAt = new Date().toISOString();
      showToast('Timer started.');
    }
    await persistAndRender();
  });
  document.querySelector<HTMLFormElement>('#attempt-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const nextSolution = String(data.get('solution'));
    const nextReflection = String(data.get('reflection'));
    if ((attempt.solution || attempt.reflection) && (nextSolution !== attempt.solution || nextReflection !== attempt.reflection)) {
      attempt.revisions.push({ id: uid('revision'), at: attempt.updatedAt, solution: attempt.solution, reflection: attempt.reflection });
    }
    attempt.solution = nextSolution;
    attempt.reflection = nextReflection;
    attempt.status = String(data.get('status')) as AttemptStatus;
    attempt.confidence = Number(data.get('confidence')) as 1 | 2 | 3 | 4;
    attempt.updatedAt = new Date().toISOString();
    state!.updatedAt = attempt.updatedAt;
    await saveState(demo, state!);
    await navigate(demo ? '/demo' : '/app', false);
    document.querySelector('.attempt-editor')?.classList.add('just-saved');
    showToast('Revision saved.');
  });
  document.querySelector('#delete-attempt')?.addEventListener('click', async () => {
    if (!confirm(`Delete “${attempt.title}” and its ${attempt.revisions.length} earlier revision${attempt.revisions.length === 1 ? '' : 's'}?`)) return;
    state!.attempts = state!.attempts.filter((item) => item.id !== attempt.id);
    state!.selectedAttemptId = state!.attempts[0]?.id ?? null;
    await persistAndRender();
    showToast('Attempt deleted.');
  });
}

function updateTimerDisplay(): void {
  const attempt = state?.attempts.find((item) => item.id === state!.selectedAttemptId);
  const display = document.querySelector<HTMLElement>('[data-timer-display]');
  if (attempt && display) display.textContent = duration(secondsFor(attempt));
}

async function persistAndRender(): Promise<void> {
  if (!state) return;
  state.updatedAt = new Date().toISOString();
  await saveState(demo, state);
  await navigate(demo ? '/demo' : '/app', false);
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvValue(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function bindArchive(): void {
  document.querySelector('#export-json')?.addEventListener('click', () => download(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), 'proofbook-archive.json'));
  document.querySelector('#export-csv')?.addEventListener('click', () => {
    const header = ['topic', 'problem', 'source', 'reference', 'seconds', 'status', 'confidence', 'revisions', 'updated'];
    const rows = state!.attempts.map((attempt) => [topicName(attempt.topicId), attempt.title, attempt.source, attempt.problemRef, secondsFor(attempt), attempt.status, attempt.confidence, attempt.revisions.length, attempt.updatedAt].map(csvValue).join(','));
    download(new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv' }), 'proofbook-attempts.csv');
  });
  const fileInput = document.querySelector<HTMLInputElement>('#import-file');
  document.querySelector('#import-json')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      let text: string;
      if (file.name.endsWith('.proofbook')) {
        const password = prompt('Enter the password for this backup.');
        if (!password) return;
        text = await decryptArchive(await file.arrayBuffer(), password);
      } else text = await file.text();
      const parsed = JSON.parse(text) as ProofbookState;
      if (!Array.isArray(parsed.topics) || !Array.isArray(parsed.attempts)) throw new Error('The archive is missing topics or attempts.');
      if (!confirm(`Replace this ledger with ${parsed.attempts.length} imported attempts?`)) return;
      state = parsed;
      await persistAndRender();
      showToast('Archive imported.');
    } catch (error) { showToast(error instanceof Error ? error.message : 'The archive could not be imported.'); }
  });
  document.querySelector('#encrypt-export')?.addEventListener('click', () => {
    openDialog('password-dialog');
  });
  const passwordForm = document.querySelector<HTMLFormElement>('#password-form');
  document.querySelector('#make-backup')?.addEventListener('click', async (event) => {
    if (!passwordForm?.reportValidity()) { event.preventDefault(); return; }
    event.preventDefault();
    const password = String(new FormData(passwordForm).get('password'));
    download(await encryptArchive(JSON.stringify(state), password), 'proofbook-backup.proofbook');
    passwordForm.reset();
    document.querySelector<HTMLDialogElement>('#password-dialog')?.close();
    showToast('Encrypted backup downloaded.');
  });
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, 3500);
}

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An update is ready. Reload to use it.');
      });
    });
  }).catch(() => { /* The app still works without installation support. */ });
}

window.addEventListener('popstate', () => void navigate(location.pathname + location.search, false));
// On the first load, leave focus at the document start so the skip link is the
// first keyboard stop. Client-side route changes still announce and focus H1.
await navigate(location.pathname + location.search, false, false);
registerServiceWorker();
