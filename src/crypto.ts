export async function encryptArchive(data: string, password: string): Promise<Blob> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 250_000 },
    baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt'],
  );
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(data));
  return new Blob([encoder.encode('PROOFBOOK1'), salt, iv, new Uint8Array(ciphertext)], { type: 'application/octet-stream' });
}

export async function decryptArchive(buffer: ArrayBuffer, password: string): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder();
  if (decoder.decode(bytes.slice(0, 10)) !== 'PROOFBOOK1') throw new Error('This is not a Proofbook archive.');
  const salt = bytes.slice(10, 26);
  const iv = bytes.slice(26, 38);
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 250_000 },
    baseKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
  );
  try {
    return decoder.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, bytes.slice(38)));
  } catch {
    throw new Error('The password did not open this archive.');
  }
}
