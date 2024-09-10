import { Buffer } from "buffer";

export const decryptNote = async (data: string | Uint8Array, key: string | Uint8Array) => {
  if (typeof key === 'string') key = new Uint8Array(Buffer.from(key, 'base64'));
  if (typeof data === 'string') data = new Uint8Array(Buffer.from(data, 'base64'));

  return await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: key.subarray(0, 16)
    },
    await crypto.subtle.importKey('raw', key.subarray(16), 'AES-CBC', false, ['decrypt']),
    data
  ).then((decrypted) => new TextDecoder().decode(decrypted));
};

export const encryptNote = async (data: string | Uint8Array) => {
  if (typeof data === 'string') data = new TextEncoder().encode(data);

  const key = crypto.getRandomValues(new Uint8Array(32 + 16));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: key.subarray(0, 16)
    },
    await crypto.subtle.importKey('raw', key.subarray(16), 'AES-CBC', false, ['encrypt']),
    data
  );

  return { encrypted, key: Buffer.from(key).toString('base64') };
}