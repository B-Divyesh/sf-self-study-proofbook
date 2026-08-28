import { sampleState } from './sample';
import type { ProofbookState } from './types';

const EMPTY_STATE = (): ProofbookState => ({ topics: [], attempts: [], selectedAttemptId: null, updatedAt: new Date().toISOString() });

function openDb(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(demo ? 'proofbook-demo-v1' : 'proofbook-v1', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readRaw(demo: boolean): Promise<ProofbookState | undefined> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', 'readonly');
    const request = tx.objectStore('state').get('proofbook');
    request.onsuccess = () => resolve(request.result as ProofbookState | undefined);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function loadState(demo: boolean): Promise<ProofbookState> {
  const saved = await readRaw(demo);
  if (saved) return saved;
  const initial = demo ? structuredClone(sampleState) : EMPTY_STATE();
  await saveState(demo, initial);
  return initial;
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
