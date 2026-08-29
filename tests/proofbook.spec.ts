import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test('@claim:privacy-local entries remain in the browser', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', (request) => outgoing.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel('Solution notes Markdown').fill('A changed proof written in the demo.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await expect(page.getByText('Revision saved.')).toBeVisible();
  expect(outgoing.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL ?? '')).toMatch(/\/sw\.js$/);
  await expect.poll(() => page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    const names = await caches.keys();
    const cache = await caches.open(names.find((name) => name.startsWith('proofbook-')) ?? 'missing');
    return (await cache.match('/index.html'))?.ok ?? false;
  })).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build proof you can revisit');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build proof you can revisit');
  await expect(page.getByText('3 attempts across 3 topics.')).toBeVisible();
});

test('@claim:csv-export exports one row per attempt', async ({ page }) => {
  await page.goto('/demo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadEvent;
  const csv = await readFile(await download.path(), 'utf8');
  const rows = csv.trim().split('\n');
  expect(rows).toHaveLength(4);
  expect(rows[0]).toContain('topic,problem,source');
  expect(csv).toContain('Dijkstra’s greedy step');
});

test('@claim:revision-history preserves earlier solutions', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('.history details')).toHaveCount(1);
  await page.getByLabel('Solution notes Markdown').fill('A revised cut argument with the boundary edge named first.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await expect(page.locator('.history details')).toHaveCount(2);
  await page.locator('.history details').first().getByText('Revision 2').click();
  await expect(page.getByText('Assume the extracted vertex')).toBeVisible();
});

test('@claim:json-revisions exports every saved revision', async ({ page }) => {
  await page.goto('/demo');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const archive = JSON.parse(await readFile(await (await downloadEvent).path(), 'utf8')) as { attempts: Array<{ title: string; revisions: unknown[] }> };
  expect(archive.attempts).toHaveLength(3);
  expect(archive.attempts.find((attempt) => attempt.title === 'Uniform limit of continuous functions')?.revisions).toHaveLength(2);
});

test('@claim:print-index creates a mastery review sheet', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page).toHaveURL(/\/print\?demo=1$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mastery index');
  await expect(page.locator('tbody tr')).toHaveCount(3);
  await expect(page.getByText('not an accredited credential')).toBeVisible();
});

test('@claim:encrypted-backup uses AES-256-GCM and does not retain the password', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /Export encrypted backup/ }).click();
  const password = 'correct horse proof';
  await page.getByLabel('Password').fill(password);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted backup' }).click();
  const download = await downloadEvent;
  const bytes = new Uint8Array(await readFile(await download.path()));
  expect(new TextDecoder().decode(bytes.slice(0, 10))).toBe('PROOFBOOK1');
  expect(bytes.length).toBeGreaterThan(100);
  const baseKey = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: bytes.slice(10, 26), iterations: 250_000 }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const plaintext = await webcrypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(26, 38) }, key, bytes.slice(38));
  expect(new TextDecoder().decode(plaintext)).toContain('Dijkstra’s greedy step');
  expect(Buffer.from(bytes).toString('utf8')).not.toContain(password);
  await expect(page.getByLabel('Password')).toHaveValue('');
  const savedData = await page.evaluate(async () => new Promise<string>((resolve, reject) => {
    const request = indexedDB.open('proofbook-demo-v1');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('state', 'readonly');
      const entry = transaction.objectStore('state').get('proofbook');
      entry.onerror = () => reject(entry.error);
      entry.onsuccess = () => resolve(JSON.stringify({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), state: entry.result }));
    };
  }));
  expect(savedData).not.toContain(password);
});

test('@claim:demo-isolation never copies sample data into the real ledger', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved to your proofbook.')).toBeVisible();
  await expect(page.getByText('3 attempts across 3 topics.')).toBeVisible();
  await page.getByLabel('Solution notes Markdown').fill('A temporary demo-only note.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Solution notes Markdown')).toHaveValue(/Assume the extracted vertex/);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText('0 attempts across 0 topics.')).toBeVisible();
  await expect(page.getByText('Your attempts will appear here')).toBeVisible();
});

test('@claim:archive-tools-included makes every archive tool usable without checkout', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', (request) => outgoing.push(request.url()));
  await page.goto('/demo');
  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  expect((await readFile(await (await jsonDownload).path(), 'utf8')).includes('attempts')).toBe(true);
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await readFile(await (await csvDownload).path(), 'utf8')).includes('topic,problem')).toBe(true);
  await page.getByRole('button', { name: 'Export encrypted backup' }).click();
  await page.getByLabel('Password').fill('archive password');
  const backupDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download encrypted backup' }).click();
  expect((await readFile(await (await backupDownload).path())).length).toBeGreaterThan(100);
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page.getByRole('heading', { name: 'Mastery index' })).toBeVisible();
  expect(outgoing.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:cited-attempt persists source and reference in the editor and index', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add topic' }).click();
  await page.getByLabel('Topic name').fill('Topology');
  await page.getByLabel('Study goal').fill('Use quotient maps carefully.');
  await page.getByRole('button', { name: 'Add topic' }).last().click();
  await page.getByRole('button', { name: 'Record attempt' }).click();
  await page.getByLabel('Topic', { exact: true }).selectOption({ label: 'Topology' });
  await page.getByLabel('Problem title').fill('Show a quotient map is continuous');
  await page.getByLabel('Source', { exact: true }).fill('Munkres, Topology');
  await page.getByLabel('Problem reference').fill('Section 22, Exercise 4');
  await page.getByRole('button', { name: 'Start attempt' }).click();
  await page.getByRole('button', { name: 'Pause timer' }).click();
  await page.reload();
  await expect(page.locator('.source-line')).toContainText('Munkres, Topology');
  await expect(page.locator('.source-line')).toContainText('Section 22, Exercise 4');
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page.locator('tbody')).toContainText('Munkres, Topology');
  await expect(page.locator('tbody')).toContainText('Section 22, Exercise 4');
});

test('@claim:topics-and-goals persists a topic, its goal, and an assigned attempt', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add topic' }).click();
  await page.getByLabel('Topic name').fill('Combinatorics');
  await page.getByLabel('Study goal').fill('Build bijections before counting.');
  await page.getByRole('button', { name: 'Add topic' }).last().click();
  await page.getByRole('button', { name: 'Record attempt' }).click();
  await page.getByLabel('Topic', { exact: true }).selectOption({ label: 'Combinatorics' });
  await page.getByLabel('Problem title').fill('Count binary necklaces');
  await page.getByLabel('Source', { exact: true }).fill('Concrete Mathematics');
  await page.getByLabel('Problem reference').fill('Chapter 5');
  await page.getByRole('button', { name: 'Start attempt' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: /Combinatorics/ })).toBeVisible();
  await expect(page.getByText('Build bijections before counting.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Count binary necklaces' })).toBeVisible();
});

test('@claim:attempt-timer persists deterministic elapsed time to exports and print', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-08-28T12:00:00.000Z') });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start timer' }).click();
  await page.clock.fastForward(65_000);
  await page.getByRole('button', { name: 'Pause timer' }).click();
  await expect(page.locator('[data-timer-display]')).toHaveText('33:05');
  await page.reload();
  await expect(page.locator('[data-timer-display]')).toHaveText('33:05');
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect(await readFile(await (await csvDownload).path(), 'utf8')).toContain('"1985"');
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page.locator('tbody')).toContainText('33:05');
});

test('@claim:evidence-status persists learner-set evidence and confidence', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Evidence status').selectOption('mastered');
  await page.getByRole('radio', { name: '4' }).focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await page.reload();
  await expect(page.getByLabel('Evidence status')).toHaveValue('mastered');
  await expect(page.getByRole('radio', { name: '4' })).toBeChecked();
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page.locator('tbody')).toContainText('Mastered · 4/4');
});

test('@claim:json-complete-archive restores all local proofbook data', async ({ page }) => {
  await page.goto('/demo');
  const originalDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const originalPath = await (await originalDownload).path();
  const original = JSON.parse(await readFile(originalPath!, 'utf8'));
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page.getByText('0 attempts across 0 topics.')).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#import-file').setInputFiles(originalPath!);
  await expect(page.getByText('Archive imported.')).toBeVisible();
  const restoredDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const restored = JSON.parse(await readFile(await (await restoredDownload).path(), 'utf8'));
  const { updatedAt: _originalUpdatedAt, ...originalContents } = original;
  const { updatedAt: _restoredUpdatedAt, ...restoredContents } = restored;
  expect(restoredContents).toEqual(originalContents);
});

test('@claim:no-credential-service marks the printed record as a non-credential', async ({ page }) => {
  const outgoing: string[] = [];
  page.on('request', (request) => outgoing.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Print mastery index' }).click();
  await expect(page.getByText('This learner-maintained record is not an accredited credential.')).toBeVisible();
  expect(outgoing.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('demo supports keyboard-sized mobile use and has no Axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('all public routes have no Axe violations', async ({ page }) => {
  for (const route of ['/', '/demo', '/app', '/print?demo=1', '/privacy', '/terms', '/not-a-proofbook-route']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('demo remains usable with a keyboard', async ({ page }) => {
  await page.goto('/demo');
  // A fresh document navigation starts before the shell's first tabbable item;
  // otherwise the initial H1 focus would bypass the skip link.
  await expect.poll(() => page.evaluate(() => document.activeElement === document.body)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('button', { name: 'Save revision' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByText('Revision saved.')).toBeVisible();
});

test('landing page has one h1, working routes, and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Self-Study Proofbook');
  expect(errors).toEqual([]);
});

test('static delivery makes hashed assets immutable and unknown routes real 404s', async ({ page, request }) => {
  await page.goto('/');
  const script = await page.locator('script[type="module"]').getAttribute('src');
  expect(script).toMatch(/^\/assets\/index-[\w-]+\.js$/);
  const asset = await request.get(script!);
  expect(asset.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  const missing = await page.goto('/not-a-proofbook-route');
  expect(missing?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Self-Study Proofbook');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is outside the ledger');
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://self-study-proofbook.sociobot.in/404');
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
});
