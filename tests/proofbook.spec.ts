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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record and review problem attempts.');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record and review problem attempts.');
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
  await page.getByLabel('Password', { exact: true }).fill(password);
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
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue('');
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
  await page.goto('/');
  await expect(page.getByText('Free in this release; no checkout')).toBeVisible();
  await expect(page.locator('a[href*="/checkout"], [data-license]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/?\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Self-Study Proofbook');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record and review problem attempts.');
  await expect(page.getByText('Demo — sample data, nothing is saved to your proofbook.')).toBeVisible();
  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  expect((await readFile(await (await jsonDownload).path(), 'utf8')).includes('attempts')).toBe(true);
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await readFile(await (await csvDownload).path(), 'utf8')).includes('topic,problem')).toBe(true);
  await page.getByRole('button', { name: 'Export encrypted backup' }).click();
  await page.getByLabel('Password', { exact: true }).fill('archive password');
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

test('@claim:safe-import-validation rejects malformed imports before replacing a real ledger', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add topic' }).click();
  await page.getByLabel('Topic name').fill('Recovery checks');
  await page.getByLabel('Study goal').fill('Keep working records when imports fail.');
  await page.getByRole('button', { name: 'Add topic' }).last().click();
  await page.getByRole('button', { name: 'Record attempt' }).click();
  await page.getByLabel('Topic', { exact: true }).selectOption({ label: 'Recovery checks' });
  await page.getByLabel('Problem title').fill('Retain the valid ledger');
  await page.getByLabel('Source', { exact: true }).fill('Proofbook recovery test');
  await page.getByLabel('Problem reference').fill('Case 1');
  await page.getByRole('button', { name: 'Start attempt' }).click();

  const baselineDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const baseline = JSON.parse(await readFile(await (await baselineDownload).path(), 'utf8'));
  const malformedCases = [
    ['topic', (archive: any) => { archive.topics[0].name = '   '; }],
    ['attempt', (archive: any) => { archive.attempts[0].status = 'certified'; }],
    ['revision', (archive: any) => { archive.attempts[0].revisions.push({ id: 'bad-revision', at: 'not-a-date', solution: '', reflection: '' }); }],
    ['value', (archive: any) => { archive.attempts[0].elapsedSeconds = -1; }],
    ['reference', (archive: any) => { archive.attempts[0].topicId = 'missing-topic'; }],
  ] as const;
  let confirmationCount = 0;
  page.on('dialog', (dialog) => { confirmationCount += 1; void dialog.dismiss(); });
  for (const [name, damage] of malformedCases) {
    const malformed = structuredClone(baseline);
    damage(malformed);
    await page.locator('#import-file').setInputFiles({
      name: `malformed-${name}.json`,
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(malformed)),
    });
    await expect(page.getByText(/This archive is invalid.*current proofbook was not changed/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Retain the valid ledger' })).toBeVisible();
  }
  expect(confirmationCount).toBe(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Retain the valid ledger' })).toBeVisible();
  await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();
  const afterDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  expect(JSON.parse(await readFile(await (await afterDownload).path(), 'utf8'))).toEqual(baseline);
});

for (const requiredField of [
  { label: 'Topic name', action: 'Add topic' },
  { label: 'Problem title', action: 'Start attempt' },
  { label: 'Source', action: 'Start attempt' },
  { label: 'Problem reference', action: 'Start attempt' },
] as const) {
  test(`rejects whitespace-only ${requiredField.label.toLowerCase()} before persistence and preserves the real ledger`, async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: 'Add topic' }).click();
    await page.getByLabel('Topic name').fill('Valid topic');
    await page.getByLabel('Study goal').fill('Keep this valid ledger.');
    await page.getByRole('button', { name: 'Add topic' }).last().click();
    await page.getByRole('button', { name: 'Record attempt' }).click();
    await page.getByLabel('Problem title').fill('Valid problem');
    await page.getByLabel('Source', { exact: true }).fill('Valid source');
    await page.getByLabel('Problem reference').fill('Valid reference');
    await page.getByRole('button', { name: 'Start attempt' }).click();
    await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();

    if (requiredField.label === 'Topic name') {
      await page.getByRole('button', { name: 'Add topic' }).click();
    } else {
      await page.getByRole('button', { name: 'Record attempt' }).click();
      await page.getByLabel('Problem title').fill('Another valid problem');
      await page.getByLabel('Source', { exact: true }).fill('Another valid source');
      await page.getByLabel('Problem reference').fill('Another valid reference');
    }
    await page.getByLabel(requiredField.label, { exact: true }).fill('   ');
    expect(await page.getByLabel(requiredField.label, { exact: true }).evaluate((input) => input.checkValidity())).toBe(true);
    await page.getByRole('button', { name: requiredField.action }).last().click();

    await expect(page.getByLabel(requiredField.label, { exact: true })).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText(`${requiredField.label} cannot be blank.`)).toBeVisible();
    await expect(page.locator('#toast')).toBeHidden();
    await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Valid problem' })).toBeVisible();
    await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();
  });
}

test('recovers a legacy malformed persisted archive into a usable ledger', async ({ page }) => {
  await page.goto('/app');
  await page.evaluate(async () => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('proofbook-v1');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('state', 'readwrite');
      transaction.objectStore('state').put({ topics: [], attempts: [{}] }, 'proofbook');
      transaction.oncomplete = () => { request.result.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  }));
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record and review problem attempts.');
  await expect(page.getByText('0 attempts across 0 topics.')).toBeVisible();
  await expect(page.locator('#toast')).toContainText('A damaged saved copy was kept.');
  await expect(page.getByRole('heading', { name: 'Recovery copies' })).toBeVisible();
  const recoveryStored = await page.evaluate(async () => new Promise<boolean>((resolve, reject) => {
    const request = indexedDB.open('proofbook-v1');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction('state', 'readonly');
      const keys = transaction.objectStore('state').getAllKeys();
      keys.onsuccess = () => { request.result.close(); resolve(keys.result.some((key) => String(key).startsWith('recovery-'))); };
      keys.onerror = () => reject(keys.error);
    };
  }));
  expect(recoveryStored).toBe(true);
});

test('@claim:saved-data-recovery keeps valid records usable and the original available', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add topic' }).click();
  await page.getByLabel('Topic name').fill('Preserved topic');
  await page.getByRole('button', { name: 'Add topic' }).last().click();
  await page.getByRole('button', { name: 'Record attempt' }).click();
  await page.getByLabel('Problem title').fill('Preserved attempt');
  await page.getByLabel('Source', { exact: true }).fill('Recovery source');
  await page.getByLabel('Problem reference').fill('Recovery case');
  await page.getByRole('button', { name: 'Start attempt' }).click();
  await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();

  const expectedDamaged = await page.evaluate(async () => new Promise<Record<string, unknown>>((resolve, reject) => {
    const request = indexedDB.open('proofbook-v1');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const read = database.transaction('state', 'readonly').objectStore('state').get('proofbook');
      read.onerror = () => reject(read.error);
      read.onsuccess = () => {
        const damaged = structuredClone(read.result);
        damaged.topics.push({ id: 'topic-damaged', name: '   ', goal: '' });
        const write = database.transaction('state', 'readwrite');
        write.objectStore('state').put(damaged, 'proofbook');
        write.oncomplete = () => { database.close(); resolve(damaged); };
        write.onerror = () => reject(write.error);
      };
    };
  }));
  await page.reload();

  await expect(page.getByRole('heading', { name: 'Preserved attempt' })).toBeVisible();
  await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recovery copies' })).toBeVisible();
  await page.getByLabel('Solution notes Markdown').fill('The recovered record is still editable.');
  await page.getByRole('button', { name: 'Save revision' }).click();
  await expect(page.getByText('Revision saved.')).toBeVisible();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download original' }).click();
  const damaged = JSON.parse(await readFile(await (await downloadEvent).path(), 'utf8'));
  expect(damaged).toEqual(expectedDamaged);

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Restore valid records' }).click();
  await expect(page.locator('#toast')).toContainText('Valid records were restored.');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Preserved attempt' })).toBeVisible();
  await expect(page.getByLabel('Solution notes Markdown')).toHaveValue('');
});

test('UI limits match archive validation, accept exact maxima, and reject overlong notes before writing', async ({ page }) => {
  await page.goto('/app');
  await page.getByRole('button', { name: 'Add topic' }).click();
  const topicName = 'T'.repeat(60);
  const topicGoal = 'G'.repeat(140);
  await expect(page.getByLabel('Topic name')).toHaveAttribute('maxlength', '60');
  await expect(page.getByLabel('Study goal')).toHaveAttribute('maxlength', '140');
  await page.getByLabel('Topic name').fill(topicName);
  await page.getByLabel('Study goal').fill(topicGoal);
  await page.getByRole('button', { name: 'Add topic' }).last().click();

  await page.getByRole('button', { name: 'Record attempt' }).click();
  const title = 'P'.repeat(100);
  const source = 'S'.repeat(120);
  const reference = 'R'.repeat(100);
  const sourceUrl = `https://example.com/${'u'.repeat(2_028)}`;
  for (const [label, maximum] of [['Problem title', 100], ['Source', 120], ['Problem reference', 100], ['Source link Optional', 2_048]] as const) {
    await expect(page.getByLabel(label, { exact: true })).toHaveAttribute('maxlength', String(maximum));
  }
  await page.getByLabel('Problem title').fill(title);
  await page.getByLabel('Source', { exact: true }).fill(source);
  await page.getByLabel('Problem reference').fill(reference);
  await page.getByLabel('Source link Optional', { exact: true }).fill(sourceUrl);
  await page.getByRole('button', { name: 'Start attempt' }).click();
  await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();

  const maximumNotes = 'N'.repeat(100_000);
  await expect(page.getByLabel('Solution notes Markdown')).toHaveAttribute('maxlength', '100000');
  await expect(page.getByLabel('What changed or remains uncertain?')).toHaveAttribute('maxlength', '100000');
  await page.getByLabel('Solution notes Markdown').fill(maximumNotes);
  await page.getByLabel('What changed or remains uncertain?').fill(maximumNotes);
  await page.getByRole('button', { name: 'Save revision' }).click();
  await page.reload();
  await expect(page.getByLabel('Solution notes Markdown')).toHaveValue(maximumNotes);
  await expect(page.getByLabel('What changed or remains uncertain?')).toHaveValue(maximumNotes);

  await page.getByLabel('Solution notes Markdown').evaluate((control, value) => {
    control.removeAttribute('maxlength');
    control.value = value;
    control.dispatchEvent(new Event('input', { bubbles: true }));
  }, `${maximumNotes}X`);
  await page.getByRole('button', { name: 'Save revision' }).click();
  await expect(page.getByLabel('Solution notes Markdown')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Solution notes must be 100,000 characters or fewer.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Solution notes Markdown')).toHaveValue(maximumNotes);

  await page.getByLabel('What changed or remains uncertain?').evaluate((control, value) => {
    control.removeAttribute('maxlength');
    control.value = value;
    control.dispatchEvent(new Event('input', { bubbles: true }));
  }, `${maximumNotes}X`);
  await page.getByRole('button', { name: 'Save revision' }).click();
  await expect(page.getByLabel('What changed or remains uncertain?')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Reflection must be 100,000 characters or fewer.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('What changed or remains uncertain?')).toHaveValue(maximumNotes);

  await page.getByRole('button', { name: 'Record attempt' }).click();
  await page.getByLabel('Problem title').fill('Still valid');
  await page.getByLabel('Source', { exact: true }).fill('Still valid');
  await page.getByLabel('Problem reference').fill('Still valid');
  await page.getByLabel('Source link Optional', { exact: true }).evaluate((control, value) => {
    control.removeAttribute('maxlength');
    control.value = value;
    control.dispatchEvent(new Event('input', { bubbles: true }));
  }, `${sourceUrl}X`);
  await page.getByRole('button', { name: 'Start attempt' }).click();
  await expect(page.getByLabel('Source link Optional', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Source link must be 2,048 characters or fewer.')).toBeVisible();
  await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('1 attempt across 1 topic.')).toBeVisible();
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

test('all modal dialogs expose purpose-specific accessible names', async ({ page }) => {
  await page.goto('/demo');

  for (const dialogCase of [
    { opener: 'Add topic', name: 'Add a topic' },
    { opener: 'Record attempt', name: 'Record an attempt' },
    { opener: 'Export encrypted backup', name: 'Password-protect this backup' },
  ]) {
    await page.getByRole('button', { name: dialogCase.opener, exact: true }).click();
    const dialog = page.getByRole('dialog', { name: dialogCase.name, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(dialogCase.name);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  }
});

test('persistent mobile demo controls and navigation targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const control of [
    page.getByRole('button', { name: 'Reset demo' }),
    page.getByRole('button', { name: 'Start for real' }),
    page.getByRole('link', { name: 'Self-Study Proofbook home' }),
    page.getByRole('link', { name: 'Demo', exact: true }),
    page.getByRole('link', { name: 'My proofbook', exact: true }),
    page.getByRole('link', { name: 'Privacy', exact: true }).first(),
    page.getByRole('link', { name: 'Privacy', exact: true }).last(),
    page.getByRole('link', { name: 'Terms', exact: true }),
    page.getByRole('link', { name: /Built by Param Factory/ }),
  ]) {
    const box = await control.boundingBox();
    expect(box, 'persistent control should be rendered').not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('all public routes have no Axe violations', async ({ page }) => {
  for (const route of ['/', '/demo', '/app', '/print?demo=1', '/privacy', '/terms', '/not-a-proofbook-route']) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('route names and landing sections use direct, useful wording', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record problems you can solve');
  await expect(page.locator('.section-index, .paid-price')).toHaveCount(0);
  await expect(page.locator('footer')).toContainText('Private records for math and CS self-study.');
  await expect(page.locator('footer .build')).toHaveText('Version 1.0.1');

  for (const route of ['/demo', '/app']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record and review problem attempts.');
  }

  for (const [route, heading] of [
    ['/privacy', 'Privacy and data storage'],
    ['/terms', 'Terms of use'],
    ['/not-a-proofbook-route', 'Page not found'],
  ]) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toContain(heading);
    expect(await page.locator('meta[name="twitter:title"]').getAttribute('content')).toContain(heading);
  }
});

test('documents the free release without exposing internal billing instructions', async ({ page }) => {
  const brief = JSON.parse(await readFile('.factory/brief.json', 'utf8')) as { monetization: string; release_scope_decision: string };
  const readme = await readFile('README.md', 'utf8');
  expect(brief.monetization).toBe('one-time');
  expect(brief.release_scope_decision).toContain('deliberately ships every feature free');
  expect(readme).toContain('This release is free. It has no checkout or license requirement.');
  expect(readme).not.toContain('researched business model');
  expect(readme).not.toContain('Sociobot billing product');
  expect(readme).not.toContain('register and verify the hosted checkout');
  await page.goto('/');
  await expect(page.getByText('Free in this release; no checkout')).toBeVisible();
  await expect(page.locator('a[href*="/checkout"], [data-license]')).toHaveCount(0);
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
  await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy and data storage — Self-Study Proofbook');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('.route-status')).toHaveText('Privacy and data storage');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Record problems you can solve');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('.route-status')).toHaveText('Record problems you can solve');
  expect(errors).toEqual([]);
});

test('built deep links carry their own metadata before JavaScript runs', async ({ request }) => {
  for (const [route, title, description] of [
    ['/app', 'Your proofbook — Self-Study Proofbook', 'Write and review your private problem-solving record.'],
    ['/demo', 'Demo — Self-Study Proofbook', 'Try a sample proofbook without saving to your real records.'],
    ['/print', 'Mastery index — Self-Study Proofbook', 'Print a compact index of your problem-solving evidence.'],
    ['/privacy', 'Privacy and data storage — Self-Study Proofbook', 'How Self-Study Proofbook stores and handles your data.'],
    ['/terms', 'Terms of use — Self-Study Proofbook', 'Terms for using Self-Study Proofbook.'],
  ]) {
    const response = await request.get(route);
    const document = await response.text();
    expect(response.status()).toBe(200);
    expect(document).toContain(`<title>${title}</title>`);
    expect(document).toContain(`https://self-study-proofbook.sociobot.in${route}`);
    expect(document).toContain(description);
  }
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://self-study-proofbook.sociobot.in/404');
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
});
