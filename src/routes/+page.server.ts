import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createId } from '@paralleldrive/cuid2';
import redis from '$lib/server/redis';
import { maxContentLength, maxDays } from '$lib/server/config';
import msgpack from "@msgpack/msgpack";
import { encryptNote } from '$lib';

export const load: PageServerLoad = () => ({ maxContentLength });

export const actions: Actions = {
  default: async ({ request }) => {
    const body = await request.formData();

    let content = body.get('content');
    const destroyAfterDays = Number(body.get('destroy')?.toString());
    const destroyAfterRead = body.has('read');

    if (
      !content ||
      (content instanceof File ? content.size > maxContentLength : content.length > maxContentLength) ||
      !destroyAfterDays ||
      destroyAfterDays > maxDays
    )
      return error(400, { message: 'Invalid request' });

    let key, data;
    if (content instanceof File) {
      data = await content.arrayBuffer();
    } else {
      const note = await encryptNote(content);
      key = note.key;
      data = note.encrypted;
    }

    let id = createId();

    await redis.set(
      `note:${id}`,
      Buffer.from(msgpack.encode({
        content: new Uint8Array(data),
        destroyAfterDays,
        destroyAfterRead,
        created: Date.now()
      })),
      'EX',
      destroyAfterDays * 24 * 60 * 60
    );

    return { id, key };
  }
};
