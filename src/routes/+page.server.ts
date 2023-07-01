import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import crypto from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import { createId } from '@paralleldrive/cuid2';
import redis from '$lib/server/redis';

export const actions: Actions = {
  default: async ({ request }) => {
    const body = await request.formData();

    let content = body.get('content');
    const destroyAfterDays = Number(body.get('destroy')?.toString());
    const destroyAfterRead = body.has('read');

    if (
      !content?.length ||
      typeof content !== 'string' ||
      content.length > 1024 * 32 ||
      !destroyAfterDays ||
      destroyAfterDays > 30
    )
      return fail(400, { message: 'Invalid request' });

    const alreadyEncryped = body.has('encrypted');
    let key: string | undefined;
    if (!alreadyEncryped) {
      key = Base64.stringify(crypto.lib.WordArray.random(32));
      content = crypto.AES.encrypt(content, key).toString();
    }

    let id = createId();

    await redis.set(
      `note:${id}`,
      JSON.stringify({
        content,
        destroyAfterDays,
        destroyAfterRead,
        created: Date.now()
      }),
      'EX',
      destroyAfterDays * 24 * 60 * 60
    );

    return { id, key };
  }
};
