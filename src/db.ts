import { sampleState } from './sample';
import type { ProofbookState } from './types';
import { recoverArchive, validateArchive } from './schema';

const EMPTY_STATE = (): ProofbookState => ({ topics: [], attempts: [], selectedAttemptId: null, updatedAt: new Date().toISOString() });

function openDb(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(demo ? 'proofbook-demo-v1' : 'proofbook-v1', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readRaw(demo: boolean): Promise<unknown> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', 'readonly');
    const request = tx.objectStore('state').get('proofbook');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export interface LoadedState {
  state: ProofbookState;
  recovered: boolean;
  droppedTopics: number;
  droppedAttempts: number;
}

export interface RecoveryRecord {
  key: string;
  value: unknown;
}

async function saveRecoveryAndInitialState(demo: boolean, damaged: unknown, initial: ProofbookState): Promise<void> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', 'readwrite');
    const store = tx.objectStore('state');
    store.put(damaged, `recovery-${new Date().toISOString()}`);
    store.put(initial, 'proofbook');
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadState(demo: boolean): Promise<LoadedState> {
  const saved = await readRaw(demo);
  if (saved !== undefined) {
    try {
      return { state: validateArchive(saved), recovered: false, droppedTopics: 0, droppedAttempts: 0 };
    } catch {
      const recovered = recoverArchive(saved);
      // Keep the untouched payload under a visible recovery key before saving
      // the independently valid records that can still be used safely.
      await saveRecoveryAndInitialState(demo, saved, recovered.state);
      return { ...recovered, recovered: true };
    }
  }
  const initial = demo ? structuredClone(sampleState) : EMPTY_STATE();
  await saveState(demo, initial);
  return { state: initial, recovered: false, droppedTopics: 0, droppedAttempts: 0 };
}

export async function saveState(demo: boolean, state: ProofbookState): Promise<ProofbookState> {
  // This is the final write boundary. No caller, import path, or future UI can
  // replace the last valid ledger with a state the app cannot read back.
  const validated = validateArchive(state);
  const db = await openDb(demo);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('state', 'readwrite');
    tx.objectStore('state').put(validated, 'proofbook');
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => reject(tx.error);
  });
  return validated;
}

export async function listRecoveryRecords(demo: boolean): Promise<RecoveryRecord[]> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', 'readonly');
    const store = tx.objectStore('state');
    const keys = store.getAllKeys();
    const values = store.getAll();
    tx.oncomplete = () => {
      db.close();
      const records = keys.result
        .map((key, index) => ({ key: String(key), value: values.result[index] }))
        .filter((entry) => entry.key.startsWith('recovery-'))
        .sort((a, b) => b.key.localeCompare(a.key));
      resolve(records);
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function resetDemo(): Promise<ProofbookState> {
  const state = structuredClone(sampleState);
  await saveState(true, state);
  return state;
}

export async function clearDemo(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('proofbook-demo-v1');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}
