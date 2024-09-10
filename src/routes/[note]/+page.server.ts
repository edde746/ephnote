import redis from '$lib/server/redis';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import msgpack from "@msgpack/msgpack";
import { decryptNote } from '$lib';

type Note = {
  content: Buffer;
  destroyAfterDays: number;
  destroyAfterRead: boolean;
  created: number;
};

export const load: PageServerLoad = async ({ params, url, request }) => {
  if (request.method === 'POST') return;
  const key = `note:${params.note}`;

  const note = (await redis.getBuffer(key).then((note) => {
    if (!note) error(404, 'Note not found');
    return msgpack.decode(note);
  })) as Note;

  if (note.destroyAfterRead) {
    if (url.searchParams.has('read')) await redis.del(key);
    else return { destroyAfterRead: true };
  }

  return { ...note, content: note.content.toString('base64url') };
};

export const actions: Actions = {
  decrypt: async ({ request, params }) => {
    const body = await request.formData();

    const url = body.get('url')?.toString();
    if (!url) error(400, 'Invalid request');

    const key = url.split('#').pop();
    if (!key) error(400, 'Invalid URL');

    const note = (await redis.getBuffer(`note:${params.note}`).then((note) => {
      if (!note) error(404, 'Note not found');
      return msgpack.decode(note) as Note;
    }).then(async (note) => ({
      ...note, content: await decryptNote(note.content, key)
    })));

    if (note.destroyAfterRead) await redis.del(`note:${params.note}`);

    return { decrypted: note.content };
  }
};
