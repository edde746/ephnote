import redis from '$lib/server/redis';
import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';
import crypto from 'crypto-js';

type Note = {
  content: string;
  destroyAfterDays: number;
  destroyAfterRead: boolean;
  created: number;
};

export const load: PageServerLoad = async ({ params, url, request }) => {
  if (request.method === 'POST') return;

  const note = (await redis.get(`note:${params.note}`).then((note) => {
    if (!note) return null;
    return JSON.parse(note);
  })) as Note | null;

  if (!note) throw error(404, 'Note not found');

  if (note.destroyAfterRead) await redis.del(`note:${params.note}`);
  return { ...note };
};

export const actions: Actions = {
  decrypt: async ({ request }) => {
    const body = await request.formData();

    const content = body.get('content')?.toString();
    const url = body.get('url')?.toString();
    if (!content || !url) return fail(400, { message: 'Invalid request' });

    const key = url.split('#').pop();
    if (!key) return fail(400, { message: 'Invalid URL' });

    const decrypted = crypto.AES.decrypt(content, key).toString(crypto.enc.Utf8);
    if (!decrypted) return fail(400, { message: 'Invalid key' });

    return { decrypted };
  }
};
