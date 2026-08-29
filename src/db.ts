import { sampleState } from './sample';
import type { ProofbookState } from './types';
import { validateArchive } from './schema';

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
      return { state: validateArchive(saved), recovered: false };
    } catch {
      const initial = demo ? structuredClone(sampleState) : EMPTY_STATE();
      // A legacy malformed import must not blank the app forever. Keep the
      // original payload under a recovery key before restoring a usable ledger.
      await saveRecoveryAndInitialState(demo, saved, initial);
      return { state: initial, recovered: true };
    }
  }
  const initial = demo ? structuredClone(sampleState) : EMPTY_STATE();
  await saveState(demo, initial);
  return { state: initial, recovered: false };
}

export async function saveState(demo: boolean, state: ProofbookState): Promise<void> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', 'readwrite');
    tx.objectStore('state').put(state, 'proofbook');
    tx.oncomplete = () => { db.close(); resolve(); };
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
